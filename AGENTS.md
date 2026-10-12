# Instructions for continuing this project

Read docs/HANDOFF.md, docs/CONVERSATION_CONTEXT.md, PROJECT_SPEC.md, DATA_MODEL.md,
and ROADMAP.md before changing direction. Read docs/VALIDATION.md for actual checks.

- This is a scenario-based Deadlock item advisor, not a hero-to-item lookup or a giant infographic.
- The user values continuity. Preserve decisions and explain material changes in docs/DECISIONS.md.
- Use React + TypeScript + Vite; keep the MVP static and compatible with GitHub Pages.
- Keep mechanics, patch data, evidence, and scoring configuration outside UI components.
- Never turn the user's example interactions into verified facts without checking current sources.
- Never infer an item's current category, cost, activation, or mechanics from memory alone.
- Keep synthetic fixtures unmistakable and excluded from production recommendations.
- Recommend separately for Survive / Disrupt / Punish and Buy now / Save for later.
- Build fit is a soft preference. Utility may justify a weapon item on a spirit build.
- Do not imply cleanse, dispel, debuff resistance, interrupts, damage reduction, immunity,
  healing reduction, and execute prevention are interchangeable.
- Prefer deterministic, explainable recommendation rules for MVP. Do not require an LLM at runtime.
- Show verified limits, activation timing, uncertainty, and what an item does NOT solve.
- Preserve item-category colors and separate active/conditional/passive labels accessibly.
- Run npm run check after changes to the engine or data. Add focused behavioral tests.
- Update docs/HANDOFF.md and docs/VALIDATION.md before ending substantial work.
- No production data or live deployment exists in this initial handoff.
