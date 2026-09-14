"use client";

interface RouteErrorProps {
  retry: () => void;
}

export function RouteError({ retry }: RouteErrorProps) {
  return (
    <div className="route-message" role="alert">
      <h1>A little interruption.</h1>
      <p>The page couldn’t load. Let’s give it another try.</p>
      <button className="primary-link" onClick={retry}>
        Try again
      </button>
    </div>
  );
}
