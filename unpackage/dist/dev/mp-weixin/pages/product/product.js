(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/product/product"],{

/***/ 75:
/*!****************************************************************************************************!*\
  !*** /Users/ryuchiang/Documents/ryuCodeLand/养生商城-用户端/main.js?{"page":"pages%2Fproduct%2Fproduct"} ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 30);
__webpack_require__(/*! @dcloudio/vue-cli-plugin-uni/packages/uni-cloud/dist/index.js */ 31);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _product = _interopRequireDefault(__webpack_require__(/*! ./pages/product/product.vue */ 76));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_product.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 76:
/*!*********************************************************************************!*\
  !*** /Users/ryuchiang/Documents/ryuCodeLand/养生商城-用户端/pages/product/product.vue ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _product_vue_vue_type_template_id_2fbdbe34___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./product.vue?vue&type=template&id=2fbdbe34& */ 77);
/* harmony import */ var _product_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./product.vue?vue&type=script&lang=js& */ 79);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _product_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _product_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _product_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./product.vue?vue&type=style&index=0&lang=scss& */ 81);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 53);

var renderjs





/* normalize component */

var component = Object(_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _product_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _product_vue_vue_type_template_id_2fbdbe34___WEBPACK_IMPORTED_MODULE_0__["render"],
  _product_vue_vue_type_template_id_2fbdbe34___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null,
  false,
  _product_vue_vue_type_template_id_2fbdbe34___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages/product/product.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 77:
/*!****************************************************************************************************************!*\
  !*** /Users/ryuchiang/Documents/ryuCodeLand/养生商城-用户端/pages/product/product.vue?vue&type=template&id=2fbdbe34& ***!
  \****************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_product_vue_vue_type_template_id_2fbdbe34___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./product.vue?vue&type=template&id=2fbdbe34& */ 78);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_product_vue_vue_type_template_id_2fbdbe34___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_product_vue_vue_type_template_id_2fbdbe34___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_product_vue_vue_type_template_id_2fbdbe34___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_product_vue_vue_type_template_id_2fbdbe34___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 78:
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!/Users/ryuchiang/Documents/ryuCodeLand/养生商城-用户端/pages/product/product.vue?vue&type=template&id=2fbdbe34& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
    uqrcode: function () {
      return Promise.all(/*! import() | uni_modules/Sansnn-uQRCode/components/uqrcode/uqrcode */[__webpack_require__.e("common/vendor"), __webpack_require__.e("uni_modules/Sansnn-uQRCode/components/uqrcode/uqrcode")]).then(__webpack_require__.bind(null, /*! @/uni_modules/Sansnn-uQRCode/components/uqrcode/uqrcode.vue */ 547))
    },
    uniIcons: function () {
      return Promise.all(/*! import() | uni_modules/uni-icons/components/uni-icons/uni-icons */[__webpack_require__.e("common/vendor"), __webpack_require__.e("uni_modules/uni-icons/components/uni-icons/uni-icons")]).then(__webpack_require__.bind(null, /*! @/uni_modules/uni-icons/components/uni-icons/uni-icons.vue */ 557))
    },
    jlgMinPrice: function () {
      return __webpack_require__.e(/*! import() | components/jlg-minPrice/jlg-minPrice */ "components/jlg-minPrice/jlg-minPrice").then(__webpack_require__.bind(null, /*! @/components/jlg-minPrice/jlg-minPrice.vue */ 486))
    },
    uniCountdown: function () {
      return Promise.all(/*! import() | uni_modules/uni-countdown/components/uni-countdown/uni-countdown */[__webpack_require__.e("common/vendor"), __webpack_require__.e("uni_modules/uni-countdown/components/uni-countdown/uni-countdown")]).then(__webpack_require__.bind(null, /*! @/uni_modules/uni-countdown/components/uni-countdown/uni-countdown.vue */ 475))
    },
    uniRate: function () {
      return __webpack_require__.e(/*! import() | uni_modules/uni-rate/components/uni-rate/uni-rate */ "uni_modules/uni-rate/components/uni-rate/uni-rate").then(__webpack_require__.bind(null, /*! @/uni_modules/uni-rate/components/uni-rate/uni-rate.vue */ 565))
    },
    mpHtml: function () {
      return Promise.all(/*! import() | uni_modules/mp-html/components/mp-html/mp-html */[__webpack_require__.e("common/vendor"), __webpack_require__.e("uni_modules/mp-html/components/mp-html/mp-html")]).then(__webpack_require__.bind(null, /*! @/uni_modules/mp-html/components/mp-html/mp-html.vue */ 572))
    },
    uniPopup: function () {
      return __webpack_require__.e(/*! import() | uni_modules/uni-popup/components/uni-popup/uni-popup */ "uni_modules/uni-popup/components/uni-popup/uni-popup").then(__webpack_require__.bind(null, /*! @/uni_modules/uni-popup/components/uni-popup/uni-popup.vue */ 540))
    },
    uniPopupShare: function () {
      return Promise.all(/*! import() | uni_modules/uni-popup/components/uni-popup-share/uni-popup-share */[__webpack_require__.e("common/vendor"), __webpack_require__.e("uni_modules/uni-popup/components/uni-popup-share/uni-popup-share")]).then(__webpack_require__.bind(null, /*! @/uni_modules/uni-popup/components/uni-popup-share/uni-popup-share.vue */ 580))
    },
    uvPopup: function () {
      return Promise.all(/*! import() | uni_modules/uv-popup/components/uv-popup/uv-popup */[__webpack_require__.e("common/vendor"), __webpack_require__.e("uni_modules/uv-popup/components/uv-popup/uv-popup")]).then(__webpack_require__.bind(null, /*! @/uni_modules/uv-popup/components/uv-popup/uv-popup.vue */ 592))
    },
    uniNumberBox: function () {
      return __webpack_require__.e(/*! import() | uni_modules/uni-number-box/components/uni-number-box/uni-number-box */ "uni_modules/uni-number-box/components/uni-number-box/uni-number-box").then(__webpack_require__.bind(null, /*! @/uni_modules/uni-number-box/components/uni-number-box/uni-number-box.vue */ 599))
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
  var g0 = _vm.goodsdata.name ? _vm.goodsdata.goods_banner_imgs.length : null
  var g1 =
    _vm.goodsdata.name && _vm.control
      ? (_vm.goodsdata.crossed_price / 100).toFixed(0)
      : null
  var g2 =
    _vm.goodsdata.name && !_vm.control
      ? (_vm.goodsdata.crossed_price / 100).toFixed(0)
      : null
  var g3 =
    _vm.goodsdata.name && !_vm.control
      ? Math.round((_vm.minPrice / _vm.goodsdata.crossed_price) * 100)
      : null
  var l0 = _vm.goodsdata.name
    ? _vm.__map(_vm.couponList, function (item, index) {
        var $orig = _vm.__get_orig(item)
        var g4 =
          (item.user_type === "所有人" ||
            item.user_arr.includes(_vm.user_id)) &&
          (item.allow_type !== "指定商品" ||
            item.goods_arr.includes(_vm.goods_id))
        return {
          $orig: $orig,
          g4: g4,
        }
      })
    : null
  var g5 = _vm.goodsdata.name ? _vm.specSelected.length : null
  var g6 =
    _vm.goodsdata.name &&
    !_vm.goodsdata.freight &&
    _vm.goodsdata.freight_amount > 0
      ? (_vm.goodsdata.freight_amount / 100).toFixed(2)
      : null
  var g7 = _vm.goodsdata.name ? _vm.evaluateList.length : null
  var m0 =
    _vm.goodsdata.name && g7 > 0
      ? _vm.formatDate(_vm.evaluateList[0].create_date)
      : null
  var l1 = _vm.goodsdata.name
    ? _vm.__map(_vm.couponList, function (item, index) {
        var $orig = _vm.__get_orig(item)
        var g8 =
          (item.user_type === "所有人" ||
            item.user_arr.includes(_vm.user_id)) &&
          (item.allow_type !== "指定商品" ||
            item.goods_arr.includes(_vm.goods_id))
        var m1 = g8 ? _vm.formatDate(item.start_time) : null
        var m2 = g8 ? _vm.formatDate(item.end_time) : null
        var g9 =
          g8 && !(item.type == "满减") ? (item.price / 10).toFixed(1) : null
        return {
          $orig: $orig,
          g8: g8,
          m1: m1,
          m2: m2,
          g9: g9,
        }
      })
    : null
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        g0: g0,
        g1: g1,
        g2: g2,
        g3: g3,
        l0: l0,
        g5: g5,
        g6: g6,
        g7: g7,
        m0: m0,
        l1: l1,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 79:
/*!**********************************************************************************************************!*\
  !*** /Users/ryuchiang/Documents/ryuCodeLand/养生商城-用户端/pages/product/product.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_product_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./product.vue?vue&type=script&lang=js& */ 80);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_product_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_product_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_product_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_product_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_product_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 80:
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!/Users/ryuchiang/Documents/ryuCodeLand/养生商城-用户端/pages/product/product.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uniCloud, wx, uni) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ 32));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 35));
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

