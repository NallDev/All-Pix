import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useFetchDataQuery } from "@/redux/slices/apiSlice";
import Card from "@/components/Card";
import { PixabayModel } from "@/models/PixabayModel";
import { getBookmarks, addBookmark, removeBookmark } from "@/utils/storage";
import Icon from "react-native-vector-icons/FontAwesome";

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
      setItemsSet((prevItemsSet: Set<PixabayModel>) => {
        const newItemsSet: Set<PixabayModel> =
          page === 1 ? new Set() : new Set(prevItemsSet);
        data.hits.forEach((item: PixabayModel) => newItemsSet.add(item));
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

  const renderFooter = () => {
    if (!isFetching) return null;
    return <ActivityIndicator style={{ margin: 16 }} color="#6b52ae" />;
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

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search images"
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Icon name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      {error ? (
        <Text style={styles.errorText}>Error fetching data</Text>
      ) : (
        <>
          {data && data.hits.length === 0 && page === 1 ? (
            <Text style={styles.emptyText}>No results found</Text>
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
    backgroundColor: "#f4f3f8",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    height: 45,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
  },
  searchButton: {
    height: 45,
    width: 48,
    backgroundColor: "#4a90e2",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    textAlign: "center",
    color: "#d9534f",
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
