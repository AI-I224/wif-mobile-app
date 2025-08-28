import MetalHeader from '@/components/ui/MetalHeader';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const { isDark, toggleTheme } = useTheme();
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
      
      {/* Custom Header */}
      <MetalHeader isDark={isDark} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.primaryText} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.primaryText }]}>My Profile</Text>
          <View style={styles.headerRight} />
        </View>
      </MetalHeader>
      
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
            onPress={toggleTheme}
          >
            <Ionicons 
              name={isDark ? 'sunny-outline' : 'moon-outline'} 
              size={20} 
              color={colors.primaryText} 
            />
            <Text style={[styles.themeToggleText, { color: colors.primaryText }]}>
              {isDark ? 'Light Mode' : 'Dark Mode'}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerRight: {
    width: 40,
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
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  themeToggleText: {
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
