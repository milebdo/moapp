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

const PRIMARY = '#00C896';
const SURFACE = '#F2F3F5';
const BLUE = '#5A8DF7';

const HelloScreen = ({ navigation }) => {
  const [message, setMessage] = useState('');

  const handleMenu = () => {};
  const handleUpload = () => {
    navigation.navigate('Chatroom');
  };
  const handleSend = () => {
    if (!message.trim()) return;
    setMessage('');
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
            <Ionicons name="menu" size={26} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Halo!</Text>
          <View style={{ width: 26 }} />
        </View>

        {/* Content */}
        <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 24 }}>
          {/* Greeting bubble */}
          <View style={styles.messageRow}>
            <View style={styles.avatar}>
              <Ionicons name="chatbubble-ellipses" size={16} color="#00C291" />
            </View>
            <View style={styles.greetingBubble}>
              <Text style={styles.greetingText}>
                Halo Arif, aku <Text style={{ color: PRIMARY, fontWeight: '700' }}>Mona</Text>, asisten keuangan usahamu. 🙌
              </Text>
            </View>
          </View>

          {/* Upload CTA Card */}
          <View style={styles.ctaCard}>
            <View style={styles.ctaHeader}>
              <Ionicons name="checkmark-circle" size={18} color={PRIMARY} />
              <Text style={styles.ctaHeaderText}> Mulai unggah gambar dokumen</Text>
            </View>
            <Text style={styles.ctaBodyText}>
              keuanganmu, biar aku bantu analisa dan buat pencatatan usahamu! 🥰
            </Text>

            <TouchableOpacity style={styles.ctaButton} onPress={handleUpload}>
              <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
              <Text style={styles.ctaButtonText}>Mulai unggah</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Composer */}
        <View style={styles.composerWrap}>
          <TouchableOpacity style={styles.gridBtn}>
            <Ionicons name="grid-outline" size={20} color="#0F172A" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Tanyakan pada Mona..."
            placeholderTextColor="#94A3B8"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SURFACE,
  },
  keyboardView: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  menuButton: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  scroll: { paddingHorizontal: 16 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 24 },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E8FFF8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  greetingBubble: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  greetingText: { color: '#0F172A', fontSize: 16, lineHeight: 22 },
  ctaCard: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  ctaHeader: { flexDirection: 'row', alignItems: 'center' },
  ctaHeaderText: { color: '#1F2937', fontSize: 15, fontWeight: '600' },
  ctaBodyText: { marginTop: 8, color: '#374151', fontSize: 14, lineHeight: 20 },
  ctaButton: {
    marginTop: 12,
    backgroundColor: BLUE,
    borderRadius: 22,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  ctaButtonText: { color: '#fff', fontSize: 16, fontWeight: '700', marginLeft: 8 },
  composerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  gridBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    color: '#0F172A',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HelloScreen; 