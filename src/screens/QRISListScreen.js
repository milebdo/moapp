import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiService from '../services/api';

const PRIMARY = '#00AC81';
const DARK = '#1F2937';
const MUTED = '#6B7280';

const QRISListScreen = ({ navigation }) => {
  const [merchants, setMerchants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingMerchantId, setDeletingMerchantId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [merchantToDelete, setMerchantToDelete] = useState(null);

  // Load merchants on component mount
  useEffect(() => {
    loadMerchants();
  }, []);

  // Reload merchants when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadMerchants();
    });

    return unsubscribe;
  }, [navigation]);

  const loadMerchants = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getMerchants();
      setMerchants(response.merchants || []);
    } catch (error) {
      Alert.alert('Error', error.message || 'Gagal memuat data merchant');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMerchants();
    setRefreshing(false);
  };

  /**
   * Enhanced delete merchant function with confirmation dialog
   * Features:
   * - Shows merchant name in confirmation dialog
   * - Clear warning about permanent deletion
   * - Loading state for specific merchant being deleted
   * - Success/error feedback
   * - Prevents multiple delete operations
   */
  const handleDeleteMerchant = async (merchantId) => {
    // Find the merchant to show its name in the confirmation
    const merchant = merchants.find(m => m.id === merchantId);
    const merchantName = merchant ? merchant.name : 'merchant ini';
    
    if (Platform.OS === 'web') {
      // Use custom dialog for web
      setMerchantToDelete(merchant);
      setShowDeleteConfirm(true);
    } else {
      // Use native Alert for mobile
      Alert.alert(
        'Konfirmasi Hapus',
        `Apakah Anda yakin ingin menghapus "${merchantName}"?\n\nTindakan ini tidak dapat dibatalkan dan semua data merchant akan dihapus secara permanen.`,
        [
          { 
            text: 'Batal', 
            style: 'cancel'
          },
          {
            text: 'Hapus',
            style: 'destructive',
            onPress: () => confirmDelete(merchantId, merchantName)
          },
        ]
      );
    }
  };

  const confirmDelete = async (merchantId, merchantName) => {
    try {
      // Show loading state for specific merchant
      setDeletingMerchantId(merchantId);
      
      await apiService.deleteMerchant(merchantId);
      
      // Show success message
      if (Platform.OS === 'web') {
        setShowDeleteConfirm(false);
        setMerchantToDelete(null);
        // Show success message for web
        alert(`Merchant "${merchantName}" berhasil dihapus.`);
      } else {
        Alert.alert(
          'Berhasil Dihapus', 
          `Merchant "${merchantName}" berhasil dihapus.`,
          [
            {
              text: 'OK',
              onPress: () => {
                loadMerchants(); // Reload the list
              }
            }
          ]
        );
      }
      
      loadMerchants(); // Reload the list
    } catch (error) {
      if (Platform.OS === 'web') {
        setShowDeleteConfirm(false);
        setMerchantToDelete(null);
        alert(`Gagal menghapus: ${error.message}`);
      } else {
        Alert.alert(
          'Gagal Menghapus', 
          error.message || 'Terjadi kesalahan saat menghapus merchant. Silakan coba lagi.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setDeletingMerchantId(null);
    }
  };
  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddMerchant = () => {
    navigation.navigate('QRISSettings', { mode: 'add' });
  };

  const handleEditMerchant = (merchant) => {
    navigation.navigate('QRISSettings', { mode: 'edit', merchant });
  };

  const renderMerchantCard = ({ item }) => (
    <View style={styles.merchantCard}>
      <TouchableOpacity 
        style={styles.cardContent}
        onPress={() => handleEditMerchant(item)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.merchantInfo}>
            <Text style={styles.merchantName}>{item.name}</Text>
            <Text style={styles.merchantId}>{item.merchant_id}</Text>
          </View>
          <View style={[
            styles.statusBadge, 
            item.is_active ? styles.statusActive : styles.statusInactive
          ]}>
            <Ionicons 
              name={item.is_active ? 'checkmark-circle' : 'close-circle'} 
              size={16} 
              color="#ffffff" 
            />
            <Text style={styles.statusText}>
              {item.is_active ? 'Aktif' : 'Tidak Aktif'}
            </Text>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          <Ionicons name="calendar-outline" size={16} color={MUTED} />
          <Text style={styles.lastTransaction}>
            Dibuat: {new Date(item.created_at).toLocaleDateString('id-ID')}
          </Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={[styles.editButton, deletingMerchantId === item.id && styles.editButtonDisabled]}
          onPress={() => handleEditMerchant(item)}
          disabled={deletingMerchantId === item.id}
        >
          <Ionicons name="pencil-outline" size={16} color={PRIMARY} />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.deleteButton, deletingMerchantId === item.id && styles.deleteButtonDisabled]}
          onPress={() => handleDeleteMerchant(item.id)}
          disabled={deletingMerchantId === item.id}
        >
          {deletingMerchantId === item.id ? (
            <ActivityIndicator size="small" color="#EF4444" />
          ) : (
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
          )}
          <Text style={styles.deleteButtonText}>
            {deletingMerchantId === item.id ? 'Menghapus...' : 'Hapus'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pengaturan QRIS</Text>
      </View>

      <View style={styles.content}>
        {/* Description */}
        <Text style={styles.description}>
          Kelola Akun QRIS Anda untuk menerima pembayaran digital
        </Text>

        {/* Add Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddMerchant}>
          <Ionicons name="add" size={24} color="#ffffff" />
          <Text style={styles.addButtonText}>Tambah</Text>
        </TouchableOpacity>



        {/* Merchants List */}
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Daftar Akun QRIS ({merchants.length})</Text>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={PRIMARY} />
              <Text style={styles.loadingText}>Memuat data...</Text>
            </View>
          ) : merchants.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="storefront-outline" size={48} color={MUTED} />
              <Text style={styles.emptyText}>Belum ada akun QRIS</Text>
              <Text style={styles.emptySubtext}>Tambahkan akun QRIS pertama Anda</Text>
            </View>
          ) : (
            <FlatList
              data={merchants}
              renderItem={renderMerchantCard}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={[PRIMARY]}
                />
              }
            />
          )}
        </View>
      </View>

      {/* Custom Delete Confirmation Dialog for Web */}
      {showDeleteConfirm && merchantToDelete && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="warning" size={24} color="#EF4444" />
              <Text style={styles.modalTitle}>Konfirmasi Hapus</Text>
            </View>
            
            <Text style={styles.modalMessage}>
              Apakah Anda yakin ingin menghapus "{merchantToDelete.name}"?
            </Text>
            
            <Text style={styles.modalWarning}>
              Tindakan ini tidak dapat dibatalkan dan semua data merchant akan dihapus secara permanen.
            </Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalButtonCancel}
                onPress={() => {
                  setShowDeleteConfirm(false);
                  setMerchantToDelete(null);
                }}
              >
                <Text style={styles.modalButtonCancelText}>Batal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalButtonDelete}
                onPress={() => confirmDelete(merchantToDelete.id, merchantToDelete.name)}
                disabled={deletingMerchantId === merchantToDelete.id}
              >
                {deletingMerchantId === merchantToDelete.id ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.modalButtonDeleteText}>Hapus</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  description: {
    fontSize: 16,
    color: MUTED,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 24,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  listContainer: {
    flex: 1,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DARK,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  merchantCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  merchantInfo: {
    flex: 1,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK,
    marginBottom: 4,
  },
  merchantId: {
    fontSize: 14,
    color: MUTED,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: PRIMARY,
  },
  statusInactive: {
    backgroundColor: '#EF4444',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  lastTransaction: {
    fontSize: 14,
    color: MUTED,
    marginLeft: 6,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: PRIMARY,
    marginLeft: 4,
  },
  editButtonDisabled: {
    opacity: 0.6,
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
    marginLeft: 4,
  },
  deleteButtonDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: MUTED,
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: DARK,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: MUTED,
    textAlign: 'center',
  },
  // Modal styles for web
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    margin: 20,
    maxWidth: 400,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DARK,
    marginLeft: 8,
  },
  modalMessage: {
    fontSize: 16,
    color: DARK,
    marginBottom: 12,
    lineHeight: 24,
  },
  modalWarning: {
    fontSize: 14,
    color: '#EF4444',
    marginBottom: 24,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButtonCancel: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#ffffff',
  },
  modalButtonCancelText: {
    fontSize: 14,
    fontWeight: '500',
    color: DARK,
  },
  modalButtonDelete: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    minWidth: 80,
    alignItems: 'center',
  },
  modalButtonDeleteText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
});

export default QRISListScreen;
