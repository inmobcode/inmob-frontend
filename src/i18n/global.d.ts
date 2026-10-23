import type { Locale } from "./config";
import type messages from "@/messages/es";

declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
  }
}
