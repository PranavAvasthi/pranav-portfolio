"use client";

import { useLayoutEffect, useRef } from "react";
import {
  getPenLift,
  getPenPose,
  getSignatureTimeline,
  getWrittenLength,
  SIGNATURE_SETTLE_MS,
  signatureProgress,
} from "@/lib/animations/signature-motion";
import type { SignatureData } from "@/types/signature";

interface SignatureProps {
  name: string;
  signature: SignatureData;
}

export function Signature({ name, signature }: SignatureProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const finished = useRef(false);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const complete = () => {
      cancelAnimationFrame(frame);
      finished.current = true;
      svg.dataset.drawState = "complete";
    };
    // Unknown letters retain their real font fill until a matching pen route
    // is authored; never substitute an outline trace for handwriting.
    if (
      finished.current ||
      media.matches ||
      signature.paths.some((letter) => !letter.strokes.length)
    ) {
      complete();
      return;
    }

    const fills = Array.from(
      svg.querySelectorAll<SVGPathElement>(".signature-fill path"),
    );
    const groups = Array.from(
      svg.querySelectorAll<SVGGElement>(".signature-letter-strokes"),
    );
    const pen = svg.querySelector<SVGGElement>(".signature-pen");
    if (!pen) return;
    const paths = groups.flatMap((group) =>
      Array.from(group.querySelectorAll<SVGPathElement>("path")),
    );
    const lengths = paths.map((path) => path.getTotalLength());
    let lengthIndex = 0;
    const timeline = getSignatureTimeline(
      signature.paths.map((letter) => ({
        wordStart: letter.wordStart,
        lengths: letter.strokes.map(() => lengths[lengthIndex++]),
      })),
    );
    const letterEnds = signature.paths.map(
      (_, index) =>
        timeline.filter((stroke) => stroke.letterIndex === index).at(-1)?.end ??
        0,
    );
    const last = timeline.at(-1);
    if (!last) {
      complete();
      return;
    }
    paths.forEach((path, index) => {
      path.style.strokeDasharray = `${lengths[index]}`;
      path.style.strokeDashoffset = `${lengths[index]}`;
    });
    fills.forEach((path) => {
      path.style.opacity = "0";
    });
    groups.forEach((group) => {
      group.style.opacity = "1";
    });
    svg.dataset.drawState = "drawing";

    const poseAt = (index: number, distance: number) =>
      getPenPose(
        (length) => paths[index].getPointAtLength(length),
        timeline[index].length,
        distance,
        signature.paths[timeline[index].letterIndex].offsetX,
      );
    let elapsed = 0;
    let previousFrame: number | undefined;
    const draw = (now: number) => {
      if (previousFrame !== undefined) elapsed += now - previousFrame;
      previousFrame = now;
      timeline.forEach((stroke, index) => {
        const length = getWrittenLength(
          stroke.length,
          (elapsed - stroke.start) / (stroke.end - stroke.start),
        );
        paths[index].style.strokeDashoffset = `${stroke.length - length}`;
      });
      letterEnds.forEach((end, index) => {
        const ink = signatureProgress((elapsed - end) / SIGNATURE_SETTLE_MS);
        fills[index].style.opacity = `${ink}`;
        groups[index].style.opacity = `${1 - ink}`;
      });

      const activeIndex = timeline.findIndex((stroke) => elapsed <= stroke.end);
      let pose;
      let opacity = 1;
      if (activeIndex === -1) {
        const from = poseAt(timeline.length - 1, last.length);
        const lift = signatureProgress(
          (elapsed - last.end) / SIGNATURE_SETTLE_MS,
        );
        pose = getPenLift(
          from,
          { ...from, x: from.x + 10, y: from.y - 8 },
          lift,
        );
        opacity = 1 - lift;
        pen.dataset.phase = "settling";
      } else {
        const active = timeline[activeIndex];
        pen.dataset.stroke = `${activeIndex}`;
        if (elapsed < active.start) {
          const to = poseAt(activeIndex, 0);
          const previous = timeline[activeIndex - 1];
          const from = previous
            ? poseAt(activeIndex - 1, previous.length)
            : { ...to, x: to.x - 6, y: to.y - 10 };
          const progress =
            (elapsed - (previous?.end ?? 0)) /
            (active.start - (previous?.end ?? 0));
          pose = getPenLift(from, to, progress);
          opacity = previous ? 0.7 : signatureProgress(progress);
          pen.dataset.phase = "lifting";
        } else {
          const distance = getWrittenLength(
            active.length,
            (elapsed - active.start) / (active.end - active.start),
          );
          pose = poseAt(activeIndex, distance);
          pen.dataset.phase = "writing";
        }
      }
      pen.setAttribute(
        "transform",
        `translate(${pose.x} ${pose.y}) rotate(${pose.angle})`,
      );
      pen.style.opacity = `${opacity}`;
      if (elapsed >= last.end + SIGNATURE_SETTLE_MS) complete();
      else frame = requestAnimationFrame(draw);
    };
    const onPreference = () => {
      if (media.matches) complete();
    };
    const onVisibility = () => {
      cancelAnimationFrame(frame);
      previousFrame = undefined;
      if (!document.hidden && !finished.current)
        frame = requestAnimationFrame(draw);
    };
    media.addEventListener("change", onPreference);
    document.addEventListener("visibilitychange", onVisibility);
    if (!document.hidden) frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      media.removeEventListener("change", onPreference);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [signature]);

  return (
    <span className="signature-wrapper">
      <svg
        ref={svgRef}
        className="signature"
        viewBox={signature.viewBox}
        width={signature.width}
        height={signature.height}
        role="img"
        aria-label={name}
        data-draw-state="pending"
        focusable="false"
      >
        <g className="signature-fill" aria-hidden="true">
          {signature.paths.map((path, index) => (
            <path key={index} d={path.d} />
          ))}
        </g>
        <g className="signature-trace" aria-hidden="true">
          {signature.paths.map((letter, index) => (
            <g
              key={index}
              className="signature-letter-strokes"
              transform={`translate(${letter.offsetX} 0)`}
            >
              {letter.strokes.map((d, strokeIndex) => (
                <path key={strokeIndex} d={d} />
              ))}
            </g>
          ))}
        </g>
        <g className="signature-pen" aria-hidden="true">
          <path d="M0 0 L-14 -5 L-26 0 L-14 5 Z M0 0 L-15 0" />
        </g>
      </svg>
    </span>
  );
}
