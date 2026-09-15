import type { Skill } from "@/types/skill";

export function drawConstellation(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  skills: Skill[],
  activeId: string | null,
  mobile: boolean,
  accent: string,
) {
  context.clearRect(0, 0, width, height);
  const point = (skill: Skill) => {
    const position = mobile ? skill.mobilePosition : skill.position;
    return { x: (position.x * width) / 100, y: (position.y * height) / 100 };
  };
  const drawnEdges = new Set<string>();

  for (const skill of skills) {
    const from = point(skill);
    for (const id of skill.connectsTo) {
      const target = skills.find((candidate) => candidate.id === id);
      if (!target) continue;
      const edgeKey = [skill.id, target.id].sort().join(":");
      if (drawnEdges.has(edgeKey)) continue;
      drawnEdges.add(edgeKey);

      const to = point(target);
      const active = skill.id === activeId || id === activeId;
      const crossesGroup = skill.group !== target.group;
      context.strokeStyle = active ? accent : "#8492B2";
      context.globalAlpha = active ? 0.88 : crossesGroup ? 0.13 : 0.3;
      context.lineWidth = active ? 1.35 : 0.85;
      context.setLineDash(crossesGroup && !active ? [3, 6] : []);
      context.beginPath();
      context.moveTo(from.x, from.y);
      context.lineTo(to.x, to.y);
      context.stroke();
    }
  }
  context.setLineDash([]);
  context.globalAlpha = 1;
  for (const [index, skill] of skills.entries()) {
    const { x, y } = point(skill);
    const selected = skill.id === activeId;
    const starScale = 0.9 + (index % 4) * 0.07;
    const glowRadius = selected ? 20 : 8 * starScale;
    const glow = context.createRadialGradient(x, y, 0, x, y, glowRadius);
    glow.addColorStop(0, `${accent}${selected ? "A0" : "42"}`);
    glow.addColorStop(1, `${accent}00`);
    context.fillStyle = glow;
    context.beginPath();
    context.arc(x, y, glowRadius, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = accent;
    context.beginPath();
    context.arc(x, y, selected ? 3.8 : 2.15 * starScale, 0, Math.PI * 2);
    context.fill();
    if (selected) {
      context.strokeStyle = accent;
      context.beginPath();
      context.arc(x, y, 12, 0, Math.PI * 2);
      context.stroke();
    }
  }
}
