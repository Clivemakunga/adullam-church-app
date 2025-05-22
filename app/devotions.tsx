import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useFonts, Montserrat_600SemiBold, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

const PRIMARY_COLOR = '#c31c6b';
const ADMIN_COLOR = '#2f4858';

const devotionCategories = [
  { id: 'all', name: 'All Devotions' },
  { id: 'daily', name: 'Daily' },
  { id: 'weekly', name: 'Weekly' },
  { id: 'special', name: 'Special' },
];

export default function DevotionsScreen() {
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
  });

  const [devotions, setDevotions] = useState([
    {
      id: 1,
      title: "God's Faithfulness",
      date: "2023-06-15",
      verse: "Lamentations 3:22-23",
      category: "daily",
      isFeatured: true
    },
    {
      id: 2,
      title: "Walking in Love",
      date: "2023-06-14",
      verse: "Ephesians 5:1-2",
      category: "weekly",
      isFeatured: false
    },
    {
      id: 3,
      title: "Overcoming Fear",
      date: "2023-06-12",
      verse: "2 Timothy 1:7",
      category: "special",
      isFeatured: true
    },
  ]);

  const [activeCategory, setActiveCategory] = useState('all');

  const filteredDevotions = activeCategory === 'all' 
    ? devotions 
    : devotions.filter(devotion => devotion.category === activeCategory);

  const deleteDevotion = (id) => {
    setDevotions(devotions.filter(devotion => devotion.id !== id));
  };

  if (!fontsLoaded) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View entering={FadeIn.duration(500)}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Devotions</Text>
            <Text style={styles.subtitle}>Spiritual nourishment for your congregation</Text>
          </View>
          <Link href="/admin/devotions/create" asChild>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </Link>
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

      {filteredDevotions.length === 0 ? (
        <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.emptyState}>
          <MaterialCommunityIcons name="book-open" size={48} color="#adb5bd" />
          <Text style={styles.emptyText}>No devotions found</Text>
        </Animated.View>
      ) : (
        <FlatList
          data={filteredDevotions}
          scrollEnabled={false}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item, index }) => (
            <Animated.View 
              entering={FadeInDown.duration(500).delay(100 * index)}
              style={styles.devotionCard}
            >
              <View style={styles.devotionHeader}>
                <View>
                  <Text style={styles.devotionTitle}>{item.title}</Text>
                  <Text style={styles.devotionVerse}>{item.verse}</Text>
                </View>
                {item.isFeatured && (
                  <View style={styles.featuredTag}>
                    <MaterialCommunityIcons name="star" size={14} color="white" />
                    <Text style={styles.featuredText}>Featured</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.devotionFooter}>
                <Text style={styles.devotionDate}>{item.date}</Text>
                <View style={styles.actions}>
                  <Link href={`/admin/devotions/edit/${item.id}`} asChild>
                    <TouchableOpacity style={styles.editButton}>
                      <MaterialCommunityIcons name="pencil" size={18} color={PRIMARY_COLOR} />
                    </TouchableOpacity>
                  </Link>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => deleteDevotion(item.id)}
                  >
                    <MaterialCommunityIcons name="trash-can" size={18} color="#dc3545" />
                  </TouchableOpacity>
                </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  addButton: {
    backgroundColor: PRIMARY_COLOR,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  devotionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  },
  featuredTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  featuredText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: 'white',
  },
  devotionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  devotionDate: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#6c757d',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    backgroundColor: '#e9ecef',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#e9ecef',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
});