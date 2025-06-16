import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useFonts, Montserrat_600SemiBold, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '@/lib/supabase';

const PRIMARY_COLOR = '#c31c6b';
const ADMIN_COLOR = '#2f4858';

export default function CreateDevotionScreen({ initialData, onSubmit, mode = 'create' }) {
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
  });

  const [devotionData, setDevotionData] = useState({
    title: '',
    bibleVerse: '',
    content: '',
    date: new Date(),
    category: 'daily',
    isFeatured: false,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate data if in edit mode
  useEffect(() => {
    if (initialData) {
      setDevotionData(initialData);
    }
  }, [initialData]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDevotionData({ ...devotionData, date: selectedDate });
    }
  };

  const handleSubmit = async () => {
    const { title, bibleVerse, content, date, category, isFeatured } = devotionData;

    if (!title || !bibleVerse || !content) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    if (onSubmit) {
      await onSubmit(devotionData);
    } else {
      const { error } = await supabase.from('devotions').insert([
        {
          title,
          bible_verse: bibleVerse,
          content,
          date,
          category,
          is_featured: isFeatured,
        },
      ]);

      if (error) {
        Alert.alert('Error', error.message);
        setIsSubmitting(false);
        return;
      } else {
        Alert.alert('Success', 'Devotion created successfully!');
        setDevotionData({
          title: '',
          bibleVerse: '',
          content: '',
          date: new Date(),
          category: 'daily',
          isFeatured: false,
        });
      }
    }

    setIsSubmitting(false);
  };

  if (!fontsLoaded) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View entering={FadeIn.duration(500)}>
        <Text style={styles.title}>{mode === 'edit' ? 'Edit Devotion' : 'Create New Devotion'}</Text>
        <Text style={styles.subtitle}>
          {mode === 'edit' ? 'Update the devotion content' : 'Inspire your congregation daily'}
        </Text>
      </Animated.View>

      {/* Title */}
      <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.formGroup}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter devotion title"
          value={devotionData.title}
          onChangeText={(text) => setDevotionData({ ...devotionData, title: text })}
        />
      </Animated.View>

      {/* Bible Verse */}
      <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.formGroup}>
        <Text style={styles.label}>Bible Verse *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. John 3:16"
          value={devotionData.bibleVerse}
          onChangeText={(text) => setDevotionData({ ...devotionData, bibleVerse: text })}
        />
      </Animated.View>

      {/* Content */}
      <Animated.View entering={FadeInDown.duration(500).delay(300)} style={styles.formGroup}>
        <Text style={styles.label}>Content *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Write your devotion content here..."
          multiline
          numberOfLines={8}
          value={devotionData.content}
          onChangeText={(text) => setDevotionData({ ...devotionData, content: text })}
        />
      </Animated.View>

      {/* Date Picker */}
      <Animated.View entering={FadeInDown.duration(500).delay(400)} style={styles.formGroup}>
        <Text style={styles.label}>Date *</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
          <Ionicons name="calendar" size={18} color={ADMIN_COLOR} />
          <Text style={styles.dateText}>{devotionData.date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={devotionData.date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </Animated.View>

      {/* Category */}
      <Animated.View entering={FadeInDown.duration(500).delay(500)} style={styles.formGroup}>
        <Text style={styles.label}>Category *</Text>
        <View style={styles.radioContainer}>
          {['daily', 'weekly', 'special'].map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.radioButton}
              onPress={() => setDevotionData({ ...devotionData, category: item })}
            >
              <View style={styles.radioOuter}>
                {devotionData.category === item && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioLabel}>
                {item === 'daily' ? 'Daily Devotion' : item === 'weekly' ? 'Weekly Reflection' : 'Special Message'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Feature Toggle */}
      <Animated.View entering={FadeInDown.duration(500).delay(600)} style={styles.formGroup}>
        <TouchableOpacity
          style={styles.featureToggle}
          onPress={() => setDevotionData({ ...devotionData, isFeatured: !devotionData.isFeatured })}
        >
          <View style={[
            styles.toggleSwitch,
            devotionData.isFeatured && styles.toggleSwitchActive
          ]}>
            <View style={styles.toggleKnob} />
          </View>
          <Text style={styles.featureLabel}>Feature this devotion</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Submit Button */}
      <Animated.View entering={FadeInDown.duration(500).delay(700)}>
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Text style={styles.submitButtonText}>
              {mode === 'edit' ? 'Updating Devotion...' : 'Creating Devotion...'}
            </Text>
          ) : (
            <>
              <MaterialCommunityIcons name={mode === 'edit' ? "pencil" : "book-plus"} size={20} color="white" />
              <Text style={styles.submitButtonText}>
                {mode === 'edit' ? 'Update Devotion' : 'Publish Devotion'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
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
  formGroup: { marginBottom: 20 },
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
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: ADMIN_COLOR,
  },
  radioContainer: { gap: 12 },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PRIMARY_COLOR,
  },
  radioLabel: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: ADMIN_COLOR,
  },
  featureToggle: {
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
  featureLabel: {
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
