import { Link, router } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, Montserrat_600SemiBold, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import Animated, { FadeIn, FadeInDown, FadeInUp, ZoomIn, BounceIn } from "react-native-reanimated";

export default function WelcomeScreen() {
  let [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
  });

  if (!fontsLoaded) return null;

  return (
    <ImageBackground 
      source={require('../assets/images/church.jpg')} 
      style={styles.background}
      blurRadius={2}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      >
        <Animated.View 
          style={styles.container}
          entering={FadeIn.duration(1000)}
        >
          {/* Logo with animation - now with primary color highlight */}
          <Animated.View 
            style={styles.logoContainer}
            entering={BounceIn.duration(1000).delay(100)}
          >
            <ImageBackground 
              source={require('../assets/images/adullam_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Animated.View 
              style={styles.logoHighlight}
              entering={FadeIn.duration(1000).delay(800)}
            />
          </Animated.View>

          <Animated.Text 
            style={styles.title}
            entering={FadeInUp.duration(1000).delay(400)}
          >
            Welcome to Our Church
          </Animated.Text>
          <Animated.Text 
            style={[styles.subtitle, { color: '#c31c6b' }]} // Added primary color to subtitle
            entering={FadeInUp.duration(1000).delay(600)}
          >
            Grow in faith, love, and community
          </Animated.Text>

          <Animated.View 
            style={styles.buttons}
            entering={FadeInDown.duration(1000).delay(800)}
          >
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity style={styles.buttonPrimary}>
                <Text style={styles.buttonTextPrimary}>Login</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity style={styles.buttonSecondary}>
                <Text style={styles.buttonTextSecondary}>Register</Text>
              </TouchableOpacity>
            </Link>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 30,
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  logoHighlight: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#c31c6b', // Primary color
    transform: [{ scale: 1.1 }],
  },
  title: {
    fontSize: 32,
    color: 'white',
    fontFamily: 'Montserrat_600SemiBold',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    marginBottom: 40,
  },
  buttons: {
    width: '100%',
    gap: 15,
  },
  buttonPrimary: {
    backgroundColor: '#c31c6b', // Primary color
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#c31c6b', // Primary color
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#c31c6b', // Primary color
    alignItems: 'center',
  },
  buttonTextPrimary: {
    color: 'white',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
  },
  buttonTextSecondary: {
    color: '#c31c6b', // Primary color
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
  },
});