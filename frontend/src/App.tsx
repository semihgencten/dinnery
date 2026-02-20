import { lazy, Suspense } from 'react';
import { observer } from 'mobx-react-lite';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './context/store.context';
import { MainLayout } from './layouts/MainLayout';

const LoginPage = lazy(() => import('./pages/auth/LoginPage').then(module => ({ default: module.LoginPage })));
const SignupPage = lazy(() => import('./pages/auth/SignupPage').then(module => ({ default: module.SignupPage })));
const HomePage = lazy(() => import('./pages/home/HomePage').then(module => ({ default: module.HomePage })));
const RecipeDetailPage = lazy(() => import('./pages/recipe/RecipeDetailPage').then(module => ({ default: module.RecipeDetailPage })));
const MyRecipesPage = lazy(() => import('./pages/recipe/MyRecipesPage').then(module => ({ default: module.MyRecipesPage })));
const CreateRecipePage = lazy(() => import('./pages/recipe/CreateRecipePage').then(module => ({ default: module.CreateRecipePage })));
const SearchPage = lazy(() => import('./pages/search/SearchPage').then(module => ({ default: module.SearchPage })));
const SavedRecipesPage = lazy(() => import('./pages/recipe/SavedRecipesPage').then(module => ({ default: module.SavedRecipesPage })));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage').then(module => ({ default: module.ProfilePage })));


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
      <Suspense fallback={
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          color: 'var(--text-main)'
        }}>
          Loading...
        </div>
      }>
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
      </Suspense>
    </MainLayout>
  );
});

export default App;
