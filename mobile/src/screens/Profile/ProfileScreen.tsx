import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground, ActivityIndicator, Image } from 'react-native';
import { styles } from './ProfileScreen.styles';
import { observer } from 'mobx-react-lite';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../theme/colors';
import { userStore } from '../../stores/user.store';
import { recipesStore } from '../../stores/recipes.store';
import { useNavigation } from '@react-navigation/native';

export const ProfileScreen: React.FC = observer(() => {
    const navigation = useNavigation<any>();
    const [activeTab, setActiveTab] = useState<'my_recipes' | 'saved_recipes'>('my_recipes');

    useEffect(() => {
        const load = async () => {
            await userStore.fetchProfile();
            if (userStore.profile?.id) {
                recipesStore.fetchUserRecipes(userStore.profile.id);
                recipesStore.fetchSavedRecipes(userStore.profile.id);
            }
        };
        load();
    }, []);

    const { profile, isLoading: isProfileLoading } = userStore;
    const { userRecipes, savedRecipes, isLoadingUserRecipes, isLoadingSavedRecipes } = recipesStore;

    const getImageUrl = (url?: string | null) => {
        return url && url.trim() !== ''
            ? { uri: url }
            : { uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' };
    };

    const isLoadingRecipes = activeTab === 'my_recipes' ? isLoadingUserRecipes : isLoadingSavedRecipes;
    const displayedRecipes = activeTab === 'my_recipes' ? userRecipes : savedRecipes;

    return (
        <View style={styles.container}>
            {/* Header & Profile Section */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity style={styles.settingsBtn}>
                        <MaterialIcons name="settings" size={24} color={theme.colors.textDark} />
                    </TouchableOpacity>
                </View>

                {isProfileLoading ? (
                    <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
                ) : (
                    <View style={styles.profileInfo}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatarBorder}>
                                <ImageBackground
                                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVZoU2gsZlIQtNkNIF-LrVBFCVtuE3uT4gSOmS6QrY_do6-Q0tZw2yrAgOuFmq2gdvVczREanpFQQeJg5LOQ-KlrnYTPOmdzbCp4xIfOP6ynuqwbKo-92L8wIy-VNmYUsYr04cZEDzdMkMLj2oSCd7qZfzXfdKilTyZhn8fnBXr4q4RXO059araFtv2rtQ2AljFlbzh2DLpNiM9poQHFCk26jhcl_EaHLU73cDO68_mqa1D50z94dEjxXFEArxu_sPRfYbQOGEru4' }}
                                    style={styles.avatar}
                                    imageStyle={{ borderRadius: 60 }}
                                />
                            </View>
                            <View style={styles.verifiedBadge}>
                                <MaterialIcons name="verified" size={16} color={theme.colors.white} />
                            </View>
                        </View>

                        <Text style={styles.name}>{profile?.email ? profile.email.split('@')[0] : 'Chef'}</Text>
                        <Text style={styles.bio}>{profile?.email || 'Language: EN'}</Text>

                        <View style={styles.statsContainer}>
                            <View style={styles.statBox}>
                                <Text style={styles.statValue}>{userRecipes.length}</Text>
                                <Text style={styles.statLabel}>CREATED</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Text style={styles.statValue}>{savedRecipes.length}</Text>
                                <Text style={styles.statLabel}>SAVED</Text>
                            </View>
                        </View>
                    </View>
                )}
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Tabs */}
                <View style={styles.tabsWrapper}>
                    <TouchableOpacity
                        style={activeTab === 'my_recipes' ? styles.tabActive : styles.tabInactive}
                        onPress={() => setActiveTab('my_recipes')}
                    >
                        <Text style={activeTab === 'my_recipes' ? styles.tabTextActive : styles.tabTextInactive}>
                            My Recipes
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={activeTab === 'saved_recipes' ? styles.tabActive : styles.tabInactive}
                        onPress={() => setActiveTab('saved_recipes')}
                    >
                        <Text style={activeTab === 'saved_recipes' ? styles.tabTextActive : styles.tabTextInactive}>
                            Saved Recipes
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Recipes List */}
                <View>
                    {isLoadingRecipes ? (
                        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
                    ) : (
                        <>
                            {displayedRecipes.length === 0 && (
                                <Text style={styles.emptyStateText}>
                                    {activeTab === 'my_recipes'
                                        ? "You haven't created any recipes yet."
                                        : "You haven't saved any recipes yet."}
                                </Text>
                            )}

                            {displayedRecipes.map((recipe) => (
                                <TouchableOpacity
                                    key={recipe.id}
                                    style={styles.recipeCard}
                                    onPress={() => navigation.navigate('RecipeDetail', { id: recipe.id })}
                                >
                                    <Image
                                        source={getImageUrl(recipe.photoUrl)}
                                        style={styles.recipeImage}
                                    />
                                    <View style={styles.recipeContent}>
                                        <Text style={styles.recipeTitle}>{recipe.name}</Text>
                                        <Text style={styles.recipeSubtitle}>
                                            {recipe.author?.username || 'Chef'} • {recipe.cookTime || recipe.prepTime || 20} mins
                                        </Text>
                                        <View style={styles.recipeFooter}>
                                            <View style={styles.ratingRow}>
                                                <MaterialIcons name="favorite" size={16} color={theme.colors.primary} />
                                                <Text style={styles.ratingText}>{recipe.likesCount || 0}</Text>
                                            </View>
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
