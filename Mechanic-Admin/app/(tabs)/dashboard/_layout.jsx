import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const DashboardLayout = () => {
  return (
    <SafeAreaView className="flex-1">
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
};

export default DashboardLayout;
