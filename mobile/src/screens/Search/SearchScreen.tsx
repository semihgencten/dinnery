import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { styles } from './SearchScreen.styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../theme/colors';

const FILTERS = ['All', 'Vegan', 'High Protein', 'Breakfast', 'Under 30 mins', 'Gluten Free'];
const SUGGESTIONS = [
    { icon: 'eco', name: 'Avocado' },
    { icon: 'egg', name: 'Eggs' },
    { icon: 'set-meal', name: 'Salmon' }, // "nutrition" used in design, mapping to set-meal
    { icon: 'bakery-dining', name: 'Tofu' },
    { icon: 'spa', name: 'Spinach' },
];

const DISCOVERIES = [
    { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyaxdzxJYxEsdWMX0U1RGWEKTf76qtflKxjdBDjgCxrPA433rH3np5Mmlbtua_djArmUWejIjkCqy_ozNrA1lPRdpGwrAFbK31TWqbWPoh4GOQCkRtGZnefPIhQIKeUOzbVbfI77PfL7hAHAVmBlBt2SFf-6XT3oNtythzwyxEl71Zsc5bMspaskHUhwZwHqZkbI4KNRwxorosibnsFiCXjDTui9Mc3vz2ZuJONdwXgMsVxCCXzuvxHmTwzwNqLJVeeIwc7iBxVAQ', title: 'Green Quinoa Power Bowl', time: '15 mins', saved: false },
    { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaPBE3MBIJawbDb-legVq8IaFsIDAreKJ5Xjmn0iZtIdkfu4RsgHriRFshsM2X2ZJI9N1YpT3OqMzcHSrjvwRxmw4O8a-ZG6xuZinImWe_-b4gtdxukSO1GGt329AjWDdGvVJYm5SlV6UaKssRvIw83_v-SVdGCGQf49MSqnKIl6JRMAo_HMP4g_eLIwT4QYEM5I-EdSHRmkkIDy-qSUohD5PfkT_-tirh1QEEBAnJSp4HE24A_PCE1YGvQy3VTG_t_Tlh7-Gdzk0', title: 'Creamy Garlic Mushroom Pasta', time: '25 mins', saved: false },
    { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwGljnFxxUp4hK37OoMjA16M3teHVqkMeGWNVlHIAJVWZhwvDGmEuoqcdMCd_W9LecGoYSps8nxkB94Qtd0hCyCq0dL3nQHz_VezBOBR-DVZ76xLI7Dv4-8-kIeKRlHU44AOfbyYbaOE7W52YUYwdoKGmOuxX4SVmh9LRogAP9anZUr22lTwLULcLp_rnYFE2JCyPm_CFBYlkohFTdQpxSSTJ8u204in7bCoal6DNUM8Pmua4VsERxqLzezVZMFzZ58oyWJiQgPEo', title: 'Berry Almond Butter Toast', time: '10 mins', saved: false },
    { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7A7TJoN9n0o7EE8A2Ccq3NJXwQVtPiNR8B-7Q_kVjpf3DYWcPtqD534QvGER84ThM5ZNSxy08N9dudtoTtks62r-tCL4pzChyyNe-D-0t8PJDQTcWlq6oTQ0bvPrO5NL5ph1t_a1ulPNAzRhDxGEBeFA8X9BZ6QjoTm2AtIsc6gm49Noi-8iKTa6NjbhMeNQO-o8rGDSh0t533Hzv8n1pCAG_fkiqnfkCoWxGjR2pTceXqYc1Jwz1rKoBj7Gh_MWS_w8czv8bb4c', title: 'Tropical Morning Smoothie Bowl', time: '8 mins', saved: true },
];

export const SearchScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            {/* Header & Search */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View style={styles.brand}>
                        <MaterialIcons name="restaurant-menu" size={28} color={theme.colors.primary} />
                        <Text style={styles.brandTitle}>Dinnery</Text>
                    </View>
                    <TouchableOpacity style={styles.iconButton}>
                        <MaterialIcons name="notifications" size={24} color={theme.colors.primary} />
                    </TouchableOpacity>
                </View>
                <View style={styles.searchBar}>
                    <MaterialIcons name="search" size={20} color={theme.colors.textLight} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search recipes, ingredients..."
                        placeholderTextColor={theme.colors.textLight}
                    />
                </View>
            </View>

            {/* Filter Chips */}
            <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContainer}>
                    {FILTERS.map((f, i) => (
                        <TouchableOpacity key={f} style={i === 0 ? styles.filterActive : styles.filterInactive}>
                            <Text style={i === 0 ? styles.filterTextActive : styles.filterTextInactive}>{f}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Suggested Ingredients */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Suggested Ingredients</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See all</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.suggestionsGrid}>
                    {SUGGESTIONS.map(s => (
                        <TouchableOpacity key={s.name} style={styles.suggestionChip}>
                            <MaterialIcons name={s.icon as any} size={16} color={theme.colors.primary} />
                            <Text style={styles.suggestionText}>{s.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Recipe Grid */}
                <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 16 }]}>Recent Discoveries</Text>
                <View style={styles.grid}>
                    {DISCOVERIES.map(d => (
                        <View key={d.title} style={styles.gridCard}>
                            <View style={styles.cardImageContainer}>
                                <Image source={{ uri: d.img }} style={styles.cardImage} />
                                <TouchableOpacity style={styles.bookmarkBtn}>
                                    <MaterialIcons
                                        name={d.saved ? 'bookmark' : 'bookmark-border'}
                                        size={20}
                                        color={d.saved ? theme.colors.primary : theme.colors.textDark}
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.cardTitle} numberOfLines={2}>{d.title}</Text>
                            <View style={styles.cardTime}>
                                <MaterialIcons name="schedule" size={12} color={theme.colors.textLight} />
                                <Text style={styles.timeText}>{d.time}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};
