# health-test：SKU 与库存服务部署记录

日期：2026-09-22。目标：阿里云 `health-test`，空间 ID `mp-33f14b87-9d61-4c31-83d5-b969e0cb9a6c`。

本次用户明确要求先部署。依据项目已有测试空间配置，将用户端、管理端均关联至 health-test 后执行定向上传；没有部署到生产空间。

## 已完成

- 公共模块：`jlg-commerce`、`jlg-pay-runtime`。
- 云函数／云对象：`jlg-goods-admin`、`uni-pay-co`、`jlg-cart`、`delete-order`。
- Schema：`opendb-mall-goods`、`uni-pay-orders`、`jlg-goods-coupon`、`jlg-goods-couponrule`。
- 定时配置：`delete-order` 的 `myTrigger` 为 `0 */5 * * * * *`（每 5 分钟）。已回读配置确认，尚未核验实际触发日志。
- 云端回读：下载刚部署的源码与 Schema，52 项源码／规则／定时配置／依赖检查全部一致。机器可读清单见 `health-test-SKU部署核验.json`。
- 本地回归：25 项通过；10 个共享服务文件与 15 个生成运行时文件一致性检查通过。

所有上传日志明确标记 `[阿里云:health-test]` 并返回完成或成功。

## 部署时修正

1. 对照 HBuilderX 附带的阿里云 SDK，修正事务提交失败后 rollback 再次抛错会掩盖原错误的问题，并增加回归测试。
2. HBuilderX 将 `file:` 依赖作为 uniCloud 公共模块处理；定时函数不能直接将云对象目录当作已上传公共模块。已改为 `jlg-pay-runtime`，由 `scripts/sync-commerce.js --write` 从支付服务源码生成，并单独上传该公共模块。支付逻辑只维护原始源码，生成副本受一致性检查约束。

## 备份

旧云函数及 Schema 保存在：

`/Users/ryuchiang/.codex/deployment-backups/health-test-sku-20260922-135453/before`

同一备份项目下其余资源为部署后的云端回读副本。没有导出业务集合记录，也没有执行库存批量迁移或初始化数据库。

## 尚未完成

- **管理端 H5 发行被官方权限检查拒绝**：当前账号不是 DCloud AppID `__UNI__D965011` 的项目成员。运行的是官方 `publish web --webHosting false`，未上传网页；没有更换 AppID 或绕过权限检查。需应用所有者添加当前账号为项目成员，或登录已有发布权限的账号。
- 用户端小程序没有提交发布。新客户端与后端联调、上线仍需完成。
- 未执行真实云数据库并发购买、真实支付／退款验收；回读一致不等同于交易链路已验收。
- 旧商品仍需核对实际可售库存。未确认库存的商品被服务端阻止新下单；未自动勾选库存确认，也未批量设置 `stock_version=1`。

回滚及库存迁移原则见 `SKU与库存重构说明.md`。在新版在途订单结清前，不应直接恢复旧客户端扣库存逻辑。
