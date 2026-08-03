import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ShoppingCart, Star } from 'lucide-react-native';

export default function ProductCard({ product, onPress, onAddToCart }) {
  if (!product) return null;

  // Handle product images (array or single string)
  let imageUrl = 'https://via.placeholder.com/300?text=No+Image';
  if (product.images && product.images.length > 0) {
    imageUrl = typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url;
  } else if (product.image) {
    imageUrl = typeof product.image === 'string' ? product.image : product.image.url;
  }

  const price = Number(product.price) || 0;
  const discount = Number(product.discount) || 0;
  const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        {discount > 0 && (
          <View style={styles.discountTag}>
            <Text style={styles.discountText}>{discount}% OFF</Text>
          </View>
        )}
      </View>

      <View style={styles.detailsContainer}>
        {product.category && (
          <Text style={styles.category} numberOfLines={1}>
            {product.category.toUpperCase()}
          </Text>
        )}

        <Text style={styles.name} numberOfLines={2}>
          {product.name || product.title || 'Product Item'}
        </Text>

        <View style={styles.ratingRow}>
          <Star size={14} color="#f59e0b" fill="#f59e0b" />
          <Text style={styles.ratingText}>
            {product.rating || '4.5'}
          </Text>
        </View>

        <View style={styles.footerRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.finalPrice}>₹{finalPrice.toFixed(0)}</Text>
            {discount > 0 && (
              <Text style={styles.originalPrice}>₹{price.toFixed(0)}</Text>
            )}
          </View>

          {onAddToCart && (
            <TouchableOpacity style={styles.cartBtn} onPress={onAddToCart}>
              <ShoppingCart size={16} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    width: '48%',
  },
  imageContainer: {
    height: 140,
    backgroundColor: '#f8fafc',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#dc2626',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  detailsContainer: {
    padding: 10,
  },
  category: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 2,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
    height: 36,
    lineHeight: 18,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  priceContainer: {
    flexDirection: 'column',
  },
  finalPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  originalPrice: {
    fontSize: 11,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  cartBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
