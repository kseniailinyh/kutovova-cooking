import { Link, useParams } from 'react-router-dom';
import { useData } from '../lib/data';

export function IngredientPage() {
  const { id } = useParams();
  const { ingredientById, recipeById } = useData();

  if (!id) {
    return <p>Ingredient id is missing.</p>;
  }

  const ingredient = ingredientById.get(id);
  if (!ingredient) {
    return <p>Ingredient not found.</p>;
  }

  const recipes = ingredient.recipeIds
    .map((recipeId) => recipeById.get(recipeId))
    .filter((recipe): recipe is NonNullable<typeof recipe> => Boolean(recipe));

  return (
    <section className="detail">
      <h2>{ingredient.name}</h2>
      <p>Used in {recipes.length} recipes.</p>
      <ul className="link-list">
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
