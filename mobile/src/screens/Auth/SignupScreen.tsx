import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { observer } from 'mobx-react-lite';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './SignupScreen.styles';
import { theme } from '../../theme/colors';
import { authStore } from '../../stores/auth.store';

type AuthStackParamList = {
    Login: undefined;
    Signup: undefined;
};

export const SignupScreen = observer(() => {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const insets = useSafeAreaInsets();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        try {
            await authStore.register({ email, password, language: 'en' });
            // Instead of auto-login, we could do it manually or simply redirect.
            Alert.alert('Success', 'Account created successfully! Please log in.');
            navigation.navigate('Login');
        } catch (e: any) {
            console.log('Register error', e);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join Dinnery today.</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <MaterialIcons name="email" size={24} color={theme.colors.textLight} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email address"
                            placeholderTextColor={theme.colors.textLight}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <MaterialIcons name="lock" size={24} color={theme.colors.textLight} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor={theme.colors.textLight}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>
                </View>

                {authStore.error && (
                    <Text style={styles.errorText}>{authStore.error}</Text>
                )}

                <TouchableOpacity
                    style={[styles.button, authStore.isLoading && styles.buttonDisabled]}
                    onPress={handleSignup}
                    disabled={authStore.isLoading}
                >
                    {authStore.isLoading ? (
                        <ActivityIndicator color={theme.colors.white} />
                    ) : (
                        <Text style={styles.buttonText}>Sign up</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.linkText}>Log in</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
});
