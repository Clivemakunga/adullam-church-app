import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function CreatePrayerScreen() {
  const [request, setRequest] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!request.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to submit a prayer request');
      }
      
      const { error } = await supabase
        .from('prayer_requests')
        .insert({
          content: request.trim(),
          is_private: isPrivate,
          user_id: user.id,
          prayer_count: 0, // Initialize prayer count
          created_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      Alert.alert("Success", "Prayer request submitted successfully");
      router.back();
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to submit prayer request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#2f4858" />
        </TouchableOpacity>
        <Text style={styles.title}>New Prayer Request</Text>
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Share your prayer need..."
        multiline
        numberOfLines={6}
        value={request}
        onChangeText={setRequest}
      />
      
      <TouchableOpacity 
        style={styles.privacyToggle}
        onPress={() => setIsPrivate(!isPrivate)}
      >
        <View style={[styles.toggle, isPrivate && styles.toggleActive]}>
          <View style={styles.toggleKnob} />
        </View>
        <Text style={styles.privacyText}>
          {isPrivate ? "Private (only visible to pastors)" : "Public (visible to church)"}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.submitButton, (!request.trim() || isSubmitting) && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={!request.trim() || isSubmitting}
      >
        <Text style={styles.submitText}>
          {isSubmitting ? "Submitting..." : "Submit for Approval"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2f4858',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    minHeight: 150,
    textAlignVertical: 'top',
    marginBottom: 20,
    fontSize: 16,
  },
  privacyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e9ecef',
    marginRight: 10,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#c31c6b',
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  privacyText: {
    fontSize: 14,
    color: '#495057',
  },
  submitButton: {
    backgroundColor: '#c31c6b',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});