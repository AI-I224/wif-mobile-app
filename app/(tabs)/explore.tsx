import MetalHeader from '@/components/ui/MetalHeader';
import { OPENAI_CONFIG } from '@/config/openai';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface Post {
  id: string;
  subreddit: string;
  title: string;
  content: string;
  author: string;
  timeAgo: string;
  upvotes: number;
  comments: number;
  awards: number;
  isUpvoted: boolean;
  isDownvoted: boolean;
  hasImage?: boolean;
  imageUrl?: any; // Can be require() statement or string
}

interface Community {
  id: string;
  name: string;
  members: string;
  description: string;
  isJoined: boolean;
  icon: string;
}

export default function SocialScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  
  const [selectedTab, setSelectedTab] = useState<'posts' | 'communities'>('posts');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsPost, setAnalyticsPost] = useState<Post | null>(null);
  const [analyticsSummary, setAnalyticsSummary] = useState<string>('');
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      subreddit: 'University Life',
      title: '🚨 SCAM ALERT: Fake "Student Discount" websites charging full price!',
      content: 'Just got scammed by "StudentDealsUK.com" - they charged me full price for a laptop and claimed the discount would be "refunded later". Never got the refund and their customer service is non-existent. Always check if discounts are applied at checkout!',
      author: 'Michael Lennox',
      timeAgo: '2 hours ago',
      upvotes: 1247,
      comments: 89,
      awards: 3,
      isUpvoted: false,
      isDownvoted: false,
      hasImage: true,
      imageUrl: require('../../assets/images/scam.png'),
    },
    {
      id: '2',
      subreddit: 'Student Discounts',
      title: '💡 Pro tip: Always ask for student discount even if not advertised!',
      content: 'Went to Nando\'s yesterday and casually asked if they had student discount. The manager said "we don\'t advertise it, but we do 15% off for students with valid ID!" Saved me £3.50 on my meal. Always worth asking!',
      author: 'Sarah Roberts',
      timeAgo: '5 hours ago',
      upvotes: 892,
      comments: 156,
      awards: 2,
      isUpvoted: false,
      isDownvoted: false,
      hasImage: false,
    },
    {
      id: '3',
      subreddit: 'Student Scam Alerts',
      title: '⚠️ WARNING: Fake accommodation agents targeting international students',
      content: 'My friend from India got scammed by someone claiming to be from "StudentHousingUK". They asked for a £500 "deposit" to "hold" a room, then ghosted her. The website looked legit but was fake. Always go through official university accommodation or verified agencies.',
      author: 'Aditya Singh',
      timeAgo: '8 hours ago',
      upvotes: 2156,
      comments: 234,
      awards: 5,
      isUpvoted: false,
      isDownvoted: false,
      hasImage: false,
    },
    {
      id: '4',
      subreddit: 'Student Savings',
      title: '🎓 Best student discount apps that actually work!',
      content: 'After trying loads of apps, here are the ones that consistently give me real savings: UNiDAYS (20% off ASOS), Student Beans (15% off Deliveroo), and Totum (free with NUS card). Avoid "StudentSavings" app - it\'s just ads and fake deals.',
      author: 'Zara Khan',
      timeAgo: '12 hours ago',
      upvotes: 1567,
      comments: 89,
      awards: 4,
      isUpvoted: false,
      isDownvoted: false,
      hasImage: true,
      imageUrl: require('../../assets/images/apps-like-unidays.png'),
    },
    {
      id: '5',
      subreddit: 'University Life',
      title: '🚫 Avoid these "student loan" companies - they\'re just payday lenders in disguise',
      content: 'Companies like "StudentFinance" and "UniLoans" are targeting students with "emergency loans" but charging 40%+ APR. They make it look like official student finance but it\'s just predatory lending. Stick to official student loans or talk to your uni\'s financial advisor.',
      author: 'James Patterson',
      timeAgo: '1 day ago',
      upvotes: 3421,
      comments: 445,
      awards: 7,
      isUpvoted: false,
      isDownvoted: false,
      hasImage: false,
    },
  ]);

  // Notification data
  const notifications = [
    {
      id: 1,
      type: 'wager_invite',
      title: 'Challenge Invite from Sarah',
      message: 'Sarah invited you to join "Monthly Grocery Challenge"',
      time: '2 hours ago',
      icon: 'game-controller',
      color: '#3b82f6',
    },
    {
      id: 2,
      type: 'wager_invite',
      title: 'Challenge Invite from Mike',
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

  const [communities, setCommunities] = useState<Community[]>([
    {
      id: '1',
      name: 'University Life',
      members: '1.2K',
      description: 'General university life discussions, tips, and experiences',
      isJoined: true,
      icon: '🎓',
    },
    {
      id: '2',
      name: 'Student Discounts',
      members: '7.8K',
      description: 'Share and discover student discounts, deals, and money-saving tips',
      isJoined: true,
      icon: '💸',
    },
    {
      id: '3',
      name: 'Student Scam Alerts',
      members: '6.7K',
      description: 'Report and discuss scams targeting university students',
      isJoined: false,
      icon: '🚨',
    },
    {
      id: '4',
      name: 'Student Savings',
      members: '4.5K',
      description: 'Budgeting tips, financial advice, and saving strategies for students',
      isJoined: false,
      icon: '💰',
    },
    {
      id: '5',
      name: 'International Students',
      members: '12.1K',
      description: 'Support and advice for international students studying abroad',
      isJoined: false,
      icon: '🌍',
    },
    {
      id: '6',
      name: 'UCL Community',
      members: '2.3K',
      description: 'University College London student community',
      isJoined: false,
      icon: '🏛️',
    },
    {
      id: '7',
      name: 'Bath Community',
      members: '2.1K',
      description: 'Queen Mary University of London student community',
      isJoined: false,
      icon: '🏛️',
    },
  ]);

  const handleUpvote = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          if (post.isUpvoted) {
            return { ...post, isUpvoted: false, upvotes: post.upvotes - 1, isDownvoted: false };
          } else if (post.isDownvoted) {
            return { ...post, isUpvoted: true, upvotes: post.upvotes + 2, isDownvoted: false };
          } else {
            return { ...post, isUpvoted: true, upvotes: post.upvotes + 1 };
          }
        }
        return post;
      })
    );
  };

  const handleDownvote = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          if (post.isDownvoted) {
            return { ...post, isDownvoted: false, upvotes: post.upvotes + 1, isUpvoted: false };
          } else if (post.isUpvoted) {
            return { ...post, isDownvoted: true, upvotes: post.upvotes - 2, isUpvoted: false };
          } else {
            return { ...post, isDownvoted: true, upvotes: post.upvotes - 1 };
          }
        }
        return post;
      })
    );
  };

  const toggleCommunityJoin = (communityId: string) => {
    setCommunities(prevCommunities =>
      prevCommunities.map(community =>
        community.id === communityId
          ? { ...community, isJoined: !community.isJoined }
          : community
      )
    );
  };

  const handleAnalytics = async (post: Post) => {
    setAnalyticsPost(post);
    setShowAnalytics(true);
    setAnalyticsSummary('');
    setIsLoadingAnalytics(true);

    try {
      const response = await fetch(OPENAI_CONFIG.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_CONFIG.API_KEY}`,
        },
        body: JSON.stringify({
          model: OPENAI_CONFIG.MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that provides concise summaries of social media posts. Focus on key points and actionable insights.'
            },
            {
              role: 'user',
              content: `Please provide a brief summary of this post: "${post.title}"\n\nContent: ${post.content}\n\nSubreddit: ${post.subreddit}`
            }
          ],
          max_tokens: OPENAI_CONFIG.MAX_TOKENS,
          temperature: OPENAI_CONFIG.TEMPERATURE,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const summary = data.choices[0]?.message?.content || 'Unable to generate summary';
        setAnalyticsSummary(summary);
      } else {
        setAnalyticsSummary('Error: Unable to generate summary at this time.');
      }
    } catch (error) {
      setAnalyticsSummary('Error: Unable to connect to AI service.');
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={[styles.postCard, { backgroundColor: colors.cardBackground }]}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.subredditInfo}>
          <View style={[styles.subredditIcon, { backgroundColor: colors.borderColor }]}>
            <Text style={styles.subredditIconText}>{item.subreddit.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.subredditDetails}>
            <Text style={[styles.subredditName, { color: colors.primaryText }]}>{item.subreddit}</Text>
            <Text style={[styles.postMeta, { color: colors.secondaryText }]}>
              Posted by {item.author} • {item.timeAgo}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.joinButton}>
          <Text style={[styles.joinButtonText, { color: colors.tint }]}>
            {communities.find(c => c.name === item.subreddit)?.isJoined ? 'Joined' : 'Join'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <View style={styles.postContent}>
        <Text style={[styles.postTitle, { color: colors.primaryText }]}>{item.title}</Text>
        {item.hasImage && (
          <View style={styles.postImageContainer}>
            <Image
              source={item.imageUrl}
              style={styles.postImage}
              resizeMode="cover"
            />
          </View>
        )}
        {item.content && (
          <Text style={[styles.postText, { color: colors.secondaryText }]} numberOfLines={3}>
            {item.content}
          </Text>
        )}
      </View>

      {/* Post Actions */}
      <View style={styles.postActions}>
        <View style={styles.leftActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleUpvote(item.id)}
          >
            <Ionicons 
              name={item.isUpvoted ? "thumbs-up" : "thumbs-up-outline"} 
              size={20} 
              color={item.isUpvoted ? colors.tint : colors.secondaryText} 
            />
            <Text style={[styles.actionText, { color: item.isUpvoted ? colors.tint : colors.secondaryText }]}>
              {formatNumber(item.upvotes)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDownvote(item.id)}
          >
            <Ionicons 
              name={item.isDownvoted ? "thumbs-down" : "thumbs-down-outline"} 
              size={20} 
              color={item.isDownvoted ? '#ef4444' : colors.secondaryText} 
          />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={20} color={colors.secondaryText} />
            <Text style={[styles.actionText, { color: colors.secondaryText }]}>
              {formatNumber(item.comments)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="gift-outline" size={20} color={colors.secondaryText} />
            {item.awards > 0 && (
              <Text style={[styles.actionText, { color: colors.secondaryText }]}>
                {item.awards}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.analyticsButton, { backgroundColor: colors.tint }]}
          onPress={() => handleAnalytics(item)}
        >
          <Ionicons name="analytics" size={20} color="#ffffff" />
          <Text style={styles.analyticsButtonText}>AI</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCommunity = ({ item }: { item: Community }) => (
    <View style={[styles.communityCard, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.communityHeader}>
        <View style={[styles.communityIcon, { backgroundColor: colors.borderColor }]}>
          <Text style={styles.communityIconText}>{item.icon}</Text>
        </View>
        <View style={styles.communityInfo}>
          <Text style={[styles.communityName, { color: colors.primaryText }]}>{item.name}</Text>
          <Text style={[styles.communityMembers, { color: colors.secondaryText }]}>
            {item.members} members
          </Text>
          <Text style={[styles.communityDescription, { color: colors.secondaryText }]} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.joinCommunityButton,
            item.isJoined && { backgroundColor: colors.borderColor }
          ]}
          onPress={() => toggleCommunityJoin(item.id)}
        >
          <Text style={[
            styles.joinCommunityButtonText,
            { color: item.isJoined ? colors.secondaryText : colors.tint }
          ]}>
            {item.isJoined ? 'Joined' : 'Join'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
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
                style={[styles.avatar, { borderColor: colors.borderColor }]}
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

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.cardBackground }]}>
          <Ionicons name="search" size={20} color={colors.secondaryText} style={styles.searchIcon} />
          <Text style={[styles.searchPlaceholder, { color: colors.secondaryText }]}>Explore</Text>
        </View>
        <TouchableOpacity style={[styles.searchActionButton, { backgroundColor: colors.tint }]}>
          <Ionicons name="chatbubbles" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { borderBottomColor: colors.borderColor }]}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'posts' && { borderBottomColor: colors.tint }
          ]}
          onPress={() => setSelectedTab('posts')}
        >
          <Text style={[
            styles.tabText,
            { color: selectedTab === 'posts' ? colors.tint : colors.secondaryText }
          ]}>
            Posts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'communities' && { borderBottomColor: colors.tint }
          ]}
          onPress={() => setSelectedTab('communities')}
        >
          <Text style={[
            styles.tabText,
            { color: selectedTab === 'communities' ? colors.tint : colors.secondaryText }
          ]}>
            Communities
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {selectedTab === 'posts' ? (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          style={styles.contentList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        />
      ) : (
        <FlatList
          data={communities}
          renderItem={renderCommunity}
          keyExtractor={(item) => item.id}
          style={styles.contentList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        />
      )}

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
          
          <FlatList
            data={notifications}
            renderItem={({ item: notification }) => (
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
                    <View style={[styles.notificationActionButton, { backgroundColor: notification.color }]}>
                      <Text style={styles.notificationActionButtonText}>Join</Text>
                    </View>
                  )}
                  {notification.type === 'friend_request' && (
                    <View style={[styles.notificationActionButton, { backgroundColor: notification.color }]}>
                      <Text style={styles.notificationActionButtonText}>Accept</Text>
                    </View>
                  )}
                  {notification.type === 'scam_detected' && (
                    <View style={[styles.notificationActionButton, { backgroundColor: notification.color }]}>
                      <Text style={styles.notificationActionButtonText}>Review</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            style={styles.modalContent}
          />
        </SafeAreaView>
      </Modal>

      {/* Analytics Modal */}
      <Modal
        visible={showAnalytics}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.profileBackground }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.borderColor }]}>
            <Text style={[styles.modalTitle, { color: colors.primaryText }]}>Post Analytics</Text>
            <TouchableOpacity
              onPress={() => setShowAnalytics(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={colors.primaryText} />
            </TouchableOpacity>
          </View>
          
          {analyticsPost && (
            <View style={styles.analyticsContent}>
              <View style={styles.analyticsPostHeader}>
                <Text style={[styles.analyticsPostTitle, { color: colors.primaryText }]}>
                  {analyticsPost.title}
                </Text>
                <Text style={[styles.analyticsPostMeta, { color: colors.secondaryText }]}>
                  r/{analyticsPost.subreddit} • {analyticsPost.timeAgo}
                </Text>
              </View>
              
              <View style={styles.analyticsSummarySection}>
                <Text style={[styles.analyticsSectionTitle, { color: colors.primaryText }]}>
                  AI Summary
                </Text>
                {isLoadingAnalytics ? (
                  <View style={styles.loadingContainer}>
                    <Text style={[styles.loadingText, { color: colors.secondaryText }]}>
                      Generating summary...
                    </Text>
                  </View>
                ) : (
                  <Text style={[styles.analyticsSummaryText, { color: colors.secondaryText }]}>
                    {analyticsSummary}
                  </Text>
                )}
              </View>

              <View style={styles.analyticsStatsSection}>
                <Text style={[styles.analyticsSectionTitle, { color: colors.primaryText }]}>
                  Post Statistics
                </Text>
                <View style={styles.analyticsStats}>
                  <View style={styles.analyticsStat}>
                    <Ionicons name="thumbs-up" size={20} color={colors.tint} />
                    <Text style={[styles.analyticsStatText, { color: colors.secondaryText }]}>
                      {formatNumber(analyticsPost.upvotes)} upvotes
                    </Text>
                  </View>
                  <View style={styles.analyticsStat}>
                    <Ionicons name="chatbubble" size={20} color={colors.tint} />
                    <Text style={[styles.analyticsStatText, { color: colors.secondaryText }]}>
                      {formatNumber(analyticsPost.comments)} comments
                    </Text>
                  </View>
                  <View style={styles.analyticsStat}>
                    <Ionicons name="gift" size={20} color={colors.tint} />
                    <Text style={[styles.analyticsStatText, { color: colors.secondaryText }]}>
                      {analyticsPost.awards} awards
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </SafeAreaView>
      </Modal>
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  searchButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchPlaceholder: {
    fontSize: 16,
    flex: 1,
  },
  searchActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  contentList: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  postCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  subredditInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subredditIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  subredditIconText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  subredditDetails: {
    flex: 1,
  },
  subredditName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  postMeta: {
    fontSize: 12,
  },
  joinButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  joinButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  postContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 12,
  },
  postImageContainer: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 200,
  },
  postText: {
    fontSize: 14,
    lineHeight: 20,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  communityCard: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
  },
  communityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  communityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  communityIconText: {
    fontSize: 24,
  },
  communityInfo: {
    flex: 1,
  },
  communityName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  communityMembers: {
    fontSize: 14,
    marginBottom: 4,
  },
  communityDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  joinCommunityButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  joinCommunityButtonText: {
    fontSize: 14,
    fontWeight: '600',
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
  notificationButton: {
    padding: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
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
    fontSize: 24,
    fontWeight: '700',
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
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
  notificationActionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  notificationActionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  analyticsContent: {
    flex: 1,
    padding: 20,
  },
  analyticsPostHeader: {
    marginBottom: 24,
  },
  analyticsPostTitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    marginBottom: 8,
  },
  analyticsPostMeta: {
    fontSize: 14,
    opacity: 0.7,
  },
  analyticsSummarySection: {
    marginBottom: 24,
  },
  analyticsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
  },
  analyticsSummaryText: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.9,
  },
  analyticsStatsSection: {
    marginBottom: 24,
  },
  analyticsStats: {
    gap: 16,
  },
  analyticsStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  analyticsStatText: {
    fontSize: 16,
    fontWeight: '500',
  },
  analyticsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  analyticsButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});