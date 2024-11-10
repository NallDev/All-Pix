import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "@/api/authApi";
import { setToken, setMessage } from "@/redux/slices/authSlice";
import { saveToken } from "@/utils/storage";
import Toast from "@/components/Toast";
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
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [login] = useLoginMutation();

  const handleLogin = async () => {
    setLoading(true); // Show loading indicator
    setShowToast(false); // Hide toast before login attempt

    try {
      const response = await login({ username, password }).unwrap();
      dispatch(setMessage(response.message));

      if (response.token) {
        dispatch(setToken(response.token));
        await saveToken(response.token);
        navigation.reset({ routes: [{ name: "Home" }] });
      } else {
        showTemporaryToast(); // Show toast if login fails
      }
    } catch (error) {
      showTemporaryToast(); // Show toast on any error
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Function to show toast temporarily
  const showTemporaryToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500); // Hide toast after 1.5 seconds
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Username"
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      {loading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <Button
          title="Login"
          onPress={handleLogin}
          disabled={!username || !password} // Disable button if fields are empty
        />
      )}

      <Toast message="Username or password is wrong" visible={showToast} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: 250,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  label: {
    marginBottom: 5,
  },
});

export default LoginScreen;