var db = uniCloud.database();
var QrcodePoster = function QrcodePoster() {
  __webpack_require__.e(/*! require.ensure | components/zhangyu-qrcode-poster/zhangyu-qrcode-poster */ "components/zhangyu-qrcode-poster/zhangyu-qrcode-poster").then((function () {
    return resolve(__webpack_require__(/*! @/components/zhangyu-qrcode-poster/zhangyu-qrcode-poster.vue */ 606));
  }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};
var _default = {
  components: {
    QrcodePoster: QrcodePoster
  },
  data: function data() {
    return {
      goodsdata: [],
      minPrice: null,
      specSelected: [],
      numberl: 1,
      favorite: false,
      shareList: [],
      specList: [],
      specChildList: [],
      suks_price: null,
      suks_inventory: 0,
      suks_img: '',
      goods_id: '',
      control: false,
      shopCart: false,
      createOrder: false,
      couponList: [],
      user_id: uniCloud.getCurrentUserInfo().uid,
      servNum: null,
      navTop: null,
      navHeight: null,
      borderColor: '',
      evaluateNum: 0,
      goodrate: null,
      currentIndex: 0,
      evaluateList: [],
      hours: null,
      //秒杀时间
      minutes: null,
      //秒杀时间
      seconds: null,
      //秒杀时间
      where: {},
      receiveId: [],
      uqrcodeurl: '',
      //二维码临时路径
      usname: '匿名用户',
      usimg: 'https://mp-f3674fcb-abe5-48a7-af28-4ce3b0ee209a.cdn.bspapp.com/image/logo.png',
      show: false
    };
  },
  onShareTimeline: function onShareTimeline(res) {
    return {
      title: "山前食养商城,优惠多多！",
      imageUrl: '../../static/logo.png'
    };
  },
  onShareAppMessage: function onShareAppMessage(res) {
    this.show = true;
    if (res.from) {
      return {
        title: this.goodsdata.name,
        imageUrl: this.goodsdata.goods_thumb,
        path: '/pages/product/product?id=' + this.goodsdata._id,
        success: function success() {
          console.log('分享成功');
        },
        fail: function fail(err) {
          console.error(err);
        }
      };
    }
  },
  onLoad: function onLoad(e) {
    var _this = this;
    if (e.q) {
      var q = decodeURIComponent(e.q); // 获取到二维码原始链接内容
      var goodsIdPattern = /id=([^&]+)/;
      var userIdPattern = /fxsid=([^&]+)/;
      var goodsIdMatch = goodsIdPattern.exec(q);
      var userIdMatch = userIdPattern.exec(q);
      var goods_id = goodsIdMatch ? goodsIdMatch[1] : null;
      var user_id = userIdMatch ? userIdMatch[1] : null;
      wx.setStorageSync('dicrID', String(user_id));
      this.goodsList(goods_id);
      this.goods_id = goods_id;
      this.receiveData();
      this.toFavorite();
      this.evaluateData(goods_id);
    }
    if (e.fxsid) {
      wx.setStorageSync('dicrID', e.fxsid);
    }
    if (e.control == "true") {
      this.control = true;
      this.hours = Number(e.hours);
      this.minutes = Number(e.minutes);
      this.seconds = Number(e.seconds);
    } else {
      this.control = false;
    }
    if (e.id) {
      this.goodsList(e.id);
      this.goods_id = e.id;
      this.receiveData();
      this.toFavorite();
      this.evaluateData(e.id);
    }
    //获取搜索栏高度
    var menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: function success(res) {
        //导航高度
        var statusBarHeight = res.statusBarHeight;
        _this.navTop = menuButtonObject.top;
        _this.navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2;
      },
      fail: function fail(err) {
        console.log(err);
      }
    });
    //获取用户头像、昵称用于分享海报
    if (this.user_id) {
      db.collection("uni-id-users").doc(this.user_id).field("nickname,avatar_file").get().then(function (res) {
        _this.usname = res.result.data[0].nickname ? res.result.data[0].nickname : '匿名用户';
        _this.usimg = res.result.data[0].avatar_file.url ? res.result.data[0].avatar_file.url : 'https://mp-f3674fcb-abe5-48a7-af28-4ce3b0ee209a.cdn.bspapp.com/image/logo.png';
      });
    }
  },
  methods: {
    changeNav: function changeNav(e) {
      this.currentIndex = e.target.current;
    },
    goodsList: function goodsList(id) {
      var _this2 = this;
      uni.showLoading({
        title: "加载中"
      });
      db.collection("opendb-mall-goods").doc(id).get().then(function (res) {
        _this2.goodsdata = res.result.data[0];
        if (_this2.goodsdata.videos != null && _this2.goodsdata.videos.length > 0) {
          _this2.goodsdata.goods_banner_imgs.unshift(_this2.goodsdata.videos[0]);
        }
        _this2.servNum = _this2.goodsdata.goods_services.length;
        if (_this2.control) {
          _this2.minPrice = _this2.goodsdata.fs_suks.reduce(function (min, item) {
            var price = parseInt(item.price);
            return price < min ? price : min;
          }, Infinity);
          for (var i = 0; i < _this2.goodsdata.orig_fs_suks.length; i++) {
            _this2.specList.push({
              id: i,
              name: _this2.goodsdata.orig_fs_suks[i].name
            });
            for (var ii = 0; ii < _this2.goodsdata.orig_fs_suks[i].values.length; ii++) {
              _this2.specChildList.push({
                id: ii,
                pid: i,
                name: _this2.goodsdata.orig_fs_suks[i].values[ii].name
              });
            }
          }
        } else {
          _this2.minPrice = _this2.goodsdata.suks.reduce(function (min, item) {
            var price = parseInt(item.price);
            return price < min ? price : min;
          }, Infinity);
          for (var _i = 0; _i < _this2.goodsdata.orig_suks.length; _i++) {
            _this2.specList.push({
              id: _i,
              name: _this2.goodsdata.orig_suks[_i].name
            });
            for (var _ii = 0; _ii < _this2.goodsdata.orig_suks[_i].values.length; _ii++) {
              _this2.specChildList.push({
                id: _ii,
                pid: _i,
                name: _this2.goodsdata.orig_suks[_i].values[_ii].name
              });
            }
          }
        }
        uni.hideLoading();
      });
    },
    //获取评价数据
    evaluateData: function evaluateData(id) {
      var _this3 = this;
      db.collection("opendb-mall-comments,uni-id-users").where({
        "goods_id": id
      }).field("goods_id,goods_suk,grade,content,create_date,user_id.nickname as usname,user_id.avatar_file as usimage").get({
        getCount: true
      }).then(function (res) {
        _this3.evaluateList = res.result.data;
        // 评价总数
        _this3.evaluateNum = res.result.count;
        //好评总数
        db.collection("opendb-mall-comments").where({
          "goods_id": id,
          "grade": db.command.gt(2)
        }).get({
          getCount: true
        }).then(function (res) {
          var evaluateGood = res.result.count;
          //好评率
          _this3.goodrate = Math.round(evaluateGood / _this3.evaluateNum * 100);
        });
      });
    },
    //规格弹窗开关
    toggleSpec: function toggleSpec(e) {
      if (this.tokenData()) {
        uni.showToast({
          title: "未登录或登录状态过期",
          icon: "none",
          duration: 1000
        });
        setTimeout(function () {
          uni.navigateTo({
            url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
          });
        }, 1000);
      } else {
        this.$refs.closepopup.open();
        if (e == 1) {
          this.shopCart = true;
        } else {
          this.shopCart = false;
        }
        if (e == 0) {
          this.createOrder = true;
        } else {
          this.createOrder = false;
        }
      }
    },
    toggleSpecs: function toggleSpecs() {
      var _this4 = this;
      this.$refs.closepopup.close();
      if (this.createOrder && this.suks_price) {
        var suk = this.specSelected.map(function (item) {
          return item.name;
        });
        var goodsData = [{
          id: this.goods_id,
          num: this.numberl,
          seckill: this.control,
          suk: {
            price: this.suks_price,
            specs: suk
          }
        }];
        uni.navigateTo({
          url: "/pages/order/createOrder?suk=".concat(JSON.stringify(goodsData), "&&motion=").concat(this.goodsdata.crossed_price * this.numberl - this.suks_price * this.numberl, "&control=").concat(this.control)
        });
      }
      if (this.shopCart && this.suks_price && !this.control) {
        this.$func.myFunction('jlg-cart', {
          functionName: 'addToCart',
          data: {
            user_id: this.user_id,
            goods_id: this.goods_id,
            control: this.control,
            specSelected: this.specSelected,
            suks_price: this.suks_price,
            numberl: this.numberl
          }
        }).then(function (res) {
          if (res.result.message == '加购成功') {
            _this4.shopCart = false;
            uni.showToast({
              title: "加购成功",
              icon: "none",
              duration: 1600
            });
          } else {
            uni.showToast({
              title: "加购失败",
              icon: "none",
              duration: 1600
            });
            _this4.shopCart = false;
          }
        }).catch(function (error) {
          _this4.shopCart = false;
          uni.showModal({
            content: error || '请求服务失败',
            showCancel: false
          });
          console.error(error);
        });
      } else if (this.shopCart && this.control) {
        uni.showToast({
          title: "秒杀商品不能加购",
          icon: "none",
          duration: 1600
        });
      }
    },
    //选择规格
    selectSpec: function selectSpec(index, pid) {
      var _this5 = this;
      var list = this.specChildList;
      list.forEach(function (item) {
        if (item.pid === pid) {
          _this5.$set(item, 'selected', false);
        }
      });
      this.$set(list[index], 'selected', true);
      this.specSelected = [];
      list.forEach(function (item) {
        if (item.selected === true) {
          _this5.specSelected.push(item);
        }
      });
      if (this.control) {
        for (var i = 0; i < this.goodsdata.fs_suks.length; i++) {
          // 获取当前规格组合的规格数组
          var specs = this.goodsdata.fs_suks[i].specs;
          // 判断规格数组长度与已选规格数组长度是否相等，
          // 并且使用 every() 方法逐个比较规格值是否相等
          if (specs.length === this.specSelected.length && specs.every(function (spec, index) {
            return spec === _this5.specSelected[index].name;
          })) {
            // 若规格组合匹配成功，则设置商品价格为当前规格组合的价格
            this.suks_price = this.goodsdata.fs_suks[i].price;
            // 设置库存为当前规格库存
            this.suks_inventory = this.goodsdata.suks[i].inventory;
            //设置缩略图为当前规格图片
            this.suks_img = this.goodsdata.suks[i].goods_thumb;
            // 跳出循环，因为已找到匹配的规格组合
            break;
          }
        }
      } else {
        for (var _i2 = 0; _i2 < this.goodsdata.suks.length; _i2++) {
          // 获取当前规格组合的规格数组
          var _specs = this.goodsdata.suks[_i2].specs;
          // 判断规格数组长度与已选规格数组长度是否相等，
          // 并且使用 every() 方法逐个比较规格值是否相等
          if (_specs.length === this.specSelected.length && _specs.every(function (spec, index) {
            return spec === _this5.specSelected[index].name;
          })) {
            // 若规格组合匹配成功，则设置商品价格为当前规格组合的价格
            this.suks_price = this.goodsdata.suks[_i2].price;
            // 设置库存为当前规格库存
            this.suks_inventory = this.goodsdata.suks[_i2].inventory;
            //设置缩略图为当前规格图片
            this.suks_img = this.goodsdata.suks[_i2].goods_thumb;
            // 跳出循环，因为已找到匹配的规格组合
            break;
          }
        }
      }
    },
    popup: function popup() {
      if (this.tokenData()) {
        uni.showToast({
          title: "未登录或登录状态过期",
          icon: "none",
          duration: 1000
        });
        setTimeout(function () {
          uni.navigateTo({
            url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
          });
        }, 1000);
      } else {
        this.$refs.popup.open();
      }
    },
    // 优惠卷
    couponData: function couponData() {
      var _this6 = this;
      uni.showLoading({
        title: "加载中"
      });
      this.$func.myFunction('jlg-cart', {
        functionName: 'coupondata',
        data: {
          e: 0
        }
      }).then(function (res) {
        _this6.couponList = res.result;
        _this6.couponList.forEach(function (item) {
          if (_this6.receiveId.includes(item._id)) {
            item.states = false;
          } else {
            item.states = true;
          }
        });
        uni.hideLoading();
      }).catch(function (error) {
        uni.hideLoading();
        console.error(error);
      });
    },
    receiveData: function receiveData() {
      var _this7 = this;
      uni.showLoading({
        title: "加载中"
      });
      db.collection("jlg-goods-coupon").where({
        "user_id": this.user_id,
        "is_use": false
      }).get().then(function (res) {
        var Newdata = res.result.data;
        Newdata.forEach(function (item) {
          _this7.receiveId.push(item.coupon_id);
        });
        _this7.couponData();
      });
    },
    addCoupon: function addCoupon(id, maxnum, yl_num, fx_num, usertype, usarr) {
      var _this8 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (_this8.tokenData()) {
                  uni.showToast({
                    title: "未登录或登录状态过期",
                    icon: "none",
                    duration: 1000
                  });
                  setTimeout(function () {
                    uni.navigateTo({
                      url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
                    });
                  }, 1000);
                } else {
                  _this8.$func.myFunction('jlg-cart', {
                    functionName: 'addCoupon',
                    data: {
                      "id": id,
                      "maxnum": maxnum,
                      "yl_num": yl_num,
                      "fx_num": fx_num,
                      "usertype": usertype,
                      "usarr": usarr,
                      "user_id": _this8.user_id
                    }
                  }).then(function (res) {
                    if (res.result.message == '领取成功') {
                      setTimeout(function () {
                        return _this8.receiveData();
                      }, 1600);
                    }
                    uni.showToast({
                      title: res.result.message,
                      icon: "none",
                      duration: 1600
                    });
                    return;
                  }).catch(function (error) {
                    console.error(error);
                  });
                }
              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    formatDate: function formatDate(timestamp) {
      var date = new Date(timestamp);
      var year = date.getFullYear();
      var month = String(date.getMonth() + 1).padStart(2, '0');
      var day = String(date.getDate()).padStart(2, '0');
      return "".concat(year, "-").concat(month, "-").concat(day);
    },
    //收藏
    toFavorite: function toFavorite(add) {
      var _this9 = this;
      db.collection("jlg-goods-collect").where({
        "user_id": this.user_id,
        "article_id": this.goods_id
      }).get().then(function (res) {
        if (res.result.data.length == 0) {
          _this9.favorite = false;
          if (add) {
            if (_this9.tokenData()) {
              uni.showToast({
                title: "未登录或登录状态过期",
                icon: "none",
                duration: 1000
              });
              setTimeout(function () {
                uni.navigateTo({
                  url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
                });
              }, 1000);
            } else {
              db.collection("jlg-goods-collect").add({
                "article_id": _this9.goods_id
              }).then(function () {
                uni.showToast({
                  title: "收藏成功",
                  icon: "none",
                  duration: 1600
                });
                _this9.favorite = true;
              });
            }
          }
        } else {
          _this9.favorite = true;
          if (add) {
            if (_this9.tokenData()) {
              uni.showToast({
                title: "未登录或登录状态过期",
                icon: "none",
                duration: 1000
              });
              setTimeout(function () {
                uni.navigateTo({
                  url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
                });
              }, 1000);
            } else {
              db.collection("jlg-goods-collect").where({
                "user_id": _this9.user_id,
                "article_id": _this9.goods_id
              }).remove().then(function () {
                uni.showToast({
                  title: "取消收藏",
                  icon: "none",
                  duration: 1600
                });
                _this9.favorite = false;
              });
            }
          }
        }
      });
    },
    //分享
    shareClick: function shareClick() {
      this.$refs.sharepopup.open();
    },
    select: function select(e) {
      var _this10 = this;
      var that = this;
      if (e.index == 0) {} else {
        if (this.tokenData()) {
          uni.showToast({
            title: "未登录或登录状态过期",
            icon: "none",
            duration: 1000
          });
          setTimeout(function () {
            uni.navigateTo({
              url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
            });
          }, 1000);
        } else {
          that.$refs.uqrcode.toTempFilePath({
            success: function success(res) {
              _this10.show = true;
              that.$refs.poster.showCanvas(res.tempFilePath);
              that.uqrcodeurl = res.tempFilePath;
            }
          });
        }
      }
    },
    delayed: function delayed() {
      uni.showToast({
        title: "秒杀结束",
        icon: "none",
        duration: 2000
      });
      setTimeout(function () {
        return uni.navigateBack();
      }, 2000);
    },
    //商品评价
    naTov: function naTov(id) {
      uni.navigateTo({
        url: "/pages/order/refundDetail?id=".concat(id)
      });
    },
    tokenData: function tokenData() {
      //效验当前token是否已过期
      var xtime = Date.now();
      var ttime = uniCloud.getCurrentUserInfo().tokenExpired;
      var uid = uniCloud.getCurrentUserInfo().uid;
      if (xtime > ttime || uid == null) {
        return true;
      } else {
        return false;
      }
    },
    navigator: function navigator(type, goodsArr, name) {
      if (this.tokenData()) {
        uni.showToast({
          title: "未登录或登录状态过期",
          icon: "none",
          duration: 1000
        });
        setTimeout(function () {
          uni.navigateTo({
            url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
          });
        }, 1000);
      } else {
        if (type == "所有商品") {
          uni.navigateTo({
            url: "/pages/coupon/prefeList?goodsArr=".concat(null, "&&name=", name)
          });
        } else {
          uni.navigateTo({
            url: "/pages/coupon/prefeList?goodsArr=".concat(JSON.stringify(goodsArr), "&&name=").concat(name)
          });
        }
      }
    },
    buy: function buy() {
      uni.navigateTo({
        url: "/pages/order/createOrder"
      });
    },
    goBack: function goBack() {
      uni.navigateBack();
    },
    showClick: function showClick(e) {
      this.show = e;
    }
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/uni-cloud/dist/index.js */ 31)["uniCloud"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),

/***/ 81:
/*!*******************************************************************************************************************!*\
  !*** /Users/ryuchiang/Documents/ryuCodeLand/养生商城-用户端/pages/product/product.vue?vue&type=style&index=0&lang=scss& ***!
  \*******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_product_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--8-oneOf-1-3!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./product.vue?vue&type=style&index=0&lang=scss& */ 82);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_product_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_product_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_product_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_product_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_product_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 82:
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!./node_modules/postcss-loader/src??ref--8-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!/Users/ryuchiang/Documents/ryuCodeLand/养生商城-用户端/pages/product/product.vue?vue&type=style&index=0&lang=scss& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[75,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/product/product.js.map