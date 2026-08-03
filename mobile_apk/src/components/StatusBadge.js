import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatusBadge({ status = 'Pending' }) {
  const normalized = status ? status.toLowerCase() : 'pending';

  const getColors = () => {
    switch (normalized) {
      case 'delivered':
      case 'completed':
        return { bg: '#dcfce7', text: '#15803d' };
      case 'shipped':
      case 'processing':
        return { bg: '#dbeafe', text: '#1d4ed8' };
      case 'cancelled':
      case 'rejected':
        return { bg: '#fee2e2', text: '#b91c1c' };
      default:
        return { bg: '#fef3c7', text: '#b45309' };
    }
  };

  const colors = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>
        {status.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
