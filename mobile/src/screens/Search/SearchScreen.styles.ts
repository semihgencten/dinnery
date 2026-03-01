import { StyleSheet } from 'react-native';
import { theme } from '../../theme/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.backgroundLight,
    },
    header: {
        paddingTop: 48,
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: theme.colors.white,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    brand: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    brandTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 8,
        color: theme.colors.textDark,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(19, 236, 19, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        borderWidth: 1,
        borderColor: theme.colors.borderLight,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 48,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: theme.colors.textDark,
    },
    filtersContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    filterActive: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    filterInactive: {
        backgroundColor: theme.colors.white,
        borderWidth: 1,
        borderColor: theme.colors.borderLight,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    filterTextActive: {
        color: theme.colors.white,
        fontWeight: '600',
        fontSize: 14,
    },
    filterTextInactive: {
        color: theme.colors.textDark,
        fontWeight: '500',
        fontSize: 14,
    },
    content: {
        padding: 16,
        paddingBottom: 100,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.textDark,
    },
    seeAll: {
        color: theme.colors.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    suggestionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    suggestionChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(19, 236, 19, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(19, 236, 19, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    suggestionText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.textDark,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridCard: {
        width: '48%',
        marginBottom: 16,
    },
    cardImageContainer: {
        width: '100%',
        aspectRatio: 4 / 5,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: theme.colors.borderLight,
        marginBottom: 8,
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    bookmarkBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 16,
        padding: 6,
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        color: theme.colors.textDark,
        lineHeight: 18,
    },
    cardTime: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    timeText: {
        fontSize: 10,
        fontWeight: '500',
        color: theme.colors.textLight,
        marginLeft: 4,
    }
});
