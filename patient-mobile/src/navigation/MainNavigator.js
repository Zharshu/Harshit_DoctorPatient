import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import DoctorsScreen from '../screens/DoctorsScreen';
import BookAppointmentScreen from '../screens/BookAppointmentScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import PrescriptionsScreen from '../screens/PrescriptionsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2c3e50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Clinix Sphere' }}
      />
      <Stack.Screen 
        name="Doctors" 
        component={DoctorsScreen} 
        options={{ title: 'Available Doctors' }}
      />
      <Stack.Screen 
        name="BookAppointment" 
        component={BookAppointmentScreen} 
        options={{ title: 'Book Appointment' }}
      />
      <Stack.Screen 
        name="Appointments" 
        component={AppointmentsScreen} 
        options={{ title: 'My Appointments' }}
      />
      <Stack.Screen 
        name="Prescriptions" 
        component={PrescriptionsScreen} 
        options={{ title: 'My Prescriptions' }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
