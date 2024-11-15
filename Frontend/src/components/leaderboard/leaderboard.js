import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import TopBar from '../topbar/topbar'; // Ensure TopBar is imported
import Footer from '../footer/footer'; // Ensure Footer is imported
import { useTheme } from '../../../ThemeContext'; // Ensure ThemeContext is imported
import defaultProfileImage from '../../../assets/Profile.png';  // Adjust the path to your asset folder

const LeaderboardPage = () => {
  const { isDarkMode, fontStyle } = useTheme();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('yellow'); // Default to 'yellow' league
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch users data from backend
    axios
      .get('http://192.168.164.70:5000/api/User/all')
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);
  
  useEffect(() => {
    // Filter by default league ('yellow') when users are updated
    if (users.length > 0) {
      filterByLeague('yellow');
    }
  }, [users]);
  

  const filterByLeague = (league) => {
    setSelectedLeague(league);

    let filtered;
    if (league === 'yellow') {
      filtered = users.filter(user => user.yellowPoints > 0);
      filtered.sort((a, b) => b.yellowPoints - a.yellowPoints);
    } else if (league === 'silver') {
      filtered = users.filter(user => user.silverPoints > 0);
      filtered.sort((a, b) => b.silverPoints - a.silverPoints);
    } else if (league === 'gold') {
      filtered = users.filter(user => user.goldPoints > 0);
      filtered.sort((a, b) => b.goldPoints - a.goldPoints);
    } else {
      filtered = users;
      filtered.sort((a, b) => {
        const maxPointsA = Math.max(a.yellowPoints, a.silverPoints, a.goldPoints);
        const maxPointsB = Math.max(b.yellowPoints, b.silverPoints, b.goldPoints);
        return maxPointsB - maxPointsA;
      });
    }

    setFilteredUsers(filtered);
  };

  const isActiveFilter = (league) => selectedLeague === league;

  const renderLeaderboardItem = ({ item }) => {
    let points = 0;
    let leagueName = '';

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

    const profileImageUrl = item.profilePictureUrl || defaultProfileImage;

    return (
      <View style={[styles.leaderboardItem, isDarkMode && styles.darkLeaderboardItem]}>
        <Image source={{ uri: profileImageUrl }} style={styles.avatar} />
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

  if (loading) {
    return (
      <View style={[styles.container, isDarkMode && styles.darkContainer, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#ffff00" />
        <Text style={[styles.loadingText, isDarkMode && styles.darkLoadingText]}>Loading Leaderboard...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <TopBar title="Leaderboard" />
      <View style={[styles.filterContainer, isDarkMode && styles.darkFilterContainer]}>
        {['yellow', 'silver', 'gold'].map((league) => (
          <TouchableOpacity
            key={league}
            style={[
              styles.filterButton,
              isDarkMode && styles.darkFilterButton,
              isActiveFilter(league) && styles.activeFilterButton,
            ]}
            onPress={() => filterByLeague(league)}
          >
            <Text
              style={[
                styles.filterText,
                isDarkMode && styles.darkFilterText,
                isActiveFilter(league) && styles.activeFilterText,
                fontStyle && { fontFamily: fontStyle },
              ]}
            >
              {league.charAt(0).toUpperCase() + league.slice(1)} ▼
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredUsers}
        renderItem={renderLeaderboardItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
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
    marginTop: 120,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
  },
  darkFilterContainer: {
    backgroundColor: '#333333',
  },
  filterButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 5,
  },
  darkFilterButton: {
    backgroundColor: '#555555',
  },
  activeFilterButton: {
    backgroundColor: '#ffff00',
  },
  filterText: {
    color: '#333',
    fontSize: 14,
  },
  darkFilterText: {
    color: '#fff',
  },
  activeFilterText: {
    fontWeight: 'bold',
    color: '#333',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  darkLoadingText: {
    color: '#fff',
  },
});

export default LeaderboardPage;
