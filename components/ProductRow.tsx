import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { Product } from '@/types/product';

interface ProductRowProps {
  product: Product;
  onRemove?: (id: string) => void;
  showActions?: boolean;
}

export const ProductRow: React.FC<ProductRowProps> = ({ 
  product, 
  onRemove,
  showActions = true
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.codeContainer}>
        <Text style={styles.code}>{product.code}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.description} numberOfLines={1}>
          {product.description}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.quantity}>Qty: {product.quantity}</Text>
          <Text style={styles.price}>₹{product.finalPrice.toFixed(2)}</Text>
        </View>
      </View>
      {showActions && onRemove && (
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => onRemove(product.id)}
        >
          <X size={18} color="#EF4444" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  codeContainer: {
    width: 80,
    marginRight: 12,
    justifyContent: 'center',
  },
  code: {
    fontWeight: '500',
    fontSize: 14,
    color: '#4B5563',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 14,
    color: '#6B7280',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  removeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
});