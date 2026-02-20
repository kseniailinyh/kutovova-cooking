import { Link } from 'react-router-dom';
import { useData } from '../lib/data';

type RecipesPageProps = {
  query: string;
};

export function RecipesPage({ query }: RecipesPageProps) {
  const { recipes } = useData();
  const normalizedQuery = query.trim().toLowerCase();

  const visibleRecipes = recipes.filter((recipe) => {
    if (!normalizedQuery) {
      return true;
    }

    const ingredientText = recipe.ingredients.join(' ').toLowerCase();
    return (
      recipe.title.toLowerCase().includes(normalizedQuery) || ingredientText.includes(normalizedQuery)
    );
  });

  return (
    <section>
      <h2>Recipes</h2>
      <ul className="card-list">
        {visibleRecipes.map((recipe) => (
          <li key={recipe.id} className="card-item">
            <Link className="card-title" to={`/recipes/${recipe.id}`}>
              {recipe.title}
            </Link>
            <div className="chips">
              {recipe.ingredients.slice(0, 3).map((ingredient) => (
                <span key={`${recipe.id}-${ingredient}`} className="chip">
                  {ingredient}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
      {visibleRecipes.length === 0 ? <p>No recipes found.</p> : null}
    </section>
  );
}
