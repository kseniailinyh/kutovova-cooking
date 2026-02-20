import { Link, useLocation } from 'react-router-dom';

type SidebarProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export function Sidebar({ query, onQueryChange }: SidebarProps) {
  const location = useLocation();
  const isIngredientRoute = location.pathname.startsWith('/ingredients');

  return (
    <aside className="sidebar">
      <h1 className="brand">Kutovova Cooking</h1>
      <nav className="nav-links">
        <Link className={location.pathname.startsWith('/recipes') ? 'active' : ''} to="/recipes">
          Recipes
        </Link>
        <Link className={isIngredientRoute ? 'active' : ''} to="/ingredients">
          Ingredients
        </Link>
      </nav>
      <label className="search-label" htmlFor="global-search">
        Search
      </label>
      <input
        id="global-search"
        className="search-input"
        type="search"
        placeholder={isIngredientRoute ? 'Search ingredients' : 'Search recipes'}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
    </aside>
  );
}
