import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    StatusBar,
} from 'react-native';

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        if (!navigation) return;

        const timer = setTimeout(() => {
            navigation.replace('Login');
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#2D7A4F" barStyle="light-content" />

            {/* Logo */}
            <View style={styles.logoContainer}>
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logoImage}
                    resizeMode="cover"
                />
                <View style={styles.riderBadge}>
                    <Text style={styles.riderBadgeText}>RIDER</Text>
                </View>
            </View>

            {/* App Name */}
            <Text style={styles.appName}>சத்வமிர்தம்</Text>
            <Text style={styles.tagline}>Rider Portal</Text>

            {/* Loading Indicator */}
            <View style={styles.loadingContainer}>
                <View style={styles.loadingDot} />
                <View style={[styles.loadingDot, styles.loadingDotDelay1]} />
                <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2D7A4F',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        position: 'relative',
        marginBottom: 32,
    },
    logoImage: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#FFFFFF',
        borderWidth: 5,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 15,
    },
    riderBadge: {
        position: 'absolute',
        bottom: -5,
        right: -5,
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
        letterSpacing: 1,
    },
    appName: {
        fontSize: 36,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 8,
        letterSpacing: 1,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    tagline: {
        fontSize: 16,
        color: '#FFFFFF',
        opacity: 0.95,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    loadingContainer: {
        flexDirection: 'row',
        marginTop: 50,
    },
    loadingDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        marginHorizontal: 5,
    },
    loadingDotDelay1: {
        opacity: 0.6,
    },
    loadingDotDelay2: {
        opacity: 0.4,
    },
});

export default SplashScreen;
