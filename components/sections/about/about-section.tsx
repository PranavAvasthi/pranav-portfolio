export function AboutSection() {
  return (
    <section
      id="about"
      className="story-section page-width"
      data-timeline-section
      aria-labelledby="about-title"
    >
      <p className="mb-7.5 text-sm leading-5.5 font-medium max-[699px]:mb-5.75 max-[699px]:text-xs max-[699px]:leading-4.5">
        A little context
      </p>
      <div className="section-heading-row mb-14.5 flex items-end justify-between gap-8 max-[699px]:mb-9">
        <h2 id="about-title">
          Curiosity is
          <br />
          the starting point.
        </h2>
        <span className="time-note">In the daylight</span>
      </div>
      <div className="about-copy">
        <p className="lead-copy">
          I like the space between
          <br className="desktop-break" /> “what if” and “it works.”
        </p>
        <div className="body-copy">
          <p>
            That’s where an idea becomes something you can use. Where a rough
            sketch turns into an interface, and a complicated problem starts to
            make sense.
          </p>
          <p>
            I’m drawn to thoughtful products, clear code, and details that feel
            effortless. This little corner of the web is a place for the things
            I’m building—and the things I’m learning along the way.
          </p>
        </div>
      </div>
      <p className="section-closing">
        Thoughtful by design. Curious by default.
      </p>
    </section>
  );
}
