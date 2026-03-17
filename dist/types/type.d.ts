export type ChartColors = {
    start: string;
    end: string;
    bar: string;
};
export type ArcChartThresholds = {
    warning: number;
    success: number;
};
export type ArcChartOptions = {
    value?: number;
    label?: string;
    showLabel?: boolean;
    showPercentage?: boolean;
    gapDegree?: number;
    thresholds?: Partial<ArcChartThresholds>;
    cutout?: string | number;
    trackColor?: string;
    animation?: boolean | {
        duration?: number;
        easing?: string;
    };
    colors?: {
        warning?: Partial<ChartColors>;
        normal?: Partial<ChartColors>;
        success?: Partial<ChartColors>;
    };
};
