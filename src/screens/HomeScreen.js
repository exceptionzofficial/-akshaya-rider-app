import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    Alert,
    AppState
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { riderAPI } from '../services/api';

const HomeScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [assignedOrders, setAssignedOrders] = useState([]);
    const [stats, setStats] = useState({
        activeOrders: 0,
        todayDeliveries: 0,
    });

    const fetchOrders = async (isRefreshing = false) => {
        if (!user?.riderId) return;

        if (!isRefreshing && assignedOrders.length === 0) setLoading(true); // Initial load only

        try {
            // Fetch orders assigned to this rider (inProgress)
            const response = await riderAPI.getAssignedOrders(user.riderId);
            if (response.success) {
                setAssignedOrders(response.data.orders || []);
                setStats(prev => ({ ...prev, activeOrders: response.data.count || 0 }));
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Polling Logic
    useFocusEffect(
        useCallback(() => {
            fetchOrders(); // Fetch immediately on focus

            const intervalId = setInterval(() => {
                fetchOrders(true); // Silent update
            }, 10000); // Poll every 10 seconds

            return () => clearInterval(intervalId);
        }, [user?.riderId])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrders(true);
    };

    const renderStatCard = (icon, label, value, color, iconBackground) => (
        <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: iconBackground }]}>
                <Icon name={icon} size={24} color={color} />
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );

    const renderOrderCard = (order) => (
        <TouchableOpacity
            key={order.id}
            style={styles.orderCard}
            onPress={() => navigation.navigate('OrderDetail', { order })}
            activeOpacity={0.8}
        >
            <View style={styles.orderHeader}>
                <View>
                    <Text style={styles.orderCustomer}>{order.customer?.name || 'Customer'}</Text>
                    <Text style={styles.orderAddress}>📍 {order.customer?.address || order.address || 'No address'}</Text>
                </View>
                <View style={[styles.orderBadge, { backgroundColor: '#3498DB' }]}>
                    <Text style={styles.orderBadgeText}>ASSIGNED</Text>
                </View>
            </View>

            <View style={styles.orderDetails}>
                <View style={styles.orderDetailItem}>
                    <Icon name="fast-food-outline" size={16} color="#7F8C8D" />
                    <Text style={styles.orderDetailText}>{(order.items || []).length} items</Text>
                </View>
                <View style={styles.orderDetailItem}>
                    <Icon name="cash-outline" size={16} color="#7F8C8D" />
                    <Text style={styles.orderDetailText}>₹{order.totalAmount}</Text>
                </View>
            </View>

            <View style={styles.orderActions}>
                <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => navigation.navigate('OrderDetail', { order })}
                >
                    <Text style={styles.viewButtonText}>View Details & Deliver</Text>
                    <Icon name="arrow-forward" size={16} color="#2D7A4F" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    if (loading && !refreshing && assignedOrders.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2D7A4F" />
                <Text style={styles.loadingText}>Finding assigned orders...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello, {user?.name || 'Rider'}! 🏍️</Text>
                    <Text style={styles.subGreeting}>You are Online</Text>
                </View>

                <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={onRefresh}
                >
                    <Icon name="refresh" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#2D7A4F']}
                        tintColor="#2D7A4F"
                    />
                }
            >
                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    {renderStatCard('bicycle', 'Assigned', stats.activeOrders, '#3498DB', '#E3F2FD')}
                    {renderStatCard('checkmark-done', "Today's Deliveries", stats.todayDeliveries, '#2D7A4F', '#E8F5E9')}
                </View>

                {/* Assigned Orders */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Assigned Orders</Text>
                    </View>

                    {assignedOrders.length > 0 ? (
                        assignedOrders.map(order => renderOrderCard(order))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>⏳</Text>
                            <Text style={styles.emptyTitle}>Waiting for orders...</Text>
                            <Text style={styles.emptyText}>Orders assigned by Admin will appear here automatically.</Text>
                        </View>
                    )}
                </View>

                <View style={{ height: 20 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#7F8C8D',
        fontWeight: '600',
    },
    header: {
        backgroundColor: '#2D7A4F',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        paddingTop: 50,
        paddingBottom: 24,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    greeting: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    subGreeting: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.9,
    },
    refreshButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 20,
        gap: 12,
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
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 11,
        color: '#7F8C8D',
        textAlign: 'center',
        fontWeight: '600',
    },
    section: {
        padding: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2C3E50',
    },
    seeAllText: {
        fontSize: 14,
        color: '#2D7A4F',
        fontWeight: '600',
    },
    orderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    orderCustomer: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 4,
    },
    orderAddress: {
        fontSize: 13,
        color: '#7F8C8D',
    },
    orderBadge: {
        backgroundColor: '#FF6347',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        height: 24,
    },
    orderBadgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '800',
    },
    orderDetails: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    orderDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    orderDetailText: {
        fontSize: 13,
        color: '#7F8C8D',
        fontWeight: '600',
    },
    orderActions: {
        flexDirection: 'row',
        gap: 12,
    },
    acceptButton: {
        flex: 1,
        backgroundColor: '#2D7A4F',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 6,
    },
    acceptButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    viewButton: {
        flex: 1,
        backgroundColor: '#E8F5E9',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 6,
    },
    viewButtonText: {
        color: '#2D7A4F',
        fontSize: 14,
        fontWeight: '700',
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#95A5A6',
        textAlign: 'center',
    },
    quickActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12,
    },
    quickActionCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    quickActionText: {
        fontSize: 12,
        color: '#2C3E50',
        fontWeight: '600',
        marginTop: 8,
        textAlign: 'center',
    },
});

export default HomeScreen;
