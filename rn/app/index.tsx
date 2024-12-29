import WebView from "react-native-webview";

export default function Index() {
  return (
    <WebView
      source={{
        // uri: "http://localhost:5173/",
        uri: "https://alpha-sangcheol.s3.ap-northeast-2.amazonaws.com/index.html",
      }}
      style={{ flex: 1 }}
    />
  );
}
