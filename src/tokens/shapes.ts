import {
  MaterialShapes,
  roundedPolygonToPath,
  Morph,
  morphToPath,
  animateMorph,
  type RoundedPolygon,
  type MorphAnimation,
  type MorphAnimationOptions,
} from 'material-shapes-ts';

export {
  MaterialShapes,
  roundedPolygonToPath,
  Morph,
  morphToPath,
  animateMorph,
};
export type { RoundedPolygon, MorphAnimation, MorphAnimationOptions };

export type ExpressiveShapeName =
  | 'circle'
  | 'square'
  | 'slanted'
  | 'arch'
  | 'semicircle'
  | 'oval'
  | 'pill'
  | 'triangle'
  | 'arrow'
  | 'fan'
  | 'diamond'
  | 'clamshell'
  | 'pentagon'
  | 'gem'
  | 'very-sunny'
  | 'verySunny'
  | 'sunny'
  | '4-sided-cookie'
  | 'four-sided-cookie'
  | 'fourSidedCookie'
  | '6-sided-cookie'
  | 'six-sided-cookie'
  | 'sixSidedCookie'
  | '7-sided-cookie'
  | 'seven-sided-cookie'
  | 'sevenSidedCookie'
  | '9-sided-cookie'
  | 'nine-sided-cookie'
  | 'nineSidedCookie'
  | '12-sided-cookie'
  | 'twelve-sided-cookie'
  | 'twelveSidedCookie'
  | '4-leaf-clover'
  | 'four-leaf-clover'
  | 'fourLeafClover'
  | '8-leaf-clover'
  | 'eight-leaf-clover'
  | 'eightLeafClover'
  | '8-cookie'
  | 'eight-cookie'
  | '8-sided-cookie'
  | 'eight-sided-cookie'
  | 'eightSidedCookie'
  | 'burst'
  | 'soft-burst'
  | 'softBurst'
  | 'boom'
  | 'soft-boom'
  | 'softBoom'
  | 'flower'
  | 'puffy'
  | 'puffy-diamond'
  | 'puffyDiamond'
  | 'ghost-ish'
  | 'ghostIsh'
  | 'pixel-circle'
  | 'pixelCircle'
  | 'pixel-triangle'
  | 'pixelTriangle'
  | 'bun'
  | 'heart';

export interface ShapeDefinition {
  name: string;
  label: string;
  pathData: string;
  clipPath: string;
  borderRadius?: string;
}

const RAW_SHAPE_ENTRIES: Array<[string, string, RoundedPolygon]> = [
  ['circle', 'Circle', MaterialShapes.Circle],
  ['square', 'Square', MaterialShapes.Square],
  ['slanted', 'Slanted', MaterialShapes.Slanted],
  ['arch', 'Arch', MaterialShapes.Arch],
  ['semicircle', 'Semicircle', MaterialShapes.SemiCircle],
  ['oval', 'Oval', MaterialShapes.Oval],
  ['pill', 'Pill', MaterialShapes.Pill],
  ['triangle', 'Triangle', MaterialShapes.Triangle],
  ['arrow', 'Arrow', MaterialShapes.Arrow],
  ['fan', 'Fan', MaterialShapes.Fan],
  ['diamond', 'Diamond', MaterialShapes.Diamond],
  ['clamshell', 'Clamshell', MaterialShapes.ClamShell],
  ['pentagon', 'Pentagon', MaterialShapes.Pentagon],
  ['gem', 'Gem', MaterialShapes.Gem],
  ['very-sunny', 'Very sunny', MaterialShapes.VerySunny],
  ['sunny', 'Sunny', MaterialShapes.Sunny],
  ['4-sided-cookie', '4-sided cookie', MaterialShapes.Cookie4Sided],
  ['6-sided-cookie', '6-sided cookie', MaterialShapes.Cookie6Sided],
  ['7-sided-cookie', '7-sided cookie', MaterialShapes.Cookie7Sided],
  ['9-sided-cookie', '9-sided cookie', MaterialShapes.Cookie9Sided],
  ['12-sided-cookie', '12-sided cookie', MaterialShapes.Cookie12Sided],
  ['4-leaf-clover', '4-leaf clover', MaterialShapes.Clover4Leaf],
  ['8-leaf-clover', '8-leaf clover', MaterialShapes.Clover8Leaf],
  ['burst', 'Burst', MaterialShapes.Burst],
  ['soft-burst', 'Soft burst', MaterialShapes.SoftBurst],
  ['boom', 'Boom', MaterialShapes.Boom],
  ['soft-boom', 'Soft boom', MaterialShapes.SoftBoom],
  ['flower', 'Flower', MaterialShapes.Flower],
  ['puffy', 'Puffy', MaterialShapes.Puffy],
  ['puffy-diamond', 'Puffy diamond', MaterialShapes.PuffyDiamond],
  ['ghost-ish', 'Ghost-ish', MaterialShapes.Ghostish],
  ['pixel-circle', 'Pixel circle', MaterialShapes.PixelCircle],
  ['pixel-triangle', 'Pixel triangle', MaterialShapes.PixelTriangle],
  ['bun', 'Bun', MaterialShapes.Bun],
  ['heart', 'Heart', MaterialShapes.Heart],
];

