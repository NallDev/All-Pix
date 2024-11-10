import React from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "@/navigation/AppNavigator";

const App = () => (
  <Provider store={store}>
    <NavigationContainer independent={true}>
      <AppNavigator />
    </NavigationContainer>
  </Provider>
);

export default App;
