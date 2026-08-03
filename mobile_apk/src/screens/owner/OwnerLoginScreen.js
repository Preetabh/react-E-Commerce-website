import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Mail, Lock, Store } from 'lucide-react-native';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import { AuthContext } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/config';

export default function OwnerLoginScreen({ navigation }) {
  const { loginOwner } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please enter email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await axiosClient.post(ENDPOINTS.OWNER_LOGIN, {
        email: email.trim(),
        password: password.trim(),
      });

      if (res.data && res.data.token) {
        await loginOwner(res.data.token, res.data.owner || res.data.user || { email });
        Alert.alert('Welcome Partner!', 'Owner logged in successfully.');
        navigation.reset({
          index: 0,
          routes: [{ name: 'OwnerTab' }],
        });
      }
    } catch (err) {
      console.error('Owner login failed:', err);
      Alert.alert('Login Error', err.response?.data?.message || 'Invalid owner credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Store Owner Portal" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerBox}>
          <View style={styles.iconCircle}>
            <Store size={32} color="#2563eb" />
          </View>
          <Text style={styles.welcomeTitle}>Seller Dashboard Sign In</Text>
          <Text style={styles.welcomeSub}>Manage products, orders, and sales performance</Text>
        </View>

        <InputField
          label="Owner Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="owner@example.com"
          keyboardType="email-address"
          icon={Mail}
        />

        <InputField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter owner password"
          secureTextEntry
          icon={Lock}
        />

        <CustomButton
          title="Sign In to Seller Portal"
          onPress={handleLogin}
          loading={loading}
          style={{ marginTop: 14 }}
        />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>New seller? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('OwnerRegister')}>
            <Text style={styles.linkText}>Register Store</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerBox}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR CUSTOMER LOGIN</Text>
          <View style={styles.line} />
        </View>

        <CustomButton
          title="Switch to Customer Mode"
          variant="outline"
          onPress={() => navigation.navigate('UserLogin')}
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
  headerBox: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
  },
  welcomeSub: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
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
  dividerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  orText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '700',
    marginHorizontal: 10,
  },
});
