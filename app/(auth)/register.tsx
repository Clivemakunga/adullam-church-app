import { Link, router } from "expo-router";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Alert,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, Montserrat_600SemiBold, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import Animated, { FadeIn, FadeInDown, FadeInUp, BounceIn } from "react-native-reanimated";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from '@/lib/supabase';

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');
    
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        throw error;
      }

      Alert.alert(
        'Confirm Your Email',
        'We\'ve sent a confirmation link to your email',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
    } catch (error: any) {
      setError(error.message);
      Alert.alert("Registration Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
  });

  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={['#f8f9fa', '#e9ecef']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={styles.container} entering={FadeIn.duration(1000)}>
            <Animated.View 
              style={styles.logoContainer}
              entering={BounceIn.duration(1000)}
            >
              <Image 
                source={require('../../assets/images/adullam_logo.png')}
                style={[
                  styles.logo,
                  isSmallScreen && { width: 150, height: 150 }
                ]}
                resizeMode="contain"
              />
            </Animated.View>

            <Animated.Text 
              style={[styles.title, isSmallScreen && styles.smallTitle]}
              entering={FadeInUp.duration(1000).delay(200)}
            >
              Join Our Church Family
            </Animated.Text>

            <Animated.Text 
              style={[styles.subtitle, isSmallScreen && styles.smallSubtitle]}
              entering={FadeInUp.duration(1000).delay(400)}
            >
              Create your spiritual account
            </Animated.Text>

            <Animated.View 
              style={styles.formContainer}
              entering={FadeInDown.duration(1000).delay(600)}
            >
              <Animated.View entering={FadeInDown.duration(1000).delay(800)}>
                <Text style={styles.inputLabel}>First Name</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="Enter your first name"
                  placeholderTextColor="#999"
                  autoCapitalize="words"
                  value={firstName}
                  onChangeText={setFirstName}
                  editable={!loading}
                />
              </Animated.View>

              <Animated.View entering={FadeInDown.duration(1000).delay(1000)}>
                <Text style={styles.inputLabel}>Last Name</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="Enter your surname"
                  placeholderTextColor="#999"
                  autoCapitalize="words"
                  value={lastName}
                  onChangeText={setLastName}
                  editable={!loading}
                />
              </Animated.View>

              <Animated.View entering={FadeInDown.duration(1000).delay(1200)}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  editable={!loading}
                />
              </Animated.View>

              <Animated.View entering={FadeInDown.duration(1000).delay(1400)}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput 
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Create a password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    editable={!loading}
                  />
                  <TouchableOpacity 
                    style={styles.passwordToggle}
                    onPress={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off" : "eye"} 
                      size={20} 
                      color="#c31c6b" 
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.passwordHint}>Minimum 6 characters</Text>
              </Animated.View>

              {error && (
                <Animated.Text 
                  entering={FadeIn.duration(300)}
                  style={styles.errorText}
                >
                  {error}
                </Animated.Text>
              )}

              <Animated.View entering={FadeInDown.duration(1000).delay(1600)}>
                <TouchableOpacity 
                  style={[
                    styles.registerButton, 
                    loading && styles.disabledButton
                  ]}
                  onPress={handleRegister}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.registerButtonText}>Create Account</Text>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>

            <Animated.View 
              style={[styles.footer, isSmallScreen && { marginTop: 15 }]}
              entering={FadeInDown.duration(1000).delay(1800)}
            >
              <Text style={styles.footerText}>Already have an account?</Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity disabled={loading}>
                  <Text style={styles.footerLink}> Sign In</Text>
                </TouchableOpacity>
              </Link>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    minHeight: height,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: height < 700 ? 10 : 20,
  },
  logo: {
    width: 220,
    height: 220,
    maxWidth: '60%',
    aspectRatio: 1,
  },
  title: {
    fontSize: 28,
    color: '#212529',
    fontFamily: 'Montserrat_600SemiBold',
    textAlign: 'center',
    marginBottom: 8,
  },
  smallTitle: {
    fontSize: 24,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#c31c6b',
    fontFamily: 'Montserrat_400Regular',
    textAlign: 'center',
    marginBottom: height < 700 ? 20 : 40,
  },
  smallSubtitle: {
    fontSize: 14,
  },
  formContainer: {
    width: '100%',
    gap: height < 700 ? 12 : 20,
  },
  inputLabel: {
    color: '#212529',
    fontFamily: 'Montserrat_600SemiBold',
    marginBottom: 6,
    fontSize: 14,
  },
  input: {
    backgroundColor: 'white',
    color: '#212529',
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#dee2e6',
    marginBottom: 4,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    padding: 10,
  },
  passwordHint: {
    color: '#868e96',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Montserrat_400Regular',
  },
  registerButton: {
    backgroundColor: '#c31c6b',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
    shadowColor: '#c31c6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: 'white',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
    marginBottom: 20,
  },
  footerText: {
    color: '#495057',
    fontFamily: 'Montserrat_400Regular',
  },
  footerLink: {
    color: '#c31c6b',
    fontFamily: 'Montserrat_600SemiBold',
  },
  errorText: {
    color: '#dc3545',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});