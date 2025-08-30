import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiService from '../services/api';

const PRIMARY = '#00AC81';
const DARK = '#1F2937';
const MUTED = '#6B7280';

/**
 * QRIS Settings Screen with enhanced status management
 * Features:
 * - Add/Edit QRIS merchant information
 * - Active/Inactive status toggle
 * - API key encryption
 * - Connection testing
 * - Form validation
 */
const QRISSettingsScreen = ({ navigation, route }) => {
  const { mode = 'add', merchant } = route.params || {};
  
  const [merchantId, setMerchantId] = useState(merchant?.merchant_id || '');
  const [merchantName, setMerchantName] = useState(merchant?.name || '');
  const [apiKey, setApiKey] = useState(merchant?.api_key || '');
  const [isActive, setIsActive] = useState(merchant?.is_active ?? true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showConnectionStatus, setShowConnectionStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSave = async () => {
    // For edit mode, API key might be empty if not changed
    const isApiKeyRequired = mode === 'add' || apiKey.trim() !== '';
    
    if (!merchantName.trim() || !merchantId.trim() || (isApiKeyRequired && !apiKey.trim())) {
      Alert.alert('Error', 'Semua field harus diisi');
      return;
    }

    setIsLoading(true);
    try {
      const merchantData = {
        name: merchantName.trim(),
        merchant_id: merchantId.trim(),
        is_active: isActive,
      };

      // Only include API key if it's provided (for edit mode)
      if (apiKey.trim()) {
        merchantData.api_key = apiKey.trim();
      }

      if (mode === 'add') {
        await apiService.createMerchant(merchantData);
        const statusMessage = isActive ? 'dan aktif' : 'dan tidak aktif';
        Alert.alert('Sukses', `QRIS merchant berhasil ditambahkan ${statusMessage}`);
      } else {
        await apiService.updateMerchant(merchant.id, merchantData);
        const statusMessage = isActive ? 'dan diaktifkan' : 'dan dinonaktifkan';
        Alert.alert('Sukses', `QRIS merchant berhasil diperbarui ${statusMessage}`);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!merchant?.id) {
      Alert.alert('Error', 'Simpan merchant terlebih dahulu sebelum test koneksi');
      return;
    }

    if (!isActive) {
      Alert.alert('Error', 'Merchant harus aktif untuk test koneksi');
      return;
    }

    setIsLoading(true);
    setShowConnectionStatus(false);
    setConnectionStatus(null);

    try {
      const result = await apiService.testMerchantConnection(merchant.id);
      setConnectionStatus('success');
      setShowConnectionStatus(true);
      Alert.alert('Sukses', 'Koneksi QRIS berhasil');
    } catch (error) {
      setConnectionStatus('error');
      setShowConnectionStatus(true);
      Alert.alert('Error', error.message || 'Koneksi QRIS gagal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {mode === 'add' ? 'Tambah QRIS' : 'Edit QRIS'}
          </Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Description */}
          <Text style={styles.description}>
            Daftarkan Akun QRIS untuk terhubung dengan Mona!
          </Text>

          {/* Merchant Name Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nama Akun</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="storefront-outline" size={20} color={merchantName ? PRIMARY : MUTED} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={merchantName}
                onChangeText={setMerchantName}
                placeholder="Masukkan nama merchant"
                placeholderTextColor={MUTED}
              />
            </View>
          </View>

          {/* Merchant ID Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ID Merchant</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="business-outline" size={20} color={merchantId ? PRIMARY : MUTED} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={merchantId}
                onChangeText={setMerchantId}
                placeholder="Masukkan ID Merchant"
                placeholderTextColor={MUTED}
              />
            </View>
          </View>

          {/* API Key Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              API Key {mode === 'edit' && <Text style={styles.optionalText}>(Opsional)</Text>}
            </Text>
            <View style={styles.inputContainer}>
              <Ionicons name="key-outline" size={20} color={apiKey ? PRIMARY : MUTED} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={apiKey}
                onChangeText={setApiKey}
                placeholder={mode === 'edit' ? 'Kosongkan jika tidak ingin mengubah' : 'Masukkan API Key'}
                placeholderTextColor={MUTED}
                secureTextEntry={!showApiKey}
              />
              <TouchableOpacity onPress={() => setShowApiKey(!showApiKey)} style={styles.eyeButton}>
                <Ionicons 
                  name={showApiKey ? 'eye-off-outline' : 'eye-outline'} 
                  size={20} 
                  color={MUTED} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Status Selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Status Akun</Text>
            <View style={styles.statusSelectorContainer}>
              <TouchableOpacity
                style={[
                  styles.statusOption,
                  isActive && styles.statusOptionActive
                ]}
                onPress={() => setIsActive(true)}
              >
                <Ionicons 
                  name="checkmark-circle" 
                  size={20} 
                  color={isActive ? '#ffffff' : PRIMARY} 
                />
                <Text style={[
                  styles.statusOptionText,
                  isActive && styles.statusOptionTextActive
                ]}>
                  Aktif
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.statusOption,
                  !isActive && styles.statusOptionInactive
                ]}
                onPress={() => setIsActive(false)}
              >
                <Ionicons 
                  name="close-circle" 
                  size={20} 
                  color={!isActive ? '#ffffff' : '#EF4444'} 
                />
                <Text style={[
                  styles.statusOptionText,
                  !isActive && styles.statusOptionTextInactive
                ]}>
                  Tidak Aktif
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.statusDescription}>
              {isActive 
                ? 'Akun dapat digunakan untuk transaksi QRIS' 
                : 'Akun tidak dapat digunakan untuk transaksi QRIS'
              }
            </Text>
          </View>

          {/* Connection Status */}
          {showConnectionStatus && (
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusIndicator,
                connectionStatus === 'error' && styles.statusIndicatorError
              ]}>
                <Ionicons 
                  name={connectionStatus === 'success' ? 'checkmark-circle' : 'close-circle'} 
                  size={20} 
                  color={connectionStatus === 'success' ? PRIMARY : '#EF4444'} 
                />
                <Text style={[
                  styles.statusText,
                  connectionStatus === 'error' && styles.statusTextError
                ]}>
                  {connectionStatus === 'success' ? 'Terhubung ke QRIS' : 'Gagal terhubung ke QRIS'}
                </Text>
              </View>
            </View>
          )}

          {/* Test Connection Button */}
          <TouchableOpacity 
            style={[
              styles.testButton, 
              (isLoading || !isActive) && styles.testButtonDisabled
            ]} 
            onPress={handleTestConnection}
            disabled={isLoading || !isActive}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={PRIMARY} />
            ) : (
              <Ionicons name="refresh-outline" size={20} color={PRIMARY} />
            )}
            <Text style={styles.testButtonText}>
              {isLoading ? 'Testing...' : !isActive ? 'Aktifkan untuk Test' : 'Test Koneksi'}
            </Text>
          </TouchableOpacity>

          {/* Spacer */}
          <View style={styles.spacer} />
        </ScrollView>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]} 
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.saveButtonText}>
                {mode === 'add' ? 'Tambah QRIS' : 'Simpan Perubahan'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardView: {
    flex: 1,
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
    marginBottom: 32,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: DARK,
    marginBottom: 8,
  },
  optionalText: {
    fontSize: 14,
    fontWeight: '400',
    color: MUTED,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: DARK,
  },
  eyeButton: {
    padding: 4,
  },
  statusSelectorContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statusOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#ffffff',
  },
  statusOptionActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  statusOptionInactive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  statusOptionText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  statusOptionTextActive: {
    color: '#ffffff',
  },
  statusOptionTextInactive: {
    color: '#ffffff',
  },
  statusDescription: {
    fontSize: 14,
    color: MUTED,
    marginTop: 8,
    fontStyle: 'italic',
  },
  statusContainer: {
    marginBottom: 24,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statusText: {
    fontSize: 14,
    color: PRIMARY,
    fontWeight: '500',
    marginLeft: 8,
  },
  statusTextError: {
    color: '#EF4444',
  },
  statusIndicatorError: {
    backgroundColor: '#FEE2E2',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PRIMARY,
    paddingVertical: 12,
    marginBottom: 24,
  },
  testButtonText: {
    fontSize: 16,
    color: PRIMARY,
    fontWeight: '500',
    marginLeft: 8,
  },
  testButtonDisabled: {
    opacity: 0.6,
  },
  spacer: {
    height: 100,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  saveButton: {
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
});

export default QRISSettingsScreen;
