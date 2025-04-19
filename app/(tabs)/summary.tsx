import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useProducts } from '@/contexts/ProductContext';
import { ProductRow } from '@/components/ProductRow';
import { ProductTable } from '@/components/ProductTable';
import { Button } from '@/components/Button';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { FilePen as FilePdf, Trash2 } from 'lucide-react-native';
import { router } from 'expo-router';

export default function SummaryScreen() {
  const { products, removeProduct, clearProducts, getTotal } = useProducts();
  const [generating, setGenerating] = useState(false);

  const generatePDF = async () => {
    if (products.length === 0) return;

    setGenerating(true);
    try {
      const productsHtml = products.map(product => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #E5E7EB;">${product.code}</td>
          <td style="padding: 8px; border-bottom: 1px solid #E5E7EB;">${product.description}</td>
          <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; text-align: center;">${product.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #E5E7EB; text-align: right;">₹${product.finalPrice.toFixed(2)}</td>
        </tr>
      `).join('');

      const total = getTotal();

      const html = `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            <style>
              body {
                font-family: 'Helvetica', sans-serif;
                padding: 20px;
                color: #333;
              }
              h1 {
                font-size: 24px;
                margin-bottom: 20px;
                color: #111827;
              }
              .invoice-header {
                margin-bottom: 30px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th {
                background-color: #F3F4F6;
                padding: 10px 8px;
                text-align: left;
                font-weight: 600;
                color: #4B5563;
                border-bottom: 2px solid #E5E7EB;
              }
              .total-row {
                font-weight: bold;
                background-color: #F9FAFB;
              }
              .total-row td {
                padding: 12px 8px;
                border-top: 2px solid #E5E7EB;
              }
              .date {
                margin-top: 40px;
                font-size: 14px;
                color: #6B7280;
              }
            </style>
          </head>
          <body>
            <div class="invoice-header">
              <h1>Order Summary</h1>
              <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Product Code</th>
                  <th>Description</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${productsHtml}
                <tr class="total-row">
                  <td colspan="3" style="text-align: right;">Total:</td>
                  <td style="text-align: right;">₹${total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            
            <div class="date">
              <p>Thank you for your business!</p>
            </div>
          </body>
        </html>
      `;

      const result = await Print.printToFileAsync({
        html: html,
        base64: false
      });

      if (!result?.uri) {
        throw new Error('Failed to generate PDF: No URI returned');
      }

      if (Platform.OS === 'web') {
        // For web, create a blob and open in new tab
        const response = await fetch(result.uri);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } else {
        // For mobile platforms, use sharing
        if (!(await Sharing.isAvailableAsync())) {
          throw new Error("Sharing isn't available on your platform");
        }
        await Sharing.shareAsync(result.uri);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {products.length > 0 ? (
          <>
            <View style={styles.productListContainer}>
              <Text style={styles.sectionTitle}>Order Items</Text>
              {products.map(product => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onRemove={removeProduct}
                />
              ))}
            </View>

            <View style={styles.summaryContainer}>
              <Text style={styles.sectionTitle}>Order Summary</Text>
              <ProductTable products={products} />
            </View>

            <View style={styles.actionsContainer}>
              <Button
                title="Generate PDF"
                onPress={generatePDF}
                loading={generating}
                style={styles.pdfButton}
                textStyle={styles.pdfButtonText}
                icon={<FilePdf size={20} color="white" style={styles.buttonIcon} />}
              />
              
              <Button
                title="Clear All"
                onPress={() => clearProducts()}
                variant="outline"
                style={styles.clearButton}
                textStyle={styles.clearButtonText}
                icon={<Trash2 size={20} color="#EF4444" style={styles.buttonIcon} />}
              />
            </View>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No products added yet. Add products to see them here.
            </Text>
            <Button
              title="Add Product"
              onPress={() => router.push('/')}
              style={styles.addButton}
            />
          </View>
        )}
      </ScrollView>
    </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  productListContainer: {
    margin: 16,
  },
  summaryContainer: {
    margin: 16,
    marginTop: 0,
  },
  actionsContainer: {
    margin: 16,
    marginTop: 8,
    marginBottom: 40,
  },
  pdfButton: {
    backgroundColor: '#3B82F6',
    marginBottom: 12,
    height: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfButtonText: {
    marginLeft: 8,
  },
  clearButton: {
    borderColor: '#EF4444',
    height: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#EF4444',
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Inter-Regular',
  },
  addButton: {
    width: 200,
  },
});