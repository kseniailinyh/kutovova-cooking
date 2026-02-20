import { Link } from 'react-router-dom';
import { useData } from '../lib/data';

type IngredientsPageProps = {
  query: string;
};

export function IngredientsPage({ query }: IngredientsPageProps) {
  const { ingredients } = useData();
  const normalizedQuery = query.trim().toLowerCase();

  const visibleIngredients = ingredients.filter((ingredient) => {
    if (!normalizedQuery) {
      return true;
    }
    return ingredient.name.toLowerCase().includes(normalizedQuery);
  });

  return (
    <section>
      <h2>Ingredients</h2>
      <ul className="card-list">
        {visibleIngredients.map((ingredient) => (
          <li key={ingredient.id} className="card-item card-item-row">
            <Link className="card-title" to={`/ingredients/${ingredient.id}`}>
              {ingredient.name}
            </Link>
            <span className="usage-count">{ingredient.recipeIds.length} recipes</span>
          </li>
        ))}
      </ul>
      {visibleIngredients.length === 0 ? <p>No ingredients found.</p> : null}
    </section>
  );
}
