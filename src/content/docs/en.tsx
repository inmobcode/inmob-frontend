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
      title="Getting started"
      intro="Tivvo brings together in one place the inquiries you receive, your clients, your property portfolio, the proposals you send, bookings and availability. Everything you publish appears on your agency’s website."
    >
      <DocFigure
        src="/docs-media/en/panel.webp"
        alt="The Tivvo dashboard with the side menu, the property list and the profile card"
        width={1584}
        height={946}
        markers={[
          { x: 8.9, y: 11.6, label: "The side menu: every tool in the dashboard." },
          { x: 15.5, y: 4.7, label: "Collapse or expand the menu (Ctrl/⌘ + B)." },
          { x: 15.1, y: 11.6, label: "How many unread inquiries you have." },
          { x: 34.7, y: 6, label: "The list bar: search, sort, filters, views, bin and import." },
          { x: 87.6, y: 6, label: "Create a new one." },
          { x: 14.7, y: 94.7, label: "The notification bell." },
          { x: 8.8, y: 93.7, label: "Your profile card: your account, appearance, help and this documentation." },
        ]}
      />

      <DocH3>The side menu</DocH3>
      <DocP>
        The tools follow the order in which an agency works: an <strong>inquiry</strong> comes in, becomes a{" "}
        <strong>client</strong>, you offer them <strong>properties</strong> in an <strong>offer</strong> and it ends in a{" "}
        <strong>booking</strong>. Then come <strong>Availability</strong> and <strong>Services</strong>. If you are the
        account owner or an administrator, at the end you also see <strong>Site</strong>, <strong>Team</strong> and{" "}
        <strong>Settings</strong>.
      </DocP>
      <DocP>
        “Inquiries” shows a number when you have unread inquiries; it updates on its own every minute. You can collapse
        the menu with the button at the top or with <Kbd>Ctrl/⌘</Kbd> <Kbd>B</Kbd> to gain space, and Tivvo remembers how
        you left it. On a phone, the menu opens from the icon at the top.
      </DocP>

      <DocH3>Notifications</DocH3>
      <DocP>
        The bell, next to your name, tells you what happened while you weren’t looking: a new inquiry, a client who
        opened an offer or replied from it, a recorded payment, a booking and the tasks assigned to you. The number shows
        how many notifications you haven’t read; it updates every minute.
      </DocP>
      <DocFigure
        src="/docs-media/en/notificaciones.webp"
        alt="The notification list with new inquiries and an opened offer"
        width={760}
        height={982}
        className="max-w-sm"
        markers={[
          { x: 75.8, y: 8.1, label: "“Mark all” marks them as read." },
          { x: 50, y: 23.2, label: "Each notification takes you to what happened (the inquiry, offer or booking). The dot means you haven’t read it." },
        ]}
      />
      <DocP>
        To delete a notification, hover over it and click the cross on the right (on a phone, the cross is always
        visible). It is deleted only for you: the rest of the team still sees theirs, and it can’t be recovered.
      </DocP>

      <DocH3>Your profile card</DocH3>
      <DocP>
        Your name is at the bottom of the menu. Clicking it opens your account menu: your profile, settings, switching
        agency (if you work for more than one), viewing or copying your site link, appearance, language, this documentation, search,
        keyboard shortcuts, help and sign out.
      </DocP>
      <DocFigure
        src="/docs-media/en/menu-perfil.webp"
        alt="The account menu opened from the profile card"
        width={640}
        height={1252}
        className="max-w-xs"
        markers={[
          { x: 50, y: 28.5, label: "My profile: your details and password." },
          { x: 50, y: 34.2, label: "Agency settings (owners and administrators)." },
          { x: 50, y: 41.4, label: "Open or copy your site link." },
          { x: 75, y: 55.3, label: "Appearance: light, dark or automatic (follows your computer)." },
          { x: 50, y: 69.2, label: "This documentation, in another tab." },
          { x: 50, y: 74.9, label: "Search and, below it, keyboard shortcuts." },
          { x: 50, y: 86.4, label: "Help and support: FAQs and contact with Tivvo." },
          { x: 50, y: 93.6, label: "Sign out." },
        ]}
      />
      <DocTip>
        If you work for more than one agency, “Switch agency” appears in this menu. Each agency has its own data: when you
        switch, the dashboard reloads with the other one’s.
      </DocTip>

      <DocH3>Roles</DocH3>
      <DocTerms
        items={[
          ["Owner", "The account owner. Has access to everything and can’t be removed from the team."],
          [
            "Administrator",
            "Like the owner: sees everything, manages the team, the site, settings and imports, and reassigns properties and clients.",
          ],
          [
            "Agent",
            "Sees only the properties assigned to them, their offers and bookings, their clients and unassigned leads. Doesn’t see Site, Team, Settings, Import or the owners’ account statements.",
          ],
        ]}
      />

      <DocH3>Things you’ll find all over the dashboard</DocH3>
      <DocTerms
        items={[
          [
            "Action bar",
            "In the editors, a bar with Save, Publish and Cancel appears at the top. When something is unsaved, the Save button becomes active. Ctrl/⌘ + S saves without touching the mouse.",
          ],
          [
            "Views",
            "Lists can be shown as a grid, list or table (keys 1, 2 and 3). Tivvo remembers the view you chose in each browser.",
          ],
          [
            "Search and filters",
            "Every list has a search box and filters to narrow down what you see. Each filter shows how many items each option has. “Clear filters” shows everything again.",
          ],
          [
            "Bin",
            "What you delete from Properties, Offers and Bookings goes to the bin; it doesn’t disappear. It stays there for 30 days in case you change your mind; after that it is permanently deleted. When you delete something, the notice at the bottom has “Undo”.",
          ],
          [
            "“Shown on the site” / “Internal only”",
            "Each block of a form tells you whether what you enter is seen by your clients or stays with your team.",
          ],
          [
            "Help",
            "The question-mark button in each tool opens the part of this guide that covers it.",
          ],
        ]}
      />

      <DocH3>The bin</DocH3>
      <DocP>
        It opens from the bin icon in the Properties, Offers and Bookings bar. A number on the icon shows how many items
        are inside.
      </DocP>
      <DocFigure
        src="/docs-media/en/papelera.webp"
        alt="The property bin with a deleted property"
        width={1304}
        height={281}
        markers={[
          { x: 38.7, y: 87.1, label: "When you deleted it and how many days it has left." },
          { x: 74, y: 82, label: "“Restore” puts it back in its list, just as it was." },
          { x: 86.7, y: 82, label: "“Delete permanently” removes it now, without waiting 30 days. We ask you to confirm." },
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
      title="Inquiries"
      intro="The inbox for everything people send you from your site, from a property page or from an offer."
    >
      <DocFigure
        src="/docs-media/en/consultas.webp"
        alt="The inquiry inbox with an inquiry open"
        width={1304}
        height={946}
        markers={[
          { x: 20.7, y: 7.4, label: "All or only new ones, with how many are unread." },
          { x: 29, y: 7.4, label: "Mark all as read." },
          { x: 18.9, y: 13.5, label: "Search by name, email, message, property or offer." },
          { x: 54.4, y: 21.7, label: "What they asked about: the property, the offer or a general inquiry." },
          { x: 92.4, y: 8.6, label: "Mark it as new again so you don’t forget it." },
          { x: 46, y: 87.4, label: "Reply by email, WhatsApp or call; or go to the client’s profile." },
        ]}
      />

      <DocH3>What happens when one comes in</DocH3>
      <DocList>
        <li>It appears in Inquiries as new and adds to the number in the side menu and the bell.</li>
        <li>
          The client is created, or updated if one with that email already existed. A note in their history names the
          property or offer they asked about.
        </li>
        <li>
          The agency gets an email alert (to the contact email in Settings or, if there isn’t one, to owners and
          administrators) and the client gets a confirmation.
        </li>
      </DocList>

      <DocH3>Working the inbox</DocH3>
      <DocList>
        <li>
          The list is on the left, grouped into Today, Yesterday, This week and Earlier; the open inquiry is on the right.
          On a phone they take turns: tap one to read it and the arrow to go back.
        </li>
        <li>Opening an inquiry marks it as read. The envelope at the top right marks it as new again.</li>
        <li>Those from a client you already have show their stage (Lead, Contacted…) next to the name.</li>
        <li>
          Reply in one click: <strong>Reply by email</strong> (with the subject and greeting already written),{" "}
          <strong>WhatsApp</strong> (with a message naming what they asked about) or <strong>Call</strong>. WhatsApp and
          Call appear if they left a phone number. The icon next to the email copies it.
        </li>
        <li>Click the property or offer to open it in the dashboard, or “View client” to go to their profile.</li>
        <li>The inbox updates on its own every minute.</li>
      </DocList>
      <DocTip>
        If no inquiry has arrived yet, share your site link: the contact form and the one on each property page land here.
      </DocTip>
    </DocSection>
  );
}

