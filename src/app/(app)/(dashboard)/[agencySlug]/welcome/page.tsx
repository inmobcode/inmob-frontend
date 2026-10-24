import { getTranslations } from "next-intl/server";

import { WelcomeChoice } from "@/components/welcome/welcome-choice";

export async function generateMetadata() {
  const t = await getTranslations("welcome");
  return { title: t("meta") };
}

export default function WelcomePage() {
  return <WelcomeChoice />;
}
