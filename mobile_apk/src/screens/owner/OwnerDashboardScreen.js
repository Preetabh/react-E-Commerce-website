import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import { Package, ShoppingBag, DollarSign, PlusCircle, ArrowUpRight, TrendingUp } from 'lucide-react-native';
import Header from '../../components/Header';
import LoadingSpinner from '../../components/LoadingSpinner';
import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/config';
import { AuthContext } from '../../context/AuthContext';

export default function OwnerDashboardScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(ENDPOINTS.OWNER_DASHBOARD);
      if (res.data) {
        setStats({
          totalProducts: res.data.totalProducts || res.data.productsCount || 0,
          totalOrders: res.data.totalOrders || res.data.ordersCount || 0,
          totalRevenue: res.data.totalRevenue || res.data.revenue || 0,
        });
      }
    } catch (err) {
      console.warn('Failed to load owner dashboard:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Seller Dashboard" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchDashboardData();
            }}
            colors={['#2563eb']}
          />
        }
      >
        {/* Welcome Header */}
        <View style={styles.welcomeBanner}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.ownerName}>{user?.fullname || user?.name || 'Store Partner'} 👋</Text>
          <Text style={styles.bannerSubtitle}>Here is your store summary and metrics</Text>
        </View>

        {loading && !refreshing ? (
          <LoadingSpinner message="Updating metrics..." />
        ) : (
          <>
            {/* Metric Cards Grid */}
            <View style={styles.metricsGrid}>
              <View style={[styles.metricCard, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}>
                <View style={styles.metricIconCircle}>
                  <Package size={22} color="#2563eb" />
                </View>
                <Text style={styles.metricValue}>{stats.totalProducts}</Text>
                <Text style={styles.metricLabel}>Total Products</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}>
                <View style={[styles.metricIconCircle, { backgroundColor: '#dcfce7' }]}>
                  <ShoppingBag size={22} color="#16a34a" />
                </View>
                <Text style={styles.metricValue}>{stats.totalOrders}</Text>
                <Text style={styles.metricLabel}>Total Orders</Text>
              </View>

              <View style={[styles.metricCard, styles.fullWidthMetric, { backgroundColor: '#fefce8', borderColor: '#fef08a' }]}>
                <View style={[styles.metricIconCircle, { backgroundColor: '#fef3c7' }]}>
                  <DollarSign size={22} color="#b45309" />
                </View>
                <View>
                  <Text style={styles.metricValue}>₹{stats.totalRevenue}</Text>
                  <Text style={styles.metricLabel}>Total Estimated Sales Revenue</Text>
                </View>
              </View>
            </View>

            {/* Quick Actions */}
            <Text style={styles.sectionTitle}>Quick Management Actions</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => navigation.navigate('OwnerAddProduct')}
              >
                <PlusCircle size={28} color="#2563eb" />
                <Text style={styles.actionTitle}>Add New Product</Text>
                <Text style={styles.actionSub}>Publish an item with photos & pricing</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => navigation.navigate('OwnerAllItems')}
              >
                <Package size={28} color="#0284c7" />
                <Text style={styles.actionTitle}>Manage Inventory</Text>
                <Text style={styles.actionSub}>Edit or delete existing products</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => navigation.navigate('OwnerOrders')}
              >
                <ShoppingBag size={28} color="#16a34a" />
                <Text style={styles.actionTitle}>View Customer Orders</Text>
                <Text style={styles.actionSub}>Fulfill pending orders & status</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
  },
  welcomeBanner: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
  },
  ownerName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
    marginTop: 2,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#cbd5e1',
    marginTop: 6,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  fullWidthMetric: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metricIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 14,
  },
  actionsGrid: {
    gap: 12,
  },
  actionCard: {
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
  actionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 8,
  },
  actionSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
});
