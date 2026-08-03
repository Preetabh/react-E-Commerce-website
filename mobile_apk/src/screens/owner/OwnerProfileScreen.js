import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Store, Mail, Phone, ShieldCheck, LogOut, ArrowRightLeft } from 'lucide-react-native';
import Header from '../../components/Header';
import CustomButton from '../../components/CustomButton';
import { AuthContext } from '../../context/AuthContext';

export default function OwnerProfileScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert('Seller Logout', 'Are you sure you want to log out of Seller Portal?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header title="Store Owner Profile" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.iconCircle}>
            <Store size={36} color="#2563eb" />
          </View>
          <Text style={styles.userName}>{user?.fullname || user?.name || 'Store Partner'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'owner@example.com'}</Text>
          <View style={styles.verifiedTag}>
            <ShieldCheck size={14} color="#16a34a" />
            <Text style={styles.verifiedText}>Verified Store Owner</Text>
          </View>
        </View>

        {/* Account Info */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Partner Information</Text>

          <View style={styles.infoRow}>
            <Mail size={18} color="#64748b" />
            <Text style={styles.infoText}>{user?.email || 'Not Provided'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Phone size={18} color="#64748b" />
            <Text style={styles.infoText}>{user?.contact || 'Not Provided'}</Text>
          </View>
        </View>

        {/* Switch Mode Actions */}
        <CustomButton
          title="Switch to Customer Mode"
          variant="outline"
          onPress={() => navigation.navigate('UserTab')}
          style={{ marginBottom: 12 }}
        />

        <CustomButton
          title="Log Out of Seller Portal"
          variant="danger"
          onPress={handleLogout}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
  },
  profileHeaderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  userEmail: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
  },
  verifiedText: {
    color: '#15803d',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoText: {
    fontSize: 14,
    color: '#334155',
  },
});
