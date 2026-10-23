import {
  Building2,
  CalendarCheck,
  CalendarDays,
  Compass,
  Eye,
  Globe,
  Inbox,
  Keyboard,
  KeyRound,
  Settings,
  Sparkles,
  Tag,
  Upload,
  UserRound,
  Users,
  UsersRound,
} from "lucide-react";

import {
  DocFigure,
  DocH3,
  DocList,
  DocP,
  DocPill,
  DocSection,
  DocStep,
  DocSteps,
  DocTerms,
  DocTip,
  Kbd,
} from "@/components/docs/docs-parts";

import type { DocEntry } from "./types";

function Basics() {
  return (
    <DocSection
      id="primeros-pasos"
      icon={Compass}
      title="Prvi koraci"
      intro="Tivvo na jednom mjestu okuplja upite koje primate, vaše klijente, portfelj nekretnina, ponude koje šaljete, rezervacije i dostupnost. Sve što objavite pojavljuje se na web-stranici vaše agencije."
    >
      <DocFigure
        src="/docs-media/hr/panel.webp"
        alt="Nadzorna ploča Tivva s bočnim izbornikom, popisom nekretnina i karticom profila"
        width={1584}
        height={946}
        markers={[
          { x: 8.9, y: 11.6, label: "Bočni izbornik: svaki alat nadzorne ploče." },
          { x: 15.5, y: 4.7, label: "Sažmi ili proširi izbornik (Ctrl/⌘ + B)." },
          { x: 15.1, y: 11.6, label: "Koliko nepročitanih upita imate." },
          { x: 34.2, y: 6, label: "Traka popisa: pretraga, poredak, filtri, prikazi, koš i uvoz." },
          { x: 87.1, y: 6, label: "Izradi novo." },
          { x: 14.7, y: 94.7, label: "Zvonce obavijesti." },
          { x: 8.8, y: 93.7, label: "Vaša kartica profila: vaš račun, izgled, pomoć i ova dokumentacija." },
        ]}
      />

      <DocH3>Bočni izbornik</DocH3>
      <DocP>
        Alati prate redoslijed kojim agencija radi: stigne <strong>upit</strong>, postane <strong>klijent</strong>, ponudite
        mu <strong>nekretnine</strong> u <strong>ponudi</strong> i sve završi <strong>rezervacijom</strong>. Zatim dolaze{" "}
        <strong>Dostupnost</strong> i <strong>Usluge</strong>. Ako ste vlasnik računa ili administrator, na kraju vidite i{" "}
        <strong>Web-stranicu</strong>, <strong>Tim</strong> i <strong>Postavke</strong>.
      </DocP>
      <DocP>
        »Upiti« prikazuju broj kad imate nepročitanih upita; ažurira se sam svake minute. Izbornik možete sažeti gumbom na
        vrhu ili s <Kbd>Ctrl/⌘</Kbd> <Kbd>B</Kbd> da dobijete prostor, a Tivvo pamti kako ste ga ostavili. Na mobitelu se
        izbornik otvara ikonom na vrhu.
      </DocP>

      <DocH3>Obavijesti</DocH3>
      <DocP>
        Zvonce pokraj vašeg imena javlja što se dogodilo dok niste gledali: novi upit, klijent koji je otvorio ponudu ili
        odgovorio na nju, evidentirana uplata, rezervacija i zadaci koji su vam dodijeljeni. Broj pokazuje koliko obavijesti
        niste pročitali; ažurira se svake minute.
      </DocP>
      <DocFigure
        src="/docs-media/hr/notificaciones.webp"
        alt="Popis obavijesti s novim upitima i otvorenom ponudom"
        width={760}
        height={982}
        className="max-w-sm"
        markers={[
          { x: 79.2, y: 8.1, label: "»Označi sve« ih označava kao pročitane." },
          { x: 50, y: 23.2, label: "Svaka obavijest vodi vas na ono što se dogodilo (upit, ponuda, rezervacija). Točka znači da je niste pročitali." },
        ]}
      />
      <DocP>
        Da biste izbrisali obavijest, prijeđite mišem preko nje i kliknite križić desno (na mobitelu je križić uvijek
        vidljiv). Briše se samo za vas: ostatak tima i dalje vidi svoju, a ne može se vratiti.
      </DocP>

      <DocH3>Vaša kartica profila</DocH3>
      <DocP>
        Na dnu izbornika je vaše ime. Klikom na njega otvara se izbornik računa: vaš profil, postavke, promjena agencije
        (ako radite za više njih), pregled ili kopiranje poveznice na vašu stranicu, izgled, jezik, ova dokumentacija,
        pretraga, tipkovni prečaci, pomoć i odjava.
      </DocP>
      <DocFigure
        src="/docs-media/hr/menu-perfil.webp"
        alt="Izbornik računa otvoren s kartice profila"
        width={640}
        height={1252}
        className="max-w-xs"
        markers={[
          { x: 50, y: 28.5, label: "Moj profil: vaši podaci i lozinka." },
          { x: 50, y: 34.2, label: "Postavke agencije (vlasnici računa i administratori)." },
          { x: 50, y: 41.4, label: "Otvaranje ili kopiranje poveznice na vašu stranicu." },
          { x: 75, y: 55.3, label: "Izgled: svijetli, tamni ili automatski (prati vaše računalo)." },
          { x: 50, y: 69.2, label: "Ova dokumentacija, u drugoj kartici." },
          { x: 50, y: 74.9, label: "Pretraga i, ispod nje, tipkovni prečaci." },
          { x: 50, y: 86.4, label: "Pomoć i podrška: česta pitanja i kontakt s Tivvom." },
          { x: 50, y: 93.6, label: "Odjava." },
        ]}
      />
      <DocTip>
        Ako radite za više agencija, u ovom se izborniku pojavljuje »Promijeni agenciju«. Svaka agencija ima svoje podatke:
        pri promjeni se nadzorna ploča ponovno učitava s podacima druge.
      </DocTip>

      <DocH3>Uloge</DocH3>
      <DocTerms
        items={[
          ["Vlasnik računa", "Vlasnik računa. Ima pristup svemu i ne može se ukloniti iz tima."],
          [
            "Administrator",
            "Kao vlasnik: vidi sve, upravlja timom, stranicom, postavkama i uvozom te ponovno dodjeljuje nekretnine i klijente.",
          ],
          [
            "Agent",
            "Vidi samo nekretnine koje su mu dodijeljene, svoje ponude i rezervacije, svoje klijente i nedodijeljene potencijalne klijente. Ne vidi Web-stranicu, Tim, Postavke, Uvoz ni izvatke računa vlasnika.",
          ],
        ]}
      />

      <DocH3>Što se ponavlja na cijeloj nadzornoj ploči</DocH3>
      <DocTerms
        items={[
          [
            "Traka radnji",
            "U uređivačima se na vrhu pojavljuje traka sa Spremi, Objavi i Odustani. Kad nešto nije spremljeno, gumb Spremi postaje aktivan. Ctrl/⌘ + S sprema bez dodirivanja miša.",
          ],
          [
            "Prikazi",
            "Popisi se mogu prikazati kao mreža, popis ili tablica (tipke 1, 2 i 3). Tivvo pamti odabrani prikaz u svakom pregledniku.",
          ],
          [
            "Pretraga i filtri",
            "Svaki popis ima pretragu i filtre za sužavanje prikaza. Svaki filtar pokazuje koliko stavki ima svaka opcija. »Ukloni filtre« ponovno prikazuje sve.",
          ],
          [
            "Koš",
            "Ono što izbrišete iz Nekretnina, Ponuda i Rezervacija ide u koš, ne nestaje. Ondje ostaje 30 dana za slučaj da se predomislite; nakon toga se trajno briše. Pri brisanju obavijest na dnu nudi »Poništi«.",
          ],
          [
            "»Prikazuje se na stranici« / »Samo interno«",
            "Svaki blok obrasca kaže vam vide li ono što unosite vaši klijenti ili ostaje samo vašem timu.",
          ],
          [
            "Pomoć",
            "Gumb s upitnikom u svakom alatu otvara dio ovog vodiča koji govori o njemu.",
          ],
        ]}
      />

      <DocH3>Koš</DocH3>
      <DocP>
        Otvara se ikonom koša na traci Nekretnina, Ponuda i Rezervacija. Broj na ikoni pokazuje koliko je stavki unutra.
      </DocP>
      <DocFigure
        src="/docs-media/hr/papelera.webp"
        alt="Koš nekretnina s jednom izbrisanom nekretninom"
        width={1304}
        height={281}
        markers={[
          { x: 41.5, y: 87.1, label: "Kada ste je izbrisali i koliko joj je dana preostalo." },
          { x: 78.9, y: 82, label: "»Vrati« je vraća na popis, kakva je bila." },
          { x: 88.8, y: 82, label: "»Trajno izbriši« je odmah briše, bez čekanja 30 dana. Tražimo potvrdu." },
        ]}
      />
    </DocSection>
  );
}

