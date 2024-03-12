import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoriteUsersScreen = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favoritesString = await AsyncStorage.getItem('favorites');
      if (favoritesString) {
        const favoritesArray = JSON.parse(favoritesString);

        setFavorites(favoritesArray);
      }
    } catch (error) {
      console.error('Error loading favorites: ', error);
    }
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.itemContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={{uri: item.avatar}} style={styles.avatar} />
          <View style={{flexDirection: 'column', marginLeft: 10}}>
            <Text style={styles.userName}>
              {item.first_name} {item.last_name}
            </Text>
            <Text style={styles.email}>{item.email}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Favorite Users</Text> */}
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: '#F5F5F5',
  },
  header: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  email: {
    fontSize: 14,
    color: '#666666',
  },
});

export default FavoriteUsersScreen;
