import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Trash2, ShoppingCart, Plus, Minus, ArrowRight } from 'lucide-react-native';
import Header from '../../components/Header';
import LoadingSpinner from '../../components/LoadingSpinner';
import CustomButton from '../../components/CustomButton';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';

export default function CartScreen({ navigation }) {
  const { cartItems, loading, removeFromCart, getCartTotal, getCartCount } = useContext(CartContext);
  const { token } = useContext(AuthContext);

  if (!token) {
    return (
      <View style={styles.container}>
        <Header title="Your Shopping Cart" />
        <View style={styles.emptyContainer}>
          <ShoppingCart size={64} color="#94a3b8" />
          <Text style={styles.emptyTitle}>Please Log In</Text>
          <Text style={styles.emptySubtitle}>Log in to access your saved cart items.</Text>
          <CustomButton
            title="Log In Now"
            onPress={() => navigation.navigate('AuthStack', { screen: 'UserLogin' })}
            style={{ marginTop: 16 }}
          />
        </View>
      </View>
    );
  }

  if (loading && cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Your Shopping Cart" />
        <LoadingSpinner message="Fetching cart items..." />
      </View>
    );
  }

  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 40;
  const grandTotal = subtotal + deliveryFee;

  const handleRemove = (item) => {
    const cartItemId = item._id || item.id;
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this product from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const res = await removeFromCart(cartItemId);
            if (!res.success) {
              Alert.alert('Error', res.message);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Your Shopping Cart"
        showBack
        onBack={() => navigation.goBack()}
        cartCount={getCartCount()}
      />

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ShoppingCart size={64} color="#cbd5e1" />
          <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
          <Text style={styles.emptySubtitle}>Looks like you haven't added any items yet.</Text>
          <CustomButton
            title="Explore Products"
            onPress={() => navigation.navigate('Home')}
            style={{ marginTop: 16 }}
          />
        </View>
      ) : (
        <View style={styles.content}>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item._id || item.id || Math.random().toString()}
            contentContainerStyle={styles.cartList}
            renderItem={({ item }) => {
              const product = item.productId || item;
              let imgUrl = 'https://via.placeholder.com/100';
              if (product.images && product.images.length > 0) {
                imgUrl = typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url;
              } else if (product.image) {
                imgUrl = typeof product.image === 'string' ? product.image : product.image.url;
              }

              const price = Number(product.price) || 0;
              const discount = Number(product.discount) || 0;
              const itemPrice = discount > 0 ? price - (price * discount) / 100 : price;

              return (
                <View style={styles.cartCard}>
                  <Image source={{ uri: imgUrl }} style={styles.itemImg} resizeMode="cover" />
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {product.name || product.title || 'Cart Item'}
                    </Text>
                    <Text style={styles.itemPrice}>₹{itemPrice.toFixed(0)}</Text>
                  </View>

                  <TouchableOpacity style={styles.deleteBtn} onPress={() => handleRemove(item)}>
                    <Trash2 size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              );
            }}
          />

          {/* Checkout Footer */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{subtotal.toFixed(0)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Charge</Text>
              <Text style={[styles.summaryValue, deliveryFee === 0 && styles.freeDelivery]}>
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.grandTotalLabel}>Total Amount</Text>
              <Text style={styles.grandTotalValue}>₹{grandTotal.toFixed(0)}</Text>
            </View>

            <CustomButton
              title="Proceed to Checkout"
              onPress={() => navigation.navigate('Checkout')}
              style={{ marginTop: 14 }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
  },
  cartList: {
    padding: 16,
    gap: 12,
  },
  cartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  itemImg: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2563eb',
    marginTop: 4,
  },
  deleteBtn: {
    padding: 8,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  freeDelivery: {
    color: '#16a34a',
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 8,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2563eb',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
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
    textAlign: 'center',
  },
});
