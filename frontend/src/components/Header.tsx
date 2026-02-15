import { Link, useNavigate } from 'react-router-dom';
import { Search, Bookmark, ChefHat, PlusSquare, User } from 'lucide-react';
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

                {/* Desktop Navigation */}
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
                        <div className={styles.userMenu}>
                            <Link to="/create-recipe" className={styles.createBtn}>
                                <PlusSquare className={styles.icon} />
                                <span>Create Recipe</span>
                            </Link>

                            <Link to="/my-recipes" className={styles.navLink}>
                                <ChefHat className={styles.icon} />
                                <span className={styles.navText}>My Recipes</span>
                            </Link>

                            <Link to="/profile" className={styles.navLink}>
                                <User className={styles.icon} />
                                <span className={styles.navText}>Profile</span>
                            </Link>

                            <button onClick={() => authStore.logout()} className={styles.outlineBtn}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <button onClick={() => navigate('/login')} className={styles.outlineBtn}>
                                Login
                            </button>
                            <button onClick={() => navigate('/signup')} className={styles.loginBtn}>
                                Sign Up
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
});