function Inquiries() {
  return (
    <DocSection
      id="consultas"
      icon={Inbox}
      title="Upiti"
      intro="Pretinac za sve što vam pišu s vaše stranice, s kartice nekretnine ili iz ponude."
    >
      <DocFigure
        src="/docs-media/hr/consultas.webp"
        alt="Pretinac upita s otvorenim upitom"
        width={1304}
        height={946}
        markers={[
          { x: 20.7, y: 7.4, label: "Svi ili samo novi, s brojem nepročitanih." },
          { x: 29, y: 7.4, label: "Označi sve kao pročitano." },
          { x: 18.9, y: 13.5, label: "Pretražite po imenu, e-pošti, poruci, nekretnini ili ponudi." },
          { x: 54.4, y: 21.7, label: "Na što se upit odnosi: nekretninu, ponudu ili opći upit." },
          { x: 92.4, y: 8.6, label: "Ponovno ga označite kao novi da ga ne zaboravite." },
          { x: 47.4, y: 87.4, label: "Odgovorite e-poštom, WhatsAppom ili pozivom; ili idite na karticu klijenta." },
        ]}
      />

      <DocH3>Što se događa kad stigne upit</DocH3>
      <DocList>
        <li>Pojavljuje se u Upitima kao novi i dodaje se broju u bočnom izborniku i zvoncu.</li>
        <li>
          Klijent se izrađuje, ili ažurira ako već postoji s tom e-poštom. U njegovoj povijesti ostaje bilješka s
          nekretninom ili ponudom za koju je pitao.
        </li>
        <li>
          Agencija prima obavijest e-poštom (na e-poštu za kontakt iz Postavki ili, ako je nema, vlasnicima računa i
          administratorima), a klijent prima potvrdu.
        </li>
      </DocList>

      <DocH3>Rad s pretincem</DocH3>
      <DocList>
        <li>
          Lijevo je popis, grupiran u Danas, Jučer, Ovaj tjedan i Starije; desno otvoreni upit. Na mobitelu se izmjenjuju:
          dodirnite upit da ga pročitate i strelicu za povratak.
        </li>
        <li>Otvaranjem se upit označava kao pročitan. Omotnica gore desno ponovno ga označava kao novi.</li>
        <li>Upiti klijenta kojeg već imate prikazuju njegovu fazu (Potencijalni, Kontaktiran…) pokraj imena.</li>
        <li>
          Odgovorite jednim klikom: <strong>Odgovori e-poštom</strong> (s već upisanim predmetom i pozdravom),{" "}
          <strong>WhatsApp</strong> (s porukom koja navodi predmet upita) ili <strong>Nazovi</strong>. WhatsApp i Nazovi
          pojavljuju se ako je ostavio telefon. Ikona pokraj e-pošte kopira je.
        </li>
        <li>Kliknite nekretninu ili ponudu da je otvorite na nadzornoj ploči, ili »Pogledaj klijenta« za njegovu karticu.</li>
        <li>Pretinac se sam ažurira svake minute.</li>
      </DocList>
      <DocTip>
        Ako još nije stigao nijedan upit, podijelite poveznicu na svoju stranicu: obrazac za kontakt i obrazac svake
        kartice stižu ovamo.
      </DocTip>
    </DocSection>
  );
}

function Clients() {
  return (
    <DocSection
      id="clientes"
      icon={Users}
      title="Klijenti"
      intro="Vaš imenik i praćenje kontakata: u kojoj je fazi tko, što traži, što treba učiniti i svaki razgovor."
    >
      <DocFigure
        src="/docs-media/hr/clientes-lista.webp"
        alt="Popis klijenata u mreži"
        width={1304}
        height={946}
        markers={[
          { x: 26.3, y: 6, label: "Pretražite po imenu, e-pošti ili telefonu." },
          { x: 66.2, y: 6, label: "Filtrirajte po fazi." },
          { x: 90.1, y: 6, label: "Ručno dodajte klijenta." },
          { x: 77.2, y: 86.9, label: "Faza svakog klijenta." },
          { x: 39.1, y: 72.8, label: "Odakle je došao: stranica, ponuda ili ručni unos; i koliko je prošlo od zadnje aktivnosti." },
        ]}
      />

      <DocH3>Kako dolaze</DocH3>
      <DocList>
        <li>
          <strong>Ručni unos:</strong> »Novi klijent« s imenom, e-poštom i telefonom.
        </li>
        <li>
          <strong>Sa stranice ili iz ponude:</strong> kad vam netko piše, Tivvo izrađuje klijenta (ili ga prepoznaje po
          e-pošti) i ostavlja bilješku u njegovoj povijesti s nekretninom ili ponudom za koju je pitao.
        </li>
      </DocList>

      <DocH3>Faze</DocH3>
      <DocTerms
        items={[
          [<DocPill key="l" tone="amber">Potencijalni</DocPill>, "Tek je stigao; još niste razgovarali."],
          [<DocPill key="c" tone="primary">Kontaktiran</DocPill>, "Već je bilo prvog kontakta."],
          [<DocPill key="n">U pregovorima</DocPill>, "Razgovarate o konkretnoj ponudi."],
          [<DocPill key="k" tone="primary">Klijent</DocPill>, "Zaključio je posao s vama."],
          [<DocPill key="p">Izgubljen</DocPill>, "Nije išlo dalje. Na popisu se prikazuje blijeđe."],
        ]}
      />
      <DocP>
        Fazu promijenite u izborniku <strong>⋯</strong> svakog klijenta (»Promijeni fazu«) ili na njegovoj kartici. U istom
        izborniku možete pogledati karticu, poslati mu e-poštu, nazvati ga ili kopirati e-poštu.
      </DocP>

      <DocH3>Kartica klijenta</DocH3>
      <DocFigure
        src="/docs-media/hr/clientes-ficha.webp"
        alt="Kartica klijenta s bilješkama, zadacima i poviješću"
        width={1304}
        height={1651}
        markers={[
          { x: 5.3, y: 15.8, label: "Bilješke: ono što vrijedi zapamtiti." },
          { x: 4.8, y: 34.3, label: "Zadaci s rokom; zakašnjeli crveno." },
          { x: 5.4, y: 58.2, label: "Povijest: bilješke, pozivi, e-pošta i sastanci." },
          { x: 82.4, y: 14.1, label: "Promjena faze." },
          { x: 82.4, y: 20.1, label: "Odgovorni agent." },
        ]}
      />
      <DocTerms
        items={[
          [
            "Bilješke",
            "Ono što vrijedi zapamtiti: što traži, budžet, preferencije. Podržava naslove, podebljano, popise i poveznice. Kad nešto promijenite, pojavljuje se »Spremi bilješke«.",
          ],
          [
            "Zadaci",
            "Što treba učiniti s ovim klijentom: nazvati, poslati fotografije, dogovoriti razgledavanje. Upišite zadatak, po želji odaberite rok i kliknite +. Označite kvačicom kad je gotov. Zakašnjeli se prikazuju crveno (»Kasni 2 dana«), a današnji i sutrašnji to navode.",
          ],
          [
            "Povijest",
            "Odaberite vrstu (bilješka, poziv, e-pošta ili sastanak), napišite što se dogodilo i kliknite »Evidentiraj«. Poredano od najnovijeg prema najstarijem, s osobom koja je unijela.",
          ],
          ["Faza", "Kliknite novu fazu u desnom panelu; sprema se odmah."],
          [
            "Odgovorna osoba",
            "Agent koji vodi klijenta. Vlasnici računa i administratori biraju ga s popisa tima; agent može kliknuti »Preuzmi« na nedodijeljenom potencijalnom klijentu.",
          ],
          ["Kontakt", "Njegova e-pošta i telefon, jednim klikom do poruke ili poziva."],
        ]}
      />
      <DocTip>
        Izbrisani zadaci ne idu u koš: nestaju odmah. Ako ste ga samo obavili, radije ga označite kao gotov.
      </DocTip>
    </DocSection>
  );
}

