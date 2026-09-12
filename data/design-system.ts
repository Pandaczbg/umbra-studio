export const umbraColors = {
  background: "#030303",
  surface: "#070707",
  surfaceElevated: "#0B0B0A",

  textPrimary: "#F1EDE4",
  textSecondary: "rgba(241,237,228,0.58)",
  textMuted: "rgba(241,237,228,0.34)",
  textFaint: "rgba(241,237,228,0.16)",

  gold: "#C7A96B",
  goldLight: "#EAD39A",
  goldSoft: "rgba(199,169,107,0.18)",
  goldFaint: "rgba(199,169,107,0.07)",

  border: "rgba(255,255,255,0.07)",
  borderStrong: "rgba(255,255,255,0.11)",
  borderGold: "rgba(199,169,107,0.34)",
} as const;

export const umbraTypography = {
  display: {
    fontFamily: "var(--font-geist-sans)",
    fontWeight: 430,
    letterSpacing: "-0.064em",
    lineHeight: 0.88,
  },

  heading: {
    fontFamily: "var(--font-geist-sans)",
    fontWeight: 430,
    letterSpacing: "-0.05em",
    lineHeight: 0.92,
  },

  body: {
    fontFamily: "var(--font-geist-sans)",
    fontWeight: 400,
    letterSpacing: "-0.004em",
    lineHeight: 1.75,
  },

  meta: {
    fontFamily: "var(--font-geist-sans)",
    fontWeight: 600,
    letterSpacing: "0.30em",
    lineHeight: 1,
    textTransform: "uppercase" as const,
  },

  data: {
    fontFamily: "var(--font-geist-mono)",
    fontWeight: 500,
    letterSpacing: "0.16em",
    lineHeight: 1,
  },
} as const;

export const umbraMotion = {
  durations: {
    instant: 0.18,
    fast: 0.3,
    normal: 0.5,
    reveal: 0.8,
    cinematic: 1.05,
    slow: 1.5,
  },

  ease: {
    standard: [0.22, 1, 0.36, 1] as const,
    smooth: [0.16, 1, 0.3, 1] as const,
    soft: [0.25, 0.1, 0.25, 1] as const,
  },

  parallax: {
    background: 32,
    atmosphere: 13,
    content: 3.5,
    card: 7,
  },

  hover: {
    imageScale: 1.035,
    lift: -4,
  },
} as const;

export const umbraLayout = {
  maxWidth: "1500px",

  pagePadding: {
    mobile: "24px",
    tablet: "40px",
    desktop: "64px",
  },

  sectionSpacing: {
    mobile: "112px",
    tablet: "136px",
    desktop: "176px",
  },

  radius: {
    small: "0px",
    medium: "0px",
    large: "0px",
  },
} as const;

export const umbraRules = {
  /*
   * Gold is a signal, never a decoration.
   */
  goldUsage: [
    "brand",
    "active-state",
    "important-metadata",
    "cta",
    "progress",
    "interaction",
    "micro-detail",
  ] as const,

  /*
   * Never use gold randomly inside large headlines.
   */
  headlineGoldAllowed: false,

  /*
   * Motion should create hierarchy and depth,
   * never visual noise.
   */
  excessiveMotionAllowed: false,

  /*
   * Large visual content should remain readable
   * before decorative effects are applied.
   */
  readabilityFirst: true,
} as const;
