import { renderOg, ogSize, ogContentType } from "@/lib/og";

export const alt = "HappyFoam Shop";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return renderOg({ title: "Ruhe zum Mitnehmen.", eyebrow: "Shop" });
}
