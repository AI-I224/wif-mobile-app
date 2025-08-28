import MetalHeader from '@/components/ui/MetalHeader';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import bankingData from '../../banking.json';
import { OPENAI_CONFIG } from '../../config/openai';

const { width: screenWidth } = Dimensions.get('window');

interface Transaction {
  transaction_id: string;
  amount: number;
  direction: 'credit' | 'debit';
  date: string;
  name: string;
  merchant_name?: string;
  category: string[];
  running_balance: number;
}

export default function HomeScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<{id: string, role: 'user' | 'assistant', content: string, timestamp: Date}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation values for card swiping
  const translateX = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  
  // Initial fade in animation
  React.useEffect(() => {
    Animated.timing(cardOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const account = bankingData.account;
  const transactions = bankingData.transactions as Transaction[];

  // OpenAI API configuration
  const OPENAI_API_KEY = OPENAI_CONFIG.API_KEY;
  const OPENAI_API_URL = OPENAI_CONFIG.API_URL;

  // Function to analyze banking data and create financial summary
  const getFinancialSummary = () => {
    const currentBalance = account.balances.current;
    const openingBalance = bankingData.period.opening_balance;
    const netChange = currentBalance - openingBalance;
    
    // Calculate spending by category
    const categorySpending: { [key: string]: number } = {};
    const totalSpending = transactions
      .filter(t => t.direction === 'debit')
      .reduce((sum, t) => {
        const category = t.category[0];
        categorySpending[category] = (categorySpending[category] || 0) + t.amount;
        return sum + t.amount;
      }, 0);
    
    // Calculate total income
    const totalIncome = transactions
      .filter(t => t.direction === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Get recent transactions (last 10)
    const recentTransactions = transactions
      .slice(-10)
      .map(t => ({
        date: t.date,
        name: t.name,
        amount: t.amount,
        direction: t.direction,
        category: t.category[0]
      }));
    
    // Calculate daily spending average
    const daysInPeriod = new Date(bankingData.period.end_date).getDate();
    const dailySpendingAverage = totalSpending / daysInPeriod;
    
    return {
      currentBalance,
      openingBalance,
      netChange,
      totalSpending,
      totalIncome,
      categorySpending,
      recentTransactions,
      dailySpendingAverage,
      currency: account.balances.iso_currency_code,
      period: `${bankingData.period.start_date} to ${bankingData.period.end_date}`
    };
  };

  // Function to send message to OpenAI
  const sendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsLoading(true);
    
    try {
      // Get financial summary for context
      const financialSummary = getFinancialSummary();
      
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: OPENAI_CONFIG.MODEL,
          messages: [
            {
              role: 'system',
              content: `You are a helpful AI financial assistant with access to the user's actual banking data. Use this financial context to provide personalized advice:

FINANCIAL CONTEXT:
- Current Balance: ${financialSummary.currency} ${financialSummary.currentBalance.toFixed(2)}
- Period: ${financialSummary.period}
- Net Change: ${financialSummary.currency} ${financialSummary.netChange.toFixed(2)}
- Total Income: ${financialSummary.currency} ${financialSummary.totalIncome.toFixed(2)}
- Total Spending: ${financialSummary.currency} ${financialSummary.totalSpending.toFixed(2)}
- Daily Spending Average: ${financialSummary.currency} ${financialSummary.dailySpendingAverage.toFixed(2)}

SPENDING BY CATEGORY:
${Object.entries(financialSummary.categorySpending)
  .map(([category, amount]) => `- ${category}: ${financialSummary.currency} ${amount.toFixed(2)}`)
  .join('\n')}

RECENT TRANSACTIONS (Last 10):
${financialSummary.recentTransactions
  .map(t => `${t.date}: ${t.name} (${t.category}) - ${financialSummary.currency} ${t.amount.toFixed(2)}`)
  .join('\n')}

INSTRUCTIONS:
- Analyze the user's spending patterns and provide personalized financial advice
- Reference specific transactions and categories when relevant
- Suggest budgeting improvements based on their actual spending
- Be specific about amounts and categories from their data
- Provide guidance and education on financial scams that can be used to steal money from the user
- Provide actionable recommendations for saving money
- Be friendly, professional, and concise`
            },
            ...chatMessages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: OPENAI_CONFIG.MAX_TOKENS,
          temperature: OPENAI_CONFIG.TEMPERATURE
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: data.choices[0].message.content,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: 'Sorry, I encountered an error. Please check your internet connection and try again.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Notification data
  const notifications = [
    {
      id: 1,
      type: 'wager_invite',
      title: 'Wager Invite from Sarah',
      message: 'Sarah invited you to join "Monthly Grocery Challenge"',
      time: '2 hours ago',
      icon: 'game-controller',
      color: '#3b82f6',
    },
    {
      id: 2,
      type: 'wager_invite',
      title: 'Wager Invite from Mike',
      message: 'Mike invited you to join "Entertainment Budget Race"',
      time: '5 hours ago',
      icon: 'game-controller',
      color: '#3b82f6',
    },
    {
      id: 3,
      type: 'friend_request',
      title: 'Friend Request from Emma',
      message: 'Emma wants to connect with you',
      time: '1 day ago',
      icon: 'person-add',
      color: '#10b981',
    },
    {
      id: 4,
      type: 'scam_detected',
      title: 'Scam Detected',
      message: 'We detected a suspicious email in your inbox',
      time: '3 days ago',
      icon: 'warning',
      color: '#ef4444',
    },
  ];

  // Card data for swiping
  const cards = [
    {
      id: 'balance',
      title: 'Balance Trend',
      component: 'balance',
    },
    {
      id: 'categories',
      title: 'Spending Categories',
      component: 'categories',
    },
    {
      id: 'merchants',
      title: 'Top 3 Merchant Spending',
      component: 'merchants',
    },
  ];

  // Handle card swiping
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { 
      useNativeDriver: true,
      listener: (event: any) => {
        // Add subtle opacity change during swipe for better visual feedback
        const { translationX } = event.nativeEvent;
        const opacityValue = Math.max(0.7, 1 - Math.abs(translationX) / 200);
        cardOpacity.setValue(opacityValue);
      }
    }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX } = event.nativeEvent;
      
      if (translationX < -100) {
        // Swipe left - go to next card
        const nextIndex = (currentCardIndex + 1) % cards.length;
        setCurrentCardIndex(nextIndex);
        animateCardTransition(nextIndex);
      } else if (translationX > 100) {
        // Swipe right - go to previous card
        const prevIndex = (currentCardIndex - 1 + cards.length) % cards.length;
        setCurrentCardIndex(prevIndex);
        animateCardTransition(prevIndex);
      }
      
      // Reset translation animation
      Animated.timing(translateX, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  };

  const animateCardTransition = (newIndex: number) => {
    // Fade out current card
    Animated.timing(cardOpacity, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
    }).start(() => {
      // After fade out, fade in new card
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    });
  };

  // Calculate balance trend data
  const chartData = useMemo(() => {
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (timeRange === 'week') {
      // Show daily balance for the last 7 days
      const today = new Date('2025-07-31'); // Using the last date from our data
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 6); // 7 days including today
      
      const weekData = sortedTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= weekAgo && transactionDate <= today;
      });
      
      const labels: string[] = [];
      const data: number[] = [];
      
      // Create daily data points for the last 7 days
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(weekAgo);
        currentDate.setDate(weekAgo.getDate() + i);
        
        const dayTransactions = weekData.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate.toDateString() === currentDate.toDateString();
        });
        
        const dayNumber = currentDate.getDate().toString();
        labels.push(dayNumber);
        
        if (dayTransactions.length > 0) {
          // Use the last transaction of the day
          data.push(dayTransactions[dayTransactions.length - 1].running_balance);
        } else {
          // If no transactions for this day, use the previous day's balance or opening balance
          const previousDayTransactions = sortedTransactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate < currentDate;
          });
          
          if (previousDayTransactions.length > 0) {
            data.push(previousDayTransactions[previousDayTransactions.length - 1].running_balance);
          } else {
            data.push(bankingData.period.opening_balance);
          }
        }
      }
      
      return { labels, data };
    } else {
      // Show weekly balance for the month (every 3-4 days to reduce data points)
      const monthData = sortedTransactions.filter(t => 
        new Date(t.date).getMonth() === 6 && new Date(t.date).getFullYear() === 2025
      );
      
      const labels: string[] = [];
      const data: number[] = [];
      
      // Create data points every 3 days to reduce clutter
      for (let day = 1; day <= 31; day += 3) {
        const dayTransactions = monthData.filter(t => 
          new Date(t.date).getDate() === day
        );
        
        if (dayTransactions.length > 0) {
          labels.push(day.toString());
          data.push(dayTransactions[dayTransactions.length - 1].running_balance);
        } else {
          // If no transactions for this day, find the closest previous transaction
          const previousDayTransactions = sortedTransactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === 6 && 
                   transactionDate.getFullYear() === 2025 && 
                   transactionDate.getDate() <= day;
          });
          
          if (previousDayTransactions.length > 0) {
            labels.push(day.toString());
            data.push(previousDayTransactions[previousDayTransactions.length - 1].running_balance);
          }
        }
      }
      
      // Add the last day of the month if not already included
      const lastDay = 31;
      if (!labels.includes(lastDay.toString())) {
        const lastDayTransactions = monthData.filter(t => 
          new Date(t.date).getDate() === lastDay
        );
        
                  if (lastDayTransactions.length > 0) {
            labels.push(lastDay.toString());
            data.push(lastDayTransactions[lastDayTransactions.length - 1].running_balance);
          } else {
          // Use the last available transaction
          const allMonthTransactions = sortedTransactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === 6 && transactionDate.getFullYear() === 2025;
          });
          
          if (allMonthTransactions.length > 0) {
            labels.push(lastDay.toString());
            data.push(allMonthTransactions[allMonthTransactions.length - 1].running_balance);
          }
        }
      }
      
      return { labels, data };
    }
  }, [timeRange, transactions]);

  const latestTransactions = transactions.slice(-5);

  // Calculate total income and spending
  const totalIncome = transactions
    .filter(t => t.direction === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpending = transactions
    .filter(t => t.direction === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate spending by category for the selected time range
  const spendingByCategory = useMemo(() => {
    let filteredTransactions = transactions.filter(t => t.direction === 'debit');
    
    if (timeRange === 'week') {
      const today = new Date('2025-07-31');
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 6);
      
      filteredTransactions = filteredTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= weekAgo && transactionDate <= today;
      });
    } else {
      // Month view - already filtered by the period in banking.json
      filteredTransactions = filteredTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === 6 && transactionDate.getFullYear() === 2025;
      });
    }

    const categoryTotals: { [key: string]: number } = {};
    
    filteredTransactions.forEach(transaction => {
      const category = transaction.category[0];
      if (category) {
        categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
      }
    });

    // Convert to chart data format
    // Generate vibrant colors for the pie chart
    const generateVibrantColors = (count: number) => {
      const vibrantColors = [
        '#FF6B6B', // Vibrant red
        '#4ECDC4', // Vibrant teal
        '#45B7D1', // Vibrant blue
        '#96CEB4', // Vibrant green
        '#FFEAA7', // Vibrant yellow
        '#DDA0DD', // Vibrant purple
        '#98D8C8', // Vibrant mint
        '#F7DC6F', // Vibrant gold
        '#FF9FF3', // Vibrant pink
        '#54A0FF', // Vibrant sky blue
        '#5F27CD', // Vibrant violet
        '#00D2D3', // Vibrant cyan
        '#FF6348', // Vibrant coral
        '#2ED573', // Vibrant lime
        '#FFA502', // Vibrant orange
        '#A55EEA'  // Vibrant lavender
      ];
      
      const colors = [];
      for (let i = 0; i < count; i++) {
        colors.push(vibrantColors[i % vibrantColors.length]);
      }
      
      return colors;
    };
    
    const colors = generateVibrantColors(8);
    const data = Object.entries(categoryTotals).map(([category, amount], index) => ({
      name: category,
      amount: amount,
      color: colors[index % colors.length],
      legendFontColor: colors[index % colors.length],
      legendFontSize: 12,
    }));

    return data;
  }, [timeRange, transactions]);

  // Calculate top 5 merchant spending for the selected time range
  const topMerchantSpending = useMemo(() => {
    let filteredTransactions = transactions.filter(t => t.direction === 'debit');
    
    if (timeRange === 'week') {
      const today = new Date('2025-07-31');
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 6);
      
      filteredTransactions = filteredTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= weekAgo && transactionDate <= today;
      });
    } else {
      // Month view - already filtered by the period in banking.json
      filteredTransactions = filteredTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === 6 && transactionDate.getFullYear() === 2025;
      });
    }

    const merchantTotals: { [key: string]: number } = {};
    
    filteredTransactions.forEach(transaction => {
      const merchant = transaction.merchant_name || transaction.name;
      if (merchant) {
        merchantTotals[merchant] = (merchantTotals[merchant] || 0) + transaction.amount;
      }
    });

    // Sort by amount and take top 3
    const sortedMerchants = Object.entries(merchantTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    return sortedMerchants.map(([merchant, amount]) => ({
      name: merchant,
      amount: amount,
    }));
  }, [timeRange, transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getCategoryIcon = (category: string[]) => {
    const categoryName = category[0]?.toLowerCase() || '';
    switch (categoryName) {
      case 'income':
        return 'trending-up';
      case 'groceries':
        return 'storefront';
      case 'eating out':
        return 'restaurant';
      case 'transport':
        return 'car';
      case 'entertainment':
        return 'game-controller';
      case 'bills & utilities':
        return 'receipt';
      default:
        return 'card';
    }
  };

  const chartConfig = {
    backgroundColor: colors.cardBackground,
    backgroundGradientFrom: colors.cardBackground,
    backgroundGradientTo: colors.cardBackground,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${isDark ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '3',
      strokeWidth: '2',
      stroke: '#3b82f6',
    },
    propsForLabels: {
      fontSize: 10,
    },
    formatYLabel: (value: string) => {
      const num = parseFloat(value);
      if (num >= 1000) {
        return `£${(num / 1000).toFixed(1)}k`;
      }
      return `£${Math.round(num)}`;
    },
    formatXLabel: (value: string) => {
      return value;
    },
    yAxisLabel: '£',
    yAxisSuffix: '',
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.profileBackground }]}>
        <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.profileBackground} />
      
      {/* Header */}
      <MetalHeader isDark={isDark} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={styles.avatarContainer}
              onPress={() => router.push('/profile')}
            >
              <Image
                source={require('../../assets/images/avatar.png')}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View>
              <Text style={[styles.accountName, { color: colors.primaryText }]}>Sarah Williams</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => setShowNotifications(true)}
          >
            <Ionicons name="notifications-outline" size={24} color={colors.primaryText} />
            {notifications.length > 0 && (
              <View style={[styles.notificationBadge, { backgroundColor: '#ef4444' }]}>
                <Text style={styles.notificationBadgeText}>{notifications.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </MetalHeader>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Balance Section */}
        <View style={styles.balanceSection}>
          <View style={styles.balanceHeader}>
            <Text style={[styles.balanceLabel, { color: colors.primaryText }]}>Total Balance</Text>
            <Text style={[styles.balanceAmount, { color: colors.primaryText }]}>
              {formatCurrency(account.balances.current)}
            </Text>
            <TouchableOpacity 
              style={[styles.chatButton, { backgroundColor: colors.tint }]}
              onPress={() => {
                setShowChatModal(true);
                // Clear chat when opening modal
                setChatMessages([]);
                setChatInput('');
              }}
            >
              <Ionicons name="chatbubble-outline" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.returnSection}>
            <View style={styles.returnItem}>
              <Text style={[styles.returnLabel, { color: colors.secondaryText }]}>TOTAL INCOME</Text>
              <Text style={styles.returnValue}>
                {formatCurrency(totalIncome)}
              </Text>
            </View>
            <View style={styles.returnItem}>
              <Text style={[styles.returnLabel, { color: colors.secondaryText }]}>TOTAL SPENDING</Text>
              <Text style={[styles.spendingValue, { color: '#ef4444' }]}>
                {formatCurrency(totalSpending)}
              </Text>
            </View>
          </View>
        </View>

        {/* Swipeable Cards Section */}
        <View style={styles.swipeableCardsContainer}>
          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
          >
            <Animated.View
              style={[
                styles.swipeableCard,
                {
                  transform: [{ translateX }],
                  opacity: cardOpacity,
                  backgroundColor: colors.cardBackground,
                },
              ]}
            >
              {currentCardIndex === 0 && (
                <View style={styles.chartSection}>
                  <View style={styles.chartHeader}>
                    <Text style={[styles.chartTitle, { color: colors.primaryText }]}>Balance Trend</Text>
                    <View style={[styles.timeRangeButtons, { backgroundColor: colors.borderColor }]}>
                      <TouchableOpacity
                        style={[styles.timeButton, timeRange === 'week' && styles.timeButtonActive]}
                        onPress={() => setTimeRange('week')}
                      >
                        <Text style={[styles.timeButtonText, timeRange === 'week' && styles.timeButtonTextActive]}>
                          1W
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.timeButton, timeRange === 'month' && styles.timeButtonActive]}
                        onPress={() => setTimeRange('month')}
                      >
                        <Text style={[styles.timeButtonText, timeRange === 'month' && styles.timeButtonTextActive]}>
                          1M
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  {/* Axis Labels */}
                  <View style={styles.axisLabelsContainer}>
                    <Text style={[styles.xAxisLabel, { color: colors.secondaryText }]}>
                      {timeRange === 'week' ? 'July 2025' : 'July 2025'}
                    </Text>
                  </View>
                  
                  {chartData.labels.length > 0 && (
                    <View style={styles.chartContainer}>
                      <LineChart
                        data={{
                          labels: chartData.labels,
                          datasets: [
                            {
                              data: chartData.data,
                              color: () => `rgba(59, 130, 246, 0.6)`,
                              strokeWidth: 2,
                            },
                          ],
                        }}
                        width={screenWidth - 120}
                        height={200}
                        chartConfig={chartConfig}
                        bezier
                        style={styles.chart}
                        withDots={false}
                        withShadow={false}
                        withScrollableDot={false}
                        withInnerLines={true}
                        withOuterLines={true}
                        withVerticalLines={false}
                        withHorizontalLines={true}
                        segments={4}
                        yAxisLabel="£"
                        yAxisSuffix=""
                        yAxisInterval={1}
                      />
                    </View>
                  )}
                </View>
              )}

                        {currentCardIndex === 1 && (
                <View style={styles.spendingCategoriesSection}>
                  <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Spending Categories</Text>
                    <View style={[styles.spendingTimeRangeButtons, { backgroundColor: colors.borderColor }]}>
                      <TouchableOpacity
                        style={[styles.spendingTimeButton, timeRange === 'week' && styles.spendingTimeButtonActive]}
                        onPress={() => setTimeRange('week')}
                      >
                        <Text style={[styles.spendingTimeButtonText, timeRange === 'week' && styles.spendingTimeButtonTextActive]}>
                          1W
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.spendingTimeButton, timeRange === 'month' && styles.spendingTimeButtonActive]}
                        onPress={() => setTimeRange('month')}
                      >
                        <Text style={[styles.spendingTimeButtonText, timeRange === 'month' && styles.spendingTimeButtonTextActive]}>
                          1M
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  {spendingByCategory.length > 0 && (
                    <View style={styles.pieChartContainer}>
                      <View style={styles.pieChartWrapper}>
                        <PieChart
                          data={spendingByCategory}
                          width={200}
                          height={200}
                          chartConfig={{
                            backgroundColor: colors.cardBackground,
                            backgroundGradientFrom: colors.cardBackground,
                            backgroundGradientTo: colors.cardBackground,
                            color: (opacity = 1) => `rgba(${isDark ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(${isDark ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
                          }}
                          accessor="amount"
                          backgroundColor="transparent"
                          paddingLeft="50"
                          absolute
                          hasLegend={false}
                        />
                      </View>
                      
                      <View style={styles.categoryLegend}>
                        {spendingByCategory.map((category, index) => (
                          <View key={index} style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: category.color }]} />
                            <View style={styles.legendText}>
                              <Text style={[styles.legendCategory, { color: colors.primaryText }]}>{category.name}</Text>
                              <Text style={[styles.legendAmount, { color: colors.secondaryText }]}>{formatCurrency(category.amount)}</Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              )}

                        {currentCardIndex === 2 && (
                <View style={styles.merchantSpendingSection}>
                  <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Top 3 Merchants</Text>
                    <View style={[styles.spendingTimeRangeButtons, { backgroundColor: colors.borderColor }]}>
                      <TouchableOpacity
                        style={[styles.spendingTimeButton, timeRange === 'week' && styles.spendingTimeButtonActive]}
                        onPress={() => setTimeRange('week')}
                      >
                        <Text style={[styles.spendingTimeButtonText, timeRange === 'week' && styles.spendingTimeButtonTextActive]}>
                          1W
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.spendingTimeButton, timeRange === 'month' && styles.spendingTimeButtonActive]}
                        onPress={() => setTimeRange('month')}
                      >
                        <Text style={[styles.spendingTimeButtonText, timeRange === 'month' && styles.spendingTimeButtonTextActive]}>
                          1M
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  {topMerchantSpending.length > 0 && (
                    <View style={styles.merchantList}>
                      {topMerchantSpending.map((merchant, index) => (
                        <View key={merchant.name} style={[styles.merchantItem, { borderBottomColor: colors.borderColor }]}>
                          <View style={styles.merchantLeft}>
                            <View style={styles.merchantRank}>
                              <Text style={styles.merchantRankText}>#{index + 1}</Text>
                            </View>
                            <View style={styles.merchantDetails}>
                              <Text style={[styles.merchantName, { color: colors.primaryText }]}>{merchant.name}</Text>
                            </View>
                          </View>
                          <Text style={styles.merchantAmount}>{formatCurrency(merchant.amount)}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </Animated.View>
          </PanGestureHandler>
          
          {/* Card Indicator */}
          <View style={styles.cardIndicator}>
            {cards.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicatorDot,
                  index === currentCardIndex && styles.indicatorDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Transaction History Section */}
        <View style={styles.transactionSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Recent Transactions</Text>
            <TouchableOpacity
              onPress={() => setShowTransactionHistory(true)}
              style={styles.viewAllButton}
            >
              <Text style={[styles.viewAllText, { color: colors.tint }]}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.tint} />
            </TouchableOpacity>
          </View>
          
          {latestTransactions.map((transaction, index) => (
            <View key={transaction.transaction_id} style={[styles.transactionItem, { borderBottomColor: colors.borderColor }]}>
              <View style={styles.transactionLeft}>
                <View style={[styles.transactionIcon, { backgroundColor: colors.cardBackground }]}>
                  <Ionicons
                    name={getCategoryIcon(transaction.category) as any}
                    size={20}
                    color={colors.tint}
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={[styles.transactionName, { color: colors.primaryText }]}>{transaction.name}</Text>
                  <Text style={[styles.transactionDate, { color: colors.secondaryText }]}>{formatDate(transaction.date)}</Text>
                </View>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  transaction.direction === 'credit' ? styles.creditAmount : styles.debitAmount,
                ]}
              >
                {transaction.direction === 'credit' ? '+' : '-'}
                {formatCurrency(Math.abs(transaction.amount))}
              </Text>
            </View>
          ))}
        </View>

        {/* Quick Actions Section */}
        <View style={styles.quickActionsSection}>
          <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="add-circle" size={24} color={colors.tint} />
              </View>
              <Text style={[styles.quickActionText, { color: colors.primaryText }]}>Add Income</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="remove-circle" size={24} color="#ef4444" />
              </View>
              <Text style={[styles.quickActionText, { color: colors.primaryText }]}>Add Expense</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Transaction History Modal */}
      <Modal
        visible={showTransactionHistory}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.profileBackground }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.borderColor }]}>
            <Text style={[styles.modalTitle, { color: colors.primaryText }]}>Transaction History</Text>
            <TouchableOpacity
              onPress={() => setShowTransactionHistory(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={colors.primaryText} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {[...transactions].reverse().map((transaction) => (
              <View key={transaction.transaction_id} style={[styles.modalTransactionItem, { borderBottomColor: colors.borderColor }]}>
                <View style={styles.transactionLeft}>
                  <View style={[styles.transactionIcon, { backgroundColor: colors.cardBackground }]}>
                    <Ionicons
                      name={getCategoryIcon(transaction.category) as any}
                      size={20}
                      color={colors.tint}
                    />
                  </View>
                  <View style={styles.transactionDetails}>
                    <Text style={[styles.transactionName, { color: colors.primaryText }]}>{transaction.name}</Text>
                    <Text style={[styles.transactionDate, { color: colors.secondaryText }]}>{formatDate(transaction.date)}</Text>
                    <Text style={[styles.transactionCategory, { color: colors.secondaryText }]}>{transaction.category[0]}</Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    transaction.direction === 'credit' ? styles.creditAmount : styles.debitAmount,
                  ]}
                >
                  {transaction.direction === 'credit' ? '+' : '-'}
                  {formatCurrency(Math.abs(transaction.amount))}
                </Text>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Notifications Modal */}
      <Modal
        visible={showNotifications}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.profileBackground }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.borderColor }]}>
            <Text style={[styles.modalTitle, { color: colors.primaryText }]}>Notifications</Text>
            <TouchableOpacity
              onPress={() => setShowNotifications(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={colors.primaryText} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {notifications.map((notification) => (
              <View key={notification.id} style={[styles.notificationItem, { borderBottomColor: colors.borderColor }]}>
                <View style={styles.notificationLeft}>
                  <View style={[styles.notificationIcon, { backgroundColor: notification.color }]}>
                    <Ionicons 
                      name={notification.icon as any} 
                      size={20} 
                      color="#FFFFFF" 
                    />
                  </View>
                  <View style={styles.notificationDetails}>
                    <Text style={[styles.notificationTitle, { color: colors.primaryText }]}>{notification.title}</Text>
                    <Text style={[styles.notificationMessage, { color: colors.secondaryText }]}>{notification.message}</Text>
                    <Text style={[styles.notificationTime, { color: colors.secondaryText }]}>{notification.time}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.notificationAction}>
                  {notification.type === 'wager_invite' && (
                    <View style={[styles.actionButton, { backgroundColor: notification.color }]}>
                      <Text style={styles.actionButtonText}>Join</Text>
                    </View>
                  )}
                  {notification.type === 'friend_request' && (
                    <View style={[styles.actionButton, { backgroundColor: notification.color }]}>
                      <Text style={styles.actionButtonText}>Accept</Text>
                    </View>
                  )}
                  {notification.type === 'scam_detected' && (
                    <View style={[styles.actionButton, { backgroundColor: notification.color }]}>
                      <Text style={styles.actionButtonText}>Review</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Chat Modal */}
      <Modal
        visible={showChatModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.profileBackground }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.borderColor }]}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowChatModal(false)}
            >
              <Ionicons name="close" size={24} color={colors.primaryText} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.primaryText }]}>AI Assistant</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <View style={styles.chatContainer}>
            <ScrollView 
              style={styles.chatMessages} 
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              ref={(ref) => {
                if (ref) {
                  setTimeout(() => ref.scrollToEnd({ animated: true }), 100);
                }
              }}
            >
              {chatMessages.length === 0 ? (
                <View style={styles.welcomeMessage}>
                  <Text style={[styles.welcomeTitle, { color: colors.primaryText }]}>
                    How can I help you today?
                  </Text>
                  <Text style={[styles.welcomeSubtitle, { color: colors.secondaryText }]}>
                    I&apos;m here to help with your financial questions, budgeting tips and more.
                  </Text>
                  <View style={[styles.bankingAccessBadge, { backgroundColor: colors.tint }]}>
                    <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
                    <Text style={styles.bankingAccessText}>
                      Connected to your banking data
                    </Text>
                  </View>
                  
                  <View style={styles.exampleQuestions}>
                    <Text style={[styles.exampleTitle, { color: colors.primaryText }]}>
                      Try asking me about:
                    </Text>
                                          <TouchableOpacity 
                        style={[styles.exampleQuestion, { backgroundColor: colors.cardBackground }]}
                        onPress={() => {
                          sendMessage("How am I doing with my spending this month?");
                        }}
                      >
                        <Text style={[styles.exampleQuestionText, { color: colors.primaryText }]}>
                          How am I doing with my spending this month?
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.exampleQuestion, { backgroundColor: colors.cardBackground }]}
                        onPress={() => {
                          sendMessage("What are my biggest spending categories?");
                        }}
                      >
                        <Text style={[styles.exampleQuestionText, { color: colors.primaryText }]}>
                          What are my biggest spending categories?
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.exampleQuestion, { backgroundColor: colors.cardBackground }]}
                        onPress={() => {
                          sendMessage("Can you suggest ways to save money based on my spending?");
                        }}
                      >
                        <Text style={[styles.exampleQuestionText, { color: colors.primaryText }]}>
                          Can you suggest ways to save money based on my spending?
                        </Text>
                      </TouchableOpacity>
                  </View>
                </View>
              ) : (
                chatMessages.map((message) => (
                  <View 
                    key={message.id} 
                    style={[
                      styles.messageContainer,
                      message.role === 'user' ? styles.userMessage : styles.assistantMessage
                    ]}
                  >
                    <View style={[
                      styles.messageBubble,
                      message.role === 'user' 
                        ? [styles.userBubble, { backgroundColor: colors.tint }]
                        : [styles.assistantBubble, { backgroundColor: colors.cardBackground }]
                    ]}>
                      <Text style={[
                        styles.messageText,
                        { color: message.role === 'user' ? '#FFFFFF' : colors.primaryText }
                      ]}>
                        {message.content}
                      </Text>
                      <Text style={[
                        styles.messageTime,
                        { color: message.role === 'user' ? 'rgba(255,255,255,0.7)' : colors.secondaryText }
                      ]}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </View>
                ))
              )}
              {isLoading && (
                <View style={styles.loadingContainer}>
                  <View style={[styles.loadingBubble, { backgroundColor: colors.cardBackground }]}>
                    <Text style={[styles.loadingText, { color: colors.secondaryText }]}>
                      AI is typing...
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>
            
            <View style={[styles.chatInputContainer, { backgroundColor: colors.cardBackground }]}>
                              <View style={styles.chatInputRow}>
                  <TextInput
                    style={[styles.chatInputField, { backgroundColor: colors.profileBackground, color: colors.primaryText }]}
                    placeholder="Ask anything..."
                    placeholderTextColor={colors.secondaryText}
                    value={chatInput}
                    onChangeText={setChatInput}
                    multiline
                    maxLength={500}
                    onSubmitEditing={() => sendMessage(chatInput)}
                    blurOnSubmit={false}
                    returnKeyType="send"
                    enablesReturnKeyAutomatically={true}
                  />
                  <TouchableOpacity 
                    style={[
                      styles.chatSendButton, 
                      { 
                        backgroundColor: chatInput.trim() ? colors.tint : colors.borderColor,
                        opacity: chatInput.trim() ? 1 : 0.5
                      }
                    ]}
                    onPress={() => sendMessage(chatInput)}
                    disabled={!chatInput.trim() || isLoading}
                  >
                    <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              <Text style={[styles.chatDisclaimer, { color: colors.secondaryText }]}>
                By messaging, you agree to our Terms and have read our Privacy Policy.
              </Text>
            </View>
                      </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
        </Modal>
    </SafeAreaView>
    </GestureHandlerRootView>
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
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  accountName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  accountMask: {
    color: '#9ca3af',
    fontSize: 14,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  notificationButton: {
    padding: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  scrollView: {
    flex: 1,
  },
  balanceSection: {
    padding: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  chatButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceAmount: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '700',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  returnSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  returnItem: {
    flex: 1,
  },
  returnLabel: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  returnValue: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '600',
  },
  spendingValue: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  netDeposits: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  netDepositsIcon: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6b7280',
    marginRight: 8,
  },
  netDepositsText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  chartSection: {
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
    minHeight: 280,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  axisLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  xAxisLabel: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '500',
    alignSelf: 'center',
    marginTop: 8,
  },
  timeRangeButtons: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 2,
  },
  timeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  timeButtonActive: {
    backgroundColor: '#3b82f6',
  },
  timeButtonText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
  },
  timeButtonTextActive: {
    color: '#ffffff',
  },
  chart: {
    borderRadius: 16,
    marginLeft: -20,
  },
  transactionSection: {
    margin: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f1f',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  transactionDate: {
    color: '#9ca3af',
    fontSize: 14,
  },
  transactionCategory: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  creditAmount: {
    color: '#10b981',
  },
  debitAmount: {
    color: '#ef4444',
  },
  spendingCategoriesSection: {
    borderRadius: 16,
    padding: 20,
    overflow: 'visible',
  },
  spendingTimeRangeButtons: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 2,
  },
  spendingTimeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  spendingTimeButtonActive: {
    backgroundColor: '#3b82f6',
  },
  spendingTimeButtonText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
  },
  spendingTimeButtonTextActive: {
    color: '#ffffff',
  },
  pieChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    overflow: 'visible',
    minHeight: 220,
    paddingHorizontal: 8,
  },
  pieChartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    flex: 1,
  },
  categoryLegend: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginLeft: 16,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
  },
  legendCategory: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  legendAmount: {
    color: '#9ca3af',
    fontSize: 12,
  },
  merchantSpendingSection: {
    borderRadius: 16,
    padding: 20,
    overflow: 'visible',
    minHeight: 280,
  },
  merchantList: {
    marginTop: 16,
  },
  merchantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  merchantLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  merchantRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  merchantRankText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  merchantDetails: {
    flex: 1,
  },
  merchantName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  merchantSpendingLabel: {
    color: '#9ca3af',
    fontSize: 12,
  },
  merchantAmount: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  quickActionsSection: {
    margin: 20,
    marginBottom: 40,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  quickActionButton: {
    width: (screenWidth - 60) / 2,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionIcon: {
    marginBottom: 8,
  },
  quickActionText: {
    color: '#ffffff',
    fontSize: 14,
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
    borderBottomColor: '#1f1f1f',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalTransactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f1f',
  },
  swipeableCardsContainer: {
    margin: 20,
    marginBottom: 20,
    minHeight: 400,
  },
  swipeableCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  cardIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4a4a4a',
  },
  indicatorDotActive: {
    backgroundColor: '#3b82f6',
  },
  stackedCardsContainer: {
    position: 'relative',
    margin: 20,
    marginBottom: 20,
    height: 375,
    paddingBottom: 40,
  },
  stackedCardFront: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3,
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 0,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  stackedCardMiddle: {
    position: 'absolute',
    top: 12,
    left: 8,
    right: 8,
    zIndex: 2,
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 0,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  stackedCardBack: {
    position: 'absolute',
    top: 24,
    left: 16,
    right: 16,
    zIndex: 1,
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 0,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f1f',
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationDetails: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    fontWeight: '400',
  },
  notificationAction: {
    alignItems: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalCloseButton: {
    padding: 8,
  },
  chatContainer: {
    flex: 1,
    padding: 0,
    paddingBottom: 0, // Remove bottom padding to let KeyboardAvoidingView handle it
  },
  chatMessages: {
    flex: 1,
    marginBottom: 20,
  },
  welcomeMessage: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 24,
  },
  chatInputContainer: {
    paddingHorizontal: 0, // Remove horizontal padding to span full width
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20, // Add safe area padding for iOS
    borderTopWidth: 1,
    borderTopColor: '#1f1f1f',
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  chatInputField: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    paddingTop: 12, // Add top padding to center text vertically
    paddingBottom: 12, // Add bottom padding to center text vertically
    paddingHorizontal: 20,
    marginRight: 8,
    marginLeft: 20, // Add left margin to maintain spacing from screen edge
  },
  chatInputPlaceholder: {
    fontSize: 16,
    fontWeight: '400',
  },
  chatSendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20, // Add right margin to maintain spacing from screen edge
  },
  chatDisclaimer: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 18,
    marginHorizontal: 20, // Add horizontal margins to maintain readability
    marginTop: 8, // Add some space above the disclaimer
  },
  messageContainer: {
    marginVertical: 8,
    paddingHorizontal: 20,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  assistantMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userBubble: {
    borderBottomRightRadius: 8,
  },
  assistantBubble: {
    borderBottomLeftRadius: 8,
  },
  messageText: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
    fontWeight: '400',
    alignSelf: 'flex-end',
  },
  loadingContainer: {
    marginVertical: 8,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  loadingBubble: {
    padding: 16,
    borderRadius: 20,
    borderBottomLeftRadius: 8,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '400',
    fontStyle: 'italic',
  },
  bankingAccessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 16,
  },
  bankingAccessText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  exampleQuestions: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  exampleQuestion: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  exampleQuestionText: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
  },
});