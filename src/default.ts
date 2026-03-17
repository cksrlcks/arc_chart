import { ArcChartOptions, ArcChartThresholds } from "./type";

export const DEFAULT_OPTIONS: Required<
  Omit<ArcChartOptions, "colors" | "animation"> & {
    thresholds: ArcChartThresholds;
  }
> = {
  value: 0,
  label: "",
  showLabel: true,
  showPercentage: true,
  gapDegree: 220,
  cutout: "75%",
  trackColor: "#E3E7F8",
  thresholds: {
    warning: 0.3,
    success: 0.8,
  },
};

export const DEFAULT_COLORS = {
  warning: { start: "#FF8E53", end: "#FF5F1F", bar: "#FF4500" },
  normal: { start: "#556DFF", end: "#2F4CFF", bar: "#1233FF" },
  success: { start: "#42E695", end: "#3BB2B8", bar: "#2E8B57" },
};
