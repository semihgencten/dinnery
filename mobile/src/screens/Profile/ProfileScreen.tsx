import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { styles } from './ProfileScreen.styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../theme/colors';

const COLLECTIONS = [
    { title: 'Quick Dinners', count: 24, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4VIm6UByl1O2DrFsFBVMdeKpvfXwG7BJKQz5fD7GgypzKuObDeaJMO68Y1amXEuuWDyLZKq0Gc1g_TGGtd_z-LDzCWhItUxdlGwnFcKAtYOp3ciFVekrl9EbUFk7tJClMFVDWBb5cvs917eUUbV9AN8OFSgBYSMvtkWQ-hmDPIINI5EwgXBvMF4iWjCdvrSf9KP_UYpauZ3PqfhL_Hpjy3Rq4mk-rG7LeUvWEnqI6Jbmxij3QPHNXj20sM3LIm1ApYGZglOcRLME' },
    { title: 'Summer Salads', count: 18, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxCtMAJBYvEtBGqASIqhQb408YQU84TfD_8Md2kAYE8f3Ghe6o0FwOzSf8Tx0LUqdvFZQxamdHiOSG_biPCdH5dBI21wmI27QVBZ-otFMGobBDo_iwhpl_mvqAAQMDzpFrs5ncJI3qYp38Sx6YiJ4OTXZHQUG-Gneg0BowN5zma72PAcmP34UeccDSOxhg0WnyspYtXreNbGINHqnkEEECund5xL3dUmnAlhL9VxVWnVqqp28nQDpnMYf59kz1QOw1_Xy_SYfeFDU' },
    { title: 'Baking', count: 12, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCodSzaB4mJWdwBCDfpCq_L2VlHSALVnq18P-h0HEhgbODngaacBsV3EjPWxrQ66BFdSOYD8H1fu0LYUx-ejT8Pu8hoH_g3i_xbVMVA28D_ifaMNuCsfYB_noPqU45cwzWadmszmRQXudk_2knWOnKXqy0K5HFtcxyYRkIsN2KBfAcidQJ1yeRgjqUgLiVJKMoPLkMI62o65RbByOssrQ6fTMl2QOecBXA10GgiHAxiNmIzns_h8ylLLm-v3mQK7_s54iSYiPOJVj8' },
];

export const ProfileScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            {/* Header & Profile Section */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity style={styles.settingsBtn}>
                        <MaterialIcons name="settings" size={24} color={theme.colors.textDark} />
                    </TouchableOpacity>
                </View>

                <View style={styles.profileInfo}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarBorder}>
                            <ImageBackground
                                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVZoU2gsZlIQtNkNIF-LrVBFCVtuE3uT4gSOmS6QrY_do6-Q0tZw2yrAgOuFmq2gdvVczREanpFQQeJg5LOQ-KlrnYTPOmdzbCp4xIfOP6ynuqwbKo-92L8wIy-VNmYUsYr04cZEDzdMkMLj2oSCd7qZfzXfdKilTyZhn8fnBXr4q4RXO059araFtv2rtQ2AljFlbzh2DLpNiM9poQHFCk26jhcl_EaHLU73cDO68_mqa1D50z94dEjxXFEArxu_sPRfYbQOGEru4' }}
                                style={styles.avatar}
                                imageStyle={{ borderRadius: 60 }}
                            />
                        </View>
                        <View style={styles.verifiedBadge}>
                            <MaterialIcons name="verified" size={16} color={theme.colors.white} />
                        </View>
                    </View>

                    <Text style={styles.name}>Alex Johnson</Text>
                    <Text style={styles.bio}>Home Cook & Foodie</Text>

                    <View style={styles.statsContainer}>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>12</Text>
                            <Text style={styles.statLabel}>CREATED</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>84</Text>
                            <Text style={styles.statLabel}>SAVED</Text>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Tabs */}
                <View style={styles.tabsWrapper}>
                    <TouchableOpacity style={styles.tabInactive}>
                        <Text style={styles.tabTextInactive}>My Recipes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tabActive}>
                        <Text style={styles.tabTextActive}>Saved Recipes</Text>
                    </TouchableOpacity>
                </View>

                {/* Collections */}
                <View style={styles.collectionsHeader}>
                    <Text style={styles.collectionsTitle}>Collections</Text>
                    <TouchableOpacity style={styles.addCollectionBtn}>
                        <MaterialIcons name="add" size={16} color={theme.colors.primary} />
                        <Text style={styles.addCollectionText}>New</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.grid}>
                    {COLLECTIONS.map((c, i) => (
                        <TouchableOpacity key={i} style={styles.collectionCard}>
                            <View style={styles.collectionImgWrapper}>
                                <ImageBackground source={{ uri: c.img }} style={styles.collectionImg}>
                                    <View style={styles.collectionOverlay}>
                                        <View style={styles.collectionBadge}>
                                            <Text style={styles.collectionBadgeText}>{c.count} ITEMS</Text>
                                        </View>
                                    </View>
                                </ImageBackground>
                            </View>
                            <Text style={styles.collectionTitle}>{c.title}</Text>
                        </TouchableOpacity>
                    ))}

                    {/* Create Collection Placeholder */}
                    <TouchableOpacity style={styles.createCollectionCard}>
                        <MaterialIcons name="create-new-folder" size={32} color={theme.colors.primary} />
                        <Text style={styles.createCollectionText}>Create Collection</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};
