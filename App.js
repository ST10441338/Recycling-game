import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, FlatList } from 'react-native';

// List of recyclable items
const recyclableItems = [
  'Plastic Bottle', 'Glass Jar', 'Paper Bag', 'Aluminum Can',
  'Plastic Bottle', 'Glass Jar', 'Paper Bag', 'Aluminum Can',
  'Plastic Bag', 'Metal Can', 'Cardboard', 'Plastic Bag'
];

// Function to shuffle the cards
const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

export default function App() {
  const [cards, setCards] = useState(shuffleArray(recyclableItems));
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(Array(cards.length).fill(false));
  
  // Function to handle card press
  const handleCardPress = (index) => {
    // Prevent flipping already matched cards or more than two cards
    if (flippedCards.length < 2 && !flippedCards.includes(index) && !matchedPairs[index]) {
      setFlippedCards((prev) => [...prev, index]);

      // Check for matches if two cards are flipped
      if (flippedCards.length === 1) {
        const firstCardIndex = flippedCards[0];
        const secondCardIndex = index;

        if (cards[firstCardIndex] === cards[secondCardIndex]) {
          // Update matched pairs if they match
          setMatchedPairs((prev) => {
            const newMatched = [...prev];
            newMatched[firstCardIndex] = true;
            newMatched[secondCardIndex] = true;
            return newMatched;
          });
        }

        // Delay to allow players to see the second card before flipping back
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Check if game is over
  const isGameOver = matchedPairs.every(Boolean);

  // Handle game over alert
  const showAlert = () => {
    Alert.alert("Congratulations!", "You've matched all pairs!", [
      { text: "OK", onPress: resetGame }
    ]);
  };

  // Reset the game
  const resetGame = () => {
    setMatchedPairs(Array(cards.length).fill(false));
    setCards(shuffleArray(recyclableItems));
    setFlippedCards([]);
  };

  // If game is over, show the alert
  if (isGameOver) {
    showAlert();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recycling Memory Game</Text>
      <Text style={styles.score}>Matched Pairs: {matchedPairs.filter(Boolean).length}</Text>

      <FlatList
        data={cards}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleCardPress(index)}
            disabled={matchedPairs[index]} // Disable pressed cards that are already matched
          >
            <Text style={styles.cardText}>
              {flippedCards.includes(index) || matchedPairs[index] ? item : "?"}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  score: {
    fontSize: 18,
    marginBottom: 10,
  },
  card: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    backgroundColor: '#ccc',
    borderRadius: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
