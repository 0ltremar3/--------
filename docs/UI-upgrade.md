# 用户端 UI 全面升级设计系统与开发步骤

## 1. 改版目标

本次 UI 升级参考图中的品牌零售风格：克制、高级、留白充足、以影像建立品牌情绪，用少量深色文字和主题绿完成操作引导。

核心目标：

- 保持主题色 `#1C7231` 不变。
- 将现有“促销商城模板感”升级为“高端养生品牌零售感”。
- 统一首页、购物车、个人中心的视觉语言。
- 替换字体包，建立统一字体系统。
- 减少高饱和红、粉、橙、蓝、紫等模板色。
- 减少大圆角、阴影、复杂卡片，改用留白、分割线、影像和排版分层。
- 保留现有业务逻辑，优先改造结构、样式和组件外观。

涉及重点文件：

- `pages/index/index.vue`
- `pages/cart/cart.vue`
- `pages/ucenter/ucenter.vue`
- `uni.scss`
- `App.vue`
- `static/common/common.scss`
- `pages.json`
- `static/tabbar/`
- `static/fonts/`

## 2. 当前问题分析

### 2.1 首页

当前首页包含搜索框、轮播、公告、分类、优惠轮播、秒杀、热销、推荐瀑布流。信息完整，但视觉上偏传统电商促销页。

主要问题：

- 首屏由搜索与轮播构成，品牌识别弱。
- 分类图标、秒杀、热销、优惠券标签叠加，促销感强。
- `indicator-active-color="red"` 与主题色不一致。
- 商品图片存在 `scaleToFill`，容易拉伸。
- 商品卡圆角、标签、价格样式偏模板。
- 首页缺少品牌故事、场景图、理念模块。

### 2.2 购物车

当前购物车功能完整，但视觉偏工具型商城。

主要问题：

- 顶部栏图标过大，品牌表达粗糙。
- 商品卡大圆角、灰底、阴影式按钮与参考风格不符。
- 服务标签使用红色边框，促销感强。
- 底部按钮阴影带粉色，与主题不统一。
- 空状态“去逛逛”红色不符合新版风格。

### 2.3 个人中心

当前个人中心使用背景图、头像卡、会员色块、彩色图标列表，视觉元素较杂。

主要问题：

- 顶部沉浸感不足，背景图和白色用户卡割裂。
- 功能入口图标颜色过多。
- 订单、会员、优惠券、分销等入口风格不统一。
- 与参考图中的“品牌服务中心”感觉差距较大。

### 2.4 全局样式

当前全局样式仍保留很多模板色。

主要问题：

- `uni.scss` 只有基础 uni-app 变量，缺少品牌设计 token。
- `static/common/common.scss` 中 `.price`、`.use-btn` 等仍使用红粉色。
- `App.vue` 只声明了 iconfont，没有品牌正文字体。
- `pages.json` 中 tabBar 选中色为 `#f86c8a`，需要改为 `#1C7231`。

## 3. 设计系统

### 3.1 品牌关键词

- 自然
- 克制
- 洁净
- 实验室感
- 东方食养
- 高端零售
- 品牌杂志感

### 3.2 色彩系统（已完成）

保留主色：

```scss
$brand-primary: #1C7231;
```

新增品牌色：

```scss
$brand-black: #202321;
$brand-text: #2B2F2C;
$brand-muted: #8E918D;
$brand-light-muted: #B8BBB6;
$brand-border: #E5E6E2;
$brand-bg: #F7F8F5;
$brand-surface: #FFFFFF;
$brand-image-bg: #ECEDE8;
$brand-danger: #A33A2E;
```

使用规则：

- `#1C7231` 只用于关键动作、选中态、价格、重要细线。
- 标题、图标优先使用 `#202321`。
- 辅助文案使用 `#8E918D`。
- 页面背景使用 `#FFFFFF` 或 `#F7F8F5`。
- 分割线使用 `#E5E6E2`。
- 尽量避免大面积绿色背景。
- 删除非必要红色、粉色、橙色、蓝色、紫色。

### 3.3 字体系统

建议引入品牌字体包，优先使用思源黑体或 Noto Sans SC。

字体栈：

```scss
$brand-font:
	"SQ-Brand",
	"Source Han Sans SC",
	"Noto Sans SC",
	"PingFang SC",
	"Hiragino Sans GB",
	"Microsoft YaHei",
	Arial,
	sans-serif;
```

字号：

```scss
$font-xs: 22rpx;
$font-sm: 24rpx;
$font-base: 28rpx;
$font-md: 32rpx;
$font-lg: 40rpx;
$font-xl: 52rpx;
```

字重：

