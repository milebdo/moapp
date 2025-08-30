import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiService from '../services/api';

const PRIMARY = '#00AC81';
const DARK = '#1F2937';
const MUTED = '#6B7280';

const QRISTransactionScreen = ({ navigation }) => {
  const [merchants, setMerchants] = useState([]);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);

  useEffect(() => {
    loadMerchants();
  }, []);

  const loadMerchants = async () => {
    try {
      const response = await apiService.getMerchants();
      setMerchants(response.merchants || []);
    } catch (error) {
      Alert.alert('Error', 'Gagal memuat data merchant');
    }
  };

  const handleCreateInvoice = async () => {
    if (!selectedMerchant) {
      Alert.alert('Error', 'Pilih merchant terlebih dahulu');
      return;
    }

    if (!amount || isNaN(amount) || parseInt(amount) <= 0) {
      Alert.alert('Error', 'Masukkan jumlah yang valid');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.createQRISInvoice(
        selectedMerchant.id,
        parseInt(amount),
        description
      );
      
      Alert.alert(
        'Invoice Berhasil Dibuat',
        `Invoice ID: ${response.invoice_id}\nJumlah: Rp ${parseInt(amount).toLocaleString('id-ID')}`,
        [
          { text: 'OK' },
          { 
            text: 'Cek Status', 
            onPress: () => checkPaymentStatus(response.invoice_id)
          }
        ]
      );
      
      // Reset form
      setAmount('');
      setDescription('');
      setSelectedMerchant(null);
    } catch (error) {
      Alert.alert('Error', error.message || 'Gagal membuat invoice');
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async (invoiceId) => {
    try {
      const response = await apiService.checkQRISStatus(invoiceId);
      
      if (response.qris_status === 'paid') {
        Alert.alert(
          'Pembayaran Berhasil',
          `Dibayar oleh: ${response.qris_payment_customername}\nMetode: ${response.qris_payment_methodby}`
        );
      } else {
        Alert.alert('Status Pembayaran', 'Belum dibayar');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Gagal cek status pembayaran');
    }
  };

  const loadTransactions = async () => {
    if (!selectedMerchant) return;
    
    try {
      const response = await apiService.getQRISTransactions(selectedMerchant.id);
      setTransactions(response.transactions || []);
      setShowTransactions(true);
    } catch (error) {
      Alert.alert('Error', 'Gagal memuat transaksi');
    }
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <Text style={styles.transactionId}>ID: {item.invoice_id}</Text>
        <View style={[
          styles.statusBadge,
          item.status === 'paid' ? styles.statusPaid : styles.statusPending
        ]}>
          <Text style={styles.statusText}>
            {item.status === 'paid' ? 'Dibayar' : 'Pending'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.transactionAmount}>
        Rp {item.amount.toLocaleString('id-ID')}
      </Text>
      
      <Text style={styles.transactionDate}>
        {new Date(item.created_at).toLocaleString('id-ID')}
      </Text>
      
      {item.status === 'pending' && (
        <TouchableOpacity 
          style={styles.checkStatusButton}
          onPress={() => checkPaymentStatus(item.invoice_id)}
        >
          <Text style={styles.checkStatusText}>Cek Status</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QRIS Transaction</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Merchant Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pilih Merchant</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {merchants.map((merchant) => (
              <TouchableOpacity
                key={merchant.id}
                style={[
                  styles.merchantOption,
                  selectedMerchant?.id === merchant.id && styles.merchantOptionSelected
                ]}
                onPress={() => setSelectedMerchant(merchant)}
              >
                <Text style={[
                  styles.merchantOptionText,
                  selectedMerchant?.id === merchant.id && styles.merchantOptionTextSelected
                ]}>
                  {merchant.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Transaction Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Buat Invoice QRIS</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Jumlah (Rp)</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="Masukkan jumlah"
              keyboardType="numeric"
              placeholderTextColor={MUTED}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Deskripsi (Opsional)</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Masukkan deskripsi"
              placeholderTextColor={MUTED}
            />
          </View>

          <TouchableOpacity
            style={[styles.createButton, isLoading && styles.createButtonDisabled]}
            onPress={handleCreateInvoice}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Ionicons name="qr-code-outline" size={20} color="#ffffff" />
                <Text style={styles.createButtonText}>Buat Invoice QRIS</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* View Transactions */}
        {selectedMerchant && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Riwayat Transaksi</Text>
              <TouchableOpacity onPress={loadTransactions}>
                <Text style={styles.viewAllText}>Lihat Semua</Text>
              </TouchableOpacity>
            </View>
            
            {showTransactions && transactions.length > 0 && (
              <FlatList
                data={transactions.slice(0, 3)} // Show only 3 recent transactions
                renderItem={renderTransaction}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DARK,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DARK,
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: PRIMARY,
    fontWeight: '500',
  },
  merchantOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 12,
  },
  merchantOptionSelected: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  merchantOptionText: {
    fontSize: 14,
    color: DARK,
    fontWeight: '500',
  },
  merchantOptionTextSelected: {
    color: '#ffffff',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: DARK,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: DARK,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  transactionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionId: {
    fontSize: 14,
    color: MUTED,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPaid: {
    backgroundColor: '#E8F5E8',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: DARK,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: MUTED,
    marginBottom: 8,
  },
  checkStatusButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
  },
  checkStatusText: {
    fontSize: 14,
    color: PRIMARY,
    fontWeight: '500',
  },
});

export default QRISTransactionScreen;
