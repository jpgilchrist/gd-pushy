import { usePush } from "@/hooks/use-push";
import GalaxiesModule from "@/modules/galaxies";
import {
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  EventSubscription,
} from "expo-notifications";
import { Link, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const { registerForPushNotificationsAsync } = usePush();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  const notificationListener = useRef<EventSubscription | null>(null);
  const responseListener = useRef<EventSubscription | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        console.log("Token:", token);
        setExpoPushToken(token ?? null);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    notificationListener.current = addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
      }
    );

    responseListener.current = addNotificationResponseReceivedListener(
      (response) => {
        console.log("Notification response received:", response);
        if (response.notification.request.content.data?.id) {
          router.push(`/${response.notification.request.content.data.id}`);
        }
      }
    );

    // cleanup listeners on unmount
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [registerForPushNotificationsAsync, router]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Text>{JSON.stringify(GalaxiesModule.getDeviceInfo())}</Text>
      <Text>{expoPushToken}</Text>
      <Link href="/42">
        <Text>Go to 42</Text>
      </Link>
    </View>
  );
}
