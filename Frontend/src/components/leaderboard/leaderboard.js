import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import TopBar from '../topbar/topbar'; // Ensure TopBar is imported
import Footer from '../footer/footer'; // Ensure Footer is imported
import { useTheme } from '../../../ThemeContext'; // Ensure ThemeContext is imported
import defaultProfileImage from '../../../assets/Profile.png';  // Adjust the path to your asset folder

const LeaderboardPage = () => {
  const { isDarkMode, fontStyle } = useTheme(); // Retrieve both isDarkMode and fontStyle from the theme context
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('yellow'); // Default to 'yellow' league

  useEffect(() => {
    // Fetch users data from backend
    axios.get('http://192.168.164.70:5000/api/User/all')
      .then(response => {
        console.log('Users Data:', response.data);
        setUsers(response.data);
        setFilteredUsers(response.data.filter(user => user.yellowPoints > 0)); // Filter by yellow league by default
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const filterByLeague = (league) => {
    setSelectedLeague(league);
    let filtered;
    if (league === 'yellow') {
      filtered = users.filter(user => user.yellowPoints > 0);
    } else if (league === 'silver') {
      filtered = users.filter(user => user.silverPoints > 0);
    } else if (league === 'gold') {
      filtered = users.filter(user => user.goldPoints > 0);
    } else {
      filtered = users; // Show all users if 'all' is selected
    }
    setFilteredUsers(filtered);
  };

  const renderLeaderboardItem = ({ item }) => {
    let points = 0; // Default to 0 points
    let leagueName = '';

    // Determine which points to show based on the selected league
    if (selectedLeague === 'yellow') {
      points = item.yellowPoints;
      leagueName = 'Yellow Rank';
    } else if (selectedLeague === 'silver') {
      points = item.silverPoints;
      leagueName = 'Silver Rank';
    } else if (selectedLeague === 'gold') {
      points = item.goldPoints;
      leagueName = 'Gold Rank';
    }

    return (
      <View style={[styles.leaderboardItem, isDarkMode && styles.darkLeaderboardItem]}>
        <Image
          source={item.profilePictureUrl ? { uri: item.profilePictureUrl } : defaultProfileImage}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={[styles.username, isDarkMode && styles.darkUsername, fontStyle && { fontFamily: fontStyle }]}>
            {item.username}
          </Text>
          <Text style={[styles.rank, isDarkMode && styles.darkRank, fontStyle && { fontFamily: fontStyle }]}>
            {leagueName}
          </Text>
        </View>
        <Text style={[styles.score, isDarkMode && styles.darkScore, fontStyle && { fontFamily: fontStyle }]}>
          {points}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Top Bar */}
      <TopBar title="Leaderboard" />

      {/* Filter Dropdowns */}
      <View style={[styles.filterContainer, isDarkMode && styles.darkFilterContainer]}>
        <TouchableOpacity style={[styles.filterButton, isDarkMode && styles.darkFilterButton]} onPress={() => filterByLeague('yellow')}>
          <Text style={[styles.filterText, isDarkMode && styles.darkFilterText, fontStyle && { fontFamily: fontStyle }]}>Yellow ▼</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, isDarkMode && styles.darkFilterButton]} onPress={() => filterByLeague('silver')}>
          <Text style={[styles.filterText, isDarkMode && styles.darkFilterText, fontStyle && { fontFamily: fontStyle }]}>Silver ▼</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, isDarkMode && styles.darkFilterButton]} onPress={() => filterByLeague('gold')}>
          <Text style={[styles.filterText, isDarkMode && styles.darkFilterText, fontStyle && { fontFamily: fontStyle }]}>Gold ▼</Text>
        </TouchableOpacity>
      </View>

      {/* Leaderboard List */}
      <FlatList
        data={filteredUsers}
        renderItem={renderLeaderboardItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      {/* Footer */}
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  darkContainer: {
    backgroundColor: '#222222',
  },
  filterContainer: {
    marginTop: 120, // Ensure it's not hidden behind the TopBar
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#f9f9f9', // Light mode background
  },
  darkFilterContainer: {
    backgroundColor: '#333333', // Dark mode background
  },
  filterButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 5,
  },
  darkFilterButton: {
    backgroundColor: '#555555', // Dark mode button background
  },
  filterText: {
    color: '#333',
    fontSize: 14,
  },
  darkFilterText: {
    color: '#fff', // Text color in dark mode should be white
  },
  listContainer: {
    marginTop: 20,
    paddingVertical: 10,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  darkLeaderboardItem: {
    borderBottomColor: '#444444',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  darkUsername: {
    color: '#ffff00',
  },
  rank: {
    fontSize: 12,
    color: '#666',
  },
  darkRank: {
    color: '#bbbb00',
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  darkScore: {
    color: '#ffff00',
  },
});

export default LeaderboardPage;
