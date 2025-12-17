import React, { useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';

const ProfileScreen = () => {
    const { user, logout } = useContext(AuthContext);

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: logout
                },
            ]
        );
    };

    const renderMenuItem = (icon, title, onPress, iconColor = '#2D7A4F') => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.menuIcon, { backgroundColor: `${iconColor}15` }]}>
                <Icon name={icon} size={22} color={iconColor} />
            </View>
            <Text style={styles.menuText}>{title}</Text>
            <Icon name="chevron-forward" size={20} color="#95A5A6" />
        </TouchableOpacity>
    );

    const renderStatCard = (icon, label, value, color) => (
        <View style={styles.statCard}>
            <Icon name={icon} size={24} color={color} />
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Icon name="person" size={48} color="#FFFFFF" />
                        </View>
                        <View style={styles.riderBadge}>
                            <Icon name="bicycle" size={16} color="#FFFFFF" />
                        </View>
                    </View>

                    <Text style={styles.userName}>{user?.name || 'Rider Name'}</Text>
                    <Text style={styles.userPhone}>{user?.phone || '+91 98765 43210'}</Text>
                    <Text style={styles.userEmail}>{user?.email || 'rider@example.com'}</Text>

                    <View style={styles.ratingContainer}>
                        <Icon name="star" size={18} color="#FFB800" />
                        <Text style={styles.ratingText}>4.8</Text>
                        <Text style={styles.ratingCount}>(156 ratings)</Text>
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    {renderStatCard('bicycle', 'Total Deliveries', '245', '#2D7A4F')}
                    {renderStatCard('time', 'On-Time Rate', '98%', '#FFB800')}
                    {renderStatCard('trophy', 'Rank', '#12', '#FF6347')}
                </View>

                {/* Menu Items */}
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    {renderMenuItem('person-outline', 'Update Profile', () => { })}
                    {renderMenuItem('lock-closed-outline', 'Change Password', () => { })}
                    {renderMenuItem('notifications-outline', 'Notifications', () => { })}
                </View>

                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    {renderMenuItem('help-circle-outline', 'Help & Support', () => { }, '#3498DB')}
                    {renderMenuItem('document-text-outline', 'Terms & Conditions', () => { }, '#3498DB')}
                    {renderMenuItem('shield-checkmark-outline', 'Privacy Policy', () => { }, '#3498DB')}
                </View>

                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Other</Text>
                    {renderMenuItem('language-outline', 'Language', () => { })}
                    {renderMenuItem('information-circle-outline', 'About', () => { })}
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
                    <Icon name="log-out-outline" size={22} color="#FFFFFF" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                <Text style={styles.version}>Version 1.0.0</Text>

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    header: {
        backgroundColor: '#2D7A4F',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    profileCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#2D7A4F',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#E8F5E9',
    },
    riderBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FF6347',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 4,
    },
    userPhone: {
        fontSize: 15,
        color: '#7F8C8D',
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 14,
        color: '#95A5A6',
        marginBottom: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF8E1',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    ratingText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2C3E50',
        marginLeft: 6,
        marginRight: 4,
    },
    ratingCount: {
        fontSize: 13,
        color: '#7F8C8D',
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
        marginTop: 8,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 11,
        color: '#7F8C8D',
        textAlign: 'center',
        fontWeight: '600',
    },
    menuSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 12,
        paddingLeft: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#2C3E50',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF6347',
        padding: 16,
        borderRadius: 12,
        gap: 8,
        shadowColor: '#FF6347',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    version: {
        textAlign: 'center',
        fontSize: 12,
        color: '#95A5A6',
        marginTop: 20,
    },
});

export default ProfileScreen;
