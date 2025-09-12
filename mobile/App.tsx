import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import MainScreen from './src/screens/MainScreen';
import OrderListScreen from './src/screens/OrderListScreen';
import SlipListScreen from './src/screens/SlipListScreen';
import OrderDetailScreen from './src/screens/OrderDetailScreen';
import SlipDetailScreen from './src/screens/SlipDetailScreen';
import TicketScreen from './src/screens/TicketScreen';

// Types
export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  OrderList: undefined;
  SlipList: undefined;
  OrderDetail: { shipmentNo: string; data: any };
  SlipDetail: { shipmentNo: string; data: any };
  Ticket: { shipmentNo: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const theme = {
  colors: {
    primary: '#667eea',
    accent: '#764ba2',
    background: '#f8f9fa',
    surface: '#ffffff',
    text: '#333333',
    disabled: '#6c757d',
    placeholder: '#6c757d',
    backdrop: 'rgba(0,0,0,0.5)',
    onSurface: '#333333',
    notification: '#667eea',
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <StatusBar style="light" backgroundColor="#667eea" />
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#667eea',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Main" 
              component={MainScreen} 
              options={{ 
                title: '🚛 탱크로리 출하시스템',
                headerLeft: () => null,
                gestureEnabled: false
              }}
            />
            <Stack.Screen 
              name="OrderList" 
              component={OrderListScreen} 
              options={{ title: '📋 출하예고 조회' }}
            />
            <Stack.Screen 
              name="SlipList" 
              component={SlipListScreen} 
              options={{ title: '📊 출하실적 조회' }}
            />
            <Stack.Screen 
              name="OrderDetail" 
              component={OrderDetailScreen} 
              options={{ title: '📄 출하예고 상세' }}
            />
            <Stack.Screen 
              name="SlipDetail" 
              component={SlipDetailScreen} 
              options={{ title: '📄 출하실적 상세' }}
            />
            <Stack.Screen 
              name="Ticket" 
              component={TicketScreen} 
              options={{ title: '🎫 출하전표' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}