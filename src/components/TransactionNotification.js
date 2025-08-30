import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#00AC81';
const SUCCESS = '#4CAF50';
const PENDING = '#FF9800';
const ERROR = '#F44336';

const TransactionNotification = ({ 
  transaction, 
  onPress, 
  onDismiss,
  style 
}) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'paid':
        return SUCCESS;
      case 'pending':
      case 'waiting':
        return PENDING;
      case 'failed':
      case 'error':
        return ERROR;
      default:
        return PENDING;
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'paid':
        return 'checkmark-circle';
      case 'pending':
      case 'waiting':
        return 'time';
      case 'failed':
      case 'error':
        return 'close-circle';
      default:
        return 'time';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'paid':
        return 'Pembayaran Berhasil';
      case 'pending':
      case 'waiting':
        return 'Menunggu Pembayaran';
      case 'failed':
      case 'error':
        return 'Pembayaran Gagal';
      default:
        return 'Status Tidak Diketahui';
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusColor = getStatusColor(transaction.qris_status);
  const statusIcon = getStatusIcon(transaction.qris_status);
  const statusText = getStatusText(transaction.qris_status);

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.reportHeader}>
        <Ionicons 
          name={statusIcon} 
          size={24} 
          color={statusColor} 
        />
        <Text style={styles.reportTitle}>Notifikasi Pembayaran QRIS</Text>
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
            <Ionicons name="close" size={16} color="#666" />
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={styles.reportDate}>{formatDate(transaction.created_at)}</Text>
      
      <Text style={styles.reportDescription}>
        {transaction.description || 'Pembayaran QRIS'}
      </Text>

      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Jumlah Pembayaran</Text>
        <Text style={styles.amount}>
          {formatAmount(transaction.amount)}
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Invoice ID:</Text>
          <Text style={styles.detailValue}>
            {transaction.invoice_id || 'N/A'}
          </Text>
        </View>
        
        {transaction.qris_payment_methodby && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Metode:</Text>
            <Text style={styles.detailValue}>
              {transaction.qris_payment_methodby}
            </Text>
          </View>
        )}

        {transaction.qris_payment_customername && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Customer:</Text>
            <Text style={styles.detailValue}>
              {transaction.qris_payment_customername}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.reportActions}>
        <TouchableOpacity style={styles.previewButton} onPress={onPress}>
          <Text style={styles.previewButtonText}>Detail</Text>
        </TouchableOpacity>
        {transaction.qris_status?.toLowerCase() === 'pending' && (
          <TouchableOpacity style={styles.downloadButton}>
            <Text style={styles.downloadButtonText}>Periksa Status</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={20} color={PRIMARY} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 4,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  dismissButton: {
    padding: 4,
  },
  reportDate: { 
    fontSize: 12, 
    color: '#666', 
    marginBottom: 12 
  },
  reportDescription: { 
    fontSize: 14, 
    color: '#333', 
    lineHeight: 20, 
    marginBottom: 16 
  },
  amountContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    gap: 6,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 8,
  },
  reportActions: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  previewButton: { 
    backgroundColor: '#f5f5f5', 
    borderRadius: 8, 
    paddingHorizontal: 16, 
    paddingVertical: 8 
  },
  previewButtonText: { 
    color: '#666', 
    fontSize: 14, 
    fontWeight: '500' 
  },
  downloadButton: { 
    backgroundColor: PRIMARY, 
    borderRadius: 8, 
    paddingHorizontal: 16, 
    paddingVertical: 8 
  },
  downloadButtonText: { 
    color: '#ffffff', 
    fontSize: 14, 
    fontWeight: '500' 
  },
  shareButton: { 
    padding: 8 
  },
});

export default TransactionNotification;
