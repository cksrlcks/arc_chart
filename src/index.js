import Chart from "chart.js/auto";
import "./arc-chart.css";

export default class ArcChart {
  constructor(selector, options = {}) {
    this.canvas = document.querySelector(selector);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");

    this.value = options.value || 0;
    this.label = options.label || "";
    this.showLabel = options.showLabel ?? true;
    this.showPercentage = options.showPercentage ?? true;
    this.gapDegree = options.gapDegree ?? 220;
    this.usableDegree = 360 - this.gapDegree;
    this.thresholds = options.thresholds || {
      warning: 0.3,
      success: 0.8,
    };

    this.cutout = options.cutout || "75%";
    this.trackColor = options.trackColor || "#E3E7F8";
    this.defaultAnimation = { duration: 1500, easing: "easeOutQuart" };
    this.animationEnabled = options.animation !== false;
    this.animation =
      options.animation && options.animation !== false
        ? { ...this.defaultAnimation, ...options.animation }
        : { ...this.defaultAnimation };

    const defaultColors = {
      warning: { start: "#FF8E53", end: "#FF5F1F", bar: "#FF4500" },
      normal: { start: "#556DFF", end: "#2F4CFF", bar: "#1233FF" },
      success: { start: "#42E695", end: "#3BB2B8", bar: "#2E8B57" },
    };

    this.colors = {
      warning: { ...defaultColors.warning, ...options.colors?.warning },
      normal: { ...defaultColors.normal, ...options.colors?.normal },
      success: { ...defaultColors.success, ...options.colors?.success },
    };

    this.chart = null;
    this._wrapElement();
    this.init();
  }

  getColors(value) {
    let status = "normal";
    if (value < this.thresholds.warning) status = "warning";
    else if (value >= this.thresholds.success) status = "success";

    return this.colors[status];
  }

  _wrapElement() {
    const halfUsableAngle = this.usableDegree / 2;
    const verticalDistance = Math.sin((halfUsableAngle - 90) * (Math.PI / 180));
    const offset = 0.08;
    const viewRatio = (1 + verticalDistance) / 2 + offset;
    const paddingBottom = (Math.max(viewRatio, 0.5) * 100).toFixed(2);

    this.container = document.createElement("div");
    this.container.className =
      this.gapDegree <= 160
        ? "chart-container centered-label"
        : "chart-container";
    this.container.style.position = "relative";

    this.wrapper = document.createElement("div");
    this.wrapper.className = "chart-wrapper";
    this.wrapper.style.width = "100%";
    this.wrapper.style.position = "relative";
    this.wrapper.style.overflow = "hidden";
    this.wrapper.style.paddingBottom = `${paddingBottom}%`;
    this.wrapper.style.height = "0";

    const textOverlay = document.createElement("div");
    textOverlay.className = "chart-overlay";
    this.textOverlay = textOverlay;
    this._renderOverlay();

    this.canvas.parentNode.insertBefore(this.container, this.canvas);
    this.container.appendChild(this.wrapper);
    this.container.appendChild(textOverlay);
    this.wrapper.appendChild(this.canvas);

    this.percentEl = textOverlay.querySelector(".chart-value");
    this.labelEl = textOverlay.querySelector(".chart-label");
  }

  _renderOverlay() {
    if (!this.textOverlay) return;

    let html = "";
    if (this.showLabel && this.label) {
      html += `<div class="chart-label">${this.label}</div>`;
    }

    if (this.showPercentage) {
      html += `<div class="chart-value">${Math.floor(this.value * 100)}<span class="unit">%</span></div>`;
    }

    this.textOverlay.innerHTML = html;
    this.percentEl = this.textOverlay.querySelector(".chart-value");
    this.labelEl = this.textOverlay.querySelector(".chart-label");
  }

  _getAnimationConfig() {
    return {
      animateRotate: false,
      duration: this.animationEnabled ? this.animation.duration : 0,
      easing: this.animation.easing,
    };
  }

  _updateWrapperLayout() {
    const wrapper = this.wrapper;
    if (!wrapper) return;

    const halfUsableAngle = this.usableDegree / 2;
    const verticalDistance = Math.sin((halfUsableAngle - 90) * (Math.PI / 180));
    const viewRatio = (1 + verticalDistance) / 2 + 0.08;
    const paddingBottom = (Math.max(viewRatio, 0.5) * 100).toFixed(2);

    wrapper.style.paddingBottom = `${paddingBottom}%`;
  }

  _createGradient(colors) {
    const chart = this.chart;
    const canvas = this.canvas;

    const left = chart?.chartArea?.left ?? canvas.offsetWidth * 0.1;
    const right = chart?.chartArea?.right ?? canvas.offsetWidth * 0.9;

    const gradient = this.ctx.createLinearGradient(left, 0, right, 0);
    gradient.addColorStop(0, colors.start);
    gradient.addColorStop(1, colors.end);
    return gradient;
  }

