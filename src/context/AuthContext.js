import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { riderAPI } from '../services/api';
import NotificationService from '../services/notificationService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const normalizeRider = (rider) => {
        if (!rider) return rider;
        const riderId = rider.riderId || rider.id;
        return { ...rider, riderId };
    };

    useEffect(() => {
        checkUser();
        initializeNotifications();

        return () => {
            NotificationService.unListen();
        };
    }, []);

    const initializeNotifications = async () => {
        try {
            await NotificationService.requestUserPermission();
            NotificationService.listen();
            
            // Set callback for when notifications arrive
            NotificationService.setOnNotificationCallback((remoteMessage) => {
                console.log('Notification callback triggered:', remoteMessage);
                // Optionally refresh orders or trigger UI updates here
            });
        } catch (error) {
            console.error('Notification initialization error:', error);
        }
    };

    const checkUser = async () => {
        try {
            const userData = await AsyncStorage.getItem('riderUser');
            if (userData) {
                const parsed = normalizeRider(JSON.parse(userData));
                setUser(parsed);
                // persist normalized shape for future reads
                await AsyncStorage.setItem('riderUser', JSON.stringify(parsed));
            }
        } catch (error) {
            console.error('Error checking user:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (phone, password) => {
        try {
            const response = await riderAPI.login(phone, password);

            if (response.success) {
                const userData = normalizeRider(response.data.rider);
                const token = response.data.token;

                await AsyncStorage.setItem('riderUser', JSON.stringify(userData));
                await AsyncStorage.setItem('riderToken', token);
                setUser(userData);
                // Sync FCM Token
                NotificationService.getFCMToken();
                return { success: true };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: error.message || 'Login failed' };
        }
    };

    const register = async (riderData) => {
        try {
            const response = await riderAPI.register(riderData);

            if (response.success) {
                const userData = normalizeRider(response.data.rider);
                const token = response.data.token;

                await AsyncStorage.setItem('riderUser', JSON.stringify(userData));
                await AsyncStorage.setItem('riderToken', token);
                setUser(userData);
                // Sync FCM Token
                NotificationService.getFCMToken();
                return { success: true };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: error.message || 'Registration failed' };
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('riderUser');
            await AsyncStorage.removeItem('riderToken');
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, checkUser }}>
            {children}
        </AuthContext.Provider>
    );
};
