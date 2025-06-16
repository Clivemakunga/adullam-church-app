import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useFonts, Montserrat_600SemiBold, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from '@/lib/supabase';
import * as FileSystem from 'expo-file-system';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

const PRIMARY_COLOR = '#c31c6b';
const ADMIN_COLOR = '#2f4858';

export default function CreateSermonScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
  });

  const [sermonData, setSermonData] = useState({
    title: '',
    preacher: '',
    bibleText: '',
    date: new Date(),
    audioFile: null,
    videoFile: null,
    notes: '',
    category: 'Sunday Service', // Default category
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSermonData({...sermonData, date: selectedDate});
    }
  };

  const pickAudioFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
    if (!result.canceled) {
      setSermonData({ ...sermonData, audioFile: result.assets[0] });
    }
  };

  const pickVideoFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'video/*' });
    if (!result.canceled) {
      setSermonData({ ...sermonData, videoFile: result.assets[0] });
    }
  };

  const uploadFileToSupabase = async (file, bucket) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${fileName}`;

    const fileContent = await FileSystem.readAsStringAsync(file.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, Buffer.from(fileContent, 'base64'), {
        contentType: file.mimeType,
        upsert: true,
      });

    if (error) {
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  const handleSubmit = async () => {
    if (!sermonData.title || !sermonData.preacher || !sermonData.bibleText) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);

      let audioUrl = null;
      let videoUrl = null;

      if (sermonData.audioFile) {
        audioUrl = await uploadFileToSupabase(sermonData.audioFile, 'sermon-audio');
      }

      if (sermonData.videoFile) {
        videoUrl = await uploadFileToSupabase(sermonData.videoFile, 'sermon-video');
      }

      const { error } = await supabase
        .from('sermons')
        .insert([
          {
            title: sermonData.title,
            preacher: sermonData.preacher,
            bible_text: sermonData.bibleText,
            date: sermonData.date.toISOString(),
            audio_url: audioUrl,
            video_url: videoUrl,
            notes: sermonData.notes,
            category: sermonData.category,
          }
        ]);

      if (error) {
        throw error;
      }

      Alert.alert('Success', 'Sermon created successfully!');
      setSermonData({
        title: '',
        preacher: '',
        bibleText: '',
        date: new Date(),
        audioFile: null,
        videoFile: null,
        notes: '',
        category: 'Sunday Service',
      });
    } catch (err) {
      Alert.alert('Upload Failed', err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={ADMIN_COLOR} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Create New Sermon</Text>
          <Text style={styles.subtitle}>Share God's word with your congregation</Text>
        </View>
      </View>

      {/* Inputs */}
      <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.formGroup}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter sermon title"
          value={sermonData.title}
          onChangeText={(text) => setSermonData({...sermonData, title: text})}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.formGroup}>
        <Text style={styles.label}>Preacher *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter preacher's name"
          value={sermonData.preacher}
          onChangeText={(text) => setSermonData({...sermonData, preacher: text})}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(300)} style={styles.formGroup}>
        <Text style={styles.label}>Bible Text *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. John 3:16-18"
          value={sermonData.bibleText}
          onChangeText={(text) => setSermonData({...sermonData, bibleText: text})}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(350)} style={styles.formGroup}>
        <Text style={styles.label}>Category *</Text>
        <View style={[styles.input, styles.pickerContainer]}>
          <Picker
            selectedValue={sermonData.category}
            onValueChange={(itemValue) => setSermonData({...sermonData, category: itemValue})}
            style={styles.picker}
            dropdownIconColor={ADMIN_COLOR}
          >
            <Picker.Item label="Sunday Service" value="Sunday Service" />
            <Picker.Item label="Thursday Service" value="Thursday Service" />
          </Picker>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(400)} style={styles.formGroup}>
        <Text style={styles.label}>Date *</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
          <Ionicons name="calendar" size={18} color={ADMIN_COLOR} />
          <Text style={styles.dateText}>{sermonData.date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={sermonData.date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(500)} style={styles.formGroup}>
        <Text style={styles.label}>Audio File</Text>
        <TouchableOpacity style={styles.fileButton} onPress={pickAudioFile}>
          <MaterialCommunityIcons name="music-note" size={20} color={ADMIN_COLOR} />
          <Text style={styles.fileButtonText}>
            {sermonData.audioFile ? sermonData.audioFile.name : 'Select audio file'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(600)} style={styles.formGroup}>
        <Text style={styles.label}>Video File</Text>
        <TouchableOpacity style={styles.fileButton} onPress={pickVideoFile}>
          <MaterialCommunityIcons name="video" size={20} color={ADMIN_COLOR} />
          <Text style={styles.fileButtonText}>
            {sermonData.videoFile ? sermonData.videoFile.name : 'Select video file'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(700)} style={styles.formGroup}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Add any additional notes..."
          multiline
          numberOfLines={6}
          value={sermonData.notes}
          onChangeText={(text) => setSermonData({...sermonData, notes: text})}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(800)}>
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Text style={styles.submitButtonText}>Creating Sermon...</Text>
          ) : (
            <>
              <MaterialCommunityIcons name="microphone" size={20} color="white" />
              <Text style={styles.submitButtonText}>Publish Sermon</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30
  },
  backButton: {
    marginRight: 15,
  },
  headerTextContainer: {
    flex: 1,
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
    marginBottom: 0,
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
  pickerContainer: {
    padding: 0,
  },
  picker: {
    width: '100%',
    color: ADMIN_COLOR,
  },
  textArea: {
    height: 150,
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
  fileButton: {
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
  fileButtonText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: ADMIN_COLOR,
    flex: 1,
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