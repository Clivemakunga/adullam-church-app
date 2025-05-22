import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { useFonts, Montserrat_600SemiBold, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

const PRIMARY_COLOR = '#c31c6b';
const ADMIN_COLOR = '#2f4858';

export default function DepartmentsScreen() {
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
  });

  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: "Worship Team",
      leader: "David Johnson",
      memberCount: 12,
      description: "Leads the congregation in worship during services",
      members: [
        { id: 1, name: "Sarah Miller", role: "Lead Vocal", avatar: "https://randomuser.me/api/portraits/women/12.jpg" },
        { id: 2, name: "Michael Brown", role: "Keyboard", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
        { id: 3, name: "Grace Lee", role: "Drums", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
      ]
    },
    {
      id: 2,
      name: "Media Team",
      leader: "James Wilson",
      memberCount: 8,
      description: "Handles all audio, video and live streaming",
      members: [
        { id: 1, name: "Robert Taylor", role: "Sound Engineer", avatar: "https://randomuser.me/api/portraits/men/22.jpg" },
        { id: 2, name: "Emily Davis", role: "Video Editor", avatar: "https://randomuser.me/api/portraits/women/33.jpg" },
      ]
    },
    {
      id: 3,
      name: "Hospitality",
      leader: "Maria Garcia",
      memberCount: 15,
      description: "Welcomes and assists visitors and members",
      members: [
        { id: 1, name: "John Smith", role: "Greeter", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
        { id: 2, name: "Lisa Johnson", role: "Usher", avatar: "https://randomuser.me/api/portraits/women/55.jpg" },
      ]
    },
  ]);

  const [expandedDepartment, setExpandedDepartment] = useState(null);

  const toggleExpand = (id) => {
    setExpandedDepartment(expandedDepartment === id ? null : id);
  };

  if (!fontsLoaded) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View entering={FadeIn.duration(500)}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Church Departments</Text>
            <Text style={styles.subtitle}>Manage ministry teams and members</Text>
          </View>
          <Link href="/admin/departments/create" asChild>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </Link>
        </View>
      </Animated.View>

      {departments.length === 0 ? (
        <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.emptyState}>
          <MaterialCommunityIcons name="account-group" size={48} color="#adb5bd" />
          <Text style={styles.emptyText}>No departments created yet</Text>
          <Link href="/admin/departments/create" asChild>
            <TouchableOpacity style={styles.createButton}>
              <Text style={styles.createButtonText}>Create First Department</Text>
            </TouchableOpacity>
          </Link>
        </Animated.View>
      ) : (
        <FlatList
          data={departments}
          scrollEnabled={false}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item, index }) => (
            <Animated.View 
              entering={FadeInDown.duration(500).delay(100 * index)}
              style={styles.departmentCard}
            >
              <TouchableOpacity onPress={() => toggleExpand(item.id)}>
                <View style={styles.departmentHeader}>
                  <View>
                    <Text style={styles.departmentName}>{item.name}</Text>
                    <Text style={styles.departmentLeader}>Leader: {item.leader}</Text>
                    <Text style={styles.departmentCount}>{item.memberCount} members</Text>
                  </View>
                  <Ionicons 
                    name={expandedDepartment === item.id ? "chevron-up" : "chevron-down"} 
                    size={24} 
                    color={ADMIN_COLOR} 
                  />
                </View>
              </TouchableOpacity>

              {expandedDepartment === item.id && (
                <View style={styles.departmentContent}>
                  <Text style={styles.departmentDescription}>{item.description}</Text>
                  
                  <Text style={styles.membersTitle}>Members:</Text>
                  <FlatList
                    data={item.members}
                    scrollEnabled={false}
                    keyExtractor={member => member.id.toString()}
                    renderItem={({ item: member }) => (
                      <View style={styles.memberItem}>
                        <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
                        <View style={styles.memberInfo}>
                          <Text style={styles.memberName}>{member.name}</Text>
                          <Text style={styles.memberRole}>{member.role}</Text>
                        </View>
                        <TouchableOpacity style={styles.memberAction}>
                          <MaterialCommunityIcons name="dots-vertical" size={20} color="#6c757d" />
                        </TouchableOpacity>
                      </View>
                    )}
                  />

                  <View style={styles.departmentActions}>
                    <Link href={`/admin/departments/edit/${item.id}`} asChild>
                      <TouchableOpacity style={styles.editButton}>
                        <MaterialCommunityIcons name="pencil" size={18} color={PRIMARY_COLOR} />
                        <Text style={styles.editButtonText}>Edit Department</Text>
                      </TouchableOpacity>
                    </Link>
                    <TouchableOpacity style={styles.addMemberButton}>
                      <Ionicons name="person-add" size={18} color="white" />
                      <Text style={styles.addMemberButtonText}>Add Member</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
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
  departmentCard: {
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
  departmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  departmentName: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18,
    color: ADMIN_COLOR,
    marginBottom: 4,
  },
  departmentLeader: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#495057',
    marginBottom: 2,
  },
  departmentCount: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#6c757d',
  },
  departmentContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  departmentDescription: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
    marginBottom: 16,
  },
  membersTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: ADMIN_COLOR,
    marginBottom: 12,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: ADMIN_COLOR,
  },
  memberRole: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#6c757d',
  },
  memberAction: {
    padding: 8,
  },
  departmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  editButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: PRIMARY_COLOR,
  },
  addMemberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addMemberButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: 'white',
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
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  createButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: 'white',
  },
});