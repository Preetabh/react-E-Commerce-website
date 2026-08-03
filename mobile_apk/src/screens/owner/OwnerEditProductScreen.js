import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/config';

export default function OwnerEditProductScreen({ route, navigation }) {
  const { productId } = route.params || {};

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchItem();
    }
  }, [productId]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(ENDPOINTS.OWNER_GET_PRODUCT(productId));
      const p = res.data.product || res.data;
      if (p) {
        setName(p.name || p.title || '');
        setPrice(String(p.price || ''));
        setDiscount(String(p.discount || '0'));
        setCategory(p.category || '');
        setDescription(p.description || '');
      }
    } catch (err) {
      console.error('Fetch product error:', err);
      Alert.alert('Error', 'Could not load product details.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);
      const res = await axiosClient.put(ENDPOINTS.OWNER_EDIT_PRODUCT(productId), {
        name,
        price,
        discount,
        category,
        description,
      });

      if (res.data) {
        Alert.alert('Success', 'Product updated successfully!');
        navigation.goBack();
      }
    } catch (err) {
      Alert.alert('Update Error', err.response?.data?.message || 'Failed to update product.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Edit Product" showBack onBack={() => navigation.goBack()} />
        <LoadingSpinner message="Loading product configuration..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Edit Product" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <InputField label="Product Name" value={name} onChangeText={setName} placeholder="Item title" />
        <InputField label="Price (₹)" value={price} onChangeText={setPrice} placeholder="999" keyboardType="numeric" />
        <InputField label="Discount (%)" value={discount} onChangeText={setDiscount} placeholder="10" keyboardType="numeric" />
        <InputField label="Category" value={category} onChangeText={setCategory} placeholder="Category name" />
        <InputField label="Description" value={description} onChangeText={setDescription} placeholder="Description..." multiline />

        <CustomButton
          title="Save Product Changes"
          onPress={handleUpdate}
          loading={saving}
          style={{ marginTop: 16 }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: 20,
  },
});
