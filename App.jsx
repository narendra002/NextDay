import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import AppScreen from './AppScreen';
import FavoriteUsersScreen from './FavoriteScreen';
import {NavigationContainer} from '@react-navigation/native';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={AppScreen}
          options={{headerShown: true}}
        />
        <Stack.Screen name="FavoriteUsers" component={FavoriteUsersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
