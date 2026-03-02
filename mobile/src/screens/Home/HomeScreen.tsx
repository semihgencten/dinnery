import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, ImageBackground, ActivityIndicator } from 'react-native';
import { styles } from './HomeScreen.styles';
import { observer } from 'mobx-react-lite';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../theme/colors';
import { recipesStore } from '../../stores/recipes.store';

export const HomeScreen: React.FC = observer(() => {
    useEffect(() => {
        recipesStore.fetchTrendingRecipes();
        recipesStore.fetchRecommendedRecipes();
    }, []);

    const { trendingRecipes, recommendedRecipes, isLoadingTrending, isLoadingRecommended } = recipesStore;

    // A small helper to show a placeholder if image is missing from the API response
    const getImageUrl = (url?: string | null) => {
        return url && url.trim() !== ''
            ? { uri: url }
            : { uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' }; // fallback food image
    };

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwU2bN0ieMOJrV3fdict8-4vUhfSzs3xO-ZQPeFD-0rA5AHDP_xZpTIUaRLtMO_b4-GALuHeYuyLo_x47SWQo6QnSpYwaZPf4Ho4q0AtX4cUUnCzC2shZYcfX5JUkvCrlnKVXMOZY_khESgRSIHNs6eaT-Lfj6N8IOr3MEOh-_q-6WKisTEQevwxKGp8wEjSildNtIJejhomeBrQhsn5atFRPEz-Eb4qaPcbZbs65X5kPSzrNbGiucu2wffw3m-UGL4RfiTqNfDgs' }}
                            style={styles.avatar}
                        />
                    </View>
                    <View>
                        <Text style={styles.welcomeText}>Welcome back</Text>
                        <Text style={styles.nameText}>Good morning, Chef</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.notificationButton}>
                    <MaterialIcons name="notifications" size={24} color={theme.colors.textDark} />
                    <View style={styles.notificationBadge} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Search Bar Accent */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchInputWrapper}>
                        <MaterialIcons name="search" size={24} color={theme.colors.textLight} style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search recipes, chefs, or ingredients"
                            placeholderTextColor={theme.colors.textLight}
                        />
                    </View>
                </View>

                {/* Trending Section */}
                <View>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Trending Today</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>See all</Text>
                        </TouchableOpacity>
                    </View>

                    {isLoadingTrending ? (
                        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 20 }} />
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.trendingScroll}
                            snapToInterval={340} // card width (320) + margin (20)
                            decelerationRate="fast"
                        >
                            {trendingRecipes.length === 0 && (
                                <Text style={{ color: theme.colors.textLight, padding: 20 }}>No trending recipes found.</Text>
                            )}
                            {trendingRecipes.map(recipe => (
                                <TouchableOpacity key={recipe.id} activeOpacity={0.9} style={styles.trendingCard}>
                                    <ImageBackground
                                        source={getImageUrl(recipe.photoUrl)}
                                        style={styles.trendingImageBg}
                                        imageStyle={styles.trendingImage}
                                    >
                                        <View style={styles.trendingGradient} />
                                        <View style={styles.trendingContent}>
                                            <View style={styles.badgesRow}>
                                                <View style={styles.badgePrimary}>
                                                    <Text style={styles.badgePrimaryText}>{recipe.category || 'General'}</Text>
                                                </View>
                                            </View>
                                            <Text style={styles.trendingTitle}>{recipe.name}</Text>
                                            <View style={styles.trendingFooter}>
                                                <Text style={styles.trendingFooterText}>
                                                    {recipe.author?.username || 'Unknown'} <Text style={styles.dotSep}>•</Text> {recipe.likesCount || 0} Likes
                                                </Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <MaterialIcons name="schedule" size={14} color="#FFF" style={{ marginRight: 4 }} />
                                                    <Text style={styles.trendingFooterText}>{recipe.cookTime || recipe.prepTime || 15} mins</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>

                {/* Recommended Feed */}
                <View style={styles.recommendedSection}>
                    <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Recommended for You</Text>

                    {isLoadingRecommended ? (
                        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 20 }} />
                    ) : (
                        <>
                            {recommendedRecipes.length === 0 && (
                                <Text style={{ color: theme.colors.textLight }}>No recommended recipes right now.</Text>
                            )}
                            {recommendedRecipes.map(recipe => (
                                <TouchableOpacity key={recipe.id} style={styles.recommendedCard}>
                                    <Image
                                        source={getImageUrl(recipe.photoUrl)}
                                        style={styles.recommendedImage}
                                    />
                                    <View style={styles.recommendedContent}>
                                        <View>
                                            <Text style={styles.recommendedTitle}>{recipe.name}</Text>
                                            <Text style={styles.recommendedSubtitle}>{recipe.author?.username || 'Chef'} • {recipe.cookTime || recipe.prepTime || 20} mins</Text>
                                        </View>
                                        <View style={styles.recommendedFooter}>
                                            <View style={styles.ratingRow}>
                                                <MaterialIcons name="favorite" size={16} color={theme.colors.primary} />
                                                <Text style={styles.ratingText}>{recipe.likesCount || 0}</Text>
                                            </View>
                                            <TouchableOpacity style={styles.bookmarkButton}>
                                                <MaterialIcons name={recipe.isSaved ? "bookmark" : "bookmark-border"} size={18} color={theme.colors.primary} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
});
