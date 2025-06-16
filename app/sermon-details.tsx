import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const PRIMARY_COLOR = '#c31c6b';
const PLACEHOLDER_IMAGE = 'https://picsum.photos/800/600?grayscale';

export default function SermonDetails() {
  const { sermon } = useLocalSearchParams();
  const sermonData = JSON.parse(sermon);

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <MaterialIcons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {/* Sermon Image */}
      <Image 
        source={{ uri: sermonData.image || PLACEHOLDER_IMAGE }} 
        style={styles.sermonImage}
        resizeMode="cover"
      />

      {/* Sermon Meta */}
      <View style={styles.metaContainer}>
        <Text style={styles.category}>{sermonData.category || 'Sermon'}</Text>
        <Text style={styles.date}>
          {new Date(sermonData.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
        <Text style={styles.readTime}>{sermonData.read_time || '5 min read'}</Text>
      </View>

      {/* Sermon Title */}
      <Text style={styles.title}>{sermonData.title}</Text>

      {/* Preacher Info */}
      {sermonData.preacher && (
        <View style={styles.preacherContainer}>
          <Image 
            source={{ uri: sermonData.preacher.image || PLACEHOLDER_IMAGE }} 
            style={styles.preacherImage}
          />
          <View style={styles.preacherInfo}>
            <Text style={styles.preacherLabel}>Preacher</Text>
            <Text style={styles.preacherName}>{sermonData.preacher.name}</Text>
            {sermonData.preacher.title && (
              <Text style={styles.preacherTitle}>{sermonData.preacher.title}</Text>
            )}
          </View>
        </View>
      )}

      {/* Sermon Content */}
      <Text style={styles.content}>{sermonData.notes}</Text>

      {/* Footer */}
      <View style={styles.footer}>
        <MaterialIcons name="bookmark" size={24} color={PRIMARY_COLOR} />
        <MaterialIcons name="share" size={24} color={PRIMARY_COLOR} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  sermonImage: {
    width: '100%',
    height: 250,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  category: {
    color: PRIMARY_COLOR,
    fontWeight: '600',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  date: {
    color: '#666',
    fontSize: 14,
  },
  readTime: {
    color: '#666',
    fontSize: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginHorizontal: 20,
    marginBottom: 20,
    lineHeight: 34,
  },
  preacherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
  },
  preacherImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  preacherInfo: {
    flex: 1,
  },
  preacherLabel: {
    color: '#666',
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  preacherName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  preacherTitle: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    fontSize: 16,
    lineHeight: 26,
    color: '#333',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 20,
  },
});