function Properties() {
  return (
    <DocSection
      id="propiedades"
      icon={Building2}
      title="Nekretnine"
      intro="Vaš portfelj: svaka kuća, stan, zemljište ili sezonski najam koji prodajete ili iznajmljujete, sa svim podacima, fotografijama, cijenama i dostupnošću."
    >
      <DocH3>Dodavanje nekretnine</DocH3>
      <DocSteps>
        <DocStep>
          Kliknite <strong>Nova nekretnina</strong> (ili tipku <Kbd>N</Kbd> na popisu).
        </DocStep>
        <DocStep>
          Odaberite što ćete s njom: <strong>Prodaja</strong> ili <strong>Najam</strong>. To mijenja dostupne kategorije i
          odjeljke uređivača.
        </DocStep>
        <DocStep>Upišite naslov i odaberite kategoriju (kuća, apartman, vila, hotel, zemljište…).</DocStep>
        <DocStep>
          Kliknite <strong>Izradi nekretninu</strong>. Izrađuje se kao <DocPill tone="amber">Skica</DocPill> i otvara se
          uređivač da dovršite ostalo.
        </DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/hr/propiedades-nueva.webp"
        alt="Prozor Nova nekretnina"
        width={784}
        height={968}
        className="max-w-md"
        markers={[
          { x: 69.5, y: 29.3, label: "Prodaja ili najam." },
          { x: 50, y: 47.2, label: "Naslov koji vide vaši klijenti." },
          { x: 50, y: 55.5, label: "Kategorija; ovisi o prodaji ili najmu." },
          { x: 78.9, y: 92.4, label: "Izrađuje nekretninu i otvara uređivač." },
        ]}
      />
      <DocTip>
        Imate nekretnine u drugom sustavu? Upotrijebite <strong>Uvoz</strong> da ih prenesete sve odjednom. Vidi »Uvoz
        nekretnina« niže.
      </DocTip>

      <DocH3>Statusi</DocH3>
      <DocTerms
        items={[
          [<DocPill key="d" tone="amber">Skica</DocPill>, "Vidi je samo vaš tim. Idealno dok je dovršavate."],
          [<DocPill key="p" tone="primary">Objavljena</DocPill>, "Pojavljuje se na vašoj stranici i može se dodati u ponude."],
          [<DocPill key="a">Arhivirana</DocPill>, "Više nije na tržištu, ali čuvate sve njezine podatke. Može se ponovno objaviti."],
        ]}
      />

      <DocH3>Popis</DocH3>
      <DocFigure
        src="/docs-media/hr/propiedades-lista.webp"
        alt="Popis nekretnina u prikazu mreže"
        width={1276}
        height={946}
        markers={[
          { x: 18.3, y: 6, label: "Pretraga po naslovu, području, regiji, državi ili vlasniku." },
          { x: 42.5, y: 6, label: "Poredak: najnovije, najstarije, cijena ili naslov." },
          { x: 50.2, y: 6, label: "Filtri (tipka F)." },
          { x: 57.6, y: 6, label: "Prikaz tablice, popisa ili mreže." },
          { x: 65, y: 6, label: "Koš: ono što je izbrisano u zadnjih 30 dana." },
          { x: 71.6, y: 6, label: "Uvoz nekretnina iz drugog sustava (vlasnici računa i administratori)." },
          { x: 83.9, y: 6, label: "Nova nekretnina (tipka N)." },
          { x: 36.5, y: 69.3, label: "Status svake nekretnine." },
        ]}
      />
      <DocList>
        <li>
          Svaka kartica prikazuje naslovnu fotografiju, vrstu posla i kategoriju, lokaciju, cijenu, spavaće sobe, kupaonice,
          površinu, vlasnika i kada je zadnji put ažurirana.
        </li>
        <li>Prikazuje se 25 po stranici. Pri pomicanju pretraga ostaje na vrhu da se ne morate vraćati.</li>
        <li>
          U izborniku <strong>⋯</strong> svake nekretnine: uredi, pogledaj na stranici (ako je objavljena), objavi, povuci
          objavu, arhiviraj, ponovno objavi ili izbriši. Ikona strelice također otvara javnu karticu.
        </li>
      </DocList>
      <DocFigure
        src="/docs-media/hr/propiedades-filtros.webp"
        alt="Ploča s filtrima nekretnina"
        width={560}
        height={1604}
        className="max-w-xs"
        markers={[
          { x: 50.1, y: 3.8, label: "Status, vrsta i kategorija: možete odabrati više; bez odabira prikazuje se sve." },
          { x: 50.1, y: 31.1, label: "Lokacija i vlasnik." },
          { x: 27.5, y: 51.8, label: "Raspon cijena, u valuti koju odaberete." },
          { x: 50.1, y: 56.7, label: "Najmanje spavaćih soba i kupaonica." },
          { x: 16, y: 96, label: "Očisti sve vraća na nulu." },
          { x: 61.1, y: 96, label: "Primjenjuje filtre i kaže koliko nekretnina ostaje." },
        ]}
      />
      <DocP>Aktivni filtri pojavljuju se kao oznake iznad popisa; kliknite križić oznake da je uklonite.</DocP>

      <DocH3>Skupne radnje</DocH3>
      <DocP>
        U prikazu tablice označite više nekretnina kućicom u svakom retku (ili sve kućicom na vrhu). Na dnu se pojavljuje
        traka za zajedničko objavljivanje, povlačenje objave, arhiviranje ili brisanje. <Kbd>Esc</Kbd> poništava odabir.
      </DocP>
      <DocFigure
        src="/docs-media/hr/propiedades-lote.webp"
        alt="Dvije odabrane nekretnine i traka skupnih radnji"
        width={1276}
        height={946}
        markers={[
          { x: 2.2, y: 30, label: "Označite nekretnine." },
          { x: 47.9, y: 94.2, label: "Traka skupnih radnji." },
        ]}
      />

      <DocH3>Uređivač</DocH3>
      <DocP>
        Na vrhu je traka uređivača s grupiranim odjeljcima: <strong>Opće informacije</strong>, <strong>Multimedija</strong>,{" "}
        <strong>Najam</strong> (samo za najam), <strong>Upravljanje</strong> i <strong>Kontakt</strong>. Prijeđite mišem (ili
        dodirnite) grupu sa strelicom da vidite njezine odjeljke. Spremite sa <strong>Spremi</strong> ili{" "}
        <Kbd>Ctrl/⌘</Kbd> <Kbd>S</Kbd>. <strong>Objavi</strong> sprema i objavljuje u jednom koraku; ako je već objavljena,
        gumb postaje <strong>Povuci objavu</strong>. Ako pokušate izaći s nespremljenim promjenama, upozorit ćemo vas.
      </DocP>
      <DocFigure
        src="/docs-media/hr/propiedades-editor.webp"
        alt="Uređivač nekretnine u odjeljku Osnovno"
        width={1760}
        height={990}
        markers={[
          { x: 22.3, y: 5.1, label: "Natrag na popis nekretnina." },
          { x: 32.6, y: 5.1, label: "Odjeljci uređivača, grupirani." },
          { x: 84.9, y: 5.1, label: "Pomoć, Odustani, Spremi i Objavi ili Povuci objavu." },
          { x: 39.7, y: 46.5, label: "Odgovorna osoba: agent koji je vodi." },
          { x: 85.8, y: 27.8, label: "Ovako izgleda kartica u vašem portfelju, uživo dok uređujete." },
        ]}
      />
      <DocTerms
        items={[
          [
            "Osnovno",
            "Naslov, interni naziv (kako je zove vaš tim; klijent ga nikad ne vidi), odgovorna osoba, vrsta posla, kategorija, spavaće sobe, kupaonice, površine, parkirna mjesta, spremišta, katovi, godina izgradnje i obnove, energetski certifikat. Kod najma i gosti i zvjezdice.",
          ],
          [
            "Lokacija",
            "Kako se prikazuje (lokacija vidljiva klijentima), gdje se nalazi (točna adresa i oznaka na karti, samo interno), okolina (značajke područja i pogledi) i poveznice (Google Maps, brošura u PDF-u i web-stranica).",
          ],
          [
            "Sadržaji",
            "Opći sadržaji (kratki popis na kartici: upišite svaki i pritisnite Enter), unutarnji i vanjski sadržaji, bazeni i jacuzziji s vrstom i dimenzijama, spavaće sobe po vrsti, raspored prostorija te usluge i uvjeti.",
          ],
          [
            "Sadržaj i usluge",
            "Sažetak (istaknut na vrhu kartice) i opis, s naslovima i popisima. Kod najma i usluge uključene u cijenu te uvjeti rezervacije i otkazivanja.",
          ],
          [
            "Cijene",
            "Prodajna cijena ili osnovna cijena po noći, i valuta. Ako ostavite prazno, kartica prikazuje »Cijena na upit«.",
          ],
          ["Fotografije", "Vidi niže. Promjene u ovom odjeljku spremaju se odmah, bez klika na Spremi."],
          [
            "Upravljanje",
            "Interni podaci: tko svakodnevno upravlja nekretninom, pružatelj i licenca, provizija i smije li se nuditi izvan vaše stranice.",
          ],
          [
            "Preporuke",
            "Predložena poboljšanja s detaljima, procijenjenim troškom, prioritetom i statusom (predloženo, odobreno ili obavljeno). Vlasnik ih vidi na svojoj stranici.",
          ],
          ["Sobe", "Samo za hotele, unutar Upravljanja: sobe hotela."],
          ["Vlasnik", "Vlasnik nekretnine, njegova pristupna poveznica i izvadak računa. Vidi »Vlasnici«."],
        ]}
      />
      <DocP>
        <strong>Odgovorna osoba</strong> (u Osnovnom) određuje koji je agent vidi: agent radi samo s nekretninama koje su mu
        dodijeljene. Biraju je vlasnici računa i administratori, a sprema se pri odabiru.
      </DocP>

      <DocH3>Lokacija</DocH3>
      <DocFigure
        src="/docs-media/hr/propiedades-ubicacion.webp"
        alt="Odjeljak Lokacija s vidljivom lokacijom, adresom i kartom"
        width={1452}
        height={1100}
        markers={[
          { x: 26.9, y: 14.1, label: "Što vide vaši klijenti: vidljiva lokacija." },
          { x: 26.9, y: 40.2, label: "Točna adresa i oznaka, samo za vaš tim." },
          { x: 80.5, y: 48.2, label: "Potražite adresu, kliknite na kartu ili povucite oznaku." },
        ]}
      />
      <DocP>
        Za koordinate možete zalijepiti i poveznicu na Google Maps. Točna adresa nikad se ne prikazuje na stranici: klijenti
        vide samo vidljivu lokaciju (primjerice »Mallorca, Baleari«).
      </DocP>

      <DocH3>Fotografije i videozapisi</DocH3>
      <DocFigure
        src="/docs-media/hr/propiedades-fotos.webp"
        alt="Galerija fotografija nekretnine"
        width={1452}
        height={946}
        markers={[
          { x: 4.4, y: 16.3, label: "Ono što ovdje učitate vidi se na stranici i sprema se odmah." },
          { x: 66.4, y: 29, label: "Odjeljci galerije; »Dodaj« izrađuje novi." },
          { x: 40.2, y: 46.6, label: "Povucite ili odaberite fotografije: učitavaju se u označeni odjeljak." },
          { x: 5.5, y: 64.3, label: "Naslovna fotografija." },
        ]}
      />
      <DocList>
        <li>
          Povucite fotografije u okvir ili kliknite za odabir (JPG, PNG, WebP ili HEIC). Automatski se optimiziraju prije
          učitavanja.
        </li>
        <li>
          Fotografije su grupirane po odjeljcima (Općenito, Spavaće sobe, Dnevni boravak, Bazen, Vanjski prostor, Dodatni
          sadržaji, Pogledi ili vaš). Povucite ih da ih poredate unutar odjeljka ili upotrijebite »Premjesti u drugi
          odjeljak«.
        </li>
        <li>Prva fotografija je naslovna. Da je promijenite, upotrijebite »Postavi kao naslovnu« na drugoj.</li>
        <li>Da uklonite fotografiju, kliknite križić i potvrdite drugim klikom.</li>
        <li>
          <strong>Vodeni žig:</strong> stavlja logotip vaše agencije na objavljene fotografije.
        </li>
        <li>
          <strong>Videozapisi:</strong> zalijepite poveznice s YouTubea, Vimea ili drugih platformi.
        </li>
      </DocList>

      <DocH3>Samo za najam</DocH3>
      <DocTerms
        items={[
          [
            "Dostupnost",
            "Ručno blokirajte datume s neobaveznom bilješkom. Potvrđene rezervacije same blokiraju svoje datume. Da izbjegnete dvostruke rezervacije, zalijepite iCal poveznicu s Airbnba ili Bookinga i kliknite »Sinkroniziraj sada«. Ako je nekretnina objavljena, imate i poveznicu za izvoz svoje dostupnosti na te platforme.",
          ],
          [
            "Cjenik",
            "Cjenovna razdoblja (npr. »Visoka sezona«) s datumima, službenom cijenom po noći, minimalnim boravkom, naknadom za upravljanje i provizijom agencije.",
          ],
        ]}
      />
      <DocFigure
        src="/docs-media/hr/propiedades-disponibilidad.webp"
        alt="Odjeljak Dostupnost za najam"
        width={1452}
        height={625}
        markers={[
          { x: 23.3, y: 8.5, label: "Ručno blokiranje datuma, s neobaveznom bilješkom." },
          { x: 4.7, y: 48.4, label: "Zauzeti datumi: »BOOKING« dolazi iz rezervacije, »MANUAL« iz vaše blokade, koju možete ukloniti." },
          { x: 23.3, y: 66.5, label: "Zalijepite iCal poveznicu s Airbnba ili Bookinga i sinkronizirajte." },
          { x: 23.3, y: 82.7, label: "Vaš kalendar, za dodavanje na te platforme." },
        ]}
      />
      <DocFigure
        src="/docs-media/hr/propiedades-tarifas.webp"
        alt="Odjeljak Cjenik s tri sezone"
        width={1452}
        height={681}
        markers={[
          { x: 26.9, y: 10.5, label: "Novo razdoblje: oznaka, datumi, cijena po noći i minimalni boravak." },
          { x: 14.6, y: 41, label: "Naknada za upravljanje (zadano 10 %) i provizija agencije (zadano 20 %), u %." },
          { x: 14.8, y: 90.3, label: "Unesene sezone, s cijenom i minimalnim boravkom. »Ukloni« briše jednu." },
        ]}
      />
      <DocTip>
        Da vidite sve nekretnine za najam u jednom kalendaru, upotrijebite <strong>Dostupnost</strong> u izborniku.
      </DocTip>

      <DocH3>Preporuke</DocH3>
      <DocFigure
        src="/docs-media/hr/propiedades-recomendaciones.webp"
        alt="Odjeljak Preporuke s dva poboljšanja"
        width={1452}
        height={847}
        markers={[{ x: 10.8, y: 64.5, label: "Svako poboljšanje s detaljima, procijenjenim troškom i prioritetom." }]}
      />
      <DocP>
        Služe za predlaganje poboljšanja vlasniku: obnova namještaja, punjač za automobile… Svako ima prioritet (visok,
        srednji ili nizak) i status koji mijenjate: predloženo, odobreno ili obavljeno. Vlasnik ih vidi na svojoj stranici,
        pod »Predložena poboljšanja«.
      </DocP>

      <DocTip>
        Najprije ispunite Osnovno, Lokaciju, Cijene i Fotografije: s tim kartica već dobro izgleda na vašoj stranici.
        Ostalo možete dodavati s vremenom.
      </DocTip>
    </DocSection>
  );
}