export const EXPRESSIVE_SHAPE_CATALOG: Record<string, ShapeDefinition> = {};
export const M3_EXPRESSIVE_CATALOG = EXPRESSIVE_SHAPE_CATALOG;

for (const [key, label, shapePolygon] of RAW_SHAPE_ENTRIES) {
  const path = roundedPolygonToPath(shapePolygon);
  EXPRESSIVE_SHAPE_CATALOG[key] = {
    name: key,
    label,
    pathData: path.toSvgPathData(),
    clipPath: `url(#avatar-shape-${key})`,
  };
}

// Aliases mapping
const ALIASES: Record<string, string> = {
  verySunny: 'very-sunny',
  'four-sided-cookie': '4-sided-cookie',
  fourSidedCookie: '4-sided-cookie',
  'six-sided-cookie': '6-sided-cookie',
  sixSidedCookie: '6-sided-cookie',
  'seven-sided-cookie': '7-sided-cookie',
  sevenSidedCookie: '7-sided-cookie',
  'nine-sided-cookie': '9-sided-cookie',
  nineSidedCookie: '9-sided-cookie',
  'twelve-sided-cookie': '12-sided-cookie',
  twelveSidedCookie: '12-sided-cookie',
  'four-leaf-clover': '4-leaf-clover',
  fourLeafClover: '4-leaf-clover',
  'eight-leaf-clover': '8-leaf-clover',
  eightLeafClover: '8-leaf-clover',
  '8-cookie': '8-leaf-clover',
  'eight-cookie': '8-leaf-clover',
  '8-sided-cookie': '8-leaf-clover',
  'eight-sided-cookie': '8-leaf-clover',
  eightSidedCookie: '8-leaf-clover',
  softBurst: 'soft-burst',
  softBoom: 'soft-boom',
  puffyDiamond: 'puffy-diamond',
  ghostIsh: 'ghost-ish',
  pixelCircle: 'pixel-circle',
  pixelTriangle: 'pixel-triangle',
};

for (const [alias, canonicalKey] of Object.entries(ALIASES)) {
  if (EXPRESSIVE_SHAPE_CATALOG[canonicalKey]) {
    EXPRESSIVE_SHAPE_CATALOG[alias] = EXPRESSIVE_SHAPE_CATALOG[canonicalKey];
  }
}

export const ALL_EXPRESSIVE_SHAPES: string[] = [
  'circle',
  'square',
  'slanted',
  'arch',
  'semicircle',
  'oval',
  'pill',
  'triangle',
  'arrow',
  'fan',
  'diamond',
  'clamshell',
  'pentagon',
  'gem',
  'very-sunny',
  'sunny',
  '4-sided-cookie',
  '6-sided-cookie',
  '7-sided-cookie',
  '9-sided-cookie',
  '12-sided-cookie',
  '4-leaf-clover',
  '8-leaf-clover',
  'burst',
  'soft-burst',
  'boom',
  'soft-boom',
  'flower',
  'puffy',
  'puffy-diamond',
  'ghost-ish',
  'pixel-circle',
  'pixel-triangle',
  'bun',
  'heart',
];

