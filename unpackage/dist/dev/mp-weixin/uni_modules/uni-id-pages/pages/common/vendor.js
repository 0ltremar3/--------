(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["uni_modules/uni-id-pages/pages/common/vendor"],{

/***/ 262:
/*!***********************************************************************************************************!*\
  !*** /Users/ryuchiang/Documents/ryuCodeLand/养生商城-用户端/uni_modules/uni-id-pages/common/login-page.mixin.js ***!
  \***********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _store = __webpack_require__(/*! @/uni_modules/uni-id-pages/common/store.js */ 121);
var _config = _interopRequireDefault(__webpack_require__(/*! @/uni_modules/uni-id-pages/config.js */ 50));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var mixin = {
  data: function data() {
    return {
      config: _config.default,
      uniIdRedirectUrl: '',
      isMounted: false
    };
  },
  onUnload: function onUnload() {},
  mounted: function mounted() {
    this.isMounted = true;
  },
  onLoad: function onLoad(e) {
    var _this = this;
    if (e.is_weixin_redirect) {
      uni.showLoading({
        mask: true
      });
      if (window.location.href.includes('#')) {
        // 将url通过 ? 分割获取后面的参数字符串 再通过 & 将每一个参数单独分割出来
        var paramsArr = window.location.href.split('?')[1].split('&');
        paramsArr.forEach(function (item) {
          var arr = item.split('=');
          if (arr[0] == 'code') {
            e.code = arr[1];
          }
        });
      }
      this.$nextTick(function (n) {
        // console.log(this.$refs.uniFabLogin);
        _this.$refs.uniFabLogin.login({
          code: e.code
        }, 'weixin');
      });
    }
    if (e.uniIdRedirectUrl) {
      this.uniIdRedirectUrl = decodeURIComponent(e.uniIdRedirectUrl);
    }
    if (getCurrentPages().length === 1) {
      // uni.hideHomeButton()
      console.log('已隐藏：返回首页按钮');
    }
  },
  computed: {
    needAgreements: function needAgreements() {
      if (this.isMounted) {
        if (this.$refs.agreements) {
          return this.$refs.agreements.needAgreements;
        } else {
          return false;
        }
      }
    },
    agree: {
      get: function get() {
        if (this.isMounted) {
          if (this.$refs.agreements) {
            return this.$refs.agreements.isAgree;
          } else {
            return true;
          }
        }
      },
      set: function set(agree) {
        if (this.$refs.agreements) {
          this.$refs.agreements.isAgree = agree;
        } else {
          console.log('不存在 隐私政策协议组件');
        }
      }
    }
  },
  methods: {
    loginSuccess: function loginSuccess(e) {
      _store.mutations.loginSuccess(_objectSpread(_objectSpread({}, e), {}, {
        uniIdRedirectUrl: this.uniIdRedirectUrl
      }));
    }
  }
};
var _default = mixin;
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),

/***/ 303:
/*!************************************************************************************************************!*\
  !*** /Users/ryuchiang/Documents/ryuCodeLand/养生商城-用户端/uni_modules/uni-id-pages/pages/register/validator.js ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _password = _interopRequireDefault(__webpack_require__(/*! @/uni_modules/uni-id-pages/common/password.js */ 304));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var _default = _objectSpread({
  "username": {
    "rules": [{
      required: true,
      errorMessage: '请输入用户名'
    }, {
      minLength: 3,
      maxLength: 32,
      errorMessage: '用户名长度在 {minLength} 到 {maxLength} 个字符'
    }, {
      validateFunction: function validateFunction(rule, value, data, callback) {
        // console.log(value);
        if (/^1\d{10}$/.test(value) || /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value)) {
          callback('用户名不能是：手机号或邮箱');
        }
        ;
        if (/^\d+$/.test(value)) {
          callback('用户名不能为纯数字');
        }
        ;
        if (/[\u4E00-\u9FA5\uF900-\uFA2D]{1,}/.test(value)) {
          callback('用户名不能包含中文');
        }
        return true;
      }
    }],
    "label": "用户名"
  },
  "nickname": {
    "rules": [{
      minLength: 3,
      maxLength: 32,
      errorMessage: '昵称长度在 {minLength} 到 {maxLength} 个字符'
    }, {
      validateFunction: function validateFunction(rule, value, data, callback) {
        // console.log(value);
        if (/^1\d{10}$/.test(value) || /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value)) {
          callback('昵称不能是：手机号或邮箱');
        }
        ;
        if (/^\d+$/.test(value)) {
          callback('昵称不能为纯数字');
        }
        ;
        if (/[\u4E00-\u9FA5\uF900-\uFA2D]{1,}/.test(value)) {
          callback('昵称不能包含中文');
        }
        return true;
      }
    }],
    "label": "昵称"
  }
}, _password.default.getPwdRules());
exports.default = _default;

