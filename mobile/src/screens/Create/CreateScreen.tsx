import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ImageBackground, ActivityIndicator } from 'react-native';
import { styles } from './CreateScreen.styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../theme/colors';
import { launchImageLibrary } from 'react-native-image-picker';
import { Image } from 'react-native-compressor';
import { getCloudinarySignature, uploadPhotoToCloudinary } from '../../api/photoClient';

export const CreateScreen: React.FC = () => {
    const [ingredients, setIngredients] = useState(['']);
    const [instructions, setInstructions] = useState(['']);
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

    const addIngredient = () => setIngredients([...ingredients, '']);
    const addInstruction = () => setInstructions([...instructions, '']);

    const handleCoverPhotoPick = async () => {
        const result = await launchImageLibrary({ mediaType: 'photo', quality: 1 });
        if (result.didCancel || !result.assets || result.assets.length === 0) return;

        const asset = result.assets[0];
        let uri = asset.uri;
        let fileSize = asset.fileSize;
        const fileName = asset.fileName || 'photo.jpg';
        const type = asset.type || 'image/jpeg';

        if (!uri) return;

        setIsUploadingPhoto(true);

        try {
            // 5MB Limit Check
            const MAX_SIZE = 5 * 1024 * 1024;
            if (fileSize && fileSize > MAX_SIZE) {
                console.log('Image exceeds 5MB, compressing...', fileSize);
                uri = await Image.compress(uri, {
                    compressionMethod: 'auto',
                    quality: 0.8,
                });
                console.log('Compressed URI:', uri);
            }

            setPhotoUri(uri);

            // Upload to Cloudinary
            const signatureData = await getCloudinarySignature();
            const secureUrl = await uploadPhotoToCloudinary(uri, fileName, type, signatureData);
            setUploadedPhotoUrl(secureUrl);
        } catch (err) {
            console.error('Error handling cover photo:', err);
        } finally {
            setIsUploadingPhoto(false);
        }
    };

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
                    <TouchableOpacity onPress={handleCoverPhotoPick} disabled={isUploadingPhoto} activeOpacity={0.8}>
                        <ImageBackground
                            source={{ uri: photoUri || 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0i91TZXWilG_iGdss740IzWtSPDezv9fywXU03lD2QSLlbTpZMUviPNmXgE5dDbSw8cDzbPCmUClZFyZRhTCBqaMREFnmEvQmEd8JCJQQVyH612ui16wbdEClJXrko9oQ1Hgg6F-PWHAAImeaQJN0_yMMKXgmiWzYnU1K4iYJE8WVtR9wg2ZE6UICZeF0kNBlANKzWqrssEOjNf0ny8i6Ie0xpYjP3FhDphp3bbRdd0cPmYV1QNAmpVSX_1dqpZCVgwEcrC9xm68' }}
                            style={styles.photoUpload}
                            imageStyle={{ borderRadius: 12 }}
                        >
                            <View style={styles.photoOverlay}>
                                {isUploadingPhoto ? (
                                    <ActivityIndicator size="large" color={theme.colors.white} />
                                ) : (
                                    <MaterialIcons name={photoUri ? "edit" : "add-a-photo"} size={32} color={theme.colors.white} />
                                )}
                                <Text style={styles.photoText}>
                                    {isUploadingPhoto ? 'UPLOADING...' : (photoUri ? 'CHANGE COVER PHOTO' : 'ADD COVER PHOTO')}
                                </Text>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
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
