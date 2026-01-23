import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/app/core/store';
import { LoginScreen } from './src/app/modules/authentication/screens/LoginScreen';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <LoginScreen />
    </Provider>
  );
};

export default App;