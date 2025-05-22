// UploadReelScreen.js

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Video } from 'expo-av';

export default function UploadReelScreen() {
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [valid, setValid] = useState(false);
  const videoRef = useRef(null);

  const MAX_DURATION = 120; // seconds
  const MAX_SIZE = 150 * 1024 * 1024; // 150 MB in bytes

  const pickVideo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'We need access to your gallery to upload reels.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const videoAsset = result.assets[0];

      // Check file size
      const fileInfo = await FileSystem.getInfoAsync(videoAsset.uri);
      if (fileInfo.size > MAX_SIZE) {
        Alert.alert('Video Too Large', 'Please choose a video under 150MB.');
        return;
      }

      setVideo(videoAsset);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      if (status.durationMillis / 1000 > MAX_DURATION) {
        Alert.alert('Video Too Long', 'Please choose a video under 2 minutes.');
        setVideo(null);
        setValid(false);
      } else {
        setValid(true);
      }
    }
  };

  const uploadVideo = async () => {
    if (!video || !valid) return;

    setUploading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated upload
      Alert.alert('Success', 'Reel uploaded!');
      setVideo(null);
      setValid(false);
    } catch (err) {
      Alert.alert('Upload Failed', err.message);
    }
    setUploading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload a Reel</Text>

      {video ? (
        <Video
          ref={videoRef}
          source={{ uri: video.uri }}
          style={styles.video}
          useNativeControls
          resizeMode="cover"
          isLooping
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        />
      ) : (
        <TouchableOpacity style={styles.button} onPress={pickVideo}>
          <Text style={styles.buttonText}>Pick a Video</Text>
        </TouchableOpacity>
      )}

      {video && valid && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#28a745' }]}
          onPress={uploadVideo}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Upload</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  video: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#c31c6b',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});
