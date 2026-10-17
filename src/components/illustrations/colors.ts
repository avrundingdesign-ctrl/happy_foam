import type { ProductColor } from "@/lib/types";

export const productColors: Record<ProductColor, { main: string; light: string; dark: string }> = {
  mint: { main: "#3DDCB4", light: "#C9F5E9", dark: "#0A7A60" },
  blush: { main: "#FF8FB1", light: "#FFD9E5", dark: "#C2255C" },
  sky: { main: "#7CC8F5", light: "#E1F3FF", dark: "#1D6FA5" },
  sun: { main: "#FFD84D", light: "#FFF3C4", dark: "#9A7A00" },
};
