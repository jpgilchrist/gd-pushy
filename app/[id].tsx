import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function NotificationScreen() {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>Notification: {id}</Text>
    </View>
  );
}
