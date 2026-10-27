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
  const pending=[];
  const component=load('pages/order/createOrder.vue',{checkoutApi:()=>({quote:input=>new Promise((resolve,reject)=>pending.push({input,resolve,reject}))}),checkoutError:e=>e.errCode,getDelivery:()=>({area_code:'320102',address_id:''})});
  const page=instance(component);
  page.goodsList=[{_id:'g',goodssuk:{suk:{sku_id:'s',price:12000,specs:['盒']},num:1,seckill:false}}]; page.ressList={_id:'a'};
  const first=page.requestQuote(); assert.equal(page.canSubmit,false);
  page.ressList={_id:'b'};const second=page.requestQuote();
  const result={payable:12000,origprice:12000,freight:800,total_fee:12800,quote_key:'b',preferential:[],goods_arr:[],freight_snapshot:{groups:[]}};
  pending[1].resolve(result);await second;assert.equal(page.canSubmit,true);assert.equal(page.quoteResult.quote_key,'b');
  pending[0].resolve({...result,quote_key:'a',freight:0,total_fee:12000});await first;assert.equal(page.quoteResult.quote_key,'b');assert.equal(page.freight,800);
  page.selectedCoupons=['c'];assert.equal(page.canSubmit,false,'changed input immediately invalidates displayed quote');
  const third=page.requestQuote();pending[2].reject({errCode:'COUPON_INVALID'});await third;assert.equal(page.canSubmit,false);assert.equal(page.quoteResult,null);assert.equal(page.quoteError,'COUPON_INVALID');assert.equal(page.payment,null);
  page.selectCoupon('c');assert.equal(page.selectedCoupons.length,0);
  await page.ressDate();assert.equal(page.ressList.length,0,'region-only selection must not silently use a default address');
  // Account-scoped selection stays in memory, not persistent address defaults.
  let uid='one'; const deliverySource=fs.readFileSync('common/delivery.js','utf8').replace(/export /g,'')+'\nmodule.exports={getDelivery,setDelivery};';
  const context={module:{exports:{}},uniCloud:{getCurrentUserInfo:()=>({uid})}};vm.runInNewContext(deliverySource,context);
  context.module.exports.setDelivery({address_id:'a'});assert.equal(context.module.exports.getDelivery().address_id,'a');uid='two';assert.equal(context.module.exports.getDelivery(),null);
  console.log('Checkout UI: late responses, invalidation, failure, coupon removal, region-only address and account switching passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
