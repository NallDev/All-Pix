import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "@/api/authApi";
import { setToken, setMessage } from "@/redux/slices/authSlice";
import { saveToken } from "@/utils/storage";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [login] = useLoginMutation();
  const [toastVisible, setToastVisible] = useState(false);
  const toastOpacity = useState(new Animated.Value(0))[0];
  const buttonScale = useState(new Animated.Value(1))[0];

  const handleLogin = async () => {
    setLoading(true);
    setToastVisible(false);

    // Shrink button animation
    Animated.timing(buttonScale, {
      toValue: 0.9,
      duration: 150,
      useNativeDriver: true,
    }).start();

    try {
      const response = await login({ username, password }).unwrap();
      dispatch(setMessage(response.message));

      if (response.token) {
        dispatch(setToken(response.token));
        await saveToken(response.token);
        navigation.reset({ routes: [{ name: "Home" }] });
      } else {
        showCustomToast();
      }
    } catch (error) {
      showCustomToast();
    } finally {
      setLoading(false);
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  };

  const showCustomToast = () => {
    // Fade in the toast
    setToastVisible(true);
    Animated.timing(toastOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        // Fade out the toast after 2 seconds
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => setToastVisible(false));
      }, 2000);
    });
  };

  return (
    <ImageBackground
      source={{
        uri: "https://cdn.pixabay.com/photo/2019/02/27/19/54/city-4024886_960_720.png",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back!</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Animated.View
          style={[
            styles.buttonContainer,
            { transform: [{ scale: buttonScale }] },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.button,
              !username || !password ? styles.buttonDisabled : {},
            ]}
            onPress={handleLogin}
            disabled={!username || !password || loading}
          >
            {loading ? (
              <View style={styles.spinnerOverlay}>
                <ActivityIndicator size="small" color="#fff" />
              </View>
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
      {toastVisible && (
        <Animated.View
          style={[styles.toastContainer, { opacity: toastOpacity }]}
        >
          <Text style={styles.toastText}>
            Username or password is incorrect
          </Text>
        </Animated.View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  title: {
    fontSize: 28,
    color: "#333",
    marginBottom: 20,
    fontWeight: "600",
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f5f5f5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  buttonContainer: {
    width: "100%",
    height: 50,
    marginTop: 10,
    borderRadius: 8,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: "#4a90e2",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4a90e2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  buttonDisabled: {
    backgroundColor: "#b0c4de",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  spinnerOverlay: {
    alignItems: "center",
    justifyContent: "center",
  },
  toastContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    padding: 15,
    backgroundColor: "#ff4444",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    zIndex: 1,
  },
  toastText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default LoginScreen;
