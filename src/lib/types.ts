export type ProductColor = "mint" | "blush" | "sky" | "sun";

export type Product = {
  handle: string;
  title: string;
  tagline: string;
  description: string;
  sachets: number;
  /** Endpreis in EUR (bei priceIsNet: Nettopreis). null = auf Anfrage */
  price: number | null;
  priceIsNet?: boolean;
  /** Platzhalter-Kennung für den Preis, z. B. [PREIS_POCKET] */
  pricePlaceholder?: string;
  currency: string;
  /** Füllmenge in Gramm – Grundlage für den Grundpreis (PAngV). null = noch offen */
  netWeightGrams: number | null;
  /** "cart" = Warenkorb · "inquiry" = Anfrageformular */
  purchase: "cart" | "inquiry";
  badge?: string;
  color: ProductColor;
  typeDesignation: string;
  batch: string;
  highlights: string[];
  availableForSale: boolean;
  /** Produktbilder aus /public. Leer = gezeichnete Platzhalter-Renderings */
  images: { url: string; alt: string; width?: number; height?: number }[];
  /** Gefahrenkennzeichnung nach CLP – standardmäßig leer */
  clp?: {
    pictograms: string[];
    signalWord?: string;
    hazardStatements: string[];
    precautionaryStatements: string[];
  };
};

export type CartLine = {
  handle: string;
  title: string;
  price: number;
  quantity: number;
  color: ProductColor;
};