function Owners() {
  return (
    <DocSection
      id="propietarios"
      icon={KeyRound}
      title="Vlasnici"
      intro="Vlasnici nekretnina koje nudite. Svaki ima privatnu stranicu na kojoj prati svoje nekretnine, rezervacije i ono što mu pripada, bez korisničkog imena i lozinke."
    >
      <DocH3>Dodjela vlasnika</DocH3>
      <DocSteps>
        <DocStep>
          U uređivaču nekretnine otvorite <strong>Kontakt</strong> → <strong>Vlasnik</strong>.
        </DocStep>
        <DocStep>Potražite ga po imenu, e-pošti ili telefonu, ili kliknite »Novi vlasnik« da ga odmah dodate.</DocStep>
        <DocStep>Spremite nekretninu. Isti vlasnik može imati više nekretnina.</DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/hr/propietarios-asignar.webp"
        alt="Odjeljak Vlasnik s dodijeljenim vlasnikom i njegovom pristupnom poveznicom"
        width={1452}
        height={1111}
        markers={[
          { x: 25.1, y: 14.3, label: "Dodijeljeni vlasnik; »Ukloni« ga odvaja." },
          { x: 36.9, y: 38.4, label: "Kopirajte njegovu osobnu poveznicu da mu je pošaljete." },
          { x: 48.4, y: 38.4, label: "Obnovi: prethodna poveznica prestaje raditi." },
          { x: 7, y: 46.4, label: "Njegov izvadak računa." },
        ]}
      />

      <DocH3>Izvadak računa</DocH3>
      <DocP>
        Ispod pristupa je izvadak računa vlasnika, sa svim njegovim nekretninama zajedno. Vide ga samo vlasnici računa i
        administratori agencije.
      </DocP>
      <DocFigure
        src="/docs-media/hr/propietarios-cuenta.webp"
        alt="Izvadak računa vlasnika s naplaćenim, provizijom, isplaćenim i saldom"
        width={1100}
        height={1148}
        className="max-w-2xl"
        markers={[
          { x: 16.3, y: 18.1, label: "Naplaćeno od rezervacija njegovih nekretnina, od ukupno rezerviranog." },
          { x: 83.7, y: 18.1, label: "Što mu pripada: naplaćeno umanjeno za proviziju." },
          { x: 50, y: 30.4, label: "Što mu još treba isplatiti." },
          { x: 50, y: 79.1, label: "Isplate: ono što ste mu već platili. Koš briše jednu." },
          { x: 14, y: 96.4, label: "Evidentiranje uplate vlasniku." },
        ]}
      />
      <DocTerms
        items={[
          ["Naplaćeno", "Zbroj uplata označenih kao naplaćene na njegovim rezervacijama (predujmovi i ostaci)."],
          ["Provizija", "Provizija agencije na tim rezervacijama; odbija se od naplaćenog."],
          ["Vama pripada", "Naplaćeno umanjeno za proviziju."],
          ["Već isplaćeno", "Zbroj isplata koje ste evidentirali."],
          ["Za isplatu", "Ono što mu još dugujete. Ako ste mu platili previše, to se navodi."],
          ["Po rezervaciji", "Detalji svake rezervacije: datumi, koliko je naplaćeno od koliko i provizija."],
        ]}
      />
      <DocSteps>
        <DocStep>
          Kliknite <strong>Evidentiraj isplatu</strong>. Preostali saldo i valuta već su upisani.
        </DocStep>
        <DocStep>Po potrebi prilagodite iznos i odaberite datum.</DocStep>
        <DocStep>Upišite način (prijenos, gotovina…) i po želji bilješku, pa kliknite »Evidentiraj«.</DocStep>
      </DocSteps>

      <DocH3>Stranica vlasnika</DocH3>
      <DocP>
        U »Pristup vlasnika« nalazi se njegova osobna poveznica: kopirajte je i pošaljite mu. Ondje vidi svoje nekretnine i
        njihov status (objavljena ili ne, s objavljenom cijenom), tekući ili sljedeći boravak, rezervacije s datumima i
        uplatama, svoj izvadak računa i predložena poboljšanja koja ste unijeli u Preporuke. Gumbom vam može pisati putem
        WhatsAppa ili e-pošte.
      </DocP>
      <DocFigure
        src="/docs-media/hr/propietarios-pagina.webp"
        alt="Stranica vlasnika sa sažetkom njegovih nekretnina i izvatkom računa"
        width={1584}
        height={946}
        markers={[
          { x: 24, y: 38.9, label: "Koliko je njegovih nekretnina objavljeno." },
          { x: 50, y: 38.9, label: "Tekući ili sljedeći boravak." },
          { x: 75.2, y: 38.9, label: "Što mu pripada od naplaćenog." },
          { x: 50, y: 66.1, label: "Njegov izvadak računa: isplaćeno, saldo i detalji po rezervaciji." },
          { x: 82.8, y: 4.2, label: "Gumb da vam piše." },
        ]}
      />
      <DocP>
        Prema zadanim postavkama vlasnik <strong>ne vidi vašu proviziju</strong>: vidi što mu pripada, ali ne i koliko je
        odbijeno. Ako mu je želite prikazati, uključite »Prikaži proviziju agencije« u Postavkama.
      </DocP>
      <DocTip>
        Ako je poveznica stigla pogrešnoj osobi, kliknite »Obnovi«: stara odmah prestaje raditi.
      </DocTip>
    </DocSection>
  );
}

function Importer() {
  return (
    <DocSection
      id="importar"
      icon={Upload}
      title="Uvoz nekretnina"
      adminOnly
      intro="Prenesite svoj portfelj iz drugog sustava odjednom: iz CRM-a, portala ili tablice. Ništa se ne sprema dok ne provjerite što će se dogoditi sa svakom nekretninom."
    >
      <DocP>
        Otvara se putem <strong>Uvoz</strong> na traci Nekretnina. Postupak ima četiri koraka: odabir izvora, donošenje
        datoteke, određivanje što je koji stupac (samo za tablice) i provjera.
      </DocP>

      <DocH3>1. Odaberite odakle prelazite</DocH3>
      <DocFigure
        src="/docs-media/hr/importar-plataformas.webp"
        alt="Popis platformi s kojih možete prijeći"
        width={1276}
        height={946}
        markers={[
          { x: 16.5, y: 18.6, label: "Potražite svoj sustav po nazivu ili državi." },
          { x: 50.9, y: 18.6, label: "Filtrirajte po CRM-ovima, portalima ili agregatorima." },
          { x: 35.8, y: 44, label: "Odaberite svoju platformu: pokazat ćemo vam kako izvući podatke iz nje." },
        ]}
      />
      <DocP>
        Ima gotovo 50 platformi (Idealista, Inmovilla, Kyero, CASAFARI, Resales Online, Witei, Apimo, Rightmove i mnoge
        druge), najkorištenije prve. Ako vaše nema, niže možete upotrijebiti <strong>CSV ili Excel</strong>,{" "}
        <strong>Kyero XML</strong> (format koji izvozi većina CRM-ova) ili <strong>Tivvo XML</strong>, ako vaš sustav ima
        vlastiti API.
      </DocP>

      <DocH3>2. Donesite svoje podatke</DocH3>
      <DocFigure
        src="/docs-media/hr/importar-fuente.webp"
        alt="Vodič za prijenos s Idealiste, s okvirom za učitavanje datoteke"
        width={1276}
        height={946}
        markers={[
          { x: 28.6, y: 21.3, label: "Koraci za izvlačenje nekretnina s te platforme." },
          { x: 9.2, y: 42.9, label: "Drugi put, ako vam platforma daje CSV ili Excel." },
          { x: 28.6, y: 50, label: "Zapeli ste? Pripremit ćemo zahtjev platformi ili vam pomoći sami." },
          { x: 70, y: 22.6, label: "Učitajte datoteku ili zalijepite URL feeda." },
          { x: 77.9, y: 39.5, label: "Čitamo datoteku; još se ništa ne sprema." },
        ]}
      />
      <DocList>
        <li>
          Slijedite korake vodiča svoje platforme. Mnoge traže feed preko podrške: u »Zapeli ste?« kliknite{" "}
          <strong>Pošalji zahtjev e-poštom</strong> i otvorit će se vaša e-pošta s već napisanom porukom, ili je kopirajte
          putem »Pogledaj poruku«.
        </li>
        <li>
          <strong>Učitaj datoteku:</strong> CSV ili Excel (.xlsx) do 10 MB i 3.000 redaka, ili XML do 10 MB.
        </li>
        <li>
          <strong>Koristi URL:</strong> zalijepite javnu poveznicu feeda. Čitamo je samo jednom; ne ostaje sinkronizirana.
        </li>
        <li>
          Ako počinjete od nule, kliknite <strong>Preuzmi CSV predložak</strong>: sadrži stupce koje razumijemo i primjer
          retka.
        </li>
        <li>»Zatraži pomoć« omogućuje vam da nam pišete s već pripremljenom porukom: pomoći ćemo vam s prijenosom.</li>
      </DocList>

      <DocH3>3. Što je koji stupac</DocH3>
      <DocP>Samo za tablice (CSV ili Excel). Tivvo sam prepoznaje većinu stupaca; provjerite ostale.</DocP>
      <DocFigure
        src="/docs-media/hr/importar-mapeo.webp"
        alt="Korak dodjele svakog stupca datoteke polju u Tivvu"
        width={1304}
        height={1110}
        markers={[
          { x: 49, y: 13.7, label: "Koliko smo redaka i stupaca prepoznali." },
          { x: 12.9, y: 25.8, label: "Neprepoznati stupci su prvi, s primjerima iz vaše datoteke." },
          { x: 80.2, y: 25.8, label: "Odaberite kojem polju Tivva odgovara, ili »Ne uvozi«." },
          { x: 14.2, y: 95.4, label: "Pogledajte što će se dogoditi sa svakim retkom, prije spremanja." },
        ]}
      />
      <DocList>
        <li>Svako polje dolazi iz samo jednog stupca: ako ga odaberete u drugom, oslobađa se u prethodnom.</li>
        <li>Nedodijeljeni stupci se zanemaruju. Prazna ćelija nikad ne briše ono što je već uneseno.</li>
        <li>
          Dodijelite <strong>referentni stupac (ID)</strong>: tako se pri ponovnom uvozu nekretnine ažuriraju umjesto da se
          dupliciraju. Ako ga nema, upozorit ćemo vas.
        </li>
      </DocList>

      <DocH3>4. Provjerite i uvezite</DocH3>
      <DocFigure
        src="/docs-media/hr/importar-revision.webp"
        alt="Pregled uvoza sa sažetkom i detaljima po retku"
        width={1304}
        height={853}
        markers={[
          { x: 9.4, y: 20.9, label: "Sažetak: nove, za ažuriranje, bez promjena, preskočene i s greškom. Kliknite za filtriranje." },
          { x: 18.8, y: 31.2, label: "Odmah ih objavite ili ostavite kao skice." },
          { x: 25.9, y: 38.2, label: "Premjestite u koš ono čega više nema u datoteci." },
          { x: 8.4, y: 49.3, label: "Redak po redak, s upozorenjima, greškama i promjenama." },
          { x: 14.7, y: 94.1, label: "Tek se ovdje sve sprema." },
        ]}
      />
      <DocTerms
        items={[
          ["Nova", "Nije bila u Tivvu: izrađuje se."],
          ["Ažurira", "Već ste je uvezli (ista referenca): mijenja se ono što navode detalji, primjerice cijena ili fotografije."],
          ["Bez promjena", "U Tivvu je već jednaka."],
          ["Preskočena", "Ne uvozi se, primjerice jer se ponavlja u datoteci."],
          ["S greškom", "Nedostaje nešto obavezno, poput naslova. Detalji navode što."],
        ]}
      />
      <DocList>
        <li>
          <strong>Objavi nove pri uvozu:</strong> kad je isključeno, ostaju kao skice da ih pregledate prije prikaza na
          stranici.
        </li>
        <li>
          <strong>Premjesti u koš ono čega više nema u datoteci:</strong> odnosi se samo na nekretnine koje ste ranije
          unijeli s iste platforme, a tražimo potvrdu. Mogu se vratiti tijekom 30 dana.
        </li>
        <li>
          Klikom na <strong>Uvezi</strong> Tivvo sprema nekretnine i preuzima njihove fotografije. Ako ih je mnogo, može
          potrajati nekoliko minuta: ne zatvarajte karticu. Ako pokušate izaći prije kraja, upozorit ćemo vas.
        </li>
      </DocList>
      <DocFigure
        src="/docs-media/hr/importar-listo.webp"
        alt="Završni zaslon uvoza sa sažetkom i greškama"
        width={1100}
        height={395}
        className="max-w-2xl"
        markers={[
          { x: 50, y: 47, label: "Što je obavljeno, s detaljima grešaka." },
          { x: 37.4, y: 68.5, label: "Preuzmite greške u CSV-u da ih ispravite." },
          { x: 37.6, y: 81.5, label: "Pregledajte skice ili pogledajte svoju stranicu; »Uvezi drugu datoteku« počinje ispočetka." },
        ]}
      />
    </DocSection>
  );
}

