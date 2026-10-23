import {
  LegalLink,
  type LegalContent,
  type LegalSection,
} from "@/components/legal/legal-document";
import { LEGAL_ENTITY } from "@/lib/legal";

const { name, taxId, address, jurisdiction, contactEmail } = LEGAL_ENTITY;

const SUMMARY = [
  "Tivvo je alat kojim vaša agencija upravlja nekretninama, klijentima, ponudama i rezervacijama te objavljuje vlastitu web-stranicu. Nismo strana u poslovima koje sklapate sa svojim klijentima.",
  "Podaci koje unosite pripadaju vašoj agenciji. Mi ih pohranjujemo i obrađujemo kako bismo vam pružili uslugu, a vi ih možete izvesti.",
  "Vaša je agencija odgovorna za poštivanje pravila svoje djelatnosti: licence, istinitog oglašavanja, ugovora o najmu i zaštite podataka svojih klijenata.",
  "Svoj paket možete otkazati kad god želite, istim putem kojim ste ga ugovorili. Ako se cijene ili ovi uvjeti promijene, obavještavamo vas 30 dana unaprijed.",
];

const SECTIONS: LegalSection[] = [
  {
    id: "quienes-somos",
    title: "Tko smo i što uređuju ovi uvjeti",
    brief:
      "Ovi Uvjeti, Pravila privatnosti i uvjeti vašeg paketa čine cjelokupni ugovor između Tivva i vaše agencije.",
    content: (
      <>
        <p>
          Ovi Uvjeti korištenja (»Uvjeti«) uređuju pristup i korištenje Tivva,
          sustava za upravljanje agencijama za nekretnine dostupnog na tivvo.app
          i njegovim poddomenama (»Usluga«). Uslugu pruža {name}, CUIT {taxId},
          sa sjedištem na adresi {address} (»Tivvo«, »mi«).
        </p>
        <p>
          Uvjeti zajedno s{" "}
          <LegalLink href="/privacy">Pravilima privatnosti</LegalLink> i uvjetima
          paketa koji ugovorite čine cjelokupni ugovor između Tivva i Agencije.
          Ako neki poseban uvjet vašeg paketa (primjerice, potpisani Enterprise
          ugovor) određuje nešto drugo, prednost ima poseban uvjet.
        </p>
      </>
    ),
  },
  {
    id: "definiciones",
    title: "Definicije",
    brief:
      "Agencija je tko otvara račun, Korisnici su oni koji u njemu rade, a Krajnji klijenti osobe čiji se podaci unose.",
    content: (
      <ul>
        <li>
          <strong>Agencija:</strong> fizička ili pravna osoba koja otvara račun
          na Tivvu radi upravljanja svojom djelatnošću posredovanja nekretninama.
        </li>
        <li>
          <strong>Korisnici:</strong> osobe kojima Agencija dopušta korištenje
          svojeg računa (vlasnici računa, administratori, agenti i druge uloge).
        </li>
        <li>
          <strong>Krajnji klijenti:</strong> osobe čije podatke Agencija unosi
          ili prima putem Usluge: zainteresirani, kupci, najmoprimci, gosti i
          vlasnici nekretnina.
        </li>
        <li>
          <strong>Podaci Agencije:</strong> sve informacije koje Agencija i
          njezini Korisnici unose u Uslugu ili primaju putem nje: nekretnine,
          fotografije, tekstovi, cijene, klijenti, upiti, ponude, rezervacije,
          evidentirane uplate i dokumenti.
        </li>
        <li>
          <strong>Stranica Agencije:</strong> javna web-stranica koju Agencija
          izrađuje uređivačem Tivva i koja se objavljuje na poddomeni Tivva pod
          imenom Agencije.
        </li>
      </ul>
    ),
  },
  {
    id: "aceptacion",
    title: "Prihvaćanje i poslovna sposobnost",
    brief:
      "Korištenjem Tivva prihvaćate ove Uvjete. Morate biti punoljetni i poslovno sposobni.",
    content: (
      <>
        <p>
          Otvaranjem računa, prijavom putem Googlea ili Applea ili korištenjem
          Usluge prihvaćate ove Uvjete. Ako se ne slažete, nemojte koristiti
          Uslugu.
        </p>
        <p>
          Da biste otvorili račun, morate imati više od 18 godina i biti
          poslovno sposobni. Ako ga otvarate u ime tvrtke ili druge osobe,
          izjavljujete da imate dovoljne ovlasti da je obvežete; u tom se
          slučaju »vi« i »Agencija« odnose na tu tvrtku ili osobu.
        </p>
        <p>
          Ovi Uvjeti su ugovor po pristupu u smislu članaka 984. i dalje
          argentinskog Građanskog i trgovačkog zakonika. Napisali smo ih tako da
          budu razumljivi bez pomoći; ako nešto nije jasno, pišite nam prije
          nego što ih prihvatite.
        </p>
      </>
    ),
  },
  {
    id: "cuenta",
    title: "Račun, korisnici i sigurnost",
    brief:
      "Ažurirajte svoje podatke, ne dijelite lozinke i javite nam ako sumnjate da je netko ušao u vaš račun.",
    content: (
      <>
        <p>
          Agencija mora davati istinite podatke i redovito ih ažurirati,
          posebno e-poštu za kontakt, jer vas putem nje obavještavamo o važnim
          promjenama.
        </p>
        <p>
          Agencija odlučuje tko pristupa njezinu računu i s kojim ovlastima te
          odgovara za ono što njezini Korisnici rade u Usluzi. Svaki Korisnik
          mora imati vlastite pristupne podatke: ne dijelite lozinke među
          osobama.
        </p>
        <p>
          Ako sumnjate da je netko bez ovlasti pristupio vašem računu, promijenite
          lozinku i odmah nam javite na{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
        </p>
      </>
    ),
  },
  {
    id: "servicio",
    title: "Što Usluga obuhvaća",
    brief:
      "Što možete raditi ovisi o vašem paketu. Funkcije možemo mijenjati; ako uklonimo bitnu funkciju iz plaćenog paketa, obavještavamo 30 dana unaprijed.",
    content: (
      <>
        <p>Ovisno o paketu, Usluga među ostalim omogućuje:</p>
        <ul>
          <li>unos i objavu nekretnina za prodaju i kratkoročni najam;</li>
          <li>
            upravljanje klijentima, upitima, ponudama, rezervacijama,
            dostupnošću, sezonskim cijenama i evidentiranim uplatama;
          </li>
          <li>
            dijeljenje ponuda, rezervacija i portala vlasnika putem privatnih
            poveznica;
          </li>
          <li>izradu i objavu Stranice Agencije;</li>
          <li>timski rad s ulogama i ovlastima.</li>
        </ul>
        <p>
          Tivvo neprestano poboljšava Uslugu: funkcije možemo dodavati,
          mijenjati ili uklanjati. Ako uklonimo bitnu funkciju iz plaćenog
          paketa, obavijestit ćemo vas najmanje 30 dana unaprijed, a ako vam
          promjena ne odgovara, paket možete otkazati bez troškova.
        </p>
        <p>
          Neke funkcije mogu biti ponuđene kao »beta« ili probne. Pružaju se
          takve kakve jesu, mogu se promijeniti bez najave i ne preporučuje se
          oslanjati se na njih za kritične zadatke.
        </p>
      </>
    ),
  },
  {
    id: "rol-de-tivvo",
    title: "Tivvo nije strana u vašim poslovima",
    brief:
      "Tivvo je softver: nije agencija za nekretnine ni posrednik, i ne obrađuje niti čuva vaše uplate.",
    content: (
      <>
        <p>
          Tivvo je softverski alat. Nije agencija za nekretnine, ne djeluje kao
          posrednik, ne naplaćuje u ime Agencije i ne jamči da će se posao
          zaključiti. Prodaje, najmovi, rezervacije, kapare, provizije i naplate
          dogovori su između Agencije, njezinih klijenata i vlasnika.
        </p>
        <p>
          Uplate koje Agencija evidentira u Tivvu bilješke su za njezinu vlastitu
          kontrolu; Tivvo ih ne obrađuje niti čuva. Dostupnost sinkronizirana s
          vanjskim kalendarima (primjerice putem iCala) ovisi o tim uslugama i
          može kasniti: Agencija mora potvrditi dostupnost prije zaključenja
          rezervacije.
        </p>
      </>
    ),
  },
  {
    id: "obligaciones-agencia",
    title: "Obveze Agencije",
    brief:
      "Vaša agencija odgovara za svoju licencu, istinitost oglasa, ugovore, podatke svojih klijenata i poreze.",
    content: (
      <>
        <p>Agencija je isključivo odgovorna za svoju djelatnost, a osobito za:</p>
        <ul>
          <li>
            poštivanje pravila posredovanja nekretninama koja se na nju odnose
            (licenca, strukovne komore i propisi svake jurisdikcije u kojoj
            posluje);
          </li>
          <li>
            istinitost, potpunost i ažurnost podataka o nekretninama, cijenama i
            uvjetima, kako zahtijevaju propisi o zaštiti potrošača (u
            Argentini, Zakon 24.240);
          </li>
          <li>
            ugovore koje sklapa s klijentima i vlasnicima, uključujući pravila o
            najmu i kratkoročnom iznajmljivanju;
          </li>
          <li>
            obradu osobnih podataka svojih Krajnjih klijenata u skladu s
            primjenjivim propisima (u Argentini, Zakon 25.326; vidi odjeljak
            »Podaci Agencije i osobni podaci«);
          </li>
          <li>
            posjedovanje prava na fotografije, tlocrte, tekstove i žigove koje
            objavljuje te dopuštenja vlasnika za objavu njihovih nekretnina;
          </li>
          <li>poreze i porezne obveze koje proizlaze iz njezine djelatnosti.</li>
        </ul>
      </>
    ),
  },
  {
    id: "uso-aceptable",
    title: "Prihvatljivo korištenje",
    brief:
      "Bez lažnih oglasa, neželjene pošte, nepotrebnih osjetljivih podataka, scrapinga i pokušaja ulaska u tuđe račune.",
    content: (
      <>
        <p>Uslugu nije dopušteno koristiti za:</p>
        <ul>
          <li>objavu nepostojećih nekretnina, obmanjujućih cijena ili nezakonitog sadržaja;</li>
          <li>
            slanje neželjenih komercijalnih poruka ili korištenje kontakt
            podataka pribavljenih bez pravne osnove;
          </li>
          <li>
            unos osjetljivih podataka (zdravlje, rasno ili etničko podrijetlo,
            politička mišljenja, vjerska uvjerenja, spolni život), osim ako to
            zakon dopušta i ako je nužno;
          </li>
          <li>
            povredu prava intelektualnog vlasništva, prava na lik ili privatnost
            trećih osoba;
          </li>
          <li>
            pokušaje pristupa računima ili podacima drugih agencija, testiranje
            ranjivosti bez dopuštenja, preopterećivanje infrastrukture ili
            širenje zlonamjernog softvera;
          </li>
          <li>
            automatizirano kopiranje Usluge (scraping), obrnuti inženjering ili
            njezinu preprodaju bez pisanog ugovora s Tivvom.
          </li>
        </ul>
        <p>
          Ako pronađete ranjivost, javite nam na{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>:
          provjerit ćemo je i odgovoriti vam.
        </p>
      </>
    ),
  },
  {
    id: "planes-y-pagos",
    title: "Paketi, cijene i plaćanja",
    brief:
      "Naplaćuje se unaprijed i automatski obnavlja. Promjenu cijena najavljujemo 30 dana unaprijed; ako plaćanje ne uspije, imate 15 dana da ga podmirite.",
    content: (
      <>
        <p>
          Tivvo nudi besplatni paket s ograničenjima (primjerice broja nekretnina
          i Korisnika) i plaćene pakete. Važeće cijene, ograničenja i funkcije
          svakog paketa objavljene su na{" "}
          <LegalLink href="/#planes">tivvo.app</LegalLink> ili se za pakete po
          mjeri dogovaraju pisanim putem.
        </p>
        <ul>
          <li>
            Plaćeni paketi naplaćuju se unaprijed na mjesečnoj osnovi (ili za
            dogovoreno razdoblje) i automatski se obnavljaju dok ih Agencija ne
            otkaže.
          </li>
          <li>
            Cijene objavljene u američkim dolarima mogu se platiti u argentinskim
            pesosima po tečaju navedenom u trenutku plaćanja. Primjenjivi porezi
            dodaju se cijeni, osim ako je drukčije navedeno.
          </li>
          <li>
            Ako promijenimo cijenu vašeg paketa, obavijestit ćemo vas e-poštom
            najmanje 30 dana unaprijed. Nova cijena primjenjuje se od razdoblja
            nakon obavijesti; ako se ne slažete, paket možete otkazati prije nego
            što stupi na snagu.
          </li>
          <li>
            Ako uplata ne bude knjižena, obavijestit ćemo vas i imate 15
            kalendarskih dana da je podmirite. Nakon toga račun možemo prebaciti
            na besplatni paket ili ga suspendirati. Suspenzijom se vaši podaci ne
            brišu.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "baja",
    title: "Otkaz i pravo na jednostrani raskid",
    brief:
      "Možete otkazati kad god želite. Otkaz vrijedi na kraju plaćenog razdoblja i nema razmjernog povrata, osim ako zakon određuje drukčije.",
    content: (
      <>
        <p>
          Agencija može otkazati svoj paket u bilo kojem trenutku, bez
          obrazloženja i bez penala, istim putem kojim ga je ugovorila ili
          pisanjem na{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
          U roku od 24 sata istim vam putem šaljemo kod koji označava vaš zahtjev
          za otkaz.
        </p>
        <p>
          Otkaz vrijedi na kraju već plaćenog razdoblja: do tada zadržavate
          pristup paketu. Ne vraćamo razmjerni iznos za već započeta razdoblja,
          osim ako zakon određuje drukčije.
        </p>
        <p>
          Ako ugovarate kao potrošač u smislu argentinskog Zakona 24.240, možete
          jednostrano raskinuti ugovor u roku od 10 kalendarskih dana od
          sklapanja (članak 34. tog zakona i članak 1110. Građanskog i
          trgovačkog zakonika), bez troškova i odgovornosti, a mi ćemo vam
          vratiti uplaćeno. To pravo ne vrijedi kad se Usluga ugovara radi
          uključivanja u komercijalnu ili profesionalnu djelatnost, što je
          uobičajena uporaba za agenciju.
        </p>
      </>
    ),
  },
  {
    id: "datos-personales",
    title: "Podaci Agencije i osobni podaci",
    brief:
      "Podaci pripadaju vašoj agenciji i ne prodajemo ih. Za podatke svojih klijenata odgovorni ste vi; mi ih obrađujemo u vaše ime.",
    content: (
      <>
        <p>
          Podaci Agencije pripadaju Agenciji. Tivvo ih koristi samo za pružanje,
          održavanje i poboljšanje Usluge, podršku i poštivanje zakona; ne
          prodaje ih niti ih koristi kako bi u vlastito ime kontaktirao vaše
          klijente.
        </p>
        <p>
          U pogledu osobnih podataka Krajnjih klijenata, Agencija je voditelj
          zbirke podataka, a Tivvo djeluje kao pružatelj usluga obrade u njezino
          ime, u smislu članka 25. argentinskog Zakona 25.326. Slijedom toga,
          Tivvo:
        </p>
        <ul>
          <li>
            obrađuje te podatke samo radi pružanja Usluge i prema uputama
            Agencije, koje proizlaze iz ovih Uvjeta i načina na koji ona
            konfigurira i koristi Uslugu;
          </li>
          <li>
            ne ustupa ih trećima, osim pružateljima usluga koji su mu potrebni za
            rad ili kad to naloži nadležno tijelo;
          </li>
          <li>
            primjenjuje tehničke i organizacijske sigurnosne mjere te od svojeg
            osoblja i pružatelja usluga zahtijeva povjerljivost;
          </li>
          <li>
            bez nepotrebnog odgađanja obavještava Agenciju ako otkrije sigurnosni
            incident koji pogađa njezine podatke;
          </li>
          <li>
            surađuje s Agencijom u odgovaranju na zahtjeve Krajnjih klijenata za
            pristup, ispravak ili brisanje;
          </li>
          <li>
            po prestanku Usluge briše te podatke u rokovima iz odjeljka »Izvoz i
            brisanje podataka«.
          </li>
        </ul>
        <p>
          Agencija sa svoje strane jamči da ima pravnu osnovu za unos tih
          podataka i da svoje Krajnje klijente obavještava o njihovoj obradi.{" "}
          <LegalLink href="/privacy">Pravila privatnosti</LegalLink> objašnjavaju
          koje podatke Tivvo obrađuje, s kojim pružateljima usluga i u kojim
          zemljama.
        </p>
      </>
    ),
  },
  {
    id: "contenido",
    title: "Sadržaj Agencije i licenca",
    brief:
      "Vaš sadržaj ostaje vaš; samo nam dopuštate da ga pohranjujemo i prikazujemo dok koristite Uslugu.",
    content: (
      <>
        <p>
          Agencija zadržava sva prava na fotografije, tekstove, logotipe i drugi
          sadržaj koji učitava. Daje nam neisključivu, besplatnu licencu
          ograničenu na trajanje Usluge za pohranu, kopiranje, prilagodbu
          (primjerice smanjivanje slika) i prikaz tog sadržaja, isključivo radi
          pružanja Usluge i objave Stranice Agencije.
        </p>
        <p>
          Ako primimo osnovanu pritužbu da neki sadržaj krši prava trećih osoba,
          možemo ga ukloniti i o tome ćemo vas obavijestiti.
        </p>
      </>
    ),
  },
  {
    id: "sitio-y-links",
    title: "Stranica Agencije i dijeljene poveznice",
    brief:
      "Stranica pripada vašoj agenciji. Privatne poveznice može otvoriti svatko tko ih ima: šaljite ih samo pravoj osobi.",
    content: (
      <>
        <p>
          Stranica Agencije pripada Agenciji: ona odlučuje što objavljuje i
          odgovara za sadržaj. Upiti koji stižu putem stranice, kartica
          nekretnina ili ponuda pohranjuju se u računu Agencije, a Tivvo u
          njezino ime šalje e-poruke s obavijestima i potvrdama.
        </p>
        <p>
          Ponude, rezervacije i portal vlasnika dijele se putem privatnih
          poveznica koje je teško pogoditi. Svatko tko ima poveznicu može vidjeti
          njezin sadržaj, pa ih Agencija smije slati samo osobi kojoj su
          namijenjene.
        </p>
        <p>
          Stranica Agencije trenutačno se objavljuje na poddomeni Tivva. Ako
          Agencija napusti Uslugu, stranica više nije dostupna.
        </p>
      </>
    ),
  },
  {
    id: "propiedad-intelectual",
    title: "Intelektualno vlasništvo Tivva",
    brief:
      "Softver i žig Tivvo su naši; možete ih koristiti dok vam je račun aktivan.",
    content: (
      <p>
        Softver, dizajn, predlošci stranica, žig Tivvo i njegov logotip
        pripadaju Tivvu ili njegovim davateljima licence. Ovi Uvjeti ne prenose
        vam nikakva prava na njima, osim dopuštenja da koristite Uslugu dok vam
        je račun aktivan. Ako nam pošaljete ideje ili prijedloge, možemo ih
        slobodno koristiti za poboljšanje Usluge, bez obveze naknade.
      </p>
    ),
  },
  {
    id: "terceros",
    title: "Usluge trećih strana",
    brief:
      "Google, Apple i vanjski kalendari podliježu vlastitim uvjetima i za njih ne odgovaramo.",
    content: (
      <p>
        Usluga je povezana s uslugama trećih strana, kao što su prijava putem
        Googlea ili Applea ili sinkronizacija kalendara s platformi za najam. Te
        usluge podliježu vlastitim uvjetima i pravilima, a Tivvo ne odgovara za
        njihov rad ni za promjene njihovih uvjeta.
      </p>
    ),
  },
  {
    id: "disponibilidad",
    title: "Dostupnost i podrška",
    brief:
      "Činimo što je razumno da sve dobro radi, bez jamstva da neće biti prekida. Podrška e-poštom radnim danima.",
    content: (
      <>
        <p>
          Ulažemo razumne napore da Usluga bude dostupna i da dobro radi, ali ne
          možemo jamčiti da će biti bez prekida ili pogrešaka. Kad je moguće,
          održavanje planiramo u vrijeme slabog korištenja i najavljujemo ga
          unaprijed.
        </p>
        <p>
          Upite i pritužbe rješavamo e-poštom na{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>,
          radnim danima od ponedjeljka do petka. Obveze u pogledu dostupnosti ili
          vremena odgovora (ugovori o razini usluge) postoje samo ako su
          dogovorene pisanim putem, primjerice u paketu Enterprise.
        </p>
      </>
    ),
  },
  {
    id: "exportacion",
    title: "Izvoz i brisanje podataka",
    brief:
      "Ono što izbrišete ide u koš na 30 dana. Ako zatvorite račun, imate 30 dana da izvezete podatke.",
    content: (
      <>
        <p>
          Ono što se izbriše unutar Usluge ide u koš, gdje se može vratiti
          tijekom 30 dana; nakon toga trajno se briše.
        </p>
        <p>
          Ako Agencija otkaže račun ili se račun zatvori iz bilo kojeg razloga,
          Podaci Agencije ostaju dostupni za izvoz 30 dana. Nakon toga brišemo
          ih iz aktivnih sustava, a sigurnosne kopije prepisuju se u redovitom
          ciklusu koji ne prelazi 90 dana. Dulje čuvamo samo ono što nam zakon
          nalaže (primjerice, evidenciju o naplati) ili, najdulje dvije godine,
          ono što nam Agencija izričito dopusti da čuvamo, kako dopušta članak
          25. argentinskog Zakona 25.326.
        </p>
      </>
    ),
  },
  {
    id: "suspension",
    title: "Suspenzija i raskid od strane Tivva",
    brief:
      "Račun možemo suspendirati zbog teških povreda ili sigurnosnog rizika, uz prethodnu obavijest osim u hitnim slučajevima.",
    content: (
      <>
        <p>
          Račun možemo suspendirati ili zatvoriti ako Agencija teško prekrši ove
          Uvjete, ako korištenje računa ugrožava sigurnost Usluge ili drugih
          agencija, ili ako to naloži nadležno tijelo. Osim u hitnim slučajevima
          ili kad postoji zakonska zapreka, obavijestit ćemo vas unaprijed i dati
          vam razuman rok da otklonite problem.
        </p>
        <p>
          Također možemo općenito prestati pružati Uslugu, uz obavijest najmanje
          90 dana unaprijed i povrat razmjernog dijela onoga što ste platili
          unaprijed.
        </p>
      </>
    ),
  },
  {
    id: "responsabilidad",
    title: "Ograničenje odgovornosti",
    brief:
      "Ne odgovaramo za izgubljenu dobit ni za vaše poslove; gornja granica je iznos koji ste platili u posljednjih 12 mjeseci, uz zakonske iznimke.",
    content: (
      <>
        <p>
          U mjeri u kojoj to zakon dopušta, Tivvo ne odgovara za izgubljenu
          dobit, gubitak poslovnih prilika ni neizravnu štetu koja proizlazi iz
          korištenja ili nemogućnosti korištenja Usluge, niti za poslove između
          Agencije, njezinih klijenata i vlasnika.
        </p>
        <p>
          Ukupna odgovornost Tivva prema Agenciji za bilo koji zahtjev povezan s
          Uslugom ograničena je na iznos koji je Agencija platila Tivvu u 12
          mjeseci prije događaja iz kojeg zahtjev proizlazi.
        </p>
        <p>
          Ta se ograničenja ne primjenjuju u slučaju namjere ili krupne nepažnje
          Tivva niti ograničavaju prava koja prisilni propisi, poput argentinskog
          Zakona 24.240, priznaju potrošačima.
        </p>
      </>
    ),
  },
  {
    id: "indemnidad",
    title: "Obeštećenje",
    brief:
      "Ako treća osoba postavi zahtjev zbog onoga što objavljujete ili zbog vaših poslova, odgovornost snosi vaša agencija.",
    content: (
      <p>
        Agencija će obeštetiti Tivvo za zahtjeve trećih osoba (uključujući
        Krajnje klijente, vlasnike i tijela vlasti) koji proizlaze iz sadržaja
        koji objavljuje, poslova koje obavlja ili kršenja ovih Uvjeta ili
        propisa primjenjivih na njezinu djelatnost, uključujući razumne troškove
        obrane.
      </p>
    ),
  },
  {
    id: "cambios",
    title: "Izmjene ovih Uvjeta",
    brief:
      "Bitne izmjene najavljujemo 30 dana unaprijed, a možete otkazati prije nego što stupe na snagu.",
    content: (
      <>
        <p>
          Ove Uvjete možemo ažurirati. Ako je izmjena bitna, obavijestit ćemo vas
          e-poštom i unutar Usluge najmanje 30 dana prije stupanja na snagu.
          Izmjene koje zahtijeva zakon ili koje su isključivo vama u korist mogu
          vrijediti i ranije.
        </p>
        <p>
          Ako se ne slažete s novom verzijom, račun možete otkazati prije nego
          što stupi na snagu. Ako i nakon toga nastavite koristiti Uslugu,
          smatra se da je prihvaćate. Datum važeće verzije naveden je na vrhu
          ove stranice.
        </p>
      </>
    ),
  },
  {
    id: "ley-aplicable",
    title: "Mjerodavno pravo i nadležnost",
    brief:
      "Primjenjuje se argentinsko pravo. Najprije pokušavamo riješiti razgovorom; ako ste potrošač, možete pokrenuti postupak u mjestu prebivališta.",
    content: (
      <>
        <p>
          Na ove se Uvjete primjenjuje pravo Republike Argentine. U slučaju
          spora najprije ćemo ga pokušati riješiti u dobroj vjeri; pišite nam na{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
        </p>
        <p>
          Ako se ne postigne dogovor, nadležni su redovni sudovi u{" "}
          {jurisdiction}. Ako ste ugovarali kao potrošač, svoj zahtjev možete
          podnijeti sudovima u mjestu prebivališta i tijelima za zaštitu
          potrošača (na nacionalnoj razini u Argentini putem{" "}
          <LegalLink href="https://www.argentina.gob.ar/produccion/defensadelconsumidor">
            argentina.gob.ar/defensadelconsumidor
          </LegalLink>
          ).
        </p>
      </>
    ),
  },
  {
    id: "contacto",
    title: "Kontakt",
    content: (
      <p>
        Za sva pitanja o ovim Uvjetima pišite nam na{" "}
        <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
        Sjedište: {address}.
      </p>
    ),
  },
];

export const content: LegalContent = {
  metaTitle: "Uvjeti korištenja",
  metaDescription:
    "Uvjeti korištenja Tivva, sustava za upravljanje agencijama za prodaju i kratkoročni najam.",
  title: "Uvjeti korištenja",
  intro: (
    <>
      <p>
        Pravila za korištenje Tivva: što radimo mi, što je na vašoj agenciji i
        što se događa s vašim podacima, uplatama i računom.
      </p>
      <p>
        Ovaj prijevod služi radi lakšeg razumijevanja. U slučaju neslaganja,
        mjerodavna je španjolska verzija.
      </p>
    </>
  ),
  summary: SUMMARY,
  sections: SECTIONS,
  related: { href: "/privacy", label: "Pravila privatnosti" },
};
