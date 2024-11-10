import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

type CardProps = {
  imageURL: string;
  user: string;
  tags: string;
  bookmarked: boolean;
  onToggleBookmark: () => void;
};

const Card: React.FC<CardProps> = ({
  imageURL,
  user,
  tags,
  bookmarked,
  onToggleBookmark,
}) => (
  <View style={styles.card}>
    <Image source={{ uri: imageURL }} style={styles.image} />
    <View style={styles.infoContainer}>
      <Text style={styles.user}>{user}</Text>
      <Text style={styles.tags}>{tags}</Text>
    </View>
    <TouchableOpacity onPress={onToggleBookmark} style={styles.bookmarkButton}>
      <Icon
        name={bookmarked ? "bookmark" : "bookmark-o"}
        size={20}
        color={bookmarked ? "#4a90e2" : "#ccc"}
      />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  infoContainer: {
    padding: 16,
  },
  user: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  tags: {
    color: "#777",
    fontSize: 14,
  },
  bookmarkButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 50,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default Card;
