# 用户端按钮样式

按钮颜色和圆角在 `uni.scss` 集中配置：

- `$brand-action`：按钮主题色，引用 `$brand-primary`（`#61A189`，鼠尾草绿），统一用于绿色背景、文字和边框；修改品牌主题色即可同步更新按钮。
- `$brand-button-radius`：按钮圆角，当前 `999rpx`，呈胶囊形。需要圆角矩形时可统一改为 `24rpx`。
- `$brand-surface`：白色底／白色文字。

`static/common/button.scss` 提供 `shop-button` mixin；`uni.scss` 自动引入。页面和组件在自己的 SCSS 中使用，兼容微信小程序组件样式隔离：

```scss
.submit-button {
	@include shop-button(primary); // 主题色底、白字
	height: 88rpx;
	line-height: 88rpx;
}
.cancel-button {
	@include shop-button(secondary); // 白底、主题色文字与描边
}
```

普通页面也可使用全局 `ds-button-primary`、`ds-button-secondary` 类；原有 `use-btn` 接入主按钮样式。尺寸和布局由所在页面负责，避免统一尺寸挤压订单操作区。不要在 mixin 后重复写背景、文字色或圆角。禁用态使用原生 `disabled` 或 `is-disabled` 类；类名只改变外观，业务仍需阻止点击。

按压反馈默认使用 `150ms ease-out` 透明度过渡。独立按钮可传入 `$static: false` 开启 `scale(0.96)`，禁用态和减少动态效果偏好下不缩放。已有定位 transform 的按钮保持默认值，避免覆盖定位。商品详情拼接按钮由 `.footer-actions` 统一绘制外轮廓，内部两半无边框、无独立圆角，不缩放以保持接缝连续；焦点环向内绘制以免被裁切。

已接入商品购买、规格确认、购物车、订单操作、地址、优惠券、会员、分销、客服、海报保存、设置和登录按钮。图标按钮、文字链接、标签、卡片保留各自语义，不做全局 `button` 强制覆盖。登录模块的公共样式和两处已定制登录页也接入此 mixin，更新该模块时需要保留。

验收：在 HBuilderX 分别运行 H5 和微信小程序，检查商品双按钮、空购物车、禁用结算、订单多按钮换行、地址保存、登录主次按钮，以及规格弹窗底部安全区。静态 SCSS 编译不代替平台视觉验收。
