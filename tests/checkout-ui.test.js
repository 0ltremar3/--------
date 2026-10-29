'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function load(file, globals = {}) {
  const source = fs.readFileSync(file,'utf8').match(/<script>([\s\S]*?)<\/script>/)[1].replace(/import[^;]+;/g,'').replace('export default','module.exports =');
  const context = { module:{exports:{}}, uniCloud:{database:()=>({}),getCurrentUserInfo:()=>({uid:'u'})}, ...globals };
  vm.runInNewContext(source,context); return context.module.exports;
}
function instance(component) {
  const page={...component.data(),$t:key=>key,$refs:{popup:{close(){}}}};
  for (const [key,fn] of Object.entries(component.methods)) page[key]=fn.bind(page);
  for (const [key,fn] of Object.entries(component.computed || {})) Object.defineProperty(page,key,{get:()=>fn.call(page)});
  return page;
}
(async()=>{
  // Cart savings are per-item valid list-price differences, not checkout coupons.
  const cart=instance(load('pages/cart/cart.vue'));
  const item=(crossed_price, overrides={})=>({efficacy:true,checked:true,goods_suk:{price:9000},goods_number:1,crossed_price,...overrides});
  for (const crossedPrice of [[0], [], undefined, null, [null], [8000], [9000], ['invalid'], [Infinity]]) {
    cart.cartList=[item(crossedPrice)];cart.calcTotal();
    assert.equal(cart.total,9000);
    assert.equal(cart.crossed_total,0,'missing or invalid list prices must not create negative/invalid savings');
  }
  cart.cartList=[item([0]),item([12000],{goods_number:2}),item([18000],{checked:false}),item([18000],{efficacy:false})];
  cart.calcTotal();assert.equal(cart.total,27000);assert.equal(cart.crossed_total,6000,'undiscounted goods must not offset another item’s savings');
  cart.cartList=[item([9001])];cart.calcTotal();assert.equal(cart.crossed_total,1,'preserve one-cent savings');
  cart.check('item',0);assert.equal(cart.total,0);assert.equal(cart.crossed_total,0);assert.equal(cart.allChecked,false);
  cart.check('all');assert.equal(cart.total,9000);assert.equal(cart.crossed_total,1);
  cart.cartList=[];cart.calcTotal();assert.equal(cart.total,0);assert.equal(cart.crossed_total,0);assert.equal(cart.allChecked,false);
  const cartTemplate=fs.readFileSync('pages/cart/cart.vue','utf8').split('<script>')[0];
  assert.match(cartTemplate,/<text\b[^>]*v-if="crossed_total > 0"[^>]*class="cart-footer__discount"/,'hide savings when there is no valid discount');
  console.log('Cart: missing/invalid list prices, mixed items, quantities, selection, cents, empty state and discount visibility passed.');
  let cartUid='u',cartNavigation;const cartRequests=[];
  const cartComponent=load('pages/cart/cart.vue',{
    uniCloud:{database:()=>({}),getCurrentUserInfo:()=>({uid:cartUid,tokenExpired:Date.now()+60000})},
    uni:{showLoading(){},hideLoading(){},stopPullDownRefresh(){},showToast(){},navigateTo(options){cartNavigation=options.url}},setTimeout(){}
  });
  const rememberedCart=instance(cartComponent);
  rememberedCart.$func={myFunction:()=>new Promise(resolve=>cartRequests.push(resolve))};
  const row=(_id,overrides={})=>item([0],{_id,id:['g'],checked:false,...overrides});
  let reload=cartComponent.onShow.call(rememberedCart);
  cartRequests.shift()({result:{cartList:[row('a'),row('b')]}});await reload;
  rememberedCart.check('all');assert.equal(rememberedCart.total,18000);
  rememberedCart.createOrder();
  const cartCheckout=JSON.parse(cartNavigation.split('suk=')[1].split('&&motion=')[0]);
  assert.deepEqual(cartCheckout.map(item=>item.cart_id),['a','b'],'cart checkout carries exact source rows');
  reload=cartComponent.onShow.call(rememberedCart);
  cartRequests.shift()({result:{cartList:[row('b'),row('a',{goods_suk:{price:15000}})]}});await reload;
  assert.equal(rememberedCart.allChecked,true);assert.equal(rememberedCart.total,24000);
  assert.equal(rememberedCart.cartList.every(item=>item.checked),true,'returning restores every selected item despite reordered data');
  rememberedCart.check('item',0);
  reload=cartComponent.onPullDownRefresh.call(rememberedCart);
  cartRequests.shift()({result:{cartList:[row('a'),row('b'),row('new')]}});await reload;
  assert.deepEqual(Array.from(rememberedCart.cartList,item=>item.checked),[true,false,false]);
  assert.equal(rememberedCart.allChecked,false);assert.equal(rememberedCart.total,9000);
  const olderCart=rememberedCart.loadData(),newerCart=rememberedCart.loadData();
  const resolveOlder=cartRequests.shift(),resolveNewer=cartRequests.shift();
  resolveNewer({result:{cartList:[row('a',{efficacy:false})]}});await newerCart;
  resolveOlder({result:{cartList:[row('a'),row('b')]}});await olderCart;
  assert.equal(rememberedCart.cartList.length,1);assert.equal(rememberedCart.cartList[0].checked,false);
  assert.equal(rememberedCart.allChecked,false);assert.equal(rememberedCart.total,0,'invalid-only cart is not fully selected');
  reload=rememberedCart.loadData();cartRequests.shift()({result:{cartList:[]}});await reload;
  assert.equal(rememberedCart.empty,true);assert.equal(rememberedCart.allChecked,false);
  reload=rememberedCart.loadData();cartRequests.shift()({result:{cartList:[row('a')]}});await reload;
  assert.equal(rememberedCart.empty,false);rememberedCart.check('all');
  const previousAccount=rememberedCart.loadData();const resolvePreviousAccount=cartRequests.shift();
  cartUid='other';reload=cartComponent.onShow.call(rememberedCart);
  cartRequests.shift()({result:{cartList:[row('a')]}});await reload;
  resolvePreviousAccount({result:{cartList:[row('private')]}});await previousAccount;
  assert.equal(rememberedCart.cartList[0]._id,'a');assert.equal(rememberedCart.cartList[0].checked,false);
  assert.equal(rememberedCart.total,0);assert.equal(rememberedCart.allChecked,false);
  cartUid=null;cartComponent.onShow.call(rememberedCart);
  assert.equal(rememberedCart.cartList.length,0);assert.equal(cartRequests.length,0,'logged-out page must not load cart');
  console.log('Cart selection: page return, refresh, reordering, changed prices, partial selection, new/invalid/deleted items, stale responses and account changes passed.');
  const pending=[];
  const component=load('pages/order/createOrder.vue',{checkoutApi:()=>({quote:input=>new Promise((resolve,reject)=>pending.push({input,resolve,reject}))}),checkoutError:e=>e.errCode,getDelivery:()=>({area_code:'320102',address_id:''})});
  const page=instance(component);
  const sheetActions=[];
  page.$refs.freightDetails={open:()=>sheetActions.push('open'),close:()=>sheetActions.push('close')};
  page.getCurrentLang=()=> 'zh-Hans';
  const locales={};
  for (const locale of ['zh-Hans','en']) {
    const context={module:{exports:{}}};
    vm.runInNewContext(fs.readFileSync(`lang/${locale}.js`,'utf8').replace('export default','module.exports ='),context);
    locales[locale]=context.module.exports;
  }
  page.$t=(key,args={})=>key.split('.').reduce((value,part)=>value[part],locales[page.getCurrentLang()]).replace(/\{(\w+)\}/g,(_,name)=>args[name]);
  page.goodsList=[{_id:'g',goodssuk:{cart_id:'cart',suk:{sku_id:'s',price:12000,specs:['盒']},num:1,seckill:false}}]; page.ressList={_id:'a'};
  const first=page.requestQuote(); assert.equal(page.canSubmit,false);
  assert.equal(pending[0].input.goods_arr[0].cart_id,'cart','checkout forwards cart provenance to the server');
  page.ressList={_id:'b'};const second=page.requestQuote();
  const result={payable:12000,origprice:12000,freight:800,total_fee:12800,quote_key:'b',preferential:[],goods_arr:[],freight_snapshot:{groups:[]}};
  pending[1].resolve(result);await second;assert.equal(page.canSubmit,true);assert.equal(page.quoteResult.quote_key,'b');
  pending[0].resolve({...result,quote_key:'a',freight:0,total_fee:12000});await first;assert.equal(page.quoteResult.quote_key,'b');assert.equal(page.freight,800);
  page.quoteResult={...result,address_snapshot:{region_name:'浙江省 杭州市'},freight_snapshot:{groups:[{group_id:'t',goods:[{id:'g',name:'陈皮'}],amount:9000,fee:1200,threshold:12000,remaining:3000,rule:'default'}]}};
  page.freight=1200;
  assert.equal(page.freightText,'￥12.00');
  assert.equal(page.freightGroups[0].explanation,'还差 ¥30.00 满足包邮条件');
  assert.equal(page.freightGroups[0].thresholdText,'¥120.00');assert.equal(page.hasFreightThreshold,true);
  page.openFreightDetails();assert.equal(sheetActions.pop(),'open');
  page.quoteResult.freight_snapshot.groups.push({group_id:'fixed',goods:[{id:'other',name:'其他商品'}],amount:5000,fee:800,rule:'fixed'});
  assert.equal(page.freightGroups[0].explanation,'本组还差 ¥30.00 满足包邮条件');
  assert.equal(page.freightGroups[1].explanation,'这些商品配送至当前地区，运费 ¥8.00。');
  assert.equal(page.freightGroups[1].showThreshold,false);
  const group=page.quoteResult.freight_snapshot.groups[0];
  Object.assign(group,{amount:12000,remaining:0,fee:0,rule:'free'});
  assert.equal(page.freightGroups[0].explanation,'已满足包邮条件');
  Object.assign(group,{amount:9000,remaining:3000,rule:'region'});
  assert.equal(page.freightGroups[0].showThreshold,false,'already-free shipping must not prompt extra spending');
  assert.equal(page.freightGroups[0].explanation,'这些商品配送至当前地区免运费。');
  page.getCurrentLang=()=> 'en';assert.equal(page.freightGroups[1].feeText,'CNY 8.00');assert.match(page.freightGroups[1].explanation,/CNY 8.00/);
  page.getCurrentLang=()=> 'zh-Hans';
  page.freight=0;assert.equal(page.freightText,'免运费');
  page.selectedCoupons=['c'];assert.equal(page.canSubmit,false,'changed input immediately invalidates displayed quote');
  assert.equal(page.freightText,'—');assert.equal(page.freightGroups.length,0);
  sheetActions.length=0;page.openFreightDetails();assert.equal(sheetActions.length,0,'do not open stale details');
  component.watch.canSubmit.call(page,false);assert.equal(sheetActions.pop(),'close');
  const third=page.requestQuote();pending[2].reject({errCode:'COUPON_INVALID'});await third;assert.equal(page.canSubmit,false);assert.equal(page.quoteResult,null);assert.equal(page.quoteError,'COUPON_INVALID');assert.equal(page.payment,null);
  assert.equal(sheetActions.pop(),'close','requote closes any open sheet');
  page.selectCoupon('c');assert.equal(page.selectedCoupons.length,0);
  page.selectedCoupons=['expired','c'];page.coupomFalse=false;page.control=true;
  assert.equal(page.canChooseCoupons,true,'selected coupons remain removable when unavailable or missing from the list');
  let couponClosed=false;page.$refs.popup.close=()=>{couponClosed=true};
  const oldCouponQuote=page.requestQuote();
  page.clearCoupons();assert.equal(page.selectedCoupons.length,0);assert.equal(couponClosed,true);assert.equal(page.canSubmit,false);
  const noCouponQuote=page.requestQuote();assert.equal(pending[4].input.preferential.length,0);
  pending[4].resolve({...result,quote_key:'no-coupons'});await noCouponQuote;
  pending[3].resolve({...result,payable:11000,total_fee:11800,preferential:[{id:'c'}],quote_key:'old-coupon'});await oldCouponQuote;
  assert.equal(page.payment,12000);assert.equal(page.quoteResult.total_fee,12800);assert.equal(page.couponname.length,0);
  assert.equal(page.canChooseCoupons,false);
  const checkoutTemplate=fs.readFileSync('pages/order/createOrder.vue','utf8').split('<script>')[0];
  assert.equal(checkoutTemplate.includes('class="shipping-status"'),false,'no standalone coupon-removal card');
  assert.match(checkoutTemplate,/<uv-popup[^>]*ref="popup"[\s\S]*@click="clearCoupons"[\s\S]*<\/uv-popup>/,'clear-all action belongs inside coupon selection');
  await page.ressDate();assert.equal(page.ressList.length,0,'region-only selection must not silently use a default address');
  // Account-scoped selection stays in memory, not persistent address defaults.
  let uid='one'; const deliverySource=fs.readFileSync('common/delivery.js','utf8').replace(/export /g,'')+'\nmodule.exports={getDelivery,setDelivery};';
  const context={module:{exports:{}},uniCloud:{getCurrentUserInfo:()=>({uid})}};vm.runInNewContext(deliverySource,context);
  context.module.exports.setDelivery({address_id:'a'});assert.equal(context.module.exports.getDelivery().address_id,'a');uid='two';assert.equal(context.module.exports.getDelivery(),null);
  console.log('Checkout UI: freight details, thresholds, mixed rules, free shipping, languages, stale-sheet closing, late responses, failure, coupon removal, region-only address and account switching passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
