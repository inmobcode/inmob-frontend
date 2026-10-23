import {
  LegalLink,
  type LegalContent,
  type LegalSection,
} from "@/components/legal/legal-document";
import { LEGAL_ENTITY } from "@/lib/legal";

const { name, taxId, address, jurisdiction, contactEmail } = LEGAL_ENTITY;

const SUMMARY = [
  "Tivvo is a tool for your agency to manage properties, clients, offers and bookings, and to publish its own website. We are not a party to the deals you make with your clients.",
  "The data you enter belongs to your agency. We store and process it to provide the service, and you can export it.",
  "Your agency is responsible for complying with the rules of its business: licensing, truthful advertising, rental contracts and the protection of its clients' data.",
  "You can cancel your plan whenever you like, through the same channel you used to sign up. We give you 30 days' notice if prices or these terms change.",
];

const SECTIONS: LegalSection[] = [
  {
    id: "quienes-somos",
    title: "Who we are and what these terms cover",
    brief:
      "These Terms, the Privacy Policy and the conditions of your plan form the entire agreement between Tivvo and your agency.",
    content: (
      <>
        <p>
          These Terms and Conditions (the “Terms”) govern access to and use of
          Tivvo, the management system for real estate agencies available at
          tivvo.app and its subdomains (the “Service”). The Service is provided
          by {name}, tax ID (CUIT) {taxId}, with its address at {address}{" "}
          (“Tivvo”, “we”, “us”).
        </p>
        <p>
          The Terms, together with the{" "}
          <LegalLink href="/privacy">Privacy Policy</LegalLink> and the
          conditions of the plan you sign up for, form the entire agreement
          between Tivvo and the Agency. If a specific condition of your plan
          (for example, a signed Enterprise agreement) says something different,
          the specific condition prevails.
        </p>
      </>
    ),
  },
  {
    id: "definiciones",
    title: "Definitions",
    brief:
      "The Agency is whoever opens the account, Users are the people who work in it and End Clients are the people whose data is entered.",
    content: (
      <ul>
        <li>
          <strong>Agency:</strong> the individual or legal entity that creates
          a Tivvo account to manage its real estate business.
        </li>
        <li>
          <strong>Users:</strong> the people the Agency authorises to use its
          account (owners, administrators, agents and other roles).
        </li>
        <li>
          <strong>End Clients:</strong> the people whose data the Agency enters
          or receives through the Service: prospects, buyers, tenants, guests
          and property owners.
        </li>
        <li>
          <strong>Agency Data:</strong> all the information the Agency and its
          Users enter into the Service or receive through it: properties,
          photos, texts, rates, clients, inquiries, offers, bookings, recorded
          payments and documents.
        </li>
        <li>
          <strong>Agency Website:</strong> the public website the Agency builds
          with Tivvo&apos;s editor, published on a Tivvo subdomain under the
          Agency&apos;s name.
        </li>
      </ul>
    ),
  },
  {
    id: "aceptacion",
    title: "Acceptance and capacity",
    brief:
      "By using Tivvo you accept these Terms. You must be over 18 and able to enter into contracts.",
    content: (
      <>
        <p>
          By creating an account, signing in with Google or Apple, or using the
          Service, you accept these Terms. If you do not agree, do not use the
          Service.
        </p>
        <p>
          To create an account you must be over 18 and have legal capacity to
          contract. If you create it on behalf of a company or another person,
          you declare that you have sufficient authority to bind them; in that
          case, “you” and “the Agency” refer to that company or person.
        </p>
        <p>
          These Terms are a standard-form contract under articles 984 et seq.
          of the Argentine Civil and Commercial Code. We wrote them to be
          understood without help; if anything is unclear, write to us before
          accepting them.
        </p>
      </>
    ),
  },
  {
    id: "cuenta",
    title: "Account, users and security",
    brief:
      "Keep your details up to date, don't share passwords and let us know if you suspect someone has accessed your account.",
    content: (
      <>
        <p>
          The Agency must provide truthful information and keep it up to date,
          especially the contact email, because that is how we notify you of
          important changes.
        </p>
        <p>
          The Agency decides who accesses its account and with what
          permissions, and is responsible for what its Users do within the
          Service. Each User must have their own credentials: do not share
          passwords between people.
        </p>
        <p>
          If you suspect someone has accessed your account without
          authorisation, change the password and let us know immediately at{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
        </p>
      </>
    ),
  },
  {
    id: "servicio",
    title: "What the Service includes",
    brief:
      "What you can do depends on your plan. We may change features; if we remove an essential one from a paid plan, we give 30 days' notice.",
    content: (
      <>
        <p>Depending on the plan, the Service lets you, among other things:</p>
        <ul>
          <li>add and publish properties for sale and for short-term rental;</li>
          <li>
            manage clients, inquiries, offers, bookings, availability, seasonal
            rates and recorded payments;
          </li>
          <li>
            share offers, bookings and the owner portal through private links;
          </li>
          <li>build and publish the Agency Website;</li>
          <li>work as a team with roles and permissions.</li>
        </ul>
        <p>
          Tivvo improves the Service continuously: we may add, change or remove
          features. If we remove an essential feature from a paid plan, we will
          notify you at least 30 days in advance and, if the change does not
          suit you, you can cancel the plan at no cost.
        </p>
        <p>
          Some features may be offered as “beta” or trial features. They are
          provided as they are, may change without notice and should not be
          relied on for critical tasks.
        </p>
      </>
    ),
  },
  {
    id: "rol-de-tivvo",
    title: "Tivvo is not a party to your deals",
    brief:
      "Tivvo is software: it is not an estate agency or an intermediary, and it does not process or hold your payments.",
    content: (
      <>
        <p>
          Tivvo is a software tool. It is not an estate agency, does not act as
          a broker or intermediary, does not collect money on the Agency&apos;s
          behalf and does not guarantee that any deal will close. Sales,
          rentals, bookings, deposits, commissions and payments are agreements
          between the Agency, its clients and the property owners.
        </p>
        <p>
          The payments the Agency records in Tivvo are entries for its own
          control; Tivvo does not process or hold them. Availability synced
          with external calendars (for example, via iCal) depends on those
          services and may be delayed: the Agency must confirm availability
          before closing a booking.
        </p>
      </>
    ),
  },
  {
    id: "obligaciones-agencia",
    title: "The Agency's responsibilities",
    brief:
      "Your agency is responsible for its licence, the accuracy of its listings, its contracts, its clients' data and its taxes.",
    content: (
      <>
        <p>
          The Agency is solely responsible for its business and, in particular,
          for:
        </p>
        <ul>
          <li>
            complying with the real estate brokerage rules that apply to it
            (licensing, professional bodies and the laws of each jurisdiction
            where it operates);
          </li>
          <li>
            ensuring that the information about its properties, prices and
            conditions is truthful, complete and up to date, as required by
            consumer protection law (in Argentina, Law 24,240);
          </li>
          <li>
            the contracts it enters into with its clients and property owners,
            including the rules on leases and short-term rentals;
          </li>
          <li>
            processing the personal data of its End Clients in accordance with
            the applicable law (in Argentina, Law 25,326; see the “Agency data
            and personal data” section);
          </li>
          <li>
            holding the rights to the photos, floor plans, texts and trademarks
            it publishes, and the owners&apos; permission to publish their
            properties;
          </li>
          <li>the taxes and tax obligations arising from its business.</li>
        </ul>
      </>
    ),
  },
  {
    id: "uso-aceptable",
    title: "Acceptable use",
    brief:
      "No fake listings, spam, unnecessary sensitive data, scraping or attempts to access other people's accounts.",
    content: (
      <>
        <p>You may not use the Service to:</p>
        <ul>
          <li>
            publish non-existent properties, misleading prices or unlawful
            content;
          </li>
          <li>
            send unsolicited commercial communications or use contact details
            obtained without a legal basis;
          </li>
          <li>
            enter sensitive data (health, racial or ethnic origin, political
            opinions, religious beliefs, sex life) unless the law allows it and
            it is essential;
          </li>
          <li>
            infringe third parties&apos; intellectual property, image or privacy
            rights;
          </li>
          <li>
            try to access other agencies&apos; accounts or data, test
            vulnerabilities without authorisation, overload the infrastructure
            or distribute malicious software;
          </li>
          <li>
            copy the Service in an automated way (scraping), reverse engineer it
            or resell it without a written agreement with Tivvo.
          </li>
        </ul>
        <p>
          If you find a vulnerability, tell us at{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>:
          we will look into it and get back to you.
        </p>
      </>
    ),
  },
  {
    id: "planes-y-pagos",
    title: "Plans, prices and payments",
    brief:
      "Billed in advance and renewed automatically. We give 30 days' notice before changing prices; if a payment fails, you have 15 days to settle it.",
    content: (
      <>
        <p>
          Tivvo offers a free plan with limits (for example, on the number of
          properties and Users) and paid plans. The current prices, limits and
          features of each plan are published at{" "}
          <LegalLink href="/#planes">tivvo.app</LegalLink> or agreed in writing
          for custom plans.
        </p>
        <ul>
          <li>
            Paid plans are billed in advance on a monthly basis (or for the
            period agreed) and renew automatically until the Agency cancels
            them.
          </li>
          <li>
            Prices published in US dollars may be paid in Argentine pesos at the
            exchange rate stated at the time of payment. Applicable taxes are
            added to the price unless stated otherwise.
          </li>
          <li>
            If we change the price of your plan, we will notify you by email at
            least 30 days in advance. The new price applies from the period
            following the notice; if you do not agree, you can cancel the plan
            before it takes effect.
          </li>
          <li>
            If a payment does not go through, we will let you know and you have
            15 calendar days to settle it. After that, we may move the account
            to the free plan or suspend it. Your data is not deleted because of
            the suspension.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "baja",
    title: "Cancellation and right of withdrawal",
    brief:
      "You can cancel whenever you like. It takes effect at the end of the paid period and there are no pro-rata refunds, unless the law says otherwise.",
    content: (
      <>
        <p>
          The Agency can cancel its plan at any time, without giving a reason
          and without penalty, through the same channel it used to sign up or
          by writing to{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
          Within 24 hours we will send you, through the same channel, a code
          identifying your cancellation request.
        </p>
        <p>
          Cancellation takes effect at the end of the period already paid: until
          then you keep access to the plan. We do not give pro-rata refunds for
          periods that have already started, unless the law provides otherwise.
        </p>
        <p>
          If you sign up as a consumer under Argentine Law 24,240, you can
          withdraw from the contract within 10 calendar days of signing up
          (article 34 of that law and article 1110 of the Civil and Commercial
          Code), at no cost or liability, and we will refund what you have paid.
          This right does not apply when the Service is contracted to be part of
          a commercial or professional activity, which is how an agency
          normally uses it.
        </p>
      </>
    ),
  },
  {
    id: "datos-personales",
    title: "Agency data and personal data",
    brief:
      "The data belongs to your agency and we don't sell it. You are responsible for your clients' data; we process it on your behalf.",
    content: (
      <>
        <p>
          Agency Data belongs to the Agency. Tivvo uses it only to provide,
          maintain and improve the Service, give you support and comply with
          the law; it does not sell it or use it to contact your clients on its
          own account.
        </p>
        <p>
          With regard to End Clients&apos; personal data, the Agency is the
          controller of the database and Tivvo acts as a service provider
          processing it on the Agency&apos;s behalf, under article 25 of
          Argentine Law 25,326. Accordingly, Tivvo:
        </p>
        <ul>
          <li>
            processes that data only to provide the Service and in accordance
            with the Agency&apos;s instructions, which arise from these Terms and
            from how it configures and uses the Service;
          </li>
          <li>
            does not disclose it to third parties, except to the providers it
            needs to operate or when ordered by an authority;
          </li>
          <li>
            applies technical and organisational security measures and requires
            confidentiality from its staff and providers;
          </li>
          <li>
            notifies the Agency without undue delay if it detects a security
            incident affecting its data;
          </li>
          <li>
            helps the Agency respond to End Clients&apos; requests for access,
            rectification or erasure;
          </li>
          <li>
            when the Service ends, deletes that data within the periods set out
            in the “Data export and deletion” section.
          </li>
        </ul>
        <p>
          The Agency, for its part, warrants that it has a legal basis for
          entering that data and that it informs its End Clients how it is
          processed. The <LegalLink href="/privacy">Privacy Policy</LegalLink>{" "}
          explains what data Tivvo processes, with which providers and in which
          countries.
        </p>
      </>
    ),
  },
  {
    id: "contenido",
    title: "Agency content and licence",
    brief:
      "Your content remains yours; you only give us permission to host and display it while you use the Service.",
    content: (
      <>
        <p>
          The Agency keeps all its rights to the photos, texts, logos and other
          content it uploads. It grants us a non-exclusive, royalty-free licence,
          limited to the term of the Service, to host, copy, adapt (for example,
          resize images) and display that content, solely to provide the Service
          and publish the Agency Website.
        </p>
        <p>
          If we receive a well-founded complaint that content infringes third
          parties&apos; rights, we may remove it and will let you know.
        </p>
      </>
    ),
  },
  {
    id: "sitio-y-links",
    title: "Agency Website and shared links",
    brief:
      "The website belongs to your agency. Anyone who has a private link can open it: send them only to the right person.",
    content: (
      <>
        <p>
          The Agency Website belongs to the Agency: it decides what to publish
          and is responsible for its content. Inquiries that come in through the
          website, property pages or offers are stored in the Agency&apos;s
          account, and Tivvo sends the notification and confirmation emails on
          its behalf.
        </p>
        <p>
          Offers, bookings and the owner portal are shared through private links
          that are hard to guess. Anyone who has the link can see its content,
          so the Agency must send them only to the right person.
        </p>
        <p>
          The Agency Website is currently published on a Tivvo subdomain. If
          the Agency leaves the Service, the website stops being available.
        </p>
      </>
    ),
  },
  {
    id: "propiedad-intelectual",
    title: "Tivvo's intellectual property",
    brief:
      "The software and the Tivvo brand are ours; you can use them while your account is active.",
    content: (
      <p>
        The software, design, website templates, the Tivvo brand and its logo
        belong to Tivvo or its licensors. These Terms do not transfer any rights
        in them to you, beyond permission to use the Service while your account
        is active. If you send us ideas or suggestions, we may use them freely
        to improve the Service, with no obligation to compensate you.
      </p>
    ),
  },
  {
    id: "terceros",
    title: "Third-party services",
    brief:
      "Google, Apple and external calendars are governed by their own terms, and we are not responsible for them.",
    content: (
      <p>
        The Service integrates with third-party services, such as signing in
        with Google or Apple, or syncing calendars from rental platforms. Those
        services are governed by their own terms and policies, and Tivvo is not
        responsible for how they work or for changes they make to their terms.
      </p>
    ),
  },
  {
    id: "disponibilidad",
    title: "Availability and support",
    brief:
      "We do what is reasonable to keep it running well, without guaranteeing zero interruptions. Email support on business days.",
    content: (
      <>
        <p>
          We make reasonable efforts to keep the Service available and working
          well, but we cannot guarantee it will be free of interruptions or
          errors. Where possible, we schedule maintenance at low-traffic times
          and announce it in advance.
        </p>
        <p>
          We handle questions and complaints by email at{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>,
          on business days from Monday to Friday. Availability or response-time
          commitments (service level agreements) only exist if agreed in
          writing, for example in an Enterprise plan.
        </p>
      </>
    ),
  },
  {
    id: "exportacion",
    title: "Data export and deletion",
    brief:
      "What you delete goes to the bin for 30 days. If you close your account, you have 30 days to export your data.",
    content: (
      <>
        <p>
          Anything deleted within the Service goes to the bin, where it can be
          recovered for 30 days; after that it is permanently deleted.
        </p>
        <p>
          If the Agency cancels its account or the account is closed for any
          reason, the Agency Data remains available for export for 30 days.
          After that we delete it from our active systems, and backups are
          overwritten in their normal cycle, which does not exceed 90 days. We
          only keep for longer what the law requires us to keep (for example,
          billing records) or, for up to two years, what the Agency expressly
          authorises us to keep, as permitted by article 25 of Argentine Law
          25,326.
        </p>
      </>
    ),
  },
  {
    id: "suspension",
    title: "Suspension and termination by Tivvo",
    brief:
      "We may suspend an account for serious breaches or security risks, giving notice first except in an emergency.",
    content: (
      <>
        <p>
          We may suspend or close an account if the Agency seriously breaches
          these Terms, if the use of the account puts the security of the
          Service or of other agencies at risk, or if a competent authority
          orders it. Except in an emergency or where legally prevented, we will
          notify you beforehand and give you a reasonable period to fix the
          problem.
        </p>
        <p>
          We may also stop providing the Service altogether, giving at least 90
          days&apos; notice and refunding the pro-rata portion of anything you
          have paid in advance.
        </p>
      </>
    ),
  },
  {
    id: "responsabilidad",
    title: "Limitation of liability",
    brief:
      "We are not liable for lost profits or for your deals; the cap is what you paid in the last 12 months, with the exceptions set by law.",
    content: (
      <>
        <p>
          To the extent permitted by law, Tivvo is not liable for lost profits,
          lost business opportunities or indirect damages arising from the use
          of, or inability to use, the Service, nor for the deals between the
          Agency, its clients and property owners.
        </p>
        <p>
          Tivvo&apos;s total liability to the Agency for any claim related to the
          Service is limited to the amount the Agency paid Tivvo in the 12
          months before the event giving rise to the claim.
        </p>
        <p>
          These limits do not apply in cases of wilful misconduct or gross
          negligence by Tivvo, nor do they limit the rights that mandatory
          rules, such as Argentine Law 24,240, grant to consumers.
        </p>
      </>
    ),
  },
  {
    id: "indemnidad",
    title: "Indemnity",
    brief:
      "If a third party makes a claim over what you publish or over your deals, your agency is responsible.",
    content: (
      <p>
        The Agency will hold Tivvo harmless against third-party claims
        (including End Clients, property owners and authorities) arising from
        the content it publishes, the deals it makes or its breach of these
        Terms or of the rules applicable to its business, including reasonable
        defence costs.
      </p>
    ),
  },
  {
    id: "cambios",
    title: "Changes to these Terms",
    brief:
      "We give 30 days' notice of material changes, and you can cancel before they take effect.",
    content: (
      <>
        <p>
          We may update these Terms. If the change is material, we will notify
          you by email and within the Service at least 30 days before it takes
          effect. Changes required by law or that only benefit you may apply
          sooner.
        </p>
        <p>
          If you do not agree with the new version, you can cancel your account
          before it takes effect. If you keep using the Service afterwards, you
          are deemed to accept it. The date of the current version is shown at
          the top of this page.
        </p>
      </>
    ),
  },
  {
    id: "ley-aplicable",
    title: "Governing law and jurisdiction",
    brief:
      "Argentine law applies. We first try to resolve things by talking; if you are a consumer, you can bring a claim where you live.",
    content: (
      <>
        <p>
          These Terms are governed by the laws of the Argentine Republic. In
          the event of any dispute, we will first try to resolve it in good
          faith; write to us at{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
        </p>
        <p>
          If no agreement is reached, the ordinary courts of {jurisdiction} will
          have jurisdiction. If you signed up as a consumer, you can bring your
          claim before the courts of your place of residence and before the
          consumer protection authorities (at national level in Argentina,
          through{" "}
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
    title: "Contact",
    content: (
      <p>
        For any questions about these Terms, write to us at{" "}
        <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
        Registered address: {address}.
      </p>
    ),
  },
];

export const content: LegalContent = {
  metaTitle: "Terms and conditions",
  metaDescription:
    "Terms of use of Tivvo, the management system for sales and short-term rental agencies.",
  title: "Terms and conditions",
  intro: (
    <>
      <p>
        The rules for using Tivvo: what we do, what is up to your agency and
        what happens to your data, your payments and your account.
      </p>
      <p>
        This translation is provided for convenience. In the event of any
        discrepancy, the Spanish version prevails.
      </p>
    </>
  ),
  summary: SUMMARY,
  sections: SECTIONS,
  related: { href: "/privacy", label: "Privacy policy" },
};
