import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Swiper from 'react-native-dynamic-deck-swiper';

export default function App() {
  return (
    <View style={styles.container}>
      <Swiper
        getNextCardData={({ first, left, right, previousCards }) => {
          if (first) {
            return 'This is the first card';
          } else if (left) {
            return 'You swiped to the left';
          } else if (right) {
            return 'You swiped to the right';
          }
        }}
        renderCard={(card) => (
          <View style={styles.card}>
            <Text style={styles.text}>{card}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  card: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    backgroundColor: 'turquoise',
    marginTop: 60,
    marginBottom: 60,
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 30,
    padding: 10
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'transparent'
  }
});
