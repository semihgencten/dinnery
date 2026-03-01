import { StyleSheet, Platform } from 'react-native';
import { theme } from '../../theme/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.backgroundLight,
    },
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 16,
        backgroundColor: 'rgba(246, 248, 246, 0.9)',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        overflow: 'hidden',
        marginRight: 12,
        backgroundColor: 'rgba(19, 236, 19, 0.2)',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    welcomeText: {
        fontSize: 12,
        color: theme.colors.textLight,
        fontWeight: '500',
    },
    nameText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.textDark,
    },
    notificationButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    notificationBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.primary,
        borderWidth: 2,
        borderColor: theme.colors.white,
    },

    // Content
    scrollContent: {
        paddingBottom: 120, // ample space for bottom nav
    },

    // Search
    searchContainer: {
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: theme.colors.textDark,
    },

    // Trending Section
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.textDark,
        letterSpacing: -0.5,
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.primary,
    },
    trendingScroll: {
        paddingLeft: 24,
        paddingRight: 4,
    },
    trendingCard: {
        width: 320,
        height: 256,
        borderRadius: 16,
        marginRight: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    trendingImageBg: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    trendingImage: {
        borderRadius: 16,
    },
    trendingGradient: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    trendingContent: {
        padding: 20,
    },
    badgesRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    badgePrimary: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 8,
    },
    badgePrimaryText: {
        color: theme.colors.backgroundDark,
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    badgeSecondary: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    badgeSecondaryText: {
        color: theme.colors.white,
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    trendingTitle: {
        color: theme.colors.white,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    trendingFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    trendingFooterText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },
    dotSep: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        marginHorizontal: 4,
    },

    // Recommended Section
    recommendedSection: {
        paddingHorizontal: 24,
        marginTop: 32,
    },
    recommendedCard: {
        flexDirection: 'row',
        backgroundColor: theme.colors.white,
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: theme.colors.borderLight,
        marginBottom: 16,
    },
    recommendedImage: {
        width: 96,
        height: 96,
        borderRadius: 8,
    },
    recommendedContent: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    recommendedTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.textDark,
        lineHeight: 20,
    },
    recommendedSubtitle: {
        fontSize: 12,
        color: theme.colors.textLight,
        marginTop: 4,
    },
    recommendedFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.textDark,
        marginLeft: 4,
    },
    bookmarkButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(19, 236, 19, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