function Offers() {
  return (
    <DocSection
      id="ofertas"
      icon={Tag}
      title="Ponude"
      intro="Prilagođeni prijedlozi za klijenta: izbor nekretnina i usluga po vašim cijenama, predstavljen na zasebnoj stranici koju klijent otvara putem poveznice."
    >
      <DocH3>Izrada ponude</DocH3>
      <DocSteps>
        <DocStep>
          Kliknite <strong>Nova ponuda</strong>, dajte joj naslov (npr. »Prijedlog za obitelj Pérez«), odaberite vrstu posla
          (prodaja, najam ili oboje) i po želji referentni kod. Vrsta posla određuje koje nekretnine možete dodati.
        </DocStep>
        <DocStep>
          U <strong>Općenito</strong> odaberite klijenta, valutu i želite li prikazati cijene i identitet svoje agencije
          (zaglavlje, podnožje i kontakt podatke).
        </DocStep>
        <DocStep>
          U <strong>Dobrodošlica</strong> napišite pozdrav: naslov, datum ili sezonu i poruku.
        </DocStep>
        <DocStep>
          U <strong>Nekretnine</strong> izradite odjeljke (npr. »Uz more«) i dodajte nekretnine.
        </DocStep>
        <DocStep>
          U <strong>Usluge</strong> dodajte doživljaje iz svoje knjižnice: kuhar, transferi, jahta…
        </DocStep>
        <DocStep>
          Kliknite <strong>Pošalji ponudu</strong> (ako ima klijenta) ili <strong>Objavi poveznicu</strong> (ako nema).
        </DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/hr/ofertas-nueva.webp"
        alt="Prozor Nova ponuda"
        width={784}
        height={838}
        className="max-w-md"
        markers={[
          { x: 50, y: 31.1, label: "Naslov." },
          { x: 50, y: 59, label: "Neobavezni referentni kod, poput onoga iz vašeg sustava." },
          { x: 50, y: 48.6, label: "Prodaja, najam ili oboje: određuje koje nekretnine možete dodati." },
        ]}
      />
      <DocFigure
        src="/docs-media/hr/ofertas-lista.webp"
        alt="Popis ponuda"
        width={1304}
        height={946}
        markers={[
          { x: 24.1, y: 6, label: "Pretraga po naslovu ili klijentu." },
          { x: 51.5, y: 6, label: "Filtri po vrsti posla i statusu." },
          { x: 89.5, y: 6, label: "Nova ponuda." },
          { x: 7.2, y: 60.5, label: "Status: ovdje ju je klijent već otvorio." },
          { x: 17, y: 47.3, label: "Vaš referentni kod, ako ste ga unijeli." },
        ]}
      />

      <DocH3>Uređivač</DocH3>
      <DocFigure
        src="/docs-media/hr/ofertas-editor.webp"
        alt="Uređivač ponude u odjeljku Općenito"
        width={1480}
        height={1100}
        markers={[
          { x: 15.4, y: 4.6, label: "Odjeljci: Općenito, Dobrodošlica, Nekretnine i Usluge." },
          { x: 30.3, y: 37.1, label: "Klijent koji je prima e-poštom." },
          { x: 18, y: 76.2, label: "Prikaži ili sakrij cijene." },
          { x: 16, y: 84.8, label: "Prikaži logotip, zaglavlje i kontakt podatke." },
          { x: 84.5, y: 25.4, label: "Sažetak, poveznica za klijenta i »Pogledaj klijenta«." },
          { x: 87.8, y: 4.6, label: "Pošalji, ponovno pošalji ili objavi poveznicu." },
        ]}
      />
      <DocP>
        Desno vidite status, koliko nekretnina i usluga sadrži i ukupni iznos. Kod najma nema ukupnog iznosa: to su opcije
        za odabir, s cijenom po noći. Nakon slanja ili objave ondje je poveznica za klijenta s »Kopiraj poveznicu«.
      </DocP>

      <DocH3>Prilagodba cijene svake nekretnine</DocH3>
      <DocFigure
        src="/docs-media/hr/ofertas-propiedades.webp"
        alt="Odjeljak Nekretnine u ponudi s otvorenim prilagodbama cijene"
        width={1480}
        height={1292}
        markers={[
          { x: 28.6, y: 12.4, label: "Svaki odjeljak s naslovom i tekstom." },
          { x: 17.1, y: 33, label: "Posebna cijena, popust i polog samo za ovu ponudu." },
          { x: 30.3, y: 50.4, label: "Kratki tekst ispod nekretnine." },
        ]}
      />
      <DocP>
        »Prikaži prilagodbe« na svakoj nekretnini omogućuje posebnu cijenu za ovu ponudu, popust (postotak ili fiksni iznos),
        sigurnosni polog i kratki tekst poput »Uključeno završno čišćenje«. Klijent vidi prethodnu cijenu prekriženu.
        Cijena nekretnine u vašem portfelju ne mijenja se.
      </DocP>

      <DocH3>Usluge u ponudi</DocH3>
      <DocFigure
        src="/docs-media/hr/ofertas-servicios.webp"
        alt="Odjeljak Usluge u ponudi s privatnim kuharom i transferom"
        width={1480}
        height={814}
        markers={[
          { x: 7.4, y: 93.5, label: "Dodajte uslugu iz svoje knjižnice." },
          { x: 31.2, y: 29.1, label: "Prilagodite cijenu, količinu, datum i napomenu za klijenta." },
          { x: 52.6, y: 43.7, label: "Međuzbroj svake usluge." },
        ]}
      />
      <DocP>
        Usluge dolaze iz vaše knjižnice (vidi »Usluge«). Kad je dodate u ponudu, možete promijeniti cijenu, količinu (osobe,
        dani, noći ili sati, ovisno o naplati), datum i ostaviti napomenu. Bez cijene klijent vidi »Na upit«.
      </DocP>

      <DocH3>Slanje ili dijeljenje</DocH3>
      <DocTerms
        items={[
          ["S klijentom", "»Pošalji ponudu« šalje mu poveznicu e-poštom. Poslije možete koristiti »Ponovno pošalji ponudu« kad god želite."],
          ["Bez klijenta", "»Objavi poveznicu« aktivira stranicu, a vi dijelite poveznicu kako želite."],
          ["Kopiraj poveznicu", "Dostupno u desnom panelu uređivača i u izborniku ⋯ svake ponude, nakon slanja ili objave."],
        ]}
      />
      <DocP>
        Ako ste poveznicu poslali sami (npr. WhatsAppom), upotrijebite »Označi kao poslano« u izborniku ponude. Kad je klijent
        otvori, ponuda prelazi u »Pregledana« i dobivate obavijest. Sa stranice ponude klijent vam može pisati: taj upit
        stiže u Upite.
      </DocP>

      <DocH3>Statusi</DocH3>
      <DocTerms
        items={[
          [<DocPill key="d" tone="amber">Skica</DocPill>, "Još je nitko ne vidi."],
          [<DocPill key="s" tone="primary">Poslana</DocPill>, "Poveznica je aktivna i poslana klijentu."],
          [<DocPill key="v">Pregledana</DocPill>, "Klijent je već otvorio ponudu."],
          [<DocPill key="e">Istekla</DocPill>, "Prošao je datum isteka; klijent vidi obavijest da je istekla."],
        ]}
      />
    </DocSection>
  );
}

