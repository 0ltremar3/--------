# 运费功能初始化数据

这两份文件仅包含“配送管理 / 运费模板”两个菜单和 GOODS_EDIT 权限定义，不包含商品、订单、用户、角色授权或示例收费模板。

使用前先检查目标空间是否已存在同名 menu_id / permission_id。首次初始化时，复制这些文件到独立的初始化项目，并配套复制目标空间当前的 opendb-admin-menus、uni-id-permissions Schema，以及本项目的 jlg-freight-templates Schema；只对该独立项目执行 HBuilderX 初始化。

记录使用固定 _id 防止重复插入。后续重复初始化可能覆盖这三个固定ID记录的修改，因此应先检查并备份；不要在已有业务空间上运行本仓库完整 database/db_init.json。

2026-10-27 已在支付宝云 healthmall（env-00jy6y52fd8l）初始化并回读验证。运费模板集合已创建，收费规则由商家在后台填写后绑定商品。部署记录见 ../../docs/healthmall-运费模板部署记录-2026-10-27.md。
