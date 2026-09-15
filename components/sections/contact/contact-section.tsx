import type { SiteConfig } from "@/types/site-config";
import { SocialLinks } from "@/components/common/social-links";

interface ContactSectionProps {
  config: SiteConfig;
}

export function ContactSection({ config }: ContactSectionProps) {
  return (
    <section
      id="contact"
      className="story-section contact-section page-width"
      data-timeline-section
      aria-labelledby="contact-title"
    >
      <p className="mb-7.5 text-sm leading-5.5 font-medium max-[699px]:mb-5.75 max-[699px]:text-xs max-[699px]:leading-4.5">
        Before you go
      </p>
      <h2 id="contact-title">
        Good things start
        <br />
        with a conversation.
      </h2>
      <p className="contact-description">
        An idea, a question, or something worth building together.
        <br className="desktop-break" /> There’s always room for a new
        beginning.
      </p>
      {config.email ? (
        <a className="contact-email" href={`mailto:${config.email}`}>
          {config.email}
        </a>
      ) : (
        <p className="contact-pending">Contact details coming soon.</p>
      )}
      <div className="mt-7">
        <SocialLinks socials={config.socials} />
      </div>
      <p className="goodnight">
        Thanks for spending a little of your day here.
      </p>
    </section>
  );
}
