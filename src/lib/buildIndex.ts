import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Ingredient, Recipe, RecipeIndex } from './types.js';
import { toSlug } from './slug.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const recipesDir = path.join(rootDir, 'recipes');
const ingredientsDir = path.join(rootDir, 'ingredients');
const outputPath = path.join(rootDir, 'public', 'generated', 'index.json');

const WIKI_LINK_RE = /\[\[(.+?)\]\]/g;

function normalizeIngredientName(raw: string): string {
  return raw.split('|')[0].split('#')[0].trim();
}

function dedupe(values: string[]): string[] {
  return Array.from(new Set(values));
}

function extractIngredientNames(text: string): string[] {
  const ingredients: string[] = [];
  for (const match of text.matchAll(WIKI_LINK_RE)) {
    const name = normalizeIngredientName(match[1]);
    if (name) {
      ingredients.push(name);
    }
  }
  return dedupe(ingredients);
}

function findHeaderIndex(text: string, names: string[]): number {
  const escaped = names.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp(`^\\s{0,3}(?:#{1,6}\\s*)?(?:${escaped.join('|')})\\s*:?.*$`, 'gim');
  const match = re.exec(text);
  return match ? match.index : -1;
}

function sliceAfterLine(text: string, headerStart: number): string {
  const lineEnd = text.indexOf('\n', headerStart);
  return lineEnd === -1 ? '' : text.slice(lineEnd + 1);
}

function parseMeta(text: string): Recipe['meta'] | undefined {
  const servingsMatch = text.match(/^\s*([^\n#]*\bпорц(?:ия|ии|ий|и)\b[^\n#]*)\s*$/im);
  const lessonLinkMatch = text.match(/\[\[\s*(Урок[^\]]+)\s*\]\]/i);
  const lessonLineMatch = text.match(/^\s*Урок\s*:\s*(.+)\s*$/im);

  const meta: Recipe['meta'] = {};
  if (servingsMatch?.[1]) {
    meta.servings = servingsMatch[1].trim();
  }
  if (lessonLinkMatch?.[1]) {
    meta.lesson = lessonLinkMatch[1].trim();
  } else if (lessonLineMatch?.[1]) {
    meta.lesson = lessonLineMatch[1].trim();
  }

  return Object.keys(meta).length > 0 ? meta : undefined;
}

function extractRecipe(content: string, fileName: string): Recipe {
  const normalized = content.replace(/\r\n/g, '\n').trim();
  const title = path.parse(fileName).name;

  const ingredientsHeaderIndex = findHeaderIndex(normalized, ['Ингредиенты']);
  const instructionsHeaderIndex = findHeaderIndex(normalized, ['Инструкция', 'Инструкции']);

  let ingredientSection = '';
  if (ingredientsHeaderIndex !== -1 && instructionsHeaderIndex !== -1 && instructionsHeaderIndex > ingredientsHeaderIndex) {
    ingredientSection = normalized.slice(ingredientsHeaderIndex, instructionsHeaderIndex);
  } else if (ingredientsHeaderIndex !== -1) {
    ingredientSection = sliceAfterLine(normalized, ingredientsHeaderIndex);
  }

  let ingredients = extractIngredientNames(ingredientSection);

  if (ingredients.length === 0) {
    if (instructionsHeaderIndex > 0) {
      ingredients = extractIngredientNames(normalized.slice(0, instructionsHeaderIndex));
    }
  }

  if (ingredients.length === 0) {
    ingredients = extractIngredientNames(normalized);
  }

  const body = instructionsHeaderIndex !== -1 ? normalized.slice(instructionsHeaderIndex).trim() : normalized;

  return {
    id: toSlug(title),
    title,
    fileName,
    ingredients,
    body,
    meta: parseMeta(normalized)
  };
}

async function listMarkdownFiles(dirPath: string): Promise<string[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.md'))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, 'ru'));
}

async function buildIndex(): Promise<RecipeIndex> {
  const recipeFileNames = await listMarkdownFiles(recipesDir);
  const ingredientFileNames = await listMarkdownFiles(ingredientsDir);

  const recipes: Recipe[] = [];
  for (const fileName of recipeFileNames) {
    const filePath = path.join(recipesDir, fileName);
    const raw = await fs.readFile(filePath, 'utf8');
    recipes.push(extractRecipe(raw, fileName));
  }

  const ingredientToRecipeIds = new Map<string, Set<string>>();

  for (const ingredientFile of ingredientFileNames) {
    const ingredientName = path.parse(ingredientFile).name;
    ingredientToRecipeIds.set(ingredientName, new Set());
  }

  for (const recipe of recipes) {
    for (const ingredientName of recipe.ingredients) {
      if (!ingredientToRecipeIds.has(ingredientName)) {
        ingredientToRecipeIds.set(ingredientName, new Set());
      }
      ingredientToRecipeIds.get(ingredientName)?.add(recipe.id);
    }
  }

  const ingredients: Ingredient[] = Array.from(ingredientToRecipeIds.entries())
    .map(([name, recipeIds]) => ({
      id: toSlug(name),
      name,
      recipeIds: Array.from(recipeIds).sort((a, b) => a.localeCompare(b, 'ru'))
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'ru'));

  return { recipes, ingredients };
}

async function main(): Promise<void> {
  const index = await buildIndex();
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');

  console.log(`Built ${index.recipes.length} recipes and ${index.ingredients.length} ingredients`);
  console.log(`Wrote ${outputPath}`);
}

main().catch((error) => {
  console.error('Failed to build index:', error);
  process.exitCode = 1;
});
