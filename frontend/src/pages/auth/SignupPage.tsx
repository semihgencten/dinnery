import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/store.context';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { RegisterPayload } from '../../types/auth'; // Import updated type
import styles from './Auth.module.scss';

export const SignupPage = observer(() => {
    const { authStore } = useStore();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<RegisterPayload>({
        email: '',
        password: '',
        language: 'en',
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await authStore.register(formData);

            try {
                await authStore.login(formData.email, formData.password);
                navigate('/');
            } catch {
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

                    <div className={styles.formGroup}>
                        <label htmlFor="language" className={styles.label}>Language</label>
                        <select
                            id="language"
                            name="language"
                            value={formData.language}
                            onChange={handleChange}
                            className={styles.select}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                background: 'rgba(255, 255, 255, 0.05)',
                                color: 'var(--text-primary)',
                                outline: 'none',
                                marginTop: '0.5rem'
                            }}
                        >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="tr">Turkish</option>
                        </select>
                    </div>

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
