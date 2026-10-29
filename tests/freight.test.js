'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { database } = require('./helpers/commerce-db');
const { createCommerce, transaction, normalize } = require('../uniCloud-alipay/cloudfunctions/common/jlg-commerce');
const F = require('../uniCloud-alipay/cloudfunctions/common/jlg-commerce/freight');
const { createFreightAdmin } = require('../uniCloud-alipay/cloudfunctions/common/jlg-commerce/freight-admin');
const template = (id = 't', extra = {}) => ({ _id: id, name: '江浙沪满120包邮', default_fee: 800, region_fees: [{ regions: ['650000'], fee: 1500 }], free_rules: [{ regions: ['310000', '320000', '330000'], threshold: 12000 }], blocked_regions: ['540000'], version: 1, deleted: false, ...extra });
const goods = (id = 'g', price = 12000, extra = {}) => ({ _id: id, name: '茶' + id, category_id: 'category', goods_thumb: 'https://example.test/image.jpg', goods_banner_imgs: [{url:'https://example.test/image.jpg'}], goods_services: [], orig_suks: [{name:'包装',values:[{name:'单盒'}]}], orig_fs_suks: [], stock_version: 1, is_on_sale: true, freight_mode: 'template', freight_template_id: 't', freight: false, freight_amount: 0, suks: [{ sku_id: id + 's', specs: ['单盒'], price, inventory: 20 }], fs_suks: [], ...extra });
const line = (id = 'g', num = 1) => ({ goods_id: id, sku_id: id + 's', goods_num: num });
function initial(items = [goods()]) {
  const regions = ['310000','320000','330000','440000','650000','540000'].map(code => ({ _id: code, code, type: 0, name: code }));
  regions.push({ _id: 'city', code: '320100', parent_code: '320000', type: 1, name: '南京市' }, { _id: 'district', code: '320102', parent_code: '320100', type: 2, name: '玄武区' });
  return { 'opendb-mall-goods': Object.fromEntries(items.map(g => [g._id,g])), 'jlg-freight-templates': { t: template(), t2: template('t2', { default_fee: 1000 }) }, 'opendb-city-china': Object.fromEntries(regions.map(r => [r._id,r])), 'jlg-goods-address': { a: { _id: 'a', user_id: 'u', name: '收件人', mobile: '13800000000', area_code: '320102', address: '测试门牌' }, other: { _id: 'other', user_id: 'someone', name: '他人', mobile: '13800000001', area_code: '320102', address: '其他地址' } } };
}
const request = (extra = {}) => ({ user_id: 'u', address_id: 'a', checkout_version: 1, goods_arr: [line()], ...extra });
async function order(service, extra = {}) { const input = request(extra), quote = await service.quote(input); return service.prepare({ ...input, provider: 'wxpay', order_no: 'order1', out_trade_no: 'payment1', total_fee: quote.total_fee, quote_key: quote.quote_key }); }
let count = 0;
async function test(name, fn) { await fn(); count++; console.log('✓',name); }
function calc(items, province = '320000', templates = [template(),template('t2',{default_fee:1000})]) { return F.calculate(items.map(g => ({ goods_id:g._id,goods_num:1,goods_price:g.suks[0].price })), new Map(items.map(g => [g._id,g])), new Map(templates.map(t => [t._id,t])), province); }
(async () => {
  await test('cart provenance survives modern quote and payment without changing shipping or mutating the cart early', async () => {
    const data=initial();data['jlg-goods-cart']={cart:{_id:'cart',user_id:'u',goods_id:'g',goods_suk:{sku_id:'gs',specs:['单盒']},goods_number:1,goods_seckill:false,create_date:100}};
    const db=database(data),service=createCommerce(db),input=request({goods_arr:[{...line(),cart_id:'cart'}]}),before=db.snapshot();
    const quote=await service.quote(input);assert.deepEqual(db.snapshot(),before);assert.equal(quote.freight,0);
    const saved=await service.prepare({...input,provider:'wxpay',order_no:'cart-order',out_trade_no:'cart-pay',total_fee:quote.total_fee,quote_key:quote.quote_key});
    assert.deepEqual(saved.goods_arr[0].cart_sources,quote.goods_arr[0].cart_sources);assert.ok(db.snapshot()['jlg-goods-cart'].cart);
    await service.settle('cart-pay',quote.total_fee,{});assert.equal(db.snapshot()['jlg-goods-cart'].cart,undefined);
  });
  await test('119.99 boundary and all three provinces at exactly 120', () => {
    for (const province of ['310000','320000','330000']) { assert.equal(calc([goods('g',11999)],province).freight,800); assert.equal(calc([goods()],province).freight,0); }
    assert.equal(calc([goods()],'440000').freight,800); assert.equal(calc([goods()],'650000').freight,1500); assert.equal(calc([goods()],'540000').deliverable,false);
  });
  await test('same-template aggregation, no cross-template subsidy, highest group fee', () => {
    assert.equal(calc([goods('g',7000),goods('h',5000)]).freight,0);
    assert.equal(calc([goods('g',10000),goods('h',2000,{freight_mode:'free'})]).freight,800);
    assert.equal(calc([goods('g',6000),goods('h',6000,{freight_template_id:'t2'})]).freight,1000);
    assert.equal(calc([goods(),goods('h',2000,{freight_mode:'fixed',freight_amount:800})]).freight,800);
    assert.equal(calc([goods('g',1000,{freight_mode:undefined,freight:false,freight_amount:800}),goods('h',1000,{freight_mode:undefined,freight:false,freight_amount:1000})]).freight,1000);
  });
  await test('invalid amount, duplicate and contradictory regions fail closed', () => {
    for (const patch of [{default_fee:-1},{default_fee:1.5},{free_rules:[{regions:['320000'],threshold:0}]},{blocked_regions:['320000']},{region_fees:[{regions:['320000','320000'],fee:0}]}]) assert.throws(() => F.validateTemplate(template('t',patch)));
    assert.throws(() => calc([goods()],'320000',[template('t',{deleted:true})]));
  });
  await test('quote authenticates address, ignores forged prices, and does not mutate state', async () => {
    const db = database(initial()), service = createCommerce(db), before = db.snapshot();
    const q = await service.quote(request({goods_arr:[{...line(),goods_price:1}],freight:0}));
    assert.equal(q.total_fee,12000); assert.equal(q.address_snapshot.province_code,'320000'); assert.deepEqual(db.snapshot(),before);
    await assert.rejects(service.quote(request({address_id:'other'})),e => e.errCode === 'ADDRESS_INVALID');
    await assert.rejects(service.quote(request({user_id:''})),e => e.errCode === 'AUTH_REQUIRED');
    await assert.rejects(service.quote(request({goods_arr:[line('g',21)]})),e => e.errCode === 'STOCK_INSUFFICIENT');
    assert.deepEqual(db.snapshot(),before);
  });
  await test('preview uses verified region; no SKU returns rule without fake exact price', async () => {
    const db=database(initial()), service=createCommerce(db), before=db.snapshot();
    const p=await service.previewFreight({goods_id:'g',area_code:'320000'}); assert.equal(p.freight,null); assert.equal(p.threshold,12000);
    const precise=await service.previewFreight({goods_id:'g',sku_id:'gs',area_code:'320000',goods_num:1}); assert.equal(precise.freight,0);
    assert.equal((await service.previewFreight({goods_id:'g',area_code:'540000'})).deliverable,false);
    await assert.rejects(service.previewFreight({goods_id:'g',area_code:'999999'}));
    await assert.rejects(service.previewFreight({goods_id:'g',address_id:'a'})); assert.deepEqual(db.snapshot(),before);
  });
  await test('membership and coupon reductions do not reduce the free-shipping threshold', async () => {
    const data=initial(); data['jlg-member']={m:{_id:'m',user_id:'u',grade:1,failure_time:Date.now()+60000}}; data['jlg-parameter']={p:{_id:'p',vip_price:90}};
    data['jlg-goods-coupon']={c:{_id:'c',user_id:'u',coupon_id:'r',is_use:false}}; data['jlg-goods-couponrule']={r:{_id:'r',name:'减10元',state:'已发放',start_time:0,end_time:Date.now()+60000,user_type:'所有人',allow_type:'所有商品',order_amount:10000,type:'满减',price:1000}};
    const db=database(data), q=await createCommerce(db).quote(request({preferential:[{id:'c'}]})); assert.equal(q.freight,0); assert.equal(q.total_fee,9800); assert.equal(db.snapshot()['jlg-goods-coupon'].c.is_use,false);
  });
  await test('seckill price controls the threshold; repeated lines aggregate quantity', async () => {
    const data=initial([goods('g',13000,{is_new:true,fs_suks:[{sku_id:'flash',specs:['单盒'],price:6000,inventory:10}]})]);
    const s=createCommerce(database(data));
    assert.equal((await s.quote(request({goods_arr:[{goods_id:'g',sku_id:'flash',goods_num:1,goods_seckill:true}]}))).freight,800);
    assert.equal((await s.quote(request({goods_arr:[{goods_id:'g',sku_id:'flash',goods_num:1,goods_seckill:true},{goods_id:'g',sku_id:'flash',goods_num:1,goods_seckill:true}]}))).freight,0);
  });
  await test('template or address changes invalidate quotes, without inventory or order writes', async () => {
    for (const kind of ['template','address','price']) {
      const db=database(initial()), s=createCommerce(db), q=await s.quote(request());
      if(kind==='template') await db.collection(F.TABLE).doc('t').update({version:2});
      if(kind==='address') await db.collection('jlg-goods-address').doc('a').update({address:'新门牌'});
      if(kind==='price') await db.collection('opendb-mall-goods').doc('g').update({suks:[{sku_id:'gs',specs:['单盒'],price:12500,inventory:20}]});
      const before=db.snapshot(); await assert.rejects(s.prepare({...request(),provider:'wxpay',order_no:'o',out_trade_no:'p',total_fee:q.total_fee,quote_key:q.quote_key}),e=>e.errCode==='PRICE_CHANGED'); assert.deepEqual(db.snapshot(),before);
    }
  });
  await test('template orders require new client protocol; legacy fixed orders remain supported', async () => {
    let db=database(initial()), s=createCommerce(db); const before=db.snapshot();
    await assert.rejects(s.prepare({...request(),checkout_version:undefined,provider:'wxpay',order_no:'o',out_trade_no:'p',total_fee:12000,address:'旧地址'}),e=>e.errCode==='CHECKOUT_UPDATE_REQUIRED');assert.deepEqual(db.snapshot(),before);
    db=database(initial([goods('g',12000,{freight_mode:undefined,freight:false,freight_amount:800})]));s=createCommerce(db);
    const result=await s.prepare({...request(),checkout_version:undefined,provider:'wxpay',order_no:'o',out_trade_no:'p',total_fee:12800,address:'旧地址'});assert.equal(result.freight,800);
  });
  await test('orders snapshot delivery; retry after template edits keeps original fee', async () => {
    const db=database(initial()), s=createCommerce(db), saved=await order(s); assert.equal(saved.freight_snapshot.groups[0].version,1);
    await db.collection(F.TABLE).doc('t').update({version:2,free_rules:[]});
    const retry=await s.prepare({user_id:'u',provider:'wxpay',order_no:saved.order_no,out_trade_no:saved.out_trade_no,total_fee:saved.total_fee});assert.equal(retry.freight,0);assert.equal(db.snapshot()['opendb-mall-goods'].g.suks[0].inventory,19);
    await assert.rejects(s.prepare({...retry,address_id:'other'}),e=>e.errCode==='PRICE_CHANGED');
  });
  await test('blocked destination aborts without writes, including mixed free goods', async () => {
    const data=initial([goods(),goods('h',1000,{freight_mode:'free'})]);data['opendb-city-china'].city.parent_code='540000';
    const db=database(data), s=createCommerce(db), before=db.snapshot();await assert.rejects(s.quote(request({goods_arr:[line(),line('h')]})),e=>e.errCode==='NOT_DELIVERABLE'&&e.blocked_goods.length===1);assert.deepEqual(db.snapshot(),before);
  });
  await test('admin rejects stale edit, linked delete, bad region; valid unlink permits soft deletion', async () => {
    const db=database(initial()), admin=createFreightAdmin(db,transaction);
    await assert.rejects(admin.save(template('t',{version:0}),'admin'),e=>e.errCode==='FREIGHT_CONFLICT');
    await assert.rejects(admin.remove({id:'t',version:1},'admin'),e=>e.errCode==='FREIGHT_IN_USE');
    await assert.rejects(admin.save(template('t',{region_fees:[{regions:['320102'],fee:100}]}),'admin'));
    await transaction(db,async tx=>{const raw=await tx.collection('opendb-mall-goods').doc('g').get();const next={...raw.data,freight_mode:'free'};await F.bind(db,tx,raw.data,next);await tx.collection('opendb-mall-goods').doc('g').update(next)});
    assert.equal(db.snapshot()[F.TABLE].t.binding_revision,1);
    await admin.remove({id:'t',version:1},'admin');assert.equal(db.snapshot()[F.TABLE].t.deleted,true);
    await assert.rejects(transaction(db,tx=>F.bind(db,tx,null,goods())));
  });
  await test('both product save paths persist template selection and reject deleted templates', async () => {
    const db=database(initial([goods('g',12000,{freight_mode:'free',freight:true})])), s=createCommerce(db);
    await s.saveGoods({_id:'g',patch:{freight_mode:'template',freight_template_id:'t'},editor_revision:0,request_id:'binding_request_1'},'admin');
    let saved=db.snapshot()['opendb-mall-goods'].g; assert.equal(saved.freight_mode,'template');assert.equal(saved.freight,false);assert.equal(db.snapshot()[F.TABLE].t.binding_revision,1);
    const old=normalize(saved);
    await s.saveGoods({...old,freight_template_id:'t2',stock_snapshot:{suks:old.suks,fs_suks:old.fs_suks}},'admin');
    saved=db.snapshot()['opendb-mall-goods'].g;assert.equal(saved.freight_template_id,'t2');assert.equal(db.snapshot()[F.TABLE].t2.binding_revision,1);
    await db.collection(F.TABLE).doc('t').update({deleted:true});
    const before=db.snapshot();await assert.rejects(s.saveGoods({_id:'g',patch:{freight_template_id:'t'},editor_revision:saved.editor_revision,request_id:'binding_request_2'},'admin'));assert.deepEqual(db.snapshot(),before);
  });
  await test('copy creates an unbound independent template; full refund uses original fee', async () => {
    const db=database(initial()), admin=createFreightAdmin(db,transaction);const copied=await admin.copy('t','admin');assert.notEqual(copied.id,'t');assert.equal(db.snapshot()[F.TABLE][copied.id].version,1);assert.equal((await admin.getDetail(copied.id)).goods_count,0);
    const s=createCommerce(db), saved=await order(s);await s.settle(saved.out_trade_no,saved.total_fee,{});await db.collection(F.TABLE).doc('t').update({version:2,default_fee:9000,free_rules:[]});
    let requested;
    const gateway={refund:async value=>{requested=value;return{}},refundQuery:async()=>({refundStatus:'SUCCESS',refundFee:saved.total_fee,outRefundNo:saved.out_trade_no+'-full'})};
    await require('../uniCloud-alipay/cloudfunctions/common/jlg-commerce/refund').refundStock(db,gateway,{...saved,status:1,stock_state:'paid'},{});
    assert.equal(requested.refundFee,saved.total_fee);assert.equal(db.snapshot()['uni-pay-orders'][saved._id].stock_state,'refunded');
  });
  await test('quote cloud object overwrites forged user identity', async () => {
    const mod={exports:{}};vm.runInNewContext(fs.readFileSync('uniCloud-alipay/cloudfunctions/jlg-checkout/index.obj.js','utf8'),{module:mod,exports:mod.exports,require(name){if(name==='uni-id-common')return {};return {createCommerce(){}}},console});
    let captured;await mod.exports.quote.call({uid:'u',commerce:{quote:input=>{captured=input;return input}}},{user_id:'victim'});assert.equal(captured.user_id,'u');
  });
  await test('payment component and cloud object forward the quote contract', () => {
    const component=fs.readFileSync('uni_modules/uni-pay/components/uni-pay/uni-pay.vue','utf8');const cloud=fs.readFileSync('uni_modules/uni-pay/uniCloud/cloudfunctions/uni-pay-co/index.obj.js','utf8');
    for(const field of ['address_id','checkout_version','quote_key']){assert(component.includes(field+': options.'+field));assert.equal((cloud.match(new RegExp(field,'g'))||[]).length,2)}
  });
  console.log(`${count} freight regression groups passed`);
})().catch(error=>{console.error(error);process.exitCode=1});
