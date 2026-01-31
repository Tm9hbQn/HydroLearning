# AI Governance Rules (Agent Protocol)

## 1. Core Mandates
*   **Architectural Integrity:** You must adhere to the Blueprints defined in `docs/ARCHITECTURE.md`. Do not invent new patterns without updating the blueprint first.
*   **Documentation First:** Before writing code, you must update the relevant documentation. If you change a component, update its docstring. If you change the architecture, update `ARCHITECTURE.md`.
*   **Memory Persistence:** You must read `docs/SESSION_LOG.md` at the start of your session to understand the context. You must append a summary of your actions to it at the end.

## 2. Coding Standards
*   **Strict Types:** `any` is forbidden unless strictly necessary (and commented). Use interfaces defined in `src/types/`.
*   **Tailwind CSS:** Use utility classes. Avoid custom CSS files unless doing complex animations not possible with Tailwind.
*   **Atomic Components:** Keep components small. If a component exceeds 200 lines, consider breaking it up.
*   **Internationalization:** Never hardcode text. Always use `t('key')` and add the string to `src/locales/he.json`.

## 3. Workflow Protocol
1.  **Plan:** State your plan clearly using the `set_plan` tool.
2.  **Verify:** After every file write, read it back to ensure correctness.
3.  **Test:** Run `npm test` before submitting.
4.  **Log:** Update `docs/SESSION_LOG.md`.

## 4. Specific to HydroLearning
*   **Physics Accuracy:** When touching simulation code (`src/features/*`), ensure the math is physically plausible (even if simplified).
*   **Clinical Tone:** Text added to the system must be professional, clinical, yet accessible to students.
