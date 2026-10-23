import {
  LegalLink,
  type LegalContent,
  type LegalSection,
} from "@/components/legal/legal-document";
import { LegalTable } from "@/components/legal/legal-table";
import { LEGAL_ENTITY } from "@/lib/legal";

const { name, taxId, address, privacyEmail } = LEGAL_ENTITY;

const SUMMARY = [
  "Vaše podatke koristimo da bismo vam pružili uslugu, naplatili je, održali je sigurnom i obavijestili vas o važnome. Ne prodajemo podatke i ne prikazujemo oglase.",
  "Podaci o klijentima i vlasnicima koje unese agencija pripadaju toj agenciji: ona odlučuje kako ih koristi, a mi ih obrađujemo u njezino ime.",
  "Surađujemo s pružateljima infrastrukture i e-pošte koji mogu biti izvan Argentine, uz ugovore koji štite vaše podatke.",
  "Pristup, ispravak ili brisanje svojih podataka možete zatražiti pisanjem na " +
    privacyEmail +
    ". Pristup je besplatan.",
];

const SECTIONS: LegalSection[] = [
  {
    id: "responsable",
    title: "Tko je odgovoran za vaše podatke",
    brief:
      "Za podatke vaše agencije i naših posjetitelja odgovorni smo mi; za podatke njezinih klijenata odgovorna je agencija, a mi ih obrađujemo u njezino ime.",
    content: (
      <>
        <p>
          Ova Pravila objašnjavaju kako {name}, CUIT {taxId}, sa sjedištem na
          adresi {address} (»Tivvo«, »mi«), obrađuje osobne podatke kad
          koristite tivvo.app, njegove poddomene i stranice agencija objavljene
          putem Tivva. Primjenjuju se u skladu s argentinskim Zakonom 25.326 o
          zaštiti osobnih podataka, njegovom provedbenom Uredbom 1558/2001 i
          pravilima Agencije za pristup javnim informacijama (AAIP).
        </p>
        <p>Tivvo ima dvije različite uloge, ovisno o tome čiji su podaci:</p>
        <ul>
          <li>
            <strong>Mi smo voditelji obrade</strong> podataka agencija i njihovih
            korisnika (račun, naplata, korištenje sustava), osoba koje traže
            demonstraciju ili nam pišu te posjetitelja tivvo.app.
          </li>
          <li>
            <strong>Podatke obrađujemo u ime svake agencije</strong> kad je riječ
            o njezinim klijentima, zainteresiranima, gostima i vlasnicima. U tom
            je slučaju agencija voditelj obrade, a mi djelujemo kao pružatelj
            usluga obrade (članak 25. Zakona 25.326): slijedimo njezine upute i
            te podatke ne koristimo u vlastite svrhe.
          </li>
        </ul>
        <p>
          Ako ste ostavili podatke na stranici neke agencije, primili ponudu ili
          imate rezervaciju, o vašim podacima odlučuje ta agencija. Najbolje je
          najprije pisati njoj; ako pišete nama, proslijedit ćemo joj vaš zahtjev.
        </p>
      </>
    ),
  },
  {
    id: "datos-que-tratamos",
    title: "Koje podatke obrađujemo",
    brief:
      "Račun, prijava, tehnički podaci i komunikacija; a u ime svake agencije i podaci njezinih klijenata. Ne tražimo osjetljive podatke.",
    content: (
      <>
        <h3>Ako Tivvo koristite u agenciji</h3>
        <ul>
          <li>
            <strong>Račun:</strong> ime, e-pošta, lozinka (pohranjena šifrirano
            algoritmom sažimanja, nikad kao običan tekst), uloga i agencija kojoj
            pripadate.
          </li>
          <li>
            <strong>Prijava putem Googlea ili Applea:</strong> ako je odaberete,
            od tog pružatelja primamo vaše ime, e-poštu i identifikator računa.
            Vašu lozinku ne primamo.
          </li>
          <li>
            <strong>Agencija:</strong> naziv, kontakt podaci, logotip, postavke
            stranice i, kod plaćenih paketa, podaci potrebni za naplatu.
          </li>
          <li>
            <strong>Korištenje i tehnički podaci:</strong> datumi prijave,
            relevantne radnje u sustavu, IP adresa, preglednik i zapisi o
            pogreškama, koje koristimo za sigurnost i rješavanje problema.
          </li>
          <li>
            <strong>Komunikacija:</strong> ono što nam pišete e-poštom ili u
            obrascu za demonstraciju (ime, e-pošta, agencija, veličina tima i
            vaša poruka).
          </li>
        </ul>
        <h3>Podaci koje agencije unose ili primaju putem Tivva</h3>
        <p>
          U ime svake agencije obrađujemo podatke njezinih krajnjih klijenata:
          ime, e-poštu, telefon, upite i poruke, bilješke i povijest, ponude,
          rezervacije s datumima i brojem gostiju, evidentirane uplate,
          dokumente koje agencija priloži te podatke o vlasnicima i njihovim
          nekretninama. Koji se podaci unose ovisi o svakoj agenciji.
        </p>
        <p>
          Ne tražimo osjetljive podatke i molimo agencije da ih ne unose, osim
          ako to zakon dopušta i ako je nužno.
        </p>
      </>
    ),
  },
  {
    id: "finalidades",
    title: "Za što ih koristimo",
    brief:
      "Da bismo vam pružili uslugu, naplatili je, održali je sigurnom i obavijestili vas o važnome. Ne prodajemo podatke i ne oglašavamo za treće.",
    content: (
      <>
        <p>Podatke za koje smo odgovorni koristimo kako bismo:</p>
        <ol>
          <li>
            otvorili i vodili vaš račun i račun vaše agencije te vam omogućili
            prijavu;
          </li>
          <li>pružili ugovorenu Uslugu s njezinim funkcijama i ograničenjima;</li>
          <li>naplatili plaćene pakete;</li>
          <li>
            vam slali operativne obavijesti: sigurnost, promjene lozinke, novi
            upiti, promjene paketa ili ovih uvjeta;
          </li>
          <li>vam pružili podršku i odgovorili na pitanja ili zahtjev za demonstraciju;</li>
          <li>zaštitili Uslugu, otkrili zloporabe i spriječili prijevare;</li>
          <li>
            razumjeli kako se Usluga koristi radi njezina poboljšanja, kad god je
            moguće sa skupnim podacima;
          </li>
          <li>
            vam slali novosti o proizvodu, ako se tome niste usprotivili (odjaviti
            se možete iz bilo koje e-poruke);
          </li>
          <li>ispunili zakonske, računovodstvene i porezne obveze.</li>
        </ol>
        <p>
          Podatke krajnjih klijenata koristimo samo kako bi agencija mogla raditi
          s njima: pohraniti ih, prikazati svom timu, objaviti svoje ponude ili
          rezervacije na privatnim poveznicama te u ime agencije slati e-poruke
          s obavijestima i potvrdama o upitima, ponudama i rezervacijama.
        </p>
        <p>
          Ne prodajemo osobne podatke, ne koristimo ih za oglašavanje trećih i ne
          donosimo automatizirane odluke koje proizvode pravne učinke za osobe.
        </p>
      </>
    ),
  },
  {
    id: "bases",
    title: "Na kojoj ih osnovi obrađujemo",
    brief:
      "Ugovor, vaša privola ili zakonska obveza. Obavezni podaci u svakom obrascu su oni koje usluga treba.",
    content: (
      <>
        <p>
          Vaše podatke obrađujemo jer su nužni za ugovorni odnos s vašom
          agencijom (članak 5. stavak 2. točka c Zakona 25.326), jer ste nam dali
          privolu (primjerice slanjem obrasca za demonstraciju) ili jer nas neki
          propis obvezuje da ih čuvamo (primjerice evidenciju o naplati).
        </p>
        <p>
          Podaci označeni kao obavezni u svakom obrascu nužni su za pružanje
          Usluge: ako ih ne navedete, ne možemo otvoriti račun ni odgovoriti na
          vaš zahtjev. Ostali su neobavezni.
        </p>
        <p>
          Kad podatke obrađujemo u ime agencije, ta agencija mora imati pravnu
          osnovu i, kad je potrebno, privolu svojih klijenata.
        </p>
      </>
    ),
  },
  {
    id: "proveedores",
    title: "S kim ih dijelimo",
    brief:
      "Samo s pružateljima usluga koji su nam potrebni za rad, uz ugovore koji štite vaše podatke.",
    content: (
      <>
        <p>
          Podatke dijelimo samo s pružateljima usluga potrebnima za rad Usluge,
          uz ugovore koji od njih zahtijevaju povjerljivost, sigurnost i
          korištenje podataka samo radi pružanja usluge nama:
        </p>
        <LegalTable
          columns={["Pružatelj", "Za što ga koristimo"]}
          rows={[
            [
              "Supabase (na infrastrukturi Amazon Web Servicesa)",
              "Baza podataka i pohrana fotografija i datoteka.",
            ],
            [
              "Resend",
              "Slanje sistemskih e-poruka: obavijesti, potvrde i oporavak lozinke.",
            ],
            [
              "Pružatelji hostinga web-aplikacije",
              "Poslužuju stranice i primaju tehničke podatke svakog posjeta (IP adresa, preglednik).",
            ],
            ["Google i Apple", "Samo ako se odlučite prijaviti njihovim računom."],
          ]}
        />
        <p>
          Osim toga, podaci se prikazuju odgovarajućim osobama ovisno o tome kako
          koristite Uslugu: tim vaše agencije vidi podatke agencije, a tko primi
          poveznicu na ponudu, rezervaciju ili portal vlasnika vidi sadržaj te
          poveznice.
        </p>
        <p>
          Podatke možemo otkriti ako to naloži sud ili nadležno tijelo, ili ako
          je potrebno radi zaštite naših prava. Ako se Tivvo spoji ili bude
          preuzet, podaci će se prenijeti novom subjektu, koji mora poštovati ova
          Pravila.
        </p>
      </>
    ),
  },
  {
    id: "transferencias",
    title: "Međunarodni prijenosi",
    brief:
      "Neki pružatelji usluga nalaze se izvan Argentine; prijenosi se obavljaju uz jamstva jednaka zakonskima.",
    content: (
      <>
        <p>
          Neki naši pružatelji usluga pohranjuju ili obrađuju podatke izvan
          Argentine, među ostalim u Sjedinjenim Američkim Državama i Europskoj
          uniji. AAIP priznaje Europsku uniju kao odredište s odgovarajućom
          razinom zaštite; za ostale zemlje prijenosi se obavljaju na temelju
          ugovornih klauzula koje pružaju jamstva jednaka onima iz Zakona
          25.326, u skladu s modelima odobrenima Odredbom 60-E/2016 i Rješenjem
          198/2023 AAIP-a.
        </p>
        <p>
          Korištenjem Usluge, u smislu članka 12. Zakona 25.326, dajete privolu
          za te prijenose. Ako želite saznati više o jamstvima koja primjenjujemo,
          pišite nam.
        </p>
      </>
    ),
  },
  {
    id: "conservacion",
    title: "Koliko ih dugo čuvamo",
    brief:
      "Svaki podatak ima svoj rok: od 30 dana u košu do 10 godina za naplatu.",
    content: (
      <LegalTable
        columns={["Koji podaci", "Koliko ih dugo čuvamo"]}
        rows={[
          [
            "Podaci računa i agencije",
            "Dok je račun aktivan. Ako se zatvori, ostaju dostupni za izvoz 30 dana, a zatim se brišu; sigurnosne kopije prepisuju se u roku koji ne prelazi 90 dana.",
          ],
          [
            "Stavke izbrisane u sustavu",
            "30 dana u košu, gdje se mogu vratiti; nakon toga trajno se brišu.",
          ],
          [
            "Podaci o naplati",
            "10 godina, kako za računovodstvenu dokumentaciju nalaže članak 328. argentinskog Građanskog i trgovačkog zakonika.",
          ],
          [
            "Tehnički i sigurnosni zapisi",
            "Koliko je potrebno za istragu incidenata, u pravilu ne dulje od 12 mjeseci.",
          ],
          [
            "Zahtjevi za demonstraciju i upiti",
            "Do 2 godine od posljednjeg kontakta, ili ranije ako zatražite brisanje.",
          ],
        ]}
      />
    ),
  },
  {
    id: "seguridad",
    title: "Kako ih štitimo",
    brief:
      "Šifriranje, sažete lozinke, podaci odvojeni po agenciji i ovlasti po ulogama. Ako dođe do incidenta, obavještavamo.",
    content: (
      <>
        <p>
          Primjenjujemo tehničke i organizacijske mjere prema preporukama Rješenja
          47/2018 AAIP-a, među ostalim:
        </p>
        <ul>
          <li>
            šifriranje komunikacije (HTTPS/TLS) između vašeg preglednika,
            aplikacije i naših pružatelja usluga;
          </li>
          <li>lozinke pohranjene kao sažeci, nikad čitljive;</li>
          <li>
            odvajanje podataka po agenciji: svaki tim pristupa samo svojem
            prostoru;
          </li>
          <li>ovlasti po ulogama unutar svake agencije;</li>
          <li>
            privatne poveznice za ponude, rezervacije i vlasnike s
            identifikatorima koje je teško pogoditi;
          </li>
          <li>
            sigurnosne kopije i ograničen pristup osoblja produkcijskim podacima.
          </li>
        </ul>
        <p>
          Nijedan sustav nije nepogrešiv. Ako otkrijemo sigurnosni incident koji
          pogađa osobne podatke, istražujemo ga, poduzimamo mjere da ga
          ograničimo, bez nepotrebnog odgađanja obavještavamo pogođene agencije
          te, kad je potrebno, AAIP i pogođene osobe.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Kolačići i pohrana u vašem pregledniku",
    brief:
      "Samo oni nužni za rad usluge: bez oglašavanja i praćenja trećih strana.",
    content: (
      <>
        <p>
          Tivvo koristi samo kolačiće i lokalnu pohranu nužne za rad Usluge. Ne
          koristimo kolačiće za oglašavanje ni praćenje trećih strana.
        </p>
        <LegalTable
          columns={["Što pohranjuje", "Čemu služi", "Koliko traje"]}
          rows={[
            [
              <>
                Sesija (<code>access_token</code>, <code>refresh_token</code>,{" "}
                <code>tivvo_user</code>)
              </>,
              "Održavaju vas prijavljenima.",
              "Do 180 dana ili dok se ne odjavite.",
            ],
            [
              <>
                Postavke (<code>sidebar_collapsed</code> i lokalna pohrana)
              </>,
              "Pamte je li izbornik sažet, odabrani prikaz svakog popisa i svijetlu ili tamnu temu.",
              "Kolačić izbornika do 1 godine; ostalo dok ga ne izbrišete iz preglednika.",
            ],
            [
              "Prijava putem Googlea ili Applea",
              "Tijekom prijave u kartici pohranjujemo stranicu na koju se treba vratiti.",
              "Briše se po završetku.",
            ],
          ]}
        />
        <p>
          Kolačiće možete izbrisati ili blokirati u svojem pregledniku. Ako
          blokirate kolačiće sesije, nećete se moći prijaviti u sustav. Javne
          stranice agencija ne postavljaju Tivvo kolačiće.
        </p>
      </>
    ),
  },
  {
    id: "derechos",
    title: "Vaša prava i kako ih ostvariti",
    brief:
      "Možete zatražiti pristup, ispravak, brisanje ili da vam prestanemo pisati; odgovaramo u rokovima iz tablice.",
    content: (
      <>
        <p>Kao ispitanik imate pravo na:</p>
        <LegalTable
          columns={["Pravo", "Što možete zatražiti", "Rok za odgovor"]}
          rows={[
            [
              "Pristup",
              "Saznati koje vaše podatke imamo, odakle potječu i za što ih koristimo. Besplatno je ako to tražite u razmacima od najmanje šest mjeseci, osim ako dokažete legitiman interes da to učinite ranije (članak 14. Zakona 25.326).",
              "10 kalendarskih dana",
            ],
            [
              "Ispravak, ažuriranje i brisanje",
              "Da ispravimo netočne podatke ili izbrišemo one koje ne treba čuvati (članak 16.).",
              "5 radnih dana",
            ],
            [
              "Prigovor na komercijalne poruke",
              "Zatražiti da vam prestanemo slati novosti, u bilo kojem trenutku (članak 27.).",
              "U bilo kojem trenutku",
            ],
            [
              "Povlačenje privole",
              "Kad se obrada temelji na njoj, bez retroaktivnog učinka.",
              "U bilo kojem trenutku",
            ],
          ]}
        />
        <p>
          Da biste ih ostvarili, pišite na{" "}
          <LegalLink href={`mailto:${privacyEmail}`}>{privacyEmail}</LegalLink>{" "}
          s e-adrese povezane s vašim podacima i navedite što tražite. Ako ne
          možemo provjeriti vaš identitet, zatražit ćemo dokument koji ga
          potvrđuje. Većinu podataka možete ispraviti i u svojem profilu.
        </p>
        <p>
          Ako je vaše podatke unijela agencija (primjerice, jer ste joj poslali
          upit), zahtjev treba uputiti toj agenciji; ako stigne nama, proslijedit
          ćemo ga u roku od 5 radnih dana i pomoći joj da odgovori.
        </p>
        <p>
          Ako ne odgovorimo u roku ili vas odgovor ne zadovolji, možete podnijeti
          pritužbu Agenciji za pristup javnim informacijama na{" "}
          <LegalLink href="https://www.argentina.gob.ar/aaip/datospersonales">
            argentina.gob.ar/aaip
          </LegalLink>
          .
        </p>
      </>
    ),
  },
  {
    id: "menores",
    title: "Maloljetnici",
    brief: "Tivvo je alat za osobe starije od 18 godina.",
    content: (
      <p>
        Tivvo je profesionalni alat za osobe starije od 18 godina i nije
        namijenjen maloljetnicima. Ako znate da nam je maloljetnik bez dopuštenja
        dao svoje podatke, pišite nam i izbrisat ćemo ih.
      </p>
    ),
  },
  {
    id: "cambios",
    title: "Izmjene ovih Pravila",
    brief: "Bitne izmjene najavljujemo 30 dana unaprijed.",
    content: (
      <p>
        Ova Pravila možemo ažurirati kako bi odražavala promjene Usluge ili
        zakona. Ako je izmjena bitna, obavijestit ćemo vas e-poštom i unutar
        Usluge najmanje 30 dana unaprijed. Datum važeće verzije naveden je na
        vrhu ove stranice.
      </p>
    ),
  },
  {
    id: "contacto",
    title: "Kontakt",
    content: (
      <>
        <p>
          Za sva pitanja o privatnosti pišite nam na{" "}
          <LegalLink href={`mailto:${privacyEmail}`}>{privacyEmail}</LegalLink>{" "}
          ili poštom na adresu {address}.
        </p>
        <p className="border-l-2 border-line pl-4 text-sm text-quiet">
          AGENCIJA ZA PRISTUP JAVNIM INFORMACIJAMA, kao nadzorno tijelo za Zakon
          br. 25.326, ovlaštena je rješavati prijave i pritužbe osoba čija su
          prava povrijeđena nepoštivanjem važećih propisa o zaštiti osobnih
          podataka.
        </p>
      </>
    ),
  },
];

export const content: LegalContent = {
  metaTitle: "Pravila privatnosti",
  metaDescription:
    "Koje osobne podatke Tivvo obrađuje, zašto, s kim ih dijeli i kako ostvariti svoja prava.",
  title: "Pravila privatnosti",
  intro: (
    <>
      <p>
        Koje osobne podatke obrađujemo, zašto, s kim ih dijelimo i kako im
        možete pristupiti, ispraviti ih ili zatražiti njihovo brisanje.
      </p>
      <p>
        Ovaj prijevod služi radi lakšeg razumijevanja. U slučaju neslaganja,
        mjerodavna je španjolska verzija.
      </p>
    </>
  ),
  summary: SUMMARY,
  sections: SECTIONS,
  related: { href: "/terms", label: "Uvjeti korištenja" },
  action: {
    href: `mailto:${privacyEmail}?subject=${encodeURIComponent("Zahtjev u vezi s mojim osobnim podacima")}`,
    label: "Ostvari svoja prava",
    hint: `Pišite nam na ${privacyEmail}: pristup, ispravak ili brisanje.`,
  },
};
