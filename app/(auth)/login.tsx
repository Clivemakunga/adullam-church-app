import { Link, router } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, Montserrat_600SemiBold, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import Animated, { FadeIn, FadeInDown, FadeInUp, BounceIn } from "react-native-reanimated";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from '../../providers/AuthProvider';

export default function LoginScreen() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError(''); // Clear previous errors
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch (error: any) {
      setError(error.message);
      Alert.alert("Login Error", error.message);
    }
  };

  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
  });

  if (!fontsLoaded) return null;

  return (
    <LinearGradient
      colors={['#f8f9fa', '#e9ecef']}
      style={styles.gradient}
    >
      <Animated.View 
        style={styles.container}
        entering={FadeIn.duration(1000)}
      >
        <Animated.View 
          style={styles.logoContainer}
          entering={BounceIn.duration(1000)}
        >
          <Image 
            source={require('../../assets/images/adullam_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.Text 
          style={styles.title}
          entering={FadeInUp.duration(1000).delay(200)}
        >
          Welcome Back
        </Animated.Text>
        <Animated.Text 
          style={styles.subtitle}
          entering={FadeInUp.duration(1000).delay(400)}
        >
          Sign in to continue your spiritual journey
        </Animated.Text>

        <Animated.View 
          style={styles.formContainer}
          entering={FadeInDown.duration(1000).delay(600)}
        >
          <Animated.View entering={FadeInDown.duration(1000).delay(800)}>
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

          <Animated.View entering={FadeInDown.duration(1000).delay(1000)}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput 
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter your password"
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
          </Animated.View>

          {error && (
            <Animated.Text 
              entering={FadeIn.duration(300)}
              style={styles.errorText}
            >
              {error}
            </Animated.Text>
          )}

          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => router.push('/reset-password')}
            disabled={loading}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Animated.View entering={FadeInDown.duration(1000).delay(1200)}>
            <TouchableOpacity 
              style={[styles.loginButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Signing In...' : 'Login'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        <Animated.View 
          style={styles.footer}
          entering={FadeInDown.duration(1000).delay(1400)}
        >
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity disabled={loading}>
              <Text style={styles.footerLink}> Register</Text>
            </TouchableOpacity>
          </Link>
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 220,
    height: 220,
  },
  title: {
    fontSize: 28,
    color: '#212529',
    fontFamily: 'Montserrat_600SemiBold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#c31c6b',
    fontFamily: 'Montserrat_400Regular',
    textAlign: 'center',
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
    gap: 20,
  },
  inputLabel: {
    color: '#212529',
    fontFamily: 'Montserrat_600SemiBold',
    marginBottom: 8,
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
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: '#c31c6b',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#c31c6b',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#c31c6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: 'white',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
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