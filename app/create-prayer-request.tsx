// app/prayers/create.js
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';

export default function CreatePrayerScreen() {
  const [request, setRequest] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = () => {
    // In a real app, you would submit to your backend here
    Alert.alert("Success", "Prayer request submitted for approval");
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Prayer Request</Text>
      
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
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={!request.trim()}
      >
        <Text style={styles.submitText}>Submit for Approval</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});