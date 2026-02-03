import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/store.context';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import styles from './Auth.module.scss'; // Reuse styles

export const LoginPage = observer(() => {
    const { authStore } = useStore();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await authStore.login(email, password);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={`glass ${styles.authCard}`}>
                <h1 className={styles.title}>Welcome Back</h1>
                <p className={styles.subtitle}>Sign in to continue to Dinnery</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <div style={{ color: '#ff6b6b', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}

                    <Input
                        id="email"
                        type="email"
                        label="Email Address"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Input
                        id="password"
                        type="password"
                        label="Password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button
                        type="submit"
                        fullWidth
                        disabled={authStore.isLoading}
                    >
                        {authStore.isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                <div className={styles.footer}>
                    Don't have an account?
                    <Link to="/signup">Sign up</Link>
                </div>
            </div>
        </div>
    );
});
