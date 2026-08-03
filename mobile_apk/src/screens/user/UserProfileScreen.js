import React, { useContext } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { User, Mail, Phone, MapPin, LogOut, Edit3, ShoppingBag, ShieldCheck, HelpCircle } from 'lucide-react-native';
import Header from '../../components/Header';
import CustomButton from '../../components/CustomButton';
import { AuthContext } from '../../context/AuthContext';

export default function UserProfileScreen({ navigation }) {
  const { user, token, role, logout } = useContext(AuthContext);

  if (!token) {
    return (
      <View style={styles.container}>
        <Header title="My Profile" />
        <View style={styles.emptyContainer}>
          <User size={64} color="#cbd5e1" />
          <Text style={styles.emptyTitle}>Welcome to Shop Mart</Text>
          <Text style={styles.emptySubtitle}>Log in to manage your profile and orders.</Text>
          <CustomButton
            title="Log In / Register"
            onPress={() => navigation.navigate('AuthStack', { screen: 'UserLogin' })}
            style={{ marginTop: 16 }}
          />
        </View>
      </View>
    );
  }

  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const profilePic = user?.profilePicture || 'https://via.placeholder.com/150';

  return (
    <View style={styles.container}>
      <Header title="My Profile" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileHeaderCard}>
          <Image source={{ uri: profilePic }} style={styles.avatar} />
          <Text style={styles.userName}>{user?.name || 'User Profile'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditUserProfile')}
          >
            <Edit3 size={16} color="#2563eb" />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* User Info Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <View style={styles.infoRow}>
            <Mail size={18} color="#64748b" />
            <Text style={styles.infoText}>{user?.email || 'Not Provided'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Phone size={18} color="#64748b" />
            <Text style={styles.infoText}>{user?.contact || user?.phone || 'Not Provided'}</Text>
          </View>
          <View style={styles.infoRow}>
            <MapPin size={18} color="#64748b" />
            <Text style={styles.infoText}>{user?.address || 'No saved address'}</Text>
          </View>
        </View>

        {/* Quick Menu */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Quick Links</Text>

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => navigation.navigate('MyOrders')}
          >
            <ShoppingBag size={18} color="#2563eb" />
            <Text style={styles.menuText}>My Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => navigation.navigate('AiCenter')}
          >
            <HelpCircle size={18} color="#2563eb" />
            <Text style={styles.menuText}>AI Shopping Assistant</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => navigation.navigate('Terms')}
          >
            <ShieldCheck size={18} color="#64748b" />
            <Text style={styles.menuText}>Terms & Policies</Text>
          </TouchableOpacity>
        </View>

        {/* Role Switch / Owner Section */}
        {role === 'owner' ? (
          <CustomButton
            title="Go to Owner Dashboard"
            variant="secondary"
            onPress={() => navigation.navigate('OwnerTab')}
            style={{ marginBottom: 12 }}
          />
        ) : (
          <CustomButton
            title="Become / Switch to Store Owner"
            variant="outline"
            onPress={() => navigation.navigate('AuthStack', { screen: 'OwnerLogin' })}
            style={{ marginBottom: 12 }}
          />
        )}

        <CustomButton
          title="Log Out"
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
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#f1f5f9',
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
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editBtnText: {
    color: '#2563eb',
    fontSize: 13,
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
    flex: 1,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#334155',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
});
