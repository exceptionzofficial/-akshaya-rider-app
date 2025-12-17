import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const OrderHistoryScreen = () => {
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [historyOrders, setHistoryOrders] = useState([]);

    useEffect(() => {
        fetchOrderHistory();
    }, []);

    const fetchOrderHistory = async () => {
        try {
            setLoading(true);
            // API call placeholder - simulate data
            setHistoryOrders([
                {
                    id: 'ORD089',
                    date: '2024-12-01',
                    customerName: 'Anita Desai',
                    items: 2,
                    amount: 195,
                    earnings: 25,
                    deliveryTime: '18 mins',
                },
                {
                    id: 'ORD088',
                    date: '2024-12-01',
                    customerName: 'Vijay Kumar',
                    items: 4,
                    amount: 320,
                    earnings: 35,
                    deliveryTime: '22 mins',
                },
                {
                    id: 'ORD087',
                    date: '2024-11-30',
                    customerName: 'Sunita Patel',
                    items: 1,
                    amount: 85,
                    earnings: 15,
                    deliveryTime: '12 mins',
                },
                {
                    id: 'ORD086',
                    date: '2024-11-30',
                    customerName: 'Rajesh Mehta',
                    items: 3,
                    amount: 275,
                    earnings: 30,
                    deliveryTime: '25 mins',
                },
            ]);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchOrderHistory();
        setRefreshing(false);
    };

    const groupOrdersByDate = () => {
        const grouped = {};
        historyOrders.forEach(order => {
            if (!grouped[order.date]) {
                grouped[order.date] = [];
            }
            grouped[order.date].push(order);
        });
        return grouped;
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        }
    };

    const renderOrderCard = (order) => (
        <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <View style={styles.orderInfo}>
                    <Text style={styles.orderId}>#{order.id}</Text>
                    <Text style={styles.customerName}>{order.customerName}</Text>
                </View>
                <View style={styles.earningsContainer}>
                    <Text style={styles.earningsLabel}>Earned</Text>
                    <Text style={styles.earningsAmount}>₹{order.earnings}</Text>
                </View>
            </View>

            <View style={styles.orderDetails}>
                <View style={styles.detailItem}>
                    <Icon name="fast-food-outline" size={14} color="#7F8C8D" />
                    <Text style={styles.detailText}>{order.items} items</Text>
                </View>
                <View style={styles.detailItem}>
                    <Icon name="cash-outline" size={14} color="#7F8C8D" />
                    <Text style={styles.detailText}>₹{order.amount}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Icon name="time-outline" size={14} color="#7F8C8D" />
                    <Text style={styles.detailText}>{order.deliveryTime}</Text>
                </View>
            </View>

            <View style={styles.statusContainer}>
                <Icon name="checkmark-circle" size={16} color="#27AE60" />
                <Text style={styles.statusText}>Delivered Successfully</Text>
            </View>
        </View>
    );

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2D7A4F" />
                <Text style={styles.loadingText}>Loading history...</Text>
            </View>
        );
    }

    const groupedOrders = groupOrdersByDate();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Order History</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <Icon name="filter" size={20} color="#FFFFFF" />
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
                {Object.keys(groupedOrders).length > 0 ? (
                    Object.keys(groupedOrders).map(date => (
                        <View key={date} style={styles.dateSection}>
                            <Text style={styles.dateHeader}>{formatDate(date)}</Text>
                            {groupedOrders[date].map(order => renderOrderCard(order))}
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📝</Text>
                        <Text style={styles.emptyTitle}>No delivery history</Text>
                        <Text style={styles.emptyText}>Your completed deliveries will appear here</Text>
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
    filterButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    dateSection: {
        marginBottom: 24,
    },
    dateHeader: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 12,
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
    orderInfo: {
        flex: 1,
    },
    orderId: {
        fontSize: 12,
        color: '#95A5A6',
        fontWeight: '600',
        marginBottom: 4,
    },
    customerName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2C3E50',
    },
    earningsContainer: {
        alignItems: 'flex-end',
    },
    earningsLabel: {
        fontSize: 11,
        color: '#7F8C8D',
        marginBottom: 2,
    },
    earningsAmount: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2D7A4F',
    },
    orderDetails: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 12,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailText: {
        fontSize: 12,
        color: '#7F8C8D',
        fontWeight: '600',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusText: {
        fontSize: 13,
        color: '#27AE60',
        fontWeight: '600',
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

export default OrderHistoryScreen;
