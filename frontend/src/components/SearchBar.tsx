import { Search } from 'lucide-react';
import './SearchBar.scss';

interface SearchBarProps {
    value: string;
    onChange: (val: string) => void;
    onSearch: () => void;
}

export const SearchBar = ({ value, onChange, onSearch }: SearchBarProps) => {
    return (
        <div className="search-bar glass">
            <Search size={20} className="search-icon" />
            <input
                type="text"
                placeholder="Search recipes (e.g. Pasta, Pizza)..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                className="search-input"
            />
        </div>
    )
}
