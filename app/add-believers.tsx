import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import {
  useFonts,
  Montserrat_600SemiBold,
  Montserrat_400Regular,
} from '@expo-google-fonts/montserrat';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { supabase } from '@/lib/supabase';

const PRIMARY_COLOR = '#c31c6b';
const ADMIN_COLOR = '#2f4858';

export default function AddBelieverScreen() {
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
  });

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    gender: '',
    phone: '',
    address: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const genderOptions = ['Male', 'Female'];

  const isValidPhone = (phone) => {
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async () => {
    const { name, surname, gender, phone, address } = formData;

    if (!name || !surname || !gender || !phone || !address) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    if (!isValidPhone(phone)) {
      Alert.alert('Invalid Phone Number', 'Enter a valid phone number');
      return;
    }

    setIsSubmitting(true);

    const { data: existing, error: existingError } = await supabase
      .from('believers')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();

    if (existingError) {
      setIsSubmitting(false);
      Alert.alert('Error', existingError.message);
      return;
    }

    if (existing) {
      setIsSubmitting(false);
      Alert.alert('Duplicate', 'A believer with this phone number already exists.');
      return;
    }

    const { error } = await supabase
      .from('believers')
      .insert([{ name, surname, gender, phone, address }]);

    setIsSubmitting(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Believer added successfully!');
      setFormData({
        name: '',
        surname: '',
        gender: '',
        phone: '',
        address: '',
      });
    }
  };

  if (!fontsLoaded) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View entering={FadeIn.duration(500)}>
        <Text style={styles.title}>Add New Believer</Text>
        <Text style={styles.subtitle}>
          Fill in the details to register a new member
        </Text>
      </Animated.View>

      {['name', 'surname', 'phone', 'address'].map((field, index) => (
        <Animated.View
          key={field}
          entering={FadeInDown.duration(500).delay(index * 100)}
          style={styles.formGroup}
        >
          <Text style={styles.label}>
            {field.charAt(0).toUpperCase() + field.slice(1)} *
          </Text>
          <TextInput
            style={[styles.input, field === 'address' && styles.textArea]}
            placeholder={`Enter ${field}`}
            value={formData[field]}
            onChangeText={(text) => setFormData({ ...formData, [field]: text })}
            multiline={field === 'address'}
            numberOfLines={field === 'address' ? 3 : 1}
          />
        </Animated.View>
      ))}

      {/* Gender Radio Buttons */}
      <Animated.View
        entering={FadeInDown.duration(500).delay(400)}
        style={styles.formGroup}
      >
        <Text style={styles.label}>Gender *</Text>
        <View style={styles.radioGroup}>
          {genderOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.radioButtonContainer}
              onPress={() => setFormData({ ...formData, gender: option })}
            >
              <View style={styles.radioCircle}>
                {formData.gender === option && <View style={styles.selectedRb} />}
              </View>
              <Text style={styles.radioLabel}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(600)}>
        <TouchableOpacity
          style={[
            styles.uploadButton,
            isSubmitting && styles.uploadButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.uploadButtonText}>
            {isSubmitting ? 'Submitting...' : 'Add Believer'}
          </Text>
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
    height: 80,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 4,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PRIMARY_COLOR,
  },
  radioLabel: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#333',
  },
  uploadButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  uploadButtonDisabled: {
    backgroundColor: '#adb5bd',
  },
  uploadButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: 'white',
  },
});
