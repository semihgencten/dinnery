import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { authStore } from '../stores/auth.store';
import { theme } from '../theme/colors';

export const RootNavigator = observer(() => {
    // If checking token on app start, show loading screen
    // (Assuming you add `isCheckingAuth` to your AuthStore. If not, comment out)
    // if (authStore.isCheckingAuth) {
    //     return (
    //         <View style={styles.loadingContainer}>
    //             <ActivityIndicator size="large" color={theme.colors.primary} />
    //         </View>
    //     );
    // }

    return (
        <NavigationContainer>
            {authStore.isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
});

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.backgroundLight,
    },
});
