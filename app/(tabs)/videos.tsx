import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  TextInput, 
  Alert 
} from 'react-native';
import { useFonts, Montserrat_600SemiBold, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons, FontAwesome, AntDesign } from "@expo/vector-icons";
import { useAuth } from '@/providers/AuthProvider';
import { Picker } from '@react-native-picker/picker';
import Entypo from '@expo/vector-icons/Entypo';
import { supabase } from '@/lib/supabase';

const PRIMARY_COLOR = '#6a1b9a';
const SECONDARY_COLOR = '#26c6da';
const MEN_COLOR = '#3f51b5';
const WOMEN_COLOR = '#e91e63';
const YOUTH_COLOR = '#ff9800';
const CHILDREN_COLOR = '#4caf50';

const professionsList = [
  'Doctor',
  'Teacher',
  'Engineer',
  'Nurse',
  'Accountant',
  'Lawyer',
  'Business Owner',
  'IT Professional',
  'Artist',
  'Other'
];

const departmentsList = [
  'Worship Team',
  'Media Team',
  'Hospitality',
  'Prayer Team',
  'Outreach',
  'Sunday School'
];

export default function ChurchConnectScreen() {
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
  });

  const { user, profile } = useAuth();

  // Modal states
  const [showProfessionModal, setShowProfessionModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showMinistryModal, setShowMinistryModal] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  
  // Profession form state
  const [professionData, setProfessionData] = useState({
    name: profile?.first_name || '',
    surname: profile?.last_name || '',
    phone: '',
    email: user?.email || '',
    businessName: '',
    profession: ''
  });

  // Department form state
  const [departmentData, setDepartmentData] = useState({
    gender: '',
    department: ''
  });

  // Ministry form state
  const [ministryData, setMinistryData] = useState({
    phone: '',
    address: '',
    age: '',
    maritalStatus: '',
    skills: [],
    childrenCount: '',
    school: '',
    gradeLevel: '',
    parentContact: ''
  });

  // Counts state
  const [counts, setCounts] = useState({
    professionCount: 0,
    departmentCount: 0,
    mensMinistryCount: 0,
    womensMinistryCount: 0,
    youthMinistryCount: 0,
    childrenMinistryCount: 0
  });

  // User memberships state
  const [userMemberships, setUserMemberships] = useState({
    hasProfession: false,
    hasDepartment: false,
    hasMenMinistry: false,
    hasWomenMinistry: false,
    hasYouthMinistry: false
  });

  useEffect(() => {
    if (user) {
      fetchCounts();
      checkUserMemberships();
    }
  }, [user]);

  const fetchCounts = async () => {
    try {
      // Professions count
      const { count: professionCount } = await supabase
        .from('professions')
        .select('*', { count: 'exact', head: true });

      // Department members count
      const { count: departmentCount } = await supabase
        .from('department_members')
        .select('*', { count: 'exact', head: true });

      // Ministry counts from separate tables
      const { count: mensMinistryCount } = await supabase
        .from('men_ministry')
        .select('*', { count: 'exact', head: true });

      const { count: womensMinistryCount } = await supabase
        .from('women_ministry')
        .select('*', { count: 'exact', head: true });

      const { count: youthMinistryCount } = await supabase
        .from('youth_ministry')
        .select('*', { count: 'exact', head: true });

      setCounts({
        professionCount: professionCount || 0,
        departmentCount: departmentCount || 0,
        mensMinistryCount: mensMinistryCount || 0,
        womensMinistryCount: womensMinistryCount || 0,
        youthMinistryCount: youthMinistryCount || 0,
        childrenMinistryCount: 0
      });
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const checkUserMemberships = async () => {
    try {
      // Check professions
      const { data: professionData } = await supabase
        .from('professions')
        .select('id')
        .eq('user_id', user.id)
        .single();

      // Check department members
      const { data: departmentData } = await supabase
        .from('department_members')
        .select('id')
        .eq('user_id', user.id)
        .single();

      // Check ministries
      const { data: menMinistryData } = await supabase
        .from('men_ministry')
        .select('id')
        .eq('user_id', user.id)
        .single();

      const { data: womenMinistryData } = await supabase
        .from('women_ministry')
        .select('id')
        .eq('user_id', user.id)
        .single();

      const { data: youthMinistryData } = await supabase
        .from('youth_ministry')
        .select('id')
        .eq('user_id', user.id)
        .single();

      setUserMemberships({
        hasProfession: !!professionData,
        hasDepartment: !!departmentData,
        hasMenMinistry: !!menMinistryData,
        hasWomenMinistry: !!womenMinistryData,
        hasYouthMinistry: !!youthMinistryData
      });
    } catch (error) {
      console.error('Error checking user memberships:', error);
    }
  };

  const handleJoinMinistry = (ministry) => {
    if (
      (ministry === "Men's Ministry" && userMemberships.hasMenMinistry) ||
      (ministry === "Women's Ministry" && userMemberships.hasWomenMinistry) ||
      (ministry === "Youth Ministry" && userMemberships.hasYouthMinistry)
    ) {
      Alert.alert('Already Joined', `You have already joined ${ministry}`);
      return;
    }
    setSelectedMinistry(ministry);
    setShowMinistryModal(true);
  };

  const handleShowProfessionModal = () => {
    if (userMemberships.hasProfession) {
      Alert.alert('Already Added', 'You have already added your profession');
      return;
    }
    setShowProfessionModal(true);
  };

  const handleShowDepartmentModal = () => {
    if (userMemberships.hasDepartment) {
      Alert.alert('Already Joined', 'You have already joined a department');
      return;
    }
    setShowDepartmentModal(true);
  };

  const handleProfessionChange = (field, value) => {
    setProfessionData(prev => ({ ...prev, [field]: value }));
  };

  const handleDepartmentChange = (field, value) => {
    setDepartmentData(prev => ({ ...prev, [field]: value }));
  };

  const handleMinistryChange = (field, value) => {
    setMinistryData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitProfession = async () => {
    if (!professionData.name || !professionData.surname || !professionData.phone || 
        !professionData.email || !professionData.profession) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('professions')
        .insert([{
          user_id: user.id,
          first_name: professionData.name,
          last_name: professionData.surname,
          phone: professionData.phone,
          email: professionData.email,
          business_name: professionData.businessName,
          profession: professionData.profession
        }]);

      if (error) throw error;

      Alert.alert('Success', 'Your profession has been added successfully');
      setShowProfessionModal(false);
      setProfessionData({
        name: profile?.first_name || '',
        surname: profile?.last_name || '',
        phone: '',
        email: user?.email || '',
        businessName: '',
        profession: ''
      });
      await checkUserMemberships();
      fetchCounts();
    } catch (error) {
      console.error('Error submitting profession:', error);
      Alert.alert('Error', 'Failed to submit profession. Please try again.');
    }
  };

  const handleSubmitDepartment = async () => {
    if (!departmentData.gender || !departmentData.department) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('department_members')
        .insert([{
          user_id: user.id,
          gender: departmentData.gender,
          department: departmentData.department
        }]);

      if (error) throw error;

      Alert.alert('Success', 'You have joined the department successfully');
      setShowDepartmentModal(false);
      setDepartmentData({
        gender: '',
        department: ''
      });
      await checkUserMemberships();
      fetchCounts();
    } catch (error) {
      console.error('Error joining department:', error);
      Alert.alert('Error', 'Failed to join department. Please try again.');
    }
  };

  const handleSubmitMinistry = async () => {
    if (!ministryData.phone || !ministryData.address) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      let insertData = {
        user_id: user.id,
        phone: ministryData.phone,
        address: ministryData.address
      };

      if (selectedMinistry === "Men's Ministry") {
        if (!ministryData.age) {
          Alert.alert('Error', 'Please enter your age');
          return;
        }
        insertData = {
          ...insertData,
          age: parseInt(ministryData.age),
          marital_status: ministryData.maritalStatus,
          skills: ministryData.skills
        };
        await supabase.from('men_ministry').insert([insertData]);
      } 
      else if (selectedMinistry === "Women's Ministry") {
        if (!ministryData.age) {
          Alert.alert('Error', 'Please enter your age');
          return;
        }
        insertData = {
          ...insertData,
          age: parseInt(ministryData.age),
          marital_status: ministryData.maritalStatus,
          children_count: ministryData.childrenCount ? parseInt(ministryData.childrenCount) : null
        };
        await supabase.from('women_ministry').insert([insertData]);
      } 
      else if (selectedMinistry === "Youth Ministry") {
        if (!ministryData.age || !ministryData.parentContact) {
          Alert.alert('Error', 'Please enter your age and parent contact');
          return;
        }
        insertData = {
          ...insertData,
          age: parseInt(ministryData.age),
          school: ministryData.school,
          grade_level: ministryData.gradeLevel,
          parent_contact: ministryData.parentContact
        };
        await supabase.from('youth_ministry').insert([insertData]);
      }

      Alert.alert('Success', `You have joined ${selectedMinistry} successfully`);
      resetMinistryForm();
      await checkUserMemberships();
      fetchCounts();
    } catch (error) {
      console.error('Error joining ministry:', error);
      Alert.alert('Error', 'Failed to join ministry. Please try again.');
    }
  };

  const resetMinistryForm = () => {
    setShowMinistryModal(false);
    setMinistryData({
      phone: '',
      address: '',
      age: '',
      maritalStatus: '',
      skills: [],
      childrenCount: '',
      school: '',
      gradeLevel: '',
      parentContact: ''
    });
    setSelectedMinistry(null);
  };

  const renderMinistrySpecificFields = () => {
    switch (selectedMinistry) {
      case "Men's Ministry":
        return (
          <>
            <Text style={styles.inputLabel}>Age*</Text>
            <TextInput
              style={styles.input}
              placeholder="Your age"
              value={ministryData.age}
              onChangeText={(text) => setMinistryData({...ministryData, age: text})}
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Marital Status</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={ministryData.maritalStatus}
                onValueChange={(itemValue) => setMinistryData({...ministryData, maritalStatus: itemValue})}
                style={styles.picker}
              >
                <Picker.Item label="Select marital status" value="" />
                <Picker.Item label="Single" value="Single" />
                <Picker.Item label="Married" value="Married" />
                <Picker.Item label="Divorced" value="Divorced" />
                <Picker.Item label="Widowed" value="Widowed" />
              </Picker>
            </View>

            <Text style={styles.inputLabel}>Skills (comma separated)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Teaching, Music, Leadership"
              value={ministryData.skills.join(', ')}
              onChangeText={(text) => setMinistryData({...ministryData, skills: text.split(',').map(s => s.trim())})}
            />
          </>
        );
      
      case "Women's Ministry":
        return (
          <>
            <Text style={styles.inputLabel}>Age*</Text>
            <TextInput
              style={styles.input}
              placeholder="Your age"
              value={ministryData.age}
              onChangeText={(text) => setMinistryData({...ministryData, age: text})}
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Marital Status</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={ministryData.maritalStatus}
                onValueChange={(itemValue) => setMinistryData({...ministryData, maritalStatus: itemValue})}
                style={styles.picker}
              >
                <Picker.Item label="Select marital status" value="" />
                <Picker.Item label="Single" value="Single" />
                <Picker.Item label="Married" value="Married" />
                <Picker.Item label="Divorced" value="Divorced" />
                <Picker.Item label="Widowed" value="Widowed" />
              </Picker>
            </View>

            <Text style={styles.inputLabel}>Number of Children</Text>
            <TextInput
              style={styles.input}
              placeholder="Number of children"
              value={ministryData.childrenCount}
              onChangeText={(text) => setMinistryData({...ministryData, childrenCount: text})}
              keyboardType="numeric"
            />
          </>
        );
      
      case "Youth Ministry":
        return (
          <>
            <Text style={styles.inputLabel}>Age*</Text>
            <TextInput
              style={styles.input}
              placeholder="Your age"
              value={ministryData.age}
              onChangeText={(text) => setMinistryData({...ministryData, age: text})}
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>School</Text>
            <TextInput
              style={styles.input}
              placeholder="Your school"
              value={ministryData.school}
              onChangeText={(text) => setMinistryData({...ministryData, school: text})}
            />

            <Text style={styles.inputLabel}>Grade Level</Text>
            <TextInput
              style={styles.input}
              placeholder="Your grade level"
              value={ministryData.gradeLevel}
              onChangeText={(text) => setMinistryData({...ministryData, gradeLevel: text})}
            />

            <Text style={styles.inputLabel}>Parent/Guardian Contact*</Text>
            <TextInput
              style={styles.input}
              placeholder="Parent/guardian phone number"
              value={ministryData.parentContact}
              onChangeText={(text) => setMinistryData({...ministryData, parentContact: text})}
              keyboardType="phone-pad"
            />
          </>
        );
      
      default:
        return null;
    }
  };

  if (!fontsLoaded) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View entering={FadeIn.duration(500)}>
        <View style={styles.header}>
          <Text style={styles.title}>Church Connect</Text>
          <Text style={styles.subtitle}>Connect through professions and service</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: PRIMARY_COLOR }]}
          onPress={handleShowProfessionModal}
        >
          <FontAwesome name="briefcase" size={20} color="white" />
          <Text style={styles.actionButtonText}>
            {userMemberships.hasProfession ? 'Profession Added' : 'Add My Profession'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: SECONDARY_COLOR }]}
          onPress={handleShowDepartmentModal}
        >
          <Ionicons name="people" size={20} color="white" />
          <Text style={styles.actionButtonText}>
            {userMemberships.hasDepartment ? 'Department Joined' : 'Join a Department'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(300)}>
        <Text style={styles.sectionTitle}>Connect by Profession</Text>
        <View style={styles.cardsContainer}>
          <TouchableOpacity 
            style={styles.card}
            onPress={handleShowProfessionModal}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: '#f3e5f5' }]}>
                <FontAwesome name="briefcase" size={24} color={PRIMARY_COLOR} />
              </View>
              <Text style={styles.cardTitle}>Professions</Text>
            </View>
            <Text style={styles.cardDescription}>
              Connect with others in your professional field
            </Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardStats}>{counts.professionCount} professions</Text>
              {userMemberships.hasProfession ? (
                <Text style={[styles.joinButtonText, { color: PRIMARY_COLOR }]}>Joined</Text>
              ) : (
                <Ionicons name="chevron-forward" size={20} color="#9e9e9e" />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(400)}>
        <Text style={styles.sectionTitle}>Ministry Departments</Text>
        <View style={styles.cardsContainer}>
          <TouchableOpacity 
            style={styles.card}
            onPress={handleShowDepartmentModal}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: '#e0f7fa' }]}>
                <Ionicons name="people" size={24} color={SECONDARY_COLOR} />
              </View>
              <Text style={styles.cardTitle}>Departments</Text>
            </View>
            <Text style={styles.cardDescription}>
              Join a ministry team and serve the church
            </Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardStats}>{counts.departmentCount} active teams</Text>
              {userMemberships.hasDepartment ? (
                <Text style={[styles.joinButtonText, { color: SECONDARY_COLOR }]}>Joined</Text>
              ) : (
                <Ionicons name="chevron-forward" size={20} color="#9e9e9e" />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(500)}>
        <Text style={styles.sectionTitle}>Demographic Ministries</Text>
        <View style={styles.cardsContainer}>
          {/* Men's Ministry Card */}
          <TouchableOpacity 
            style={styles.card}
            onPress={() => handleJoinMinistry("Men's Ministry")}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: '#e8eaf6' }]}>
                <Entypo name="man" size={24} color={MEN_COLOR} />
              </View>
              <Text style={styles.cardTitle}>Men's Ministry</Text>
            </View>
            <Text style={styles.cardDescription}>
              Fellowship and growth for men of all ages
            </Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardStats}>{counts.mensMinistryCount} members</Text>
              <TouchableOpacity 
                style={[
                  styles.joinButton, 
                  userMemberships.hasMenMinistry && { backgroundColor: '#ccc' }
                ]}
                onPress={() => handleJoinMinistry("Men's Ministry")}
                disabled={userMemberships.hasMenMinistry}
              >
                <Text style={styles.joinButtonText}>
                  {userMemberships.hasMenMinistry ? 'Joined' : 'Join'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          {/* Women's Ministry Card */}
          <TouchableOpacity 
            style={styles.card}
            onPress={() => handleJoinMinistry("Women's Ministry")}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: '#fce4ec' }]}>
                <Ionicons name="woman" size={24} color={WOMEN_COLOR} />
              </View>
              <Text style={styles.cardTitle}>Women's Ministry</Text>
            </View>
            <Text style={styles.cardDescription}>
              Encouragement and connection for women
            </Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardStats}>{counts.womensMinistryCount} members</Text>
              <TouchableOpacity 
                style={[
                  styles.joinButton, 
                  userMemberships.hasWomenMinistry && { backgroundColor: '#ccc' }
                ]}
                onPress={() => handleJoinMinistry("Women's Ministry")}
                disabled={userMemberships.hasWomenMinistry}
              >
                <Text style={styles.joinButtonText}>
                  {userMemberships.hasWomenMinistry ? 'Joined' : 'Join'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          {/* Youth Ministry Card */}
          <TouchableOpacity 
            style={styles.card}
            onPress={() => handleJoinMinistry("Youth Ministry")}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: '#fff3e0' }]}>
                <AntDesign name="team" size={24} color={YOUTH_COLOR} />
              </View>
              <Text style={styles.cardTitle}>Youth Ministry</Text>
            </View>
            <Text style={styles.cardDescription}>
              Engaging teens in faith and community
            </Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardStats}>{counts.youthMinistryCount} members</Text>
              <TouchableOpacity 
                style={[
                  styles.joinButton, 
                  userMemberships.hasYouthMinistry && { backgroundColor: '#ccc' }
                ]}
                onPress={() => handleJoinMinistry("Youth Ministry")}
                disabled={userMemberships.hasYouthMinistry}
              >
                <Text style={styles.joinButtonText}>
                  {userMemberships.hasYouthMinistry ? 'Joined' : 'Join'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Add Profession Modal */}
      <Modal
        visible={showProfessionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProfessionModal(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Your Profession</Text>
            
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="First name"
              value={professionData.name}
              onChangeText={(text) => handleProfessionChange('name', text)}
            />

            <Text style={styles.inputLabel}>Surname</Text>
            <TextInput
              style={styles.input}
              placeholder="Surname"
              value={professionData.surname}
              onChangeText={(text) => handleProfessionChange('surname', text)}
            />

            <Text style={styles.inputLabel}>Phone Number*</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone number"
              value={professionData.phone}
              onChangeText={(text) => handleProfessionChange('phone', text)}
              keyboardType="phone-pad"
            />

            <Text style={styles.inputLabel}>Email*</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={professionData.email}
              onChangeText={(text) => handleProfessionChange('email', text)}
              keyboardType="email-address"
            />

            <Text style={styles.inputLabel}>Business Name (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Business name"
              value={professionData.businessName}
              onChangeText={(text) => handleProfessionChange('businessName', text)}
            />

            <Text style={styles.inputLabel}>Profession*</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={professionData.profession}
                onValueChange={(itemValue) => handleProfessionChange('profession', itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select your profession" value="" />
                {professionsList.map((prof, index) => (
                  <Picker.Item key={index} label={prof} value={prof} />
                ))}
              </Picker>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowProfessionModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmitProfession}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Join Department Modal */}
      <Modal
        visible={showDepartmentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDepartmentModal(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalTitle}>Join a Department</Text>
            
            <Text style={styles.userInfo}>
              Name: {profile ? `${profile.first_name} ${profile.last_name}` : 'Not available'}
            </Text>

            <Text style={styles.inputLabel}>Gender*</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={departmentData.gender}
                onValueChange={(itemValue) => handleDepartmentChange('gender', itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select your gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>

            <Text style={styles.inputLabel}>Department*</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={departmentData.department}
                onValueChange={(itemValue) => handleDepartmentChange('department', itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select a department" value="" />
                {departmentsList.map((dept, index) => (
                  <Picker.Item key={index} label={dept} value={dept} />
                ))}
              </Picker>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDepartmentModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmitDepartment}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Join Ministry Modal */}
      <Modal
        visible={showMinistryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMinistryModal(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalTitle}>Join {selectedMinistry}</Text>
            
            <Text style={styles.userInfo}>
              Name: {profile ? `${profile.first_name} ${profile.last_name}` : 'Not available'}
            </Text>

            {/* Common fields */}
            <Text style={styles.inputLabel}>Phone Number*</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone number"
              value={ministryData.phone}
              onChangeText={(text) => setMinistryData({...ministryData, phone: text})}
              keyboardType="phone-pad"
            />

            <Text style={styles.inputLabel}>Address*</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Your address"
              value={ministryData.address}
              onChangeText={(text) => setMinistryData({...ministryData, address: text})}
              multiline
            />

            {/* Ministry-specific fields */}
            {renderMinistrySpecificFields()}

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowMinistryModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmitMinistry}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    marginTop: 30
  },
  title: {
    fontSize: 28,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#757575',
  },
  sectionTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18,
    color: '#333',
    marginTop: 24,
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: 'white',
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18,
    color: '#333',
  },
  cardDescription: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardStats: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#9e9e9e',
  },
  joinButton: {
    backgroundColor: SECONDARY_COLOR,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  joinButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 20,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontFamily: 'Montserrat_400Regular',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
  },
  userInfo: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    color: '#757575',
  },
  submitButton: {
    backgroundColor: PRIMARY_COLOR,
  },
  submitButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    color: 'white',
  },
});