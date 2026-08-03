import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Alert,
} from 'react-native';
import { ShoppingBag, CheckCircle, Truck, PackageCheck, AlertCircle } from 'lucide-react-native';
import Header from '../../components/Header';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/config';

export default function OwnerOrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(ENDPOINTS.OWNER_ORDERS);
      const data = res.data.orders || res.data || [];
      setOrders(data);
    } catch (err) {
      console.error('Error fetching owner orders:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    Alert.alert(
      'Update Order Status',
      `Change status of order to "${newStatus}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update Status',
          onPress: async () => {
            try {
              await axiosClient.post(ENDPOINTS.OWNER_UPDATE_ORDER_STATUS, {
                orderId,
                status: newStatus,
              });
              Alert.alert('Status Updated', `Order is now marked as ${newStatus}`);
              fetchOrders();
            } catch (err) {
              Alert.alert('Error', err.response?.data?.message || 'Failed to update order status.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Customer Orders" showBack onBack={() => navigation.goBack()} />

      {loading && !refreshing ? (
        <LoadingSpinner message="Fetching customer orders..." />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id || item.id || Math.random().toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchOrders();
              }}
              colors={['#2563eb']}
            />
          }
          renderItem={({ item }) => {
            const currentStatus = item.status || 'Pending';
            return (
              <View style={styles.orderCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.customerName}>
                    Buyer: {item.user?.name || item.name || 'Customer'}
                  </Text>
                  <StatusBadge status={currentStatus} />
                </View>

                <Text style={styles.addressText} numberOfLines={2}>
                  📍 {item.address || 'Address details in order summary'}
                </Text>
                <Text style={styles.amountText}>Amount: ₹{item.totalAmount || item.price || 0}</Text>

                <View style={styles.statusActionsRow}>
                  <Text style={styles.updateLabel}>Update Status:</Text>
                  <TouchableOpacity
                    style={[styles.statusBtn, styles.shippedBtn]}
                    onPress={() => handleUpdateStatus(item._id || item.id, 'Shipped')}
                  >
                    <Truck size={14} color="#1d4ed8" />
                    <Text style={styles.shippedText}>Shipped</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.statusBtn, styles.deliveredBtn]}
                    onPress={() => handleUpdateStatus(item._id || item.id, 'Delivered')}
                  >
                    <CheckCircle size={14} color="#15803d" />
                    <Text style={styles.deliveredText}>Delivered</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ShoppingBag size={64} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>No Orders Found</Text>
              <Text style={styles.emptySubtitle}>Customer orders will appear here.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  list: {
    padding: 16,
    gap: 12,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  addressText: {
    fontSize: 13,
    color: '#475569',
    marginVertical: 4,
  },
  amountText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#2563eb',
    marginTop: 4,
  },
  statusActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  updateLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  statusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  shippedBtn: {
    backgroundColor: '#dbeafe',
  },
  shippedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  deliveredBtn: {
    backgroundColor: '#dcfce7',
  },
  deliveredText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803d',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#334155',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
});
