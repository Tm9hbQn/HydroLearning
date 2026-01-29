# מסמך אפיון מערכת הוליסטי (System Blueprint)

## 1. הקדמה ומטרת המסמך
מסמך זה נוצר כדי לשמש כ"מוח" המרכזי עבור כל יישות תבונית (אנושית או מלאכותית) הניגשת לעבוד על פרויקט **HydroLearning**.
המטרה היא לספק הבנה עמוקה, אטומית והוליסטית של המערכת כפי שהיא קיימת היום, כדי לאפשר שדרוג עתידי למערכת ניהול למידה (LMS) דינמית.

האתר כרגע הוא פלטפורמה אינטראקטיבית להוראת מקצועות השיקום (Rehabilitation Sciences), המתמקדת בויזואליזציה של כוחות פיזיקליים ותהליכים פיזיולוגיים.

---

## 2. המבנה הטכנולוגי (Tech Stack)
המערכת בנויה כ-Single Page Application (SPA) מודרני, ללא צד-שרת (Serverless/Static) בשלב זה.

*   **Core Framework**: React 18
*   **Build Tool**: Vite (מהיר, ESM-based).
*   **Language**: TypeScript (בשימוש קפדני, Strong Typing).
*   **Styling**: Tailwind CSS (Utility-first). נעשה שימוש ב-`clsx` ו-`tailwind-merge` למניעת התנגשויות מחלקות.
*   **Animations**: Framer Motion (עבור מעברים חלקים) ו-CSS Transitions בסיסיים.
*   **Visualization**: Chart.js (גרפים), SVG מניפולציות ישירות (עבור ה-Labs).
*   **Routing**: React Router DOM (HashRouter - לטובת תאימות GitHub Pages).
*   **Internationalization**: i18next (ניהול טקסטים בקבצי JSON נפרדים).
*   **State Management**:
    *   **Local**: `useState` בתוך הקומפוננטות (מועדף כרגע).
    *   **Global**: קיימת תלות ב-`zustand` אך אינה בשימוש פעיל כרגע בלוגיקה המרכזית.

---

## 3. ארכיטקטורת המערכת (Architecture)
הפרויקט בנוי לפי עקרון **Feature-Based Architecture**. זהו עקרון מפתח להבנת המערכת.

### מבנה התיקיות
```
src/
├── features/           # הליבה של האפליקציה. כל תיקייה כאן היא "יחידת לימוד" עצמאית.
│   ├── pascal-lab/     # מעבדת חוק פסקל
│   ├── drag-force/     # סימולטור כוח גרר
│   └── ...
├── components/         # רכיבי UI גנריים
│   ├── ui/             # אטומים: Button, Slider, Card
│   └── ...
├── lib/                # קוד תשתיתי (utils, i18n setup)
├── pages/              # דפים המרכיבים את ה-Routing (כרגע Dashboard ראשי)
├── layouts/            # מעטפת האתר (Header, Footer)
└── locales/            # קבצי תרגום (he.json)
```

### עקרון "האטומים והמולקולות"
1.  **אטומים (`src/components/ui`)**: רכיבים טיפשים שרק מציגים מידע או מקבלים קלט. דוגמה: `Slider.tsx` יודע רק לקבל `value` ו-`onChange`. הוא לא יודע שהוא שולט על גובה המים.
2.  **מולקולות/יחידות (`src/features`)**: כאן מתבצע החיבור. קומפוננטת `PascalLab` מחזיקה את ה-State של המים, ומעבירה אותו ל-Slider (קלט) ול-SVG (פלט ויזואלי).

---

## 4. ניהול מידע וזרימת נתונים (Data Flow)

### 4.1. State (מצב)
כרגע, ה-State הוא **Ephemeral** (חולף).
*   כאשר משתמש מזיז סליידר ב-`PascalLab`, המשתנה `waterLevel` מתעדכן מקומית באמצעות `useState`.
*   אין שמירה ל-DB או ל-LocalStorage. ריענון הדף מאפס את הסימולציה.
*   **משמעות ל-LMS עתידי**: כדי להפוך את המערכת ל"זוכרת", נצטרך להוציא את ה-Initial State מתוך הקוד (`useState(0)`) ולהפוך אותו ל-Prop שמגיע ממערכת ניהול חיצונית או מקובץ קונפיגורציה.

