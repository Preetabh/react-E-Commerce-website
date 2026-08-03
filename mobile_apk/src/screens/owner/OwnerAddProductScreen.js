import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Camera, ImagePlus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/config';

export default function OwnerAddProductScreen({ navigation }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('10');
  const [images, setImages] = useState([]); // array of picked image URIs
  const [loading, setLoading] = useState(false);

  const handlePickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Access to media library is required to upload product photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const uris = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...uris].slice(0, 5));
    }
  };

  const handleAddProduct = async () => {
    if (!name.trim() || !price.trim() || !category.trim()) {
      Alert.alert('Missing Info', 'Please enter product name, price, and category.');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('price', price.trim());
      formData.append('discount', discount.trim() || '0');
      formData.append('category', category.trim());
      formData.append('description', description.trim());
      formData.append('stock', stock.trim());

      images.forEach((uri, index) => {
        const filename = uri.split('/').pop() || `img_${index}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;
        formData.append('images', {
          uri,
          name: filename,
          type,
        });
      });

      const res = await axiosClient.post(ENDPOINTS.ADD_PRODUCT, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data) {
        Alert.alert('Success!', 'New product published successfully.');
        navigation.goBack();
      }
    } catch (err) {
      console.error('Add product error:', err);
      Alert.alert('Publish Failed', err.response?.data?.message || 'Could not add product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Add New Product" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Photo Uploader */}
        <Text style={styles.sectionLabel}>Product Photos (Up to 5)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoRow}>
          {images.map((uri, index) => (
            <View key={index} style={styles.photoBox}>
              <Image source={{ uri }} style={styles.photoImg} />
            </View>
          ))}
          {images.length < 5 && (
            <TouchableOpacity style={styles.addPhotoBox} onPress={handlePickImages}>
              <ImagePlus size={24} color="#2563eb" />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        <InputField label="Product Name / Title" value={name} onChangeText={setName} placeholder="e.g. Wireless Noise Cancelling Headphones" />
        
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <InputField label="Price (₹)" value={price} onChangeText={setPrice} placeholder="999" keyboardType="numeric" />
          </View>
          <View style={{ flex: 1 }}>
            <InputField label="Discount (%)" value={discount} onChangeText={setDiscount} placeholder="10" keyboardType="numeric" />
          </View>
        </View>

        <InputField label="Category" value={category} onChangeText={setCategory} placeholder="Electronics / Fashion / Home" />
        <InputField label="Available Stock" value={stock} onChangeText={setStock} placeholder="10" keyboardType="number-pad" />
        <InputField label="Detailed Description" value={description} onChangeText={setDescription} placeholder="Enter full specifications, warranty, features..." multiline />

        <CustomButton
          title="Publish Product to Store"
          onPress={handleAddProduct}
          loading={loading}
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
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  photoRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  photoBox: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 10,
    overflow: 'hidden',
  },
  photoImg: {
    width: '100%',
    height: '100%',
  },
  addPhotoBox: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
    borderStyle: 'dashed',
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  addPhotoText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
  },
});