function Bookings() {
  return (
    <DocSection
      id="reservas"
      icon={CalendarDays}
      title="Rezervacije"
      intro="Svaki zaključeni posao: najam s datumima ili prodaja, s cijenom, provizijom i praćenjem uplata."
    >
      <DocFigure
        src="/docs-media/hr/reservas-lista.webp"
        alt="Popis rezervacija"
        width={1304}
        height={946}
        markers={[
          { x: 24, y: 6, label: "Pretražite po nekretnini ili klijentu." },
          { x: 50.1, y: 6, label: "Filtrirajte po statusu ili lokaciji nekretnine." },
          { x: 88.6, y: 6, label: "Nova rezervacija." },
          { x: 7.2, y: 40.5, label: "Status svake rezervacije." },
        ]}
      />

      <DocH3>Izrada rezervacije</DocH3>
      <DocSteps>
        <DocStep>
          Kliknite <strong>Nova rezervacija</strong> i odaberite nekretninu.
        </DocStep>
        <DocStep>Dodijelite klijenta (neobavezno).</DocStep>
        <DocStep>Kod najma odaberite datume dolaska i odlaska. Prodaja ide bez datuma.</DocStep>
        <DocStep>Unesite ukupnu cijenu i svoju proviziju, pa kliknite »Izradi rezervaciju«.</DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/hr/reservas-nueva.webp"
        alt="Prozor Nova rezervacija"
        width={784}
        height={809}
        className="max-w-md"
        markers={[
          { x: 50, y: 21, label: "Nekretnina." },
          { x: 50, y: 37.7, label: "Klijent (neobavezno)." },
          { x: 50, y: 53.6, label: "Dolazak i odlazak, samo za najam." },
          { x: 72.9, y: 70.3, label: "Ukupna cijena i vaša provizija." },
        ]}
      />

      <DocH3>Statusi</DocH3>
      <DocTerms
        items={[
          [
            <DocPill key="p" tone="amber">Na čekanju</DocPill>,
            "Tek izrađena, čeka potvrdu. Još ne blokira datume, ali se u Dostupnosti prikazuje jantarnom bojom.",
          ],
          [<DocPill key="c" tone="primary">Potvrđena</DocPill>, "Čvrsta je i blokira svoje datume."],
          [<DocPill key="o">Završena</DocPill>, "Boravak je završio ili je prodaja zaključena."],
          [<DocPill key="x">Otkazana</DocPill>, "Neće se dogoditi: datumi se oslobađaju. Evidentirane uplate ne brišu se."],
        ]}
      />
      <DocP>
        Status mijenjate na kartici rezervacije ili u izborniku ⋯ na popisu. Prije otkazivanja tražimo potvrdu. »Izbriši« je
        šalje u koš.
      </DocP>

      <DocH3>Kartica rezervacije</DocH3>
      <DocFigure
        src="/docs-media/hr/reservas-ficha.webp"
        alt="Kartica rezervacije s boravkom, uplatama i sažetkom"
        width={1304}
        height={1210}
        markers={[
          { x: 5.4, y: 21.5, label: "Datumi i broj noći." },
          { x: 60.1, y: 51.3, label: "Evidentiranje predujma, ostatka ili vaše provizije." },
          { x: 57.2, y: 64.9, label: "Označavanje uplate kao naplaćene." },
          { x: 82.4, y: 12, label: "Ukupno, provizija, naplaćeno i za naplatu." },
          { x: 82.4, y: 28.7, label: "Stranica koju vidi klijent: kopirajte poveznicu ili je otvorite." },
          { x: 82.4, y: 40.5, label: "Potvrdi, završi ili otkaži." },
        ]}
      />

      <DocH3>Uplate</DocH3>
      <DocP>
        »Dodaj uplatu« evidentira <strong>predujam</strong>, <strong>ostatak</strong> ili vašu <strong>proviziju</strong>, u
        valuti rezervacije. Svaka uplata ostaje na čekanju dok je ne označite kao naplaćenu; tada se bilježi datum. Traka
        pokazuje koliko je od ukupnog naplaćeno.
      </DocP>
      <DocFigure
        src="/docs-media/hr/reservas-pago.webp"
        alt="Prozor Dodaj uplatu"
        width={700}
        height={544}
        className="max-w-sm"
        caption="Odaberite vrstu, upišite iznos i spremite. Ostaje na čekanju dok je ne označite kao naplaćenu."
      />
      <DocP>
        Naplaćene uplate pune izvadak računa vlasnika: naplaćeno umanjeno za proviziju jest ono što mu pripada.
      </DocP>

      <DocH3>Stranica klijenta</DocH3>
      <DocP>
        Svaka rezervacija ima stranicu za klijenta s nekretninom, boravkom, statusom i uplatama (predujmovi i ostatak, nikad
        provizija). Ako rezervacija ima klijenta, prima je e-poštom kad se izradi, potvrdi ili otkaže. Ako nema, kopirajte
        poveznicu s kartice ili iz izbornika ⋯ i pošaljite je sami. Vidi »Što vide vaši klijenti«.
      </DocP>
    </DocSection>
  );
}

function Availability() {
  return (
    <DocSection
      id="disponibilidad"
      icon={CalendarCheck}
      title="Dostupnost"
      intro="Sve nekretnine za najam u jednom kalendaru: što je slobodno, a što zauzeto, da brzo odgovorite na upit i blokirate datume bez otvaranja svake nekretnine."
    >
      <DocP>
        Ima dva prikaza, koje birate desno: <strong>Sljedećih 90 dana</strong> (mreža s jednim retkom po nekretnini) i{" "}
        <strong>Mjesečno</strong> (kalendar). Prikazuju se samo nekretnine za najam.
      </DocP>

      <DocH3>Sljedećih 90 dana</DocH3>
      <DocFigure
        src="/docs-media/hr/disponibilidad-grilla.webp"
        alt="Mreža dostupnosti za sljedećih 90 dana"
        width={1304}
        height={704}
        markers={[
          { x: 12.8, y: 20, label: "Potražite nekretninu ili filtrirajte po lokaciji." },
          { x: 69.1, y: 20, label: "Odaberite datume da vidite koje su nekretnine slobodne." },
          { x: 88.5, y: 20, label: "Sljedećih 90 dana ili Mjesečno." },
          { x: 85.2, y: 8.1, label: "Javna poveznica na vašu dostupnost, za dijeljenje." },
          { x: 36.2, y: 27.2, label: "Što znači koja boja." },
          { x: 13, y: 48.9, label: "Svaki redak je nekretnina; kliknite naziv da je otvorite." },
        ]}
      />
      <DocTerms
        items={[
          ["Zelena", "Slobodno."],
          ["Crvena", "Rezervirano ili blokirano."],
          ["Pola-pola", "Dan dolaska (zauzeto od poslijepodneva) ili odlaska (zauzeto do jutra)."],
          ["Jantarna", "Rezervacija na čekanju: još ne blokira datume, ali je zatražena."],
          ["Siva", "Prošli dani."],
        ]}
      />
      <DocList>
        <li>Nekretnine su grupirane po regijama. Prijeđite mišem preko dana da vidite što je.</li>
        <li>
          Kad odaberete datume, ti se dani ističu, a sa <strong>Samo slobodne</strong> ostaju samo nekretnine slobodne u
          cijelom razdoblju. »Ukloni datume« vraća natrag.
        </li>
        <li>Prikazuje se 25 nekretnina; »Prikaži više« učitava sljedeće.</li>
      </DocList>

      <DocH3>Mjesečno</DocH3>
      <DocFigure
        src="/docs-media/hr/disponibilidad-mes.webp"
        alt="Mjesečni kalendar sa zauzetošću svakog dana"
        width={1304}
        height={1298}
        markers={[
          { x: 6.4, y: 10.7, label: "Kretanje kroz mjesece; »Danas« vraća na tekući." },
          { x: 67.9, y: 10.7, label: "Odaberite nekretninu da vidite njezine rezervacije i blokirate datume." },
          { x: 67.7, y: 52.5, label: "Koliko je nekretnina zauzeto te noći." },
          { x: 62.4, y: 54.9, label: "Koje: svaka nekretnina u svojoj boji. Na čekanju s isprekidanim obrubom." },
        ]}
      />
      <DocP>
        S <strong>Sve nekretnine</strong> svaki dan pokazuje koliko je nekretnina zauzeto te noći (crveno ako su sve) i koje,
        svaka uvijek u istoj boji. Prijeđite mišem da vidite cijeli popis. Klikom na dan ispod se pojavljuju zauzete, one na
        čekanju i slobodne:
      </DocP>
      <DocFigure
        src="/docs-media/hr/disponibilidad-dia.webp"
        alt="Detalji dana sa zauzetim i slobodnim nekretninama"
        width={1100}
        height={234}
        className="max-w-2xl"
        markers={[
          { x: 25.5, y: 29.5, label: "Što je taj dan zauzeto, na čekanju i slobodno." },
          { x: 45, y: 43, label: "»Prikaži mjesec« otvara kalendar te nekretnine; naziv otvara nekretninu." },
        ]}
      />

      <DocH3>Blokiranje datuma iz kalendara</DocH3>
      <DocSteps>
        <DocStep>
          U prikazu <strong>Mjesečno</strong> odaberite nekretninu gore desno.
        </DocStep>
        <DocStep>
          Povucite preko slobodnih noći koje želite blokirati. Tipkovnicom: <Kbd>Enter</Kbd> na prvi dan i{" "}
          <Kbd>Enter</Kbd> na zadnji.
        </DocStep>
        <DocStep>
          Ispod se pojavljuje sažetak (»4 noći, od 25. lis. do 29. lis.«). Po želji napišite bilješku i kliknite{" "}
          <strong>Blokiraj</strong>.
        </DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/hr/disponibilidad-bloquear.webp"
        alt="Kalendar nekretnine s četiri noći označene za blokiranje"
        width={1304}
        height={1141}
        markers={[
          { x: 48.9, y: 89.2, label: "Dani rezervacije: dolazak, zauzete noći i odlazak." },
          { x: 8.7, y: 74.3, label: "Povucite preko slobodnih noći da ih označite." },
          { x: 22.4, y: 95.6, label: "Potvrdite blokadu, s neobaveznom bilješkom." },
        ]}
      />
      <DocP>
        Ne mogu se označiti prošle ni zauzete noći. Blokada se pojavljuje i u odjeljku Dostupnost nekretnine, gdje je možete
        ukloniti.
      </DocP>

      <DocH3>Poveznica za dijeljenje</DocH3>
      <DocP>
        »Kopiraj poveznicu za dijeljenje« kopira adresu vaše javne dostupnosti: istu mrežu od 90 dana, na vašoj stranici, s
        vašim identitetom. Služi za slanje klijentu ili kolegi. Prikazuje samo objavljene nekretnine i ne prikazuje
        rezervacije na čekanju.
      </DocP>
    </DocSection>
  );
}