export const ALL_35_M3_SHAPES = ALL_EXPRESSIVE_SHAPES;

/**
 * Official Material Design 3 Shape Corner Radius Scale
 * https://m3.material.io/styles/shape/corner-radius-scale
 */
export const M3_SHAPE_CORNERS = {
  none: 0,
  extraSmall: 4,
  small: 8,
  medium: 12,
  large: 16,
  largeIncreased: 20,
  extraLarge: 28,
  extraLargeIncreased: 32,
  extraExtraLarge: 48,
  full: 9999,
} as const;

export const M3_SHAPE_CORNER_STRINGS = {
  none: '0px',
  extraSmall: '4px',
  small: '8px',
  medium: '12px',
  large: '16px',
  largeIncreased: '20px',
  extraLarge: '28px',
  extraLargeIncreased: '32px',
  extraExtraLarge: '48px',
  full: '9999px',
  circular: '50%',
} as const;

export const M3_SHAPE_CSS_VARIABLES = {
  none: 'var(--md-sys-shape-corner-none)',
  extraSmall: 'var(--md-sys-shape-corner-extra-small)',
  small: 'var(--md-sys-shape-corner-small)',
  medium: 'var(--md-sys-shape-corner-medium)',
  large: 'var(--md-sys-shape-corner-large)',
  largeIncreased: 'var(--md-sys-shape-corner-large-increased)',
  extraLarge: 'var(--md-sys-shape-corner-extra-large)',
  extraLargeIncreased: 'var(--md-sys-shape-corner-extra-large-increased)',
  extraExtraLarge: 'var(--md-sys-shape-corner-extra-extra-large)',
  full: 'var(--md-sys-shape-corner-full)',
} as const;

export const SHAPE_SCALE_RADIUS_MAP: Record<string, string> = {
  none: M3_SHAPE_CORNER_STRINGS.none,
  'extra-small': M3_SHAPE_CORNER_STRINGS.extraSmall,
  'extra-small-top': '4px 4px 0 0',
  small: M3_SHAPE_CORNER_STRINGS.small,
  medium: M3_SHAPE_CORNER_STRINGS.medium,
  rounded: M3_SHAPE_CORNER_STRINGS.medium,
  landscape: M3_SHAPE_CORNER_STRINGS.small,
  large: M3_SHAPE_CORNER_STRINGS.large,
  'large-end': '0 16px 16px 0',
  'large-top': '16px 16px 0 0',
  'large-start': '16px 0 0 16px',
  'large-increased': M3_SHAPE_CORNER_STRINGS.largeIncreased,
  'extra-large': M3_SHAPE_CORNER_STRINGS.extraLarge,
  'extra-large-top': '28px 28px 0 0',
  'extra-large-increased': M3_SHAPE_CORNER_STRINGS.extraLargeIncreased,
  'extra-extra-large': M3_SHAPE_CORNER_STRINGS.extraExtraLarge,
  full: M3_SHAPE_CORNER_STRINGS.full,
  circular: M3_SHAPE_CORNER_STRINGS.circular,
  pill: M3_SHAPE_CORNER_STRINGS.full,
  square: M3_SHAPE_CORNER_STRINGS.none,
  cut: '14px 2px 14px 2px',
  asymmetric: '24px 6px 24px 6px',
  biometric: '10px',
};

export const M3_SCALE_RADIUS_MAP = SHAPE_SCALE_RADIUS_MAP;

export interface ResolvedShapeStyle {
  borderRadius: string;
  clipPath?: string;
  pathData?: string;
}

