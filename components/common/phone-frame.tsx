import type { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
  className: string;
  screenClassName: string;
}

export function PhoneFrame({
  children,
  className,
  screenClassName,
}: PhoneFrameProps) {
  return (
    <div className={`phone-frame ${className}`}>
      <span className="phone-frame-speaker" />
      <div className={`phone-frame-screen ${screenClassName}`}>{children}</div>
    </div>
  );
}
