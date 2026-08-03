import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Mail, Lock, LogIn } from 'lucide-react-native';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import { AuthContext } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/config';

export default function UserLoginScreen({ navigation }) {
  const { loginUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please enter both email address and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await axiosClient.post(ENDPOINTS.USER_LOGIN, {
        email: email.trim(),
        password: password.trim(),
      });

      if (res.data && res.data.token) {
        await loginUser(res.data.token, res.data.user || { email });
        Alert.alert('Welcome Back!', 'Logged in successfully.');
        navigation.navigate('UserTab', { screen: 'Home' });
      }
    } catch (err) {
      console.error('User login failed:', err);
      Alert.alert('Login Failed', err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="User Login" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerBox}>
          <Text style={styles.welcomeTitle}>Welcome Back 👋</Text>
          <Text style={styles.welcomeSub}>Log in to access your Shop Mart account</Text>
        </View>

        <InputField
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="name@example.com"
          keyboardType="email-address"
          icon={Mail}
        />

        <InputField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          icon={Lock}
        />

        <TouchableOpacity
          style={styles.forgotBtn}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <CustomButton
          title="Sign In"
          onPress={handleLogin}
          loading={loading}
          style={{ marginTop: 10 }}
        />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('UserRegister')}>
            <Text style={styles.linkText}>Register Now</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerBox}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR STORE OWNER LOGIN</Text>
          <View style={styles.line} />
        </View>

        <CustomButton
          title="Switch to Store Owner Login"
          variant="outline"
          onPress={() => navigation.navigate('OwnerLogin')}
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
    marginBottom: 24,
    marginTop: 10,
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
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotText: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '600',
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
