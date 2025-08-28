import { Colors } from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Svg, { Defs, Line, Path, Rect, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

export default function LoginScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate in the content
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    router.replace('/(tabs)');
  };

  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.background, colors.background]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Svg width={60} height={60} viewBox="0 0 120 120">
                  {isDark ? (
                    // Dark theme logo
                    <>
                      <Defs>
                        <SvgLinearGradient id="darkGradient" x1="111.39" y1="8.61" x2="8.61" y2="111.39" gradientUnits="userSpaceOnUse">
                          <Stop offset="0" stopColor="#fff"/>
                          <Stop offset="0.02" stopColor="#e8e8e8"/>
                          <Stop offset="0.08" stopColor="#b3b1b2"/>
                          <Stop offset="0.14" stopColor="#898787"/>
                          <Stop offset="0.19" stopColor="#6a6869"/>
                          <Stop offset="0.23" stopColor="#585556"/>
                          <Stop offset="0.26" stopColor="#524f50"/>
                          <Stop offset="0.27" stopColor="#494647"/>
                          <Stop offset="0.31" stopColor="#292728"/>
                          <Stop offset="0.35" stopColor="#121112"/>
                          <Stop offset="0.39" stopColor="#040404"/>
                          <Stop offset="0.42" stopColor="#000"/>
                          <Stop offset="0.72" stopColor="#383536"/>
                          <Stop offset="0.75" stopColor="#3c393a"/>
                          <Stop offset="0.79" stopColor="#4b4849"/>
                          <Stop offset="0.83" stopColor="#626060"/>
                          <Stop offset="0.88" stopColor="#838182"/>
                          <Stop offset="0.93" stopColor="#adacac"/>
                          <Stop offset="0.97" stopColor="#e0dfe0"/>
                          <Stop offset="1" stopColor="#fff"/>
                        </SvgLinearGradient>
                      </Defs>
                      <Rect width="120" height="120" rx="29.39" ry="29.39" fill="url(#darkGradient)"/>
                      <Line x1="33.84" y1="75.94" x2="33.73" y2="75.83" stroke="#231f20" strokeWidth="0.5" fill="none"/>
                      <Line x1="87.63" y1="74.47" x2="86.17" y2="75.94" stroke="#231f20" strokeWidth="0.5" fill="none"/>
                      <Path d="M91.02,36.19v34.89l-3.39,3.39c-.54.44-1.08.88-1.64,1.29l.18.18-7.48,7.47-1.24,1.25-8.73,8.72-2.37,2.37-6.35,6.35-26.16-26.16v-.02s-.07-.06-.11-.09l-4.75-4.75v-34.89l.32.32,4.28,4.28,7.74,7.74v17.44l9.96,9.96,2.37,2.38,6.35,6.35.15-.15,6.2-6.2,2.37-2.38,8.72-8.72,1.25-1.24v-17.45l11.68-11.68.65-.65h0Z" fill="#fff" stroke="#fff" strokeWidth="0.5"/>
                      <Path d="M60.01,21.96c-10.5,0-19.02,8.52-19.02,19.02s8.52,19.02,19.02,19.02,19.02-8.51,19.02-19.02-8.52-19.02-19.02-19.02ZM60.01,47.52c-3.61,0-6.54-2.92-6.54-6.54s2.93-6.54,6.54-6.54,6.54,2.93,6.54,6.54-2.93,6.54-6.54,6.54Z" fill="#fff" stroke="#fff" strokeWidth="0.5"/>
                    </>
                  ) : (
                    // Light theme logo
                    <>
                      <Defs>
                        <SvgLinearGradient id="lightGradient" x1="111.39" y1="8.61" x2="8.61" y2="111.39" gradientUnits="userSpaceOnUse">
                          <Stop offset="0" stopColor="#524f50"/>
                          <Stop offset="0.01" stopColor="#5d5a5b"/>
                          <Stop offset="0.07" stopColor="#8e8c8c"/>
                          <Stop offset="0.13" stopColor="#b6b5b5"/>
                          <Stop offset="0.18" stopColor="#d6d5d5"/>
                          <Stop offset="0.23" stopColor="#ececec"/>
                          <Stop offset="0.28" stopColor="#fafafa"/>
                          <Stop offset="0.33" stopColor="#fff"/>
                          <Stop offset="0.65" stopColor="#fff"/>
                          <Stop offset="0.71" stopColor="#fff"/>
                          <Stop offset="0.82" stopColor="#fdfdfd"/>
                          <Stop offset="0.86" stopColor="#f6f6f6"/>
                          <Stop offset="0.89" stopColor="#eaeaea"/>
                          <Stop offset="0.91" stopColor="#d9d9d9"/>
                          <Stop offset="0.93" stopColor="#c3c3c3"/>
                          <Stop offset="0.94" stopColor="#a8a8a8"/>
                          <Stop offset="0.96" stopColor="#878787"/>
                          <Stop offset="0.97" stopColor="#626262"/>
                          <Stop offset="0.99" stopColor="#373737"/>
                          <Stop offset="1" stopColor="#090909"/>
                          <Stop offset="1" stopColor="#000"/>
                        </SvgLinearGradient>
                      </Defs>
                      <Rect width="120" height="120" rx="29.39" ry="29.39" fill="url(#lightGradient)"/>
                      <Line x1="33.84" y1="75.94" x2="33.73" y2="75.83" stroke="#231f20" strokeWidth="0.5" fill="none"/>
                      <Line x1="87.63" y1="74.47" x2="86.17" y2="75.94" stroke="#231f20" strokeWidth="0.5" fill="none"/>
                      <Path d="M91.02,36.19v34.89l-3.39,3.39c-.54.44-1.08.88-1.64,1.29l.18.18-7.48,7.47-1.24,1.25-8.73,8.72-2.37,2.37-6.35,6.35-26.16-26.16v-.02s-.07-.06-.11-.09l-4.75-4.75v-34.89l.32.32,4.28,4.28,7.74,7.74v17.44l9.96,9.96,2.37,2.38,6.35,6.35.15-.15,6.2-6.2,2.37-2.38,8.72-8.72,1.25-1.24v-17.45l11.68-11.68.65-.65h0Z" fill="#231f20" stroke="#231f20" strokeWidth="0.5"/>
                      <Path d="M60.01,21.96c-10.5,0-19.02,8.52-19.02,19.02s8.52,19.02,19.02,19.02,19.02-8.51,19.02-19.02-8.52-19.02-19.02-19.02ZM60.01,47.52c-3.61,0-6.54-2.92-6.54-6.54s2.93-6.54,6.54-6.54,6.54,2.93,6.54,6.54-2.93,6.54-6.54,6.54Z" fill="#231f20" stroke="#231f20" strokeWidth="0.5"/>
                    </>
                  )}
                </Svg>
              </View>
              
              <Text style={[styles.title, { color: colors.text }]}>
                Welcome Back
              </Text>
              <Text style={[styles.subtitle, { color: colors.icon }]}>
                Sign in to your Vault account
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Email</Text>
                <View style={[styles.inputWrapper, { 
                  borderColor: colors.borderColor,
                  backgroundColor: colors.cardBackground 
                }]}>
                  <Ionicons 
                    name="mail-outline" 
                    size={20} 
                    color={colors.icon} 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.secondaryText}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Password</Text>
                <View style={[styles.inputWrapper, { 
                  borderColor: colors.borderColor,
                  backgroundColor: colors.cardBackground 
                }]}>
                  <Ionicons 
                    name="lock-closed-outline" 
                    size={20} 
                    color={colors.icon} 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.secondaryText}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons 
                      name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color={colors.icon} 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.forgotPassword}
                onPress={() => {/* Handle forgot password */}}
              >
                <Text style={[styles.forgotPasswordText, { color: colors.tint }]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity 
                  style={[
                    styles.loginButton, 
                    { 
                      backgroundColor: colors.tint,
                      opacity: isLoading ? 0.7 : 1 
                    }
                  ]} 
                  onPress={() => {
                    animateButtonPress();
                    handleLogin();
                  }}
                  disabled={isLoading}
                >
                  <Text style={[styles.loginButtonText, { color: colors.background }]}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.icon }]}>
                Don't have an account?{' '}
                <Text style={[styles.signUpText, { color: colors.tint }]}>
                  Sign Up
                </Text>
              </Text>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  signUpText: {
    fontWeight: '600',
  },
});
