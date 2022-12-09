import { useAuth } from '@hooks/useAuth';
import { TouchableOpacity } from 'react-native';
import { Heading, HStack, VStack, Text, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { UserAvatar } from './UserAvatar';
import { api } from '@services/api';

import defaultUserAvatar from '../assets/userPhotoDefault.png';

export function HomeHeader() {
  const { user, signOut } = useAuth();

  return (
    <HStack bg='gray.600' pt={16} pb={5} px={8} alignItems='center'>

      <UserAvatar
        size={16}
        mr={4}
        source={user.avatar
          ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}`}
          : defaultUserAvatar}
        alt={user.name}
      />

      <VStack flex={1}>
        <Text color='gray.100' fontSize='md'>
        Olá
        </Text>

        <Heading color='gray.100' fontSize='md' fontFamily='heading'>
          {user.name}
        </Heading>
      </VStack>

      <TouchableOpacity onPress={signOut}>
        <Icon
          as={MaterialIcons}
          name='logout'
          color='gray.200'
          size={7}
        />
      </TouchableOpacity>

    </HStack>
  );
}
