# healthmall 运费模板部署记录

日期：2026-10-27。用户明确授权将本次改动部署到云端并初始化必要数据。

## 目标与范围

部署至两端当前关联的支付宝云 `healthmall`，SpaceID `env-00jy6y52fd8l`。没有切换到旧阿里云空间。

| 类型 | 已部署资源 |
| --- | --- |
| 公共模块 | jlg-commerce、jlg-pay-runtime |
| 云函数／云对象 | jlg-checkout、jlg-freight-admin、jlg-goods-admin、uni-pay-co、jlg-cart、delete-order、jlg-order-stat-setup |
| 业务 Schema | jlg-freight-templates、opendb-mall-goods、uni-pay-orders |

共12项定向上传全部返回成功。商品、订单 Schema 与上传前云端版本逐字段对比，差异只包含本次新增的运费模式、模板关联、地址和报价快照字段；原集合权限保持不变。

## 初始化结果

使用独立的 freight-init 项目执行定向初始化，包含：

- `opendb-admin-menus`：新增 `_id/menu_id = shipping_management`（配送管理）和 `freight_templates`（运费模板）。子菜单路径 `/pages/jlg-freight-templates/list`，父菜单 `shipping_management`，权限 `GOODS_EDIT`。
- `uni-id-permissions`：新增 `_id = freight_permission_goods_edit`、`permission_id = GOODS_EDIT`，名称“商品与运费模板管理”。没有修改或授予任何角色权限。
- `jlg-freight-templates`：集合及 Schema 已创建，初始为空。

初始化前已在云控制台查询确认三个业务标识均不存在；初始化后逐条回读确认。两个既有配置集合的 Schema 使用云端当前版本，初始化后再下载比较，确认未改变。

初始化文件保存在 `deploy/freight-init/`，具有固定 `_id`。没有执行主项目的完整 db_init.json，没有导入旧商品、订单示例，也没有批量绑定商品。示例8元/15元未写入生产收费规则。

## 验证

- 本地16组运费回归通过；两端18份共享文件、15份支付运行时文件同步检查无差异。
- 上传后重新下载代码与 Schema，37份文件与本地一致，核验包含 SHA-256。
- 微信模拟器实际调用新部署的结算云对象：对现有在售商品“新会陈皮（5年）”选择普通SKU、数量1、江苏省南京市玄武区，返回 `success=true`、`deliverable=true`、`exact=true`，商品金额9000分、运费0分，符合该商品原有包邮设置。未创建订单或修改商品。
- 云控制台已确认父子菜单、GOODS_EDIT 权限定义，以及空运费模板集合。

本次云端验证未执行真实支付或退款，未创建测试运费商品。模板边界和混合运费规则已做本地回归；正式收费规则需由商家填写后绑定。

## 备份与回退

完整备份、上传日志、云端回读副本及机器核验结果位于：

`/Users/ryuchiang/.codex/deployment-backups/healthmall-freight-20261027/`

- `before/`：上传前代码与 Schema。
- `after/`：上传后的云端回读副本。
- `upload-results.json`：12项上传结果。
- `verification.json`：37份文件比较与哈希。
- `init-preflight.json`、`initialization-verification.json`：初始化范围与回读确认。
- `cloud-smoke.json`：真实客户端运费预估结果。
- `logs/`：逐项备份、部署、初始化和回读日志。

如需回退，先停止新模板商品的使用，按原字段备份解除绑定；只移除本次新增且确认未被后续修改的菜单/权限记录。已有新协议订单必须继续使用支持其快照的计费服务，不能直接覆盖为旧版本。备份内容可能包含服务配置，保持本地受限目录，不提交仓库。

## 发布边界

本次部署的是云端函数、公共模块、数据库结构和初始化记录。小程序前端已在本地重新构建并运行验证，但没有提交微信审核或发布；管理端H5页面需要使用本次前端代码运行或另行发布，旧版已发布后台不会自动增加新的页面文件。
