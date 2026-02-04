import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import styles from './Footer.module.css';

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.column}>
                    <Link to="/" className={styles.logo}>Dinnery</Link>
                    <p className={styles.tagline}>
                        Discover and cook amazing recipes every day.
                    </p>
                </div>

                <div className={styles.column}>
                    <div className={styles.heading}>Explore</div>
                    <Link to="/recipes" className={styles.link}>All Recipes</Link>
                    <Link to="/categories" className={styles.link}>Categories</Link>
                    <Link to="/saved" className={styles.link}>Saved Recipes</Link>
                </div>

                <div className={styles.column}>
                    <div className={styles.heading}>Company</div>
                    <Link to="/about" className={styles.link}>About Us</Link>
                    <Link to="/contact" className={styles.link}>Contact</Link>
                    <Link to="/privacy" className={styles.link}>Privacy Policy</Link>
                </div>

                <div className={styles.column}>
                    <div className={styles.heading}>Follow Us</div>
                    <div className={styles.socials}>
                        <a href="#" className={styles.socialIcon}><Instagram size={16} /></a>
                        <a href="#" className={styles.socialIcon}><Facebook size={16} /></a>
                        <a href="#" className={styles.socialIcon}><Twitter size={16} /></a>
                    </div>
                </div>
            </div>

            <div className={styles.bottom}>
                &copy; {new Date().getFullYear()} Dinnery. All rights reserved.
            </div>
        </footer>
    );
};