```scss
$font-regular: 400;
$font-medium: 500;
$font-semibold: 600;
```

使用规则：

- 页面标题：`40rpx / 600`
- 分区标题：`34rpx / 600`
- 商品名称：`28rpx / 400-500`
- 商品规格：`24rpx / 400`
- 价格：`30-34rpx / 500`
- 按钮：`28rpx / 500`
- 不使用负字距。
- 不用过粗字重制造廉价促销感。

### 3.4 字体包方案

本阶段先不强制替换字体包，可以继续使用当前系统字体栈。字体包接入作为第二阶段优化项，先通过统一字号、字重、行高来完成视觉升级。

当前项目已有两类全局字号工具：

- `App.vue` 中的 `.f-32`、`.f-29`、`.f-28`、`.f-26`、`.f-24` 等。
- `static/common/common.scss` 中的 `.fs-sm`、`.fs`、`.fs-lg`、`.fwb` 等。

这些工具类只能表达数字大小，不能表达语义。例如商品标题、正文、订单状态都可能使用 `f-28`，但它们在新版设计里不应该总是一起变化。因此新增“语义文字类”作为统一修改入口。

建议在 `uni.scss` 中先定义语义变量：

```scss
$font-page-title: 40rpx;
$font-page-title-weight: 600;

$font-section-title: 34rpx;
$font-section-title-weight: 600;

$font-product-title: 28rpx;
$font-product-title-weight: 500;

$font-body: 26rpx;
$font-body-weight: 400;

$font-meta: 24rpx;
$font-meta-weight: 400;

$font-order-status: 26rpx;
$font-order-status-weight: 400;

$font-price: 32rpx;
$font-price-weight: 500;
```

建议在 `App.vue` 或 `static/common/common.scss` 中新增全局语义类：

```scss
.text-page-title {
	font-size: $font-page-title;
	font-weight: $font-page-title-weight;
	line-height: 1.35;
}

.text-section-title {
	font-size: $font-section-title;
	font-weight: $font-section-title-weight;
	line-height: 1.35;
}

.text-product-title {
	font-size: $font-product-title;
	font-weight: $font-product-title-weight;
	line-height: 1.45;
}

.text-body {
	font-size: $font-body;
	font-weight: $font-body-weight;
	line-height: 1.6;
}

.text-meta {
	font-size: $font-meta;
	font-weight: $font-meta-weight;
	line-height: 1.45;
	color: #8E918D;
}

.text-order-status {
	font-size: $font-order-status;
	font-weight: $font-order-status-weight;
	line-height: 1.4;
}

.text-price {
	font-size: $font-price;
	font-weight: $font-price-weight;
	line-height: 1;
	color: #1C7231;
}
```

页面替换规则：

```html
<!-- 商品标题 -->
<text class="text-product-title">{{item.title[0]}}</text>

<!-- 商品规格、辅助说明 -->
<text class="text-meta">{{items}}</text>

<!-- 我的订单状态 -->
<text class="text-order-status">待付款</text>

<!-- 分区标题 -->
<view class="text-section-title">我的订单</view>
```

注意事项：

- 不建议继续把所有文字都写成 `.f-28`、`.f-29` 这类数字工具类。
- 商品标题、正文、订单状态、价格、辅助文案应使用不同语义类。
- 页面内已有的 `style="font-size: ..."` 内联样式优先级最高，统一入口无法覆盖，需要逐步删除或替换。
- `cart.vue` 中的 `.title`、`ucenter.vue` 中的 `.username`、订单状态上的 `.f-29`，应在页面改造时替换为语义类。
- iconfont 的 `font-size` 可继续单独控制，不纳入文字字号系统。

后续需要正式替换字体包时，推荐目录：

```text
static/fonts/
  NotoSansSC-Regular.woff2
  NotoSansSC-Medium.woff2
  NotoSansSC-SemiBold.woff2
```

在 `App.vue` 中声明：

```scss
@font-face {
	font-family: "SQ-Brand";
	src: url("/static/fonts/NotoSansSC-Regular.woff2") format("woff2");
	font-weight: 400;
}

@font-face {
	font-family: "SQ-Brand";
	src: url("/static/fonts/NotoSansSC-Medium.woff2") format("woff2");
	font-weight: 500;
}

@font-face {
	font-family: "SQ-Brand";
	src: url("/static/fonts/NotoSansSC-SemiBold.woff2") format("woff2");
	font-weight: 600;
}
```

全局应用：

```scss
page,
body,
view,
text,
button,
input,
textarea {
	font-family: "SQ-Brand", "PingFang SC", sans-serif;
	letter-spacing: 0;
}
```

