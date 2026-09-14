import Link from "next/link";
import { routes, type Locale } from "@/lib/site/routes";

export default function ContextDescription({ locale }: { locale: Locale }) {
  return <>{locale === "sr" ? "Upoznaj projekte " : "Explore "}<Link className="v10-inline-link" href={`${routes[locale].projects}/mrzim-svog-brata`}>MRZIM SVOG BRATA</Link>{locale === "sr" ? " i " : " and "}<Link className="v10-inline-link" href={`${routes[locale].projects}/biblija`}>BIBLIJA</Link>{locale === "sr" ? ", njihove likove i književne izvore." : ", their characters and their literary sources."}</>;
}
