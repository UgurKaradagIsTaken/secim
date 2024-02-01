import * as React from "react";
import {
  StyleSheet,
  View,
  Button,
  SafeAreaView,
  Text,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import MlkitOcr, { MlkitOcrResult } from "react-native-mlkit-ocr";

export default function App() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<MlkitOcrResult | undefined>();
  const [image, setImage] = React.useState<
    ImagePicker.ImagePickerAsset | undefined
  >();
  const [title, setTitle] = React.useState<string | undefined>();
  const [boxNumber, setBoxNumber] = React.useState<string | undefined>();

  React.useEffect(() => {
    if (result?.length) {
      const titleIndex = result.findIndex((item) =>
        item?.text?.includes("SONUÇ TUTANAĞI")
      );
      const title = result[titleIndex]?.text;
      let boxNumber = "";
      let boxNumberIndex = null;

      switch (title) {
        case "BELEDİYE BAŞKANI SEÇİMİ SANDIK SONUÇ TUTANAĞI":
          boxNumberIndex = 24;
          break;
        case "iL GENEL MECLİS ÜYELİĞİ SEÇİMİ SANDIK SONUÇ TUTANAĞI":
          boxNumberIndex = 31;
          break;
        case "BELEDİYE MECLİSİ ÜYELİĞİ SEÇİMİ SANDIK SONUÇ TUTANAĞI":
          boxNumberIndex = 31;
          break;
        case "BÜYÜKŞEHİR BELEDİYE BAŞKANI SEÇIMİ SANDIK SONUÇ TUTANAĞI":
          boxNumberIndex = 16;
          break;

        default:
          break;
      }

      if (boxNumberIndex > 0) {
        boxNumber = result[boxNumberIndex]?.text;
        if (boxNumber?.includes(" : "))
          boxNumber = boxNumber
            ?.split(" : ")[1]
            ?.split(" ")[0]
            ?.replace("\n-", "");
      }

      setTitle(title);
      setBoxNumber(boxNumber);
    }
  }, [result]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      {!!result?.length && (
        <View
          style={{
            flex: 1,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Tutanak Tipi
          </Text>
          <Text
            style={{
              marginBottom: 20,
              marginTop: 5,
              fontSize: 12,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Sandık No
          </Text>
          <Text
            style={{
              marginTop: 5,
              marginBottom: 10,
              fontSize: 12,
            }}
          >
            {boxNumber}
          </Text>
        </View>
      )}

      <Button
        onPress={() => {
          setLoading(true);
          launchGallery(setResult, setImage, setLoading);
        }}
        title="Start"
      />
    </SafeAreaView>
  );
}

async function launchGallery(
  setResult: (result: MlkitOcrResult) => void,
  setImage: (result: ImagePicker.ImagePickerAsset) => void,
  setLoading: (value: boolean) => void
) {
  let result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: false,
    quality: 1,
  });

  if (!result.canceled) {
  } else {
    alert("You did not select any image.");
    setLoading(false);
  }

  if (!result.assets?.[0].uri) {
    throw new Error("resim alınamadı!");
  }
  try {
    setImage(result.assets[0]);
    setResult(await MlkitOcr.detectFromUri(result.assets[0].uri));
  } catch (e) {
    console.error(e);
  } finally {
    setLoading(false);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 2,
  },
});
