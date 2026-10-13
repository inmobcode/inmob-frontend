import type { ListingType, PropertyStatus } from "@/lib/api/properties";
import type { DiscountType, OfferOperation, OfferStatus } from "@/lib/api/offers";
import type { ClientStage } from "@/lib/api/clients";
import type { BookingStatus, PaymentType } from "@/lib/api/bookings";

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  SALE: "Venta",
  RENT: "Alquiler",
};

export const STATUS_LABELS: Record<PropertyStatus, string> = {
  DRAFT: "Borrador",
  PUBLISHED: "Publicada",
  ARCHIVED: "Archivada",
};

export const OFFER_OPERATION_LABELS: Record<OfferOperation, string> = {
  SALE: "Venta",
  RENT: "Alquiler",
  BOTH: "Venta y alquiler",
};

export const OFFER_STATUS_LABELS: Record<OfferStatus, string> = {
  DRAFT: "Borrador",
  SENT: "Enviada",
  VIEWED: "Vista",
  EXPIRED: "Vencida",
};

export const DISCOUNT_TYPE_LABELS: Record<DiscountType, string> = {
  NONE: "Sin descuento",
  PERCENT: "Porcentaje",
  FIXED: "Monto fijo",
};

export const CLIENT_STAGE_LABELS: Record<ClientStage, string> = {
  LEAD: "Lead",
  CONTACTED: "Contactado",
  NEGOTIATING: "Negociando",
  CLIENT: "Cliente",
  LOST: "Perdido",
};

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  COMPLETED: "Completada",
};

export const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  DEPOSIT: "Anticipo",
  BALANCE: "Saldo",
  COMMISSION: "Comisión",
};

export const CATEGORY_LABELS: Record<string, string> = {
  HOUSE: "Casa",
  APARTMENT: "Apartamento",
  PENTHOUSE: "Penthouse",
  VILLA: "Villa",
  CHALET: "Chalet",
  SEASONAL_PROPERTY: "Alquiler de temporada",
  MAISONETTE: "Dúplex",
  DETACHED_VILLA: "Villa independiente",
  SEMI_DETACHED_VILLA: "Villa pareada",
  HOTEL: "Hotel",
  TOWNHOUSE: "Casa adosada",
  CONDO: "Condominio",
  BUILDING: "Edificio",
  LAND: "Terreno",
  COMMERCIAL: "Local comercial",
  OFFICE: "Oficina",
};

/** Spanish label for a category code, falling back to a readable version of the code. */
export function categoryLabel(code: string) {
  if (CATEGORY_LABELS[code]) return CATEGORY_LABELS[code];
  const readable = code.replace(/_/g, " ").toLowerCase();
  return readable.charAt(0).toUpperCase() + readable.slice(1);
}

export const LOCATION_CATEGORY_LABELS: Record<string, string> = {
  PRIVATE: "Privada",
  PART_OF_COMPLEX: "Parte de un complejo",
  PART_OF_HOTEL: "Parte de un hotel",
  PART_OF_RESORT: "Parte de un resort",
};

export const LOCATION_FEATURE_LABELS: Record<string, string> = {
  Waterfront: "Frente al agua",
  "Prime Waterfront": "Primera línea de agua",
  Beachfront: "Frente a la playa",
  "Resort Access": "Acceso a resort",
  "Walking distance to a village": "A pie de un pueblo",
  Private: "Privada",
  City: "Ciudad",
  Downtown: "Centro",
  Seaside: "Costera",
  Mountain: "Montaña",
  "Private beach/sea access": "Acceso privado a playa o mar",
  "Walking distance to the beach": "A pie de la playa",
  "Walking distance to town": "A pie del centro",
  "Ski in/Ski out": "Ski in / Ski out",
  "Sea Access": "Acceso al mar",
  "Beach Access": "Acceso a la playa",
};

export const VIEW_LABELS: Record<string, string> = {
  "Sea View": "Vista al mar",
  "Direct Sea View": "Vista directa al mar",
  "City View": "Vista a la ciudad",
  "Nature View": "Vista a la naturaleza",
  "Panoramic View": "Vista panorámica",
  "Lake View": "Vista al lago",
  "Forest View": "Vista al bosque",
  "Sunset View": "Vista al atardecer",
  "Sunrise View": "Vista al amanecer",
  "Mountain View": "Vista a la montaña",
  "Town View": "Vista al pueblo",
  "Ocean View": "Vista al océano",
  "Water View": "Vista al agua",
};

