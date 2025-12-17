import React from 'react';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import Navigator from './src/navigator/Navigator';

const App = () => {
  return (
    <AuthProvider>
      <StatusBar backgroundColor="#2D7A4F" barStyle="light-content" />
      <Navigator />
    </AuthProvider>
  );
};

export default App;