  updateValue(newValue) {
    this.value = parseFloat(newValue);

    if (!this.chart) return;

    this.chart.data.datasets[0].data[1] = this.value * this.usableDegree;
    this.chart.data.datasets[0].data[2] = (1 - this.value) * this.usableDegree;

    const colors = this.getColors(this.value);
    this.chart.data.datasets[0].backgroundColor[1] =
      this._createGradient(colors);

    if (this.percentEl) {
      this.percentEl.innerHTML = `${Math.floor(this.value * 100)}<span class="unit">%</span>`;
    }

    this.chart.update();
  }

  updateOptions(newOptions = {}) {
    if (newOptions.label !== undefined) this.label = newOptions.label;
    if (newOptions.showLabel !== undefined) this.showLabel = newOptions.showLabel;
    if (newOptions.showPercentage !== undefined) {
      this.showPercentage = newOptions.showPercentage;
    }
    if (newOptions.animation !== undefined) {
      this.animationEnabled = newOptions.animation !== false;
      if (newOptions.animation && newOptions.animation !== true) {
        this.animation = { ...this.defaultAnimation, ...newOptions.animation };
      }
      this.chart.options.animation = this._getAnimationConfig();
    }
    if (newOptions.gapDegree !== undefined) {
      this.gapDegree = newOptions.gapDegree;
      this.usableDegree = 360 - this.gapDegree;

      if (this.container) {
        if (this.gapDegree <= 160) {
          this.container.classList.add("centered-label");
        } else {
          this.container.classList.remove("centered-label");
        }
      }

      this._updateWrapperLayout();
      this.chart.options.rotation = 180 - this.gapDegree / 2;
      this.chart.data.datasets[0].data[0] = this.gapDegree;
      this.chart.data.datasets[0].data[2] =
        (1 - this.value) * this.usableDegree;
    }
    if (newOptions.cutout !== undefined) {
      this.chart.options.cutout = newOptions.cutout;
    }
    if (newOptions.trackColor !== undefined) {
      this.trackColor = newOptions.trackColor;
      this.chart.data.datasets[0].backgroundColor[2] = this.trackColor;
    }
    if (newOptions.colors) {
      this.colors = {
        warning: { ...this.colors.warning, ...newOptions.colors.warning },
        normal: { ...this.colors.normal, ...newOptions.colors.normal },
        success: { ...this.colors.success, ...newOptions.colors.success },
      };
    }
    if (newOptions.thresholds) {
      this.thresholds = { ...this.thresholds, ...newOptions.thresholds };
    }

    this._renderOverlay();

    this.updateValue(this.value);
  }

  init() {
    const colors = this.getColors(this.value);
    const chartHeight = this.canvas.offsetHeight || 250;
    const gradient = this.ctx.createLinearGradient(0, 0, 0, chartHeight);
    gradient.addColorStop(0, colors.start);
    gradient.addColorStop(1, colors.end);

    const rotationDeg = 180 - this.gapDegree / 2;

    const endBarPlugin = {
      id: "endBar",
      afterDatasetsDraw: (chart) => {
        const meta = chart.getDatasetMeta(0);
        const arc = meta.data[1];
        if (!arc || arc.hidden || this.value <= 0) return;

        const { x, y, outerRadius, innerRadius, endAngle } = arc;
        const extraLength = 3;
        const currentColors = this.getColors(this.value);

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = currentColors.bar;
        this.ctx.lineWidth = 2;

        const xStart = x + Math.cos(endAngle) * (innerRadius - extraLength);
        const yStart = y + Math.sin(endAngle) * (innerRadius - extraLength);
        const xEnd = x + Math.cos(endAngle) * (outerRadius + extraLength);
        const yEnd = y + Math.sin(endAngle) * (outerRadius + extraLength);

        this.ctx.moveTo(xStart, yStart);
        this.ctx.lineTo(xEnd, yEnd);
        this.ctx.stroke();
        this.ctx.restore();
      },
    };
    const config = {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [this.gapDegree, 0, this.usableDegree],
            backgroundColor: ["transparent", gradient, this.trackColor],
            borderWidth: 0,
            borderColor: "transparent",
          },
        ],
      },
      options: {
        responsive: true,
        hover: { mode: null },
        cutout: this.cutout,
        rotation: rotationDeg,
        animation: this._getAnimationConfig(),
        plugins: {
          tooltip: { enabled: false },
        },
      },
      plugins: [endBarPlugin],
    };

    this.chart = new Chart(this.canvas, config);

    setTimeout(() => {
      if (this.chart) {
        this.chart.data.datasets[0].backgroundColor[1] =
          this._createGradient(colors);
        this.chart.data.datasets[0].data[1] = this.value * this.usableDegree;
        this.chart.data.datasets[0].data[2] =
          (1 - this.value) * this.usableDegree;
        this.chart.update();
      }
    }, 100);
  }
}
