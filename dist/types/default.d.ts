import { ArcChartOptions, ArcChartThresholds } from "./type";
export declare const DEFAULT_OPTIONS: Required<Omit<ArcChartOptions, "colors" | "animation"> & {
    thresholds: ArcChartThresholds;
}>;
export declare const DEFAULT_COLORS: {
    warning: {
        start: string;
        end: string;
        bar: string;
    };
    normal: {
        start: string;
        end: string;
        bar: string;
    };
    success: {
        start: string;
        end: string;
        bar: string;
    };
};
