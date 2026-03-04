/* ============================================================
   Back Muscle Anatomy Guide — Data Layer
   ============================================================
   Single source of truth for all muscle content.
   Add muscles here → they appear automatically in the nav,
   the section grid, and the quick-jump chips.
   ============================================================ */

// ── Types ────────────────────────────────────────────────────

export interface StretchMethod {
  title: string;
  equipment: 'ללא ציוד' | 'כיסא' | 'רצועה/מגבת' | 'קיר' | 'מזרן';
  steps: string[];
  duration: string;
}

export interface MuscleImages {
  /** Path to a photo/illustration of the muscle on a regular back view */
  regular_back: string;
  /** Path to an anatomical cross-section or highlight illustration */
  anatomical_cut: string;
}

export interface MuscleData {
  /** Unique slug — used for anchor IDs and quick-jump targets */
  id: string;
  /** Hebrew name shown in the UI */
  name: string;
  /** Latin / anatomical name shown in italics */
  latinName: string;
  /** Hebrew layer label — drives grouping and nav generation */
  layer: string;
  /** CSS key used for colour-coding ('superficial' | 'intermediate' | 'deep') */
  layerId: string;
  /** True → shows chronic-tension badge and contracted-position warning */
  isChronic: boolean;
  /** 1–2 sentence overview in plain Hebrew */
  description: string;
  /** Where in the body the muscle sits */
  location: string;
  /** Range of motion and resistance capabilities */
  actions: string;
  /** The posture/position in which the muscle is maximally contracted */
  contracted_position: string;
  /** Best no-equipment (or minimal-equipment) stretch */
  stretch_basic: StretchMethod;
  /** 2–4 additional stretch / release methods */
  stretch_variants: StretchMethod[];
  /** Image paths — use placeholder strings until real assets arrive */
  images: MuscleImages;
}

export interface LayerMeta {
  /** CSS class key  */
  id: string;
  /** Full Hebrew display name */
  displayName: string;
  /** Emoji icon for the nav */
  icon: string;
  /** Hex colour for dots, borders, numbered badges */
  colorHex: string;
}

// ── Layer Metadata ───────────────────────────────────────────
// Keyed by the Hebrew `layer` string used inside MuscleData.
// Any layer key present in musclesData but absent here will
// render without colour (graceful fallback).

export const LAYER_META: Record<string, LayerMeta> = {
  'שטחית': {
    id: 'superficial',
    displayName: 'שרירים שטחיים',
    icon: '🦾',
    colorHex: '#f97316',
  },
  'אמצעית': {
    id: 'intermediate',
    displayName: 'שכבה אמצעית',
    icon: '⚡',
    colorHex: '#3b82f6',
  },
  'עמוקה': {
    id: 'deep',
    displayName: 'שרירים עמוקים',
    icon: '🔬',
    colorHex: '#8b5cf6',
  },
};

// ── Helper functions ─────────────────────────────────────────

/** Returns unique layer names in the order they first appear in the array. */
export const getUniqueLayers = (muscles: MuscleData[]): string[] => {
  const seen = new Set<string>();
  return muscles.reduce<string[]>((acc, m) => {
    if (!seen.has(m.layer)) { seen.add(m.layer); acc.push(m.layer); }
    return acc;
  }, []);
};

/** Groups muscles into a map keyed by layer name. */
export const groupByLayer = (muscles: MuscleData[]): Record<string, MuscleData[]> =>
  muscles.reduce<Record<string, MuscleData[]>>((acc, m) => {
    (acc[m.layer] ??= []).push(m);
    return acc;
  }, {});

// ── Muscle Data ──────────────────────────────────────────────
// Add more muscles here — one object per muscle.
// The UI re-renders automatically.

