import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Ingredient, Recipe, RecipeIndex } from './types';

type DataContextValue = {
  loading: boolean;
  error: string | null;
  recipes: Recipe[];
  ingredients: Ingredient[];
  recipeById: Map<string, Recipe>;
  ingredientById: Map<string, Ingredient>;
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState<RecipeIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const response = await fetch('/generated/index.json');
        if (!response.ok) {
          throw new Error(`Failed to load index: ${response.status}`);
        }
        const parsed = (await response.json()) as RecipeIndex;
        if (active) {
          setIndex(parsed);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<DataContextValue>(() => {
    const recipes = index?.recipes ?? [];
    const ingredients = index?.ingredients ?? [];

    return {
      loading,
      error,
      recipes,
      ingredients,
      recipeById: new Map(recipes.map((recipe) => [recipe.id, recipe])),
      ingredientById: new Map(ingredients.map((ingredient) => [ingredient.id, ingredient]))
    };
  }, [index, loading, error]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used inside DataProvider');
  }
  return context;
}
