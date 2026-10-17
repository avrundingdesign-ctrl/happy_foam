import { renderOg, ogSize, ogContentType } from "@/lib/og";

export const alt = "HappyFoam – Dein Geschäft bleibt dein Geschäft.";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return renderOg({
    title: "Dein Geschäft bleibt dein Geschäft.",
    eyebrow: "Psst. Niemand muss es hören.",
  });
}