function Clients() {
  return (
    <DocSection
      id="clientes"
      icon={Users}
      title="Clients"
      intro="Your contact book and follow-up: what stage each one is at, what they’re looking for, what needs doing and every time you spoke."
    >
      <DocFigure
        src="/docs-media/en/clientes-lista.webp"
        alt="The client list as a grid"
        width={1304}
        height={946}
        markers={[
          { x: 26.3, y: 6, label: "Search by name, email or phone." },
          { x: 66.1, y: 6, label: "Filter by stage." },
          { x: 90.2, y: 6, label: "Add a client by hand." },
          { x: 76.5, y: 86.9, label: "Each client’s stage." },
          { x: 40.4, y: 72.8, label: "Where they came from: site, offer or manual entry; and how long since the last activity." },
        ]}
      />

      <DocH3>How they arrive</DocH3>
      <DocList>
        <li>
          <strong>Manual entry:</strong> “New client” with name, email and phone.
        </li>
        <li>
          <strong>From the site or an offer:</strong> when someone writes to you, Tivvo creates the client (or recognises
          them by their email) and leaves a note in their history with the property or offer they asked about.
        </li>
      </DocList>

      <DocH3>Stages</DocH3>
      <DocTerms
        items={[
          [<DocPill key="l" tone="amber">Lead</DocPill>, "Just arrived; you haven’t spoken to them yet."],
          [<DocPill key="c" tone="primary">Contacted</DocPill>, "There has been a first contact."],
          [<DocPill key="n">Negotiating</DocPill>, "You’re discussing a specific proposal."],
          [<DocPill key="k" tone="primary">Client</DocPill>, "Closed a deal with you."],
          [<DocPill key="p">Lost</DocPill>, "Didn’t go ahead. Shown faded in the list."],
        ]}
      />
      <DocP>
        Change the stage from each client’s <strong>⋯</strong> menu (“Change stage”) or from their profile. The same menu
        lets you view the profile, send them an email, call them or copy their email.
      </DocP>

      <DocH3>The client profile</DocH3>
      <DocFigure
        src="/docs-media/en/clientes-ficha.webp"
        alt="A client profile with notes, tasks and history"
        width={1304}
        height={1651}
        markers={[
          { x: 4.6, y: 15.8, label: "Notes: what’s worth remembering." },
          { x: 4.4, y: 34.3, label: "Tasks with a due date; overdue ones in red." },
          { x: 5.1, y: 58.2, label: "History: notes, calls, emails and meetings." },
          { x: 82.4, y: 12.8, label: "Change the stage." },
          { x: 82.4, y: 17.6, label: "The agent in charge." },
        ]}
      />
      <DocTerms
        items={[
          [
            "Notes",
            "What’s worth remembering: what they’re looking for, budget, preferences. Supports headings, bold, lists and links. When you change something, “Save notes” appears.",
          ],
          [
            "Tasks",
            "What needs doing with this client: call, send photos, arrange a viewing. Type the task, choose an optional due date and click +. Tick the box when it’s done. Overdue ones show in red (“Overdue by 2 days”), and today’s and tomorrow’s say so.",
          ],
          [
            "History",
            "Choose the type (note, call, email or meeting), write what happened and click “Log”. It’s sorted newest first and shows who logged it.",
          ],
          ["Stage", "Click the new stage in the right-hand panel; it’s saved instantly."],
          [
            "Owner",
            "The agent who handles the client. Owners and administrators pick them from the team list; an agent can click “Take it” on an unassigned lead.",
          ],
          ["Contact", "Their email and phone, one click away from writing or calling."],
        ]}
      />
      <DocTip>
        Deleted tasks don’t go to a bin: they disappear immediately. If you just finished it, tick it as done instead.
      </DocTip>
    </DocSection>
  );
}

