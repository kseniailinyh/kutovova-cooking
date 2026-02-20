import { Navigate, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { useData } from './lib/data';
import { IngredientPage } from './pages/IngredientPage';
import { IngredientsPage } from './pages/IngredientsPage';
import { RecipePage } from './pages/RecipePage';
import { RecipesPage } from './pages/RecipesPage';

function App() {
  const [query, setQuery] = useState('');
  const { loading, error } = useData();

  return (
    <div className="app-shell">
      <Sidebar query={query} onQueryChange={setQuery} />
      <main className="content">
        {loading ? <p>Loading index...</p> : null}
        {error ? <p>{error}</p> : null}
        {!loading && !error ? (
          <Routes>
            <Route path="/" element={<Navigate to="/recipes" replace />} />
            <Route path="/recipes" element={<RecipesPage query={query} />} />
            <Route path="/recipes/:id" element={<RecipePage />} />
            <Route path="/ingredients" element={<IngredientsPage query={query} />} />
            <Route path="/ingredients/:id" element={<IngredientPage />} />
            <Route path="*" element={<Navigate to="/recipes" replace />} />
          </Routes>
        ) : null}
      </main>
    </div>
  );
}

export default App;
