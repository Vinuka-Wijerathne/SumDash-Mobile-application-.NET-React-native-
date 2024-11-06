import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Footer from '../footer/footer';
import { useTheme } from '../../../ThemeContext';

const ProfilePage = () => {
  const { isDarkMode } = useTheme();

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Profile Image */}
      <Image
        source={require('../../../assets/Profile.png')} // Ensure this is the path to your default profile PNG
        style={styles.profileImage}
      />

      {/* Username and Joined Date */}
      <Text style={[styles.username, isDarkMode && styles.darkUsername]}>SumDash</Text>
      <Text style={[styles.joinedDate, isDarkMode && styles.darkJoinedDate]}>Joined in 2020</Text>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Bananas</Text>
          <Text style={styles.statValue}>2,000</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Sums Completed</Text>
          <Text style={styles.statValue}>1,234</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Total Score</Text>
          <Text style={styles.statValue}>9,999</Text>
        </View>
      </View>

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    paddingVertical: 20,
  },
  darkContainer: {
    backgroundColor: '#222222',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  darkUsername: {
    color: '#ffff00',
  },
  joinedDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  darkJoinedDate: {
    color: '#bbbb00',
  },
  statsContainer: {
    width: '90%',
    alignItems: 'center', // Centers the stats vertically
  },
  statBox: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%', // Full width of the container
    alignItems: 'center', // Center text within each box
  },
  statTitle: {
    fontSize: 16,
    color: '#333',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ProfilePage;
