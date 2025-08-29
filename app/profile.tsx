import { Colors } from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileScreen() {
  const { isDark, themeMode, setTheme } = useTheme();
  const router = useRouter();
  const [showThemeModal, setShowThemeModal] = useState(false);
  const colors = isDark ? Colors.dark : Colors.light;
  const friendsCount = 82; // Friends count as requested

  const menuItems = [
    { icon: 'help-circle-outline', title: 'Help' },
    { icon: 'person-outline', title: 'Account' },
    { icon: 'bulb-outline', title: 'Learn' },
    { icon: 'speedometer-outline', title: 'Account limits' },
    { icon: 'megaphone-outline', title: 'Inbox' },
    { icon: 'wallet-outline', title: 'Wallets' },
    { icon: 'ticket-outline', title: 'Discounts' },
  ];

  const settingsItems = [
    { icon: 'shield-outline', title: 'Security & privacy' },
    { icon: 'notifications-outline', title: 'Notification settings' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.profileBackground }]}>
      <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.profileBackground} />
      
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color={colors.primaryText} />
      </TouchableOpacity>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={require('../assets/images/avatar.png')}
              style={[styles.profileImage, { borderColor: colors.borderColor }]}
            />
          </View>
          
          <Text style={[styles.userName, { color: colors.primaryText }]}>Sarah Williams</Text>
          
          <View style={styles.handleContainer}>
            <Text style={[styles.handle, { color: colors.primaryText }]}>@sarahwilliams</Text>
            <TouchableOpacity style={styles.qrButton}>
              <Ionicons name="qr-code-outline" size={16} color={colors.primaryText} />
            </TouchableOpacity>
          </View>

          {/* Friends Count */}
          <View style={[styles.friendsContainer, { backgroundColor: colors.cardBackground }]}>
            <Ionicons name="people-outline" size={16} color={colors.secondaryText} />
            <Text style={[styles.friendsText, { color: colors.secondaryText }]}>{friendsCount} friends</Text>
          </View>

          {/* Theme Toggle */}
          <TouchableOpacity 
            style={[styles.themeToggle, { backgroundColor: colors.cardBackground }]} 
            onPress={() => setShowThemeModal(true)}
          >
            <Ionicons 
              name="color-palette-outline" 
              size={20} 
              color={colors.primaryText} 
            />
            <Text style={[styles.themeToggleText, { color: colors.primaryText }]}>
              Change Theme
            </Text>
          </TouchableOpacity>
        </View>

        {/* Action Cards */}
        <View style={styles.actionCardsContainer}>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.cardBackground }]}>
            <Ionicons name="card-outline" size={24} color={colors.primaryText} />
            <Text style={[styles.actionCardTitle, { color: colors.primaryText }]}>Pro</Text>
            <Text style={[styles.actionCardSubtitle, { color: colors.secondaryText }]}>Your plan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.cardBackground }]}>
            <Ionicons name="person-add-outline" size={24} color={colors.primaryText} />
            <Text style={[styles.actionCardTitle, { color: colors.primaryText }]}>Invite friends</Text>
            <Text style={[styles.actionCardSubtitle, { color: colors.secondaryText }]}>Earn 50 pts or more</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={[styles.menuSection, { backgroundColor: colors.cardBackground }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={[styles.menuItem, { borderBottomColor: colors.borderColor }]}>
              <Ionicons name={item.icon as any} size={24} color={colors.primaryText} />
              <Text style={[styles.menuItemText, { color: colors.primaryText }]}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.secondaryText} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings Items */}
        <View style={[styles.menuSection, { backgroundColor: colors.cardBackground }]}>
          {settingsItems.map((item, index) => (
            <TouchableOpacity key={index} style={[styles.menuItem, { borderBottomColor: colors.borderColor }]}>
              <Ionicons name={item.icon as any} size={24} color={colors.primaryText} />
              <Text style={[styles.menuItemText, { color: colors.primaryText }]}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.secondaryText} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Theme Selection Modal */}
      <Modal
        visible={showThemeModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowThemeModal(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.profileBackground }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.borderColor }]}>
            <TouchableOpacity
              onPress={() => setShowThemeModal(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={colors.primaryText} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.primaryText }]}>Choose Theme</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <View style={styles.modalContent}>
            <View style={styles.themeOptions}>
              <TouchableOpacity 
                style={[
                  styles.themeOption, 
                  { 
                    backgroundColor: themeMode === 'light' ? colors.tint : colors.cardBackground,
                    borderColor: colors.borderColor 
                  }
                ]} 
                onPress={() => {
                  setTheme('light');
                  setShowThemeModal(false);
                }}
              >
                <Ionicons 
                  name="sunny-outline" 
                  size={24} 
                  color={themeMode === 'light' ? '#FFFFFF' : colors.primaryText} 
                />
                <Text style={[
                  styles.themeOptionText, 
                  { color: themeMode === 'light' ? '#FFFFFF' : colors.primaryText }
                ]}>
                  Light
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.themeOption, 
                  { 
                    backgroundColor: themeMode === 'dark' ? colors.tint : colors.cardBackground,
                    borderColor: colors.borderColor 
                  }
                ]} 
                onPress={() => {
                  setTheme('dark');
                  setShowThemeModal(false);
                }}
              >
                <Ionicons 
                  name="moon-outline" 
                  size={24} 
                  color={themeMode === 'dark' ? '#FFFFFF' : colors.primaryText} 
                />
                <Text style={[
                  styles.themeOptionText, 
                  { color: themeMode === 'dark' ? '#FFFFFF' : colors.primaryText }
                ]}>
                  Dark
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.themeOption, 
                  { 
                    backgroundColor: themeMode === 'system' ? colors.tint : colors.cardBackground,
                    borderColor: colors.borderColor 
                  }
                ]} 
                onPress={() => {
                  setTheme('system');
                  setShowThemeModal(false);
                }}
              >
                <Ionicons 
                  name="phone-portrait-outline" 
                  size={24} 
                  color={themeMode === 'system' ? '#FFFFFF' : colors.primaryText} 
                />
                <Text style={[
                  styles.themeOptionText, 
                  { color: themeMode === 'system' ? '#FFFFFF' : colors.primaryText }
                ]}>
                  System
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
    paddingTop: 20,
  },
  profileImageContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  handleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  handle: {
    fontSize: 16,
    marginRight: 8,
  },
  qrButton: {
    padding: 4,
  },
  friendsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  friendsText: {
    fontSize: 14,
    marginLeft: 6,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  themeToggleText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  themeSection: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  themeSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  themeOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionCardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 12,
    padding: 20,
    alignItems: 'flex-start',
  },
  actionCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  actionCardSubtitle: {
    fontSize: 14,
  },
  menuSection: {
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
  },
});
