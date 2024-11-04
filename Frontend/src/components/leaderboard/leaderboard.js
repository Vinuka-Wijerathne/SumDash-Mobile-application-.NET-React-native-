import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import TopBar from '../topbar/topbar'; // Ensure TopBar is imported
import Footer from '../footer/footer'; // Ensure Footer is imported
import { useTheme } from '../../../ThemeContext'; // Ensure ThemeContext is imported

const leaderboardData = [
  { id: '1', name: 'BananaMaster', rank: 'Rank 1', score: 3000, avatar: 'https://via.placeholder.com/50' },
  { id: '2', name: 'PineappleKing', rank: 'Rank 2', score: 2900, avatar: 'https://via.placeholder.com/50' },
  { id: '3', name: 'StrawberryQueen', rank: 'Rank 3', score: 2800, avatar: 'https://via.placeholder.com/50' },
  { id: '4', name: 'AppleLord', rank: 'Rank 4', score: 2700, avatar: 'https://via.placeholder.com/50' },
  { id: '5', name: 'CoconutKing', rank: 'Rank 5', score: 2600, avatar: 'https://via.placeholder.com/50' },
];

const LeaderboardPage = () => {
  const { isDarkMode } = useTheme(); // Get the dark mode status

  const renderLeaderboardItem = ({ item }) => (
    <View style={[styles.leaderboardItem, isDarkMode && styles.darkLeaderboardItem]}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={[styles.username, isDarkMode && styles.darkUsername]}>{item.name}</Text>
        <Text style={[styles.rank, isDarkMode && styles.darkRank]}>{item.rank}</Text>
      </View>
      <Text style={[styles.score, isDarkMode && styles.darkScore]}>{item.score}</Text>
    </View>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Top Bar */}
      <TopBar title="Leaderboard" />

      {/* Filter Dropdowns */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Global ▼</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Friends ▼</Text>
        </TouchableOpacity>
      </View>

      {/* Leaderboard List */}
      <FlatList
        data={leaderboardData}
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
    marginTop:10,
    backgroundColor: '#222222',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
  },
  filterButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 5,
  },
  filterText: {
    color: '#333',
    fontSize: 14,
  },
  listContainer: {
    marginTop:20,
    
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
