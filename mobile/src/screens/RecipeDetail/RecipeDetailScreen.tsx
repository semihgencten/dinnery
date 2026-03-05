import React, { useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useRoute, useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { recipesStore } from '../../stores/recipes.store';
import { authStore } from '../../stores/auth.store';
import { theme } from '../../theme/colors';
import { styles } from './RecipeDetailScreen.styles';

export const RecipeDetailScreen = observer(() => {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { id } = route.params || {};

    useEffect(() => {
        if (id) {
            recipesStore.fetchRecipe(id);
            recipesStore.fetchComments(id);
        }
    }, [id]);

    const handleSave = async () => {
        if (!authStore.isAuthenticated) {
            return;
        }

        const recipe = recipesStore.currentRecipe;
        if (recipe) {
            if (recipe.isSaved) {
                await recipesStore.unsaveRecipe(recipe.id);
            } else {
                await recipesStore.saveRecipe(recipe.id);
            }
        }
    };

    if (recipesStore.isLoadingRecipe || !recipesStore.currentRecipe) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    const recipe = recipesStore.currentRecipe;
    const comments = recipesStore.currentRecipeComments;

    const instructionSteps = recipe.instructions
        ? recipe.instructions.split('\n').filter(step => step.trim().length > 0)
        : [];

    return (
        <View style={styles.container}>
            <View style={styles.headerBar}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color={theme.colors.textDark} />
                </TouchableOpacity>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.headerActionButton}>
                        <MaterialIcons name="share" size={24} color={theme.colors.textDark} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerActionButton} onPress={handleSave}>
                        <MaterialIcons
                            name={recipe.isSaved ? "bookmark" : "bookmark-border"}
                            size={24}
                            color={recipe.isSaved ? theme.colors.primary : theme.colors.textDark}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {recipe.photoUrl ? (
                    <Image source={{ uri: recipe.photoUrl }} style={styles.coverImage} />
                ) : (
                    <View style={[styles.coverImage, { backgroundColor: '#e0e0e0' }]} />
                )}

                <View style={styles.titleSection}>
                    <Text style={styles.title}>{recipe.name}</Text>

                    <View style={styles.metaInfo}>
                        {recipe.category && (
                            <View style={styles.metaItem}>
                                <MaterialIcons name="local-offer" size={16} color={theme.colors.textLight} />
                                <Text style={styles.metaText}>{recipe.category}</Text>
                            </View>
                        )}
                        {recipe.prepTime && (
                            <View style={styles.metaItem}>
                                <MaterialIcons name="schedule" size={16} color={theme.colors.textLight} />
                                <Text style={styles.metaText}>{recipe.prepTime} min</Text>
                            </View>
                        )}
                        {recipe.cookTime && (
                            <View style={styles.metaItem}>
                                <MaterialIcons name="whatshot" size={16} color={theme.colors.textLight} />
                                <Text style={styles.metaText}>{recipe.cookTime} min</Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ingredients</Text>
                    {recipe.ingredients && recipe.ingredients.length > 0 ? (
                        recipe.ingredients.map((ing, index) => (
                            <View key={index} style={styles.ingredientItem}>
                                <View style={styles.ingredientDot} />
                                <Text style={styles.ingredientQuantity}>{ing.quantity} {ing.unit}</Text>
                                <Text style={styles.ingredientName}>
                                    {ing.name} {ing.notes ? `(${ing.notes})` : ''}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>No ingredients listed.</Text>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Instructions</Text>
                    {instructionSteps.length > 0 ? (
                        instructionSteps.map((step, index) => (
                            <View key={index} style={styles.instructionStep}>
                                <View style={styles.stepNumberContainer}>
                                    <Text style={styles.stepNumber}>{index + 1}</Text>
                                </View>
                                <Text style={styles.stepText}>{step}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>No instructions provided.</Text>
                    )}
                </View>

                <View style={[styles.section, styles.lastSection]}>
                    <Text style={styles.sectionTitle}>Comments ({recipe.commentsCount || 0})</Text>
                    {recipesStore.isLoadingComments ? (
                        <ActivityIndicator color={theme.colors.primary} />
                    ) : comments.length > 0 ? (
                        comments.map(comment => (
                            <View key={comment.id} style={styles.commentItem}>
                                <View style={styles.commentHeader}>
                                    <Text style={styles.commentUser}>User #{comment.userId}</Text>
                                    <Text style={styles.commentDate}>
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </Text>
                                </View>
                                <Text style={styles.commentText}>{comment.text}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>No comments yet.</Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
});
