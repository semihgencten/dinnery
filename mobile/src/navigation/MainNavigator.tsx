import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../theme/colors';

// Screens
import { HomeScreen } from '../screens/Home/HomeScreen';
import { SearchScreen } from '../screens/Search/SearchScreen';
import { CreateScreen } from '../screens/Create/CreateScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';

const ImportScreen = () => <View style={{ flex: 1, backgroundColor: theme.colors.backgroundLight }} />;

const Tab = createBottomTabNavigator();

export const MainNavigator = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarShowLabel: true,
                    tabBarActiveTintColor: theme.colors.primary,
                    tabBarInactiveTintColor: theme.colors.textLight,
                    tabBarStyle: styles.tabBar,
                    tabBarLabelStyle: styles.tabLabel,
                    tabBarIcon: ({ color, size, focused }) => {
                        let iconName: any = 'home';
                        if (route.name === 'Home') iconName = 'home';
                        else if (route.name === 'Search') iconName = 'search';
                        else if (route.name === 'Create') iconName = 'add';
                        else if (route.name === 'Import') iconName = 'public';
                        else if (route.name === 'Profile') iconName = 'person';

                        if (route.name === 'Create') {
                            return (
                                <View style={styles.createButtonContainer}>
                                    <View style={styles.createButton}>
                                        <MaterialIcons name="add" size={24} color={theme.colors.backgroundDark} />
                                    </View>
                                </View>
                            );
                        }

                        return <MaterialIcons name={iconName} size={28} color={color} />;
                    },
                })}
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Search" component={SearchScreen} />
                <Tab.Screen name="Create" component={CreateScreen} options={{
                    tabBarLabel: ({ color }) => <Text style={[styles.tabLabel, { color }]}>CREATE</Text>
                }} />
                <Tab.Screen name="Import" component={ImportScreen} />
                <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        borderTopWidth: 1,
        borderTopColor: 'rgba(19, 236, 19, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        elevation: 0,
        height: 80,
        paddingBottom: 24,
        paddingTop: 8,
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 4,
    },
    createButtonContainer: {
        top: -20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    createButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#ffffff',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 5,
    }
});
