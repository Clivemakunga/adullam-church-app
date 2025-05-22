import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, TextInput } from 'react-native';
import { useFonts, Montserrat_600SemiBold, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const PRIMARY_COLOR = '#c31c6b';
const ADMIN_COLOR = '#2f4858';

export default function ProfessionsAdmin() {
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
  });

  const [professions, setProfessions] = useState([
    { id: 1, name: "Doctor", count: 24 },
    { id: 2, name: "Teacher", count: 32 },
    { id: 3, name: "Engineer", count: 18 },
    { id: 4, name: "Nurse", count: 15 },
    { id: 5, name: "Business Owner", count: 28 },
    { id: 6, name: "Student", count: 45 },
    { id: 7, name: "Software Developer", count: 12 },
  ]);

  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      profession: "Doctor",
      department: "Medical Ministry",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 2,
      name: "Michael Brown",
      profession: "Teacher",
      department: "Education Ministry",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 3,
      name: "Grace Williams",
      profession: "Nurse",
      department: "Medical Ministry",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
  ]);

  const [newProfession, setNewProfession] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('professions');

  const addProfession = () => {
    if (newProfession.trim()) {
      setProfessions([...professions, {
        id: professions.length + 1,
        name: newProfession.trim(),
        count: 0
      }]);
      setNewProfession('');
    }
  };

  const deleteProfession = (id) => {
    setProfessions(professions.filter(prof => prof.id !== id));
  };

  const filteredProfessions = professions.filter(prof =>
    prof.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.profession.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!fontsLoaded) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View entering={FadeIn.duration(500)}>
        <Text style={styles.title}>Brethren Professions</Text>
        <Text style={styles.subtitle}>Manage congregants' vocations and skills</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'professions' && styles.tabActive]}
          onPress={() => setActiveTab('professions')}
        >
          <Text style={[styles.tabText, activeTab === 'professions' && styles.tabTextActive]}>
            Professions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'members' && styles.tabActive]}
          onPress={() => setActiveTab('members')}
        >
          <Text style={[styles.tabText, activeTab === 'members' && styles.tabTextActive]}>
            Members
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6c757d" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${activeTab === 'professions' ? 'professions' : 'members'}...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </Animated.View>

      {activeTab === 'professions' ? (
        <>
          <Animated.View entering={FadeInDown.duration(500).delay(300)} style={styles.addContainer}>
            <TextInput
              style={styles.addInput}
              placeholder="Add new profession..."
              value={newProfession}
              onChangeText={setNewProfession}
            />
            <TouchableOpacity style={styles.addButton} onPress={addProfession}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </Animated.View>

          {filteredProfessions.length === 0 ? (
            <Animated.View entering={FadeInDown.duration(500).delay(400)} style={styles.emptyState}>
              <MaterialCommunityIcons name="briefcase-remove" size={48} color="#adb5bd" />
              <Text style={styles.emptyText}>No professions found</Text>
            </Animated.View>
          ) : (
            <FlatList
              data={filteredProfessions}
              scrollEnabled={false}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item, index }) => (
                <Animated.View 
                  entering={FadeInDown.duration(500).delay(100 * index)}
                  style={styles.professionItem}
                >
                  <View style={styles.professionInfo}>
                    <MaterialCommunityIcons name="briefcase" size={20} color={PRIMARY_COLOR} />
                    <Text style={styles.professionName}>{item.name}</Text>
                    <Text style={styles.professionCount}>{item.count} members</Text>
                  </View>
                  <TouchableOpacity onPress={() => deleteProfession(item.id)}>
                    <Ionicons name="trash" size={20} color="#dc3545" />
                  </TouchableOpacity>
                </Animated.View>
              )}
            />
          )}
        </>
      ) : (
        <>
          {filteredMembers.length === 0 ? (
            <Animated.View entering={FadeInDown.duration(500).delay(400)} style={styles.emptyState}>
              <MaterialCommunityIcons name="account-group" size={48} color="#adb5bd" />
              <Text style={styles.emptyText}>No members found</Text>
            </Animated.View>
          ) : (
            <FlatList
              data={filteredMembers}
              scrollEnabled={false}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item, index }) => (
                <Animated.View 
                  entering={FadeInDown.duration(500).delay(100 * index)}
                  style={styles.memberCard}
                >
                  <View style={styles.memberInfo}>
                    <Image source={{ uri: item.avatar }} style={styles.memberAvatar} />
                    <View style={styles.memberDetails}>
                      <Text style={styles.memberName}>{item.name}</Text>
                      <Text style={styles.memberProfession}>{item.profession}</Text>
                      <Text style={styles.memberDepartment}>{item.department}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.editButton}>
                    <MaterialCommunityIcons name="pencil" size={18} color={PRIMARY_COLOR} />
                  </TouchableOpacity>
                </Animated.View>
              )}
            />
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
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
    marginBottom: 25,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    marginBottom: 15,
  },
  tab: {
    paddingBottom: 12,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: PRIMARY_COLOR,
  },
  tabText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#6c757d',
  },
  tabTextActive: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: ADMIN_COLOR,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
  },
  addContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  addInput: {
    flex: 1,
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
  addButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 10,
    padding: 15,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  professionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  professionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  professionName: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: ADMIN_COLOR,
    marginLeft: 12,
    marginRight: 12,
    flex: 1,
  },
  professionCount: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#6c757d',
  },
  memberCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: ADMIN_COLOR,
    marginBottom: 2,
  },
  memberProfession: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#495057',
    marginBottom: 2,
  },
  memberDepartment: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#6c757d',
  },
  editButton: {
    backgroundColor: '#e9ecef',
    width: 36,
    height: 36,
    borderRadius: 18,
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