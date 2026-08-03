import React, { useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import { AuthContext } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/config';

export default function EditUserProfileScreen({ navigation }) {
  const { user, setUser, refreshProfile } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || '');
  const [contact, setContact] = useState(user?.contact || user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [imageUri, setImageUri] = useState(user?.profilePicture || null);
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Media library access is needed to pick an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('contact', contact);
      formData.append('address', address);

      if (imageUri && !imageUri.startsWith('http')) {
        const filename = imageUri.split('/').pop() || 'avatar.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;
        formData.append('profilePicture', {
          uri: imageUri,
          name: filename,
          type,
        });
      }

      const res = await axiosClient.post(ENDPOINTS.USER_PROFILE_EDIT, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data) {
        Alert.alert('Success', 'Profile updated successfully!');
        await refreshProfile();
        navigation.goBack();
      }
    } catch (err) {
      console.error('Edit profile error:', err);
      Alert.alert('Update Failed', err.response?.data?.message || 'Could not update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Edit Profile" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar Picker */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarWrapper} onPress={handlePickImage}>
            <Image
              source={{ uri: imageUri || 'https://via.placeholder.com/150' }}
              style={styles.avatar}
            />
            <View style={styles.cameraBadge}>
              <Camera size={16} color="#ffffff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.changePicText}>Tap to change avatar</Text>
        </View>

        {/* Inputs */}
        <InputField label="Full Name" value={name} onChangeText={setName} placeholder="Your Name" />
        <InputField label="Contact Number" value={contact} onChangeText={setContact} placeholder="Mobile Number" keyboardType="phone-pad" />
        <InputField label="Address" value={address} onChangeText={setAddress} placeholder="Delivery Address" multiline />

        <CustomButton
          title="Save Changes"
          onPress={handleSave}
          loading={loading}
          style={{ marginTop: 20 }}
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f1f5f9',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2563eb',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  changePicText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
    fontWeight: '600',
  },
});
