"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

export function LivePreviewPhone() {
  const showPreview = useMediaQuery("(min-width: 900px)");

  if (!showPreview) return null;

  return (
    <figure className="live-preview-phone" aria-hidden="true">
      <figcaption className="live-preview-phone-caption">
        <span /> Live mobile view
      </figcaption>
      <div className="live-preview-phone-device">
        <span className="live-preview-phone-speaker" />
        <div className="live-preview-phone-screen">
          <iframe
            className="live-preview-phone-iframe"
            src="/?embed=true"
            title="A live mobile preview of this portfolio"
            loading="lazy"
            tabIndex={-1}
          />
        </div>
      </div>
    </figure>
  );
}
