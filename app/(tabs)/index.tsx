import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { TextInput } from '@/components/TextInput';
import { Button } from '@/components/Button';
import { useProducts } from '@/contexts/ProductContext';

const PRODUCT_DATA = [
  { code: 'JE-WHT-XL', description: 'JEANS WHITE XL SIZE', price: 1000 },
  { code: 'JE-WHT-M', description: 'JEANS WHITE MEDIUM SIZE', price: 700 },
  { code: 'JO-WHT-XL', description: 'JOGGER WHITE XL SIZE', price: 1500 },
  { code: 'JO-WHT-S', description: 'JOGGER WHITE SMALL SIZE', price: 600 },
  { code: 'SH-WHT-XL', description: 'SHIRT WHITE XL SIZE', price: 850 },
  { code: 'SH-WHT-M', description: 'SHIRT WHITE MEDIUM SIZE', price: 390 },
  { code: 'T-BLK-XL', description: 'TSHIRT BLACK XL SIZE', price: 950 },
];

export default function AddProductScreen() {
  const [productCode, setProductCode] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [type, setType] = useState<'PP' | 'NP'>('PP');
  const [discount, setDiscount] = useState('10');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { addProduct } = useProducts();
  const router = useRouter();

  const handleCodeChange = (text: string) => {
    setProductCode(text);
    
    // Auto-fill product details if code matches
    const foundProduct = PRODUCT_DATA.find(p => p.code === text);
    if (foundProduct) {
      setDescription(foundProduct.description);
      setPrice(foundProduct.price.toString());
    }
  };

  const calculateFinalPrice = () => {
    if (!price || !quantity) return '0';
    
    const totalPrice = parseFloat(price) * parseInt(quantity);
    const discountAmount = type === 'PP' ? (totalPrice * parseFloat(discount)) / 100 : 0;
    return (totalPrice - discountAmount).toFixed(2);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!productCode) newErrors.productCode = 'Product code is required';
    if (!description) newErrors.description = 'Description is required';
    if (!price) newErrors.price = 'Price is required';
    if (isNaN(parseFloat(price))) newErrors.price = 'Price must be a number';
    if (!quantity) newErrors.quantity = 'Quantity is required';
    if (isNaN(parseInt(quantity))) newErrors.quantity = 'Quantity must be a number';
    if (type === 'PP' && (!discount || isNaN(parseFloat(discount)))) {
      newErrors.discount = 'Valid discount percentage is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddProduct = () => {
    if (!validateForm()) return;

    addProduct({
      code: productCode,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      type,
      discount: parseFloat(discount),
    });

    Alert.alert(
      'Success',
      'Product added to cart',
      [
        {
          text: 'Add Another',
          onPress: resetForm,
          style: 'cancel',
        },
        {
          text: 'View Summary',
          onPress: () => router.navigate('/(tabs)/summary'),
        },
      ],
      { cancelable: false }
    );
  };

  const resetForm = () => {
    setProductCode('');
    setDescription('');
    setPrice('');
    setQuantity('');
    setType('PP');
    setDiscount('10');
    setErrors({});
  };

  const toggleType = () => {
    setType(current => (current === 'PP' ? 'NP' : 'PP'));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <TextInput
            label="Product Code"
            value={productCode}
            onChangeText={handleCodeChange}
            placeholder="Enter product code"
            autoCapitalize="characters"
            error={errors.productCode}
          />

          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Enter product description"
            error={errors.description}
          />

          <TextInput
            label="Price"
            value={price}
            onChangeText={setPrice}
            placeholder="Enter product price"
            keyboardType="numeric"
            error={errors.price}
          />

          <TextInput
            label="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            placeholder="Enter quantity"
            keyboardType="numeric"
            error={errors.quantity}
          />

          <View style={styles.typeContainer}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.typeButtonsContainer}>
              <Button
                title="PP"
                variant={type === 'PP' ? 'primary' : 'outline'}
                onPress={() => setType('PP')}
                style={[styles.typeButton, styles.typeButtonLeft]}
              />
              <Button
                title="NP"
                variant={type === 'NP' ? 'primary' : 'outline'}
                onPress={() => setType('NP')}
                style={[styles.typeButton, styles.typeButtonRight]}
              />
            </View>
          </View>

          {type === 'PP' && (
            <TextInput
              label="Discount (%)"
              value={discount}
              onChangeText={setDiscount}
              placeholder="Enter discount percentage"
              keyboardType="numeric"
              error={errors.discount}
            />
          )}

          <View style={styles.finalPriceContainer}>
            <Text style={styles.finalPriceLabel}>
              Final Price:
            </Text>
            <Text style={styles.finalPriceValue}>
              ₹{calculateFinalPrice()}
            </Text>
          </View>

          <Button
            title="Add Product"
            onPress={handleAddProduct}
            style={styles.addButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    color: '#374151',
    fontFamily: 'Inter-Medium',
  },
  typeContainer: {
    marginBottom: 16,
  },
  typeButtonsContainer: {
    flexDirection: 'row',
  },
  typeButton: {
    flex: 1,
    marginHorizontal: 0,
  },
  typeButtonLeft: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  typeButtonRight: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  finalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 8,
  },
  finalPriceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  finalPriceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6',
    fontFamily: 'Inter-Bold',
  },
  addButton: {
    marginTop: 8,
  },
});