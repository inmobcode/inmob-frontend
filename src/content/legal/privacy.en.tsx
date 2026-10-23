import {
  LegalLink,
  type LegalContent,
  type LegalSection,
} from "@/components/legal/legal-document";
import { LegalTable } from "@/components/legal/legal-table";
import { LEGAL_ENTITY } from "@/lib/legal";

const { name, taxId, address, privacyEmail } = LEGAL_ENTITY;

const SUMMARY = [
  "We use your data to provide the service, bill for it, keep it secure and tell you what matters. We don't sell data or show ads.",
  "The data about clients and owners that an agency enters belongs to that agency: it decides how to use it and we process it on its behalf.",
  "We work with infrastructure and email providers that may be outside Argentina, under contracts that protect your data.",
  "You can ask us for access to, correction or deletion of your data by writing to " +
    privacyEmail +
    ". Access is free of charge.",
];

const SECTIONS: LegalSection[] = [
  {
    id: "responsable",
    title: "Who is responsible for your data",
    brief:
      "For the data of your agency and our visitors, we are the controller; for its clients' data, the agency is, and we process it on its behalf.",
    content: (
      <>
        <p>
          This Policy explains how {name}, tax ID (CUIT) {taxId}, with its
          address at {address} (“Tivvu”, “we”, “us”), processes personal data
          when you use tivvu.app, its subdomains and the agency websites
          published with Tivvu. It applies in accordance with Argentine Law
          25,326 on the Protection of Personal Data, its Regulatory Decree
          1558/2001 and the rules of the Agency for Access to Public Information
          (AAIP).
        </p>
        <p>Tivvu has two different roles depending on whose data it is:</p>
        <ul>
          <li>
            <strong>We are the controller</strong> of the data of agencies and
            their users (account, billing, use of the system), of people who
            request a demo or write to us, and of visitors to tivvu.app.
          </li>
          <li>
            <strong>We process data on behalf of each agency</strong> when it
            concerns its clients, prospects, guests and property owners. In that
            case the agency is the controller, and we act as a service provider
            processing data on its behalf (article 25 of Law 25,326): we follow
            its instructions and do not use that data for our own purposes.
          </li>
        </ul>
        <p>
          If you left your details on an agency&apos;s website, received an offer
          or have a booking, that agency decides about your data. It is best to
          write to them first; if you write to us, we will forward your request
          to them.
        </p>
      </>
    ),
  },
  {
    id: "datos-que-tratamos",
    title: "What data we process",
    brief:
      "Account, sign-in, technical data and communications; and, on behalf of each agency, its clients' data. We don't ask for sensitive data.",
    content: (
      <>
        <h3>If you use Tivvu at an agency</h3>
        <ul>
          <li>
            <strong>Account:</strong> name, email, password (stored encrypted
            with a hashing algorithm, never in plain text), role and the agency
            you belong to.
          </li>
          <li>
            <strong>Sign-in with Google or Apple:</strong> if you choose it, we
            receive your name, your email and an account identifier from that
            provider. We do not receive your password.
          </li>
          <li>
            <strong>Agency:</strong> name, contact details, logo, website
            settings and, on paid plans, the details needed for billing.
          </li>
          <li>
            <strong>Usage and technical data:</strong> sign-in dates, relevant
            actions within the system, IP address, browser and error logs,
            which we use for security and to solve problems.
          </li>
          <li>
            <strong>Communications:</strong> what you write to us by email or in
            the demo form (name, email, agency, team size and your message).
          </li>
        </ul>
        <h3>Data agencies enter or receive with Tivvu</h3>
        <p>
          On behalf of each agency we process its end clients&apos; data: name,
          email, phone, inquiries and messages, notes and history, offers,
          bookings with dates and number of guests, recorded payments,
          documents the agency attaches and details of property owners and their
          properties. Which data is entered depends on each agency.
        </p>
        <p>
          We do not ask for sensitive data and we ask agencies not to enter it
          unless the law allows it and it is essential.
        </p>
      </>
    ),
  },
  {
    id: "finalidades",
    title: "What we use it for",
    brief:
      "To provide the service, bill for it, keep it secure and tell you what matters. We don't sell data or run third-party advertising.",
    content: (
      <>
        <p>We use the data we are the controller of to:</p>
        <ol>
          <li>
            create and manage your account and your agency&apos;s, and let you
            sign in;
          </li>
          <li>provide the Service you signed up for, with its features and limits;</li>
          <li>invoice and collect payment for paid plans;</li>
          <li>
            send you operational notices: security, password changes, new
            inquiries, changes to plans or to these terms;
          </li>
          <li>give you support and answer your questions or demo request;</li>
          <li>protect the Service, detect abuse and prevent fraud;</li>
          <li>
            understand how the Service is used in order to improve it, with
            aggregated data whenever possible;
          </li>
          <li>
            send you product news, if you have not objected (you can unsubscribe
            from any email);
          </li>
          <li>comply with legal, accounting and tax obligations.</li>
        </ol>
        <p>
          We use end clients&apos; data only so the agency can work with it: store
          it, show it to its team, publish its offers or bookings on private
          links and send, on the agency&apos;s behalf, the notification and
          confirmation emails for inquiries, offers and bookings.
        </p>
        <p>
          We do not sell personal data, we do not use it for third-party
          advertising and we do not make automated decisions that produce legal
          effects on people.
        </p>
      </>
    ),
  },
  {
    id: "bases",
    title: "Why we are allowed to process it",
    brief:
      "Contract, your consent or a legal obligation. The required fields in each form are the ones the service needs.",
    content: (
      <>
        <p>
          We process your data because it is necessary for the contractual
          relationship with your agency (article 5(2)(c) of Law 25,326), because
          you gave us your consent (for example, when sending the demo form), or
          because a rule requires us to keep it (for example, billing records).
        </p>
        <p>
          The fields marked as required in each form are necessary to provide
          the Service: if you do not provide them, we cannot create the account
          or answer your request. The rest are optional.
        </p>
        <p>
          When we process data on behalf of an agency, it is that agency that
          must have a legal basis and, where applicable, its clients&apos;
          consent.
        </p>
      </>
    ),
  },
  {
    id: "proveedores",
    title: "Who we share it with",
    brief:
      "Only with the providers we need to operate, under contracts that protect your data.",
    content: (
      <>
        <p>
          We share data only with providers we need to run the Service, under
          contracts that require confidentiality and security and that they use
          the data only to provide their service to us:
        </p>
        <LegalTable
          columns={["Provider", "What we use it for"]}
          rows={[
            [
              "Supabase (on Amazon Web Services infrastructure)",
              "Database and storage of photos and files.",
            ],
            [
              "Resend",
              "Sending system emails: notifications, confirmations and password recovery.",
            ],
            [
              "Web application hosting providers",
              "They serve the pages and receive the technical data of each visit (IP address, browser).",
            ],
            ["Google and Apple", "Only if you choose to sign in with their account."],
          ]}
        />
        <p>
          In addition, data is shown to the relevant people depending on how
          you use the Service: your agency&apos;s team sees the agency&apos;s data,
          and whoever receives an offer, booking or owner portal link sees that
          link&apos;s content.
        </p>
        <p>
          We may disclose data if ordered by a judge or competent authority, or
          if necessary to defend our rights. If Tivvu merges or is acquired, the
          data will be transferred to the new entity, which must respect this
          Policy.
        </p>
      </>
    ),
  },
  {
    id: "transferencias",
    title: "International transfers",
    brief:
      "Some providers are outside Argentina; transfers are made with safeguards equivalent to those of the law.",
    content: (
      <>
        <p>
          Some of our providers host or process data outside Argentina,
          including in the United States and the European Union. The European
          Union is recognised by the AAIP as a destination with an adequate
          level of protection; for other countries, transfers are made under
          contractual clauses offering safeguards equivalent to those of Law
          25,326, in line with the models approved by AAIP Provision 60-E/2016
          and Resolution 198/2023.
        </p>
        <p>
          By using the Service, and under article 12 of Law 25,326, you consent
          to these transfers. If you would like to know more about the
          safeguards we apply, write to us.
        </p>
      </>
    ),
  },
  {
    id: "conservacion",
    title: "How long we keep it",
    brief:
      "Each kind of data has its own period: from 30 days in the bin to 10 years for billing.",
    content: (
      <LegalTable
        columns={["What data", "How long we keep it"]}
        rows={[
          [
            "Account and agency data",
            "While the account is active. If it is closed, it remains available for export for 30 days and is then deleted; backups are overwritten within a period not exceeding 90 days.",
          ],
          [
            "Items deleted within the system",
            "30 days in the bin, where they can be recovered; after that they are permanently deleted.",
          ],
          [
            "Billing data",
            "10 years, as required by article 328 of the Argentine Civil and Commercial Code for accounting records.",
          ],
          [
            "Technical and security logs",
            "As long as needed to investigate incidents, generally no more than 12 months.",
          ],
          [
            "Demo requests and inquiries",
            "Up to 2 years from the last contact, or sooner if you ask us to delete them.",
          ],
        ]}
      />
    ),
  },
  {
    id: "seguridad",
    title: "How we protect it",
    brief:
      "Encryption, hashed passwords, data separated by agency and role-based permissions. If there is an incident, we let you know.",
    content: (
      <>
        <p>
          We apply technical and organisational measures following the
          recommendations of AAIP Resolution 47/2018, including:
        </p>
        <ul>
          <li>
            encryption of communications (HTTPS/TLS) between your browser, the
            application and our providers;
          </li>
          <li>passwords stored as hashes, never readable;</li>
          <li>
            separation of data by agency: each team only accesses its own space;
          </li>
          <li>role-based permissions within each agency;</li>
          <li>
            private links for offers, bookings and owners generated with
            hard-to-guess identifiers;
          </li>
          <li>backups and restricted staff access to production data.</li>
        </ul>
        <p>
          No system is infallible. If we detect a security incident affecting
          personal data, we investigate it, take steps to contain it, notify the
          affected agencies without undue delay and, where appropriate, the AAIP
          and the people affected.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and storage in your browser",
    brief:
      "Only those needed for the service to work: no advertising or third-party tracking.",
    content: (
      <>
        <p>
          Tivvu only uses cookies and local storage that are necessary for the
          Service to work. We do not use advertising or third-party tracking
          cookies.
        </p>
        <LegalTable
          columns={["What it stores", "What it's for", "How long it lasts"]}
          rows={[
            [
              <>
                Session (<code>access_token</code>, <code>refresh_token</code>,{" "}
                <code>tivvu_user</code>)
              </>,
              "They keep you signed in.",
              "Up to 180 days or until you sign out.",
            ],
            [
              <>
                Preferences (<code>sidebar_collapsed</code> and local storage)
              </>,
              "They remember whether the menu is collapsed, the view chosen in each list and the light or dark theme.",
              "The menu cookie, up to 1 year; the rest, until you clear it from your browser.",
            ],
            [
              "Sign-in with Google or Apple",
              "During sign-in we store in the tab the page to return to.",
              "Deleted when finished.",
            ],
          ]}
        />
        <p>
          You can delete or block cookies from your browser. If you block the
          session cookies, you will not be able to sign in. Agencies&apos; public
          websites do not set Tivvu cookies.
        </p>
      </>
    ),
  },
  {
    id: "derechos",
    title: "Your rights and how to exercise them",
    brief:
      "You can ask for access, correction, deletion or for us to stop writing to you; we reply within the periods in the table.",
    content: (
      <>
        <p>As the data subject you have the right to:</p>
        <LegalTable
          columns={["Right", "What you can ask for", "Response time"]}
          rows={[
            [
              "Access",
              "Know what data of yours we hold, where it came from and what we use it for. It is free if you request it at intervals of at least six months, unless you show a legitimate interest in doing so sooner (article 14 of Law 25,326).",
              "10 calendar days",
            ],
            [
              "Rectification, update and erasure",
              "Have us correct inaccurate data or delete data that should not be kept (article 16).",
              "5 business days",
            ],
            [
              "Objection to commercial communications",
              "Ask us to stop sending you news, at any time (article 27).",
              "At any time",
            ],
            [
              "Withdraw your consent",
              "Where the processing is based on it, without retroactive effect.",
              "At any time",
            ],
          ]}
        />
        <p>
          To exercise them, write to{" "}
          <LegalLink href={`mailto:${privacyEmail}`}>{privacyEmail}</LegalLink>{" "}
          from the email associated with your data, stating what you are asking
          for. If we cannot verify your identity, we will ask you for a document
          proving it. You can also correct most of your data from your profile.
        </p>
        <p>
          If your data was entered by an agency (for example, because you sent it
          an inquiry), the request should be addressed to that agency; if it
          reaches us, we will forward it within 5 business days and help the
          agency respond.
        </p>
        <p>
          If we do not respond in time or you are not satisfied with the
          response, you can file a complaint with the Agency for Access to
          Public Information at{" "}
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
    title: "Minors",
    brief: "Tivvu is a tool for people over 18.",
    content: (
      <p>
        Tivvu is a professional tool for people over 18 and is not aimed at
        minors. If you know that a minor has given us their data without
        authorisation, write to us and we will delete it.
      </p>
    ),
  },
  {
    id: "cambios",
    title: "Changes to this Policy",
    brief: "We give 30 days' notice of material changes.",
    content: (
      <p>
        We may update this Policy to reflect changes to the Service or to the
        law. If the change is material, we will notify you by email and within
        the Service at least 30 days in advance. The date of the current version
        is shown at the top of this page.
      </p>
    ),
  },
  {
    id: "contacto",
    title: "Contact",
    content: (
      <>
        <p>
          For any privacy questions, write to us at{" "}
          <LegalLink href={`mailto:${privacyEmail}`}>{privacyEmail}</LegalLink>{" "}
          or by post to {address}.
        </p>
        <p className="border-l-2 border-line pl-4 text-sm text-quiet">
          THE AGENCY FOR ACCESS TO PUBLIC INFORMATION, as the Supervisory Body of
          Law No. 25,326, has the power to handle the complaints and claims filed
          by those whose rights are affected by non-compliance with the rules in
          force on personal data protection.
        </p>
      </>
    ),
  },
];

export const content: LegalContent = {
  metaTitle: "Privacy policy",
  metaDescription:
    "What personal data Tivvu processes, why, who it shares it with and how to exercise your rights.",
  title: "Privacy policy",
  intro: (
    <>
      <p>
        What personal data we process, why, who we share it with and how you
        can access it, correct it or ask us to delete it.
      </p>
      <p>
        This translation is provided for convenience. In the event of any
        discrepancy, the Spanish version prevails.
      </p>
    </>
  ),
  summary: SUMMARY,
  sections: SECTIONS,
  related: { href: "/terms", label: "Terms and conditions" },
  action: {
    href: `mailto:${privacyEmail}?subject=${encodeURIComponent("Request about my personal data")}`,
    label: "Exercise my rights",
    hint: `Write to us at ${privacyEmail}: access, correction or deletion.`,
  },
};
