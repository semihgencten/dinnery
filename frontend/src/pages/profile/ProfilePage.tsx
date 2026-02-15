import { observer } from 'mobx-react-lite';
import { useStore } from '../../context/store.context';
import { useState } from 'react';
import {
    Globe,
    ChevronRight,
    BookOpen,
    LogOut
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './ProfilePage.scss';

export const ProfilePage = observer(() => {
    const { authStore } = useStore();
    const navigate = useNavigate();
    const user = authStore.user;

    // Local state for language
    const [language, setLanguage] = useState(user?.language || 'en');

    if (!user) {
        return null;
    }

    const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        try {
            await authStore.updateProfile({ language: newLang });
        } catch (error) {
            console.error('Failed to update language', error);
            // Revert state if we failed
            if (user) setLanguage(user.language);
        }
    };

    const handleLogout = () => {
        authStore.logout();
        navigate('/');
    };

    // Generate initials from email
    const initials = user.email ? user.email.substring(0, 2).toUpperCase() : '??';

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="avatar-container">
                    <div className="avatar">
                        {initials}
                    </div>
                </div>
                <div className="user-info">
                    <h2>{user.email.split('@')[0]}</h2>
                    <p>{user.email}</p>
                </div>
            </div>

            <div className="settings-section">
                <h3>Settings</h3>
                <ul className="settings-list">
                    <li className="setting-item">
                        <div className="setting-content">
                            <Globe className="icon" />
                            <span className="label">Language</span>
                        </div>
                        <div className="setting-action">
                            <select
                                value={language}
                                onChange={handleLanguageChange}
                            >
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="fr">Français</option>
                                <option value="de">Deutsch</option>
                            </select>
                        </div>
                    </li>

                    <Link to="/my-recipes" className="setting-item">
                        <div className="setting-content">
                            <BookOpen className="icon" />
                            <span className="label">My Recipes</span>
                        </div>
                        <div className="setting-action">
                            <ChevronRight size={20} />
                        </div>
                    </Link>

                    <li onClick={handleLogout} className="setting-item" style={{ cursor: 'pointer', color: '#e74c3c' }}>
                        <div className="setting-content">
                            <LogOut className="icon" style={{ color: '#e74c3c' }} />
                            <span className="label">Logout</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
});
