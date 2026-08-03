import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { Mail, KeyRound } from 'lucide-react-native';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/config';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Reset Password
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your registered email address.');
      return;
    }

    try {
      setLoading(true);
      await axiosClient.post(ENDPOINTS.SEND_OTP, { email: email.trim() });
      Alert.alert('OTP Sent', 'An OTP has been sent to your email.');
      setStep(2);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp.trim() || !newPassword.trim()) {
      Alert.alert('Required Fields', 'Please enter OTP and your new password.');
      return;
    }

    try {
      setLoading(true);
      await axiosClient.post(ENDPOINTS.RESET_PASSWORD, {
        email: email.trim(),
        otp: otp.trim(),
        newPassword: newPassword.trim(),
      });
      Alert.alert('Success', 'Password reset successfully! Please log in with your new password.');
      navigation.navigate('UserLogin');
    } catch (err) {
      Alert.alert('Reset Failed', err.response?.data?.message || 'Invalid OTP or reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Reset Password" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Forgot Password 🔒</Text>
        <Text style={styles.subtitle}>
          {step === 1
            ? 'Enter your email address to receive an OTP for password reset.'
            : 'Enter the OTP sent to your email and choose a new password.'}
        </Text>

        <InputField
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="name@example.com"
          keyboardType="email-address"
          icon={Mail}
        />

        {step === 2 && (
          <>
            <InputField
              label="OTP Code"
              value={otp}
              onChangeText={setOtp}
              placeholder="Enter OTP"
              keyboardType="number-pad"
              icon={KeyRound}
            />
            <InputField
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              secureTextEntry
            />
          </>
        )}

        <CustomButton
          title={step === 1 ? 'Send OTP' : 'Reset Password'}
          onPress={step === 1 ? handleSendOtp : handleResetPassword}
          loading={loading}
          style={{ marginTop: 14 }}
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
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 20,
  },
});
