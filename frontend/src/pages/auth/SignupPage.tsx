import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/store.context';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import styles from './Auth.module.scss';

export const SignupPage = observer(() => {
    const { authStore } = useStore();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        country: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await authStore.register(formData);
            // After registration, maybe auto login?
            // Store implementation just returns data, doesn't set token.
            // So we login automatically or ask them to login.
            // Let's try to login automatically if we have password.

            try {
                await authStore.login(formData.email, formData.password);
                navigate('/');
            } catch {
                // Fallback if auto-login fails
                navigate('/login');
            }

        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={`glass ${styles.authCard}`}>
                <h1 className={styles.title}>Create Account</h1>
                <p className={styles.subtitle}>Join Dinnery today</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <div style={{ color: '#ff6b6b', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}

                    <Input
                        id="name"
                        name="name"
                        label="Full Name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        id="username"
                        name="username"
                        label="Username"
                        placeholder="johndoe"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        id="email"
                        name="email"
                        type="email"
                        label="Email Address"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        id="password"
                        name="password"
                        type="password"
                        label="Password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        id="country"
                        name="country"
                        label="Country"
                        placeholder="USA"
                        value={formData.country}
                        onChange={handleChange}
                        required
                    />

                    <Button
                        type="submit"
                        fullWidth
                        disabled={authStore.isLoading}
                    >
                        {authStore.isLoading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </form>

                <div className={styles.footer}>
                    Already have an account?
                    <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
});
