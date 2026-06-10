(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["uni_modules/uni-pay/components/uni-pay/uni-pay"],{

/***/ 501:
/*!**********************************************************************************************************!*\
  !*** /Users/ryuchiang/Documents/ryuCodeLand/养生商城-用户端/uni_modules/uni-pay/components/uni-pay/uni-pay.vue ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _uni_pay_vue_vue_type_template_id_1f87f297_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./uni-pay.vue?vue&type=template&id=1f87f297&scoped=true& */ 502);
/* harmony import */ var _uni_pay_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./uni-pay.vue?vue&type=script&lang=js& */ 504);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _uni_pay_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _uni_pay_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _uni_pay_vue_vue_type_style_index_0_id_1f87f297_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./uni-pay.vue?vue&type=style&index=0&id=1f87f297&lang=scss&scoped=true& */ 506);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 53);

var renderjs





/* normalize component */

var component = Object(_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _uni_pay_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _uni_pay_vue_vue_type_template_id_1f87f297_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _uni_pay_vue_vue_type_template_id_1f87f297_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "1f87f297",
  null,
  false,
  _uni_pay_vue_vue_type_template_id_1f87f297_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "uni_modules/uni-pay/components/uni-pay/uni-pay.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 502:
/*!*****************************************************************************************************************************************************!*\
  !*** /Users/ryuchiang/Documents/ryuCodeLand/养生商城-用户端/uni_modules/uni-pay/components/uni-pay/uni-pay.vue?vue&type=template&id=1f87f297&scoped=true& ***!
  \*****************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_uni_pay_vue_vue_type_template_id_1f87f297_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./uni-pay.vue?vue&type=template&id=1f87f297&scoped=true& */ 503);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_uni_pay_vue_vue_type_template_id_1f87f297_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_uni_pay_vue_vue_type_template_id_1f87f297_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_uni_pay_vue_vue_type_template_id_1f87f297_scoped_true___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_uni_pay_vue_vue_type_template_id_1f87f297_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 503:
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!/Users/ryuchiang/Documents/ryuCodeLand/养生商城-用户端/uni_modules/uni-pay/components/uni-pay/uni-pay.vue?vue&type=template&id=1f87f297&scoped=true& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return recyclableRender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
var components
try {
  components = {
    uniPopup: function () {
      return __webpack_require__.e(/*! import() | uni_modules/uni-popup/components/uni-popup/uni-popup */ "uni_modules/uni-popup/components/uni-popup/uni-popup").then(__webpack_require__.bind(null, /*! @/uni_modules/uni-popup/components/uni-popup/uni-popup.vue */ 540))
    },
    uniList: function () {
      return __webpack_require__.e(/*! import() | uni_modules/uni-list/components/uni-list/uni-list */ "uni_modules/uni-list/components/uni-list/uni-list").then(__webpack_require__.bind(null, /*! @/uni_modules/uni-list/components/uni-list/uni-list.vue */ 657))
    },
    uniListItem: function () {
      return __webpack_require__.e(/*! import() | uni_modules/uni-list/components/uni-list-item/uni-list-item */ "uni_modules/uni-list/components/uni-list-item/uni-list-item").then(__webpack_require__.bind(null, /*! @/uni_modules/uni-list/components/uni-list-item/uni-list-item.vue */ 664))
    },
  }
} catch (e) {
  if (
    e.message.indexOf("Cannot find module") !== -1 &&
    e.message.indexOf(".vue") !== -1
  ) {
    console.error(e.message)
    console.error("1. 排查组件名称拼写是否正确")
    console.error(
      "2. 排查组件是否符合 easycom 规范，文档：https://uniapp.dcloud.net.cn/collocation/pages?id=easycom"
    )
    console.error(
      "3. 若组件不符合 easycom 规范，需手动引入，并在 components 中注册该组件"
    )
  } else {
    throw e
  }
}
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  var g0 =
    _vm.modeCom === "pc" ? (_vm.options.total_fee / 100).toFixed(2) : null
  var g1 = _vm.modeCom === "pc" ? _vm.currentProviders.indexOf("wxpay") : null
  var g2 = _vm.modeCom === "pc" ? _vm.currentProviders.indexOf("alipay") : null
  var g3 = !(_vm.modeCom === "pc")
    ? (_vm.options.total_fee / 100).toFixed(2)
    : null
  var g4 = !(_vm.modeCom === "pc")
    ? _vm.currentProviders.indexOf("wxpay")
    : null
  var g5 = (_vm.options.total_fee / 100).toFixed(2)
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        g0: g0,
        g1: g1,
        g2: g2,
        g3: g3,
        g4: g4,
        g5: g5,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 504:
