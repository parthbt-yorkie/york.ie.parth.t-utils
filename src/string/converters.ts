/**
 * @file converters.ts
 * @description
 * This file contains explicit string case conversion functions supporting
 * 9 different case styles and all their pairwise conversions (81 functions),
 * plus additional roundtrip safe conversions and helper utilities.
 *
 * Supported Cases:
 * - camelCase
 * - PascalCase
 * - snake_case
 * - SCREAMING_SNAKE_CASE
 * - kebab-case
 * - dot.case
 * - path/case
 * - UPPERCASE
 * - lowercase
 *
 * Each function accepts `string | null | undefined` and returns an empty string if input is nullish.
 *
 * Usage example:
 * ```
 * import { camelToSnake } from '@york.ie.parth.t/utils';
 * camelToSnake('myVariableName'); // 'my_variable_name'
 * ```
 */

type NullableString = string | null | undefined;

/** Utility: Safely return input or empty string */
const safeString = (input: NullableString): string => input ?? "";

/**
 * Utility: Tokenize camelCase or PascalCase string to array of words (lowercased)
 * e.g. "myVariableName" => ["my", "variable", "name"]
 */
const tokenizeCamelPascal = (str: string): string[] =>
  str
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .split(/[\s]/)
    .map((s) => s.toLowerCase());

/**
 * Utility: Tokenize snake_case, screaming_snake_case, kebab-case, dot.case, path/case into words (lowercased)
 */
const tokenizeSeparator = (str: string, separator: string): string[] =>
  str.split(separator).map((s) => s.toLowerCase());

/**
 * Utility: Tokenize UPPERCASE or lowercase (no separator) string into a single word array
 */
const tokenizeFlat = (str: string): string[] => [str.toLowerCase()];

/**
 * Utility: Join tokens into camelCase
 */