export function resolveShapeStyle(
  shape?: string | number,
  customRadius?: number | string,
): ResolvedShapeStyle {
  if (customRadius !== undefined) {
    const rad =
      typeof customRadius === 'number' ? `${customRadius}px` : customRadius;
    return { borderRadius: rad };
  }
  if (!shape) {
    return { borderRadius: M3_SHAPE_CORNER_STRINGS.medium };
  }
  if (typeof shape === 'number') {
    return { borderRadius: `${shape}px` };
  }

  const expressiveDef = EXPRESSIVE_SHAPE_CATALOG[shape];
  if (expressiveDef) {
    return {
      borderRadius: expressiveDef.borderRadius ?? '0px',
      clipPath: expressiveDef.clipPath,
      pathData: expressiveDef.pathData,
    };
  }

  const scaleRad = SHAPE_SCALE_RADIUS_MAP[shape];
  if (scaleRad) {
    return { borderRadius: scaleRad };
  }

  return { borderRadius: shape };
}

export const resolveM3ShapeStyle = resolveShapeStyle;

export type ChipShape = ExpressiveShapeName | string | number;

export const CHIP_SHAPE_RADIUS_MAP: Record<string, string> = {
  // Standard scales
  none: '0px',
  'extra-small': '4px',
  'extra-small-top': '4px 4px 0 0',
  small: '6px',
  medium: '8px',
  rounded: '8px',
  large: '12px',
  'large-top': '12px 12px 0 0',
  'large-end': '0 12px 12px 0',
  'large-start': '12px 0 0 12px',
  'extra-large': '16px',
  'extra-large-top': '16px 16px 0 0',
  full: '9999px',
  circular: '9999px',
  pill: '9999px',
  oval: '9999px',
  square: '4px',

  // Expressive geometric shape adaptations tailored for horizontal rectangular chips
  asymmetric: '16px 4px 16px 4px',
  arch: '14px 14px 4px 4px',
  bun: '14px 14px 6px 6px',
  cut: '12px 2px 12px 2px',
  slanted: '14px 4px 14px 4px',
  clamshell: '14px 14px 4px 14px',
  fan: '14px 4px 4px 4px',
  gem: '12px 4px 12px 4px',
  diamond: '12px 2px 12px 2px',
  '4-sided-cookie': '12px 6px 12px 6px',
  'four-sided-cookie': '12px 6px 12px 6px',
  foursidedcookie: '12px 6px 12px 6px',
  '6-sided-cookie': '12px 6px 12px 6px',
  'six-sided-cookie': '12px 6px 12px 6px',
  sixsidedcookie: '12px 6px 12px 6px',
  '7-sided-cookie': '12px 6px 12px 6px',
  'seven-sided-cookie': '12px 6px 12px 6px',
  sevensidedcookie: '12px 6px 12px 6px',
  '9-sided-cookie': '12px 6px 12px 6px',
  'nine-sided-cookie': '12px 6px 12px 6px',
  ninesidedcookie: '12px 6px 12px 6px',
  '12-sided-cookie': '12px 6px 12px 6px',
  'twelve-sided-cookie': '12px 6px 12px 6px',
  twelvesidedcookie: '12px 6px 12px 6px',
  'ghost-ish': '14px 14px 4px 4px',
  ghostish: '14px 14px 4px 4px',
  'soft-burst': '12px 4px 12px 4px',
  softburst: '12px 4px 12px 4px',
  'soft-boom': '12px 4px 12px 4px',
  softboom: '12px 4px 12px 4px',
  flower: '12px 6px 12px 6px',
  puffy: '12px 6px 12px 6px',
  'puffy-diamond': '12px 4px 12px 4px',
  puffydiamond: '12px 4px 12px 4px',
  'pixel-circle': '8px',
  pixelcircle: '8px',
  'pixel-triangle': '12px 4px 12px 4px',
  pixeltriangle: '12px 4px 12px 4px',
  semicircle: '14px 14px 0 0',
  heart: '14px 14px 6px 6px',
  sunny: '12px 6px 12px 6px',
  'very-sunny': '12px 6px 12px 6px',
  verysunny: '12px 6px 12px 6px',
  burst: '12px 4px 12px 4px',
  boom: '12px 4px 12px 4px',
  biometric: '8px',
};

