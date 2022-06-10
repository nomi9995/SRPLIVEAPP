import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList } from "@stream-io/flat-list-mvcp";

type Item = {
  id: string,
  value: number,
};

const SIZE = 15;

const AddMoreButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.addMoreButton}>
    <Text style={styles.addMoreButtonText}>Add 5 items from this side</Text>
  </TouchableOpacity>
);

const ListItem = ({ item }: { item: Item }) => (
  <View style={styles.listItem}>
    <Text>List item: {item.value}</Text>
  </View>
);

// Generate unique key list item.
export const generateUniqueKey = () =>
  `_${Math.random().toString(36).substr(2, 9)}`;

const FlatListExample = () => {
  const [numbers, setNumbers] = useState(
    Array.from(Array(25).keys()).map((n) => ({
      id: generateUniqueKey(),
      value: n,
    }))
  );

  useEffect(() => {
    setTimeout(() => {
      setNumbers(
        Array.from(Array(SIZE).keys()).map((n) => ({
          id: generateUniqueKey(),
          value: n,
        }))
      );

      setTimeout(() => {
        setNumbers((prev) => {
          const additionalNumbers: Item[] = Array.from(Array(4).keys()).map(
            (n) => ({
              id: generateUniqueKey(),
              value: n + prev[prev.length - 1].value + 1,
            })
          );

          return additionalNumbers.concat(prev);
        });
      }, 0);
      setTimeout(() => {
        setNumbers((prev) => {
          const additionalNumbers: Item[] = Array.from(Array(4).keys()).map(
            (n) => ({
              id: generateUniqueKey(),
              value: n + prev[prev.length - 1].value + 1,
            })
          );

          return additionalNumbers.concat(prev);
        });
      }, 0);

      setTimeout(() => {
        setNumbers(
          Array.from(Array(SIZE).keys()).map((n) => ({
            id: generateUniqueKey(),
            value: n,
          }))
        );
      }, 1000);
    }, 500);
  }, []);

  const addToEnd = () => {
    setNumbers((prev) => {
      const additionalNumbers: Item[] = Array.from(Array(SIZE).keys()).map(
        (n) => ({
          id: generateUniqueKey(),
          value: n + prev[prev.length - 1].value + 1,
        })
      );

      return additionalNumbers.concat(prev);
    });
  };

  const addToStart = () => {
    setNumbers((prev) => {
      const additionalNumbers = Array.from(Array(SIZE).keys())
        .map((n) => ({
          id: generateUniqueKey(),
          value: prev[0].value - n - 1,
        }))
        .reverse();

      return prev.concat(additionalNumbers);
    });
  };
  console.log(numbers.length, "numbers");
  return (
    <SafeAreaView style={styles.safeArea}>
      <AddMoreButton onPress={addToStart} />
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={[styles.contentContainer, {}]}
          data={numbers}
          inverted
          keyExtractor={(item) => item.id}
          maintainVisibleContentPosition={{
            autoscrollToTopThreshold: false ? 10 : undefined,
            minIndexForVisible: 1,
          }}
          renderItem={ListItem}
          style={[styles.listContainer, {}]}
        />
      </View>
      <AddMoreButton onPress={addToEnd} />
    </SafeAreaView>
  );
};

export default FlatListExample;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    width: "100%",
  },
  contentContainer: {
    flexGrow: 1,
    /**
     * paddingBottom is set to 4 to account for the default date
     * header and inline indicator alignment. The top margin is 8
     * on the header but 4 on the inline date, this adjusts the spacing
     * to allow the "first" inline date to align with the date header.
     */
    paddingBottom: 4,
  },
  listContainer: { flex: 1, width: "100%" },
  safeArea: {
    flex: 1,
  },
  addMoreButton: {
    padding: 8,
    backgroundColor: "#008CBA",
    alignItems: "center",
  },
  addMoreButtonText: {
    color: "white",
  },
  listItem: {
    flex: 1,
    padding: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 8,
    backgroundColor: "white",
  },
});