function Properties() {
  return (
    <DocSection
      id="propiedades"
      icon={Building2}
      title="Properties"
      intro="Your portfolio: every house, flat, plot or holiday rental you market, with all its details, photos, prices and availability."
    >
      <DocH3>Adding a property</DocH3>
      <DocSteps>
        <DocStep>
          Click <strong>New property</strong> (or press <Kbd>N</Kbd> in the list).
        </DocStep>
        <DocStep>
          Choose what you’ll do with it: <strong>Sale</strong> or <strong>Rental</strong>. This changes the available
          categories and the editor sections.
        </DocStep>
        <DocStep>Type a title and choose the category (house, apartment, villa, hotel, plot…).</DocStep>
        <DocStep>
          Click <strong>Create property</strong>. It’s created as a <DocPill tone="amber">Draft</DocPill> and the editor
          opens so you can fill in the rest.
        </DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/en/propiedades-nueva.webp"
        alt="The New property dialog"
        width={784}
        height={968}
        className="max-w-md"
        markers={[
          { x: 70.1, y: 29.3, label: "Sale or rental." },
          { x: 50, y: 47.2, label: "The title your clients see." },
          { x: 50, y: 55.5, label: "The category; it depends on sale or rental." },
          { x: 79.2, y: 92.4, label: "Creates the property and opens the editor." },
        ]}
      />
      <DocTip>
        Have your properties in another system? Use <strong>Import</strong> to bring them all at once. See “Import
        properties” below.
      </DocTip>

      <DocH3>Statuses</DocH3>
      <DocTerms
        items={[
          [<DocPill key="d" tone="amber">Draft</DocPill>, "Only your team sees it. Ideal while you’re completing it."],
          [<DocPill key="p" tone="primary">Published</DocPill>, "Appears on your website and can be added to offers."],
          [<DocPill key="a">Archived</DocPill>, "No longer on the market, but you keep all its data. It can be published again."],
        ]}
      />

      <DocH3>The list</DocH3>
      <DocFigure
        src="/docs-media/en/propiedades-lista.webp"
        alt="The property list in grid view"
        width={1276}
        height={946}
        markers={[
          { x: 18.9, y: 6, label: "Search by title, area, region, country or owner." },
          { x: 43.3, y: 6, label: "Sort: newest, oldest, price or title." },
          { x: 50.4, y: 6, label: "Filters (F key)." },
          { x: 57.8, y: 6, label: "Table, list or grid view." },
          { x: 65.3, y: 6, label: "Bin: what was deleted in the last 30 days." },
          { x: 72.4, y: 6, label: "Import properties from another system (owners and administrators)." },
          { x: 84.6, y: 6, label: "New property (N key)." },
          { x: 36.4, y: 69.3, label: "Each property’s status." },
        ]}
      />
      <DocList>
        <li>
          Each card shows the cover photo, the listing type and category, the location, the price, bedrooms, bathrooms,
          area, the owner and how long ago it was updated.
        </li>
        <li>25 are shown per page. As you scroll, the search bar floats at the top so you don’t have to go back.</li>
        <li>
          From each property’s <strong>⋯</strong> menu: edit, view it on the site (if published), publish, unpublish,
          archive, publish again or delete. The arrow icon also opens the public page.
        </li>
      </DocList>
      <DocFigure
        src="/docs-media/en/propiedades-filtros.webp"
        alt="The property filter panel"
        width={560}
        height={1604}
        className="max-w-xs"
        markers={[
          { x: 50.1, y: 3.8, label: "Status, type and category: you can tick more than one; with none ticked, all are shown." },
          { x: 50.1, y: 32.5, label: "Location and owner." },
          { x: 27.5, y: 53.3, label: "Price range, in the currency you choose." },
          { x: 50.1, y: 58.2, label: "Minimum bedrooms and bathrooms." },
          { x: 15.5, y: 96, label: "Clear resets everything." },
          { x: 60.6, y: 96, label: "Applies the filters and tells you how many properties are left." },
        ]}
      />
      <DocP>Active filters appear as tags above the list; click a tag’s cross to remove it.</DocP>

      <DocH3>Bulk actions</DocH3>
      <DocP>
        In table view, tick several properties with each row’s checkbox (or all of them with the one at the top). A bar
        appears at the bottom to publish, unpublish, archive or delete them together. <Kbd>Esc</Kbd> clears the
        selection.
      </DocP>
      <DocFigure
        src="/docs-media/en/propiedades-lote.webp"
        alt="Two selected properties and the bulk action bar"
        width={1276}
        height={946}
        markers={[
          { x: 2.2, y: 30, label: "Tick the properties." },
          { x: 47.9, y: 94.2, label: "The bulk action bar." },
        ]}
      />

      <DocH3>The editor</DocH3>
      <DocP>
        At the top is the editor bar, with the sections grouped: <strong>General information</strong>,{" "}
        <strong>Media</strong>, <strong>Rental</strong> (rentals only), <strong>Management</strong> and{" "}
        <strong>Contact</strong>. Hover over (or tap) a group with an arrow to see its sections. Save with{" "}
        <strong>Save</strong> or <Kbd>Ctrl/⌘</Kbd> <Kbd>S</Kbd>. <strong>Publish</strong> saves and publishes in one
        step; if it’s already published, the button becomes <strong>Unpublish</strong>. If you try to leave with unsaved
        changes, we warn you.
      </DocP>
      <DocFigure
        src="/docs-media/en/propiedades-editor.webp"
        alt="A property editor on the Basics section"
        width={1760}
        height={990}
        markers={[
          { x: 22.2, y: 5.1, label: "Back to the property list." },
          { x: 32.9, y: 5.1, label: "The editor sections, grouped." },
          { x: 87, y: 5.1, label: "Help, Cancel, Save and Publish or Unpublish." },
          { x: 39.7, y: 46.5, label: "The person in charge: the agent who handles it." },
          { x: 85.8, y: 27.8, label: "How the card looks in your portfolio, live as you edit." },
        ]}
      />
      <DocTerms
        items={[
          [
            "Basics",
            "Title, private name (what your team calls it; the client never sees it), person in charge, listing type, category, bedrooms, bathrooms, areas, parking spaces, storage rooms, floors, year built and renovated, energy certificate. For rentals, also guests and stars.",
          ],
          [
            "Location",
            "How it’s shown (the location visible to your clients), where it is (the exact address and the map pin, internal only), the surroundings (area features and views) and links (Google Maps, PDF brochure and website).",
          ],
          [
            "Amenities & Facilities",
            "General amenities (the short list on the listing: type each one and press Enter), indoor and outdoor features, pools and hot tubs with type and size, bedrooms by type, room layout, and services and conditions.",
          ],
          [
            "Content & Services",
            "The summary (highlighted at the top of the listing) and the description, with headings and lists. For rentals, also the services included in the price and the booking and cancellation policies.",
          ],
          [
            "Prices",
            "Sale price or base price per night, and currency. If you leave it empty, the listing shows “Price on request”.",
          ],
          ["Photos", "See below. Changes in this section are saved instantly, without clicking Save."],
          [
            "Essentials",
            "Internal data: who manages the property day to day, the provider and licence, the commission and whether it may be marketed outside your site.",
          ],
          [
            "Recommendations",
            "Suggested improvements with details, estimated cost, priority and status (proposed, approved or done). The owner sees them on their page.",
          ],
          ["Rooms", "Hotels only, under Management: the hotel’s rooms."],
          ["Owner", "The property’s owner, their access link and account statement. See “Owners”."],
        ]}
      />
      <DocP>
        The <strong>person in charge</strong> (in Basics) decides which agent sees it: an agent only works with the
        properties assigned to them. Owners and administrators choose them, and it’s saved when chosen.
      </DocP>

      <DocH3>Location</DocH3>
      <DocFigure
        src="/docs-media/en/propiedades-ubicacion.webp"
        alt="The Location section with the visible location, the address and the map"
        width={1452}
        height={1100}
        markers={[
          { x: 26.9, y: 14.1, label: "What your clients see: the visible location." },
          { x: 26.9, y: 40.2, label: "The exact address and the pin, for your team only." },
          { x: 80.5, y: 48.2, label: "Search the address, click the map or drag the pin." },
        ]}
      />
      <DocP>
        You can also paste a Google Maps link to take the coordinates. The exact address is never shown on the site: your
        clients only see the visible location (for example “Mallorca, Balearic Islands”).
      </DocP>

      <DocH3>Photos and videos</DocH3>
      <DocFigure
        src="/docs-media/en/propiedades-fotos.webp"
        alt="A property’s photo gallery"
        width={1452}
        height={946}
        markers={[
          { x: 4.1, y: 16.3, label: "What you upload here shows on the site and is saved instantly." },
          { x: 58.5, y: 29, label: "The gallery sections; “Add” creates a new one." },
          { x: 40.2, y: 46.6, label: "Drag or choose photos: they upload to the selected section." },
          { x: 4.8, y: 64.3, label: "The cover photo." },
        ]}
      />
      <DocList>
        <li>
          Drag the photos into the box or click to choose them (JPG, PNG, WebP or HEIC). They’re optimised automatically
          before uploading.
        </li>
        <li>
          Photos are grouped by section (General, Bedrooms, Living area, Pool, Exterior, Additional facilities, Views or
          one of your own). Drag them to reorder within their section, or use “Move to another section”.
        </li>
        <li>The first photo is the cover. To change it, use “Make cover” on another one.</li>
        <li>To remove a photo, click the cross and confirm with a second click.</li>
        <li>
          <strong>Watermark:</strong> puts your agency’s logo on the published photos.
        </li>
        <li>
          <strong>Videos:</strong> paste links from YouTube, Vimeo or other platforms.
        </li>
      </DocList>

      <DocH3>Rentals only</DocH3>
      <DocTerms
        items={[
          [
            "Availability",
            "Block dates by hand with an optional note. Confirmed bookings block their dates automatically. To avoid double bookings, paste the iCal link from Airbnb or Booking and click “Sync now”. If the property is published, you also get a link to export your availability to those platforms.",
          ],
          [
            "Rates",
            "Rate periods (for example “High season”) with dates, official price per night, minimum stay, management fee and agency commission.",
          ],
        ]}
      />
      <DocFigure
        src="/docs-media/en/propiedades-disponibilidad.webp"
        alt="A rental’s Availability section"
        width={1452}
        height={576}
        markers={[
          { x: 23.3, y: 9.2, label: "Block dates by hand, with an optional note." },
          { x: 4.7, y: 44.1, label: "Taken dates: “BOOKING” comes from a booking, “MANUAL” from your own block, which you can remove." },
          { x: 23.3, y: 63.7, label: "Paste the iCal link from Airbnb or Booking and sync." },
          { x: 23.3, y: 81.3, label: "Your calendar, to add to those platforms." },
        ]}
      />
      <DocFigure
        src="/docs-media/en/propiedades-tarifas.webp"
        alt="The Rates section with three seasons"
        width={1452}
        height={681}
        markers={[
          { x: 26.9, y: 10.5, label: "A new period: label, dates, price per night and minimum stay." },
          { x: 14.6, y: 41, label: "Management fee (10% by default) and agency commission (20% by default), in %." },
          { x: 15.6, y: 90.3, label: "The saved seasons, with their price and minimum stay. “Remove” deletes one." },
        ]}
      />
      <DocTip>
        To see all your rental properties in one calendar, use <strong>Availability</strong> in the menu.
      </DocTip>

      <DocH3>Recommendations</DocH3>
      <DocFigure
        src="/docs-media/en/propiedades-recomendaciones.webp"
        alt="The Recommendations section with two improvements"
        width={1452}
        height={847}
        markers={[{ x: 10.8, y: 64.5, label: "Each improvement with its details, estimated cost and priority." }]}
      />
      <DocP>
        Use them to suggest improvements to the owner: new furniture, an EV charger… Each has a priority (high, medium or
        low) and a status you update: proposed, approved or done. The owner sees them on their page, under “Suggested
        improvements”.
      </DocP>

      <DocTip>
        Fill in Basics, Location, Prices and Photos first: with that, the listing already looks good on your site. You can
        add the rest over time.
      </DocTip>
    </DocSection>
  );
}

