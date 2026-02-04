import { Link, useNavigate } from 'react-router-dom';
import { Search, Bookmark } from 'lucide-react';
import { useStore } from '../context/store.context';
import { observer } from 'mobx-react-lite';
import styles from './Header.module.css';

export const Header = observer(() => {
    const { authStore } = useStore();
    const navigate = useNavigate();

    return (
        <header className={styles.header}>
            <div className={styles.content}>
                <Link to="/" className={styles.logo}>
                    Dinnery
                </Link>

                <nav className={styles.nav}>
                    <Link to="/search" className={styles.navLink}>
                        <Search className={styles.icon} />
                        <span className={styles.navText}>Search</span>
                    </Link>

                    <Link to="/saved" className={styles.navLink}>
                        <Bookmark className={styles.icon} />
                        <span className={styles.navText}>Saved</span>
                    </Link>

                    {authStore.isAuthenticated ? (
                        <button onClick={() => authStore.logout()} className={styles.loginBtn}>
                            Logout
                        </button>
                    ) : (
                        <button onClick={() => navigate('/login')} className={styles.loginBtn}>
                            Login
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
});