const toCamel = (tokens: string[]): string =>
  tokens
    .map((word, idx) =>
      idx === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join("");

/**
 * Utility: Join tokens into PascalCase
 */
const toPascal = (tokens: string[]): string =>
  tokens.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("");

/**
 * Utility: Join tokens into snake_case
 */
const toSnake = (tokens: string[]): string => tokens.join("_");

/**
 * Utility: Join tokens into SCREAMING_SNAKE_CASE
 */
const toScreamingSnake = (tokens: string[]): string =>
  tokens.join("_").toUpperCase();

/**
 * Utility: Join tokens into kebab-case
 */
const toKebab = (tokens: string[]): string => tokens.join("-");

/**
 * Utility: Join tokens into dot.case
 */
const toDot = (tokens: string[]): string => tokens.join(".");

/**
 * Utility: Join tokens into path/case
 */
const toPath = (tokens: string[]): string => tokens.join("/");

/**
 * Utility: Join tokens into UPPERCASE (continuous uppercase no separator)
 */
const toUpper = (tokens: string[]): string => tokens.join("").toUpperCase();

/**
 * Utility: Join tokens into lowercase (continuous lowercase no separator)
 */
const toLower = (tokens: string[]): string => tokens.join("").toLowerCase();

/**
 * Tokenizers per case type
 */
const tokenizeByCase = {
  camel: tokenizeCamelPascal,
  pascal: tokenizeCamelPascal,
  snake: (str: string) => tokenizeSeparator(str, "_"),
  screaming: (str: string) => tokenizeSeparator(str.toLowerCase(), "_"),
  kebab: (str: string) => tokenizeSeparator(str, "-"),
  dot: (str: string) => tokenizeSeparator(str, "."),
  path: (str: string) => tokenizeSeparator(str, "/"),
  upper: (str: string) => tokenizeFlat(str),
  lower: (str: string) => tokenizeFlat(str),
} as const;

type CaseType = keyof typeof tokenizeByCase;

const formatByCase = {
  camel: toCamel,
  pascal: toPascal,
  snake: toSnake,
  screaming: toScreamingSnake,
  kebab: toKebab,
  dot: toDot,
  path: toPath,
  upper: toUpper,
  lower: toLower,
} as const;

/** Helper to tokenize string with given case */
const tokenize = (input: string, caseType: CaseType): string[] =>
  tokenizeByCase[caseType](input);

/** Helper to format tokens into target case */
const format = (tokens: string[], caseType: CaseType): string =>
  formatByCase[caseType](tokens);

/**
 * Factory to create all 81 conversion functions
 */
const createConverter =
  (fromCase: CaseType, toCase: CaseType) =>
  (input: NullableString): string => {
    const str = safeString(input);
    if (!str) return "";
    if (fromCase === toCase) return str; // no conversion needed
    const tokens = tokenize(str, fromCase);
    return format(tokens, toCase);
  };

// Helper type for all conversion names (camelToSnake etc)
type ConverterName = `${CaseType}To${Capitalize<CaseType>}`;

// Dynamic generation of all converters:
const converters = {} as Record<string, (input: NullableString) => string>;

const cases: CaseType[] = [
  "camel",
  "pascal",
  "snake",
  "screaming",
  "kebab",
  "dot",
  "path",
  "upper",
  "lower",
];

cases.forEach((from) => {
  cases.forEach((to) => {
    const fnName = `${from}To${to.charAt(0).toUpperCase() + to.slice(1)}`;
    converters[fnName] = createConverter(from, to);
  });
});

// Also expose word-level tokenizer and formatter functions
export const camelToWords = (input: NullableString): string[] =>
  tokenizeCamelPascal(safeString(input));
export const pascalToWords = (input: NullableString): string[] =>
  tokenizeCamelPascal(safeString(input));
export const snakeToWords = (input: NullableString): string[] =>
  tokenizeSeparator(safeString(input), "_");
export const screamingToWords = (input: NullableString): string[] =>
  tokenizeSeparator(safeString(input).toLowerCase(), "_");
export const kebabToWords = (input: NullableString): string[] =>
  tokenizeSeparator(safeString(input), "-");
export const dotToWords = (input: NullableString): string[] =>
  tokenizeSeparator(safeString(input), ".");
export const pathToWords = (input: NullableString): string[] =>
  tokenizeSeparator(safeString(input), "/");
export const upperToWords = (input: NullableString): string[] =>
  tokenizeFlat(safeString(input));
export const lowerToWords = (input: NullableString): string[] =>
  tokenizeFlat(safeString(input));

export const wordsToCamel = toCamel;
export const wordsToPascal = toPascal;
export const wordsToSnake = toSnake;
export const wordsToScreaming = toScreamingSnake;
export const wordsToKebab = toKebab;
export const wordsToDot = toDot;
export const wordsToPath = toPath;
export const wordsToUpper = toUpper;
export const wordsToLower = toLower;

export const {
  camelToPascal,
  camelToSnake,
  camelToScreaming,
  camelToKebab,
  camelToDot,
  camelToPath,
  camelToUpper,
  camelToLower,
  camelToCamel,

  pascalToCamel,
  pascalToSnake,
  pascalToScreaming,
  pascalToKebab,
  pascalToDot,
  pascalToPath,
  pascalToUpper,
  pascalToLower,
  pascalToPascal,

  snakeToCamel,
  snakeToPascal,
  snakeToScreaming,
  snakeToKebab,
  snakeToDot,
  snakeToPath,
  snakeToUpper,
  snakeToLower,
  snakeToSnake,

  screamingToCamel,
  screamingToPascal,
  screamingToSnake,
  screamingToKebab,
  screamingToDot,
  screamingToPath,
  screamingToUpper,
  screamingToLower,
  screamingToScreaming,

  kebabToCamel,
  kebabToPascal,
  kebabToSnake,
  kebabToScreaming,
  kebabToDot,
  kebabToPath,
  kebabToUpper,
  kebabToLower,
  kebabToKebab,

  dotToCamel,
  dotToPascal,
  dotToSnake,
  dotToScreaming,
  dotToKebab,
  dotToPath,
  dotToUpper,
  dotToLower,
  dotToDot,

  pathToCamel,
  pathToPascal,
  pathToSnake,
  pathToScreaming,
  pathToKebab,
  pathToDot,
  pathToUpper,
  pathToLower,
  pathToPath,

  upperToCamel,
  upperToPascal,
  upperToSnake,
  upperToScreaming,
  upperToKebab,
  upperToDot,
  upperToPath,
  upperToLower,
  upperToUpper,

  lowerToCamel,
  lowerToPascal,
  lowerToSnake,
  lowerToScreaming,
  lowerToKebab,
  lowerToDot,
  lowerToPath,
  lowerToUpper,
  lowerToLower,
} = converters;
