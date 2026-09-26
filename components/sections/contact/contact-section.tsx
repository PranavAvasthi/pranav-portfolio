import type { SiteConfig } from "@/types/site-config";
import { SocialLinks } from "@/components/common/social-links";
import { ContactForm } from "@/components/sections/contact/contact-form";

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
      <div className="mt-10 grid items-start gap-10 min-[900px]:mt-12 min-[900px]:grid-cols-2 min-[900px]:gap-16">
        <div className="min-w-0">
          <p className="text-[17px] leading-[1.8] text-(--muted) max-[699px]:text-[15px]">
            An idea, a question, or something worth building together. There’s
            always room for a new beginning.
          </p>
          {config.email ? (
            <>
              <p className="mt-7 text-xs text-(--muted)">Prefer email?</p>
              <a
                className="mt-2 inline-block max-w-full text-[clamp(1.125rem,2vw,1.5rem)] tracking-tight wrap-anywhere"
                href={`mailto:${config.email}`}
              >
                {config.email}
              </a>
            </>
          ) : (
            <p className="contact-pending">Contact details coming soon.</p>
          )}
          <div className="mt-7">
            <SocialLinks socials={config.socials} />
          </div>
        </div>
        <ContactForm />
      </div>
      <p className="goodnight">
        It&apos;s late where the sky is. Good time to start something.
      </p>
    </section>
  );
}
