import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import imageStore from "../store/imageStore";

const Camera = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const [preview, setPreview] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const cameraRef = useRef(null);

  // Permission loading
  if (!permission) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator color="white" />
      </View>
    );
  }

  // Permission denied
  if (!permission.granted) {
    return (
      <View className="flex-1 bg-black items-center justify-center px-8 gap-5">
        <Feather name="camera-off" size={48} color="#ffffff60" />
        <Text className="text-white text-center text-base">
          Camera access is needed to add product images.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-white px-6 py-3 rounded-2xl"
        >
          <Text className="text-black font-semibold">Allow camera</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-white/40 text-sm">Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current || capturing) return;
    try {
      setCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        skipProcessing: false,
      });
      setPreview(photo.uri);
    } catch (e) {
      console.error("Capture failed:", e);
    } finally {
      setCapturing(false);
    }
  };

  const confirmPhoto = () => {
    imageStore.add(preview); // push URI to store
    router.back(); // then navigate back
  };

  const retake = () => setPreview(null);

  // Preview screen after capture
  if (preview) {
    return (
      <View className="flex-1 bg-black">
        <Image
          source={{ uri: preview }}
          style={{ flex: 1 }}
          contentFit="cover"
        />
        {/* Dark overlay at bottom */}
        <View
          className="absolute bottom-0 left-0 right-0 pb-12 px-8 flex-row gap-4 items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
        >
          <TouchableOpacity
            onPress={retake}
            className="flex-1 bg-white/20 py-4 rounded-2xl items-center"
          >
            <Text className="text-white font-semibold text-base">Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={confirmPhoto}
            className="flex-1 bg-white py-4 rounded-2xl items-center"
          >
            <Text className="text-black font-semibold text-base">
              Use photo
            </Text>
          </TouchableOpacity>
        </View>
        {/* Close */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-14 left-5 bg-black/40 p-2.5 rounded-full"
        >
          <Feather name="x" size={20} color="white" />
        </TouchableOpacity>
      </View>
    );
  }

  // Live camera
  return (
    <View className="flex-1 bg-black">
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing}>
        {/* Top bar */}
        <View className="absolute top-14 left-0 right-0 flex-row justify-between px-5">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-black/40 p-2.5 rounded-full"
          >
            <Feather name="x" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFacing((f) => (f === "back" ? "front" : "back"))}
            className="bg-black/40 p-2.5 rounded-full"
          >
            <Feather name="refresh-ccw" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Shutter */}
        <View className="absolute bottom-14 left-0 right-0 items-center">
          <TouchableOpacity
            onPress={takePicture}
            disabled={capturing}
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: capturing ? "#ffffff80" : "#fff",
              borderWidth: 4,
              borderColor: "rgba(255,255,255,0.4)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {capturing && <ActivityIndicator color="#000" />}
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

export default Camera;
