# 微信小程序分包与上传体积检查

2026-10-16 使用 HBuilderX 5.07 的发行构建验证。下列体积按产物文件原始字节统计（1 KB = 1024 字节），包含开发工具配置等文件，比微信上传统计更保守，不等同于上传界面读数。

## 原因与处理

- 原有主包包含 25 个页面，只有登录/用户资料、会员/分销做了分包；`manifest.json` 的 `mp-weixin.optimization.subPackages` 为 `false`。
- 现在主包只放首页、分类、购物袋、个人中心四个 tabBar 页面。商品、订单、地址、优惠券、收藏、设置、关于、WebView、支付结果按原目录拆为普通分包，页面 URL 和登录拦截路径不变。
- 开启微信分包优化；主包和多个分包共用的依赖仍保留在主包。没有开启独立分包或跨包异步组件，继续共享应用初始化、登录状态和全局样式。
- `refundDetail.vue` 独用的 ColorUI 样式从根 `static/colorui/` 移到 `pages/order/styles/colorui/`，仍编译进订单页样式，避免两份原始 CSS（合计 184 KB）被额外复制到主包。
- 未被引用的透明 Logo 从 `static/logo-nobg.png` 移到 `assets/brand/logo-nobg.png`，保留设计原文件，避免自动打包约 230 KB。正在使用的 `static/logo.png` 保留。

## 构建结果

旧产物主包原始文件合计约 2589.0 KB；调整后 1719.9 KB，减少约 869.1 KB，距 2048 KB 上限约 328.1 KB。

| 包目录 | KB |
| --- | ---: |
| 主包 | 1719.9 |
| pages/product | 48.4 |
| pages/order | 274.1 |
| pages/address | 30.6 |
| pages/coupon | 30.6 |
| pages/collect | 23.1 |
| pages/ucenter/settings | 8.5 |
| pages/ucenter/about | 22.3 |
| pages/common | 1.4 |
| uni_modules/uni-pay/pages | 11.4 |
| uni_modules/uni-id-pages/pages | 114.9 |
| jlg-use | 159.6 |

主包最大的文件是共享代码 `common/vendor.js`（485.4 KB）、在用 Logo（192.1 KB）、秒杀背景（64.9 KB）、uni-icons 字体样式（53.3 KB）、uv-icon 字体样式（52.8 KB）。不要直接移动共享组件到某一个分包，否则其他包可能无法引用。

## 验证与复查

已经完成：微信发行编译成功；50 个微信页面 URL 保留；微信/H5/App 页面路径、页面样式配置和登录拦截配置与改动前一致；229 处产物 `usingComponents` 引用均存在，未发现跨分包引用；首页秒杀 8 项回归通过。构建仍有原有 easycom 重复组件、`:key` 表达式和平台兼容性提示，本次未修改相关业务逻辑。

每次通过 HBuilderX「发行 → 小程序-微信」构建后执行：

```sh
node scripts/check-mp-package-size.js
```

脚本列出各包体积和主包最大的 10 个文件，任何单包超过 2048 KB 时返回非零退出码。检查已有构建产物，不会自动编译。

本次生成的发行目录为 `unpackage/dist/build/mp-weixin`，已由 HBuilderX 打开微信开发者工具，未执行上传。上传前在开发者工具中编译该目录，检查「代码依赖分析」，并真机验证：首页 → 商品详情 → 下单 → 地址选择 → 返回下单，以及订单、登录、支付结果页面。运行版 `unpackage/dist/dev/mp-weixin` 需另外重新构建，不要误用旧产物。

后续新增页面优先加入对应业务分包；tabBar 页必须在主包。根 `static` 中只放确实需要随包复制的资源，分包独有资源放对应分包的 `static`，纯样式源码放普通样式目录。

官方依据：[uni-app 分包配置](https://uniapp.dcloud.net.cn/collocation/pages.html#subpackages)、[分包优化](https://uniapp.dcloud.net.cn/collocation/manifest.html)、[静态资源编译规则](https://uniapp.dcloud.net.cn/tutorial/page-static-assets)。

## 微信订单管理详情页入口

提交审核时的「订单中心 path」填写 `pages/order/order`，不带参数。无参数、空参数或未知状态默认选中并查询「全部订单」；原有 `state=0/1/5/6` 分类入口保持有效。运行 `node tests/order-entry.test.js` 检查入口、分页和取消搜索后的筛选状态。

订单详情页已支持以下后台录入路径，占位符保持原样：

```text
pages/order/orderDetail?out_trade_no=${商品订单号}
```

微信传入支付单号 `out_trade_no` 后，页面按该单号与当前登录用户 `user_id` 联合查询。原有 `?id=数据库订单ID` 入口继续可用，也限定当前用户。查询成功后保存数据库 `_id`，供支付、收货、退款后的刷新使用。数据库原有读取权限仍在服务端生效，无需放开 schema 权限。

运行 `node tests/order-detail.test.js` 检查支付单号入口、旧 ID 入口、刷新、他人订单隔离、空参数、未登录及查询失败。测试使用模拟数据库；上传新版本后，仍需真机验证微信入口和登录回跳。

## 启动前完整性检查

运行 `node scripts/check-mp-runtime.js` 验证发行版的真实 AppID、页面、组件引用和 JavaScript 语法；运行版使用 `node scripts/check-mp-runtime.js unpackage/dist/dev/mp-weixin`。遇到 `[] [object Object]` 时先查看开发者工具详细日志，按 `docs/微信开发者工具启动故障-2026-10-27.md` 区分工具登录/网络故障与业务运行错误。
