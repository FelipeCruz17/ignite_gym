import { useTheme, Box } from 'native-base';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useAuth } from '@hooks/useAuth';
import { AuthRoutes } from './auth.routes';
import { AppRoutes } from './app.routes';
import { Loading } from '@components/Loading';


const linking = {
  prefixes: ['com.rocketseat.ignitegymapp://', 'exp+ignitegymapp://'],
  config: {
    screens: {
      home: {
        path: 'home',
      }
    }
  }
};

export function Routes() {
  const { colors } = useTheme();
  const { user, isLoadingUserStorageData } = useAuth();

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

  if (isLoadingUserStorageData) {
    return <Loading />;
  }

  // useEffect(() => {
  //   const unsubscribe = OneSignal.setNotificationWillShowInForegroundHandler((notificationReceivedEvent: NotificationReceivedEvent) => {
  //     const response = notificationReceivedEvent.getNotification();

  //     setNotification(response);
  //   });


  //   return () => unsubscribe;
  // }, [notification]);

  return (
    <Box flex={1} bg='gray.700'>
      <NavigationContainer theme={theme} linking={linking}>
        {user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
}
