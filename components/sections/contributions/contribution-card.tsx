import Image from "next/image";
import type { Contribution } from "@/types/contribution";

interface ContributionCardProps {
  contribution: Contribution;
}

export function ContributionCard({ contribution }: ContributionCardProps) {
  return (
    <article className="flex min-w-0 flex-col border-t border-foreground/28 pt-5">
      {contribution.image && (
        <figure className="project-image-preview mt-0! mb-6! w-full! overflow-hidden rounded-sm">
          <Image
            src={contribution.image.src}
            alt={contribution.image.alt}
            fill
            sizes="(max-width: 699px) calc(100vw - 44px), (max-width: 900px) calc(50vw - 52px), 350px"
            className="object-cover"
          />
        </figure>
      )}
      <p className="mb-5">
        <span className="inline-block rounded-[3px] bg-(--accent) px-2.25 py-0.75 text-xs leading-[1.85] font-[650] text-(--accent-ink)">
          {contribution.tag}
        </span>
      </p>
      <h3 className="mb-4 text-[clamp(1.35rem,2vw,1.7rem)]">
        {contribution.title}
      </h3>
      <p className="mb-7 text-sm leading-7 text-(--muted)">
        {contribution.description}
      </p>
      <a
        className="text-link mt-auto w-fit text-sm"
        href={contribution.link.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {contribution.link.label}
      </a>
    </article>
  );
}
