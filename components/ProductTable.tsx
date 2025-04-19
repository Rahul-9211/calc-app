import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Product } from '@/types/product';

interface ProductTableProps {
  products: Product[];
}

export const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  const total = products.reduce(
    (sum, product) => sum + product.finalPrice,
    0
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerText, styles.productCol]}>Product</Text>
        <Text style={[styles.headerText, styles.qtyCol]}>Qty</Text>
        <Text style={[styles.headerText, styles.priceCol]}>Price</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {products.map((product) => (
          <View key={product.id} style={styles.row}>
            <Text style={[styles.cell, styles.productCol]} numberOfLines={1}>
              {product.code}
            </Text>
            <Text style={[styles.cell, styles.qtyCol]}>
              {product.quantity}
            </Text>
            <Text style={[styles.cell, styles.priceCol]}>
              ₹{product.finalPrice.toFixed(2)}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalAmount}>₹{total.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#4B5563',
  },
  scrollView: {
    maxHeight: 250,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cell: {
    fontSize: 14,
    color: '#374151',
  },
  productCol: {
    flex: 2,
  },
  qtyCol: {
    flex: 1,
    textAlign: 'center',
  },
  priceCol: {
    flex: 1,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3B82F6',
  },
});