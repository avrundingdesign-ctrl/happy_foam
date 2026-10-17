import { renderOg, ogSize, ogContentType } from "@/lib/og";

export const alt = "So funktioniert HappyFoam";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return renderOg({
    title: "Glattes Wasser ist eine Trommel. Schaum ist ein Kissen.",
    eyebrow: "So funktioniert's",
  });
}
