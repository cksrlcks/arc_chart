import Chart, {
  ArcElement,
  ChartConfiguration,
  Color,
  EasingFunction,
} from "chart.js/auto";
import "./arc-chart.css";
import { ArcChartOptions, ChartColors } from "./type";
import { DEFAULT_COLORS, DEFAULT_OPTIONS } from "./default";

export default class ArcChart {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private chart: Chart | null = null;

  private container!: HTMLDivElement;
  private wrapper!: HTMLDivElement;
  private textOverlay!: HTMLDivElement;
  private percentEl: HTMLDivElement | null = null;

  private value: number;
  private label: string;
  private showLabel: boolean;
  private showPercentage: boolean;
  private gapDegree: number;
  private usableDegree: number;
  private thresholds: { warning: number; success: number };
  private cutout: string | number;
  private trackColor: string;
  private animationEnabled: boolean;
  private animation: { duration: number; easing: string };
  private defaultAnimation = { duration: 1500, easing: "easeOutQuart" };

  private colors: {
    warning: ChartColors;
    normal: ChartColors;
    success: ChartColors;
  };

  constructor(selector: string, options: ArcChartOptions = {}) {
    const el = document.querySelector(selector);
    if (!(el instanceof HTMLCanvasElement)) {
      throw new Error(
        `[ArcChart] Element with selector "${selector}" is not a canvas.`,
      );
    }

    this.canvas = el;

    const context = this.canvas.getContext("2d");
    if (!context) {
      throw new Error("[ArcChart] Failed to get 2D context from the canvas.");
    }
    this.ctx = context;

    // Initialize options with defaults
    const {
      value = DEFAULT_OPTIONS.value,
      label = DEFAULT_OPTIONS.label,
      showLabel = DEFAULT_OPTIONS.showLabel,
      showPercentage = DEFAULT_OPTIONS.showPercentage,
      gapDegree = DEFAULT_OPTIONS.gapDegree,
      cutout = DEFAULT_OPTIONS.cutout,
      trackColor = DEFAULT_OPTIONS.trackColor,
      thresholds = DEFAULT_OPTIONS.thresholds,
    } = options;

    this.value = value;
    this.label = label;
    this.showLabel = showLabel;
    this.showPercentage = showPercentage;
    this.gapDegree = gapDegree;
    this.usableDegree = 360 - this.gapDegree;
    this.cutout = cutout;
    this.trackColor = trackColor;
    this.thresholds = { ...DEFAULT_OPTIONS.thresholds, ...thresholds };

    this.cutout = options.cutout || "75%";
    this.trackColor = options.trackColor || "#E3E7F8";
    this.animationEnabled = options.animation !== false;

    this.animation =
      typeof options.animation === "object"
        ? { ...this.defaultAnimation, ...options.animation }
        : { ...this.defaultAnimation };

    this.colors = {
      warning: { ...DEFAULT_COLORS.warning, ...options.colors?.warning },
      normal: { ...DEFAULT_COLORS.normal, ...options.colors?.normal },
      success: { ...DEFAULT_COLORS.success, ...options.colors?.success },
    };

    this.chart = null;
    this._wrapElement();
    this.init();
  }

  private getColors(value: number): ChartColors {
    if (value < this.thresholds.warning) return this.colors.warning;
    if (value >= this.thresholds.success) return this.colors.success;

    return this.colors.normal;
  }

  private _wrapElement(): void {
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

    if (this.canvas.parentNode) {
      this.canvas.parentNode.insertBefore(this.container, this.canvas);
      this.container.appendChild(this.wrapper);
      this.container.appendChild(textOverlay);
      this.wrapper.appendChild(this.canvas);
      this.percentEl = textOverlay.querySelector(".chart-value");
    }
  }

  private _renderOverlay(): void {
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
  }

  private _getAnimationConfig() {
    return {
      animateRotate: false,
      duration: this.animationEnabled ? this.animation.duration : 0,
      easing: this.animation.easing as EasingFunction,
    };
  }

  private _updateWrapperLayout() {
    const wrapper = this.wrapper;
    if (!wrapper) return;

    const halfUsableAngle = this.usableDegree / 2;
    const verticalDistance = Math.sin((halfUsableAngle - 90) * (Math.PI / 180));
    const viewRatio = (1 + verticalDistance) / 2 + 0.08;
    const paddingBottom = (Math.max(viewRatio, 0.5) * 100).toFixed(2);

    wrapper.style.paddingBottom = `${paddingBottom}%`;
  }

