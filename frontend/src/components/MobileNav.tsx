import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, Bookmark, User } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../context/store.context';
import styles from './MobileNav.module.scss';

export const MobileNav = observer(() => {
    const location = useLocation();
    const { authStore } = useStore();

    const isActive = (path: string) => {
        if (path === '/profile') {
            return location.pathname === '/profile' ||
                location.pathname === '/login' ||
                location.pathname === '/signup' ||
                location.pathname === '/my-recipes';
        }
        return location.pathname === path;
    };

    return (
        <nav className={styles.mobileNav}>
            <Link to="/" className={`${styles.navItem} ${isActive('/') ? styles.active : ''}`}>
                <Home className={styles.icon} />
                <span>Home</span>
            </Link>

            <Link to="/search" className={`${styles.navItem} ${isActive('/search') ? styles.active : ''}`}>
                <Search className={styles.icon} />
                <span>Search</span>
            </Link>

            <Link
                to={authStore.isAuthenticated ? "/create-recipe" : "/login"}
                className={`${styles.navItem} ${isActive('/create-recipe') ? styles.active : ''}`}
            >
                <PlusSquare className={styles.icon} />
                <span>Create</span>
            </Link>

            <Link to="/saved" className={`${styles.navItem} ${isActive('/saved') ? styles.active : ''}`}>
                <Bookmark className={styles.icon} />
                <span>Saved</span>
            </Link>

            <Link
                to={authStore.isAuthenticated ? "/profile" : "/login"}
                className={`${styles.navItem} ${isActive('/profile') ? styles.active : ''}`}
            >
                <User className={styles.icon} />
                <span>{authStore.isAuthenticated ? 'Profile' : 'Login'}</span>
            </Link>
        </nav>
    );
});
