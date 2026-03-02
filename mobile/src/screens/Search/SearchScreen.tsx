import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { styles } from './SearchScreen.styles';
import { observer } from 'mobx-react-lite';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../theme/colors';
import { recipesStore } from '../../stores/recipes.store';

const FILTERS = ['All', 'Vegan', 'High Protein', 'Breakfast', 'Under 30 mins', 'Gluten Free'];
const SUGGESTIONS = [
    { icon: 'eco', name: 'Avocado' },
    { icon: 'egg', name: 'Eggs' },
    { icon: 'set-meal', name: 'Salmon' },
    { icon: 'bakery-dining', name: 'Tofu' },
    { icon: 'spa', name: 'Spinach' },
];

export const SearchScreen: React.FC = observer(() => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        // Add a small delay/debounce in a real app, 
        // calling directly here for simplicity
        recipesStore.search(text);
    };

    const getImageUrl = (url?: string | null) => {
        return url && url.trim() !== ''
            ? { uri: url }
            : { uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' };
    };

    const { searchResults, isSearching } = recipesStore;

    return (
        <View style={styles.container}>
            {/* Header & Search */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View style={styles.brand}>
                        <MaterialIcons name="restaurant-menu" size={28} color={theme.colors.primary} />
                        <Text style={styles.brandTitle}>Dinnery</Text>
                    </View>
                    <TouchableOpacity style={styles.iconButton}>
                        <MaterialIcons name="notifications" size={24} color={theme.colors.primary} />
                    </TouchableOpacity>
                </View>
                <View style={styles.searchBar}>
                    <MaterialIcons name="search" size={20} color={theme.colors.textLight} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search recipes, ingredients..."
                        placeholderTextColor={theme.colors.textLight}
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                </View>
            </View>

            {/* Filter Chips */}
            <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContainer}>
                    {FILTERS.map((f, i) => (
                        <TouchableOpacity key={f} style={i === 0 ? styles.filterActive : styles.filterInactive}>
                            <Text style={i === 0 ? styles.filterTextActive : styles.filterTextInactive}>{f}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {searchQuery.length === 0 ? (
                    <>
                        {/* Suggested Ingredients */}
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Suggested Ingredients</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAll}>See all</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.suggestionsGrid}>
                            {SUGGESTIONS.map(s => (
                                <TouchableOpacity key={s.name} style={styles.suggestionChip}>
                                    <MaterialIcons name={s.icon as any} size={16} color={theme.colors.primary} />
                                    <Text style={styles.suggestionText}>{s.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                ) : null}

                {/* Recipe Grid (Search Results or Discoveries) */}
                <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 16 }]}>
                    {searchQuery.length > 0 ? "Search Results" : "Recent Discoveries"}
                </Text>

                {isSearching ? (
                    <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
                ) : (
                    <View style={styles.grid}>
                        {searchResults.length === 0 && searchQuery.length > 0 && (
                            <Text style={{ color: theme.colors.textLight }}>No recipes found for "{searchQuery}".</Text>
                        )}
                        {/* If no search query, we show searchResults (which would be empty) or you can fallback to recommendedRecipes. For now we will just show search results if any, otherwise empty. We can fallback to trending if we want. Let's just render searchResults. */}
                        {searchResults.map(d => (
                            <View key={d.id} style={styles.gridCard}>
                                <View style={styles.cardImageContainer}>
                                    <Image source={getImageUrl(d.photoUrl)} style={styles.cardImage} />
                                    <TouchableOpacity style={styles.bookmarkBtn}>
                                        <MaterialIcons
                                            name={d.isSaved ? 'bookmark' : 'bookmark-border'}
                                            size={20}
                                            color={d.isSaved ? theme.colors.primary : theme.colors.textDark}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.cardTitle} numberOfLines={2}>{d.name}</Text>
                                <View style={styles.cardTime}>
                                    <MaterialIcons name="schedule" size={12} color={theme.colors.textLight} />
                                    <Text style={styles.timeText}>{d.cookTime || d.prepTime || 15} mins</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
});
