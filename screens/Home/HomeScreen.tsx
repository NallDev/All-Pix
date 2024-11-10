import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useFetchDataQuery } from "@/redux/slices/apiSlice";
import Card from "@/components/Card";
import { PixabayModel } from "@/models/PixabayModel";
import { getBookmarks, addBookmark, removeBookmark } from "@/utils/storage";

const HomeScreen = () => {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [itemsSet, setItemsSet] = useState<Set<PixabayModel>>(new Set());
  const [bookmarkedItems, setBookmarkedItems] = useState<number[]>([]);

  const { data, error, isFetching } = useFetchDataQuery({
    query: searchQuery,
    page,
    perPage: 20,
  });

  useEffect(() => {
    const loadBookmarks = async () => {
      const bookmarks = await getBookmarks();
      setBookmarkedItems(bookmarks.map((item) => item.id));
    };
    loadBookmarks();
  }, []);

  useEffect(() => {
    if (data) {
      setItemsSet((prevItemsSet) => {
        const newItemsSet: Set<PixabayModel> =
          page === 1 ? new Set() : new Set(prevItemsSet);
        data.hits.forEach((item: PixabayModel) => newItemsSet.add(item)); // Explicitly type 'item' as PixabayModel
        return newItemsSet;
      });
    }
  }, [data, page]);

  const handleSearch = () => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleLoadMore = () => {
    if (!isFetching && data && data.hits.length > 0) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const toggleBookmark = async (item: PixabayModel) => {
    const isCurrentlyBookmarked = bookmarkedItems.includes(item.id);
    if (isCurrentlyBookmarked) {
      await removeBookmark(item.id);
      setBookmarkedItems((prev) => prev.filter((id) => id !== item.id));
    } else {
      await addBookmark(item);
      setBookmarkedItems((prev) => [...prev, item.id]);
    }
  };

  const renderFooter = () => {
    if (!isFetching) return null;
    return <ActivityIndicator style={{ margin: 16 }} />;
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search images"
        value={query}
        returnKeyType="search"
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
      />
      <Button title="Search" onPress={handleSearch} />
      {error ? (
        <Text>Error fetching data</Text>
      ) : (
        <>
          {data && data.hits.length === 0 && page === 1 ? (
            <Text style={styles.emptyText}>Data is empty</Text>
          ) : (
            <FlatList
              style={styles.list}
              data={Array.from(itemsSet)}
              renderItem={({ item }) => (
                <Card
                  imageURL={item.largeImageURL}
                  user={item.user}
                  tags={item.tags}
                  bookmarked={bookmarkedItems.includes(item.id)}
                  onToggleBookmark={() => toggleBookmark(item)}
                />
              )}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  searchInput: {
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
  list: {
    marginTop: 16,
  },
});

export default HomeScreen;
