(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('chart.js/auto')) :
  typeof define === 'function' && define.amd ? define(['chart.js/auto'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ArcChart = factory(global.Chart));
})(this, (function (Chart) { 'use strict';

  function _classCallCheck(a, n) {
    if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
  }
  function _defineProperties(e, r) {
    for (var t = 0; t < r.length; t++) {
      var o = r[t];
      o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
    }
  }
  function _createClass(e, r, t) {
    return r && _defineProperties(e.prototype, r), Object.defineProperty(e, "prototype", {
      writable: false
    }), e;
  }
  function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
      value: t,
      enumerable: true,
      configurable: true,
      writable: true
    }) : e[r] = t, e;
  }
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function (r) {
        return Object.getOwnPropertyDescriptor(e, r).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
        _defineProperty(e, r, t[r]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
      });
    }
    return e;
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r);
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (String )(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _typeof(o) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
      return typeof o;
    } : function (o) {
      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, _typeof(o);
  }

  var DEFAULT_OPTIONS = {
    value: 0,
    label: "",
    showLabel: true,
    showPercentage: true,
    gapDegree: 220,
    cutout: "75%",
    trackColor: "#E3E7F8",
    thresholds: {
      warning: 0.3,
      success: 0.8
    }
  };
  var DEFAULT_COLORS = {
    warning: {
      start: "#FF8E53",
      end: "#FF5F1F",
      bar: "#FF4500"
    },
    normal: {
      start: "#556DFF",
      end: "#2F4CFF",
      bar: "#1233FF"
    },
    success: {
      start: "#42E695",
      end: "#3BB2B8",
      bar: "#2E8B57"
    }
  };

  var ArcChart = /*#__PURE__*/function () {
    function ArcChart(selector) {
      var _options$colors, _options$colors2, _options$colors3;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      _classCallCheck(this, ArcChart);
      _defineProperty(this, "canvas", void 0);
      _defineProperty(this, "ctx", void 0);
      _defineProperty(this, "chart", null);
      _defineProperty(this, "container", void 0);
      _defineProperty(this, "wrapper", void 0);
      _defineProperty(this, "textOverlay", void 0);
      _defineProperty(this, "percentEl", null);
      _defineProperty(this, "value", void 0);
      _defineProperty(this, "label", void 0);
      _defineProperty(this, "showLabel", void 0);
      _defineProperty(this, "showPercentage", void 0);
      _defineProperty(this, "gapDegree", void 0);
      _defineProperty(this, "usableDegree", void 0);
      _defineProperty(this, "thresholds", void 0);
      _defineProperty(this, "cutout", void 0);
      _defineProperty(this, "trackColor", void 0);
      _defineProperty(this, "animationEnabled", void 0);
      _defineProperty(this, "animation", void 0);
      _defineProperty(this, "defaultAnimation", {
        duration: 1500,
        easing: "easeOutQuart"
      });
      _defineProperty(this, "colors", void 0);
      var el = document.querySelector(selector);
      if (!(el instanceof HTMLCanvasElement)) {
        throw new Error("[ArcChart] Element with selector \"".concat(selector, "\" is not a canvas."));
      }
      this.canvas = el;
      var context = this.canvas.getContext("2d");
      if (!context) {
        throw new Error("[ArcChart] Failed to get 2D context from the canvas.");
      }
      this.ctx = context;
      // Initialize options with defaults
      var _options$value = options.value,
        value = _options$value === void 0 ? DEFAULT_OPTIONS.value : _options$value,
        _options$label = options.label,
        label = _options$label === void 0 ? DEFAULT_OPTIONS.label : _options$label,
        _options$showLabel = options.showLabel,
        showLabel = _options$showLabel === void 0 ? DEFAULT_OPTIONS.showLabel : _options$showLabel,
        _options$showPercenta = options.showPercentage,
        showPercentage = _options$showPercenta === void 0 ? DEFAULT_OPTIONS.showPercentage : _options$showPercenta,
        _options$gapDegree = options.gapDegree,
        gapDegree = _options$gapDegree === void 0 ? DEFAULT_OPTIONS.gapDegree : _options$gapDegree,
        _options$cutout = options.cutout,
        cutout = _options$cutout === void 0 ? DEFAULT_OPTIONS.cutout : _options$cutout,
        _options$trackColor = options.trackColor,
        trackColor = _options$trackColor === void 0 ? DEFAULT_OPTIONS.trackColor : _options$trackColor,
        _options$thresholds = options.thresholds,
        thresholds = _options$thresholds === void 0 ? DEFAULT_OPTIONS.thresholds : _options$thresholds;
      this.value = value;
      this.label = label;
      this.showLabel = showLabel;
      this.showPercentage = showPercentage;
      this.gapDegree = gapDegree;
      this.usableDegree = 360 - this.gapDegree;
      this.cutout = cutout;
      this.trackColor = trackColor;
      this.thresholds = _objectSpread2(_objectSpread2({}, DEFAULT_OPTIONS.thresholds), thresholds);
      this.cutout = options.cutout || "75%";
      this.trackColor = options.trackColor || "#E3E7F8";
      this.animationEnabled = options.animation !== false;
      this.animation = _typeof(options.animation) === "object" ? _objectSpread2(_objectSpread2({}, this.defaultAnimation), options.animation) : _objectSpread2({}, this.defaultAnimation);
      this.colors = {
        warning: _objectSpread2(_objectSpread2({}, DEFAULT_COLORS.warning), (_options$colors = options.colors) === null || _options$colors === void 0 ? void 0 : _options$colors.warning),
        normal: _objectSpread2(_objectSpread2({}, DEFAULT_COLORS.normal), (_options$colors2 = options.colors) === null || _options$colors2 === void 0 ? void 0 : _options$colors2.normal),
        success: _objectSpread2(_objectSpread2({}, DEFAULT_COLORS.success), (_options$colors3 = options.colors) === null || _options$colors3 === void 0 ? void 0 : _options$colors3.success)
      };
      this.chart = null;
      this._wrapElement();
      this.init();
    }
    return _createClass(ArcChart, [{
      key: "getColors",
      value: function getColors(value) {
        if (value < this.thresholds.warning) return this.colors.warning;
        if (value >= this.thresholds.success) return this.colors.success;
        return this.colors.normal;
      }
    }, {
      key: "_wrapElement",
      value: function _wrapElement() {
        var halfUsableAngle = this.usableDegree / 2;
        var verticalDistance = Math.sin((halfUsableAngle - 90) * (Math.PI / 180));
        var offset = 0.08;
        var viewRatio = (1 + verticalDistance) / 2 + offset;
        var paddingBottom = (Math.max(viewRatio, 0.5) * 100).toFixed(2);
        this.container = document.createElement("div");
        this.container.className = this.gapDegree <= 160 ? "chart-container centered-label" : "chart-container";
        this.container.style.position = "relative";
        this.wrapper = document.createElement("div");
        this.wrapper.className = "chart-wrapper";
        this.wrapper.style.width = "100%";
        this.wrapper.style.position = "relative";
        this.wrapper.style.overflow = "hidden";
        this.wrapper.style.paddingBottom = "".concat(paddingBottom, "%");
        this.wrapper.style.height = "0";
        var textOverlay = document.createElement("div");
        textOverlay.className = "chart-overlay";
        this.textOverlay = textOverlay;
        this._renderOverlay();
        if (this.canvas.parentNode) {
          this.canvas.parentNode.insertBefore(this.container, this.canvas);
          this.container.appendChild(this.wrapper);
          this.container.appendChild(textOverlay);
          this.wrapper.appendChild(this.canvas);
          this.percentEl = textOverlay.querySelector(".chart-value");
        }
      }
    }, {
      key: "_renderOverlay",
      value: function _renderOverlay() {
        if (!this.textOverlay) return;
        var html = "";
        if (this.showLabel && this.label) {
          html += "<div class=\"chart-label\">".concat(this.label, "</div>");
        }
        if (this.showPercentage) {
          html += "<div class=\"chart-value\">".concat(Math.floor(this.value * 100), "<span class=\"unit\">%</span></div>");
        }
        this.textOverlay.innerHTML = html;
        this.percentEl = this.textOverlay.querySelector(".chart-value");
      }
    }, {
      key: "_getAnimationConfig",
      value: function _getAnimationConfig() {
        return {
          animateRotate: false,
          duration: this.animationEnabled ? this.animation.duration : 0,
          easing: this.animation.easing
        };
      }
    }, {
      key: "_updateWrapperLayout",
      value: function _updateWrapperLayout() {
        var wrapper = this.wrapper;
        if (!wrapper) return;
        var halfUsableAngle = this.usableDegree / 2;
        var verticalDistance = Math.sin((halfUsableAngle - 90) * (Math.PI / 180));
        var viewRatio = (1 + verticalDistance) / 2 + 0.08;
        var paddingBottom = (Math.max(viewRatio, 0.5) * 100).toFixed(2);
        wrapper.style.paddingBottom = "".concat(paddingBottom, "%");
      }
    }, {
      key: "_createGradient",
      value: function _createGradient(colors) {
        var _chart$chartArea$left, _chart$chartArea, _chart$chartArea$righ, _chart$chartArea2;
        var chart = this.chart;
        var canvas = this.canvas;
        var left = (_chart$chartArea$left = chart === null || chart === void 0 || (_chart$chartArea = chart.chartArea) === null || _chart$chartArea === void 0 ? void 0 : _chart$chartArea.left) !== null && _chart$chartArea$left !== void 0 ? _chart$chartArea$left : canvas.offsetWidth * 0.1;
        var right = (_chart$chartArea$righ = chart === null || chart === void 0 || (_chart$chartArea2 = chart.chartArea) === null || _chart$chartArea2 === void 0 ? void 0 : _chart$chartArea2.right) !== null && _chart$chartArea$righ !== void 0 ? _chart$chartArea$righ : canvas.offsetWidth * 0.9;
        var gradient = this.ctx.createLinearGradient(left, 0, right, 0);
        gradient.addColorStop(0, colors.start);
        gradient.addColorStop(1, colors.end);
        return gradient;
      }
    }, {
      key: "updateValue",
      value: function updateValue(newValue) {
        this.value = typeof newValue === "string" ? parseFloat(newValue) : newValue;
        if (!this.chart) return;
        var dataset = this.chart.data.datasets[0];
        dataset.data[1] = this.value * this.usableDegree;
        dataset.data[2] = (1 - this.value) * this.usableDegree;
        var colors = this.getColors(this.value);
        dataset.backgroundColor = ["transparent", this._createGradient(colors), this.trackColor];
        if (this.percentEl) {
          this.percentEl.innerHTML = "".concat(Math.floor(this.value * 100), "<span class=\"unit\">%</span>");
        }
        this.chart.update();
      }
    }, {
      key: "updateOptions",
      value: function updateOptions() {
        var newOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        if (!this.chart) return;
        var doughnutOptions = this.chart.options;
        if (!doughnutOptions) return;
        // 라벨 및 표시 설정 업데이트
        if (newOptions.label !== undefined) this.label = newOptions.label;
        if (newOptions.showLabel !== undefined) this.showLabel = newOptions.showLabel;
        if (newOptions.showPercentage !== undefined) {
          this.showPercentage = newOptions.showPercentage;
        }
        // 애니메이션 설정 업데이트
        if (newOptions.animation !== undefined) {
          this.animationEnabled = newOptions.animation !== false;
          if (_typeof(newOptions.animation) === "object") {
            this.animation = _objectSpread2(_objectSpread2({}, this.defaultAnimation), newOptions.animation);
          }
          doughnutOptions.animation = this._getAnimationConfig();
        }
        // 각도 업데이트
        if (newOptions.gapDegree !== undefined) {
          this.gapDegree = newOptions.gapDegree;
          this.usableDegree = 360 - this.gapDegree;
          if (this.container) {
            this.container.classList.toggle("centered-label", this.gapDegree <= 160);
          }
          this._updateWrapperLayout();
          if (this.chart) {
            if (doughnutOptions) {
              doughnutOptions.rotation = 180 - this.gapDegree / 2;
              this.chart.data.datasets[0].data[0] = this.gapDegree;
              this.chart.data.datasets[0].data[2] = (1 - this.value) * this.usableDegree;
            }
          }
        }
        // 컷아웃 업데이트
        if (newOptions.cutout !== undefined && this.chart) {
          doughnutOptions.cutout = newOptions.cutout;
        }
        // 트랙 색상 업데이트
        if (newOptions.trackColor !== undefined) {
          this.trackColor = newOptions.trackColor;
          var bgColors = this.chart.data.datasets[0];
          bgColors[2] = this.trackColor;
        }
        // 색상 업데이트
        if (newOptions.colors) {
          this.colors = {
            warning: _objectSpread2(_objectSpread2({}, this.colors.warning), newOptions.colors.warning),
            normal: _objectSpread2(_objectSpread2({}, this.colors.normal), newOptions.colors.normal),
            success: _objectSpread2(_objectSpread2({}, this.colors.success), newOptions.colors.success)
          };
        }
        // 임계값 업데이트
        if (newOptions.thresholds) {
          this.thresholds = _objectSpread2(_objectSpread2({}, this.thresholds), newOptions.thresholds);
        }
        this._renderOverlay();
        this.updateValue(this.value);
      }
    }, {
      key: "init",
      value: function init() {
        var _this = this;
        var colors = this.getColors(this.value);
        var chartHeight = this.canvas.offsetHeight || 250;
        var gradient = this.ctx.createLinearGradient(0, 0, 0, chartHeight);
        gradient.addColorStop(0, colors.start);
        gradient.addColorStop(1, colors.end);
        var rotationDeg = 180 - this.gapDegree / 2;
        var endBarPlugin = {
          id: "endBar",
          afterDatasetsDraw: function afterDatasetsDraw(chart) {
            var meta = chart.getDatasetMeta(0);
            var arc = meta.data[1];
            if (!arc || arc.x === undefined || _this.value <= 0) return;
            var x = arc.x,
              y = arc.y,
              outerRadius = arc.outerRadius,
              innerRadius = arc.innerRadius,
              endAngle = arc.endAngle;
            var extraLength = 3;
            var currentColors = _this.getColors(_this.value);
            _this.ctx.save();
            _this.ctx.beginPath();
            _this.ctx.strokeStyle = currentColors.bar;
            _this.ctx.lineWidth = 2;
            var xStart = x + Math.cos(endAngle) * (innerRadius - extraLength);
            var yStart = y + Math.sin(endAngle) * (innerRadius - extraLength);
            var xEnd = x + Math.cos(endAngle) * (outerRadius + extraLength);
            var yEnd = y + Math.sin(endAngle) * (outerRadius + extraLength);
            _this.ctx.moveTo(xStart, yStart);
            _this.ctx.lineTo(xEnd, yEnd);
            _this.ctx.stroke();
            _this.ctx.restore();
          }
        };
        var config = {
          type: "doughnut",
          data: {
            datasets: [{
              data: [this.gapDegree, 0, this.usableDegree],
              backgroundColor: ["transparent", gradient, this.trackColor],
              borderWidth: 0,
              borderColor: "transparent"
            }]
          },
          options: {
            responsive: true,
            events: [],
            hover: undefined,
            cutout: this.cutout,
            rotation: rotationDeg,
            animation: this._getAnimationConfig(),
            plugins: {
              tooltip: {
                enabled: false
              }
            }
          },
          plugins: [endBarPlugin]
        };
        this.chart = new Chart(this.canvas, config);
        setTimeout(function () {
          if (_this.chart) {
            var dataset = _this.chart.data.datasets[0];
            if (dataset && Array.isArray(dataset.backgroundColor)) {
              var bgColors = dataset.backgroundColor;
              bgColors[1] = _this._createGradient(colors);
            }
            _this.chart.data.datasets[0].data[1] = _this.value * _this.usableDegree;
            _this.chart.data.datasets[0].data[2] = (1 - _this.value) * _this.usableDegree;
            _this.chart.update();
          }
        }, 100);
      }
    }]);
  }();

  return ArcChart;

}));
