import { Pressable, Text, View } from 'react-native';

import { noticeBannerStyles as styles } from './NoticeBanner.styles';

type NoticeBannerProps = {
  message: string;
  dismissLabel?: string;
  onDismiss?: () => void;
};

export function NoticeBanner({ message, dismissLabel = 'Dismiss', onDismiss }: NoticeBannerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      {onDismiss ? (
        <Pressable onPress={onDismiss} style={styles.dismissButton}>
          <Text style={styles.dismissText}>{dismissLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
