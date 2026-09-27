import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getSiteConfig } from "@/lib/data/get-site-config";
import { getProjects } from "@/lib/data/get-projects";
import { SITE_URL, getCanonicalUrl } from "@/lib/seo/site-url";
import { getPageMetadata } from "@/lib/seo/metadata";
import {
  getSiteStructuredData,
  serializeStructuredData,
} from "@/lib/seo/structured-data";
import { isEmbeddedPreview } from "@/lib/utils/is-embedded-preview";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

describe("public SEO configuration", () => {
  it("canonicalizes query strings, fragments and trailing slashes without accepting other origins", () => {
    assert.equal(SITE_URL, "https://pranavavasthi.in");
    assert.equal(getCanonicalUrl("/?embed=true#home"), `${SITE_URL}/`);
    assert.equal(
      getCanonicalUrl("/projects/a-day-on-the-web/?ref=share"),
      `${SITE_URL}/projects/a-day-on-the-web`,
    );
    assert.throws(() => getCanonicalUrl("https://example.com/"));
    assert.throws(() => getCanonicalUrl("//example.com/"));
  });

  it("gives each public page complete matching canonical and social metadata", async () => {
    const config = await getSiteConfig();
    const home = getPageMetadata(config, { path: "/" });
    const study = getPageMetadata(config, {
      path: "/projects/a-day-on-the-web",
      title: "A day on the web",
      description: "The actual case study.",
    });
    assert.deepEqual(home.title, {
      absolute: `${config.name} | ${config.jobTitle}`,
    });
    assert.equal(
      study.alternates?.canonical,
      `${SITE_URL}/projects/a-day-on-the-web`,
    );
    assert.equal(study.openGraph?.url, study.alternates?.canonical);
    assert.equal(study.twitter?.description, "The actual case study.");
    assert.deepEqual(
      study.openGraph?.title,
      study.title &&
        typeof study.title === "object" &&
        "absolute" in study.title
        ? study.title.absolute
        : null,
    );
    assert.equal(home.keywords, undefined);
  });

  it("keeps embedded previews out of search and resolves repeated query values consistently", async () => {
    const config = await getSiteConfig();
    for (const value of ["true", ["false", "true"]]) {
      assert.equal(isEmbeddedPreview(value), true);
      const metadata = getPageMetadata(config, {
        path: "/",
        index: !isEmbeddedPreview(value),
      });
      const robotsMetadata = metadata.robots;
      assert.ok(
        robotsMetadata &&
          typeof robotsMetadata === "object" &&
          !Array.isArray(robotsMetadata),
      );
      assert.equal(robotsMetadata.index, false);
      assert.equal(metadata.alternates?.canonical, `${SITE_URL}/`);
    }
    assert.equal(isEmbeddedPreview(undefined), false);
  });

  it("lists only routable case studies and the homepage, without made-up modification dates", async () => {
    const [entries, projects] = await Promise.all([sitemap(), getProjects()]);
    assert.deepEqual(entries, [
      { url: `${SITE_URL}/` },
      ...projects
        .filter((project) => project.caseStudy)
        .map((project) => ({ url: `${SITE_URL}/projects/${project.slug}` })),
    ]);
    assert.equal(robots().sitemap, `${SITE_URL}/sitemap.xml`);
    assert.equal(
      projects.find((project) => project.slug === "a-day-on-the-web")?.url,
      `${SITE_URL}/`,
    );
  });

  it("uses existing identity profiles and safely serializes script-like content", async () => {
    const config = await getSiteConfig();
    const graph = getSiteStructuredData(config);
    const person = graph["@graph"][0];
    const website = graph["@graph"][1];
    assert.equal(person.jobTitle, config.jobTitle);
    assert.equal(person.url, `${SITE_URL}/`);
    assert.equal(website.name, "Pranav Avasthi");
    assert.equal(website.url, `${SITE_URL}/`);
    assert.deepEqual(
      person.sameAs,
      config.socials.map((social) => social.url),
    );
    const unsafeName = "</script><script>alert(1)</script>";
    const json = serializeStructuredData(
      getSiteStructuredData({ ...config, name: unsafeName }),
    );
    assert.equal(json.includes("<"), false);
    assert.equal(JSON.parse(json)["@graph"][0].name, unsafeName);
  });
});
