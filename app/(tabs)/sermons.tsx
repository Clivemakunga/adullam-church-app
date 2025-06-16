import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, ActivityIndicator, RefreshControl } from "react-native";
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import { Link } from 'expo-router';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';

const { width } = Dimensions.get('window');
const PRIMARY_COLOR = '#c31c6b';
const PLACEHOLDER_IMAGE = 'https://picsum.photos/800/600?grayscale';
const MAX_EXCERPT_WORDS = 40;

export default function SermonsScreen() {
  const [numColumns, setNumColumns] = useState(1);
  const [isGridView, setIsGridView] = useState(false);
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSermons = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSermons(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSermons();
  }, []);

  const toggleView = () => {
    const newColumns = isGridView ? 1 : 2;
    setNumColumns(newColumns);
    setIsGridView(!isGridView);
  };

  // Function to truncate text to 40 words
  const truncateText = (text) => {
    if (!text) return 'No excerpt available...';
    
    const words = text.split(' ');
    if (words.length > MAX_EXCERPT_WORDS) {
      return words.slice(0, MAX_EXCERPT_WORDS).join(' ') + '...';
    }
    return text;
  };

  const renderSermon = ({ item, index }) => (
    <Link href={{
      pathname: `/sermon-details`,
      params: { sermon: JSON.stringify(item) }
    }} asChild>
      <TouchableOpacity>
        <Animated.View 
          entering={FadeInRight.delay(index * 100)}
          style={[
            styles.blogCard,
            isGridView && styles.gridCard
          ]}
        >
          <Image 
            source={{ uri: item.image || PLACEHOLDER_IMAGE }} 
            style={isGridView ? styles.gridImage : styles.listImage}
            resizeMode="cover"
          />
          
          <View style={styles.contentContainer}>
            <Text style={styles.category}>{item.category || 'Sermon'}</Text>
            <Text style={styles.title}>{item.title}</Text>
            
            <View style={styles.metaContainer}>
              <Text style={styles.date}>
                {item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'No date'}
              </Text>
              {!isGridView && (
                <>
                  <View style={styles.dot} />
                  <Text style={styles.readTime}>{item.read_time || '5 min read'}</Text>
                </>
              )}
            </View>

            {!isGridView && (
              <Text style={styles.excerpt}>{truncateText(item.notes)}</Text>
            )}

            <View style={styles.footer}>
              <Feather name="arrow-right-circle" size={24} color={PRIMARY_COLOR} />
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>Error loading sermons: {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchSermons}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (sermons.length === 0 && !loading) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Image 
          source={{ uri: PLACEHOLDER_IMAGE }} 
          style={styles.emptyImage}
        />
        <Text style={styles.emptyText}>No sermons available yet</Text>
      </View>
    );
  }

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
        keyExtractor={item => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchSermons}
            tintColor={PRIMARY_COLOR}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyImage: {
    width: 200,
    height: 150,
    marginBottom: 20,
    borderRadius: 10,
    opacity: 0.7,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
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