function Services() {
  return (
    <DocSection
      id="servicios"
      icon={Sparkles}
      title="Usluge"
      intro="Vaša knjižnica doživljaja i dodatnih usluga. Unesete ih jednom i dodajete u bilo koju ponudu."
    >
      <DocFigure
        src="/docs-media/hr/servicios-lista.webp"
        alt="Knjižnica usluga"
        width={1304}
        height={946}
        markers={[
          { x: 20.9, y: 6, label: "Pretražite po nazivu, vrsti ili području." },
          { x: 89.8, y: 6, label: "Nova usluga." },
          { x: 72, y: 52.9, label: "Bez cijene prikazuje se »Na upit«." },
        ]}
      />

      <DocH3>Izrada usluge</DocH3>
      <DocSteps>
        <DocStep>
          Kliknite <strong>Nova usluga</strong> i odaberite vrstu: batler, privatni kuhar, jahta, transferi, automobil,
          izleti, spa, dadilja, dodatno čišćenje, događanja ili drugo.
        </DocStep>
        <DocStep>Dajte joj naziv, fotografiju i opis: što uključuje, koliko traje, za koliko osoba.</DocStep>
        <DocStep>
          Odredite cijenu i način naplate: po usluzi, po osobi, po danu, po noći ili po satu. Bez cijene prikazuje se »Na
          upit«.
        </DocStep>
        <DocStep>Navedite gdje se nudi (prazno znači bilo gdje) i po želji pružatelja.</DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/hr/servicios-editar.webp"
        alt="Obrazac usluge: fotografija, područja, cijena, jedinica naplate, pružatelj i dostupnost"
        width={784}
        height={1628}
        className="max-w-md"
        markers={[
          { x: 50, y: 18.2, label: "Fotografija usluge." },
          { x: 50, y: 51.9, label: "Područja gdje se nudi; prazno je bilo gdje." },
          { x: 76.1, y: 67.8, label: "Način naplate: po usluzi, osobi, danu, noći ili satu." },
          { x: 50, y: 71.9, label: "Pružatelj, samo za vaš tim." },
          { x: 89.6, y: 95.9, label: "Dostupna za dodavanje u nove ponude." },
        ]}
      />
      <DocList>
        <li>Kliknite uslugu na popisu da je uredite ili izbrišete.</li>
        <li>Pružatelja vidi samo vaš tim, nikad klijent.</li>
        <li>Ako isključite »Dostupna«, usluga se ne može dodati u nove ponude, ali ostaje u onima koje je već imaju.</li>
        <li>U svakoj ponudi možete prilagoditi cijenu, količinu i datum usluge za tog klijenta i ostaviti napomenu.</li>
      </DocList>
    </DocSection>
  );
}

function Portal() {
  return (
    <DocSection
      id="portal"
      icon={Globe}
      title="Web-stranica"
      adminOnly
      intro="Javna web-stranica vaše agencije, na kojoj klijenti vide vaše objavljene nekretnine i pišu vam. Vaša je: nosi vaše ime, logotip i boje."
    >
      <DocP>
        Uređuje se putem <strong>Web-stranica</strong> u izborniku. Uređivač zauzima cijeli zaslon: lijevo su opcije, desno
        pregled koji možete gledati kao na računalu ili mobitelu. Spremite da objavite promjene; ako pokušate izaći s
        nespremljenim promjenama, upozorit ćemo vas.
      </DocP>
      <DocFigure
        src="/docs-media/hr/portal-editor.webp"
        alt="Uređivač stranice na kartici Izgled, s pregledom desno"
        width={1760}
        height={990}
        markers={[
          { x: 14, y: 9.8, label: "Kartice: Izgled, Naslovnica, Blokovi te Agencija i kontakt." },
          { x: 5.1, y: 28.8, label: "Odaberite postavljate li verziju za računalo ili za mobitel." },
          { x: 68.2, y: 3.5, label: "Pregled kao na računalu ili mobitelu." },
          { x: 83.6, y: 3.5, label: "Pogledaj objavljenu stranicu." },
          { x: 94.4, y: 3.5, label: "Spremi promjene objavljuje ono što ste uredili." },
          { x: 66, y: 57.1, label: "Pregled, točno onako kako će ga vidjeti klijenti." },
        ]}
      />
      <DocTerms
        items={[
          [
            "Izgled",
            "Predložak početne stranice (Naslovnica, Uredničko, Kompaktno, Podijeljeno ili Mozaik), koji može biti drukčiji na mobitelima; boja gumba i poveznica (iz palete ili druga po kodu, npr. #1F5F4A); i tipografija (Moderna, Klasična, Suzdržana, Elegantna, Urednička, Topla, Urbana ili Arhitektonska).",
          ],
          [
            "Naslovnica",
            "Glavna fotografija (najbolje vodoravna, široka najmanje 1920 px) i, u predlošku Mozaik, četiri fotografije kolaža. Također naslov i tekst naslovnice.",
          ],
          [
            "Blokovi",
            "Vlastiti odjeljci između naslovnice i popisa. Svaki ima nekoliko izgleda i može se sakriti bez brisanja.",
          ],
          [
            "Agencija i kontakt",
            "Tekst o vašoj agenciji, telefon, WhatsApp (uključuje gumb »Pišite nam na WhatsApp«), Instagram i adresa ureda.",
          ],
        ]}
      />

      <DocH3>Vrste blokova</DocH3>
      <DocFigure
        src="/docs-media/hr/portal-bloques.webp"
        alt="Kartica Blokovi s tri bloka stranice"
        width={896}
        height={1038}
        className="max-w-sm"
        markers={[
          { x: 36.7, y: 50.3, label: "Svaki blok s vrstom i izgledom. Kliknite ga za uređivanje." },
          { x: 66.7, y: 51.9, label: "Sakrij bez brisanja." },
          { x: 81.9, y: 51.9, label: "Pomakni gore ili dolje." },
          { x: 89.5, y: 51.9, label: "Izbriši." },
          { x: 49.9, y: 90.4, label: "Dodaj novi blok: odaberete vrstu, zatim izgled i sadržaj." },
        ]}
      />
      <DocTerms
        items={[
          ["Lokacija", "Područje s fotografijom, tekstom i njegovim nekretninama. Izgledi: Istaknuto, Banner ili Vrtuljak."],
          [
            "Promocija",
            "Nekretnine s oznakom poput »15 % popusta«, s neobaveznim datumom isteka. Izgledi: Traka u boji, Banner s fotografijom ili Vrtuljak.",
          ],
          ["Istaknute nekretnine", "Vaš izbor: najnovije, uz more, najtraženije. Izgledi: Mreža ili Vrtuljak."],
          ["Odredišta", "Više područja odjednom, svako sa svojom fotografijom. Dodirom na jedno filtrira se popis. Izgledi: Pločice ili Vrtuljak."],
          [
            "Tekst i slika",
            "Ispričajte nešto svoje: usluge, procjene, kako radite. Slika lijevo, desno ili samo tekst.",
          ],
          [
            "Poziv na akciju",
            "Poziv s gumbom koji vodi na obrazac za kontakt, WhatsApp ili popis. Izgledi: Boja ili S fotografijom.",
          ],
        ]}
      />

      <DocH3>Agencija i kontakt</DocH3>
      <DocFigure
        src="/docs-media/hr/portal-agencia.webp"
        alt="Kartica Agencija i kontakt u uređivaču stranice"
        width={896}
        height={1958}
        className="max-w-xs"
        caption="Tekst »O vašoj agenciji« i kontakt podaci koji se prikazuju u podnožju i na gumbu za kontakt stranice."
      />
      <DocTip>
        Da vidite rezultat, upotrijebite »Pogledaj objavljeno« u uređivaču ili »Pogledaj moju stranicu« u izborniku profila.
      </DocTip>
    </DocSection>
  );
}

function ClientPages() {
  return (
    <DocSection
      id="lo-que-ven-tus-clientes"
      icon={Eye}
      title="Što vide vaši klijenti"
      intro="Javne stranice koje Tivvo izrađuje: vaša stranica, kartica svake nekretnine, ponude, rezervacije, stranica vlasnika i vaša dostupnost. Nijedna ne traži korisničko ime ni lozinku."
    >
      <DocH3>Vaša stranica</DocH3>
      <DocFigure
        src="/docs-media/hr/portal-publico.webp"
        alt="Javna stranica agencije s naslovnicom i tražilicom"
        width={1584}
        height={946}
        caption="Naslovnica s tražilicom (vrsta posla, područje i tip), vaši blokovi, popis objavljenih nekretnina i kontakt."
      />
      <DocList>
        <li>Prikazuje samo objavljene nekretnine. Kartice imaju galeriju, kartu s vidljivom lokacijom i obrazac za upit.</li>
        <li>Upiti iz obrasca stižu u Upite i izrađuju klijenta.</li>
        <li>Mijenjate je putem Web-stranice (vidi »Web-stranica«); adresu u Postavkama.</li>
      </DocList>

      <DocH3>Ponuda</DocH3>
      <DocFigure
        src="/docs-media/hr/ofertas-cliente.webp"
        alt="Stranica ponude kako je vidi klijent"
        width={1584}
        height={990}
        caption="Pozdrav, odjeljci s nekretninama (s posebnom cijenom i prekriženom prethodnom) i usluge. Na dnu obrazac da vam piše."
      />

      <DocH3>Rezervacija</DocH3>
      <DocFigure
        src="/docs-media/hr/reservas-cliente.webp"
        alt="Stranica potvrđene rezervacije kako je vidi klijent"
        width={1584}
        height={946}
        caption="Status, nekretnina, datumi i uplate: ukupno, plaćeno i preostalo. Nikad ne prikazuje vašu proviziju."
      />

      <DocH3>Vaša dostupnost</DocH3>
      <DocFigure
        src="/docs-media/hr/disponibilidad-publica.webp"
        alt="Javna dostupnost agencije"
        width={1584}
        height={946}
        caption="Sljedećih 90 dana vaših objavljenih najmova, s pretragom, lokacijom i datumima. Ne prikazuje rezervacije na čekanju."
      />

      <DocH3>Stranica vlasnika</DocH3>
      <DocP>Vidi »Vlasnici«.</DocP>
    </DocSection>
  );
}

