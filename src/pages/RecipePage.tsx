import ReactMarkdown from 'react-markdown';
import { Link, useParams } from 'react-router-dom';
import { useData } from '../lib/data';
import { toSlug } from '../lib/slug';

export function RecipePage() {
  const { id } = useParams();
  const { recipeById } = useData();

  if (!id) {
    return <p>Recipe id is missing.</p>;
  }

  const recipe = recipeById.get(id);
  if (!recipe) {
    return <p>Recipe not found.</p>;
  }

  return (
    <article className="detail">
      <h2>{recipe.title}</h2>
      {recipe.meta ? (
        <div className="meta-row">
          {recipe.meta.servings ? <span className="meta-pill">{recipe.meta.servings}</span> : null}
          {recipe.meta.lesson ? <span className="meta-pill">{recipe.meta.lesson}</span> : null}
        </div>
      ) : null}

      <section>
        <h3>Ingredients</h3>
        <ul className="link-list">
          {recipe.ingredients.map((ingredient) => (
            <li key={ingredient}>
              <Link to={`/ingredients/${toSlug(ingredient)}`}>{ingredient}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Instructions</h3>
        <div className="markdown">
          <ReactMarkdown>{recipe.body}</ReactMarkdown>
        </div>
      </section>
    </article>
  );
}
