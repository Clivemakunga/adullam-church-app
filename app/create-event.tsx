import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useFonts, Montserrat_600SemiBold, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';

const PRIMARY_COLOR = '#c31c6b';
const ADMIN_COLOR = '#2f4858';

export default function CreateEventScreen() {
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
  });

  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: new Date(),
    endDate: new Date(new Date().setHours(new Date().getHours() + 2)),
    category: 'service',
    image: null,
  });

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDateChange = (type, event, selectedDate) => {
    const currentDate = selectedDate || (type === 'start' ? eventData.startDate : eventData.endDate);
    
    if (type === 'start') {
      setShowStartPicker(false);
      setEventData({...eventData, startDate: currentDate});
    } else {
      setShowEndPicker(false);
      setEventData({...eventData, endDate: currentDate});
    }
  };

  const handleSubmit = () => {
    if (!eventData.title || !eventData.description || !eventData.location) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (eventData.endDate <= eventData.startDate) {
      Alert.alert('Error', 'End time must be after start time');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert('Success', 'Event created successfully!');
      // Reset form
      setEventData({
        title: '',
        description: '',
        location: '',
        startDate: new Date(),
        endDate: new Date(new Date().setHours(new Date().getHours() + 2)),
        category: 'service',
        image: null,
      });
    }, 1500);
  };

  if (!fontsLoaded) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View entering={FadeIn.duration(500)}>
        <Text style={styles.title}>Create New Event</Text>
        <Text style={styles.subtitle}>Organize church services and activities</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.formGroup}>
        <Text style={styles.label}>Event Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter event title"
          value={eventData.title}
          onChangeText={(text) => setEventData({...eventData, title: text})}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.formGroup}>
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter event description"
          multiline
          numberOfLines={4}
          value={eventData.description}
          onChangeText={(text) => setEventData({...eventData, description: text})}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(300)} style={styles.formGroup}>
        <Text style={styles.label}>Location *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter event location"
          value={eventData.location}
          onChangeText={(text) => setEventData({...eventData, location: text})}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(400)} style={styles.formGroup}>
        <Text style={styles.label}>Category *</Text>
        <View style={styles.categoryContainer}>
          <TouchableOpacity 
            style={[
              styles.categoryButton, 
              eventData.category === 'service' && styles.categoryButtonActive
            ]}
            onPress={() => setEventData({...eventData, category: 'service'})}
          >
            <MaterialCommunityIcons name="church" size={16} color={eventData.category === 'service' ? 'white' : ADMIN_COLOR} />
            <Text style={[
              styles.categoryButtonText,
              eventData.category === 'service' && styles.categoryButtonTextActive
            ]}>
              Service
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.categoryButton, 
              eventData.category === 'meeting' && styles.categoryButtonActive
            ]}
            onPress={() => setEventData({...eventData, category: 'meeting'})}
          >
            <MaterialCommunityIcons name="account-group" size={16} color={eventData.category === 'meeting' ? 'white' : ADMIN_COLOR} />
            <Text style={[
              styles.categoryButtonText,
              eventData.category === 'meeting' && styles.categoryButtonTextActive
            ]}>
              Meeting
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.categoryButton, 
              eventData.category === 'social' && styles.categoryButtonActive
            ]}
            onPress={() => setEventData({...eventData, category: 'social'})}
          >
            <MaterialCommunityIcons name="party-popper" size={16} color={eventData.category === 'social' ? 'white' : ADMIN_COLOR} />
            <Text style={[
              styles.categoryButtonText,
              eventData.category === 'social' && styles.categoryButtonTextActive
            ]}>
              Social
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(500)} style={styles.formGroup}>
        <Text style={styles.label}>Date & Time *</Text>
        <View style={styles.datetimeContainer}>
          <View style={styles.datetimeGroup}>
            <Text style={styles.datetimeLabel}>Start:</Text>
            <TouchableOpacity 
              style={styles.datetimeButton}
              onPress={() => setShowStartPicker(true)}
            >
              <Ionicons name="calendar" size={18} color={ADMIN_COLOR} />
              <Text style={styles.datetimeText}>
                {eventData.startDate.toLocaleDateString()} at {eventData.startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={eventData.startDate}
                mode="datetime"
                display="default"
                onChange={(event, date) => handleDateChange('start', event, date)}
              />
            )}
          </View>

          <View style={styles.datetimeGroup}>
            <Text style={styles.datetimeLabel}>End:</Text>
            <TouchableOpacity 
              style={styles.datetimeButton}
              onPress={() => setShowEndPicker(true)}
            >
              <Ionicons name="calendar" size={18} color={ADMIN_COLOR} />
              <Text style={styles.datetimeText}>
                {eventData.endDate.toLocaleDateString()} at {eventData.endDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={eventData.endDate}
                mode="datetime"
                display="default"
                onChange={(event, date) => handleDateChange('end', event, date)}
              />
            )}
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(600)}>
        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Text style={styles.submitButtonText}>Creating Event...</Text>
          ) : (
            <>
              <MaterialCommunityIcons name="calendar-plus" size={20} color="white" />
              <Text style={styles.submitButtonText}>Create Event</Text>
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
    height: 120,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryButtonActive: {
    backgroundColor: PRIMARY_COLOR,
  },
  categoryButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: ADMIN_COLOR,
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  datetimeContainer: {
    gap: 12,
  },
  datetimeGroup: {
    gap: 6,
  },
  datetimeLabel: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: '#6c757d',
    marginLeft: 5,
  },
  datetimeButton: {
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
  datetimeText: {
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