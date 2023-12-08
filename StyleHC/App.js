import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview'; // WebView 임포트

export default function App() {
  return (
    <View style={styles.container}>
      {/* WebView 컴포넌트 추가 */}
      <WebView 
        source={{ uri: 'https://stylehc.ngrok.io/main.html' }} 
        style={{ width: '100%', height: '100%' }} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems와 justifyContent 제거
  },
});