function Team() {
  return (
    <DocSection
      id="equipo"
      icon={UsersRound}
      title="Tim"
      adminOnly
      intro="Osobe koje u Tivvu rade u vašoj agenciji i što koja od njih može."
    >
      <DocFigure
        src="/docs-media/hr/equipo.webp"
        alt="Tim agencije"
        width={1304}
        height={946}
        markers={[
          { x: 65.2, y: 6, label: "Filtrirajte po ulozi." },
          { x: 89.8, y: 6, label: "Pozovite nekoga." },
          { x: 13.3, y: 19.7, label: "Uloga svake osobe." },
        ]}
      />
      <DocSteps>
        <DocStep>
          Kliknite <strong>Pozovi člana</strong>, upišite ime i e-poštu i odaberite ulogu: administrator ili agent.
        </DocStep>
        <DocStep>
          Pristup prima e-poštom. Ako je već imao račun na Tivvu (npr. u drugoj agenciji), dodajemo ga u vaš tim i prijavljuje
          se svojom uobičajenom lozinkom.
        </DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/hr/equipo-invitar.webp"
        alt="Prozor Pozovi člana"
        width={784}
        height={769}
        className="max-w-md"
        markers={[{ x: 50, y: 72.7, label: "Administrator ili agent. Vidi »Uloge« u Prvim koracima." }]}
      />
      <DocList>
        <li>U izborniku ⋯ svake osobe možete promijeniti ulogu, kopirati e-poštu, deaktivirati pristup ili je ukloniti iz tima.</li>
        <li>
          <strong>Deaktivacija pristupa</strong> sprječava prijavu, ali čuva mjesto, nekretnine i klijente; pristup možete
          ponovno aktivirati kad god želite. Osobe bez pristupa prikazuju se na kraju.
        </li>
        <li>
          <strong>Uklanjanje iz tima</strong> oduzima pristup ovoj agenciji. Račun se ne briše: ako osoba pripada drugoj
          agenciji, i dalje se prijavljuje tamo.
        </li>
        <li>Vlasnik računa ne može se ukloniti niti mu se može promijeniti uloga.</li>
      </DocList>
    </DocSection>
  );
}

function SettingsDoc() {
  return (
    <DocSection
      id="configuracion"
      icon={Settings}
      title="Postavke"
      adminOnly
      intro="Podaci vaše agencije i postavke za cijeli račun."
    >
      <DocFigure
        src="/docs-media/hr/configuracion.webp"
        alt="Stranica Postavke"
        width={1304}
        height={1486}
        markers={[
          { x: 6.1, y: 16.8, label: "Vaš logotip i naziv agencije." },
          { x: 30.4, y: 32.6, label: "Adresa vaše stranice." },
          { x: 30.4, y: 39.1, label: "E-pošta koja prima obavijesti o upitima." },
          { x: 29.4, y: 50.3, label: "Vidi li vlasnik vašu proviziju. Sprema se pri promjeni." },
          { x: 30.4, y: 66.1, label: "Zadani jezik i valuta." },
          { x: 90.9, y: 3.4, label: "Spremi; pokraj, prečaci za kopiranje, pregled i prilagodbu stranice." },
        ]}
      />
      <DocTerms
        items={[
          [
            "Vaša agencija",
            "Naziv i logotip koje vide vaši klijenti. Kliknite logotip da ga promijenite; učitava se odmah.",
          ],
          [
            "Javna stranica",
            "Adresa vaše stranice (samo mala slova, brojevi i crtice). Ako je promijenite, stara poveznica prestaje raditi: ažurirajte je gdje god ste je podijelili. Također e-pošta za kontakt, koja prima obavijesti o upitima.",
          ],
          [
            "Portal vlasnika",
            "»Prikaži proviziju agencije«: kad je isključeno, vlasnik vidi svoj dio, ali ne i koliko je odbijeno. Sprema se pri promjeni, bez klika na Spremi.",
          ],
          [
            "Preferencije",
            "Jezik stranice (poveznice koje dijelite otvaraju se na tom jeziku, a klijenti ga mogu promijeniti na stranici) i zadana valuta cijena.",
          ],
        ]}
      />
    </DocSection>
  );
}

function Profile() {
  return (
    <DocSection
      id="perfil"
      icon={UserRound}
      title="Moj profil"
      intro="Vaši osobni podaci unutar računa agencije."
    >
      <DocFigure
        src="/docs-media/hr/perfil.webp"
        alt="Stranica Moj profil"
        width={1304}
        height={1321}
        markers={[
          { x: 6.1, y: 18.9, label: "Kliknite fotografiju da je promijenite; pokraj je vaša uloga." },
          { x: 30.4, y: 30.1, label: "Vaše ime i e-pošta; spremaju se sa »Spremi« na vrhu." },
          { x: 30.4, y: 53, label: "Za promjenu lozinke: trenutačna i nova, dvaput." },
        ]}
      />
      <DocList>
        <li>Fotografija se učitava odmah; vaše ime vidi se u izborniku i u povijesti vaših klijenata.</li>
        <li>Nova lozinka mora imati najmanje 8 znakova. Oko u svakom polju prikazuje ono što ste upisali.</li>
        <li>
          Jezik nadzorne ploče mijenja se u izborniku profila, pod »Jezik«. Osoban je: svaka osoba u timu može koristiti
          svoj.
        </li>
      </DocList>
    </DocSection>
  );
}

function Shortcuts() {
  return (
    <DocSection
      id="atajos"
      icon={Keyboard}
      title="Pretraga, prečaci i pomoć"
      intro="Za kretanje cijelom nadzornom pločom bez puštanja tipkovnice, i kome se obratiti ako zapnete."
    >
      <DocH3>Pretraga</DocH3>
      <DocP>
        <Kbd>Ctrl/⌘</Kbd> <Kbd>K</Kbd> otvara pretragu koja po nazivu pronalazi stranice, nekretnine, ponude i klijente.
        Odande možete i izraditi nekretninu, ponudu, klijenta ili rezervaciju, pozvati nekoga u tim, otvoriti ovu
        dokumentaciju, promijeniti izgled, sažeti izbornik i odjaviti se.
      </DocP>
      <DocFigure
        src="/docs-media/hr/buscador.webp"
        alt="Pretraga s rezultatima za »pérez«"
        width={960}
        height={347}
        className="max-w-lg"
        caption="Upišite dio naziva i odaberite strelicama i Enterom. Esc je zatvara."
      />

      <DocH3>Prečaci</DocH3>
      <DocP>
        <Kbd>?</Kbd> prikazuje sve prečace na bilo kojem zaslonu nadzorne ploče.
      </DocP>
      <DocTerms
        items={[
          [<><Kbd>Ctrl/⌘</Kbd> <Kbd>K</Kbd></>, "Pretraži i pokreni naredbe"],
          [<><Kbd>Ctrl/⌘</Kbd> <Kbd>S</Kbd></>, "Spremi otvoreni obrazac"],
          [<><Kbd>Ctrl/⌘</Kbd> <Kbd>B</Kbd></>, "Sažmi ili proširi bočni izbornik"],
          [<Kbd key="q">?</Kbd>, "Prikaži sve prečace"],
          [
            <><Kbd>G</Kbd> i slovo</>,
            "Idi na odjeljak: P nekretnine, O ponude, C klijenti, I upiti, R rezervacije, D dostupnost, E tim, W stranica, S postavke, M moj profil",
          ],
          [<Kbd key="n">N</Kbd>, "Izradi novo na otvorenom popisu"],
          [<Kbd key="s">/</Kbd>, "Idi na pretragu popisa"],
          [<Kbd key="f">F</Kbd>, "Otvori filtre"],
          [<><Kbd>1</Kbd> <Kbd>2</Kbd> <Kbd>3</Kbd></>, "Prikaz mreže, popisa ili tablice"],
          [<><Kbd>J</Kbd> <Kbd>K</Kbd></>, "Kretanje dolje i gore kroz stavke; Enter otvara odabranu"],
          [<Kbd key="e">Esc</Kbd>, "Poništi odabir"],
        ]}
      />

      <DocH3>Pomoć i podrška</DocH3>
      <DocP>
        U izborniku profila <strong>Pomoć i podrška</strong> otvara centar za pomoć: česta pitanja s pretragom i obrazac za
        pisanje timu Tivva. Odgovaramo e-poštom.
      </DocP>
      <DocFigure
        src="/docs-media/hr/ayuda.webp"
        alt="Centar za pomoć Tivva"
        width={1584}
        height={946}
        caption="Potražite svoje pitanje; ako ga ne nađete, pišite nam putem obrasca."
      />
    </DocSection>
  );
}

export const DOC_SECTIONS: DocEntry[] = [
  { id: "primeros-pasos", label: "Prvi koraci", Content: Basics },
  { id: "consultas", label: "Upiti", Content: Inquiries },
  { id: "clientes", label: "Klijenti", Content: Clients },
  { id: "propiedades", label: "Nekretnine", Content: Properties },
  { id: "propietarios", label: "Vlasnici", Content: Owners },
  { id: "importar", label: "Uvoz nekretnina", adminOnly: true, Content: Importer },
  { id: "ofertas", label: "Ponude", Content: Offers },
  { id: "reservas", label: "Rezervacije", Content: Bookings },
  { id: "disponibilidad", label: "Dostupnost", Content: Availability },
  { id: "servicios", label: "Usluge", Content: Services },
  { id: "portal", label: "Web-stranica", adminOnly: true, Content: Portal },
  { id: "lo-que-ven-tus-clientes", label: "Što vide vaši klijenti", Content: ClientPages },
  { id: "equipo", label: "Tim", adminOnly: true, Content: Team },
  { id: "configuracion", label: "Postavke", adminOnly: true, Content: SettingsDoc },
  { id: "perfil", label: "Moj profil", Content: Profile },
  { id: "atajos", label: "Pretraga, prečaci i pomoć", Content: Shortcuts },
];
