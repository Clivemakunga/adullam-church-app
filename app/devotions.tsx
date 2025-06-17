import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useFonts, Montserrat_600SemiBold, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

const PRIMARY_COLOR = '#c31c6b';
const ADMIN_COLOR = '#2f4858';

const devotionCategories = [
  { id: 'all', name: 'All Devotions' },
  { id: 'daily', name: 'Daily Devotion' },
  { id: 'weekly', name: 'Weekly Reflection' },
  { id: 'special', name: 'Special Message' },
];

export default function DevotionsScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
  });

  const [devotions, setDevotions] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDevotions();
  }, []);

  const fetchDevotions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('devotions')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching devotions:', error);
        return;
      }

      setDevotions(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDevotions();
  };

  const deleteDevotion = async (id) => {
    try {
      const { error } = await supabase
        .from('devotions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting devotion:', error);
        return;
      }

      setDevotions(devotions.filter(devotion => devotion.id !== id));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredDevotions = activeCategory === 'all' 
    ? devotions 
    : devotions.filter(devotion => devotion.category === activeCategory);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  if (!fontsLoaded) return null;

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          colors={[PRIMARY_COLOR]}
        />
      }
    >
      <Animated.View entering={FadeIn.duration(500)}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={ADMIN_COLOR} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Devotions</Text>
            <Text style={styles.subtitle}>Spiritual nourishment for your congregation</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {devotionCategories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                activeCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => setActiveCategory(category.id)}
            >
              <Text style={[
                styles.categoryText,
                activeCategory === category.id && styles.categoryTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {isLoading ? (
        <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.loadingState}>
          <MaterialCommunityIcons name="book-open" size={48} color="#adb5bd" />
          <Text style={styles.loadingText}>Loading devotions...</Text>
        </Animated.View>
      ) : filteredDevotions.length === 0 ? (
        <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.emptyState}>
          <MaterialCommunityIcons name="book-open" size={48} color="#adb5bd" />
          <Text style={styles.emptyText}>No devotions found</Text>
          {activeCategory !== 'all' && (
            <Text style={styles.emptySubtext}>Try selecting a different category</Text>
          )}
        </Animated.View>
      ) : (
        <FlatList
          data={filteredDevotions}
          scrollEnabled={false}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item, index }) => (
            <Animated.View 
              entering={FadeInDown.duration(500).delay(100 * index)}
              style={[
                styles.devotionCard,
                item.is_featured && styles.featuredCard
              ]}
            >
              <View style={styles.devotionHeader}>
                <View style={styles.devotionContent}>
                  <Text style={styles.devotionTitle}>{item.title}</Text>
                  <Text style={styles.devotionVerse}>{item.bible_verse}</Text>
                  <Text style={styles.devotionDate}>{formatDate(item.date)}</Text>
                  <Text style={styles.devotionCategory}>
                    {item.category === 'daily' ? 'Daily Devotion' : 
                     item.category === 'weekly' ? 'Weekly Reflection' : 'Special Message'}
                  </Text>
                </View>
                {item.is_featured && (
                  <View style={styles.featuredTag}>
                    <MaterialCommunityIcons name="star" size={14} color="white" />
                    <Text style={styles.featuredText}>Featured</Text>
                  </View>
                )}
              </View>
            </Animated.View>
          )}
        />
      )}
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
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat_600SemiBold',
    color: ADMIN_COLOR,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#6c757d',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: PRIMARY_COLOR,
  },
  categoryText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#495057',
  },
  categoryTextActive: {
    color: 'white',
  },
  devotionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredCard: {
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY_COLOR,
  },
  devotionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  devotionContent: {
    flex: 1,
  },
  devotionTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: ADMIN_COLOR,
    marginBottom: 4,
  },
  devotionVerse: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  devotionDate: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  devotionCategory: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: PRIMARY_COLOR,
    marginTop: 4,
  },
  featuredTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
    height: 24,
    alignSelf: 'flex-start',
  },
  featuredText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: 'white',
  },
  loadingState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
    color: '#adb5bd',
    marginTop: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
    color: '#adb5bd',
    marginTop: 16,
  },
  emptySubtext: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#ced4da',
    marginTop: 8,
  },
});