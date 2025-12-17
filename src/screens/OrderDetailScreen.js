import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Linking,
    Platform,
    Alert,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { riderAPI } from '../services/api';

const OrderDetailScreen = ({ route, navigation }) => {
    const { order } = route.params;
    const [loading, setLoading] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(order.status);

    const openMap = () => {
        const address = order.customer?.address || order.address; // Fallback
        const url = Platform.select({
            ios: `maps:0,0?q=${address}`,
            android: `geo:0,0?q=${address}`,
        });
        Linking.openURL(url);
    };

    const callCustomer = () => {
        const phone = order.customer?.phone;
        if (phone) {
            Linking.openURL(`tel:${phone}`);
        } else {
            Alert.alert('Error', 'Customer phone number not available');
        }
    };

    const updateStatus = async (newStatus) => {
        setLoading(true);
        try {
            const response = await riderAPI.updateOrderStatus(order.id, newStatus);
            if (response.success) {
                setCurrentStatus(newStatus);
                Alert.alert('Success', `Order marked as ${newStatus}`);
                if (newStatus === 'delivered') {
                    navigation.goBack();
                }
            } else {
                Alert.alert('Error', response.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Update status error:', error);
            Alert.alert('Error', 'Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order #{order.id?.slice(-6)}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* Status Banner */}
                <View style={styles.statusBanner}>
                    <Icon name="time-outline" size={24} color="#2D7A4F" />
                    <Text style={styles.statusText}>
                        Status: {currentStatus === 'inProgress' ? 'In Progress' : currentStatus}
                    </Text>
                </View>

                {/* Customer Details */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Customer Details</Text>
                    <View style={styles.customerRow}>
                        <View style={styles.customerInfo}>
                            <Text style={styles.customerName}>{order.customer?.name || 'Unknown'}</Text>
                            <Text style={styles.customerAddress}>{order.customer?.address || order.address}</Text>
                        </View>
                        <View style={styles.customerActions}>
                            <TouchableOpacity style={styles.actionIcon} onPress={callCustomer}>
                                <Icon name="call" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionIcon} onPress={openMap}>
                                <Icon name="navigate" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Order Items */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Order Items</Text>
                    {(order.items || []).map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName}>
                                    {item.name} {item.quantity ? `x${item.quantity}` : ''}
                                </Text>
                                {item.items && (
                                    <Text style={styles.itemSubText}>
                                        Includes: {item.items.map(sub => sub.name).join(', ')}
                                    </Text>
                                )}
                            </View>
                            <Text style={styles.itemPrice}>₹{item.price * (item.quantity || 1)}</Text>
                        </View>
                    ))}
                    <View style={styles.divider} />
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>₹{order.totalAmount}</Text>
                    </View>
                </View>

                {/* Payment Info */}
                <View style={styles.card}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Payment Method</Text>
                        <Text style={styles.value}>{order.paymentMethod || 'Cash'}</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Action Button */}
            <View style={styles.footer}>
                {currentStatus === 'inProgress' && (
                    <TouchableOpacity
                        style={styles.mainButton}
                        onPress={() => updateStatus('delivered')}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <>
                                <Icon name="checkmark-done-circle" size={24} color="#FFFFFF" />
                                <Text style={styles.mainButtonText}>Mark as Delivered</Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}
            </View>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    statusBanner: {
        backgroundColor: '#E8F5E9',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#C8E6C9',
    },
    statusText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D7A4F',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 16,
    },
    customerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    customerInfo: {
        flex: 1,
    },
    customerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 4,
    },
    customerAddress: {
        fontSize: 14,
        color: '#7F8C8D',
        lineHeight: 20,
    },
    customerActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2D7A4F',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 15,
        color: '#2C3E50',
    },
    itemSubText: {
        fontSize: 12,
        color: '#95A5A6',
        marginTop: 2,
    },
    itemPrice: {
        fontSize: 15,
        fontWeight: '600',
        color: '#2C3E50',
    },
    divider: {
        height: 1,
        backgroundColor: '#E8ECEF',
        marginVertical: 12,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2C3E50',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2D7A4F',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 14,
        color: '#7F8C8D',
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2C3E50',
    },
    footer: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E8ECEF',
    },
    mainButton: {
        backgroundColor: '#2D7A4F',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    mainButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default OrderDetailScreen;
