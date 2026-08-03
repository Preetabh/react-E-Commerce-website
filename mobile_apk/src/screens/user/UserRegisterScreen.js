import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Mail, Lock, User, Phone, MapPin } from 'lucide-react-native';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import { AuthContext } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/config';

export default function UserRegisterScreen({ navigation }) {
  const { loginUser } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please fill in your name, email, and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await axiosClient.post(ENDPOINTS.USER_REGISTER, {
        name: name.trim(),
        email: email.trim(),
        contact: contact.trim(),
        address: address.trim(),
        password: password.trim(),
      });

      if (res.data) {
        Alert.alert('Registration Successful', 'Your account has been created. Please log in.');
        navigation.navigate('UserLogin');
      }
    } catch (err) {
      console.error('Registration failed:', err);
      Alert.alert('Registration Error', err.response?.data?.message || 'Could not complete registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Create Account" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerBox}>
          <Text style={styles.welcomeTitle}>Join Shop Mart 🛒</Text>
          <Text style={styles.welcomeSub}>Create a free account to start shopping</Text>
        </View>

        <InputField label="Full Name" value={name} onChangeText={setName} placeholder="John Doe" icon={User} />
        <InputField label="Email Address" value={email} onChangeText={setEmail} placeholder="name@example.com" keyboardType="email-address" icon={Mail} />
        <InputField label="Phone Number" value={contact} onChangeText={setContact} placeholder="Mobile number" keyboardType="phone-pad" icon={Phone} />
        <InputField label="Address" value={address} onChangeText={setAddress} placeholder="Delivery address" icon={MapPin} />
        <InputField label="Password" value={password} onChangeText={setPassword} placeholder="Choose a password" secureTextEntry icon={Lock} />

        <CustomButton
          title="Create Account"
          onPress={handleRegister}
          loading={loading}
          style={{ marginTop: 10 }}
        />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('UserLogin')}>
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