export const OUTDOOR_AMENITY_LABELS: Record<string, string> = {
  Pool: "Piscina",
  "Rooftop Pool": "Piscina en la azotea",
  "Plunge Pool": "Piscina de inmersión",
  "Pool Bar": "Bar en la piscina",
  "Heated pool": "Piscina climatizada",
  Jacuzzi: "Jacuzzi",
  "Outdoor kitchen": "Cocina exterior",
  "Outdoor Gym": "Gimnasio exterior",
  "Dining & Lounge Area": "Comedor y zona lounge",
  Cinema: "Cine",
  "Ice plunge": "Inmersión en hielo",
  Sauna: "Sauna",
  Playground: "Juegos infantiles",
  Helipad: "Helipuerto",
  "Private Dock": "Muelle privado",
  "Access to a dock": "Acceso a un muelle",
  "Private Parking": "Estacionamiento privado",
  BBQ: "Parrilla",
  "Tennis Court": "Cancha de tenis",
  "Basketball Court": "Cancha de básquet",
  "Ski in/out": "Ski in / out",
  "Sun Deck": "Solárium",
  "Fire Pit": "Fogón",
  "Outdoor Fireplace": "Chimenea exterior",
  "Roof Terrace": "Terraza en la azotea",
  "Yoga Shala": "Espacio de yoga",
  "Landscaped Gardens": "Jardines paisajísticos",
  "Boxing Ring": "Ring de boxeo",
  Golf: "Golf",
  "Beach Volleyball Court": "Cancha de vóley de playa",
  "Children's Play Area": "Área de juegos infantil",
  "Outdoor Shower": "Ducha exterior",
  "Sound System": "Sistema de sonido",
  "Gated Property": "Propiedad cerrada",
  "Table tennis": "Ping pong",
  "CCTV Camera": "Cámaras de seguridad (CCTV)",
};

export const INDOOR_AMENITY_LABELS: Record<string, string> = {
  "Indoor Pool": "Piscina interior",
  Gym: "Gimnasio",
  "Fitness room": "Sala de fitness",
  Hammam: "Hammam",
  Sauna: "Sauna",
  "Massage room": "Sala de masajes",
  "Home Cinema": "Cine en casa",
  Club: "Club",
  Elevator: "Ascensor",
  "Spa Area": "Área de spa",
  "Professional Kitchen": "Cocina profesional",
  "Wine Cellar": "Bodega de vinos",
  Fireplace: "Chimenea",
  "Ski Room": "Sala de esquí",
  "Cigar Lounge": "Sala de cigarros",
  "Laundry Facilities": "Lavandería",
  "Spa and Wellness Centre": "Centro de spa y bienestar",
  "Game Room": "Sala de juegos",
  Billiard: "Billar",
  Playroom: "Sala de juegos infantil",
  "Music/Recording Studio": "Estudio de música o grabación",
  "Staff quarters": "Cuartos de servicio",
  "Smart Home Technology": "Domótica",
  "Office/Workspace": "Oficina o espacio de trabajo",
  "Children's Play Area": "Área de juegos infantil",
  "Alarm System": "Sistema de alarma",
  "Safe Boxes": "Cajas fuertes",
  "Fully equipped kitchen": "Cocina totalmente equipada",
  Airconditioning: "Aire acondicionado",
  "Underfloor heating": "Calefacción por suelo radiante",
  "Solar panels": "Paneles solares",
  "Security cameras": "Cámaras de seguridad",
  "Central heating": "Calefacción central",
  "Double glazed windows": "Ventanas de doble vidrio",
  "Security system": "Sistema de seguridad",
  "Wood flooring": "Pisos de madera",
  "Internal staircase": "Escalera interna",
};

export const PROPERTY_CONDITION_LABELS: Record<string, string> = {
  "Fully staffed": "Personal completo",
  "Semi staffed": "Personal parcial",
  "Housekeeping & Daily cleaning": "Limpieza diaria",
  "Suitable for children": "Apta para niños",
  "Suitable for events": "Apta para eventos",
  "Suitable for the disabled": "Accesible para personas con discapacidad",
  "Pet friendly": "Admite mascotas",
  "For Sale": "En venta",
  "Under Contract": "Con contrato en curso",
  Sold: "Vendida",
  "New Construction": "Obra nueva",
  Renovated: "Renovada",
  "Investment Property": "Propiedad de inversión",
  "Luxury Property": "Propiedad de lujo",
};

export const INCLUDED_SERVICE_LABELS: Record<string, string> = {
  Housekeeping: "Limpieza",
  "Daily housekeeping": "Limpieza diaria",
  "Pool Maintenance": "Mantenimiento de la piscina",
  "Change of linen": "Cambio de sábanas",
  "Change of towels": "Cambio de toallas",
  "24/7 Reception": "Recepción 24/7",
  "Airport transfer": "Traslado al aeropuerto",
  "Concierge service": "Servicio de conserjería",
  Security: "Seguridad",
  Gardener: "Jardinero",
  Babysitting: "Niñera",
  "Laundry service": "Servicio de lavandería",
  "Daily breakfast": "Desayuno diario",
  "Car rental arrangement": "Gestión de alquiler de auto",
  "Grocery pre-stocking": "Compras previas de víveres",
};