/*!***********************************************************************************************************************************!*\
  !*** /Users/ryuchiang/Documents/ryuCodeLand/养生商城-用户端/uni_modules/uni-pay/components/uni-pay/uni-pay.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_uni_pay_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./uni-pay.vue?vue&type=script&lang=js& */ 505);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_uni_pay_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_uni_pay_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_uni_pay_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_uni_pay_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_uni_pay_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 505:
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!/Users/ryuchiang/Documents/ryuCodeLand/养生商城-用户端/uni_modules/uni-pay/components/uni-pay/uni-pay.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uniCloud, uni) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ 32));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 35));
var _js_sdk = _interopRequireDefault(__webpack_require__(/*! ../../js_sdk/js_sdk.js */ 193));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// 引入支付云对象
var uniPayCo = uniCloud.importObject("uni-pay-co");
var myOpenid; // 将openid临时缓存，避免重复获取openid
var _default = {
  name: "uni-pay",
  emits: ["success", "cancel", "fail", "create", "mounted", "qrcode"],
  props: {
    /**
     * Banner广告位id
     */
    adpid: {
      Type: String,
      default: ""
    },
    /**
     * 是否自动跳转到插件内置的支付成功页面（具有看广告功能，可以增加开发者收益）默认true
     */
    toSuccessPage: {
      Type: Boolean,
      default: true
    },
    /**
     * 支付成功后，点击查看订单按钮时跳转的页面地址
     */
    returnUrl: {
      Type: String,
      default: ""
    },
    /**
     * 支付结果页主色调，默认支付宝小程序为#108ee9，其他端均为#01be6e
     * 建议：绿色系 #01be6e 蓝色系 #108ee9 咖啡色 #816a4e 粉红 #fe4070 橙黄 #ffac0c 橘黄 #ff7100
     */
    mainColor: {
      Type: String,
      default: ""
    },
    /**
     * 收银台模式
     * mobile 手机版
     * pc 电脑版
     */
    mode: {
      Type: String,
      default: ""
    },
    /**
     * PC收银台模式时，展示的logo
     */
    logo: {
      Type: String,
      default: "/static/logo.png"
    },
    /**
     * 收银台高度（默认70vh）
     */
    height: {
      Type: [String],
      default: "70vh"
    },
    /**
     * 是否打印运行过程日志
     */
    debug: {
      Type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      // 支付参数
      options: {},
      // 支付云对象返回结果
      res: {},
      images: {
        wxpay: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAABC9JREFUeF7tWk1a20AMlUzv0bDr13AAYAOcpLCBcoqQU1DYEE6C2QAHIP26q3sPPOqniU2cZMYj+SeGxN5kEXlm9ObpjaQxwpY/uOX+Qw9Az4AtR6APgS0nQC+CfQi0FQLfrvcHXwAGPP4bQMK/fy5f7O9HehphwPfb/dOIogEhHQHBcamDCDESPoIxMQPTNSi1ABj+OrwDpNMaO5og4P2bMZOugFADwNTewWhU0/FVzAgnKZnxuoFQAbB3vX9MET7U2PHgq4R09vv8ZRI0bMhADMDw9uAhGN8NLQrWyAYRAGt1PgcRIU5TOms7JIIAdOL8nElJauikTRBKAdi7ObwioFFTzHaMw3mBzRV8DwKOXy+ertpagxcAq/YR/g2d6TlNrUDu4EiiE0Why4T1rgyINoXRC4DgjE+mF8+7RYAkp4RrRyVztRUKTgCkuz89fz4pAiB5z7WbklBrKxScAEgWxI6joZPXy5c4B0H0nkPdhzcHFIxxhHgZ8OA7AgMnAMObA479UnF6H5twQpF5RBMdibPDvB4AAAL6IZ0rNbTb9IngAyC8IwJ0K5okQBgzqFEKSV4wcXg17bxl8fIiJXFc0bHAgYLjYlHEFaZlVUQDoAIbcVZaN1VRrgAgUfImASiKW6Yh4pAohmHVQqpLABI0dMYiKhJPCeoV0ueuQsDmEJrkSeJ/bqNJnOqfApqVzWznzrdYWkvzhnUDYGnPKLTdV5gpfLiOqJUIaTefF8RKH6wxtAOX2IdA8NcCmmRItmBLfVF5jRBnR58kGQtWlGUJlBeAxpQ5A4eFKTu/ufLzPQv1f2mRRDiZ/nyyYwYrypI0OlQOc/9PsgshDsh2v+BUwTFnD3K5DglVlD4WlDZEsqywNgiK2F9gQBkLi7EtyV59WhBsiTURCjy5QZMgYRn9cxbZWgCQ+IKlnH2sFQYTURHmCYMgAJaKs9aYPkXNXGK6QhQdt9xeC4UhTC+eV/wVASASmrKj6IMA4NIBMQDsX1VN4IlbuU0K7vmiQS0G5EOpmiW6I1Dpjtp8pYc5yxYVj0RtXcMJcwDFSiqYLh2x+QgqAJwnAuEEydxbkZtdj+fKPVfwbPIq7KngqvMVX4WoAmDBAcH9HTMmXw23s0LJSlPOOsZx0l8VAu/0Fzjuc2Td3aY5zf1VoZgBvPgmvuhoIrFSMSXQThcDoJo0YLxGLfBSv5IINgVC1XxCOb/oZrkTBtRJqkQgKG6ROgPgPbGq/6HVIiYK51WngAj5ikbBhoZi3FALbHmozhlQXFChTc75g6wRM2ufzb9N/IwMcG0wg8HZJf9HBF/tFZnBBBH+cW/BpBDnd4XLDNJcon4oBiiY7jS194mEI0IaSz+12ygAclSYEcXvFsqA3UgANEzqAdCgtYm2PQM2cVc1PvUM0KC1ibY9AzZxVzU+bT0D/gPs/oxfcUEcJAAAAABJRU5ErkJggg==",
        alipay: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAA2FJREFUeF7tmU122jAQx2cMB2hp9yULeK+naHISwhJyiIRDBJaQkwRO0fdgEWff0h4ANH0yFc+m+hhbckKNvJUsaX76z4ckhAv/8MLthwggKuDCCUQXuHABxCAYXSC6wIUTiC7wFgL4MPveTaj9optrO+696ya8yeQRQFRAdIEYAxoVBD/PNtdCwHWpDIJwr+1PMCk1DgAkCSx/jHrLsv/p+lfKAp3HzQOYDAqxKtcYBJPtXe/B1Y3TXgmATGst0WIrgAC7JmBINOQsNN8HE0zfVQFlFxzrgFgHNLQOkNJuQ7vrcgkS1CXEua5fgnDj+l+172CX/h59Tbn9Of0qBUE1cGe2ngPhLWeiEH0krFDBT63HC8Cnx/VtFuFDfgl90UOldDvuX4WcSo7lBSD0YuR4H6ebZwRNkRUw9xdSah1G+IzZmW5IW7ERDX/e9Rc+YwerBEMvQo1nrhfqkf/ZuYCxxK5J/t4AjkFQBi71CXxFoFSWq2XTlkn+AndXodNf5SwgT4J7gnttoNL6BqUEmCZET/tkvzQZYj5g1Sf/0goIkfcJYIkEK5HsFnkYnen6BXQptUb5lwJgMz4zCihXD/BqAwVDuoy+Uqx399kACrkZaYECVjY5qxJZXpoQwrcDHB6UghfVvPssAMo35W4R7oZVg5EMmAJxUCZ2CNzfVJ2Pm6qdleDBNwFClaHZdRrQAEhWe25VSPCuAMo1tnQhdIzMNUixfDYBqAOGVQEKQB15OFMCwXPV3QsFww7g73E39Pudr/Gn0EyplQPXCkBF/5AKsBtPKRA+AdKAEx/0BhYLL9nHFkhZLiBvbkOcxFzG5wPtoe7gBUrrTiMttqO+8ebZCkAtWErs17jHvrrSLcj+lkCpKeV5g/ABIA05lqgVM4Er2nPhZgev7DHGnToLG+ALIC9budgWwoRzyuMUPlzj8waVBuELIFOB5iksi7xIKQh8PS4wu8/j+a3vBScbRAgABVfg5BZbH6SFgP0kVIl7UCjNja4RCkAGwecaPLDhp4yNsSYkADlp/mncdNLLu8fpud9XQK7//wERGoBrAefSfgRBsLI9pTtPg+diUNV1yLuJypVg1Un/p/8arwDXZkQALkJNb48KaPoOu+yLCnARanp7VEDTd9hlX1SAi1DT2/8AaakVXysj5qkAAAAASUVORK5CYII="
      },
      originalRroviders: ["wxpay", "alipay"],
      currentProviders: ["wxpay", "alipay"]
    };
  },
  mounted: function mounted() {
    var _this = this;
    return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
      var code, res;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (myOpenid) {
                _context.next = 8;
                break;
              }
              _context.next = 3;
              return _this.getCode();
            case 3:
              code = _context.sent;
              _context.next = 6;
              return _this.getOpenid({
                provider: "wxpay",
                code: code
              });
            case 6:
              res = _context.sent;
              if (res) myOpenid = res.openid;
            case 8:
              // 如果是微信小程序，则设置只支持微信支付
              _this.originalRroviders = ["wxpay"];
              _this.currentProviders = JSON.parse(JSON.stringify(_this.originalRroviders));
              _this.$emit("mounted", {
                images: _this.images,
                originalRroviders: _this.originalRroviders,
                currentProviders: _this.currentProviders
              });
            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  methods: {
    // 发起支付 - 打开支付选项弹窗
    open: function open() {
      var _arguments = arguments,
        _this2 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var options, providers;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                options = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : {};
                if (options.provider) {
                  providers = [];
                  _this2.originalRroviders.map(function (item, index) {
                    if (options.provider.indexOf(item) > -1) {
                      providers.push(item);
                    }
                  });
                  _this2.currentProviders = providers;
                  delete options.provider;
                } else {
                  _this2.currentProviders = JSON.parse(JSON.stringify(_this2.originalRroviders));
                }
                _this2.options = options;
                if (!(_this2.currentProviders.length === 1)) {
                  _context2.next = 7;
                  break;
                }
                _this2.createOrder({
                  provider: _this2.currentProviders[0]
                });
                _context2.next = 11;
                break;
              case 7:
                if (!(_this2.modeCom === "pc")) {
                  _context2.next = 10;
                  break;
                }
                _context2.next = 10;
                return _this2._pcChooseProvider(_this2.currentProviders[0]);
              case 10:
                _this2.openPopup("payPopup");
              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))();
    },
    // 创建支付
    createOrder: function createOrder() {
      var _arguments2 = arguments,
        _this3 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var data, options, createOrderData, res;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                data = _arguments2.length > 0 && _arguments2[0] !== undefined ? _arguments2[0] : {};
                options = _this3.options;
                Object.assign(options, data);
                if (!(options.provider === "appleiap")) {
                  _context3.next = 5;
                  break;
                }
                return _context3.abrupt("return", _this3._appleiapCreateOrder(options));
              case 5:
                createOrderData = {
                  provider: options.provider,
                  total_fee: options.total_fee,
                  openid: myOpenid,
                  order_no: options.order_no || _this3.res.order_no,
                  out_trade_no: options.out_trade_no || _this3.res.out_trade_no,
                  description: options.description,
                  type: options.type,
                  goods_arr: options.goods_arr,
                  notes: options.notes,
                  preferential: options.preferential,
                  origprice: options.origprice,
                  deduprice: options.deduprice,
                  freight: options.freight,
                  is_distr: options.is_distr,
                  audit_status: options.audit_status,
                  address: options.address,
                  qr_code: options.qr_code,
                  custom: options.custom,
                  other: options.other
                };
                if (myOpenid) {
                  createOrderData.openid = myOpenid;
                }
                _context3.next = 9;
                return uniPayCo.createOrder(createOrderData);
              case 9:
                res = _context3.sent;
                if (!res.errCode) {
                  _this3.$emit("create", res);
                  if (res.qr_code && !options.cancel_popup) {
                    _this3.res = res;
                    // 展示组件内置的二维码弹窗
                    if (_this3.modeCom === "pc") {
                      _this3.openPopup("payPopup");
                      _this3._pcChooseProvider(options.provider);
                    } else {
                      _this3.openPopup("qrcodePopup");
                    }
                  } else {
                    // 调起支付
                    _this3.orderPayment(res);
                  }
                }
              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }))();
    },
    // 调起支付
    orderPayment: function orderPayment(res) {
      var _this4 = this;
      this.res = res;
      if (res.qr_code) {
        this.$emit("qrcode", res);
      } else if (res.order) {
        uni.requestPayment(_objectSpread(_objectSpread(_objectSpread({}, res.order), res.order), {}, {
          success: function success(res) {
            _this4._getOrder();
          },
          fail: function fail(err) {
            if (err.errMsg.indexOf("fail cancel") == -1) {
              // 发起支付失败
              console.error("uni.requestPayment:fail", err);
              _this4.$emit("fail", err);
            } else {
              // 用户取消支付
              _this4.$emit("cancel", err);
            }
          }
        }));
      }
    },
    // 打开弹窗
    openPopup: function openPopup(name) {
      if (!this.$refs[name].showPopup) this.$refs[name].open();
    },
    // 关闭弹窗
    closePopup: function closePopup(name) {
      this.$refs[name].close();
    },
    // 查询订单（查询支付情况）
    getOrder: function getOrder() {
      var _arguments3 = arguments;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
        var data, res;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                data = _arguments3.length > 0 && _arguments3[0] !== undefined ? _arguments3[0] : {};
                _context4.prev = 1;
                _context4.next = 4;
                return uniPayCo.getOrder(data);
              case 4:
                res = _context4.sent;
                if (typeof data.success === "function") data.success(res);
                return _context4.abrupt("return", res);
              case 9:
                _context4.prev = 9;
                _context4.t0 = _context4["catch"](1);
                if (typeof data.fail === "function") data.fail(_context4.t0);
              case 12:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[1, 9]]);
      }))();
    },
    // 发起退款（此接口需要admin角色才可以访问）
    refund: function refund() {
      var _arguments4 = arguments;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5() {
        var data, res;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                data = _arguments4.length > 0 && _arguments4[0] !== undefined ? _arguments4[0] : {};
                _context5.prev = 1;
                _context5.next = 4;
                return uniPayCo.refund(data);
              case 4:
                res = _context5.sent;
                if (typeof data.success === "function") data.success(res);
                return _context5.abrupt("return", res);
              case 9:
                _context5.prev = 9;
                _context5.t0 = _context5["catch"](1);
                if (typeof data.fail === "function") data.fail(_context5.t0);
              case 12:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[1, 9]]);
      }))();
    },
    // 查询退款（查询退款情况）
    getRefund: function getRefund() {
      var _arguments5 = arguments;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6() {
        var data, res;
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                data = _arguments5.length > 0 && _arguments5[0] !== undefined ? _arguments5[0] : {};
                _context6.prev = 1;
                _context6.next = 4;
                return uniPayCo.getRefund(data);
              case 4:
                res = _context6.sent;
                if (typeof data.success === "function") data.success(res);
                return _context6.abrupt("return", res);
              case 9:
                _context6.prev = 9;
                _context6.t0 = _context6["catch"](1);
                if (typeof data.fail === "function") data.fail(_context6.t0);
              case 12:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[1, 9]]);
      }))();
    },
    // 关闭订单
    closeOrder: function closeOrder() {
      var _arguments6 = arguments;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7() {
        var data, res;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                data = _arguments6.length > 0 && _arguments6[0] !== undefined ? _arguments6[0] : {};
                _context7.prev = 1;
                _context7.next = 4;
                return uniPayCo.closeOrder(data);
              case 4:
                res = _context7.sent;
                if (typeof data.success === "function") data.success(res);
                return _context7.abrupt("return", res);
              case 9:
                _context7.prev = 9;
                _context7.t0 = _context7["catch"](1);
                if (typeof data.fail === "function") data.fail(_context7.t0);
              case 12:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[1, 9]]);
      }))();
    },
    // 获取支持的支付供应商
    getPayProviderFromCloud: function getPayProviderFromCloud() {
      var _arguments7 = arguments;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee8() {
        var data, res;
        return _regenerator.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                data = _arguments7.length > 0 && _arguments7[0] !== undefined ? _arguments7[0] : {};
                _context8.prev = 1;
                _context8.next = 4;
                return uniPayCo.getPayProviderFromCloud(data);
              case 4:
                res = _context8.sent;
                if (typeof data.success === "function") data.success(res);
                return _context8.abrupt("return", res);
              case 9:
                _context8.prev = 9;
                _context8.t0 = _context8["catch"](1);
                if (typeof data.fail === "function") data.fail(_context8.t0);
              case 12:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, null, [[1, 9]]);
      }))();
    },
    // 获取支付配置内的appid（主要用于获取获取微信公众号的appid，用以获取code）
    getProviderAppId: function getProviderAppId() {
      var _arguments8 = arguments;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee9() {
        var data, res;
        return _regenerator.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                data = _arguments8.length > 0 && _arguments8[0] !== undefined ? _arguments8[0] : {};
                _context9.prev = 1;
                _context9.next = 4;
                return uniPayCo.getProviderAppId(data);
              case 4:
                res = _context9.sent;
                if (typeof data.success === "function") data.success(res);
                return _context9.abrupt("return", res);
              case 9:
                _context9.prev = 9;
                _context9.t0 = _context9["catch"](1);
                if (typeof data.fail === "function") data.fail(_context9.t0);
              case 12:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, null, [[1, 9]]);
      }))();
    },
    // 根据code获取openid
    getOpenid: function getOpenid() {
      var _arguments9 = arguments;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee10() {
        var data, res;
        return _regenerator.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                data = _arguments9.length > 0 && _arguments9[0] !== undefined ? _arguments9[0] : {};
                _context10.prev = 1;
                _context10.next = 4;
                return uniPayCo.getOpenid(data);
              case 4:
                res = _context10.sent;
                if (typeof data.success === "function") data.success(res);
                return _context10.abrupt("return", res);
              case 9:
                _context10.prev = 9;
                _context10.t0 = _context10["catch"](1);
                if (typeof data.fail === "function") data.fail(_context10.t0);
              case 12:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, null, [[1, 9]]);
      }))();
    },
    // 验证iosIap苹果内购支付凭据
    verifyReceiptFromAppleiap: function verifyReceiptFromAppleiap() {
      var _arguments10 = arguments;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee11() {
        var data, res;
        return _regenerator.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                data = _arguments10.length > 0 && _arguments10[0] !== undefined ? _arguments10[0] : {};
                _context11.prev = 1;
                _context11.next = 4;
                return uniPayCo.verifyReceiptFromAppleiap(data);
              case 4:
                res = _context11.sent;
                if (typeof data.success === "function") data.success(res);
                return _context11.abrupt("return", res);
              case 9:
                _context11.prev = 9;
                _context11.t0 = _context11["catch"](1);
                if (typeof data.fail === "function") data.fail(_context11.t0);
              case 12:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, null, [[1, 9]]);
      }))();
    },
    // 获取code
    getCode: function getCode() {
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee12() {
        return _regenerator.default.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                return _context12.abrupt("return", _js_sdk.default.getWeixinCode());
              case 1:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12);
      }))();
    },
    // 支付成功后的逻辑
    paySuccess: function paySuccess() {
      var res = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.closePopup("payPopup");
      this.closePopup("payConfirmPopup");
      this.clearQrcode();
      if (this.toSuccessPage) {
        // 跳转到支付成功的内置页面
        this.pageToSuccess(res);
      }
      this.$emit("success", res);
    },
    pageToSuccess: function pageToSuccess(res) {
      if (this.modeCom !== "pc") {
        // uni.navigateTo({
        // 	url: `/uni_modules/uni-pay/pages/success/success?out_trade_no=${res.out_trade_no}&order_no=${res.pay_order.order_no}&pay_date=${res.pay_order.pay_date}&total_fee=${res.pay_order.total_fee}&adpid=${this.adpid}&return_url=${this.returnUrl}&main_color=${this.mainColor}`
        // });
      } else {
        if (this.returnUrl) {
          var url = this.returnUrl + "?out_trade_no=".concat(res.out_trade_no, "&order_no=").concat(res.pay_order.order_no);
          if (url.indexOf("/") !== 0) url = "/".concat(url);
          uni.navigateTo({
            url: url
          });
        }
      }
    },
    // 监听 - 关闭二维码弹窗
    clearQrcode: function clearQrcode() {
      this.res.codeUrl = "";
      this.res.qr_code_image = "";
    },
    // 内部函数查询支付状态
    _getOrder: function _getOrder() {
      var _this5 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee13() {
        return _regenerator.default.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _this5.getOrder({
                  out_trade_no: _this5.res.out_trade_no,
                  await_notify: true,
                  success: function success(res) {
                    if (res.has_paid) {
                      _this5.closePopup("qrcodePopup");
                      _this5.paySuccess(res);
                    }
                  }
                });
              case 1:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13);
      }))();
    },
    // 重新发起支付
    _afreshPayment: function _afreshPayment() {
      this.orderPayment(this.res);
    },
    // pc版弹窗选择支付方式
    _pcChooseProvider: function _pcChooseProvider(provider) {
      if (provider === this.options.provider) {
        return;
      }
      return this.createOrder({
        provider: provider
      });
    },
    // ios内购支付逻辑
    _appleiapCreateOrder: function _appleiapCreateOrder(options) {
      var _this6 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee14() {
        var appleiap, productList, productInfo, createOrderData, res, requestPaymentRes, verifyRes, code;
        return _regenerator.default.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                // 初始化ios内购商品
                appleiap = new appleiapSdk.Iap({
                  // products为苹果开发者后台的商品id数组
                  products: [options.productid]
                });
                uni.showLoading({
                  title: '加载中...'
                });
                // 初始化，获取iap支付通道
                _context14.next = 4;
                return appleiap.init();
              case 4:
                _context14.next = 6;
                return appleiap.getProduct();
              case 6:
                productList = _context14.sent;
                productInfo = productList[0];
                options.total_fee = productInfo.price * 100;
                options.description = productInfo.description;
                createOrderData = {
                  provider: options.provider,
                  total_fee: options.total_fee,
                  order_no: options.order_no || _this6.res.order_no,
                  out_trade_no: options.out_trade_no || _this6.res.out_trade_no,
                  description: options.description,
                  type: options.type,
                  custom: options.custom
                };
                _context14.next = 13;
                return uniPayCo.createOrder(createOrderData);
              case 13:
                res = _context14.sent;
                if (!(res.errCode === 0)) {
                  _context14.next = 49;
                  break;
                }
                _this6.$emit("create", res);
                _this6.res = res;
                uni.showLoading({
                  title: '支付请求中...'
                });
                _context14.prev = 18;
                // 请求苹果支付
                if (_this6.debug) console.log("正在请求苹果服务器", options.productid, res.out_trade_no);
                _context14.next = 22;
                return appleiap.requestPayment({
                  productid: options.productid,
                  username: res.out_trade_no
                });
              case 22:
                requestPaymentRes = _context14.sent;
                if (_this6.debug) console.log('用户支付成功', requestPaymentRes);
                uni.showLoading({
                  title: '正在处理支付结果...'
                });
                if (!requestPaymentRes.payment.username) {
                  requestPaymentRes.payment.username = _this6.getAppleiapUserName(requestPaymentRes);
                }
                if (requestPaymentRes.payment.username) {
                  _context14.next = 32;
                  break;
                }
                _context14.next = 29;
                return appleiap.finishTransaction(requestPaymentRes);
              case 29:
                uni.hideLoading();
                console.log("\u60A8\u53EF\u80FD\u5DF2\u652F\u4ED8\u6210\u529F\uFF0C\u4F46\u5F88\u62B1\u6B49\u4E22\u5355\u4E86\uFF0C\u8BF7\u8054\u7CFB\u5BA2\u670D\u5904\u7406\u3002", requestPaymentRes);
                return _context14.abrupt("return", false);
              case 32:
                // 将凭据和username缓存起来
                _this6.addAppleiapOrder(requestPaymentRes);
                // 云端请求苹果服务器验证票据
                _context14.next = 35;
                return _this6.verifyReceiptFromAppleiap({
                  out_trade_no: requestPaymentRes.payment.username,
                  transaction_receipt: requestPaymentRes.transactionReceipt,
                  transaction_identifier: requestPaymentRes.transactionIdentifier
                });
              case 35:
                verifyRes = _context14.sent;
                if (!(verifyRes.errCode === 0)) {
                  _context14.next = 42;
                  break;
                }
                _context14.next = 39;
                return appleiap.finishTransaction(requestPaymentRes);
              case 39:
                _this6.removeAppleiapOrder(requestPaymentRes);
                uni.hideLoading();
                _this6.paySuccess(verifyRes);
              case 42:
                _context14.next = 49;
                break;
              case 44:
                _context14.prev = 44;
                _context14.t0 = _context14["catch"](18);
                code = _context14.t0.errCode || _context14.t0.code;
                if (code === 2) {
                  // 用户取消支付
                  if (_this6.debug) console.log("用户取消支付");
                  _this6.$emit("cancel", _context14.t0);
                } else {
                  // 发起支付失败
                  console.error("appleiapCreateOrder:fail", _context14.t0);
                  _this6.$emit("fail", _context14.t0);
                }
                uni.hideLoading();
              case 49:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, null, [[18, 44]]);
      }))();
    },
    // ios内购支付漏单重试
    appleiapRestore: function appleiapRestore() {
      var _this7 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee15() {
        var appleiap, transactions, i, requestPaymentRes, verifyRes;
        return _regenerator.default.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                uni.showLoading({
                  title: '检测支付环境...'
                });
                // 初始化
                appleiap = new appleiapSdk.Iap(); // 初始化，获取iap支付通道
                _context15.next = 4;
                return appleiap.init();
              case 4:
                _context15.prev = 4;
                if (_this7.debug) console.log("正在查询是否有漏单信息");
                _context15.next = 8;
                return appleiap.restoreCompletedTransactions({
                  username: ""
                });
              case 8:
                transactions = _context15.sent;
                if (_this7.debug) console.log('漏单查询结果：' + (transactions.length === 0 ? '未漏单' : "有漏单"), transactions);
                if (transactions.length) {
                  _context15.next = 12;
                  break;
                }
                return _context15.abrupt("return");
              case 12:
                i = 0;
              case 13:
                if (!(i < transactions.length)) {
                  _context15.next = 42;
                  break;
                }
                requestPaymentRes = transactions[i];
                _context15.t0 = requestPaymentRes.transactionState;
                _context15.next = _context15.t0 === appleiapSdk.IapTransactionState.purchased ? 18 : _context15.t0 === appleiapSdk.IapTransactionState.failed ? 35 : 38;
                break;
              case 18:
                // 云端请求苹果服务器验证票据
                if (!requestPaymentRes.payment.username) {
                  requestPaymentRes.payment.username = _this7.getAppleiapUserName(requestPaymentRes);
                }
                if (requestPaymentRes.payment.username) {
                  _context15.next = 24;
                  break;
                }
                _context15.next = 22;
                return appleiap.finishTransaction(requestPaymentRes);
              case 22:
                console.log("\u60A8\u53EF\u80FD\u5DF2\u652F\u4ED8\u6210\u529F\uFF0C\u4F46\u5F88\u62B1\u6B49\u4E22\u5355\u4E86\uFF0C\u8BF7\u8054\u7CFB\u5BA2\u670D\u5904\u7406\u3002", requestPaymentRes);
                return _context15.abrupt("continue", 39);
              case 24:
                console.log('requestPaymentRes: ', requestPaymentRes);
                _context15.next = 27;
                return _this7.verifyReceiptFromAppleiap({
                  out_trade_no: requestPaymentRes.payment.username,
                  transaction_receipt: requestPaymentRes.transactionReceipt,
                  transaction_identifier: requestPaymentRes.transactionIdentifier
                });
              case 27:
                verifyRes = _context15.sent;
                console.log('verifyRes: ', verifyRes);
                if (!(verifyRes.errCode === 0)) {
                  _context15.next = 34;
                  break;
                }
                // 完结订单
                console.log("完结订单：" + requestPaymentRes.payment.username);
                _context15.next = 33;
                return appleiap.finishTransaction(requestPaymentRes);
              case 33:
                _this7.removeAppleiapOrder(requestPaymentRes);
              case 34:
                return _context15.abrupt("break", 39);
              case 35:
                _context15.next = 37;
                return appleiap.finishTransaction(requestPaymentRes);
              case 37:
                return _context15.abrupt("break", 39);
              case 38:
                return _context15.abrupt("break", 39);
              case 39:
                i++;
                _context15.next = 13;
                break;
              case 42:
                _context15.next = 47;
                break;
              case 44:
                _context15.prev = 44;
                _context15.t1 = _context15["catch"](4);
                console.error(_context15.t1);
              case 47:
                _context15.prev = 47;
                uni.hideLoading();
                return _context15.finish(47);
              case 50:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, null, [[4, 44, 47, 50]]);
      }))();
    },
    // 保存ios内购订单至本地缓存（丢单时可找回username）
    addAppleiapOrder: function addAppleiapOrder(requestPaymentRes) {
      var key = "uni-pay-appleiap-order";
      var list = uni.getStorageSync(key) || [];
      list.push(requestPaymentRes);
      uni.setStorageSync(key, list);
    },
    // 从本地缓存中根据订单信息获取username
    getAppleiapUserName: function getAppleiapUserName(requestPaymentRes) {
      var key = "uni-pay-appleiap-order";
      var list = uni.getStorageSync(key) || [];
      var info = list.find(function (item) {
        return item.transactionIdentifier === requestPaymentRes.transactionIdentifier && item.transactionDate === requestPaymentRes.transactionDate;
      });
      var username = info && info.payment && info.payment.username;
      return username;
    },
    // 从本地缓存中删除ios内购订单
    removeAppleiapOrder: function removeAppleiapOrder(requestPaymentRes) {
      var key = "uni-pay-appleiap-order";
      var list = uni.getStorageSync(key) || [];
      var index = list.findIndex(function (item) {
        return item.transactionIdentifier === requestPaymentRes.transactionIdentifier && item.transactionDate === requestPaymentRes.transactionDate;
      });
      if (index > -1) {
        list.splice(index, 1);
      }
      uni.setStorageSync(key, list);
    }
  },
  watch: {},
  computed: {
    modeCom: function modeCom() {
      if (this.mode) return this.mode;
      var systemInfo = uni.getSystemInfoSync();
      return systemInfo && systemInfo.deviceType === "pc" ? "pc" : "mobile";
    }
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/uni-cloud/dist/index.js */ 31)["uniCloud"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),

