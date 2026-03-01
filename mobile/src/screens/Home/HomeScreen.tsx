import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, ImageBackground } from 'react-native';
import { styles } from './HomeScreen.styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../theme/colors';

export const HomeScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwU2bN0ieMOJrV3fdict8-4vUhfSzs3xO-ZQPeFD-0rA5AHDP_xZpTIUaRLtMO_b4-GALuHeYuyLo_x47SWQo6QnSpYwaZPf4Ho4q0AtX4cUUnCzC2shZYcfX5JUkvCrlnKVXMOZY_khESgRSIHNs6eaT-Lfj6N8IOr3MEOh-_q-6WKisTEQevwxKGp8wEjSildNtIJejhomeBrQhsn5atFRPEz-Eb4qaPcbZbs65X5kPSzrNbGiucu2wffw3m-UGL4RfiTqNfDgs' }}
                            style={styles.avatar}
                        />
                    </View>
                    <View>
                        <Text style={styles.welcomeText}>Welcome back</Text>
                        <Text style={styles.nameText}>Good morning, Alex</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.notificationButton}>
                    <MaterialIcons name="notifications" size={24} color={theme.colors.textDark} />
                    <View style={styles.notificationBadge} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Search Bar Accent */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchInputWrapper}>
                        <MaterialIcons name="search" size={24} color={theme.colors.textLight} style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search recipes, chefs, or ingredients"
                            placeholderTextColor={theme.colors.textLight}
                        />
                    </View>
                </View>

                {/* Trending Section */}
                <View>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Trending Today</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>See all</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.trendingScroll}
                        snapToInterval={340} // card width (320) + margin (20)
                        decelerationRate="fast"
                    >
                        {/* Trending Card 1 */}
                        <TouchableOpacity activeOpacity={0.9} style={styles.trendingCard}>
                            <ImageBackground
                                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeG03ElEC_MDqLH7LA_DWmUOVOAfvFxYgpkdojF_upaJHGHrsMcb-jOSNi_7kBqgCDGFwYMwbcKRFeJVg23L3n1XhZkTL7jCcZ6zY6XsG0c3GCkR-ilHbWCt_O7dLLwORnacLLuh7rx28J--eOUc6ut7qAhSL3Yu2ZBy4bEYylG681TW6uZ3Q175WZTwcBx9jGiKLlsB8C5AlyAAjW25SZk5GmHO0Sv-G0JIHntHgkGw63pezl1Tq7DpE4dZ-YCsiRGmbJh3l4WnM' }}
                                style={styles.trendingImageBg}
                                imageStyle={styles.trendingImage}
                            >
                                <View style={styles.trendingGradient} />
                                <View style={styles.trendingContent}>
                                    <View style={styles.badgesRow}>
                                        <View style={styles.badgePrimary}>
                                            <Text style={styles.badgePrimaryText}>Fast & Easy</Text>
                                        </View>
                                        <View style={styles.badgeSecondary}>
                                            <Text style={styles.badgeSecondaryText}>Top Rated</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.trendingTitle}>Creamy Garlic Pasta</Text>
                                    <View style={styles.trendingFooter}>
                                        <Text style={styles.trendingFooterText}>
                                            Chef Mario <Text style={styles.dotSep}>•</Text> 4.8★
                                        </Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <MaterialIcons name="schedule" size={14} color="#FFF" style={{ marginRight: 4 }} />
                                            <Text style={styles.trendingFooterText}>20 mins</Text>
                                        </View>
                                    </View>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>

                        {/* Trending Card 2 */}
                        <TouchableOpacity activeOpacity={0.9} style={styles.trendingCard}>
                            <ImageBackground
                                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYRnc9ZTu4pxH17GVM20nI2QzOwhY-mvnRb7JEulkT4PXQ5arJcFqZcQLAN94r5HGbPxn-qdE42yAi3F9UVFy74TI_Wf207RyvpQDBgR6q92ZM4zsa6VIE6VYqF8-Sn1xCisK7wdWlkyz-y1IIv3Ey9DwjXjpCzhNDUjmIym_Z14rdVOc5EjPDG7mz0m-bxduUX8uSNUeSFjnKjdS3sbWaxruZ20YZegCShd04TIo4s32EbCJaXmpTccsRld5UwY6Tl3wp46aGBYc' }}
                                style={styles.trendingImageBg}
                                imageStyle={styles.trendingImage}
                            >
                                <View style={styles.trendingGradient} />
                                <View style={styles.trendingContent}>
                                    <View style={styles.badgesRow}>
                                        <View style={styles.badgePrimary}>
                                            <Text style={styles.badgePrimaryText}>Authentic</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.trendingTitle}>Spicy Thai Curry</Text>
                                    <View style={styles.trendingFooter}>
                                        <Text style={styles.trendingFooterText}>
                                            Sarah Jenkins <Text style={styles.dotSep}>•</Text> 4.9★
                                        </Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <MaterialIcons name="schedule" size={14} color="#FFF" style={{ marginRight: 4 }} />
                                            <Text style={styles.trendingFooterText}>35 mins</Text>
                                        </View>
                                    </View>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* Recommended Feed */}
                <View style={styles.recommendedSection}>
                    <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Recommended for You</Text>

                    {/* Item 1 */}
                    <TouchableOpacity style={styles.recommendedCard}>
                        <Image
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYd92xMt_TDUkXJ0x1DIUnBL8lMky6FanqJtTg8ZAM5Fbh80GSA6pQegAZpZ6WYrsxu5bXFD8n14Z4ioPvZZBYpy6PvHeGhBtMT9mWNecMZOBXxNToVBO3zzWVrgs8VJcbATGPM1WMKwDT-mcGuFeACdZxtSMzTkbVEZbEPhraxyiT5IpqC-rNYHdUJhLItGMmU-7PQmlRH7T4eDVoFdqgZYZRhB90rE1yYmCJV6_xMv2MOuhe2aLkMwi6CySGTS6UTcsx7xR4s_U' }}
                            style={styles.recommendedImage}
                        />
                        <View style={styles.recommendedContent}>
                            <View>
                                <Text style={styles.recommendedTitle}>Grilled Salmon Salad</Text>
                                <Text style={styles.recommendedSubtitle}>HealthyEats • 15 mins</Text>
                            </View>
                            <View style={styles.recommendedFooter}>
                                <View style={styles.ratingRow}>
                                    <MaterialIcons name="star" size={16} color={theme.colors.primary} />
                                    <Text style={styles.ratingText}>4.7</Text>
                                </View>
                                <TouchableOpacity style={styles.bookmarkButton}>
                                    <MaterialIcons name="bookmark" size={18} color={theme.colors.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Item 2 */}
                    <TouchableOpacity style={styles.recommendedCard}>
                        <Image
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5vk5fOVTtHaUBRi74oPsHBOIg20c9KIBWeIhdSN4P5JrrjJQHpqflEsF7rQzBESp6-DyQkkXqVT1vJZfOFH0mztxL-MSFWQN8cxgv3ALj0hxye8JaADdINO3BAOvs61hmNszElIMO7BsaisamU-rliud4xa7YfgbCBsZrMwb_1oMnZHKcx-GnvRJV9f9CNmfaf_PzSHiZ6WyaAs_ZiHDKwUf9R3t2f9O4lE3wt4DdkeVN-7xG-rXqLQ4yjJuPd1ypWO-kamrHc1s' }}
                            style={styles.recommendedImage}
                        />
                        <View style={styles.recommendedContent}>
                            <View>
                                <Text style={styles.recommendedTitle}>Mediterranean Bowl</Text>
                                <Text style={styles.recommendedSubtitle}>GreenKitchen • 10 mins</Text>
                            </View>
                            <View style={styles.recommendedFooter}>
                                <View style={styles.ratingRow}>
                                    <MaterialIcons name="star" size={16} color={theme.colors.primary} />
                                    <Text style={styles.ratingText}>4.9</Text>
                                </View>
                                <TouchableOpacity style={styles.bookmarkButton}>
                                    <MaterialIcons name="bookmark" size={18} color={theme.colors.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Item 3 */}
                    <TouchableOpacity style={styles.recommendedCard}>
                        <Image
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmWoEzkfpVi-QzcvggmcGERwCntwehdxxJqEPP3uLgu41S5hqQJxKBErPKOwe5j13q2EM5kqK1XV4334QHF1xaqjy3--xt1_brwEDKQIQK93Lktn4zSQYIubjmeJN-eIyxCpVQC2Wa8KneHyeLop8K4F-7tyW4IujSh-omjg6n3zj_3Qm_LeYrCwZ17GmSIzRayRThSIrGO31zQYLwumeXQSBz_aLUSxtJDKlPKz9JoLqFuPG8xDXL5ozBDglUGlCVb22sVle-_Tk' }}
                            style={styles.recommendedImage}
                        />
                        <View style={styles.recommendedContent}>
                            <View>
                                <Text style={styles.recommendedTitle}>Artisan Pepperoni Pizza</Text>
                                <Text style={styles.recommendedSubtitle}>Chef Luigi • 45 mins</Text>
                            </View>
                            <View style={styles.recommendedFooter}>
                                <View style={styles.ratingRow}>
                                    <MaterialIcons name="star" size={16} color={theme.colors.primary} />
                                    <Text style={styles.ratingText}>4.5</Text>
                                </View>
                                <TouchableOpacity style={styles.bookmarkButton}>
                                    <MaterialIcons name="bookmark" size={18} color={theme.colors.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};
