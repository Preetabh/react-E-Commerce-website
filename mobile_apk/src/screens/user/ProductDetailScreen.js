import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import { Star, ShoppingBag, Zap, ShieldCheck, Truck } from 'lucide-react-native';
import Header from '../../components/Header';
import LoadingSpinner from '../../components/LoadingSpinner';
import CustomButton from '../../components/CustomButton';
import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/config';
import { CartContext } from '../../context/CartContext';

export default function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params || {};
  const [product, setProduct] = useState(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const { addToCart, getCartCount } = useContext(CartContext);

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(ENDPOINTS.PRODUCT_BY_ID(productId));
      const pData = res.data.product || res.data;
      setProduct(pData);

      // Fetch suggested products
      try {
        const suggestRes = await axiosClient.get(ENDPOINTS.SUGGESTED_PRODUCTS(productId));
        const suggestions = suggestRes.data.products || suggestRes.data || [];
        setSuggestedProducts(suggestions);
      } catch (e) {
        // Ignore if suggestions API is unavailable
      }
    } catch (err) {
      console.error('Error fetching product details:', err);
      Alert.alert('Error', 'Failed to load product details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    const res = await addToCart(product._id || product.id, 1);
    setAdding(false);
    if (res.success) {
      Alert.alert('Added to Cart', `${product.name || 'Product'} is now in your cart.`);
    } else {
      Alert.alert('Notice', res.message || 'Please log in to add items.');
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    navigation.navigate('Checkout', {
      directBuyItem: product,
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header showBack onBack={() => navigation.goBack()} title="Product Details" />
        <LoadingSpinner message="Loading item details..." />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Header showBack onBack={() => navigation.goBack()} title="Product Details" />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Product not found.</Text>
        </View>
      </View>
    );
  }

  // Handle product images
  let imageUrl = 'https://via.placeholder.com/400?text=No+Image';
  if (product.images && product.images.length > 0) {
    imageUrl = typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url;
  } else if (product.image) {
    imageUrl = typeof product.image === 'string' ? product.image : product.image.url;
  }

  const price = Number(product.price) || 0;
  const discount = Number(product.discount) || 0;
  const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;

  return (
    <View style={styles.container}>
      <Header
        showBack
        onBack={() => navigation.goBack()}
        title={product.name || 'Product Details'}
        cartCount={getCartCount()}
        onCartPress={() => navigation.navigate('Cart')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Product Image */}
        <View style={styles.imageCard}>
          <Image source={{ uri: imageUrl }} style={styles.mainImage} resizeMode="contain" />
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discount}% OFF</Text>
            </View>
          )}
        </View>

        {/* Product Information */}
        <View style={styles.detailsCard}>
          {product.category && (
            <Text style={styles.category}>{product.category.toUpperCase()}</Text>
          )}
          <Text style={styles.title}>{product.name || product.title}</Text>

          {/* Rating Row */}
          <View style={styles.ratingRow}>
            <View style={styles.starsContainer}>
              <Star size={16} color="#f59e0b" fill="#f59e0b" />
              <Text style={styles.ratingValue}>{product.rating || '4.5'}</Text>
            </View>
            <Text style={styles.reviewsCount}>(128 reviews)</Text>
          </View>

          {/* Price Section */}
          <View style={styles.priceRow}>
            <Text style={styles.finalPrice}>₹{finalPrice.toFixed(0)}</Text>
            {discount > 0 && (
              <Text style={styles.originalPrice}>₹{price.toFixed(0)}</Text>
            )}
          </View>

          {/* Highlights / Badges */}
          <View style={styles.badgesRow}>
            <View style={styles.infoBadge}>
              <Truck size={16} color="#2563eb" />
              <Text style={styles.infoBadgeText}>Free Delivery</Text>
            </View>
            <View style={styles.infoBadge}>
              <ShieldCheck size={16} color="#16a34a" />
              <Text style={styles.infoBadgeText}>Verified Quality</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Product Description</Text>
            <Text style={styles.descriptionText}>
              {product.description || 'No description available for this product.'}
            </Text>
          </View>
        </View>

        {/* Suggested Products */}
        {suggestedProducts.length > 0 && (
          <View style={styles.suggestedSection}>
            <Text style={styles.sectionTitle}>You Might Also Like</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestedList}>
              {suggestedProducts.map((item) => {
                let img = 'https://via.placeholder.com/150';
                if (item.images && item.images.length > 0) {
                  img = typeof item.images[0] === 'string' ? item.images[0] : item.images[0].url;
                }
                return (
                  <TouchableOpacity
                    key={item._id || item.id}
                    style={styles.suggestedCard}
                    onPress={() => navigation.push('ProductDetail', { productId: item._id || item.id })}
                  >
                    <Image source={{ uri: img }} style={styles.suggestedImg} />
                    <Text style={styles.suggestedName} numberOfLines={1}>
                      {item.name || item.title}
                    </Text>
                    <Text style={styles.suggestedPrice}>₹{item.price}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={styles.stickyFooter}>
        <CustomButton
          title="Add to Cart"
          variant="outline"
          onPress={handleAddToCart}
          loading={adding}
          style={styles.actionBtn}
        />
        <CustomButton
          title="Buy Now"
          variant="primary"
          onPress={handleBuyNow}
          style={styles.actionBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingBottom: 90,
  },
  imageCard: {
    height: 280,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  mainImage: {
    width: '90%',
    height: '90%',
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#dc2626',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  discountText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 12,
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    padding: 18,
    marginTop: 8,
  },
  category: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563eb',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#b45309',
  },
  reviewsCount: {
    fontSize: 12,
    color: '#64748b',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 14,
    gap: 10,
  },
  finalPrice: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
  },
  originalPrice: {
    fontSize: 16,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  infoBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  descriptionSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#475569',
  },
  suggestedSection: {
    marginTop: 12,
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingLeft: 16,
  },
  suggestedList: {
    gap: 12,
    paddingRight: 16,
    marginTop: 8,
  },
  suggestedCard: {
    width: 120,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  suggestedImg: {
    width: '100%',
    height: 90,
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  suggestedName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 6,
  },
  suggestedPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563eb',
    marginTop: 2,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 76,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: '#64748b',
  },
});
