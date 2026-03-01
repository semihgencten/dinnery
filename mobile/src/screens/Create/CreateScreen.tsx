import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { styles } from './CreateScreen.styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../theme/colors';

export const CreateScreen: React.FC = () => {
    const [ingredients, setIngredients] = useState(['']);
    const [instructions, setInstructions] = useState(['']);

    const addIngredient = () => setIngredients([...ingredients, '']);
    const addInstruction = () => setInstructions([...instructions, '']);

    return (
        <View style={styles.container}>
            {/* Top App Bar */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton}>
                    <MaterialIcons name="close" size={24} color={theme.colors.textDark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Recipe</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Cover Photo Upload */}
                <View style={styles.photoContainer}>
                    <ImageBackground
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0i91TZXWilG_iGdss740IzWtSPDezv9fywXU03lD2QSLlbTpZMUviPNmXgE5dDbSw8cDzbPCmUClZFyZRhTCBqaMREFnmEvQmEd8JCJQQVyH612ui16wbdEClJXrko9oQ1Hgg6F-PWHAAImeaQJN0_yMMKXgmiWzYnU1K4iYJE8WVtR9wg2ZE6UICZeF0kNBlANKzWqrssEOjNf0ny8i6Ie0xpYjP3FhDphp3bbRdd0cPmYV1QNAmpVSX_1dqpZCVgwEcrC9xm68' }}
                        style={styles.photoUpload}
                        imageStyle={{ borderRadius: 12 }}
                    >
                        <View style={styles.photoOverlay}>
                            <MaterialIcons name="add-a-photo" size={32} color={theme.colors.white} />
                            <Text style={styles.photoText}>ADD COVER PHOTO</Text>
                        </View>
                    </ImageBackground>
                </View>

                {/* Basic Info */}
                <View style={styles.section}>
                    <Text style={styles.label}>RECIPE TITLE</Text>
                    <TextInput style={styles.input} placeholder="e.g. Grandma's Secret Pasta" placeholderTextColor={theme.colors.textLight} />

                    <Text style={[styles.label, { marginTop: 16 }]}>DESCRIPTION</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Tell us about your dish..."
                        placeholderTextColor={theme.colors.textLight}
                        multiline
                        numberOfLines={3}
                    />

                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                            <Text style={styles.label}>PREP TIME (MIN)</Text>
                            <View style={styles.inputWithIcon}>
                                <MaterialIcons name="schedule" size={20} color={theme.colors.primary} style={styles.inputIcon} />
                                <TextInput style={styles.inputVal} placeholder="30" keyboardType="numeric" />
                            </View>
                        </View>
                        <View style={{ flex: 1, marginLeft: 8 }}>
                            <Text style={styles.label}>SERVINGS</Text>
                            <View style={styles.inputWithIcon}>
                                <MaterialIcons name="groups" size={20} color={theme.colors.primary} style={styles.inputIcon} />
                                <TextInput style={styles.inputVal} placeholder="4" keyboardType="numeric" />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Ingredients */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <MaterialIcons name="shopping-basket" size={24} color={theme.colors.primary} />
                        <Text style={styles.sectionTitle}>Ingredients</Text>
                    </View>
                    {ingredients.map((ing, i) => (
                        <View key={i} style={styles.listItem}>
                            <TextInput style={styles.listInput} placeholder="e.g. 200g Flour" placeholderTextColor={theme.colors.textLight} />
                            <TouchableOpacity style={styles.deleteBtn}>
                                <MaterialIcons name="delete" size={24} color="#ef4444" />
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
                        <MaterialIcons name="add-circle" size={20} color={theme.colors.primary} />
                        <Text style={styles.addButtonText}>Add Ingredient</Text>
                    </TouchableOpacity>
                </View>

                {/* Instructions */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <MaterialIcons name="restaurant-menu" size={24} color={theme.colors.primary} />
                        <Text style={styles.sectionTitle}>Instructions</Text>
                    </View>
                    {instructions.map((inst, i) => (
                        <View key={i} style={styles.instructionItem}>
                            <View style={styles.stepCircle}>
                                <Text style={styles.stepText}>{i + 1}</Text>
                            </View>
                            <TextInput
                                style={[styles.listInput, styles.instructionInput]}
                                placeholder={`Step ${i + 1} details...`}
                                placeholderTextColor={theme.colors.textLight}
                                multiline
                            />
                        </View>
                    ))}
                    <TouchableOpacity style={styles.addButton} onPress={addInstruction}>
                        <MaterialIcons name="add-task" size={20} color={theme.colors.primary} />
                        <Text style={styles.addButtonText}>Add Step</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};