/***/ }),

/***/ 304:
/*!***************************************************************************************************!*\
  !*** /Users/ryuchiang/Documents/ryuCodeLand/养生商城-用户端/uni_modules/uni-id-pages/common/password.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _config = _interopRequireDefault(__webpack_require__(/*! @/uni_modules/uni-id-pages/config.js */ 50));
// 导入配置

var passwordStrength = _config.default.passwordStrength;

// 密码强度表达式
var passwordRules = {
  // 密码必须包含大小写字母、数字和特殊符号
  super: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/])[0-9a-zA-Z~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]{8,16}$/,
  // 密码必须包含字母、数字和特殊符号
  strong: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/])[0-9a-zA-Z~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]{8,16}$/,
  // 密码必须为字母、数字和特殊符号任意两种的组合
  medium: /^(?![0-9]+$)(?![a-zA-Z]+$)(?![~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]+$)[0-9a-zA-Z~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]{8,16}$/,
  // 密码必须包含字母和数字
  weak: /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]{6,16}$/
};
var ERROR = {
  normal: {
    noPwd: '请输入密码',
    noRePwd: '再次输入密码',
    rePwdErr: '两次输入密码不一致'
  },
  passwordStrengthError: {
    super: '密码必须包含大小写字母、数字和特殊符号，密码长度必须在8-16位之间',
    strong: '密码必须包含字母、数字和特殊符号，密码长度必须在8-16位之间',
    medium: '密码必须为字母、数字和特殊符号任意两种的组合，密码长度必须在8-16位之间',
    weak: '密码必须包含字母，密码长度必须在6-16位之间'
  }
};
function validPwd(password) {
  //强度校验
  if (passwordStrength && passwordRules[passwordStrength]) {
    if (!new RegExp(passwordRules[passwordStrength]).test(password)) {
      return ERROR.passwordStrengthError[passwordStrength];
    }
  }
  return true;
}
function getPwdRules() {
  var pwdName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'password';
  var rePwdName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'password2';
  var rules = {};
  rules[pwdName] = {
    rules: [{
      required: true,
      errorMessage: ERROR.normal.noPwd
    }, {
      validateFunction: function validateFunction(rule, value, data, callback) {
        var checkRes = validPwd(value);
        if (checkRes !== true) {
          callback(checkRes);
        }
        return true;
      }
    }]
  };
  if (rePwdName) {
    rules[rePwdName] = {
      rules: [{
        required: true,
        errorMessage: ERROR.normal.noRePwd
      }, {
        validateFunction: function validateFunction(rule, value, data, callback) {
          if (value != data[pwdName]) {
            callback(ERROR.normal.rePwdErr);
          }
          return true;
        }
      }]
    };
  }
  return rules;
}
var _default = {
  ERROR: ERROR,
  validPwd: validPwd,
  getPwdRules: getPwdRules
};
exports.default = _default;

/***/ })

}]);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/uni-id-pages/pages/common/vendor.js.map