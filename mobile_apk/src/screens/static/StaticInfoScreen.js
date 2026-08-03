import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Header from '../../components/Header';

export default function StaticInfoScreen({ route, navigation }) {
  const { title = 'Terms & Conditions', content } = route.params || {};

  const defaultTerms = `Welcome to Shop Mart. By accessing or using our mobile application and services, you agree to be bound by these terms. All products, prices, and features are subject to availability. Delivery estimates are indicative.`;

  return (
    <View style={styles.container}>
      <Header title={title} showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>{title}</Text>
        <Text style={styles.bodyText}>{content || defaultTerms}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#475569',
  },
});