export const RECTANGULAR_CHIP_RADIUS_MAP = CHIP_SHAPE_RADIUS_MAP;

export function resolveChipShape(shape?: ChipShape): ResolvedShapeStyle | null {
  if (shape === undefined || shape === null) return null;
  if (typeof shape === 'number') {
    return { borderRadius: `${shape}px` };
  }
  const key = String(shape).toLowerCase().trim();
  const rectangularRadius = CHIP_SHAPE_RADIUS_MAP[key];
  if (rectangularRadius) {
    return { borderRadius: rectangularRadius };
  }
  const expressiveDef =
    EXPRESSIVE_SHAPE_CATALOG[shape] || EXPRESSIVE_SHAPE_CATALOG[key];
  if (expressiveDef) {
    return {
      borderRadius: expressiveDef.borderRadius ?? '0px',
      clipPath: expressiveDef.clipPath,
      pathData: expressiveDef.pathData,
    };
  }
  const scaleRad = SHAPE_SCALE_RADIUS_MAP[key] || SHAPE_SCALE_RADIUS_MAP[shape];
  if (scaleRad) {
    return { borderRadius: scaleRad };
  }
  return { borderRadius: String(shape) };
}

export const getResolvedChipShape = resolveChipShape;

const COMPANY_INSTITUTION_ALIASES = new Set([
  'company',
  'companies',
  'institution',
  'institutions',
  'corporate',
  'business',
  'enterprise',
  'organization',
  'org',
]);

/**
 * Resolves the default chip shape for an institution type:
 * - school: "clamshell"
 * - company/institution: "semicircle"
 * - all / fallback: "pill"
 */
export function getInstitutionChipShape(type?: string | null): ChipShape {
  const norm = (type || '').toLowerCase().trim();
  if (norm === 'all') return 'pill';
  if (COMPANY_INSTITUTION_ALIASES.has(norm)) {
    return 'semicircle';
  }
  return 'clamshell';
}

/**
 * Resolves the default chip shape for segmented chips (including cohorts):
 * MD3 compound / segmented chips default to "pill"
 */
export function getSegmentedChipShape(): ChipShape {
  return 'pill';
}

/**
 * Shape-based avatar system resolver:
 * - student: MD3 pill ("pill")
 * - instructor: Ghost-ish ("ghost-ish")
 * - admin: 9-sided cookie ("9-sided-cookie")
 */
export function getRoleAvatarShape(role?: string | null): ExpressiveShapeName {
  switch (role) {
    case 'admin':
      return '9-sided-cookie';
    case 'instructor':
      return 'ghost-ish';
    case 'student':
    default:
      return 'pill';
  }
}

// --- Centralized Shape Morphing Engine ---

export type ExpressiveMorphOptions = MorphAnimationOptions;

export function getExpressivePolygon(
  shape: ExpressiveShapeName | string | RoundedPolygon,
): RoundedPolygon {
  if (typeof shape === 'object' && shape !== null) return shape;
  const canonical =
    typeof shape === 'string' ? ALIASES[shape] || shape : 'circle';
  const entry = RAW_SHAPE_ENTRIES.find(([k]) => k === canonical);
  return entry ? entry[2] : MaterialShapes.Circle;
}

export function getMorphPath(
  from: ExpressiveShapeName | string | RoundedPolygon,
  to: ExpressiveShapeName | string | RoundedPolygon,
  progress: number,
): string {
  const polyA = getExpressivePolygon(from);
  const polyB = getExpressivePolygon(to);
  const morph = new Morph(polyA, polyB);
  return morphToPath(morph, progress).toSvgPathData();
}

export function animateExpressiveMorph(
  from: ExpressiveShapeName | string | RoundedPolygon,
  to: ExpressiveShapeName | string | RoundedPolygon,
  options: ExpressiveMorphOptions,
): MorphAnimation {
  const polyA = getExpressivePolygon(from);
  const polyB = getExpressivePolygon(to);
  return animateMorph(polyA, polyB, options);
}
