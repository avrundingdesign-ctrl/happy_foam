import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/ui/LegalPage";
import { Rich } from "@/components/ui/Rich";

export const metadata: Metadata = pageMetadata({
  title: "Widerrufsbelehrung",
  description: "Widerrufsbelehrung und Muster-Widerrufsformular von HappyFoam.",
  path: "/widerruf",
});

export default function Page() {
  return (
    <LegalPage title="Widerrufsbelehrung" placeholder="[WIDERRUF]">
      <h2 id="muster-widerrufsformular">Muster-Widerrufsformular</h2>
      <p className="text-sm text-muted">
        Gesetzliches Muster nach Anlage 2 zu Art. 246a § 1 Abs. 2 Satz 1 Nr. 1 und § 2 Abs. 2 Nr. 2
        EGBGB. Bitte beim Einfügen der Widerrufsbelehrung mit der Version des Rechtstexte-Anbieters
        abgleichen.
      </p>
      <div className="rounded-2xl bg-foam p-6">
        <p>
          (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und
          senden Sie es zurück.)
        </p>
        <ul className="!list-none !pl-0">
          <li>
            – An <Rich text="[HERSTELLER_ANGABEN]" /> (Name, Anschrift und E-Mail-Adresse des
            Unternehmers):
          </li>
          <li>
            – Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den
            Kauf der folgenden Waren (*)/die Erbringung der folgenden Dienstleistung (*)
          </li>
          <li>– Bestellt am (*)/erhalten am (*)</li>
          <li>– Name des/der Verbraucher(s)</li>
          <li>– Anschrift des/der Verbraucher(s)</li>
          <li>– Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)</li>
          <li>– Datum</li>
        </ul>
        <p className="!mb-0">(*) Unzutreffendes streichen.</p>
      </div>
    </LegalPage>
  );
}