function Owners() {
  return (
    <DocSection
      id="propietarios"
      icon={KeyRound}
      title="Owners"
      intro="The owners of the properties you market. Each has a private page where they follow their properties, their bookings and what they’re owed, with no username or password."
    >
      <DocH3>Assigning an owner</DocH3>
      <DocSteps>
        <DocStep>
          In the property editor, open <strong>Contact</strong> → <strong>Owner</strong>.
        </DocStep>
        <DocStep>Search for them by name, email or phone, or click “New owner” to add them right there.</DocStep>
        <DocStep>Save the property. One owner can have several properties.</DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/en/propietarios-asignar.webp"
        alt="The Owner section with an assigned owner and their access link"
        width={1452}
        height={1111}
        markers={[
          { x: 24.6, y: 14.3, label: "The assigned owner; “Remove” unlinks them." },
          { x: 36.9, y: 38.4, label: "Copy their personal link to send it to them." },
          { x: 47.3, y: 38.4, label: "Regenerate: the previous link stops working." },
          { x: 8.7, y: 46.4, label: "Their account statement." },
        ]}
      />

      <DocH3>Account statement</DocH3>
      <DocP>
        Below the access is the owner’s account statement, with all their properties together. Only the agency’s owners
        and administrators see it.
      </DocP>
      <DocFigure
        src="/docs-media/en/propietarios-cuenta.webp"
        alt="An owner’s account statement with collected amounts, commission, payouts and balance"
        width={1100}
        height={1148}
        className="max-w-2xl"
        markers={[
          { x: 16.3, y: 18.1, label: "What was collected from their properties’ bookings, out of the booked total." },
          { x: 83.7, y: 18.1, label: "What they’re owed: collected minus commission." },
          { x: 50, y: 30.4, label: "What’s still to be paid out." },
          { x: 50, y: 79.1, label: "Payouts: what you’ve already paid them. The bin icon deletes one." },
          { x: 12.4, y: 96.4, label: "Record a payment to the owner." },
        ]}
      />
      <DocTerms
        items={[
          ["Collected", "The sum of payments marked as collected on their bookings (deposits and balances)."],
          ["Commission", "The agency’s commission on those bookings; it’s deducted from what was collected."],
          ["Owed to you", "Collected minus commission."],
          ["Already paid out", "The sum of the payouts you’ve recorded."],
          ["Balance to pay out", "What you still owe them. If you’ve paid them too much, it says so."],
          ["By booking", "The details of each booking: dates, how much was collected out of the total, and the commission."],
        ]}
      />
      <DocSteps>
        <DocStep>
          Click <strong>Record payout</strong>. The outstanding balance and its currency are already filled in.
        </DocStep>
        <DocStep>Adjust the amount if needed and choose the date.</DocStep>
        <DocStep>Enter the method (transfer, cash…) and a note if you like, and click “Record”.</DocStep>
      </DocSteps>

      <DocH3>The owner’s page</DocH3>
      <DocP>
        Their personal link is under “Owner access”: copy it and send it to them. From there they see their properties
        and their status (published or not, with the published price), the current or next stay, bookings with their
        dates and payments, their account statement and the suggested improvements you entered under Recommendations. A
        button lets them write to you on WhatsApp or by email.
      </DocP>
      <DocFigure
        src="/docs-media/en/propietarios-pagina.webp"
        alt="The owner’s page with a summary of their properties and account statement"
        width={1584}
        height={946}
        markers={[
          { x: 24, y: 38.9, label: "How many of their properties are published." },
          { x: 50, y: 38.9, label: "The current or next stay." },
          { x: 75.2, y: 38.9, label: "What they’re owed from what was collected." },
          { x: 50, y: 66.1, label: "Their account statement: payouts, balance and details by booking." },
          { x: 83.9, y: 4.2, label: "A button to write to you." },
        ]}
      />
      <DocP>
        By default the owner <strong>doesn’t see your commission</strong>: they see what they’re owed, but not how much
        was deducted. If you want to show it, turn on “Show the agency’s commission” in Settings.
      </DocP>
      <DocTip>
        If the link reached the wrong person, click “Regenerate”: the old one stops working immediately.
      </DocTip>
    </DocSection>
  );
}

