import OneSignal from 'react-native-onesignal';

export function tagUserEmailCreate(name: string, email: string) {
  OneSignal.sendTags({
    'user_email': email,
    'user_name': name
  });
}

export function tagCartUpdate(exerciseCount: string) {
  OneSignal.sendTag('exercise_count', exerciseCount);
}
