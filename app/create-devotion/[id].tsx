import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import CreateDevotionScreen from '.';
import { Alert, ActivityIndicator, View } from 'react-native';

export default function EditDevotionPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchDevotionData();
    }
  }, [id]);

  const fetchDevotionData = async () => {
    const { data, error } = await supabase
      .from('devotions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      Alert.alert('Error', 'Failed to load devotion.');
    } else {
      setInitialData({
        title: data.title,
        bibleVerse: data.bible_verse,
        content: data.content,
        date: new Date(data.date),
        category: data.category,
        isFeatured: data.is_featured,
      });
    }

    setLoading(false);
  };

  const handleUpdate = async (updatedData) => {
    const { error } = await supabase
      .from('devotions')
      .update({
        title: updatedData.title,
        bible_verse: updatedData.bibleVerse,
        content: updatedData.content,
        date: updatedData.date,
        category: updatedData.category,
        is_featured: updatedData.isFeatured,
      })
      .eq('id', id);

    if (error) {
      Alert.alert('Error', 'Failed to update devotion.');
    } else {
      Alert.alert('Success', 'Devotion updated successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <CreateDevotionScreen
      initialData={initialData}
      onSubmit={handleUpdate}
      mode="edit"
    />
  );
}
