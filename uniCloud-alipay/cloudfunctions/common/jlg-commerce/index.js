'use strict';
const M = require('./model');
const F = require('./freight');
const GOODS = 'opendb-mall-goods';
const ORDERS = 'uni-pay-orders';
const COUPONS = 'jlg-goods-coupon';
const { getDocument: get, findDocuments } = require('./db');
async function transaction(db, work) {
  // A failed transaction is never retried across an external payment request.
  const tx = await db.startTransaction();
  try { const result = await work(tx); await tx.commit(); return result; }
  catch (error) {
    // The Aliyun SDK marks a transaction committed before the commit request resolves.
    // Preserve the original conflict/network error if rollback is no longer allowed.
    try { await tx.rollback(); } catch (_) {}
    throw error;
  }
}
function createCommerce(db) {
  async function discount(tx, uid, lines, requested) {
    let original = lines.reduce((n, line) => n + line.goods_price * line.goods_num, 0);
    M.integer(original, '商品金额', 1);
    let payable = original;
    const applied = [];
    const members = await findDocuments(db, tx, 'jlg-member', { user_id: uid });
    const member = members.find(item => item.failure_time > Date.now());
    if (member) {
      const params = (await findDocuments(db, tx, 'jlg-parameter', {}, 1))[0];
      const level = member.grade === 0 ? 'svip' : 'vip';
      const rate = params && params[level + '_price'];
      M.integer(rate, '会员折扣', 1);
      if (rate > 100) M.fail('会员折扣配置无效');
      payable = Math.round(original * rate / 100);
      applied.push({ id: level, name: level.toUpperCase() + '会员折扣' });
    }
    if (!Array.isArray(requested || []) || (requested || []).length > 10) M.fail('优惠券数量无效', 'COUPON_INVALID');
    const ids = (requested || []).filter(item => item.id !== 'vip' && item.id !== 'svip').map(item => item.id);
    if (ids.length !== new Set(ids).size) M.fail('优惠券重复', 'COUPON_INVALID');
    const rules = [];
    for (const id of ids) {
      const coupon = await get(tx, COUPONS, id);
      if (!coupon || coupon.user_id !== uid || coupon.is_use) M.fail('优惠券不可用', 'COUPON_INVALID');
      const rule = await get(tx, 'jlg-goods-couponrule', coupon.coupon_id);
      const now = Date.now();
      if (!rule || rule.state !== '已发放' || rule.start_time > now || rule.end_time <= now) M.fail('优惠券已失效', 'COUPON_INVALID');
      if (rule.user_type === '指定用户' && !(rule.user_arr || []).includes(uid)) M.fail('优惠券不适用于当前用户', 'COUPON_INVALID');
      const eligible = lines.filter(line => !line.goods_seckill && (rule.allow_type === '所有商品' || (rule.goods_arr || []).includes(line.goods_id)))
        .reduce((n, line) => n + line.goods_price * line.goods_num, 0);
      if (!eligible || eligible < rule.order_amount) M.fail('未满足优惠券使用条件', 'COUPON_INVALID');
      if (rule.type === '满减') payable -= M.integer(rule.price, '优惠金额');
      else if (rule.type === '折扣') {
        M.integer(rule.price, '优惠折扣', 1);
        if (rule.price > 100) M.fail('优惠券折扣无效', 'COUPON_INVALID');
        payable -= Math.round(eligible * (100 - rule.price) / 100);
      } else M.fail('优惠券类型无效', 'COUPON_INVALID');
      rules.push(rule);
      applied.push({ id, name: rule.name });
    }
    if (rules.length > 1 && rules.some(rule => !rule.is_share)) M.fail('所选优惠券不能叠加', 'COUPON_INVALID');
    if (!Number.isSafeInteger(payable) || payable < 1) M.fail('优惠后金额无效，请调整优惠券', 'COUPON_INVALID');
    return { origprice: original, deduprice: original - payable, preferential: applied, payable };
  }
  async function selection(tx, input) {
      if (!Array.isArray(input.goods_arr) || !input.goods_arr.length || input.goods_arr.length > 20) M.fail('商品列表无效');
      const products = new Map();
      const lines = new Map();
      const cartIds = new Set();
      for (const line of input.goods_arr) {
        M.integer(line.goods_num, '购买数量', 1);
        if (!products.has(line.goods_id)) {
          const raw = await get(tx, GOODS, line.goods_id);
          if (!raw || raw.is_on_sale !== true) M.fail('商品已下架');
          if (raw.stock_version !== 1) M.fail('商品库存正在核对，请稍后购买', 'STOCK_NOT_MIGRATED');
          products.set(line.goods_id, M.normalize(raw));
        }
        const goods = products.get(line.goods_id);
        const seckill = line.goods_seckill === true;
        if (seckill && !goods.is_new) M.fail('秒杀活动已结束');
        const row = M.resolve(goods, { sku_id: line.sku_id, specs: line.goods_suk }, seckill);
        M.integer(row.price, '售价', 1);
        M.integer(row.inventory, '库存');
        if (row.inventory < line.goods_num) M.fail('库存不足，请调整购买数量', 'STOCK_INSUFFICIENT');
        row.inventory -= line.goods_num;
        const k = M.key([line.goods_id, seckill, row.sku_id]);
        if (lines.has(k)) lines.get(k).goods_num += line.goods_num;
        else lines.set(k, {
          goods_id: goods._id, sku_id: row.sku_id, goods_suk: M.copy(row.specs),
          goods_price: row.price, goods_num: line.goods_num, goods_seckill: seckill,
          goods_name: goods.name, goods_name_en: goods.name_en || goods.name,
          goods_img: row.goods_thumb || goods.goods_thumb
        });
        if (line.cart_id != null) {
          if (typeof line.cart_id !== 'string' || !line.cart_id || line.cart_id.length > 128 || cartIds.has(line.cart_id)) M.fail('购物袋条目无效，请重新选择');
          cartIds.add(line.cart_id);
          const cart = await get(tx, 'jlg-goods-cart', line.cart_id);
          if (!cart || cart.user_id !== input.user_id || cart.goods_id !== line.goods_id || (cart.goods_seckill === true) !== seckill) M.fail('购物袋商品已变化，请重新选择');
          if (!cart.goods_suk || M.resolve(goods, cart.goods_suk, seckill).sku_id !== row.sku_id) M.fail('购物袋规格已变化，请重新选择');
          const normalized = lines.get(k);
          if (!normalized.cart_sources) normalized.cart_sources = [];
          normalized.cart_sources.push({ id: cart._id, quantity: line.goods_num, create_date: cart.create_date == null ? null : cart.create_date, specs: M.copy(cart.goods_suk.specs || []) });
        }
      }
      const goods_arr = [...lines.values()];
      return { products, goods_arr };
  }
  async function priced(tx, input, selected) {
    const { products, goods_arr } = selected;
    const price = await discount(tx, input.user_id, goods_arr, input.preferential);
    const usesTemplate = [...products.values()].some(g => F.mode(g) === 'template');
    const modern = input.checkout_version === 1;
    if (usesTemplate && !modern) M.fail('请更新小程序后购买', 'CHECKOUT_UPDATE_REQUIRED');
    let address_snapshot = null;
    if (modern) address_snapshot = await F.address(db, tx, input.user_id, input.address_id);
    const freight_snapshot = await F.shipping(db, tx, goods_arr, products, address_snapshot || {});
    if (!freight_snapshot.deliverable) {
      const message = '以下商品暂不配送至该地区：' + freight_snapshot.blocked_goods.map(g => g.name).join('、');
      throw Object.assign(new Error(message), { errCode: 'NOT_DELIVERABLE', errMsg: message, blocked_goods: freight_snapshot.blocked_goods });
    }
    const freight = freight_snapshot.freight;
    const total_fee = F.money(price.payable + freight, 1);
    const quote_key = F.fingerprint({
      goods: goods_arr.slice().sort((a,b) => M.key([a.goods_id,a.sku_id,a.goods_seckill]).localeCompare(M.key([b.goods_id,b.sku_id,b.goods_seckill]))),
      address: address_snapshot, price: { ...price, preferential: price.preferential.slice().sort((a,b) => a.id.localeCompare(b.id)) }, freight_snapshot, total_fee
    });
    return { ...price, freight, total_fee, quote_key, address_snapshot, freight_snapshot, goods_arr, checkout_version: modern ? 1 : 0 };
  }
  async function quote(input) {
    if (!input.user_id) M.fail('请先登录', 'AUTH_REQUIRED');
    return transaction(db, async tx => priced(tx, { ...input, checkout_version: 1 }, await selection(tx, input)));
  }
  async function previewFreight(input) {
    return transaction(db, async tx => {
      const destination = input.address_id ? await F.address(db, tx, input.user_id, input.address_id) : await F.region(db, tx, input.area_code);
      const raw = await get(tx, GOODS, input.goods_id);
      if (!raw || !raw.is_on_sale) M.fail('商品已下架');
      const goods = M.normalize(raw);
      const known = !!input.sku_id || Array.isArray(input.goods_suk) && input.goods_suk.length > 0;
      let selected;
      if (known) selected = await selection(tx, { goods_arr: [{ goods_id: input.goods_id, sku_id: input.sku_id, goods_suk: input.goods_suk, goods_num: input.goods_num == null ? 1 : input.goods_num, goods_seckill: input.goods_seckill === true }] });
      else selected = { products: new Map([[goods._id, goods]]), goods_arr: [{ goods_id: goods._id, goods_price: 0, goods_num: 1 }] };
      const result = await F.shipping(db, tx, selected.goods_arr, selected.products, destination);
      const rule = result.groups[0];
      return { ...result, freight: known ? result.freight : null, exact: known, region_name: destination.region_name, area_code: destination.area_code, threshold: rule.threshold, remaining: known ? rule.remaining : null, base_fee: rule.fee };
    });
  }
  async function prepare(input) {
    if (!input.user_id) M.fail('请先登录', 'AUTH_REQUIRED');
    if (!/^[a-zA-Z0-9_-]{1,64}$/.test(input.out_trade_no || '') || !input.order_no) M.fail('订单号无效');
    const orderId = 'goods_' + require('crypto').createHash('sha256').update(input.out_trade_no).digest('hex').slice(0, 32);
    return transaction(db, async tx => {
      const existing = await get(tx, ORDERS, orderId) || (await findDocuments(db, tx, ORDERS, { out_trade_no: input.out_trade_no }, 1))[0];
      if (existing) {
        if (existing.user_id !== input.user_id || existing.type !== 'goods') M.fail('无权操作此订单', 'FORBIDDEN');
        if (existing.status !== 0 || existing.stock_state !== 'reserved' || existing.expires_at <= Date.now()) M.fail('订单已关闭、已支付或属于旧版，请重新下单');
        if (existing.provider !== input.provider) M.fail('请使用原支付方式，或取消订单后重新下单');
        if (input.total_fee !== existing.total_fee) M.fail('已创建订单的金额不能修改，请取消后重新下单', 'PRICE_CHANGED');
        if (existing.checkout_version === 1 && ((input.address_id && input.address_id !== existing.address_id) || (input.quote_key && input.quote_key !== existing.quote_key))) M.fail('请取消原订单后修改地址或优惠', 'PRICE_CHANGED');
        if (existing.checkout_version === 1 && input.preferential) {
          const ids = values => (values || []).filter(v => !['vip', 'svip'].includes(v.id)).map(v => v.id).sort();
          if (M.key(ids(input.preferential)) !== M.key(ids(existing.preferential))) M.fail('优惠已变化，请取消原订单后重新下单', 'PRICE_CHANGED');
        }
        if (input.goods_arr) {
          const requested = new Map();
          for (const line of input.goods_arr) {
            M.integer(line.goods_num, '购买数量', 1);
            const saved = existing.goods_arr.find(row => row.goods_id === line.goods_id && row.goods_seckill === (line.goods_seckill === true) && (line.sku_id ? row.sku_id === line.sku_id : M.key(row.goods_suk) === M.key(line.goods_suk)));
            if (!saved) M.fail('商品选择已变化，请取消原订单后重新下单');
            requested.set(saved.sku_id, (requested.get(saved.sku_id) || 0) + line.goods_num);
          }
          if (existing.goods_arr.some(row => requested.get(row.sku_id) !== row.goods_num)) M.fail('购买数量已变化，请取消原订单后重新下单');
        }

        return { ...input, ...existing, other: undefined, custom: undefined };
      }
      const sameBusinessOrder = (await findDocuments(db, tx, ORDERS, { order_no: input.order_no }, 1))[0];
      if (sameBusinessOrder) M.fail('该业务订单已有支付单，请使用原订单继续支付');
      const selected = await selection(tx, input);
      const { products, goods_arr } = selected;
      const price = await priced(tx, input, selected);
      const { freight, total_fee } = price;
      if (input.total_fee !== total_fee || price.checkout_version === 1 && input.quote_key !== price.quote_key) M.fail('商品、地址或运费规则已变化，请重新确认', 'PRICE_CHANGED');
      if (!price.checkout_version && (typeof input.address !== 'string' || !input.address.trim())) M.fail('请填写收货地址');
      for (const goods of products.values()) await tx.collection(GOODS).doc(goods._id).update({
        suks: goods.suks, fs_suks: goods.fs_suks, remain_count: M.available(goods), stock_version: 1
      });
      for (const coupon of price.preferential.filter(item => !['vip', 'svip'].includes(item.id))) {
        await tx.collection(COUPONS).doc(coupon.id).update({ is_use: true, reserved_order: input.out_trade_no });
      }
      const distribution = await findDocuments(db, tx, 'jlg-distribution', { user_arr: input.user_id }, 1);
      const order = {
        _id: orderId, user_id: input.user_id, type: 'goods', order_no: input.order_no,
        out_trade_no: input.out_trade_no, provider: input.provider, description: input.description,
        total_fee, origprice: price.origprice, deduprice: price.deduprice, freight,
        preferential: price.preferential, goods_arr,
        address: price.address_snapshot ? `${price.address_snapshot.name}；${price.address_snapshot.mobile}；${price.address_snapshot.region_name} ${price.address_snapshot.detail}` : input.address,
        ...(price.checkout_version ? { checkout_version: 1, quote_key: price.quote_key, address_id: input.address_id, address_snapshot: price.address_snapshot, freight_snapshot: price.freight_snapshot } : {}),
        notes: typeof input.notes === 'string' ? input.notes.slice(0, 1000) : '',
        is_distr: distribution.length > 0, audit_status: '审核中',
        status: 0, stock_version: 1, stock_state: 'reserved',
        create_date: Date.now(), expires_at: Date.now() + 24 * 3600 * 1000,
        refund_fee: 0, refund_count: 0, stock_refunded_fee: 0
      };
      await tx.collection(ORDERS).add(order);
      return { ...input, ...order, other: undefined, custom: undefined };
    });
  }
  async function settle(outTradeNo, totalFee, fields) {
    return transaction(db, async tx => {
      const order = (await findDocuments(db, tx, ORDERS, { out_trade_no: outTradeNo }, 1))[0];
      if (!order || order.stock_version !== 1) return null;
      if (order.total_fee !== Number(totalFee)) M.fail('支付金额不匹配', 'PAYMENT_MISMATCH');
      if (['paid', 'refunded'].includes(order.stock_state)) return order;
      if (order.stock_state !== 'reserved' || order.status !== 0) M.fail('支付与库存状态冲突，请人工核对', 'STOCK_CONFLICT');
      const quantities = new Map();
      for (const line of order.goods_arr) quantities.set(line.goods_id, (quantities.get(line.goods_id) || 0) + line.goods_num);
      for (const [goodsId, quantity] of quantities) await tx.collection(GOODS).doc(goodsId).update({ total_sell_count: db.command.inc(quantity) });
      // Only server-validated cart sources are consumed, atomically with payment settlement.
      // A deleted/re-added row may reuse its ID, so also compare its creation time.
      for (const line of order.goods_arr) for (const source of line.cart_sources || []) {
        const cart = await get(tx, 'jlg-goods-cart', source.id);
        if (!cart || cart.user_id !== order.user_id || cart.goods_id !== line.goods_id || (cart.goods_seckill === true) !== line.goods_seckill || (cart.create_date == null ? null : cart.create_date) !== source.create_date) continue;
        if (!cart.goods_suk || (cart.goods_suk.sku_id ? cart.goods_suk.sku_id !== line.sku_id : M.key(cart.goods_suk.specs) !== M.key(source.specs))) continue;
        if (!Number.isSafeInteger(cart.goods_number) || cart.goods_number < 1) continue;
        const remaining = cart.goods_number - source.quantity;
        if (remaining > 0) await tx.collection('jlg-goods-cart').doc(cart._id).update({ goods_number: remaining, modify_date: Date.now() });
        else await tx.collection('jlg-goods-cart').doc(cart._id).remove();
      }
      const cleanFields = Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined));
      const update = { ...cleanFields, stock_state: 'paid', status: 1, user_order_success: true };
      await tx.collection(ORDERS).doc(order._id).update(update);
      return { ...order, ...update };
    });
  }
  async function release(outTradeNo, unstartedOnly = false) {
    // Call only AFTER the payment provider has confirmed the order is closed.
    return transaction(db, async tx => {
      const order = (await findDocuments(db, tx, ORDERS, { out_trade_no: outTradeNo }, 1))[0];
      if (!order) M.fail('订单不存在');
      if (order.stock_state === 'released' || order.status === -1) return;
      if (order.status !== 0) M.fail('已付款订单不能取消');
      if (unstartedOnly && order.stock_payment_started) M.fail('支付请求已发出，请重新关单');
      const products = new Map();
      for (const line of order.goods_arr || []) {
        if (!products.has(line.goods_id)) products.set(line.goods_id, await get(tx, GOODS, line.goods_id));
        const goods = products.get(line.goods_id);
        if (!goods) M.fail('原商品不存在，不能自动恢复库存');
        if (order.stock_version === 1) {
          const row = (goods[line.goods_seckill ? 'fs_suks' : 'suks'] || []).find(row => row.sku_id === line.sku_id);
          if (!row) M.fail('原 SKU 不存在，不能自动恢复库存');
          row.inventory += line.goods_num;
        } else {
          // Legacy checkout only touched product counters; never add legacy quantities to SKU stock.
          goods.remain_count = (goods.remain_count || 0) + line.goods_num;
          goods.total_sell_count = Math.max(0, (goods.total_sell_count || 0) - line.goods_num);
        }
      }
      for (const goods of products.values()) await tx.collection(GOODS).doc(goods._id).update(order.stock_version === 1 ?
        { suks: goods.suks, fs_suks: goods.fs_suks, remain_count: M.available(goods) } :
        { remain_count: goods.remain_count, total_sell_count: goods.total_sell_count });
      for (const coupon of order.preferential || []) {
        if (['vip', 'svip'].includes(coupon.id)) continue;
        const saved = await get(tx, COUPONS, coupon.id);
        if (saved && saved.user_id === order.user_id && (saved.reserved_order === outTradeNo || (!saved.reserved_order && !order.stock_version)))
          await tx.collection(COUPONS).doc(coupon.id).update({ is_use: false, reserved_order: '' });
      }
      await tx.collection(ORDERS).doc(order._id).update({ status: -1, stock_state: 'released', cancel_date: Date.now() });
    });
  }
  async function saveGoods(input, uid) {
    if (input.patch) return require('./editor').createEditor(db, transaction).save(input, uid);
    return transaction(db, async tx => {
      const raw = input._id ? await get(tx, GOODS, input._id) : null;
      if (input._id && !raw) M.fail('商品不存在');
      if (raw && raw.deleted) M.fail('商品已删除，不能继续编辑');
      if (raw && raw.stock_version !== 1) {
        if (input.inventory_verified !== true) M.fail('请先核对实际可售库存并确认');
        const pending = await findDocuments(db, tx, ORDERS, { status: 0, 'goods_arr.goods_id': raw._id }, 1);
        if (pending.length) M.fail('存在未付款旧订单，请先关单，再核对实际可售库存');
      }
      const previous = raw ? M.normalize(raw) : { suks: [], fs_suks: [] };
      if (raw && JSON.stringify({ suks: previous.suks, fs_suks: previous.fs_suks }) !== JSON.stringify(input.stock_snapshot))
        M.fail('价格或库存已变化，请重新加载后修改', 'GOODS_CONFLICT');
      const fields = ['name', 'category_id', 'crossed_price', 'goods_services', 'freight', 'freight_amount', 'freight_mode', 'freight_template_id', 'goods_desc', 'goods_thumb', 'goods_banner_imgs', 'videos', 'is_on_sale', 'is_best', 'is_new', 'is_hot', 'vip_goods', 'orig_suks', 'orig_fs_suks'];
      const data = {};
      for (const field of fields) if (input[field] !== undefined) data[field] = M.copy(input[field]);
      for (const field of ['freight', 'is_on_sale', 'is_best', 'is_new', 'is_hot']) data[field] = data[field] === true;
      if (!data.name || !data.name.trim() || !data.category_id || !data.goods_thumb || !(data.goods_banner_imgs || []).length) M.fail('请填写名称、分类和商品图片');
      await require('./identity').assertNameChange(db, tx, raw, data.name);
      if (!Array.isArray(data.goods_banner_imgs) || data.goods_banner_imgs.length > 5 || !Array.isArray(data.goods_services)) M.fail('商品图片或服务格式无效');
      if (!Array.isArray(input.suks) || !input.suks.length || !Array.isArray(input.fs_suks)) M.fail('请填写商品规格');
      for (const field of ['suks', 'fs_suks']) {
        if (input[field].length > 200) M.fail('规格组合不能超过 200 个');
        // Physical SKU deletion needs a separate archival flow; retain identity for pending orders.
        if (previous[field].some(row => !input[field].some(item => item.sku_id === row.sku_id))) M.fail('已保存的 SKU 不能删除，请将库存设为 0');
        data[field] = M.mergeSkus(previous, input[field], field);
      }
      M.normalize({ ...data, _id: input._id || 'new' });
      for (const [field, origin] of [['suks', 'orig_suks'], ['fs_suks', 'orig_fs_suks']]) {
        const specs = data[origin] || [];
        if (data[field].length && (!specs.length || specs.some(spec => !spec.name || !Array.isArray(spec.values) || !spec.values.length || spec.values.some(value => !value.name || !value.name.trim()) || new Set(spec.values.map(value => value.name)).size !== spec.values.length))) M.fail('规格名称和值不能为空或重复');
        if (data[field].some(row => row.specs.length !== specs.length || row.specs.some((value, i) => !specs[i].values.some(item => item.name === value)))) M.fail('规格组合与规格选项不一致');
      }

      if (data.is_new && !data.fs_suks.length) M.fail('请填写秒杀规格');
      if (data.crossed_price != null) M.integer(data.crossed_price, '划线价');
      if (raw && raw.freight_mode && input.freight_mode === undefined) { data.freight_mode = raw.freight_mode; data.freight_template_id = raw.freight_template_id; }
      await F.bind(db, tx, raw, data);
      if (!data.freight) M.integer(data.freight_amount, '运费');
      else data.freight_amount = 0;
      data.remain_count = M.available(data);
      data.stock_version = 1;
      data.updated_at = Date.now();
      data.editor_revision = (raw && raw.editor_revision || 0) + 1;
      if (raw) {
        if (raw.total_sell_count == null) data.total_sell_count = 0;
        else M.integer(raw.total_sell_count, '历史销量');
        await tx.collection(GOODS).doc(raw._id).update(data); return { id: raw._id };
      }
      data.total_sell_count = 0;
      data.add_date = Date.now();
      return tx.collection(GOODS).add(data);
    });
  }
  async function goodsDetail(id) {
    const goods = await get(db, GOODS, id);
    if (!goods || goods.deleted) M.fail('商品不存在或已删除');
    return M.normalize({ goods_services: [], orig_suks: [], orig_fs_suks: [], videos: [], goods_banner_imgs: [], ...goods });
  }
  async function orderAction(uid, id, action, reason) {
    return transaction(db, async tx => {
      const order = await get(tx, ORDERS, id);
      if (!order || order.user_id !== uid) M.fail('无权操作此订单', 'FORBIDDEN');
      let patch;
      if (action === 'receipt' && order.status === 4) patch = { status: 5 };
      else if (action === 'evaluate' && order.status === 5) {
        const comments = await findDocuments(db, tx, 'opendb-mall-comments', { order_id: id, user_id: uid });
        if (!(order.goods_arr || []).every(line => comments.some(comment => comment.goods_id === line.goods_id && M.key(comment.goods_suk) === M.key(line.goods_suk)))) M.fail('请先完成商品评价');
        patch = { status: 7 };
      }
      else if (action === 'refund' && order.status === 1 && reason && reason.trim())
        patch = { status: 6, origstate: 1, refund_fee: order.total_fee, refund_list: [reason.slice(0, 500)] };
      else if (action === 'cancelRefund' && order.status === 6 && !order.stock_refund_pending) patch = { status: order.origstate, refund_fee: order.stock_refunded_fee || 0, refund_list: [] };
      else M.fail('订单状态已变化，请刷新');
      await tx.collection(ORDERS).doc(id).update(patch);
      return { errCode: 0 };
    });
  }
  return { prepare, quote, previewFreight, settle, release, saveGoods, goodsDetail, orderAction };
}
module.exports = { createCommerce, transaction, ...M };
