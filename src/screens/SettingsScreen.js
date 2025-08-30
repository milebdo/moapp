import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#00AC81';

const SettingsScreen = ({ navigation }) => {
  const handleBack = () => {
    navigation.goBack();
  };

  const handleAccountInfo = () => {
    console.log('Account info pressed');
  };

  const handleSavedChats = () => {
    navigation.navigate('QRISList');
  };

  const handleHelp = () => {
    console.log('Help pressed');
  };

  const handleTerms = () => {
    console.log('Terms and conditions pressed');
  };

  const handlePrivacy = () => {
    console.log('Privacy policy pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pengaturan</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Akun</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleAccountInfo}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="person-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Info akun</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleSavedChats}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="archive-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Percakapan tersimpan</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleSavedChats}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="qr-code-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Sambungkan QRIS</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tentang</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleHelp}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="help-circle-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Bantuan</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleTerms}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="document-text-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Syarat Ketentuan</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handlePrivacy}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="lock-closed-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Kebijakan privasi</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
});

export default SettingsScreen;