小程序端如遇 `@font-face` 兼容问题，可在 `App.vue` 的 `onLaunch` 中增加：

```js
uni.loadFontFace({
	family: 'SQ-Brand',
	source: 'url("/static/fonts/NotoSansSC-Regular.woff2")'
});
```

### 3.5 间距系统

```scss
$space-1: 8rpx;
$space-2: 16rpx;
$space-3: 24rpx;
$space-4: 32rpx;
$space-5: 48rpx;
$space-6: 64rpx;
$space-8: 96rpx;
```

使用规则：

- 页面左右安全边距：`32rpx`
- 分区上下间距：`64rpx`
- 商品卡间距：`24rpx`
- 列表行内边距：`32rpx`
- 首页大图后留白：`56-80rpx`

### 3.6 圆角系统

```scss
$radius-none: 0;
$radius-sm: 4rpx;
$radius-md: 8rpx;
$radius-lg: 12rpx;
$radius-pill: 999rpx;
```

使用规则：

- 商品图：`0-8rpx`
- 按钮：主按钮可用 `0-8rpx`，少用胶囊。
- 卡片：最多 `8-12rpx`。
- 弹窗：`12rpx`。
- 减少当前 `20rpx` 大圆角。

### 3.7 边框与阴影

新版优先使用边框和留白，不依赖阴影。

```scss
$border-light: 1rpx solid #E5E6E2;
```

使用规则：

- 列表项使用底部分割线。
- 卡片使用 `1rpx` 浅边框。
- 删除粉色、红色阴影。
- 不使用重阴影制造层级。

### 3.8 图片系统

图片是新版视觉的核心。

使用规则：

- 首页首屏使用大幅品牌图。
- 商品图统一背景，尽量使用自然光、白底、灰底或生活方式图。
- `image` 优先使用 `mode="aspectFill"`。
- 避免 `scaleToFill` 导致拉伸。
- 图片可保持低饱和、灰白自然色调。

推荐比例：

```text
首页 hero：750rpx x 520rpx
品牌故事图：750rpx x 420rpx
商品横滑图：1:1
商品双列图：1:1
个人中心头图：750rpx x 420rpx
购物车商品图：180rpx x 180rpx
```

### 3.9 图标系统

当前可继续使用 `iconfont`，但需要统一成线性图标。

使用规则：

- 图标颜色默认 `#202321`。
- 未选中图标 `#A6A9A4`。
- 选中图标 `#1C7231`。
- 功能入口不再使用彩色图标。
- 底部 tab 图标统一线性风格。
- 图标尺寸：
  - 底部 tab：`44rpx`
  - 功能入口：`48rpx`
  - 顶部导航：`40-44rpx`

### 3.10 组件规范

#### 主按钮

```scss
.ds-button-primary {
	height: 88rpx;
	line-height: 88rpx;
	background: #1C7231;
	color: #FFFFFF;
	border-radius: 0;
	font-size: 28rpx;
	font-weight: 500;
	box-shadow: none;
}
```

#### 次按钮

```scss
.ds-button-ghost {
	height: 80rpx;
	line-height: 80rpx;
	background: #FFFFFF;
	color: #1C7231;
	border: 1rpx solid #1C7231;
	border-radius: 0;
	font-size: 28rpx;
	box-shadow: none;
}
```

#### 分区标题

```scss
.ds-section-title {
	font-size: 34rpx;
	font-weight: 600;
	color: #202321;
	text-align: center;
	margin: 64rpx 0 40rpx;
}
```

#### 商品卡

```scss
.ds-product-card {
	background: #FFFFFF;
}

.ds-product-image {
	width: 100%;
	aspect-ratio: 1 / 1;
	background: #ECEDE8;
}

.ds-product-name {
	margin-top: 20rpx;
	font-size: 28rpx;
	color: #2B2F2C;
	line-height: 1.45;
}

.ds-product-meta {
	margin-top: 8rpx;
	font-size: 24rpx;
	color: #8E918D;
}

.ds-product-price {
	margin-top: 12rpx;
	font-size: 30rpx;
	color: #1C7231;
	font-weight: 500;
}
```

#### 横向导航 tab

```scss
.ds-tabs {
	display: flex;
	white-space: nowrap;
	border-bottom: 1rpx solid #E5E6E2;
}

.ds-tab {
	padding: 28rpx 32rpx;
	font-size: 28rpx;
	color: #A6A9A4;
}

.ds-tab.active {
	color: #202321;
	font-weight: 600;
}

.ds-tab-line {
	width: 64rpx;
	height: 4rpx;
	background: #1C7231;
}
```

## 4. 页面改造方案

