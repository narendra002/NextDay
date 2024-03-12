// import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
  Alert,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useNavigation} from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;

const UserItem = ({user, isFavorite, onPress}) => (
  <TouchableOpacity onPress={onPress} style={styles.itemContainer}>
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Image source={{uri: user.avatar}} style={styles.avatar} />
      <View>
        <Text style={styles.userName}>
          {user.first_name} {user.last_name}
        </Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
    </View>
    <Image
      source={{
        uri: isFavorite
          ? 'https://img.icons8.com/material/48/filled-like--v1.png'
          : 'https://img.icons8.com/material-outlined/48/filled-like.png',
      }}
      style={styles.icon}
    />
  </TouchableOpacity>
);

const AppScreen = ({navigation}) => {
  const [users, setUsers] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
    loadFavorites();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://reqres.in/api/users?page=2');
      const json = await response.json();
      setUsers(json.data);
    } catch (error) {
      console.error('Error fetching data: ', error);
      Alert.alert(
        'Error',
        'Failed to Fetch Data . Would you like to try again?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Try Again',
            onPress: () => {
              fetchData(); // Retry loading favorites
            },
          },
        ],
        {cancelable: false},
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const favoritesString = await AsyncStorage.getItem('favorites');
      if (favoritesString) {
        const favoritesArray = JSON.parse(favoritesString);
        setFavorites(favoritesArray);
      }
    } catch (error) {
      console.error('Error loading favorites: ', error);
      Alert.alert(
        'Error',
        'Failed to load favorites. Would you like to try again?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Try Again',
            onPress: () => {
              setIsLoading(false);
              loadFavorites(); // Retry fetching data
            },
          },
        ],
        {cancelable: false},
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async item => {
    let updatedFavorites;
    const isItemInFavorites = favorites.some(
      favorite => favorite.id === item.id,
    );

    if (isItemInFavorites) {
      // Remove the item from favorites
      updatedFavorites = favorites.filter(favorite => favorite.id !== item.id);
    } else {
      // Add the item to favorites
      updatedFavorites = [...favorites, item];
    }

    setFavorites(updatedFavorites);
    try {
      console.log(updatedFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error saving favorites: ', error);
    }
  };

  const renderItem = ({item}) => {
    const isFavorite = favorites.some(favorite => favorite.id === item.id);
    return (
      <UserItem
        user={item}
        isFavorite={isFavorite}
        onPress={() => toggleFavorite(item)}
      />
    );
  };

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  }
  // if (users.length === 0) {
  //   return (
  //     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
  //       <Text>No User Available</Text>
  //     </View>
  //   );
  // }
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.header}>Users</Text>
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      </View>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => navigation.navigate('FavoriteUsers')}>
        <Text>View Favorite Users</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: '#F5F5F5',
    justifyContent: 'space-between', // Distribute children vertically
  },
  header: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  favoriteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: 'lightblue',
    color: '#fff',
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
    marginRight: 15,
  },
  icon: {
    width: 25,
    height: 25,
    marginLeft: 'auto',
    tintColor: '#707070',
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

export default AppScreen;
