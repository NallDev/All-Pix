import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import LoginScreen from "@/screens/Login/LoginScreen";
import HomeScreen from "@/screens/Home/HomeScreen";
import { getToken } from "@/utils/storage";
import { setToken } from "@/redux/slices/authSlice";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await getToken();
      if (storedToken) {
        dispatch(setToken(storedToken));
      }
      setLoading(false);
    };
    checkToken();
  }, [dispatch]);

  if (loading) return null;

  return (
    <Stack.Navigator>
      {token ? (
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