/***/ 506:
/*!********************************************************************************************************************************************************************!*\
  !*** /Users/ryuchiang/Documents/ryuCodeLand/养生商城-用户端/uni_modules/uni-pay/components/uni-pay/uni-pay.vue?vue&type=style&index=0&id=1f87f297&lang=scss&scoped=true& ***!
  \********************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_uni_pay_vue_vue_type_style_index_0_id_1f87f297_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!../../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!../../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!../../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--8-oneOf-1-3!../../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!../../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!../../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./uni-pay.vue?vue&type=style&index=0&id=1f87f297&lang=scss&scoped=true& */ 507);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_uni_pay_vue_vue_type_style_index_0_id_1f87f297_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_uni_pay_vue_vue_type_style_index_0_id_1f87f297_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_uni_pay_vue_vue_type_style_index_0_id_1f87f297_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_uni_pay_vue_vue_type_style_index_0_id_1f87f297_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_uni_pay_vue_vue_type_style_index_0_id_1f87f297_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 507:
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!./node_modules/postcss-loader/src??ref--8-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!/Users/ryuchiang/Documents/ryuCodeLand/养生商城-用户端/uni_modules/uni-pay/components/uni-pay/uni-pay.vue?vue&type=style&index=0&id=1f87f297&lang=scss&scoped=true& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

}]);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/uni-pay/components/uni-pay/uni-pay.js.map
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'uni_modules/uni-pay/components/uni-pay/uni-pay-create-component',
    {
        'uni_modules/uni-pay/components/uni-pay/uni-pay-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('2')['createComponent'](__webpack_require__(501))
        })
    },
    [['uni_modules/uni-pay/components/uni-pay/uni-pay-create-component']]
]);
