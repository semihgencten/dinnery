import { observer } from 'mobx-react-lite';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './context/store.context';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { HomePage } from './pages/home/HomePage';
import { RecipeDetailPage } from './pages/recipe/RecipeDetailPage';
import { MainLayout } from './layouts/MainLayout';
import { MyRecipesPage } from './pages/recipe/MyRecipesPage';
import { CreateRecipePage } from './pages/recipe/CreateRecipePage';
import { SearchPage } from './pages/search/SearchPage';
import { SavedRecipesPage } from './pages/recipe/SavedRecipesPage';
import { ProfilePage } from './pages/profile/ProfilePage';


const App = observer(() => {
  const { authStore } = useStore();

  if (authStore.isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: 'var(--text-main)'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        <Route
          path="/my-recipes"
          element={authStore.isAuthenticated ? <MyRecipesPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/saved"
          element={authStore.isAuthenticated ? <SavedRecipesPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={authStore.isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
        />

        <Route
          path="/create-recipe"
          element={authStore.isAuthenticated ? <CreateRecipePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authStore.isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authStore.isAuthenticated ? <SignupPage /> : <Navigate to="/" />}
        />
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </MainLayout>
  );
});

export default App;
