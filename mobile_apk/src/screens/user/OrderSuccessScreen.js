import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2, PackageCheck } from 'lucide-react-native';
import CustomButton from '../../components/CustomButton';

export default function OrderSuccessScreen({ route, navigation }) {
  const { orderId = 'ORD-849204' } = route.params || {};

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <CheckCircle2 size={64} color="#16a34a" />
        </View>

        <Text style={styles.title}>Order Placed Successfully!</Text>
        <Text style={styles.subtitle}>
          Thank you for shopping with Shop Mart. Your order has been confirmed.
        </Text>

        <View style={styles.orderCard}>
          <View style={styles.orderRow}>
            <PackageCheck size={20} color="#2563eb" />
            <Text style={styles.orderLabel}>Order ID:</Text>
            <Text style={styles.orderIdText}>{orderId}</Text>
          </View>
          <Text style={styles.deliveryEst}>Estimated Delivery: 2-4 Business Days</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <CustomButton
          title="View My Orders"
          variant="outline"
          onPress={() => navigation.navigate('MyOrders')}
          style={{ marginBottom: 10 }}
        />
        <CustomButton
          title="Back to Home"
          variant="primary"
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  orderCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 16,
    width: '100%',
    marginTop: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderLabel: {
    fontSize: 14,
    color: '#475569',
  },
  orderIdText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2563eb',
  },
  deliveryEst: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '600',
    marginTop: 6,
  },
  footer: {
    width: '100%',
  },
});
