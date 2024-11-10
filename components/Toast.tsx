import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface ToastProps {
  message: string;
  visible: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, visible }) => {
  if (!visible) return null;

  return (
    <View style={styles.toastContainer}>
      <Text style={styles.toastText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    bottom: 50,
    left: "10%",
    right: "10%",
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 5,
    alignItems: "center",
  },
  toastText: {
    color: "#fff",
  },
});

export default Toast;