  private _createGradient(colors: ChartColors): CanvasGradient {
    const chart = this.chart;
    const canvas = this.canvas;

    const left = chart?.chartArea?.left ?? canvas.offsetWidth * 0.1;
    const right = chart?.chartArea?.right ?? canvas.offsetWidth * 0.9;

    const gradient = this.ctx.createLinearGradient(left, 0, right, 0);
    gradient.addColorStop(0, colors.start);
    gradient.addColorStop(1, colors.end);
    return gradient;
  }

  public updateValue(newValue: number | string): void {
    this.value = typeof newValue === "string" ? parseFloat(newValue) : newValue;

    if (!this.chart) return;

    const dataset = this.chart.data.datasets[0];
    dataset.data[1] = this.value * this.usableDegree;
    dataset.data[2] = (1 - this.value) * this.usableDegree;

    const colors = this.getColors(this.value);
    dataset.backgroundColor = [
      "transparent",
      this._createGradient(colors),
      this.trackColor,
    ] as any;

    if (this.percentEl) {
      this.percentEl.innerHTML = `${Math.floor(this.value * 100)}<span class="unit">%</span>`;
    }

    this.chart.update();
  }

  public updateOptions(newOptions: ArcChartOptions = {}) {
    if (!this.chart) return;

    const doughnutOptions = this.chart
      .options as ChartConfiguration<"doughnut">["options"];

    if (!doughnutOptions) return;

    // 라벨 및 표시 설정 업데이트
    if (newOptions.label !== undefined) this.label = newOptions.label;
    if (newOptions.showLabel !== undefined)
      this.showLabel = newOptions.showLabel;
    if (newOptions.showPercentage !== undefined) {
      this.showPercentage = newOptions.showPercentage;
    }

    // 애니메이션 설정 업데이트
    if (newOptions.animation !== undefined) {
      this.animationEnabled = newOptions.animation !== false;

      if (typeof newOptions.animation === "object") {
        this.animation = { ...this.defaultAnimation, ...newOptions.animation };
      }

      doughnutOptions.animation = this._getAnimationConfig();
    }

    // 각도 업데이트
    if (newOptions.gapDegree !== undefined) {
      this.gapDegree = newOptions.gapDegree;
      this.usableDegree = 360 - this.gapDegree;

      if (this.container) {
        this.container.classList.toggle(
          "centered-label",
          this.gapDegree <= 160,
        );
      }

      this._updateWrapperLayout();

      if (this.chart) {
        if (doughnutOptions) {
          doughnutOptions.rotation = 180 - this.gapDegree / 2;
          this.chart.data.datasets[0].data[0] = this.gapDegree;
          this.chart.data.datasets[0].data[2] =
            (1 - this.value) * this.usableDegree;
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
      const bgColors = this.chart.data.datasets[0] as unknown as Color[];
      bgColors[2] = this.trackColor;
    }

    // 색상 업데이트
    if (newOptions.colors) {
      this.colors = {
        warning: { ...this.colors.warning, ...newOptions.colors.warning },
        normal: { ...this.colors.normal, ...newOptions.colors.normal },
        success: { ...this.colors.success, ...newOptions.colors.success },
      };
    }

    // 임계값 업데이트
    if (newOptions.thresholds) {
      this.thresholds = { ...this.thresholds, ...newOptions.thresholds };
    }

    this._renderOverlay();

    this.updateValue(this.value);
  }

  public init(): void {
    const colors = this.getColors(this.value);
    const chartHeight = this.canvas.offsetHeight || 250;
    const gradient = this.ctx.createLinearGradient(0, 0, 0, chartHeight);
    gradient.addColorStop(0, colors.start);
    gradient.addColorStop(1, colors.end);

    const rotationDeg = 180 - this.gapDegree / 2;

    const endBarPlugin = {
      id: "endBar",
      afterDatasetsDraw: (chart: Chart) => {
        const meta = chart.getDatasetMeta(0);
        const arc = meta.data[1] as ArcElement;

        if (!arc || arc.x === undefined || this.value <= 0) return;

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

    const config: ChartConfiguration<"doughnut"> = {
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
        events: [],
        hover: undefined,
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
        const dataset = this.chart.data.datasets[0];

        if (dataset && Array.isArray(dataset.backgroundColor)) {
          const bgColors = dataset.backgroundColor as unknown as Color[];
          bgColors[1] = this._createGradient(colors);
        }

        this.chart.data.datasets[0].data[1] = this.value * this.usableDegree;
        this.chart.data.datasets[0].data[2] =
          (1 - this.value) * this.usableDegree;
        this.chart.update();
      }
    }, 100);
  }
}
