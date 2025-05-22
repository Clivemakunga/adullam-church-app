import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, Image } from 'react-native';
import { useFonts, Montserrat_600SemiBold, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';

const PRIMARY_COLOR = '#c31c6b';
const ADMIN_COLOR = '#2f4858';

export default function CreateTestimonyScreen() {
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
  });

  const [testimonyData, setTestimonyData] = useState({
    title: '',
    author: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    image: null,
    isApproved: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setTestimonyData({...testimonyData, image: result.assets[0].uri});
    }
  };

  const handleSubmit = () => {
    if (!testimonyData.title || !testimonyData.author || !testimonyData.content) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert('Success', 'Testimony created successfully!');
      // Reset form
      setTestimonyData({
        title: '',
        author: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        image: null,
        isApproved: true,
      });
    }, 1500);
  };

  if (!fontsLoaded) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View entering={FadeIn.duration(500)}>
        <Text style={styles.title}>Create Testimony</Text>
        <Text style={styles.subtitle}>Share powerful stories of God's work</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.formGroup}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter testimony title"
          value={testimonyData.title}
          onChangeText={(text) => setTestimonyData({...testimonyData, title: text})}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.formGroup}>
        <Text style={styles.label}>Author *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter author's name"
          value={testimonyData.author}
          onChangeText={(text) => setTestimonyData({...testimonyData, author: text})}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(300)} style={styles.formGroup}>
        <Text style={styles.label}>Content *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Share the testimony details..."
          multiline
          numberOfLines={8}
          value={testimonyData.content}
          onChangeText={(text) => setTestimonyData({...testimonyData, content: text})}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(400)} style={styles.formGroup}>
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={testimonyData.date}
          onChangeText={(text) => setTestimonyData({...testimonyData, date: text})}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(500)} style={styles.formGroup}>
        <Text style={styles.label}>Image</Text>
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          {testimonyData.image ? (
            <Image source={{ uri: testimonyData.image }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <MaterialCommunityIcons name="image" size={32} color="#adb5bd" />
              <Text style={styles.imagePlaceholderText}>Select an image</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(600)} style={styles.formGroup}>
        <TouchableOpacity 
          style={styles.approvalToggle}
          onPress={() => setTestimonyData({...testimonyData, isApproved: !testimonyData.isApproved})}
        >
          <View style={[
            styles.toggleSwitch,
            testimonyData.isApproved && styles.toggleSwitchActive
          ]}>
            <View style={styles.toggleKnob} />
          </View>
          <Text style={styles.approvalLabel}>
            {testimonyData.isApproved ? 'Approved' : 'Pending Approval'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(700)}>
        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Text style={styles.submitButtonText}>Creating Testimony...</Text>
          ) : (
            <>
              <MaterialCommunityIcons name="book-plus" size={20} color="white" />
              <Text style={styles.submitButtonText}>Publish Testimony</Text>
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat_600SemiBold',
    color: ADMIN_COLOR,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#6c757d',
    marginBottom: 25,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: ADMIN_COLOR,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textArea: {
    height: 200,
    textAlignVertical: 'top',
  },
  imageButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  imagePlaceholderText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#adb5bd',
    marginTop: 10,
  },
  approvalToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e9ecef',
    padding: 2,
    justifyContent: 'center',
  },
  toggleSwitchActive: {
    backgroundColor: PRIMARY_COLOR,
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  approvalLabel: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: ADMIN_COLOR,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 10,
    padding: 16,
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#adb5bd',
  },
  submitButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: 'white',
  },
});