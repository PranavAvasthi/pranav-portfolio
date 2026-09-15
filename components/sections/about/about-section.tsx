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
          One product mindset.
          <br className="desktop-break" /> Web and mobile craft.
        </p>
        <div className="body-copy">
          <p>
            I’m a SWE 3 developer working with Next.js and React Native. My
            focus is the connection between a useful interface and the
            engineering decisions that support it.
          </p>
          <p>
            This site is one example: the content renders on the server, the sky
            follows one shared timeline, and the interactive details have
            keyboard and reduced-motion alternatives. Open the portfolio case
            study below to see the decisions behind the experience.
          </p>
        </div>
      </div>
      <p className="section-closing">
        Thoughtful by design. Curious by default.
      </p>
    </section>
  );
}