export const musclesData: MuscleData[] = [

  /* ─────────────────────────────────────────────────────────
     1. TRAPEZIUS — שטחית
     ───────────────────────────────────────────────────────── */
  {
    id: 'trapezius',
    name: 'טרפז',
    latinName: 'Trapezius',
    layer: 'שטחית',
    layerId: 'superficial',
    isChronic: true,

    description:
      'שריר גדול בצורת יהלום המכסה את הגב העליון — מהצוואר ועד אמצע הגב, ומכתף לכתף. '
      + 'מחולק לשלושה חלקים עם תפקידים שונים. '
      + 'אחד השרירים הנפוצים ביותר לתפיסה ולכאב כרוני, במיוחד אצל אנשים שיושבים הרבה, '
      + 'נמצאים תחת לחץ, או נושאים תיקים כבדים על כתף אחת.',

    location:
      'מתחיל בבסיס הגולגולת (Occipital bone) ולאורך כל עמוד השדרה הצווארי (C1–C7) '
      + 'ועמוד השדרה הגבי (T1–T12). '
      + 'מסתיים בשלושה מקומות: קצה הכתף (אקרומיון), עצם הבריח (Clavicle), '
      + 'ועמוד עצם השכמה (Scapular Spine).',

    actions:
      'חלק עליון: מרים כתפיים (שרוג), מטה את הצוואר הצידה ומסובב ראש. '
      + 'חלק אמצעי: מקרב שכמות זו לזו ("מכניס שכמות לכיס האחורי"). '
      + 'חלק תחתון: מוריד שכמות ומסובב אותן כלפי מעלה — חיוני להרמת יד מעל הראש. '
      + 'תנגודת: גבוהה בטווחים קצרים, אך סיבולת נמוכה יחסית — '
      + 'הוא "ייצא" ראשון תחת עומס ממושך ויתחיל לכאוב.',

    contracted_position:
      'כתפיים מורמות לכיוון האוזניים + צוואר מוטה קלות לצד — "תנוחת הטלפון". '
      + 'כאשר אנחנו מחזיקים טלפון בין הכתף לאוזן, '
      + 'או יושבים עם כתפיים מכווצות מול מחשב, הטרפז נמצא בכיווץ מקסימלי כרוני.',

    stretch_basic: {
      title: 'הטיית צוואר עם עיגון כתף',
      equipment: 'ללא ציוד',
      steps: [
        'שב/י זקוף על כיסא, ידיים רפויות על הברכיים',
        'הנמך/י בכוונה את כתפך הימנית — כמו שמישהו לוחץ עליה בעדינות מטה',
        'הטה/י ברכה את ראשך שמאלה, כאילו אתה/את מנסה לגעת באוזן בכתף',
        'הוסף/י לחץ עדין עם יד שמאל על הראש — משקל יד בלבד, בלי משיכה',
        'בשאיפה — החזק/י; בנשיפה — תן/י לתחושת המתיחה להתעמק בלי מאמץ',
        'שמור/י כתף ימין מוּנמכת לכל אורך המתיחה — זה החלק הכי חשוב',
      ],
      duration: '30–45 שניות × 3 חזרות לכל צד',
    },

    stretch_variants: [
      {
        title: 'מתיחה עם יד מאחורי הגב',
        equipment: 'ללא ציוד',
        steps: [
          'עמוד/י זקוף',
          'הכנס/י את יד ימין מאחורי הגב (כמו להגיע לרוכסן עליון)',
          'עם יד שמאל, אחוז/י בפרק יד ימין ומשוך/י קלות שמאלה-מטה',
          'בו-זמנית הטה/י ראשך שמאלה — תחוש/י מתיחה עמוקה יותר ממנח 1',
        ],
        duration: '30 שניות × 2 חזרות לכל צד',
      },
      {
        title: 'הנמכה אקטיבית + הטיה',
        equipment: 'ללא ציוד',
        steps: [
          'עמוד/י זקוף, ידיים לצד הגוף',
          '"שלח/י" את כתפך הימנית ישר מטה בכוונה — כאילו אתה/את מנסה לגעת ברצפה',
          'שמור/י הנמכה זו ובמקביל הטה/י ראש שמאלה',
          'זוהי המתיחה "הנקייה" ביותר — שולטת בשני קצות השריר בו-זמנית',
        ],
        duration: '20 שניות × 4 חזרות',
      },
      {
        title: 'מתיחה עם מגבת',
        equipment: 'רצועה/מגבת',
        steps: [
          'גלגל/י מגבת ארוכה לרכס וסבב/י סביב הצוואר',
          'החזק/י את שני קצות המגבת — אחד בכל יד',
          'משוך/י את שני הקצות קדימה-מטה בצורה שווה',
          'תן/י לראש "לתלות" קדימה בשליטה — הסנטר נע לכיוון החזה',
          'שלוט/שלטי בעוצמה דרך אחיזת המגבת, לא דרך שרירי הצוואר',
        ],
        duration: '20–30 שניות × 3 חזרות',
      },
    ],

    images: {
      regular_back: '/images/muscles/trapezius-back.jpg',
      anatomical_cut: '/images/muscles/trapezius-anatomy.jpg',
    },
  },

  /* ─────────────────────────────────────────────────────────
     2. ERECTOR SPINAE — עמוקה
     ───────────────────────────────────────────────────────── */
  {
    id: 'erector-spinae',
    name: 'זוקפי הגב',
    latinName: 'Erector Spinae',
    layer: 'עמוקה',
    layerId: 'deep',
    isChronic: true,

    description:
      'שלושה עמודי שרירים הרצים לאורך כל עמוד השדרה — מהאגן עד בסיס הגולגולת. '
      + 'הם המנוע המרכזי של הגב: שומרים עלינו זקופים ומאפשרים כל כיפוף ויישור. '
      + 'כאב "קלאסי" בגב תחתון — הרגשת "נוקשות" שמחמירה בבוקר — '
      + 'נובע לרוב מהם.',

    location:
      'שלושה שרירים נפרדים: Iliocostalis (חיצוני — מהאגן לצלעות), '
      + 'Longissimus (אמצעי — הארוך ביותר בגוף, מגיע עד גולגולת), '
      + 'Spinalis (פנימי — צמוד לחוליות). '
      + 'כולם ממוקמים משני צדי עמוד השדרה, מה-Sacrum (עצם הזנב) '
      + 'ורכס הכסל (Iliac crest) ועד לבסיס הגולגולת.',

    actions:
      'יישור עמוד השדרה לאחור (Extension) — זה מה שמחזיר אותנו לעמידה זקופה אחרי כיפוף. '
      + 'כיפוף הגב הצידה (Lateral Flexion). '
      + 'סיוע בסיבוב הגו. '
      + 'עובדים ברציפות: בכל עמידה, ישיבה, ונשיאת עומס. '
      + 'תנגודת: גבוהה מאוד — יכולים להרים עומסים כבדים. '
      + 'סיבולת: בינונית — ישיבה ממושכת מחלישה ומקצרת אותם.',

    contracted_position:
      'גב מיושר לאחור מעבר לניטרל (Hyperextension) — '
      + 'תנוחת "קוברה" ביוגה, או עמידה עם קשת מוגזמת בגב התחתון (Hyperlordosis). '
      + 'אנשים שישנים על הבטן לעיתים קרובות מחזיקים אותם מכווצים שעות בלילה.',

    stretch_basic: {
      title: 'ברכיים לחזה — מתיחה בסיסית',
      equipment: 'מזרן',
      steps: [
        'שכב/י על הגב על משטח נוח ושטוח',
        'כופף/י שתי ברכיים ומשוך/י אותן לכיוון החזה',
        'אחוז/י בשתי ידיים מתחת לברכיים (לא מעל הברך!)',
        'בנשיפה — הקרב/י ברכיים עוד קלות לחזה, בשאיפה — שמור/י',
        'נדנד/י בעדינות מצד לצד — מעסה את שרירי היישר לאורך עמוד השדרה',
        'שמור/י גב תחתון שטוח ורפוי לרצפה לכל אורך המתיחה',
      ],
      duration: '45–60 שניות × 3 חזרות',
    },

    stretch_variants: [
      {
        title: "תנוחת הילד (Child's Pose)",
        equipment: 'מזרן',
        steps: [
          'התחל/י על ארבע — ידיים מתחת לכתפיים, ברכיים מתחת לאגן',
          'שב/י לאחור לעקביים תוך הושטת ידיים רחוק קדימה על הרצפה',
          'תן/י למצח לשקוע לכיוון הרצפה, כתפיים רפויות',
          'פרוש/י אצבעות ידיים רחבות — מאריך את הגב עוד יותר',
          'נשום/י לגב: בשאיפה תחוש/י את הגב "מתנפח", בנשיפה — "שוקע"',
        ],
        duration: '45 שניות × 2 חזרות',
      },
      {
        title: 'חתול-פרה (Cat-Cow)',
        equipment: 'מזרן',
        steps: [
          'התחל/י על ארבע — ידיים מתחת לכתפיים, ברכיים מתחת לאגן',
          'בשאיפה (פרה): הורד/י בטן, הרם/י ראש ואגן — קשת כלפי מטה',
          'בנשיפה (חתול): עגל/י גב מלמעלה למטה, הורד/י ראש ואגן',
          'עבור/י לאט בין שתי התנוחות — שים/שימי לב לאזורים "תקועים"',
          'שהה/שהי שנייה-שתיים בכל נקודה של תחושת נוקשות',
        ],
        duration: '10 חזרות איטיות × 3 סטים',
      },
      {
        title: 'כיפוף קדמי עמוד',
        equipment: 'ללא ציוד',
        steps: [
          'עמוד/י זקוף, ידיים לצד הגוף',
          'כוף/פי ראש קדימה לאט — "גלגל" את עמוד השדרה מלמעלה למטה',
          'המשך/י: סנטר לחזה ← גב עליון ← גב תחתון — כל קטע בנפרד',
          'תן/י לידיים לתלות בכבידה, ברכיים קלות בכיפוף (לא נעולות)',
          'עצור/י 3–5 שניות בנקודות שמרגישות "תקועות" ונשום/י לתוכן',
          'חזור/חזרי לאחור לאט — חוליה אחר חוליה — אל תתרומם/י בבת אחת',
        ],
        duration: '30 שניות × 2 חזרות',
      },
    ],

    images: {
      regular_back: '/images/muscles/erector-spinae-back.jpg',
      anatomical_cut: '/images/muscles/erector-spinae-anatomy.jpg',
    },
  },
];
