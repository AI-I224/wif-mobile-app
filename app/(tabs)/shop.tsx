import { Colors } from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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

export default function ShopScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const router = useRouter();
  const [totalPoints, setTotalPoints] = useState(250); // Mock total points

  // Shop items data
  const shopItems = [
    {
      id: 1,
      company: "University of Bath SU Shop",
      discount: "£5 off",
      pointsCost: 100,
      description: "£5 off textbooks, stationery, or merch at the SU Shop (min. £25 spend).",
      gradient: ['#003C71', '#5AB0E6'], // Uni of Bath blue tones
      logo: require('../../assets/images/bath-su-logo.png'),
    },
    {
      id: 2,
      company: "Pret A Manger (Student)",
      discount: "£3 off",
      pointsCost: 150,
      description: "£3 off any coffee + pastry combo. Show student ID at pickup.",
      gradient: ['#7A0026', '#C8102E'],
      logo: require('../../assets/images/pret-logo.png'),
    },
    {
      id: 3,
      company: "Costa Coffee (Student)",
      discount: "£4 off",
      pointsCost: 200,
      description: "£4 off any order of £15 or more at participating Costa stores.",
      gradient: ['#A6192E', '#6E0D1C'], // Costa burgundy tones
      logo: require('../../assets/images/costa-logo.png'),
    },
    {
      id: 4,
      company: "University of Bath Sports Pass",
      discount: "1 Week Free",
      pointsCost: 500,
      description: "Enjoy 1 free week of access to campus gym & classes (new student members).",
      gradient: ['#E50914', '#B81D24'], // bold/red hero gradient
      logo: require('../../assets/images/bath-su-logo.png'),
    },
    {
      id: 5,
      company: "Boots (Student)",
      discount: "£10 off",
      pointsCost: 850,
      description: "£10 off when you spend £50+ on health & beauty in-store or online.",
      gradient: ['#00205B', '#005EB8'],
      logo: require('../../assets/images/boots-logo.png'),
    },
    {
      id: 6,
      company: "Deliveroo (Student)",
      discount: "£20 off",
      pointsCost: 1000,
      description: "£20 off across your next two orders (£10 + £10, min. spend applies).",
      gradient: ['#00C1B2', '#00A3AD'],
      logo: require('../../assets/images/deliveroo-logo.png'),
    },
  ];

  const handlePurchaseItem = (item: any) => {
    if (totalPoints >= item.pointsCost) {
      setTotalPoints(prev => prev - item.pointsCost);
      // Here you would typically make an API call to process the purchase
      console.log(`Purchased ${item.company} discount for ${item.pointsCost} points`);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.profileBackground }]}>
      <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.profileBackground} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={() => router.push('/profile')}
          >
            <Image
              source={require('../../assets/images/avatar.png')}
              style={styles.avatar}
            />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: colors.primaryText }]}>Shop</Text>
          </View>
          
          <View style={styles.headerRight}>
            <View style={[styles.pointsBadge, { backgroundColor: colors.tint }]}>
              <Ionicons name="star" size={16} color="#FFFFFF" />
              <Text style={styles.pointsBadgeText}>{totalPoints}</Text>
            </View>
          </View>
        </View>
      </View>
      
      <ScrollView style={styles.modalContent}>
        <View style={styles.shopContent}>
          {shopItems.map((item) => (
            <View key={item.id} style={[styles.shopItemCard, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.shopItemHeader}>
                <View style={styles.shopItemLeft}>
                  <Image source={item.logo} style={styles.shopItemLogo} />
                  <View style={styles.shopItemInfo}>
                    <Text style={[styles.shopItemCompany, { color: colors.primaryText }]}>
                      {item.company}
                    </Text>
                    <Text style={[styles.shopItemDescription, { color: colors.secondaryText }]}>
                      {item.description}
                    </Text>
                  </View>
                </View>
                <View style={styles.shopItemRight}>
                  <Text style={[styles.shopItemDiscount, { color: colors.primaryText }]}>
                    {item.discount}
                  </Text>
                  <Text style={[styles.shopItemPoints, { color: colors.tint }]}>
                    {item.pointsCost} pts
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity
                style={[
                  styles.shopItemButton,
                  { 
                    backgroundColor: totalPoints >= item.pointsCost ? colors.tint : '#6B7280',
                    opacity: totalPoints >= item.pointsCost ? 1 : 0.5
                  }
                ]}
                onPress={() => handlePurchaseItem(item)}
                disabled={totalPoints < item.pointsCost}
              >
                <Text style={styles.shopItemButtonText}>
                  {totalPoints >= item.pointsCost ? 'Purchase' : 'Not Enough Points'}
                </Text>
              </TouchableOpacity>
            </View>
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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 2,
  },
  headerRight: {
    alignItems: 'center',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  pointsBadgeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
  },
  shopContent: {
    padding: 20,
  },
  shopItemCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  shopItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  shopItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  shopItemLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  shopItemInfo: {
    flex: 1,
  },
  shopItemCompany: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  shopItemDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  shopItemRight: {
    alignItems: 'flex-end',
    minWidth: 120,
  },
  shopItemDiscount: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  shopItemPoints: {
    fontSize: 16,
    fontWeight: '600',
  },
  shopItemButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopItemButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
