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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MonaLogo from '../components/Logo';

const PRIMARY = '#00AC81';

const ChatroomScreen = ({ navigation }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      setMessage('');
    }
  };

  const handleUpload = () => {};
  const handleMenu = () => {};
  const handleGrid = () => {};

  const handlePreview = (reportType) => {
    console.log(`Preview ${reportType}`);
  };

  const handleDownload = (reportType) => {
    console.log(`Download ${reportType}`);
  };

  const handleShare = (reportType) => {
    console.log(`Share ${reportType}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleMenu} style={styles.menuButton}>
            <Ionicons name="menu" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Analisa keuangan pertamamu</Text>
        </View>

        {/* Chat Content */}
        <ScrollView style={styles.chatContainer} showsVerticalScrollIndicator={false}>
          {/* Success Message */}
          <View style={[styles.messageContainer, styles.messageRow]}>
            <View style={styles.brandAvatar}>
              <MonaLogo size={16} />
            </View>
            <View style={styles.successBubble}>
              <Ionicons name="checkmark-circle" size={20} color={PRIMARY} />
              <Text style={styles.successText}>6 dokumen berhasil diunggah ✨</Text>
            </View>
          </View>

          {/* Analysis Message */}
          <View style={[styles.messageContainer, styles.messageRow]}>
            <View style={styles.brandAvatar}>
              <MonaLogo size={16} />
            </View>
            <View style={styles.messageBubble}>
              <Text style={styles.messageText}>
                Mona berhasil menganalisa, berikut beberapa dokumen yang Mona simpulkan dari unggahanmu:
              </Text>
            </View>
          </View>

          {/* Cash Flow Report Card */}
          <View style={[styles.messageContainer, styles.messageRow]}>
            <View style={styles.brandAvatar}>
              <MonaLogo size={16} />
            </View>
            <View style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <Ionicons name="list" size={24} color={PRIMARY} />
                <Text style={styles.reportTitle}>Laporan Arus Kas</Text>
              </View>
              <Text style={styles.reportDate}>08 Januari 2025 | 03:23 AM</Text>
              <Text style={styles.reportDescription}>
                Cash flow (arus kas) menunjukkan pergerakan uang masuk (pendapatan) dan uang keluar (pengeluaran) dalam bisnis kamu.
              </Text>
              <View style={styles.reportActions}>
                <TouchableOpacity style={styles.previewButton} onPress={() => handlePreview('Cash Flow')}>
                  <Text style={styles.previewButtonText}>Pratinjau</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.downloadButton} onPress={() => handleDownload('Cash Flow')}>
                  <Text style={styles.downloadButtonText}>Unduh</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareButton} onPress={() => handleShare('Cash Flow')}>
                  <Ionicons name="share-outline" size={20} color={PRIMARY} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Operational Report Card */}
          <View style={[styles.messageContainer, styles.messageRow]}>
            <View style={styles.brandAvatar}>
              <MonaLogo size={16} />
            </View>
            <View style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <Ionicons name="refresh-circle" size={24} color={PRIMARY} />
                <Text style={styles.reportTitle}>Laporan Operasional</Text>
              </View>
              <Text style={styles.reportDate}>08 Januari 2025 | 03:23 AM</Text>
              <Text style={styles.reportDescription}>
                Laporan operasional tuh ibarat "rapor" usaha kamu. Isinya pemasukan dan pengeluaran selama seminggu atau sebulan.
              </Text>
              <View style={styles.reportActions}>
                <TouchableOpacity style={styles.previewButton} onPress={() => handlePreview('Operational')}>
                  <Text style={styles.previewButtonText}>Pratinjau</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.downloadButton} onPress={() => handleDownload('Operational')}>
                  <Text style={styles.downloadButtonText}>Unduh</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareButton} onPress={() => handleShare('Operational')}>
                  <Ionicons name="share-outline" size={20} color={PRIMARY} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Input Bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity onPress={handleGrid} style={styles.gridButton}>
            <Ionicons name="grid-outline" size={24} color="#666" />
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Tanyakan pada Mona..."
              placeholderTextColor="#999"
              multiline
            />
          </View>
          <TouchableOpacity onPress={handleUpload} style={styles.uploadButton}>
            <Ionicons name="arrow-up-circle-outline" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sendButton, message.trim() ? styles.sendButtonActive : styles.sendButtonInactive]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Ionicons name="paper-plane" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardView: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuButton: { padding: 8 },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 16,
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  messageContainer: { marginBottom: 16 },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  brandAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  successBubble: {
    backgroundColor: '#E8F5E8',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  successText: {
    color: PRIMARY,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  messageBubble: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  messageText: {
    color: '#333',
    fontSize: 14,
    lineHeight: 20,
  },
  reportCard: {
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
    flex: 1,
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
  },
  reportDate: { fontSize: 12, color: '#666', marginBottom: 12 },
  reportDescription: { fontSize: 14, color: '#333', lineHeight: 20, marginBottom: 16 },
  reportActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  previewButton: { backgroundColor: '#f5f5f5', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  previewButtonText: { color: '#666', fontSize: 14, fontWeight: '500' },
  downloadButton: { backgroundColor: PRIMARY, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  downloadButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '500' },
  shareButton: { padding: 8 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#ffffff',
  },
  gridButton: { padding: 8, marginRight: 8 },
  inputContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    minHeight: 40,
  },
  input: { fontSize: 16, color: '#333', maxHeight: 80 },
  uploadButton: { padding: 8, marginRight: 8 },
  sendButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  sendButtonActive: { backgroundColor: PRIMARY },
  sendButtonInactive: { backgroundColor: '#ccc' },
});

export default ChatroomScreen; 