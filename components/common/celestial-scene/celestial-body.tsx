interface CelestialBodyProps {
  body: "sun" | "moon";
}

export function CelestialBody({ body }: CelestialBodyProps) {
  return <div className={`celestial-body celestial-${body}`} />;
}
