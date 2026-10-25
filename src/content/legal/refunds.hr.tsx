import {
  LegalLink,
  type LegalContent,
  type LegalSection,
} from "@/components/legal/legal-document";
import { LEGAL_ENTITY } from "@/lib/legal";

const { contactEmail } = LEGAL_ENTITY;

const SUMMARY = [
  "Povrat bilo koje naplate plaćenog paketa možete zatražiti u roku od 14 kalendarskih dana od njezina izvršenja.",
  "Besplatno probno razdoblje ne košta ništa: ako otkažete prije njegova završetka, paket Pro se ne naplaćuje.",
  "Zahtjev se podnosi na paddle.net ili e-poštom, a novac se vraća na isto sredstvo plaćanja.",
  "Možete otkazati kad god želite; paket ostaje aktivan do kraja plaćenog razdoblja.",
];

const SECTIONS: LegalSection[] = [
  {
    id: "plazo",
    title: "Rok za povrat",
    brief:
      "14 kalendarskih dana od svake naplate.",
    content: (
      <>
        <p>
          Povrat bilo koje naplate plaćenog paketa Tivvu, bilo da je riječ o
          prvoj uplati ili obnovi, možete zatražiti u roku od 14 kalendarskih
          dana od njezina izvršenja. Ako bude odobren, vraćamo puni iznos te
          naplate, zajedno s plaćenim porezima.
        </p>
        <p>
          Nakon tog roka ne vraćamo novac za već započeta razdoblja, osim ako
          mjerodavno pravo određuje drukčije ili je naplata bila pogreška.
        </p>
      </>
    ),
  },
  {
    id: "prueba-gratis",
    title: "Besplatno probno razdoblje",
    brief:
      "Tijekom 14 dana ništa se ne naplaćuje.",
    content: (
      <>
        <p>
          Besplatno probno razdoblje traje 14 dana i ne košta ništa. Ako otkažete
          prije njegova završetka, paket Pro se ne naplaćuje. Ako ne otkažete,
          po završetku probnog razdoblja počinje paket Pro i naplaćuje se
          njegovo prvo razdoblje; od te naplate vrijedi rok od 14 dana.
        </p>
      </>
    ),
  },
  {
    id: "como-pedirlo",
    title: "Kako zatražiti povrat",
    brief:
      "Na paddle.net ili e-poštom.",
    content: (
      <>
        <p>
          Paddle, koji je merchant of record naših paketa, upravlja naplatama i
          povratima. Povrat možete zatražiti na{" "}
          <LegalLink href="https://paddle.net">paddle.net</LegalLink> uz
          e-adresu kupnje ili nam pisati na{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>{" "}
          pa ćemo vam pomoći.
        </p>
        <p>
          Iznos se vraća na sredstvo plaćanja koje ste koristili. Koliko je
          potrebno da se prikaže ovisi o vašoj banci ili kartici.
        </p>
      </>
    ),
  },
  {
    id: "cancelar",
    title: "Otkazivanje paketa",
    brief:
      "Možete otkazati kad god želite.",
    content: (
      <>
        <p>
          Otkazivanje i traženje povrata dvije su različite stvari. Paket možete
          otkazati u bilo kojem trenutku u postavkama računa; ostaje aktivan do
          kraja već plaćenog razdoblja. Kako se otkazuje i što se događa s vašim
          podacima, vidi <LegalLink href="/terms">Uvjeti korištenja</LegalLink>.
        </p>
      </>
    ),
  },
  {
    id: "tus-derechos",
    title: "Vaša prava",
    brief:
      "Ova politika ne ograničava prava koja vam priznaje zakon.",
    content: (
      <>
        <p>
          Ova politika ne ograničava prava koja vam zakon priznaje kao
          potrošaču, primjerice pravo na raskid ugovora. Ako imate pitanja,
          pišite nam na{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
        </p>
      </>
    ),
  },
];

export const content: LegalContent = {
  metaTitle: "Politika povrata",
  metaDescription:
    "Kada i kako zatražiti povrat plaćanja za Tivvu.",
  title: "Politika povrata",
  intro: (
    <p>
      Kada možete zatražiti povrat plaćanja, kako to učiniti i što vrijedi za
      besplatno probno razdoblje.
    </p>
  ),
  summary: SUMMARY,
  sections: SECTIONS,
  related: { href: "/terms", label: "Uvjeti korištenja" },
};
