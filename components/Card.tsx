import React from "react";
import { View, Text, Image, StyleSheet, Button } from "react-native";

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
    <Text style={styles.user}>{user}</Text>
    <Text style={styles.tags}>{tags}</Text>
    <Button
      title={bookmarked ? "Bookmarked" : "Bookmark"}
      onPress={onToggleBookmark}
      color={bookmarked ? "#ff6347" : "#aaa"}
    />
  </View>
);

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  user: {
    marginTop: 8,
    paddingHorizontal: 16,
    fontWeight: "bold",
  },
  tags: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    color: "#666",
  },
});

export default Card;
