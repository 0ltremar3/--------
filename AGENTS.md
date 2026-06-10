# Repository Guidelines

## Project Structure & Module Organization

This is a uni-app shopping client. Entry points live in `main.js`, `App.vue`, `manifest.json`, and `pages.json`. Page-level Vue files are grouped by feature under `pages/`, for example `pages/product/`, `pages/order/`, `pages/address/`, and `pages/ucenter/`. Shared UI components are in `components/`; imported uni-app extensions are in `uni_modules/`. Business helpers live in `common/`, i18n files in `lang/`, and global styles in `uni.scss` plus `static/common/common.scss`. Cloud functions and database schemas are under `uniCloud-aliyun/`. Treat `unpackage/` as generated build output unless a task explicitly targets compiled artifacts.

## Build, Test, and Development Commands

Install root dependencies with:

```sh
npm install
```

This repository has no root `scripts` in `package.json`; use HBuilderX or the uni-app CLI integration to run and build targets. Common workflows are: run H5 or WeChat Mini Program from HBuilderX, then build the selected platform through HBuilderX's publish/build menu. Cloud functions with their own `package.json` may need dependencies installed from that function directory, for example `uniCloud-aliyun/cloudfunctions/jlg-cart/`.

## Coding Style & Naming Conventions

Follow the existing Vue 2/uni-app style: single-file components with `<template>`, `<script>`, and SCSS where needed. Existing files use tabs for indentation and single quotes in JavaScript imports; keep that style when editing nearby code. Use kebab-case for component folders and tags such as `jlg-minPrice`, and keep page paths aligned with `pages.json`. Prefer `@/` aliases for project imports.

## Testing Guidelines

No automated test framework or coverage rule is currently configured. For changes, manually verify the affected platform in HBuilderX, especially WeChat Mini Program conditionals such as `#ifdef MP-WEIXIN` and non-WeChat branches. Check user flows affected by the change, such as product browsing, cart, order creation, address editing, and cloud-function calls. If adding tests later, place them near the feature and document the runner command here.

## Commit & Pull Request Guidelines

Git history is not available in this checkout, so use clear, scoped commit messages such as `fix: correct cart quantity update` or `feat: add coupon list filter`. Pull requests should include a short summary, affected pages or cloud functions, manual verification steps, linked issues when applicable, and screenshots or screen recordings for visible UI changes.

## Security & Configuration Tips

Do not commit secrets, private cloud keys, or production credentials. Review changes to `manifest.json`, `uni-starter.config.js`, cloud function configs, and database schemas carefully because they can affect deployed clients and backend behavior.
