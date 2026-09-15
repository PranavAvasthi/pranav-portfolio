"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useVisibleCanvas } from "@/hooks/use-visible-canvas";
import { drawConstellation } from "@/components/common/celestial-scene/constellation-skill.utils";
import type { Skill } from "@/types/skill";

interface ConstellationSkillProps {
  skills: Skill[];
}

export function ConstellationSkill({ skills }: ConstellationSkillProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const mobile = useMediaQuery("(max-width: 699px)");
  const active = skills.find((skill) => skill.id === activeId);
  const { canvasRef, invalidate } = useVisibleCanvas(
    (context, width, height) => {
      const accent = getComputedStyle(context.canvas)
        .getPropertyValue("--accent")
        .trim();
      drawConstellation(
        context,
        width,
        height,
        skills,
        activeId,
        mobile,
        accent,
      );
    },
  );
  useEffect(() => invalidate(), [activeId, mobile, skills, invalidate]);

  return (
    <div className="constellation">
      <div
        className="constellation-map"
        role="group"
        aria-label="Explore skill constellations"
        aria-describedby="constellation-help"
      >
        <canvas ref={canvasRef} aria-hidden="true" />
        <span className="constellation-group group-interface">Interface</span>
        <span className="constellation-group group-systems">Systems</span>
        <span className="constellation-group group-craft">Craft</span>
        {skills.map((skill) => (
          <button
            key={skill.id}
            type="button"
            className="constellation-point"
            style={
              {
                "--point-x": `${skill.position.x}%`,
                "--point-y": `${skill.position.y}%`,
                "--mobile-x": `${skill.mobilePosition.x}%`,
                "--mobile-y": `${skill.mobilePosition.y}%`,
              } as CSSProperties
            }
            aria-label={`${skill.name}: ${skill.description}`}
            aria-pressed={activeId === skill.id}
            onPointerEnter={(event) => {
              if (event.pointerType !== "touch") setActiveId(skill.id);
            }}
            onFocus={() => setActiveId(skill.id)}
            onClick={() => setActiveId(skill.id)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setActiveId(null);
            }}
          >
            <span className="constellation-label" aria-hidden="true">
              {skill.name}
            </span>
          </button>
        ))}
      </div>
      <div
        className="constellation-detail"
        aria-live="polite"
        aria-atomic="true"
      >
        <p className="skill-name">
          {active ? active.name : "Every point has a purpose."}
        </p>
        <div>
          <p>
            {active
              ? active.description
              : "Explore the connections between the tools and ideas behind the work."}
          </p>
        </div>
      </div>
      <details className="skill-list">
        <summary>View skills as a list</summary>
        <dl>
          {skills.map((skill) => (
            <div key={skill.id}>
              <dt>{skill.name}</dt>
              <dd>{skill.description}</dd>
            </div>
          ))}
        </dl>
      </details>
    </div>
  );
}
