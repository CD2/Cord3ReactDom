(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["@cd2/cord-react-dom"] = factory();
	else
		root["@cd2/cord-react-dom"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Async = __webpack_require__(2);

Object.defineProperty(exports, 'Async', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Async).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2;

var _react = __webpack_require__(3);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var makeCancelable = function makeCancelable(promise) {
  var hasCanceled_ = false;

  var wrappedPromise = new Promise(function (resolve, reject) {
    Promise.resolve(promise).then(function (val) {
      return hasCanceled_ ? undefined : resolve(val);
    }, function (error) {
      return hasCanceled_ ? undefined : reject(error);
    });
  });

  return {
    promise: wrappedPromise,
    cancel: function cancel() {
      hasCanceled_ = true;
    }
  };
};

var Async = (_temp2 = _class = function (_React$Component) {
  _inherits(Async, _React$Component);

  function Async() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Async);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Async.__proto__ || Object.getPrototypeOf(Async)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      loading: true,
      loaded: false,
      errored: false,
      result: null
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Async, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.prom = makeCancelable(this.props.promise);
      this.prom.promise.then(function (result) {
        return _this2.setState({ result: result, loading: false, loaded: true });
      }).catch(function (error) {
        return _this2.setState({ errored: true, loading: false, result: error });
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.prom.promise.catch(function (e) {
        return console.error(e);
      });
      if (this.prom) this.prom.cancel();
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          loading = _state.loading,
          loaded = _state.loaded,
          errored = _state.errored,
          result = _state.result;

      if (loaded) return this.props.then(result);
      if (errored) return this.props.catch(result);
      if (loading) return this.props.loading();
      return null;
    }
  }]);

  return Async;
}(_react2.default.Component), _class.defaultProps = {
  loading: function loading() {
    return null;
  },
  then: function then() {
    return null;
  },
  catch: function _catch() {
    return null;
  }
}, _temp2);
exports.default = Async;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ })
/******/ ]);
});