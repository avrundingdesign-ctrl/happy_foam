import { renderOg, ogSize, ogContentType } from "@/lib/og";

export const alt = "HappyFoam für Unternehmen";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return renderOg({ title: "Das stillste Extra für Ihre Gäste-WCs.", eyebrow: "Für Unternehmen" });
}