### 4.2. תוכן (Content)
כל הטקסטים (כותרות, הסברים, תוויות) מנוהלים דרך `src/locales/he.json`.
*   הקומפוננטות משתמשות ב-Hook `useTranslation`.
*   **משמעות ל-LMS עתידי**: מבנה זה מצוין ומאפשר לטעון "חבילות שפה" או "חבילות תוכן" דינמיות בעתיד בקלות, ללא שינוי קוד.

---

## 5. צלילה לעומק הפיצ'רים (Feature Deep Dive)
כדי שמכונה תוכל לשכתב או להרחיב את המערכת, עליה להבין איך "מעבדה" עובדת. ניקח את **PascalLab** כמקרה בוחן (Case Study):

### Case Study: PascalLab
1.  **הלוגיקה הפיזיקלית**:
    *   משתנה: `waterLevel` (גובה המים במטרים).
    *   קבועים: `RHO` (צפיפות מים = 1000), `G` (כבידה = 9.81).
    *   חישוב: `Pressure = RHO * G * (waterLevel - heightOfSensor)`.
2.  **הויזואליזציה**:
    *   שימוש ב-SVG בתוך ה-JSX.
    *   אלמנטים ב-SVG (כמו `rect` או `line` שמייצג חץ) מקבלים מאפיינים התלויים ישירות בתוצאת החישוב.
    *   לדוגמה: רוחב החץ (`strokeWidth`) גדל ככל שהלחץ גדל.
3.  **האינטראקציה**:
    *   `Slider` מעדכן את `waterLevel`. השינוי מחלחל מיד לחישובים ול-SVG (React Reactivity).

שאר המעבדות (DragForce, Fracture, וכו') פועלות על אותו עיקרון: **Input -> State -> Math -> Visualization**.

---

## 6. הכנה למערכת למידה דינמית (Future LMS Transformation)
כדי להפוך את האתר הזה ממקבורה של "דמואים סטטיים" למערכת למידה, נדרש השינוי המחשבתי הבא:

### מ-Hardcoded ל-Configuration Driven
כיום, הקוד נראה כך (פסאודו-קוד):
```typescript
function PascalLab() {
  const [level, setLevel] = useState(0); // הנתונים "כלואים" בקומפוננטה
  return <Slider value={level} ... />
}
```

בעתיד, המבנה צריך להיות:
```typescript
interface LabConfig {
  initialValue: number;
  max: number;
  physicsConstants: { rho: number };
}

function PascalLab({ config, onComplete }: { config: LabConfig, ... }) {
  const [level, setLevel] = useState(config.initialValue);
  // ...
  if (level > target) onComplete(); // תקשורת החוצה למערכת הלמידה
}
```

### המלצות למימוש:
1.  **הגדרת JSON סכמה ליחידת לימוד**: כל יחידה צריכה להגדיר מה הפרמטרים שלה.
2.  **מערכת אירועים (Event Bus)**: רכיב שיאזין להצלחות המשתמש (למשל: "המשתמש הגיע ללחץ של 5000Pa") וישמור את ההתקדמות.
3.  **הזרקת תוכן**: הטקסטים לא צריכים להיות רק ב-`he.json` אלא יכולים להגיע מ-API שמגדיר את "סיפור השיעור".

## 7. סיכום
המערכת במצבה הנוכחי היא **Solid Foundation**. הקוד נקי, מחולק היטב, ומבוסס על סטנדרטים מודרניים. המעבר למערכת דינמית לא דורש שכתוב (Rewrite) אלא "עטיפה" (Wrapping) של הקומפוננטות הקיימות וניתוק התלות שלהן ב-State מקומי בלבד לטובת State שמוזרק מבחוץ.