### 4.1 首页 `pages/index/index.vue`

#### 目标

把首页从“促销货架”改成“品牌入口 + 商品目录 + 品牌内容”。

#### 建议结构

```text
品牌顶部导航
横向频道 tab
首屏品牌大图 hero
精选商品横滑
品牌故事 / 食养理念 / 门店大图模块
推荐商品双列
```

#### 具体修改点

- 保留现有数据方法：`bannerdata`、`cetagories`、`goodsdata`、`mrgoodsdata`。
- 顶部搜索改为线性搜索图标，减少搜索框占比。
- 中间显示品牌名“山前食养”或品牌 Logo。
- 分类宫格改为横向文字 tab。
- 首页首屏轮播使用大图，弱化指示点。
- 将 `indicator-active-color="red"` 改为 `#1C7231`。
- 将商品图片 `mode="scaleToFill"` 改为 `mode="aspectFill"`。
- 秒杀模块从强促销区改为“限时精选”，样式克制。
- 热销模块改名为“本周精选”或“食养精选”。
- 推荐瀑布流改为规整双列商品网格。
- 优惠券标签改为细边框绿色小标签。

#### 首页验收标准

- 首屏能明确感知品牌，而不只是搜索商品。
- 页面主要视觉来自图片，而不是彩色模块。
- 商品信息简洁，价格和操作不喧宾夺主。
- 分类、推荐、品牌内容层级清晰。

### 4.2 购物车 `pages/cart/cart.vue`

#### 目标

把购物车改成“购物袋”风格，降低模板感，提升品牌零售质感。

#### 建议结构

```text
固定顶部：购物袋 + 管理/完成
商品列表：商品图 + 名称 + 规格 + 服务 + 数量
失效商品：灰度遮罩
底部结算栏：全选 + 合计 + 结算
空状态：品牌化空购物袋
```

#### 具体修改点

- 顶部标题从“山前食养”改为“购物袋”。
- 顶部图标缩小或移除，避免 `70rpx` 大图标。
- 商品项去大圆角，改为白底 + 分割线。
- 商品图设置为 `180rpx x 180rpx`，使用 `aspectFill`。
- 服务标签从红色边框改为浅灰或主题绿细边框。
- 失效商品遮罩改为半透明黑/灰，不用过强提示。
- 空状态按钮从红色改为主题绿。
- 底部结算按钮删除粉色阴影。
- 管理态“移除商品”使用白底绿边框。

#### 购物车验收标准

- 商品列表干净，商品图、名称、规格、数量层级明确。
- 结算区清晰但不过度促销。
- 空状态、失效状态与新版风格一致。

### 4.3 个人中心 `pages/ucenter/ucenter.vue`

#### 目标

把个人中心改成“品牌服务中心”，参考图中沉浸头图和线性功能入口。

#### 建议结构

```text
沉浸式头图
Hi, 尊敬的顾客 / 用户昵称
我的订单：待支付 / 待收货 / 已完成
官方公众号关注行
服务功能网格：手工现调 / 香水续装 / 地址簿 / 联系客服 / 退换政策 / 隐私政策
```

#### 具体修改点

- 保留顶部背景图，但取消粉色用户卡。
- 用户问候直接叠在背景图底部。
- 用户头像可弱化，或只在设置入口中出现。
- “我的订单”改为白底细边框分区。
- 订单状态图标统一线性黑色。
- 删除功能入口中的彩色内联样式。
- 功能列表改为 3 列网格。
- 公众号入口改为一行白底细边框。
- 会员、优惠券、分销等入口按业务重要性重新排序。

#### 个人中心验收标准

- 顶部有沉浸式品牌图像。
- 功能入口统一、克制、易扫视。
- 彩色图标和大面积色块被移除。

## 5. 开发拆分步骤

### 阶段 1：建立全局设计 token

修改文件：

- `uni.scss`
- `static/common/common.scss`

任务：

- 新增品牌色变量。
- 新增字体变量。
- 新增间距、圆角、边框变量。
- 新增通用 `.ds-*` 类。
- 将公共价格色从红粉改为 `#1C7231`。
- 将公共按钮色从模板红粉改为 `#1C7231`。

验收：

- 全局变量可被页面 SCSS 使用。
- 价格、按钮、基础文字不再出现明显模板红粉色。

### 阶段 3：统一 tabBar

修改文件：

- `pages.json`
- `static/tabbar/`

任务：

- `selectedColor` 改为 `#1C7231`。
- `color` 改为 `#A6A9A4`。
- 替换底部 tab 图标为线性图标。
- 修正购物车 iconPath 和 selectedIconPath。
- 文案可考虑把“购物车”改为“购物袋”。

