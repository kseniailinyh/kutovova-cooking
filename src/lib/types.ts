export type RecipeMeta = {
  servings?: string;
  lesson?: string;
};

export type Recipe = {
  id: string;
  title: string;
  fileName: string;
  ingredients: string[];
  body: string;
  meta?: RecipeMeta;
};

export type Ingredient = {
  id: string;
  name: string;
  recipeIds: string[];
};

export type RecipeIndex = {
  recipes: Recipe[];
  ingredients: Ingredient[];
};
