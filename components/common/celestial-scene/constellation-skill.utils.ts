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
  for (const skill of skills) {
    const from = point(skill);
    for (const id of skill.connectsTo) {
      const target = skills.find((candidate) => candidate.id === id);
      if (!target) continue;
      const to = point(target);
      context.strokeStyle =
        skill.id === activeId || id === activeId ? accent : "#7585A8";
      context.globalAlpha =
        skill.id === activeId || id === activeId ? 0.85 : 0.42;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(from.x, from.y);
      context.lineTo(to.x, to.y);
      context.stroke();
    }
  }
  context.globalAlpha = 1;
  for (const skill of skills) {
    const { x, y } = point(skill);
    const selected = skill.id === activeId;
    const glow = context.createRadialGradient(
      x,
      y,
      0,
      x,
      y,
      selected ? 20 : 10,
    );
    glow.addColorStop(0, `${accent}${selected ? "A0" : "50"}`);
    glow.addColorStop(1, `${accent}00`);
    context.fillStyle = glow;
    context.beginPath();
    context.arc(x, y, selected ? 20 : 10, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = accent;
    context.beginPath();
    context.arc(x, y, selected ? 3.8 : 2.6, 0, Math.PI * 2);
    context.fill();
    if (selected) {
      context.strokeStyle = accent;
      context.beginPath();
      context.arc(x, y, 12, 0, Math.PI * 2);
      context.stroke();
    }
  }
}
