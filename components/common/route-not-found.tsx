import Link from "next/link";

export function RouteNotFound() {
  return (
    <main className="route-message page-width">
      <p className="mb-5 text-sm">404 · Page not found</p>
      <h1>This page isn’t here.</h1>
      <p className="body-copy">
        Head back to the portfolio to explore my work.
      </p>
      <Link className="text-link mt-6" href="/">
        Back to the portfolio
      </Link>
    </main>
  );
}
