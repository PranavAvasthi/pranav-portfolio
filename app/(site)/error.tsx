"use client";

import { RouteError } from "@/components/common/route-error";

interface ErrorPageProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function ErrorPage({ retry }: ErrorPageProps) {
  return <RouteError retry={retry} />;
}
