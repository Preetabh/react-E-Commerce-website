import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  StyleSheet,
  Alert,
} from 'react-native';
import { Edit3, Trash2, Plus, Search, Package } from 'lucide-react-native';
import Header from '../../components/Header';
import LoadingSpinner from '../../components/LoadingSpinner';
import CustomButton from '../../components/CustomButton';
import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/config';

export default function OwnerAllItemsScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOwnerItems();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(items);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredItems(
        items.filter(
          (it) =>
            (it.name && it.name.toLowerCase().includes(q)) ||
            (it.title && it.title.toLowerCase().includes(q)) ||
            (it.category && it.category.toLowerCase().includes(q))
        )
      );
    }
  }, [searchQuery, items]);

  const fetchOwnerItems = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(ENDPOINTS.PRODUCTS);
      const data = res.data.products || res.data || [];
      setItems(data);
      setFilteredItems(data);
    } catch (err) {
      console.error('Error loading inventory:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDeleteItem = (id, name) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${name || 'this product'}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axiosClient.delete(ENDPOINTS.OWNER_DELETE_PRODUCT(id));
              Alert.alert('Deleted', 'Product has been removed.');
              fetchOwnerItems();
            } catch (err) {
              Alert.alert('Error', err.response?.data?.message || 'Could not delete product.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Store Inventory" showBack onBack={() => navigation.goBack()} />

      {/* Top Search & Add Bar */}
      <View style={styles.topBar}>
        <View style={styles.searchBox}>
          <Search size={18} color="#64748b" style={{ marginRight: 6 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search inventory..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('OwnerAddProduct')}
        >
          <Plus size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <LoadingSpinner message="Fetching store inventory..." />
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item._id || item.id || Math.random().toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchOwnerItems();
              }}
              colors={['#2563eb']}
            />
          }
          renderItem={({ item }) => {
            let imgUrl = 'https://via.placeholder.com/100';
            if (item.images && item.images.length > 0) {
              imgUrl = typeof item.images[0] === 'string' ? item.images[0] : item.images[0].url;
            } else if (item.image) {
              imgUrl = typeof item.image === 'string' ? item.image : item.image.url;
            }

            return (
              <View style={styles.itemCard}>
                <Image source={{ uri: imgUrl }} style={styles.itemImg} />

                <View style={styles.itemDetails}>
                  <Text style={styles.categoryTag}>
                    {(item.category || 'General').toUpperCase()}
                  </Text>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name || item.title}
                  </Text>
                  <Text style={styles.itemPrice}>
                    ₹{item.price}{' '}
                    {item.discount > 0 && (
                      <Text style={styles.discountText}>({item.discount}% off)</Text>
                    )}
                  </Text>
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.iconBtn, styles.editBtn]}
                    onPress={() =>
                      navigation.navigate('OwnerEditProduct', { productId: item._id || item.id })
                    }
                  >
                    <Edit3 size={18} color="#2563eb" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.iconBtn, styles.deleteBtn]}
                    onPress={() => handleDeleteItem(item._id || item.id, item.name || item.title)}
                  >
                    <Trash2 size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Package size={64} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>No Products Found</Text>
              <Text style={styles.emptySubtitle}>Tap the '+' button above to list a product.</Text>
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
  topBar: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
    backgroundColor: '#ffffff',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
    gap: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  itemImg: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  categoryTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2563eb',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#16a34a',
    marginTop: 4,
  },
  discountText: {
    fontSize: 11,
    color: '#dc2626',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBtn: {
    backgroundColor: '#eff6ff',
  },
  deleteBtn: {
    backgroundColor: '#fff5f5',
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
