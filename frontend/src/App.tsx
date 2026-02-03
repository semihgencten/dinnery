import { observer } from 'mobx-react-lite';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './context/store.context';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { HomePage } from './pages/home/HomePage';

const App = observer(() => {
  const { authStore } = useStore();

  if (authStore.isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: 'white'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
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
  );
});

export default App;