验收：

- 底部导航颜色统一。
- 选中态和未选中态清晰。
- 图标不再有明显模板感。

### 阶段 4：首页结构和样式改造

修改文件：

- `pages/index/index.vue`

任务：

- 重写顶部品牌导航样式。
- 分类宫格改为横向频道 tab。
- 首屏轮播改为品牌 hero。
- 调整 banner 指示器为主题绿。
- 商品横滑卡片使用新版商品卡样式。
- 推荐瀑布流改为克制双列样式。
- 删除或弱化强促销视觉。
- 商品图片统一使用 `aspectFill`。

验收：

- 首屏接近参考图的品牌首页气质。
- 主题色只在选中态、价格、细线中出现。
- 商品图不变形。
- 页面没有红色指示器或粉色促销按钮。

### 阶段 5：购物车样式改造

修改文件：

- `pages/cart/cart.vue`

任务：

- 顶部改为“购物袋”。
- 商品项从圆角卡片改为清爽列表。
- 服务标签改为灰绿细边框。
- 空状态按钮改为主题绿。
- 底部结算栏删除阴影。
- 管理态按钮改为绿边框。

验收：

- 列表更像品牌购物袋。
- 商品选择、数量修改、删除、结算逻辑不受影响。
- 空状态和失效商品状态样式统一。

### 阶段 6：个人中心样式改造

修改文件：

- `pages/ucenter/ucenter.vue`

任务：

- 顶部改为沉浸式背景图 + 问候文案。
- 订单区改为参考图式白底细边框分区。
- 功能入口改为线性图标网格。
- 删除彩色内联图标样式。
- 公众号关注入口改为品牌行。
- 调整页面背景、留白、边框。

验收：

- 页面风格与首页一致。
- 功能入口清晰，颜色克制。
- 没有大面积粉色、橙色、蓝色图标。

### 阶段 7：细节统一与回归

修改范围：

- 三个页面的重复样式
- 公共组件样式
- tabBar 图标
- 商品图片展示

任务：

- 检查所有 `#ff`、`red`、`pink`、`#f86c8a` 等旧色。
- 检查所有 `scaleToFill`，必要时改为 `aspectFill`。
- 检查按钮是否还有阴影。
- 检查圆角是否过大。
- 检查小程序胶囊区域是否被遮挡。
- 检查 H5 底部 tab 和购物车底部栏是否重叠。

验收：

- 首页、购物车、个人中心视觉统一。
- H5 与 MP-WEIXIN 样式正常。
- 原业务流程无回归。

## 6. 推荐实施顺序

建议按以下顺序执行：

1. `uni.scss` 建立设计 token。
2. `App.vue` 接入字体包。
3. `pages.json` 和 `static/tabbar/` 统一底部导航。
4. 改造 `pages/index/index.vue`，先确定品牌基调。
5. 改造 `pages/cart/cart.vue`，保证交易链路稳定。
6. 改造 `pages/ucenter/ucenter.vue`，完成服务中心风格统一。
7. 全量检查旧色、旧圆角、旧阴影、旧图标。
8. HBuilderX 分别预览 H5 和微信小程序。

## 7. 手动验证清单

### 首页

- 页面首次加载正常。
- banner 正常展示和切换。
- 分类点击跳转正常。
- 搜索跳转正常。
- 秒杀/精选商品点击正常。
- 推荐商品加载更多正常。
- 商品图无拉伸。

### 购物车

- 未登录跳转登录正常。
- 商品选中/取消正常。
- 全选正常。
- 数量加减正常。
- 合计金额正常。
- 管理态删除正常。
- 空购物车状态正常。
- 底部结算栏不遮挡 tabBar。

### 个人中心

- 未登录状态展示正常。
- 登录后昵称和头像正常。
- 订单数量正常。
- 订单入口跳转正常。
- 地址、客服、设置等入口跳转正常。
- 背景图和胶囊按钮不冲突。

## 8. 风格禁用项

改版中应避免：

- 大面积渐变背景。
- 大面积主题绿背景。
- 高饱和促销红。
- 粉色按钮和粉色阴影。
- 多彩图标。
- 过大的圆角卡片。
- 多层卡片嵌套。
- 商品图拉伸。
- 页面内解释性功能文案过多。
- 让按钮、标签、价格抢过品牌图像。

## 9. 最终效果判断

新版完成后，用户第一眼应感受到：

- 这是一个有品牌感的养生零售小程序。
- 页面干净、克制、可信。
- 商品图片和品牌内容是主角。
- 购买路径仍然清晰。
- `#1C7231` 成为稳定的品牌识别色，而不是到处铺满的装饰色。
