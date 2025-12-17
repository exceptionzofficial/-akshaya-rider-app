import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const { checkUser } = useContext(AuthContext);

    // Bypass login for UI testing
    const handleTestUI = async () => {
        setLoading(true);

        // Set dummy rider data for testing
        const dummyRider = {
            name: 'Test Rider',
            phone: '9876543210',
            email: 'rider@test.com',
            id: 'TEST123',
        };

        try {
            await AsyncStorage.setItem('riderUser', JSON.stringify(dummyRider));
            await AsyncStorage.setItem('riderToken', 'test-token-123');

            // Wait a bit then trigger Auth refresh
            setTimeout(async () => {
                await checkUser(); // This will update AuthContext and trigger navigation
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error('Error setting test data:', error);
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* Green Header Background */}
                <View style={styles.headerBackground}>
                    <View style={styles.headerContent}>
                        {/* Logo Container */}
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('../assets/logo.png')}
                                style={styles.logoImage}
                                resizeMode="cover"
                            />
                            <View style={styles.riderBadge}>
                                <Text style={styles.riderBadgeText}>🏍️ RIDER</Text>
                            </View>
                        </View>

                        {/* App Name */}
                        <Text style={styles.appName}>சத்வமிர்தம்</Text>
                        <Text style={styles.tagline}>Rider Portal</Text>
                    </View>
                </View>

                {/* White Card Container */}
                <View style={styles.formCard}>
                    <Text style={styles.welcomeText}>Welcome Rider! 🏍️</Text>
                    <Text style={styles.subtitle}>
                        Test the UI without credentials
                    </Text>

                    {/* Test UI Button */}
                    <TouchableOpacity
                        style={[styles.testButton, loading && styles.testButtonDisabled]}
                        onPress={handleTestUI}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text style={styles.testButtonText}>🚀 Enter App (Test Mode)</Text>
                        )}
                    </TouchableOpacity>

                    {/* Info Text */}
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>
                            This bypasses authentication to let you explore all screens.{'\n'}
                            Real login will be added later with backend.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA'
    },
    scrollView: {
        flexGrow: 1
    },
    headerBackground: {
        backgroundColor: '#2D7A4F',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        paddingTop: 60,
        paddingBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    headerContent: {
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: 20,
        alignItems: 'center',
        position: 'relative',
    },
    logoImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FFFFFF',
        borderWidth: 4,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10,
    },
    riderBadge: {
        position: 'absolute',
        bottom: -8,
        right: -8,
        backgroundColor: '#FF6347',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    riderBadgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    appName: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    tagline: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.9,
        fontWeight: '500',
    },
    formCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 32,
        marginHorizontal: 20,
        marginTop: -20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: '#7F8C8D',
        marginBottom: 40,
        fontWeight: '400',
        textAlign: 'center',
    },
    testButton: {
        backgroundColor: '#2D7A4F',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#2D7A4F',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
        marginBottom: 24,
    },
    testButtonDisabled: {
        opacity: 0.7,
    },
    testButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    infoContainer: {
        backgroundColor: '#E8F5E9',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#2D7A4F',
    },
    infoText: {
        fontSize: 13,
        color: '#2C3E50',
        lineHeight: 20,
        textAlign: 'center',
    },
});

export default LoginScreen;
