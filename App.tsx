import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HafeziQuran from './screens/HafeziQuran';
import Maqam from './screens/Maqam';
import { StatusBar } from 'expo-status-bar';
import RealmCustomProvider from './providers/Realm';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <RealmCustomProvider>
      <NavigationContainer>
        <Drawer.Navigator screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {
            elevation: 0
          },
          drawerActiveBackgroundColor: '#f0f0f0',
          drawerActiveTintColor: '#000',
        }} initialRouteName="hafezi">
          <Drawer.Screen name="hafezi" options={{
            title: 'ال قوران',
            headerTitleStyle: {
              fontWeight: 'bold'
            },
            drawerLabel: 'ال قوران',
            drawerLabelStyle: {
              fontWeight: 'bold',
              fontSize: 20,
            }
          }} component={HafeziQuran} />
          <Drawer.Screen name="maqam" options={{
            title: 'ماقآم',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            drawerLabel: 'ماقآم',
            drawerLabelStyle: {
              fontWeight: 'bold',
              fontSize: 20,
            }
          }} component={Maqam} />
        </Drawer.Navigator>
        <StatusBar
          backgroundColor='white'
          style='dark'
        />
      </NavigationContainer>
    </RealmCustomProvider>
  );
}