import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Mail, Lock, User, Store, Phone } from 'lucide-react-native';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/config';

export default function OwnerRegisterScreen({ navigation }) {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [gstin, setGstin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullname.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please enter your full name, email, and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await axiosClient.post(ENDPOINTS.OWNER_REGISTER, {
        fullname: fullname.trim(),
        email: email.trim(),
        contact: contact.trim(),
        gstin: gstin.trim(),
        password: password.trim(),
      });

      if (res.data) {
        Alert.alert('Store Registered!', 'Your store account has been created. Please log in.');
        navigation.navigate('OwnerLogin');
      }
    } catch (err) {
      console.error('Owner register error:', err);
      Alert.alert('Registration Failed', err.response?.data?.message || 'Could not register owner store.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Register Store Owner" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerBox}>
          <Text style={styles.welcomeTitle}>Become a Seller 🏪</Text>
          <Text style={styles.welcomeSub}>Start selling your products on Shop Mart</Text>
        </View>

        <InputField label="Full Name" value={fullname} onChangeText={setFullname} placeholder="Store Owner Name" icon={User} />
        <InputField label="Business Email" value={email} onChangeText={setEmail} placeholder="owner@store.com" keyboardType="email-address" icon={Mail} />
        <InputField label="Contact Number" value={contact} onChangeText={setContact} placeholder="Mobile number" keyboardType="phone-pad" icon={Phone} />
        <InputField label="GSTIN / License (Optional)" value={gstin} onChangeText={setGstin} placeholder="GST Number" icon={Store} />
        <InputField label="Password" value={password} onChangeText={setPassword} placeholder="Choose password" secureTextEntry icon={Lock} />

        <CustomButton
          title="Create Seller Account"
          onPress={handleRegister}
          loading={loading}
          style={{ marginTop: 10 }}
        />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already registered? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('OwnerLogin')}>
            <Text style={styles.linkText}>Sign In</Text>
          </TouchableOpacity>
        </View>
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
  headerBox: {
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
  },
  welcomeSub: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
  },
  linkText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '800',
  },
});
