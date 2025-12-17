import React, { useState, useContext, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { riderAPI } from '../services/api';

const ActiveOrdersScreen = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [activeOrders, setActiveOrders] = useState([]);

    const fetchActiveOrders = async (isRefreshing = false) => {
        if (!user?.riderId) return;
        if (!isRefreshing) setLoading(true);

        try {
            // Fetch in-progress/assigned orders
            const inProgress = await riderAPI.getAssignedOrders(user.riderId);
            const ready = await riderAPI.getReadyOrders(user.riderId);

            const assigned = (inProgress?.data?.orders || []).concat(
                ready?.data?.orders || []
            );

            setActiveOrders(assigned);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchActiveOrders(true);
    };

    // Polling + focus refresh
    useFocusEffect(
        useCallback(() => {
            fetchActiveOrders();
            const intervalId = setInterval(() => fetchActiveOrders(true), 10000);
            return () => clearInterval(intervalId);
        }, [user?.riderId])
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted': return '#FFB800';
            case 'picked_up': return '#2D7A4F';
            case 'in_transit': return '#3498DB';
            case 'delivered': return '#27AE60';
            default: return '#95A5A6';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'accepted': return 'Accepted';
            case 'picked_up': return 'Picked Up';
            case 'in_transit': return 'In Transit';
            case 'delivered': return 'Delivered';
            default: return 'Pending';
        }
    };

    const renderOrderCard = (order, index) => (
        <View key={`${order.id || 'order'}-${order.status || 'pending'}-${index}`} style={styles.orderCard}>
            {/* Header */}
            <View style={styles.orderHeader}>
                <View>
                    <Text style={styles.orderId}>#{order.id?.slice(-6) || order.id}</Text>
                    <Text style={styles.customerName}>{order.customer?.name || 'Customer'}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
                </View>
            </View>

            {/* Address */}
            <View style={styles.addressContainer}>
                <Icon name="location" size={18} color="#2D7A4F" />
                <Text style={styles.addressText}>
                    {order.customer?.address || order.deliveryAddress || 'Address not available'}
                </Text>
            </View>

            {/* Details */}
            <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                    <Icon name="fast-food-outline" size={16} color="#7F8C8D" />
                    <Text style={styles.detailText}>{order.items?.length || order.itemCount || 0} items</Text>
                </View>
                <View style={styles.detailItem}>
                    <Icon name="cash-outline" size={16} color="#7F8C8D" />
                    <Text style={styles.detailText}>₹{order.totalAmount || order.amount || 0}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Icon name="navigate-outline" size={16} color="#7F8C8D" />
                    <Text style={styles.detailText}>{order.distance || '-'}</Text>
                </View>
            </View>

            {/* Payment Badge */}
            <View style={styles.paymentBadge}>
                <Icon
                    name={order.paymentStatus === 'paid' ? 'checkmark-circle' : 'cash'}
                    size={14}
                    color={order.paymentStatus === 'paid' ? '#27AE60' : '#E67E22'}
                />
                <Text style={[styles.paymentText, { color: order.paymentStatus === 'paid' ? '#27AE60' : '#E67E22' }]}>
                    {order.paymentStatus === 'paid' ? 'Paid Online' : 'Cash on Delivery'}
                </Text>
            </View>

            {/* Actions */}
            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.callButton}>
                    <Icon name="call" size={18} color="#FFFFFF" />
                    <Text style={styles.callButtonText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navigateButton}>
                    <Icon name="navigate" size={18} color="#FFFFFF" />
                    <Text style={styles.navigateButtonText}>Navigate</Text>
                </TouchableOpacity>
                {order.status === 'picked_up' && (
                    <TouchableOpacity style={styles.deliveredButton}>
                        <Icon name="checkmark-done" size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2D7A4F" />
                <Text style={styles.loadingText}>Loading orders...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Active Orders</Text>
                <View style={styles.headerBadge}>
                    <Text style={styles.headerBadgeText}>{activeOrders.length}</Text>
                </View>
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
                {activeOrders.length > 0 ? (
                    activeOrders.map((order, idx) => renderOrderCard(order, idx))
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📦</Text>
                        <Text style={styles.emptyTitle}>No active orders</Text>
                        <Text style={styles.emptyText}>Active orders will appear here</Text>
                    </View>
                )}

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
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    headerBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerBadgeText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    orderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
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
    orderId: {
        fontSize: 13,
        color: '#95A5A6',
        fontWeight: '600',
        marginBottom: 4,
    },
    customerName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        height: 28,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    addressContainer: {
        flexDirection: 'row',
        backgroundColor: '#F8F9FA',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
    },
    addressText: {
        flex: 1,
        fontSize: 14,
        color: '#2C3E50',
        marginLeft: 8,
        fontWeight: '500',
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailText: {
        fontSize: 13,
        color: '#7F8C8D',
        fontWeight: '600',
    },
    paymentBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 16,
    },
    paymentText: {
        fontSize: 13,
        fontWeight: '600',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    callButton: {
        flex: 1,
        backgroundColor: '#3498DB',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 6,
    },
    callButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    navigateButton: {
        flex: 1,
        backgroundColor: '#2D7A4F',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 6,
    },
    navigateButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    deliveredButton: {
        backgroundColor: '#27AE60',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    emptyState: {
        alignItems: 'center',
        padding: 60,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginTop: 40,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#95A5A6',
        textAlign: 'center',
    },
});

export default ActiveOrdersScreen;
