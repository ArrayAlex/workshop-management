import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 12,
    lineHeight: 1.5,
    color: '#333',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  businessDetails: {
    fontSize: 10,
    textAlign: 'right',
  },
  customerDetails: {
    fontSize: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderColor: '#bdbdbd',
    borderWidth: 1,
    padding: 5,
    fontSize: 10,
  },
  tableColHeader: {
    backgroundColor: '#f3f3f3',
    fontWeight: 'bold',
  },
  notesSection: {
    marginTop: 20,
  },
  totalSection: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: '1px solid #eee',
    textAlign: 'right',
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  contactInfo: {
    marginTop: 30,
    fontSize: 10,
    textAlign: 'center',
    borderTop: '1px solid #eee',
    paddingTop: 10,
  },
});

const InvoicePDF = ({ invoice }) => {
  // Safely handle undefined values for subtotal, tax, and total
  const subtotal = invoice?.subtotal ? invoice.subtotal.toFixed(2) : '0.00';
  const tax = invoice?.tax ? invoice.tax.toFixed(2) : '0.00';
  const total = invoice?.total ? invoice.total.toFixed(2) : '0.00';

  return (
    <Document>
      <Page style={styles.page}>
        {/* Logo and Business Information */}
        <View style={styles.header}>
          <View>
            <Image style={styles.logo} src="https://placehold.co/600x400/000000/BBBB.png" />
          </View>
          <View style={styles.businessDetails}>
            <Text>Business Name</Text>
            <Text>123 Business Street</Text>
            <Text>Business City, BC 12345</Text>
            <Text>Email: contact@business.com</Text>
            <Text>Phone: +1 234 567 890</Text>
          </View>
        </View>

        {/* Customer Details */}
        <View style={styles.customerDetails}>
          <Text style={styles.sectionTitle}>Bill To:</Text>
          <Text>{invoice?.customerName || 'Customer Name'}</Text>
          <Text>{invoice?.customerAddress || 'Customer Address'}</Text>
          <Text>Email: {invoice?.customerEmail || 'customer@email.com'}</Text>
          <Text>Phone: {invoice?.customerPhone || '+1 987 654 3210'}</Text>
        </View>

        {/* Invoice Details */}
        <View style={styles.sectionTitle}>
          <Text>Invoice #{invoice?.id || 'INV-001'}</Text>
          <Text>Date: {invoice?.date || '2024-10-01'}</Text>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableColHeader]}>
            <Text style={styles.tableCol}>Description</Text>
            <Text style={styles.tableCol}>Quantity</Text>
            <Text style={styles.tableCol}>Price</Text>
            <Text style={styles.tableCol}>Amount</Text>
          </View>
          {invoice?.items?.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCol}>{item.description || 'N/A'}</Text>
              <Text style={styles.tableCol}>{item.quantity || 0}</Text>
              <Text style={styles.tableCol}>
                ${item.price ? item.price.toFixed(2) : '0.00'}
              </Text>
              <Text style={styles.tableCol}>
                ${item.amount ? item.amount.toFixed(2) : '0.00'}
              </Text>
            </View>
          )) || (
            <View style={styles.tableRow}>
              <Text style={styles.tableCol}>No items found.</Text>
            </View>
          )}
        </View>

        {/* Notes Section */}
        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>Notes:</Text>
          <Text>
            Thank you for your business! Please make the payment by the due date
            mentioned in the invoice.
          </Text>
        </View>

        {/* Total Section */}
        <View style={styles.totalSection}>
          <Text style={styles.totalText}>Subtotal: ${subtotal}</Text>
          <Text style={styles.totalText}>Tax: ${tax}</Text>
          <Text style={styles.totalText}>Total: ${total}</Text>
        </View>

        {/* Contact Information */}
        <View style={styles.contactInfo}>
          <Text>If you have any questions about this invoice, please contact us.</Text>
          <Text>Email: billing@business.com | Phone: +1 234 567 890</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
