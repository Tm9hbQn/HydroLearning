# Pedagogical & UX Needs Analysis

## 1. User Personas

### A. The Hydrotherapy Student ("Noa")
*   **Background:** Physiotherapy student, knows anatomy well, but finds physics counter-intuitive.
*   **Pain Point:** Cannot "see" water pressure or buoyancy. Struggles to understand why a patient feels lighter or why it's harder to move fast.
*   **Goal:** Connect the math (Formulas) to the feeling (Clinical application).
*   **Needs:**
    *   **Visual Feedback:** Needs to *see* the vector change when she changes the speed of movement.
    *   **Safe Experimentation:** Wants to "break" the bone virtually to understand limits without hurting anyone.
    *   **bite-sized theory:** Cannot digest walls of text. Needs "Just-in-Time" learning.

### B. The Clinical Instructor ("David")
*   **Background:** 15 years experience, uses metaphors ("Walk like you're in honey").
*   **Pain Point:** Students memorize definitions but fail to apply them in the pool.
*   **Goal:** A tool that proves his metaphors are physically correct.
*   **Needs:**
    *   **Clinical Pearls:** Specific tips he can point to (e.g., "See? This is why we use slow movements for spasticity").
    *   **Data Comparisons:** Ability to show "Land vs. Water" side-by-side.

## 2. The "Atomic Unit" Strategy
To transform the current "Stack of Demos" into a Course, we must break content into **Atomic Blocks**:

1.  **Theory Block:**
    *   Rich text with embedded definitions.
    *   *Example:* "Hydrostatic Pressure increases by 1 ATM every 10 meters."
2.  **Interactive Tool Block:**
    *   The "Feature" itself (e.g., PascalLab).
    *   Must be state-preservable (remember the slider position).
3.  **Clinical Pearl Block (The "Why"):**
    *   Highlighted callouts linking physics to therapy.
    *   *Example:* "Due to this pressure gradient, immersion is an excellent tool for treating lower limb edema."
4.  **Simulation Challenge Block:**
    *   A prompt requiring tool interaction.
    *   *Example:* "Adjust the depth to 1.5m. What is the pressure at the ankles?"

## 3. Micro-Learning & Contextual Overlays
*   **The "Split-Screen" Problem:** Students shouldn't scroll away from the tool to read the instructions.
*   **Solution: The Context Panel.**
    *   **Layout:** On Desktop, split screen (Content Left, Tool Right). On Mobile, "Drawer" or "Overlay" mode.
    *   **Scrollytelling:** As the student scrolls through the *Theory Blocks* (Left), the *Tool* (Right) automatically updates its state to illustrate the point.
        *   *Scenario:* User reads "At chest depth...", the PascalLab slider auto-animates to 1.4m.

## 4. UI Requirements for "Clinical" Feel
*   **Color Palette:** Clean Blues/Cyans (Water) + Sterile White/Grey (Medical) + Alert Red/Orange (Warnings/Forces).
*   **Typography:** High legibility, sans-serif. Numbers must be monospaced or tabular for readability.
*   **Feedback:** Haptic or visual "snap" when reaching critical values (e.g., "Bone Fracture Point").
