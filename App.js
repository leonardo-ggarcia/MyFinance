import * as React from 'react';
import MainScreen from './components/MainScreen';
import SettingCards from './components/SettingCards';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DataReducer, DataContext} from './DATA'

import {
  Text,
  View,
  SafeAreaView,
  StyleSheet 
} from 'react-native';


import { 
  Card
} from 'react-native-paper';

const Stack = createNativeStackNavigator();


export default function App() {

  const {cards, dispatch} = DataReducer();

  return (
    <DataContext.Provider value={{cards, dispatch}}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Main" component={MainScreen}  options={{ headerShown:false }}/>  
          <Stack.Screen name="SettingCards" component={SettingCards}  options={{ title:'Configuração' }}/>          
        </Stack.Navigator>
      </NavigationContainer> 
    </DataContext.Provider>
  );
}
