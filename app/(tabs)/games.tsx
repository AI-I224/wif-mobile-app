import MetalHeader from '@/components/ui/MetalHeader';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function GamesScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  
  const [showWeeklyChallenges, setShowWeeklyChallenges] = useState(false);
  const [showMonthlyChallenges, setShowMonthlyChallenges] = useState(false);
  const [showWagerModal, setShowWagerModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [wagerDescription, setWagerDescription] = useState('');
  const [wagerPoints, setWagerPoints] = useState('');
  const [wagerTimeLimit, setWagerTimeLimit] = useState('7');
  const [showQuizGame, setShowQuizGame] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [totalPoints, setTotalPoints] = useState(250); // Mock total points
  const [showShop, setShowShop] = useState(false);

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

  // Mock data for challenges
  const weeklyChallenges = [
    { id: 1, title: 'Groceries Budget', budget: 150, spent: 120, reward: 5 },
    { id: 2, title: 'Shopping Budget', budget: 200, spent: 180, reward: 5 },
    { id: 3, title: 'Dining Out Budget', budget: 120, spent: 95, reward: 5 },
    { id: 4, title: 'Entertainment Budget', budget: 100, spent: 85, reward: 10 },
    { id: 5, title: 'Transportation Budget', budget: 80, spent: 75, reward: 10 },
    { id: 6, title: 'Utilities Budget', budget: 90, spent: 88, reward: 10 },
  ];

  const monthlyChallenges = [
    { id: 1, title: 'Housing Budget', budget: 1200, spent: 1100, reward: 25 },
    { id: 2, title: 'Food & Dining Budget', budget: 600, spent: 520, reward: 25 },
    { id: 3, title: 'Utilities Budget', budget: 300, spent: 280, reward: 50 },
    { id: 4, title: 'Healthcare Budget', budget: 400, spent: 350, reward: 50 },
    { id: 5, title: 'Transportation Budget', budget: 250, spent: 220, reward: 50 },
    { id: 6, title: 'Entertainment Budget', budget: 300, spent: 275, reward: 50 },
    { id: 7, title: 'Shopping Budget', budget: 400, spent: 380, reward: 50 },
  ];

  const groupChallenges = [
    { id: 1, title: 'Weekly Grocery Challenge', participants: 4, wager: 100, timeLeft: '3 days', status: 'active' },
    { id: 2, title: 'Entertainment Budget Race', participants: 6, wager: 75, timeLeft: '5 days', status: 'active' },
    { id: 3, title: 'Shopping Spree Control', participants: 3, wager: 150, timeLeft: '1 day', status: 'ending' },
  ];

  // Quiz questions data
  const quizQuestions = [
    {
      question: "What is the most common sign of a phishing email?",
      options: [
        "Professional company logo",
        "Urgent request for personal information",
        "Proper grammar and spelling",
        "Familiar sender address"
      ],
      correctAnswer: 1,
      explanation: "Phishing emails often create urgency and request sensitive information like passwords or credit card details."
    },
    {
      question: "Which of the following is NOT a red flag for investment scams?",
      options: [
        "Guaranteed high returns",
        "Pressure to act quickly",
        "Professional website design",
        "Unregistered investment advisor"
      ],
      correctAnswer: 2,
      explanation: "Professional website design can be faked. Always verify credentials independently."
    },
    {
      question: "What should you do if you receive a suspicious text asking for your bank details?",
      options: [
        "Reply with your account number",
        "Click any links in the message",
        "Delete the message and block the number",
        "Forward it to friends to warn them"
      ],
      correctAnswer: 2,
      explanation: "Never share personal information via text. Delete suspicious messages and block unknown numbers."
    },
    {
      question: "Which payment method offers the LEAST protection against scams?",
      options: [
        "Credit card",
        "Bank transfer",
        "PayPal",
        "Debit card"
      ],
      correctAnswer: 1,
      explanation: "Bank transfers offer minimal fraud protection compared to credit cards or payment platforms."
    },
    {
      question: "What is a common tactic used by romance scammers?",
      options: [
        "Asking for small amounts of money",
        "Meeting in person quickly",
        "Sharing their real identity",
        "Introducing you to family members"
      ],
      correctAnswer: 0,
      explanation: "Romance scammers often start with small requests and gradually increase the amounts."
    }
  ];

  // Timer effect for quiz
  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (showQuizGame && !quizCompleted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showQuizGame, quizCompleted, timeLeft]);

  const handleTimeUp = () => {
    setQuizCompleted(true);
    setShowAnswer(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || quizCompleted) return;
    
    setSelectedAnswer(answerIndex);
    setShowAnswer(true);
    
    if (answerIndex === quizQuestions[currentQuestionIndex].correctAnswer) {
      setQuizScore(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowAnswer(false);
        setTimeLeft(10);
              } else {
          setQuizCompleted(true);
          // Add points if quiz was successful (4+ correct answers)
          if (quizScore + (answerIndex === quizQuestions[currentQuestionIndex].correctAnswer ? 1 : 0) >= 4) {
            setTotalPoints(prev => prev + 10);
          }
        }
    }, 2000);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setQuizScore(0);
    setTimeLeft(10);
    setQuizCompleted(false);
    setSelectedAnswer(null);
    setShowAnswer(false);
    // Note: totalPoints is not reset - points earned are permanent
  };

  const startQuiz = () => {
    setShowQuizGame(true);
    resetQuiz();
  };

  const handleCreateWager = () => {
    setShowWagerModal(true);
  };

  const handleSubmitWager = () => {
    // Handle wager submission logic here
    console.log('Creating wager:', { wagerDescription, wagerPoints, wagerTimeLimit });
    setShowWagerModal(false);
    setWagerDescription('');
    setWagerPoints('');
    setWagerTimeLimit('7');
  };

  const renderProgressBar = (spent: number, budget: number) => {
    const progress = Math.min(spent / budget, 1);
    const progressColor = progress <= 1 ? colors.tint : '#FF6B6B';
    
    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { backgroundColor: colors.borderColor }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                backgroundColor: progressColor,
                width: `${progress * 100}%`
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, { color: colors.secondaryText }]}>
          ${spent} / ${budget}
        </Text>
      </View>
    );
  };

  const renderChallengeCard = (challenge: any, isWeekly: boolean) => (
    <View key={challenge.id} style={[styles.challengeCard, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.challengeHeader}>
        <Text style={[styles.challengeTitle, { color: colors.primaryText }]}>
          {challenge.title}
        </Text>
        <View style={[styles.rewardBadge, { backgroundColor: colors.tint }]}>
          <Text style={styles.rewardText}>{challenge.reward} pts</Text>
        </View>
      </View>
      
      {renderProgressBar(challenge.budget - challenge.spent, challenge.budget)}
      
      <View style={styles.challengeFooter}>
        <Text style={[styles.challengeStatus, { color: colors.secondaryText }]}>
          {isWeekly ? '6 days left' : '13 days left'}
        </Text>
        <TouchableOpacity style={[styles.viewButton, { backgroundColor: colors.tint }]}>
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderModalChallengeItem = (challenge: any, isWeekly: boolean) => (
    <View key={challenge.id} style={[styles.modalChallengeItem, { borderBottomColor: colors.borderColor }]}>
      <View style={styles.modalChallengeLeft}>
        <View style={[styles.modalChallengeIcon, { backgroundColor: colors.cardBackground }]}>
          <Ionicons 
            name={isWeekly ? "calendar" : "calendar-outline"} 
            size={20} 
            color={colors.tint} 
          />
        </View>
        <View style={styles.modalChallengeDetails}>
          <Text style={[styles.modalChallengeTitle, { color: colors.primaryText }]}>{challenge.title}</Text>
          <Text style={[styles.modalChallengeType, { color: colors.secondaryText }]}>
            {isWeekly ? 'Weekly Challenge' : 'Monthly Challenge'}
          </Text>
        </View>
      </View>
      <View style={styles.modalChallengeRight}>
        <View style={[styles.modalRewardBadge, { backgroundColor: colors.tint }]}>
          <Text style={styles.modalRewardText}>{challenge.reward} pts</Text>
        </View>
        <View style={styles.modalProgressContainer}>
          {renderProgressBar(challenge.budget - challenge.spent, challenge.budget)}
        </View>
      </View>
    </View>
  );

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

              <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Total Points Section */}
          <View style={[styles.totalPointsSection, { backgroundColor: colors.profileBackground }]}>
            <Text style={[styles.totalPointsLabel, { color: colors.primaryText }]}>Total Points</Text>
            <View style={styles.totalPointsRow}>
              <View style={[styles.totalPointsCircle, { backgroundColor: colors.tint }]}>
                <Text style={styles.totalPointsText}>{totalPoints}</Text>
              </View>
              <TouchableOpacity 
                style={[styles.shopButton, { backgroundColor: colors.tint }]}
                onPress={() => setShowShop(true)}
              >
                <Ionicons name="bag" size={32} color="#FFFFFF" />
                <Text style={styles.shopButtonText}>Shop</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Weekly Challenges Section */}
        <View style={styles.challengeSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Weekly Challenges</Text>
            <TouchableOpacity onPress={() => setShowWeeklyChallenges(true)}>
              <Text style={[styles.viewAllText, { color: colors.tint }]}>View all</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
          >
            {weeklyChallenges.slice(0, 4).map(challenge => renderChallengeCard(challenge, true))}
          </ScrollView>
        </View>

        {/* Monthly Challenges Section */}
        <View style={styles.challengeSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Monthly Challenges</Text>
            <TouchableOpacity onPress={() => setShowMonthlyChallenges(true)}>
              <Text style={[styles.viewAllText, { color: colors.tint }]}>View all</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
          >
            {monthlyChallenges.slice(0, 4).map(challenge => renderChallengeCard(challenge, false))}
          </ScrollView>
        </View>

        {/* Group Challenges Section */}
        <View style={styles.challengeSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Group Challenges</Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
          >
            {groupChallenges.map(challenge => (
              <View key={challenge.id} style={[styles.groupChallengeCard, { backgroundColor: colors.cardBackground }]}>
                <View style={styles.groupChallengeHeader}>
                  <Text style={[styles.groupChallengeTitle, { color: colors.primaryText }]}>{challenge.title}</Text>
                  <View style={[styles.wagerBadge, { backgroundColor: colors.tint }]}>
                    <Text style={styles.wagerText}>{challenge.wager} pts</Text>
                  </View>
                </View>
                
                <View style={styles.groupChallengeInfo}>
                  <View style={styles.groupChallengeRow}>
                    <Ionicons name="people" size={16} color={colors.secondaryText} />
                    <Text style={[styles.groupChallengeText, { color: colors.secondaryText }]}>
                      {challenge.participants} participants
                    </Text>
                  </View>
                  <View style={styles.groupChallengeRow}>
                    <Ionicons name="time" size={16} color={colors.secondaryText} />
                    <Text style={[styles.groupChallengeText, { color: colors.secondaryText }]}>
                      {challenge.timeLeft} left
                    </Text>
                  </View>
                </View>
                
                <View style={styles.groupChallengeFooter}>
                  <View style={[styles.statusBadge, { 
                    backgroundColor: challenge.status === 'active' ? '#10B981' : '#F59E0B' 
                  }]}>
                    <Text style={styles.statusText}>{challenge.status}</Text>
                  </View>
                  <TouchableOpacity style={[styles.quitButton, { backgroundColor: '#ef4444' }]}>
                    <Text style={styles.quitButtonText}>Quit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Create Wager Button Section */}
        <View style={styles.createWagerSection}>
          <TouchableOpacity 
            style={[styles.createWagerButton, { backgroundColor: colors.tint }]}
            onPress={handleCreateWager}
          >
            <Ionicons name="add-circle" size={24} color="#FFFFFF" />
            <Text style={styles.createWagerButtonText}>Create New Challenge</Text>
          </TouchableOpacity>
        </View>

        {/* Quiz Game Section */}
        <View style={styles.quizSection}>
          <View style={[styles.quizCard, { backgroundColor: colors.cardBackground }]}>
            <View style={[styles.quizIcon, { backgroundColor: colors.tint }]}>
              <Ionicons name="shield-checkmark" size={48} color="#FFFFFF" />
            </View>
            <Text style={[styles.quizTitle, { color: colors.primaryText }]}>
              Daily Quiz
            </Text>
            <Text style={[styles.quizDescription, { color: colors.secondaryText }]}>
              Test your knowledge about financial scams and phishing attempts. Answer 5 questions correctly to win 10 points!
            </Text>
            <TouchableOpacity
              style={[styles.startQuizButton, { backgroundColor: colors.tint }]}
              onPress={startQuiz}
            >
              <Text style={styles.startQuizButtonText}>Start Quiz</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Weekly Challenges Modal */}
      <Modal
        visible={showWeeklyChallenges}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.profileBackground }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.borderColor }]}>
            <Text style={[styles.modalTitle, { color: colors.primaryText }]}>All Weekly Challenges</Text>
            <TouchableOpacity
              onPress={() => setShowWeeklyChallenges(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={colors.primaryText} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {weeklyChallenges.map((challenge) => renderModalChallengeItem(challenge, true))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Monthly Challenges Modal */}
      <Modal
        visible={showMonthlyChallenges}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.profileBackground }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.borderColor }]}>
            <Text style={[styles.modalTitle, { color: colors.primaryText }]}>All Monthly Challenges</Text>
            <TouchableOpacity
              onPress={() => setShowMonthlyChallenges(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={colors.primaryText} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {monthlyChallenges.map((challenge) => renderModalChallengeItem(challenge, false))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Wager Modal */}
      <Modal
        visible={showWagerModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.profileBackground }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.borderColor }]}>
            <Text style={[styles.modalTitle, { color: colors.primaryText }]}>Create New Challenge</Text>
            <TouchableOpacity
              onPress={() => setShowWagerModal(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={colors.primaryText} />
            </TouchableOpacity>
          </View>
          
                     <ScrollView style={styles.modalContent}>
             <View style={styles.wagerForm}>
               <View style={styles.wagerSection}>
                 <Text style={[styles.wagerSectionTitle, { color: colors.primaryText }]}>Challenge Details</Text>
                 <TextInput
                   style={[styles.wagerInput, { borderColor: colors.borderColor, backgroundColor: colors.cardBackground }]}
                   placeholder="Wager Description (e.g., 'Monthly Grocery Budget')"
                   placeholderTextColor={colors.secondaryText}
                   value={wagerDescription}
                   onChangeText={setWagerDescription}
                   keyboardType="numeric"
                 />
                 <TextInput
                   style={[styles.wagerInput, { borderColor: colors.borderColor, backgroundColor: colors.cardBackground }]}
                   placeholder="Points to Wager (e.g., 50)"
                   placeholderTextColor={colors.secondaryText}
                   value={wagerPoints}
                   onChangeText={setWagerPoints}
                   keyboardType="numeric"
                 />
                 <TextInput
                   style={[styles.wagerInput, { borderColor: colors.borderColor, backgroundColor: colors.cardBackground }]}
                   placeholder="Time Limit (days, e.g., 7)"
                   placeholderTextColor={colors.secondaryText}
                   value={wagerTimeLimit}
                   onChangeText={setWagerTimeLimit}
                   keyboardType="numeric"
                 />
               </View>

               <View style={styles.wagerSection}>
                 <Text style={[styles.wagerSectionTitle, { color: colors.primaryText }]}>Invite Friends</Text>
                 <TouchableOpacity style={[styles.inviteFriendsButton, { borderColor: colors.tint }]}>
                   <Ionicons name="person-add" size={20} color={colors.tint} />
                   <Text style={[styles.inviteFriendsText, { color: colors.tint }]}>Invite Friends</Text>
                 </TouchableOpacity>
                 <Text style={[styles.inviteFriendsDescription, { color: colors.secondaryText }]}>
                   Challenge your friends to stay within their budgets and compete for points!
                 </Text>
               </View>

               <TouchableOpacity
                 style={[styles.submitWagerButton, { backgroundColor: colors.tint }]}
                 onPress={handleSubmitWager}
               >
                 <Text style={styles.submitWagerButtonText}>Create Challenge</Text>
               </TouchableOpacity>
             </View>
           </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Shop Modal */}
      <Modal
        visible={showShop}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.profileBackground }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.borderColor }]}>
            <TouchableOpacity
              onPress={() => setShowShop(false)}
              style={styles.closeButton}
            >
              <Ionicons name="arrow-back" size={24} color={colors.primaryText} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.primaryText }]}>Shop</Text>
            <View style={styles.shopHeaderRight}>
              <View style={[styles.shopPointsBadge, { backgroundColor: colors.tint }]}>
                <Text style={styles.shopPointsText}>{totalPoints} pts</Text>
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
      </Modal>

      {/* Quiz Game Modal */}
      <Modal
        visible={showQuizGame}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.profileBackground }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.borderColor }]}>
            <TouchableOpacity
              onPress={() => setShowQuizGame(false)}
              style={styles.closeButton}
            >
              <Ionicons name="arrow-back" size={24} color={colors.primaryText} />
            </TouchableOpacity>
            <View style={[styles.quizHeaderCenter, {paddingLeft: 10}]}>
              <View style={[styles.quizTimer, { backgroundColor: timeLeft <= 3 ? '#ef4444' : colors.tint }]}>
                <Text style={styles.quizTimerText}>{timeLeft}s</Text>
              </View>
            </View>
            <View style={styles.quizHeaderRight}>
              <View style={[styles.quizScoreBadge, { backgroundColor: colors.tint }]}>
                <Text style={styles.quizScoreText}>{currentQuestionIndex + 1}/{quizQuestions.length}</Text>
              </View>
            </View>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {!quizCompleted ? (
              <View style={styles.quizContent}>
                <View style={[styles.quizQuestionCard, { backgroundColor: colors.cardBackground }]}>
                  <Text style={[styles.quizQuestion, { color: colors.primaryText }]}>
                    {quizQuestions[currentQuestionIndex].question}
                  </Text>
                  
                  <View style={styles.quizOptions}>
                    {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.quizOption,
                          { 
                            backgroundColor: selectedAnswer === index 
                              ? (index === quizQuestions[currentQuestionIndex].correctAnswer ? '#10B981' : '#ef4444')
                              : colors.cardBackground,
                            borderColor: selectedAnswer === index 
                              ? (index === quizQuestions[currentQuestionIndex].correctAnswer ? '#10B981' : '#ef4444')
                              : colors.borderColor
                          }
                        ]}
                        onPress={() => handleAnswerSelect(index)}
                        disabled={selectedAnswer !== null}
                      >
                        <Text style={[
                          styles.quizOptionText,
                          { 
                            color: selectedAnswer === index ? '#FFFFFF' : colors.primaryText 
                          }
                        ]}>
                          {option}
                        </Text>
                        {showAnswer && selectedAnswer === index && (
                          <Ionicons 
                            name={index === quizQuestions[currentQuestionIndex].correctAnswer ? "checkmark-circle" : "close-circle"} 
                            size={24} 
                            color="#FFFFFF" 
                            style={styles.quizOptionIcon}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                  
                  {showAnswer && (
                    <View style={[styles.quizExplanation, { backgroundColor: colors.cardBackground, borderLeftColor: colors.tint }]}>
                      <Text style={[styles.quizExplanationText, { color: colors.secondaryText }]}>
                        {quizQuestions[currentQuestionIndex].explanation}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <View style={styles.quizResults}>
                <View style={[styles.quizResultsCard, { backgroundColor: colors.cardBackground }]}>
                  <View style={[styles.quizResultsIcon, { backgroundColor: quizScore >= 4 ? '#10B981' : '#ef4444' }]}>
                    <Ionicons 
                      name={quizScore >= 4 ? "trophy" : "close-circle"} 
                      size={64} 
                      color="#FFFFFF" 
                    />
                  </View>
                  <Text style={[styles.quizResultsTitle, { color: colors.primaryText }]}>
                    {quizScore >= 4 ? 'Quiz Completed!' : 'Time\'s Up!'}
                  </Text>
                  <Text style={[styles.quizResultsScore, { color: colors.secondaryText }]}>
                    You scored {quizScore} out of {quizQuestions.length}
                  </Text>
                  <Text style={[styles.quizResultsReward, { color: colors.tint }]}>
                    {quizScore >= 4 ? '+10 points earned!' : 'No points earned'}
                  </Text>
                  <Text style={[styles.quizResultsTotal, { color: colors.secondaryText }]}>
                    Total Points: {totalPoints}
                  </Text>
                  
                  <TouchableOpacity
                    style={[styles.retryQuizButton, { backgroundColor: colors.tint }]}
                    onPress={() => {
                      setShowQuizGame(false);
                      resetQuiz();
                    }}
                  >
                    <Text style={styles.endQuizButtonText}>End Quiz</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  settingsButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  challengeSection: {
    padding: 20,
    paddingBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '500',
  },
  horizontalScrollContainer: {
    paddingRight: 20,
  },
  challengeCard: {
    width: 280,
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  rewardBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  rewardText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  viewButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  comingSoonSection: {
    padding: 20,
  },
  comingSoonCard: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    textAlign: 'center',
  },
  comingSoonIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  comingSoonDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 280,
  },
  placeholderSection: {
    padding: 20,
    paddingTop: 0,
  },
  placeholderCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  placeholderItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  modalChallengeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f1f',
  },
  modalChallengeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  modalChallengeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modalChallengeDetails: {
    flex: 1,
  },
  modalChallengeTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  modalChallengeType: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalChallengeRight: {
    alignItems: 'flex-end',
    minWidth: 140, // Ensure enough space for progress bar
  },
  modalRewardBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  modalRewardText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalProgressContainer: {
    width: 120, // Fixed width for progress bar
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
  wagerForm: {
    padding: 20,
  },
  wagerSection: {
    marginBottom: 24,
  },
  wagerSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  wagerInput: {
    height: 60,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    borderWidth: 1,
  },
  inviteFriendsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    marginBottom: 12,
  },
  inviteFriendsText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  inviteFriendsDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  submitWagerButton: {
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitWagerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  groupChallengeCard: {
    width: 280,
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  groupChallengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  groupChallengeTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  wagerBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  wagerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  groupChallengeInfo: {
    marginBottom: 16,
  },
  groupChallengeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupChallengeText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  groupChallengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  joinButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  createWagerSection: {
    padding: 20,
    alignItems: 'center',
  },
  createWagerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 16,
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  createWagerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
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
  quitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // Quiz Game Styles
  quizSection: {
    padding: 20,
    paddingTop: 0,
  },
  quizCard: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  quizIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  quizTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  quizDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: 24,
  },
  startQuizButton: {
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    minWidth: 200,
  },
  startQuizButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  // Quiz Modal Styles
  quizHeaderCenter: {
    alignItems: 'center',
    flex: 1,
  },
  quizProgressText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  quizTimer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizTimerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  quizHeaderRight: {
    alignItems: 'flex-end',
  },
  quizScoreBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quizScoreText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  quizContent: {
    padding: 20,
  },
  quizQuestionCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  quizQuestion: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    lineHeight: 28,
    textAlign: 'center',
  },
  quizOptions: {
    marginBottom: 20,
  },
  quizOption: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizOptionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  quizOptionIcon: {
    marginLeft: 12,
  },
  quizExplanation: {
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  quizExplanationText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  quizResults: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  quizResultsCard: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: 320,
  },
  quizResultsIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  quizResultsTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  quizResultsScore: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'center',
  },
  quizResultsReward: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  quizResultsTotal: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 32,
    textAlign: 'center',
  },
  retryQuizButton: {
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    minWidth: 200,
  },
  endQuizButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  // Total Points and Shop Styles
  totalPointsSection: {
    alignItems: 'flex-start',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  totalPointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 16,
    gap: 100,
  },
  totalPointsCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalPointsText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
  },
  totalPointsLabel: {
    fontSize: 18,
    fontWeight: '500',
  },
  shopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 16,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  // Shop Modal Styles
  shopHeaderRight: {
    alignItems: 'flex-end',
  },
  shopPointsBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shopPointsText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
