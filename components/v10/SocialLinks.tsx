
import type { Locale } from "@/lib/site/routes";
import { UMBRA_YOUTUBE_URL } from "@/lib/seo/jsonLd";

export default function SocialLinks({ locale }: { locale: Locale }) {
  return <div className="v10-socials">
    <a href={UMBRA_YOUTUBE_URL} target="_blank" rel="noopener noreferrer" aria-label="Umbra Studio · YouTube" className="v8-icon-button"><svg width="21" height="18" viewBox="0 0 24 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="4"/><path d="m10 7 6 3-6 3Z"/></svg></a>
    <a href="https://www.tiktok.com/@umbrastud" target="_blank" rel="noopener noreferrer" aria-label="Umbra Studio · TikTok" className="v8-icon-button"><svg width="18" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M14 3v12.5a4.5 4.5 0 1 1-4.5-4.5H11M14 3h3c0 3 1.5 4.5 4 5v3c-3-.5-5-1.8-7-4" /></svg></a>
    <span className="v8-icon-button v10-social-unavailable" role="img" aria-label={locale === "sr" ? "Instagram · profil još nije dostupan" : "Instagram · profile not available yet"} title={locale === "sr" ? "Instagram · uskoro" : "Instagram · coming soon"}><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".7" fill="currentColor"/></svg><small>{locale === "sr" ? "uskoro" : "soon"}</small></span>
  </div>;
}