function Importer() {
  return (
    <DocSection
      id="importar"
      icon={Upload}
      title="Import properties"
      adminOnly
      intro="Bring your portfolio from another system in one go: a CRM, a portal or a spreadsheet. Nothing is saved until you’ve reviewed what will happen to each property."
    >
      <DocP>
        It opens from <strong>Import</strong>, in the Properties bar. The process has four steps: choose where you’re
        coming from, bring the file, say what each column is (spreadsheets only) and review.
      </DocP>

      <DocH3>1. Choose where you’re moving from</DocH3>
      <DocFigure
        src="/docs-media/en/importar-plataformas.webp"
        alt="The list of platforms you can move from"
        width={1276}
        height={946}
        markers={[
          { x: 16.5, y: 18.6, label: "Search your system by name or country." },
          { x: 51.2, y: 18.6, label: "Filter by CRM, portals or aggregators." },
          { x: 35.8, y: 44, label: "Choose your platform: we show you how to get your data out of it." },
        ]}
      />
      <DocP>
        There are almost 50 platforms (Idealista, Inmovilla, Kyero, CASAFARI, Resales Online, Witei, Apimo, Rightmove and
        many more), the most used first. If yours isn’t there, below you can use a <strong>CSV or Excel</strong> file, a{" "}
        <strong>Kyero XML</strong> (the format most CRMs export) or the <strong>Tivvo XML</strong>, if your system has its
        own API.
      </DocP>

      <DocH3>2. Bring your data</DocH3>
      <DocFigure
        src="/docs-media/en/importar-fuente.webp"
        alt="The guide for moving from Idealista, with the box to upload the file"
        width={1276}
        height={946}
        markers={[
          { x: 28.6, y: 21.3, label: "The steps to get your properties out of that platform." },
          { x: 11.6, y: 42.9, label: "Another route, if your platform gives you a CSV or Excel file." },
          { x: 28.6, y: 50, label: "Stuck? We draft the request to the platform for you, or help you ourselves." },
          { x: 70, y: 22.6, label: "Upload the file or paste the feed URL." },
          { x: 77.9, y: 37.7, label: "We read the file; nothing is saved yet." },
        ]}
      />
      <DocList>
        <li>
          Follow the steps in your platform’s guide. Many ask for the feed through support: under “Stuck?” click{" "}
          <strong>Send request by email</strong> and your email opens with the message already written, or copy it with
          “View message”.
        </li>
        <li>
          <strong>Upload file:</strong> CSV or Excel (.xlsx) up to 10 MB and 3,000 rows, or XML up to 10 MB.
        </li>
        <li>
          <strong>Use a URL:</strong> paste the feed’s public link. We read it once; it doesn’t stay in sync.
        </li>
        <li>
          If you’re starting from scratch, click <strong>Download CSV template</strong>: it has the columns we understand
          and a sample row.
        </li>
        <li>“Ask for help” lets you write to us with the message already drafted: we’ll help you move.</li>
      </DocList>

      <DocH3>3. What each column is</DocH3>
      <DocP>Spreadsheets only (CSV or Excel). Tivvo recognises most columns on its own; check the rest.</DocP>
      <DocFigure
        src="/docs-media/en/importar-mapeo.webp"
        alt="The step to assign each file column to a Tivvo field"
        width={1304}
        height={1110}
        markers={[
          { x: 49, y: 13.7, label: "How many rows and columns we recognised." },
          { x: 11.9, y: 25.8, label: "Unrecognised columns come first, with examples from your file." },
          { x: 81.7, y: 25.8, label: "Choose which Tivvo field it matches, or “Don’t import”." },
          { x: 11.9, y: 95.4, label: "See what will happen to each row, before saving." },
        ]}
      />
      <DocList>
        <li>Each field comes from a single column: if you pick it for another one, it’s freed from the previous one.</li>
        <li>Unassigned columns are ignored. An empty cell never erases what’s already there.</li>
        <li>
          Assign a <strong>reference (ID)</strong> column: that way, if you import the file again, properties are updated
          instead of duplicated. If there isn’t one, we warn you.
        </li>
      </DocList>

      <DocH3>4. Review and import</DocH3>
      <DocFigure
        src="/docs-media/en/importar-revision.webp"
        alt="The import preview with the summary and details by row"
        width={1304}
        height={853}
        markers={[
          { x: 9.4, y: 20.9, label: "The summary: new, to update, unchanged, skipped and with errors. Click one to filter." },
          { x: 23.3, y: 31.2, label: "Publish them straight away or leave them as drafts." },
          { x: 25.7, y: 38.2, label: "Move to the bin whatever is no longer in the file." },
          { x: 6.9, y: 49.3, label: "Row by row, with its warnings, errors and what changes." },
          { x: 14, y: 94.1, label: "Only here is everything saved." },
        ]}
      />
      <DocTerms
        items={[
          ["New", "Wasn’t in Tivvo: it’s created."],
          ["Updates", "You’d already imported it (same reference): what the details say changes, for example price or photos."],
          ["No changes", "It’s already the same in Tivvo."],
          ["Skipped", "Not imported, for example because it’s repeated in the file."],
          ["With error", "Something required is missing, such as the title. The details say what."],
        ]}
      />
      <DocList>
        <li>
          <strong>Publish new ones on import:</strong> when off, they stay as drafts so you can review them before showing
          them on your site.
        </li>
        <li>
          <strong>Move to the bin whatever is no longer in the file:</strong> only affects properties you brought in
          earlier from that same platform, and we ask you to confirm. They can be restored for 30 days.
        </li>
        <li>
          When you click <strong>Import</strong>, Tivvo saves the properties and downloads their photos. If there are many
          it can take a couple of minutes: don’t close the tab. If you try to leave before it finishes, we warn you.
        </li>
      </DocList>
      <DocFigure
        src="/docs-media/en/importar-listo.webp"
        alt="The final import screen with the summary and errors"
        width={1100}
        height={415}
        className="max-w-2xl"
        markers={[
          { x: 50, y: 44.8, label: "What was done, with the error details." },
          { x: 37.8, y: 70, label: "Download the errors as a CSV to fix them." },
          { x: 39.2, y: 82.4, label: "Review the drafts or view your site; “Import another file” starts again." },
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
      title="Offers"
      intro="Personalised proposals for a client: a selection of properties and services at your prices, presented on its own page that the client opens from a link."
    >
      <DocH3>Building an offer</DocH3>
      <DocSteps>
        <DocStep>
          Click <strong>New offer</strong>, give it a title (for example “Proposal for the Pérez family”), choose the
          operation (sale, rental or both) and, if you like, a reference code. The operation decides which properties you
          can add.
        </DocStep>
        <DocStep>
          In <strong>General</strong>, choose the client, the currency and whether to show prices and your agency’s
          branding (header, footer and contact details).
        </DocStep>
        <DocStep>
          In <strong>Welcome</strong>, write the greeting: a title, the date or season and a message.
        </DocStep>
        <DocStep>
          In <strong>Properties</strong>, create sections (for example “Beachfront”) and add properties to them.
        </DocStep>
        <DocStep>
          In <strong>Services</strong>, add experiences from your library: chef, transfers, yacht…
        </DocStep>
        <DocStep>
          Click <strong>Send offer</strong> (if it has a client) or <strong>Publish link</strong> (if not).
        </DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/en/ofertas-nueva.webp"
        alt="The New offer dialog"
        width={784}
        height={838}
        className="max-w-md"
        markers={[
          { x: 50, y: 31.1, label: "The title." },
          { x: 50, y: 59, label: "An optional reference code, such as the one from your system." },
          { x: 50, y: 48.6, label: "Sale, rental or both: decides which properties you can add." },
        ]}
      />
      <DocFigure
        src="/docs-media/en/ofertas-lista.webp"
        alt="The offer list"
        width={1304}
        height={946}
        markers={[
          { x: 25.3, y: 6, label: "Search by title or client." },
          { x: 53.8, y: 6, label: "Filters by operation and status." },
          { x: 90.5, y: 6, label: "New offer." },
          { x: 6.3, y: 60.5, label: "The status: here, the client has already opened it." },
          { x: 17, y: 47.3, label: "Your reference code, if you added one." },
        ]}
      />

      <DocH3>The editor</DocH3>
      <DocFigure
        src="/docs-media/en/ofertas-editor.webp"
        alt="An offer editor on the General section"
        width={1480}
        height={1100}
        markers={[
          { x: 14.4, y: 4.6, label: "The sections: General, Welcome, Properties and Services." },
          { x: 30.3, y: 37.1, label: "The client who receives it by email." },
          { x: 20.7, y: 76.2, label: "Show or hide prices." },
          { x: 17.5, y: 84.8, label: "Show your logo, header and contact details." },
          { x: 84.5, y: 25.4, label: "The summary, the client link and “View client”." },
          { x: 90.6, y: 4.6, label: "Send, resend or publish the link." },
        ]}
      />
      <DocP>
        On the right you see the status, how many properties and services it has and the total. Rentals have no total:
        they are options to choose from, priced per night. Once sent or published, the client link is there with “Copy
        link”.
      </DocP>

      <DocH3>Adjusting each property’s price</DocH3>
      <DocFigure
        src="/docs-media/en/ofertas-propiedades.webp"
        alt="An offer’s Properties section with the price adjustments open"
        width={1480}
        height={1292}
        markers={[
          { x: 28.6, y: 12.4, label: "Each section with its title and a text." },
          { x: 17.1, y: 33, label: "Special price, discount and deposit for this offer only." },
          { x: 30.3, y: 50.4, label: "A short text below the property." },
        ]}
      />
      <DocP>
        “Show adjustments” on each property lets you set a special price for this offer, a discount (percentage or fixed
        amount), a security deposit and a short text such as “Includes final cleaning”. The client sees the previous
        price struck through. The property’s price in your portfolio doesn’t change.
      </DocP>

      <DocH3>Services in the offer</DocH3>
      <DocFigure
        src="/docs-media/en/ofertas-servicios.webp"
        alt="An offer’s Services section with a private chef and a transfer"
        width={1480}
        height={814}
        markers={[
          { x: 7.2, y: 93.5, label: "Add a service from your library." },
          { x: 30.3, y: 9.9, label: "Adjust price, quantity, date and a note for the client." },
          { x: 52.6, y: 43.7, label: "Each service’s subtotal." },
        ]}
      />
      <DocP>
        Services come from your library (see “Services”). When you add one to the offer you can change the price, the
        quantity (people, days, nights or hours, depending on how it’s charged), the date and leave a note. Without a
        price, the client sees “On request”.
      </DocP>

      <DocH3>Sending or sharing</DocH3>
      <DocTerms
        items={[
          ["With a client", "“Send offer” emails them the link. Afterwards you can use “Resend offer” whenever you like."],
          ["Without a client", "“Publish link” activates the page and you share the link however you prefer."],
          ["Copy link", "Available in the editor’s right-hand panel and in each offer’s ⋯ menu, once sent or published."],
        ]}
      />
      <DocP>
        If you sent the link yourself (on WhatsApp, for example), use “Mark as sent” from the offer’s menu. When the client
        opens it, the offer becomes “Viewed” and you get a notification. From the offer page the client can write to you:
        that inquiry lands in Inquiries.
      </DocP>

      <DocH3>Statuses</DocH3>
      <DocTerms
        items={[
          [<DocPill key="d" tone="amber">Draft</DocPill>, "Nobody sees it yet."],
          [<DocPill key="s" tone="primary">Sent</DocPill>, "The link is active and was sent to the client."],
          [<DocPill key="v">Viewed</DocPill>, "The client has already opened the offer."],
          [<DocPill key="e">Expired</DocPill>, "Its expiry date has passed; the client sees a notice that it expired."],
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
      title="Bookings"
      intro="Every closed deal: a rental with its dates or a sale, with the price, the commission and payment tracking."
    >
      <DocFigure
        src="/docs-media/en/reservas-lista.webp"
        alt="The booking list"
        width={1304}
        height={946}
        markers={[
          { x: 24.8, y: 6, label: "Search by property or client." },
          { x: 51.8, y: 6, label: "Filter by status or by the property’s location." },
          { x: 89.6, y: 6, label: "New booking." },
          { x: 6.5, y: 40.5, label: "Each booking’s status." },
        ]}
      />

      <DocH3>Creating a booking</DocH3>
      <DocSteps>
        <DocStep>
          Click <strong>New booking</strong> and choose the property.
        </DocStep>
        <DocStep>Assign the client (optional).</DocStep>
        <DocStep>For rentals, choose the check-in and check-out dates. A sale goes without dates.</DocStep>
        <DocStep>Enter the total price and your commission, and click “Create booking”.</DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/en/reservas-nueva.webp"
        alt="The New booking dialog"
        width={784}
        height={809}
        className="max-w-md"
        markers={[
          { x: 50, y: 21, label: "The property." },
          { x: 50, y: 37.7, label: "The client (optional)." },
          { x: 50, y: 53.6, label: "Check-in and check-out, rentals only." },
          { x: 72.9, y: 70.3, label: "Total price and your commission." },
        ]}
      />

      <DocH3>Statuses</DocH3>
      <DocTerms
        items={[
          [
            <DocPill key="p" tone="amber">Pending</DocPill>,
            "Just created, awaiting confirmation. It doesn’t block the dates yet, but shows in amber in Availability.",
          ],
          [<DocPill key="c" tone="primary">Confirmed</DocPill>, "It’s firm and blocks its dates."],
          [<DocPill key="o">Completed</DocPill>, "The stay ended or the sale closed."],
          [<DocPill key="x">Cancelled</DocPill>, "It won’t happen: the dates are released. Recorded payments aren’t deleted."],
        ]}
      />
      <DocP>
        Change the status from the booking page or from the ⋯ menu in the list. We ask you to confirm before cancelling.
        “Delete” sends it to the bin.
      </DocP>

      <DocH3>The booking page</DocH3>
      <DocFigure
        src="/docs-media/en/reservas-ficha.webp"
        alt="A booking page with the stay, payments and summary"
        width={1304}
        height={1210}
        markers={[
          { x: 3.9, y: 21.5, label: "The dates and number of nights." },
          { x: 59.8, y: 53.1, label: "Record a deposit, the balance or your commission." },
          { x: 58.3, y: 66.7, label: "Mark a payment as collected." },
          { x: 82.4, y: 12, label: "Total, commission, collected and to collect." },
          { x: 82.4, y: 28.7, label: "The page the client sees: copy the link or open it." },
          { x: 82.4, y: 40.5, label: "Confirm, complete or cancel." },
        ]}
      />

      <DocH3>Payments</DocH3>
      <DocP>
        “Add payment” records a <strong>deposit</strong>, the <strong>balance</strong> or your <strong>commission</strong>,
        in the booking’s currency. Each payment stays pending until you mark it as collected; then it keeps the date. The
        bar shows how much of the total has been collected.
      </DocP>
      <DocFigure
        src="/docs-media/en/reservas-pago.webp"
        alt="The Add payment dialog"
        width={700}
        height={544}
        className="max-w-sm"
        caption="Choose the type, enter the amount and save. It stays pending until you mark it as collected."
      />
      <DocP>
        Collected payments feed the owner’s account statement: collected minus commission is what they’re owed.
      </DocP>

      <DocH3>The client page</DocH3>
      <DocP>
        Each booking has a page for the client with the property, their stay, the status and the payments (deposits and
        balance, never the commission). If the booking has a client, they get it by email when it’s created, confirmed or
        cancelled. If not, copy the link from the booking page or the ⋯ menu and send it yourself. See “What your clients
        see”.
      </DocP>
    </DocSection>
  );
}

function Availability() {
  return (
    <DocSection
      id="disponibilidad"
      icon={CalendarCheck}
      title="Availability"
      intro="All your rental properties in one calendar: what’s free and what’s booked, to answer an inquiry quickly and block dates without opening each property."
    >
      <DocP>
        It has two views, chosen on the right: <strong>Next 90 days</strong> (a grid with one row per property) and{" "}
        <strong>Monthly</strong> (a calendar). Only rental properties appear.
      </DocP>

      <DocH3>Next 90 days</DocH3>
      <DocFigure
        src="/docs-media/en/disponibilidad-grilla.webp"
        alt="The availability grid for the next 90 days"
        width={1304}
        height={704}
        markers={[
          { x: 12.8, y: 20, label: "Search for a property or filter by location." },
          { x: 69.1, y: 20, label: "Pick some dates to see which properties are free." },
          { x: 88.5, y: 20, label: "Next 90 days or Monthly." },
          { x: 88.5, y: 8.1, label: "The public link to your availability, to share." },
          { x: 34.7, y: 27.2, label: "What each colour means." },
          { x: 13, y: 48.9, label: "Each row is a property; click the name to open it." },
        ]}
      />
      <DocTerms
        items={[
          ["Green", "Available."],
          ["Red", "Booked or blocked."],
          ["Half and half", "Check-in day (taken from the afternoon) or check-out day (taken until the morning)."],
          ["Amber", "A pending booking: it doesn’t block the dates yet, but it’s been requested."],
          ["Grey", "Past days."],
        ]}
      />
      <DocList>
        <li>Properties are grouped by region. Hover over a day to see what it is.</li>
        <li>
          When you pick dates, those days are highlighted and with <strong>Available only</strong> only the properties
          free for the whole range remain. “Clear dates” goes back.
        </li>
        <li>25 properties are shown; “See more” loads the next ones.</li>
      </DocList>

      <DocH3>Monthly</DocH3>
      <DocFigure
        src="/docs-media/en/disponibilidad-mes.webp"
        alt="The monthly calendar with each day’s occupancy"
        width={1304}
        height={1298}
        markers={[
          { x: 6.4, y: 10.7, label: "Move between months; “Today” goes back to the current one." },
          { x: 67.9, y: 10.7, label: "Choose a property to see its bookings and block dates." },
          { x: 67.7, y: 52.5, label: "How many properties are booked that night." },
          { x: 62.4, y: 54.9, label: "Which ones: each property in its colour. Pending ones with a dotted border." },
        ]}
      />
      <DocP>
        With <strong>All properties</strong>, each day says how many are booked that night (in red if all are) and which
        ones, each always in the same colour. Hover to see the full list. When you click a day, the booked, pending and
        free ones appear below:
      </DocP>
      <DocFigure
        src="/docs-media/en/disponibilidad-dia.webp"
        alt="A day’s details with the booked and free properties"
        width={1100}
        height={234}
        className="max-w-2xl"
        markers={[
          { x: 25.5, y: 29.5, label: "What’s booked, pending and free that day." },
          { x: 45.6, y: 43, label: "“View month” opens that property’s calendar; the name opens the property." },
        ]}
      />

      <DocH3>Blocking dates from the calendar</DocH3>
      <DocSteps>
        <DocStep>
          In the <strong>Monthly</strong> view, choose the property at the top right.
        </DocStep>
        <DocStep>
          Drag over the free nights you want to block. With the keyboard: <Kbd>Enter</Kbd> on the first day and{" "}
          <Kbd>Enter</Kbd> on the last.
        </DocStep>
        <DocStep>
          The summary appears below (“4 nights, from 25 Oct to 29 Oct”). Write a note if you like and click{" "}
          <strong>Block</strong>.
        </DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/en/disponibilidad-bloquear.webp"
        alt="A property’s calendar with four nights marked to block"
        width={1304}
        height={1141}
        markers={[
          { x: 48.9, y: 89.2, label: "A booking’s days: check-in, booked nights and check-out." },
          { x: 8.7, y: 74.3, label: "Drag over the free nights to mark them." },
          { x: 23.6, y: 95.6, label: "Confirm the block, with an optional note." },
        ]}
      />
      <DocP>
        Past or booked nights can’t be marked. The block also appears in the property’s Availability section, where you
        can remove it.
      </DocP>

      <DocH3>The link to share</DocH3>
      <DocP>
        “Copy link to share” copies the address of your public availability: the same 90-day grid, on your site, with your
        branding. Use it to send to a client or a colleague. It only shows published properties and doesn’t show pending
        bookings.
      </DocP>
    </DocSection>
  );
}

function Services() {
  return (
    <DocSection
      id="servicios"
      icon={Sparkles}
      title="Services"
      intro="Your library of experiences and extra services. Add them once and include them in any offer."
    >
      <DocFigure
        src="/docs-media/en/servicios-lista.webp"
        alt="The service library"
        width={1304}
        height={946}
        markers={[
          { x: 20.9, y: 6, label: "Search by name, type or area." },
          { x: 89.8, y: 6, label: "New service." },
          { x: 72.8, y: 52.9, label: "Without a price, “On request” is shown." },
        ]}
      />

      <DocH3>Creating a service</DocH3>
      <DocSteps>
        <DocStep>
          Click <strong>New service</strong> and choose the type: butler, private chef, yacht, transfers, car, excursions,
          spa, babysitter, extra cleaning, events or other.
        </DocStep>
        <DocStep>Give it a name, a photo and a description: what’s included, how long it lasts, for how many people.</DocStep>
        <DocStep>
          Set the price and how it’s charged: per service, per person, per day, per night or per hour. Without a price,
          “On request” is shown.
        </DocStep>
        <DocStep>Say where it’s offered (empty means anywhere) and, if you like, the provider.</DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/en/servicios-editar.webp"
        alt="A service form: photo, areas, price, charging unit, provider and availability"
        width={784}
        height={1628}
        className="max-w-md"
        markers={[
          { x: 50, y: 18.2, label: "The service photo." },
          { x: 50, y: 51.9, label: "The areas where it’s offered; empty is anywhere." },
          { x: 77.3, y: 67.8, label: "How it’s charged: per service, person, day, night or hour." },
          { x: 50, y: 71.9, label: "The provider, for your team only." },
          { x: 89.6, y: 95.9, label: "Available to add to new offers." },
        ]}
      />
      <DocList>
        <li>Click a service in the list to edit or delete it.</li>
        <li>Only your team sees the provider, never the client.</li>
        <li>If you turn off “Available”, the service can’t be added to new offers, but stays in those that already have it.</li>
        <li>In each offer you can adjust the service’s price, quantity and date for that client, and leave a note.</li>
      </DocList>
    </DocSection>
  );
}

function Portal() {
  return (
    <DocSection
      id="portal"
      icon={Globe}
      title="Website"
      adminOnly
      intro="Your agency’s public website, where your clients see your published properties and write to you. It’s yours: it carries your name, your logo and your colours."
    >
      <DocP>
        It’s edited from <strong>Site</strong> in the menu. The editor takes up the whole screen: options on the left, a
        preview on the right that you can view as a computer or a phone. Save to publish the changes; if you try to leave
        with unsaved changes, we warn you.
      </DocP>
      <DocFigure
        src="/docs-media/en/portal-editor.webp"
        alt="The site editor on the Design tab, with the preview on the right"
        width={1760}
        height={990}
        markers={[
          { x: 14, y: 9.8, label: "The tabs: Design, Cover, Blocks and Agency and contact." },
          { x: 5.3, y: 28.8, label: "Choose whether you’re setting up the computer or the phone version." },
          { x: 72.2, y: 3.5, label: "View the preview as a computer or a phone." },
          { x: 85.9, y: 3.5, label: "View the published site." },
          { x: 95.1, y: 3.5, label: "Save changes publishes what you edited." },
          { x: 66, y: 57.1, label: "The preview, exactly as your clients will see it." },
        ]}
      />
      <DocTerms
        items={[
          [
            "Design",
            "The home page template (Cover, Editorial, Compact, Split or Mosaic), which can differ on phones; the colour of buttons and links (one from the palette or another by its code, such as #1F5F4A); and the typography (Modern, Classic, Understated, Elegant, Editorial, Warm, Urban or Architectural).",
          ],
          [
            "Cover",
            "The main photo (best landscape, at least 1920 px wide) and, in the Mosaic template, the four collage photos. Also the cover headline and text.",
          ],
          [
            "Blocks",
            "Your own sections between the cover and the listing. Each has several layouts and can be hidden without deleting it.",
          ],
          [
            "Agency and contact",
            "The text about your agency, phone, WhatsApp (turns on the “Message us on WhatsApp” button), Instagram and the office address.",
          ],
        ]}
      />

      <DocH3>Block types</DocH3>
      <DocFigure
        src="/docs-media/en/portal-bloques.webp"
        alt="The Blocks tab with three site blocks"
        width={896}
        height={1084}
        className="max-w-sm"
        markers={[
          { x: 36.7, y: 52.4, label: "Each block, with its type and layout. Click it to edit." },
          { x: 66.7, y: 53.9, label: "Hide it without deleting it." },
          { x: 81.9, y: 53.9, label: "Move it up or down." },
          { x: 89.5, y: 53.9, label: "Delete it." },
          { x: 49.9, y: 90.8, label: "Add a new block: choose the type, then its layout and content." },
        ]}
      />
      <DocTerms
        items={[
          ["Location", "An area with a photo, text and its properties. Layouts: Featured, Banner or Carousel."],
          [
            "Promotion",
            "Properties with a label like “15% OFF”, with an optional end date. Layouts: Colour band, Photo banner or Carousel.",
          ],
          ["Featured properties", "Your own selection: the newest, beachfront, the most requested. Layouts: Grid or Carousel."],
          ["Destinations", "Several areas at once, each with its photo. Tapping one filters the listing. Layouts: Tiles or Carousel."],
          [
            "Text and image",
            "Tell something of your own: your services, valuations, how you work. Image on the left, on the right or text only.",
          ],
          [
            "Call to action",
            "An invitation with a button that leads to the contact form, WhatsApp or the listing. Layouts: Colour or With photo.",
          ],
        ]}
      />

      <DocH3>Agency and contact</DocH3>
      <DocFigure
        src="/docs-media/en/portal-agencia.webp"
        alt="The Agency and contact tab of the site editor"
        width={896}
        height={1958}
        className="max-w-xs"
        caption="The “About your agency” text and the contact details shown in the footer and the contact button of the site."
      />
      <DocTip>
        To see how it turned out, use “View published” in the editor or “View my site” in your profile menu.
      </DocTip>
    </DocSection>
  );
}

function ClientPages() {
  return (
    <DocSection
      id="lo-que-ven-tus-clientes"
      icon={Eye}
      title="What your clients see"
      intro="The public pages Tivvo generates: your site, each property page, offers, bookings, the owner page and your availability. None of them asks for a username or password."
    >
      <DocH3>Your site</DocH3>
      <DocFigure
        src="/docs-media/en/portal-publico.webp"
        alt="An agency’s public site with the cover and the search bar"
        width={1584}
        height={946}
        caption="The cover with the search bar (operation, area and type), your blocks, the list of published properties and contact."
      />
      <DocList>
        <li>It shows only published properties. Property pages have a gallery, a map with the visible location and an inquiry form.</li>
        <li>Inquiries from the form land in Inquiries and create the client.</li>
        <li>You change it from Site (see “Website”); the address, from Settings.</li>
      </DocList>

      <DocH3>The offer</DocH3>
      <DocFigure
        src="/docs-media/en/ofertas-cliente.webp"
        alt="An offer page as the client sees it"
        width={1584}
        height={990}
        caption="The greeting, the sections with their properties (with the special price and the previous one struck through) and the services. At the bottom, a form to write to you."
      />

      <DocH3>The booking</DocH3>
      <DocFigure
        src="/docs-media/en/reservas-cliente.webp"
        alt="A confirmed booking page as the client sees it"
        width={1584}
        height={946}
        caption="The status, the property, the dates and the payments: total, paid and what’s left. It never shows your commission."
      />

      <DocH3>Your availability</DocH3>
      <DocFigure
        src="/docs-media/en/disponibilidad-publica.webp"
        alt="The agency’s public availability"
        width={1584}
        height={946}
        caption="The next 90 days of your published rentals, with search, location and dates. It doesn’t show pending bookings."
      />

      <DocH3>The owner page</DocH3>
      <DocP>See “Owners”.</DocP>
    </DocSection>
  );
}

function Team() {
  return (
    <DocSection
      id="equipo"
      icon={UsersRound}
      title="Team"
      adminOnly
      intro="The people who work at your agency in Tivvo and what each of them can do."
    >
      <DocFigure
        src="/docs-media/en/equipo.webp"
        alt="The agency’s team"
        width={1304}
        height={946}
        markers={[
          { x: 64.3, y: 6, label: "Filter by role." },
          { x: 89.1, y: 6, label: "Invite someone." },
          { x: 11.4, y: 19.7, label: "Each person’s role." },
        ]}
      />
      <DocSteps>
        <DocStep>
          Click <strong>Invite member</strong>, enter their name and email and choose the role: administrator or agent.
        </DocStep>
        <DocStep>
          They get their access by email. If they already had a Tivvo account (for example, at another agency), we add
          them to your team and they sign in with their usual password.
        </DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/en/equipo-invitar.webp"
        alt="The Invite member dialog"
        width={784}
        height={769}
        className="max-w-md"
        markers={[{ x: 50, y: 72.7, label: "Administrator or agent. See “Roles” in Getting started." }]}
      />
      <DocList>
        <li>From each person’s ⋯ menu you can change their role, copy their email, deactivate their access or remove them from the team.</li>
        <li>
          <strong>Deactivate access</strong> stops them from signing in but keeps their place, properties and clients; you
          can reactivate them whenever you like. People without access appear at the end.
        </li>
        <li>
          <strong>Remove from team</strong> takes away their access to this agency. Their account isn’t deleted: if they
          belong to another agency, they keep signing in there.
        </li>
        <li>The account owner can’t be removed or have their role changed.</li>
      </DocList>
    </DocSection>
  );
}

function SettingsDoc() {
  return (
    <DocSection
      id="configuracion"
      icon={Settings}
      title="Settings"
      adminOnly
      intro="Your agency’s details and the preferences for the whole account."
    >
      <DocFigure
        src="/docs-media/en/configuracion.webp"
        alt="The Settings page"
        width={1304}
        height={1486}
        markers={[
          { x: 6.1, y: 16.8, label: "Your logo and agency name." },
          { x: 30.4, y: 32.6, label: "Your site address." },
          { x: 30.4, y: 39.1, label: "The email that receives inquiry alerts." },
          { x: 32.2, y: 51.8, label: "Whether the owner sees your commission. Saved when you change it." },
          { x: 30.4, y: 69.1, label: "Default language and currency." },
          { x: 91.5, y: 3.4, label: "Save; next to it, shortcuts to copy, view and customise the site." },
        ]}
      />
      <DocTerms
        items={[
          [
            "Your agency",
            "The name and logo your clients see. Click the logo to change it; it uploads instantly.",
          ],
          [
            "Public site",
            "Your site address (lowercase letters, numbers and hyphens only). If you change it, the old link stops working: update it wherever you shared it. Also the contact email, which receives inquiry alerts.",
          ],
          [
            "Owner portal",
            "“Show the agency’s commission”: when off, the owner sees what they’re owed but not how much was deducted. Saved when you change it, without clicking Save.",
          ],
          [
            "Preferences",
            "The site language (the links you share open in it, and your clients can change it from the page) and the default currency for prices.",
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
      title="My profile"
      intro="Your personal details within the agency account."
    >
      <DocFigure
        src="/docs-media/en/perfil.webp"
        alt="The My profile page"
        width={1304}
        height={1321}
        markers={[
          { x: 6.1, y: 18.9, label: "Click the photo to change it; next to it, your role." },
          { x: 30.4, y: 30.1, label: "Your name and email; saved with “Save” at the top." },
          { x: 30.4, y: 53, label: "To change your password: the current one and the new one, twice." },
        ]}
      />
      <DocList>
        <li>The photo uploads instantly; your name shows in the menu and in your clients’ history.</li>
        <li>The new password must have at least 8 characters. The eye in each field shows what you typed.</li>
        <li>
          The dashboard language is changed from your profile menu, under “Language”. It’s personal: each person on the
          team can use their own.
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
      title="Search, shortcuts and help"
      intro="To move around the whole dashboard without leaving the keyboard, and who to turn to if you get stuck."
    >
      <DocH3>Search</DocH3>
      <DocP>
        <Kbd>Ctrl/⌘</Kbd> <Kbd>K</Kbd> opens a search that finds pages, properties, offers and clients by name. From there
        you can also create a property, offer, client or booking, invite someone to the team, open this documentation,
        change the appearance, collapse the menu and sign out.
      </DocP>
      <DocFigure
        src="/docs-media/en/buscador.webp"
        alt="The search showing results for “pérez”"
        width={960}
        height={347}
        className="max-w-lg"
        caption="Type part of a name and choose with the arrows and Enter. Esc closes it."
      />

      <DocH3>Shortcuts</DocH3>
      <DocP>
        <Kbd>?</Kbd> shows all the shortcuts on any dashboard screen.
      </DocP>
      <DocTerms
        items={[
          [<><Kbd>Ctrl/⌘</Kbd> <Kbd>K</Kbd></>, "Search and run commands"],
          [<><Kbd>Ctrl/⌘</Kbd> <Kbd>S</Kbd></>, "Save the open form"],
          [<><Kbd>Ctrl/⌘</Kbd> <Kbd>B</Kbd></>, "Collapse or expand the side menu"],
          [<Kbd key="q">?</Kbd>, "See all shortcuts"],
          [
            <><Kbd>G</Kbd> and a letter</>,
            "Go to a section: P properties, O offers, C clients, I inquiries, R bookings, D availability, E team, W site, S settings, M my profile",
          ],
          [<Kbd key="n">N</Kbd>, "Create a new one in the open list"],
          [<Kbd key="s">/</Kbd>, "Go to the list’s search"],
          [<Kbd key="f">F</Kbd>, "Open the filters"],
          [<><Kbd>1</Kbd> <Kbd>2</Kbd> <Kbd>3</Kbd></>, "Grid, list or table view"],
          [<><Kbd>J</Kbd> <Kbd>K</Kbd></>, "Move down and up between items; Enter opens the selected one"],
          [<Kbd key="e">Esc</Kbd>, "Clear the selection"],
        ]}
      />

      <DocH3>Help and support</DocH3>
      <DocP>
        In your profile menu, <strong>Help and support</strong> opens the help centre: FAQs with search and a form to
        write to the Tivvo team. We reply by email.
      </DocP>
      <DocFigure
        src="/docs-media/en/ayuda.webp"
        alt="The Tivvo help centre"
        width={1584}
        height={946}
        caption="Search for your question; if you can’t find it, write to us from the form."
      />
    </DocSection>
  );
}

export const DOC_SECTIONS: DocEntry[] = [
  { id: "primeros-pasos", label: "Getting started", Content: Basics },
  { id: "consultas", label: "Inquiries", Content: Inquiries },
  { id: "clientes", label: "Clients", Content: Clients },
  { id: "propiedades", label: "Properties", Content: Properties },
  { id: "propietarios", label: "Owners", Content: Owners },
  { id: "importar", label: "Import properties", adminOnly: true, Content: Importer },
  { id: "ofertas", label: "Offers", Content: Offers },
  { id: "reservas", label: "Bookings", Content: Bookings },
  { id: "disponibilidad", label: "Availability", Content: Availability },
  { id: "servicios", label: "Services", Content: Services },
  { id: "portal", label: "Website", adminOnly: true, Content: Portal },
  { id: "lo-que-ven-tus-clientes", label: "What your clients see", Content: ClientPages },
  { id: "equipo", label: "Team", adminOnly: true, Content: Team },
  { id: "configuracion", label: "Settings", adminOnly: true, Content: SettingsDoc },
  { id: "perfil", label: "My profile", Content: Profile },
  { id: "atajos", label: "Search, shortcuts and help", Content: Shortcuts },
];
