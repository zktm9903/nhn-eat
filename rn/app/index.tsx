import WebView from "react-native-webview";

export default function Index() {
  return (
    <WebView
      source={{
        uri: "https://nm-eat.sangcheol.site/",
      }}
      style={{ flex: 1 }}
    />
  );
}
