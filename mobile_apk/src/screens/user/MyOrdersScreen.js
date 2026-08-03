import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Alert,
} from 'react-native';
import { Package, Calendar } from 'lucide-react-native';
import Header from '../../components/Header';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import CustomButton from '../../components/CustomButton';
import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/config';
import { AuthContext } from '../../context/AuthContext';

export default function MyOrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      fetchMyOrders();
    }
  }, [token]);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(ENDPOINTS.MY_ORDERS);
      const data = res.data.orders || res.data || [];
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCancelOrder = (orderId) => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await axiosClient.delete(ENDPOINTS.CANCEL_ORDER(orderId));
              Alert.alert('Order Cancelled', 'Your order has been cancelled.');
              fetchMyOrders();
            } catch (err) {
              Alert.alert('Error', err.response?.data?.message || 'Could not cancel order.');
            }
          },
        },
      ]
    );
  };

  if (!token) {
    return (
      <View style={styles.container}>
        <Header title="My Orders" />
        <View style={styles.emptyContainer}>
          <Package size={64} color="#cbd5e1" />
          <Text style={styles.emptyTitle}>Please Log In</Text>
          <Text style={styles.emptySubtitle}>Log in to view your order history.</Text>
          <CustomButton
            title="Log In"
            onPress={() => navigation.navigate('AuthStack', { screen: 'UserLogin' })}
            style={{ marginTop: 16 }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="My Orders" showBack onBack={() => navigation.goBack()} />

      {loading && !refreshing ? (
        <LoadingSpinner message="Fetching order history..." />
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
                fetchMyOrders();
              }}
              colors={['#2563eb']}
            />
          }
          renderItem={({ item }) => {
            const status = item.status || 'Pending';
            const dateStr = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : 'Recent Order';

            return (
              <View style={styles.orderCard}>
                <View style={styles.cardTop}>
                  <View style={styles.idRow}>
                    <Package size={18} color="#2563eb" />
                    <Text style={styles.orderId}>ID: {item._id ? item._id.substring(0, 10) : 'ORD'}</Text>
                  </View>
                  <StatusBadge status={status} />
                </View>

                <View style={styles.cardDivider} />

                {/* Items Preview */}
                <View style={styles.itemsPreview}>
                  <Text style={styles.itemTitle}>
                    {item.productName || item.product?.name || item.name || 'Order Item'}
                  </Text>
                  <Text style={styles.itemQty}>Qty: {item.quantity || 1}</Text>
                </View>

                <View style={styles.cardBottom}>
                  <View style={styles.dateRow}>
                    <Calendar size={14} color="#64748b" />
                    <Text style={styles.dateText}>{dateStr}</Text>
                  </View>

                  <Text style={styles.totalPrice}>
                    Total: ₹{item.totalAmount || item.price || 0}
                  </Text>
                </View>

                {status.toLowerCase() === 'pending' && (
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => handleCancelOrder(item._id || item.id)}
                  >
                    <Text style={styles.cancelBtnText}>Cancel Order</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Package size={64} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>No Orders Yet</Text>
              <Text style={styles.emptySubtitle}>You haven't placed any orders yet.</Text>
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
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 10,
  },
  itemsPreview: {
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  itemQty: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#64748b',
  },
  totalPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2563eb',
  },
  cancelBtn: {
    marginTop: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fee2e2',
    backgroundColor: '#fff5f5',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '700',
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
