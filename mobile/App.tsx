import OneSignal from 'react-native-onesignal';

import { StatusBar } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

import { THEME } from './src/theme';

import { AuthContextProvider } from './src/contexts/AuthContext';

import { Loading } from '@components/Loading';
import { Routes } from '@routes/index';


OneSignal.setAppId(`${process.env.ONESIGNAL_APP_ID}`);
OneSignal.promptForPushNotificationsWithUserResponse();

export default function App() {

  const [isFontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold
  });

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle='light-content'
        backgroundColor='transparent'
        translucent
      />
      <AuthContextProvider>
        {isFontsLoaded ? <Routes /> : <Loading />}

      </AuthContextProvider>
    </NativeBaseProvider>
  );
}
