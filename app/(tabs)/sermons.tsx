import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from "react-native";
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import { Link } from 'expo-router';
import { MaterialIcons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const PRIMARY_COLOR = '#c31c6b';

const sermons = [
  {
    id: '1',
    title: "The Transformative Power of Faith",
    date: "March 15, 2023",
    category: "Spiritual Growth",
    excerpt: "Exploring how faith can transform our daily lives and relationships...",
    image: "https://i.imgur.com/abc123.jpg",
    readTime: "5 min read"
  },
  {
    id: '2',
    title: "Finding Purpose in Modern Times",
    date: "March 8, 2023",
    category: "Life Purpose",
    excerpt: "Understanding God's plan for your life in today's fast-paced world...",
    image: "https://i.imgur.com/def456.jpg",
    readTime: "4 min read"
  },
  {
    id: '3',
    title: "Overcoming Life's Challenges",
    date: "March 1, 2023",
    category: "Perseverance",
    excerpt: "Biblical strategies for overcoming adversity...",
    image: "https://i.imgur.com/ghi789.jpg",
    readTime: "6 min read"
  },
  {
    id: '4',
    title: "The Gift of Grace",
    date: "February 22, 2023",
    category: "Salvation",
    excerpt: "Understanding unmerited favor in our lives...",
    image: "https://i.imgur.com/jkl012.jpg",
    readTime: "4 min read"
  },
];

export default function SermonsScreen() {
  const [numColumns, setNumColumns] = useState(1);
  const [isGridView, setIsGridView] = useState(false);

  const toggleView = () => {
    const newColumns = isGridView ? 1 : 2;
    setNumColumns(newColumns);
    setIsGridView(!isGridView);
  };

  const renderSermon = ({ item, index }) => (
    <Link href={`/(sermons)/${item.id}`} asChild>
      <TouchableOpacity>
        <Animated.View 
          entering={FadeInRight.delay(index * 100)}
          style={[
            styles.blogCard,
            isGridView && styles.gridCard
          ]}
        >
          <Image 
            source={{ uri: item.image }} 
            style={isGridView ? styles.gridImage : styles.listImage} 
          />
          
          <View style={styles.contentContainer}>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.title}>{item.title}</Text>
            
            <View style={styles.metaContainer}>
              <Text style={styles.date}>{item.date}</Text>
              {!isGridView && (
                <>
                  <View style={styles.dot} />
                  <Text style={styles.readTime}>{item.readTime}</Text>
                </>
              )}
            </View>

            {!isGridView && (
              <Text style={styles.excerpt}>{item.excerpt}</Text>
            )}

            <View style={styles.footer}>
              <Feather name="arrow-right-circle" size={24} color={PRIMARY_COLOR} />
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
        <Text style={styles.headerTitle}>Sermon Archive</Text>
        <View style={styles.filterContainer}>
          <TouchableOpacity onPress={toggleView} style={styles.viewToggle}>
            <MaterialIcons 
              name={isGridView ? 'view-list' : 'view-module'} 
              size={24} 
              color={PRIMARY_COLOR} 
            />
          </TouchableOpacity>
          <MaterialIcons name="search" size={24} color={PRIMARY_COLOR} />
          <MaterialIcons name="filter-list" size={24} color={PRIMARY_COLOR} />
        </View>
      </Animated.View>

      <FlatList
        key={`flatlist-${numColumns}`}
        data={sermons}
        renderItem={renderSermon}
        keyExtractor={item => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginTop: 50
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  viewToggle: {
    marginRight: 8,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  blogCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  gridCard: {
    width: (width - 30) / 2,
    margin: 5,
  },
  listImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  gridImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  contentContainer: {
    padding: 15,
  },
  category: {
    color: PRIMARY_COLOR,
    fontWeight: '600',
    fontSize: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
    lineHeight: 24,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  date: {
    color: '#666',
    fontSize: 13,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#666',
    marginHorizontal: 8,
  },
  readTime: {
    color: '#666',
    fontSize: 13,
  },
  excerpt: {
    color: '#4a4a4a',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 15,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    alignItems: 'flex-end',
  },
});