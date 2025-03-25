// // This is a simple in-memory database for demonstration
// // In a real app, you'd use a real database like MongoDB, PostgreSQL, etc.

// let knownWords = [];
// let excludedWords = [];

// export function getKnownWords() {
//     console.log("knownWords", knownWords);
    
//   return knownWords;
// }

// export function addKnownWord(word) {
//   // Prevent duplicates
//   if (!knownWords.some(w => w.japanese === word.japanese)) {
//     knownWords.push(word);
//   }
//   return knownWords;
// }

// export function getExcludedWords() {
//     return excludedWords;
// }

// export function addExcludedWord(word) {
//     // Prevent duplicates
//     if (!excludedWords.some(w => w.japanese === word.japanese)) {
//         excludedWords.push(word);
//     }
//     return excludedWords;
// }

import PocketBase from 'pocketbase';

// Initialize PocketBase client
const pb = new PocketBase('https://pb.alifz.xyz'); // Replace with your PocketBase server URL


// Ensure collections exist


// Get known words
export async function getKnownWords() {
    try {
      const resultList = await pb.collection('known_words').getList(1, 1000000);
      const temp =  resultList.items.map(item => ({
        id: item.id,
        japanese: item.japanese
      }));
      return temp;
      
    } catch (error) {
      console.error('Error getting known words:', error);
      return [];
    }
  }

// Add known word
export async function addKnownWord(word){
  try {
    
    // Check for duplicates
    const existingWords = await pb.collection('known_words')
      .getList(1, 1000000, { 
        filter: `japanese = "${word.japanese}"` 
      });

    // If no duplicate exists, create the word
    if (existingWords.items.length === 0) {
      await pb.collection('known_words').create({
        "japanese": word.japanese
    });
    }

    // Return updated list of known words
    return getKnownWords();
  } catch (error) {
    console.error('Error adding known word:', error);
    return [];
  }
}

// Get excluded words
export async function getExcludedWords() {
  try {
    const resultList = await pb.collection('excluded_words').getList(1, 1000000);
    const temp =  resultList.items.map(item => ({
        id: item.id,
        japanese: item.japanese
      }));
      return temp;
  } catch (error) {
    console.error('Error getting excluded words:', error);
    return [];
  }
}

// Add excluded word
export async function addExcludedWord(word) {
  try {
    
    // Check for duplicates
    const existingWords = await pb.collection('excluded_words')
      .getList(1, 1000000, { 
        filter: `japanese = "${word.japanese}"` 
      });
    
    // If no duplicate exists, create the word
    if (existingWords.items.length === 0) {
      await pb.collection('excluded_words').create({
        "japanese": word.japanese
    });
    }

    // Return updated list of excluded words
    return getExcludedWords();
  } catch (error) {
    console.error('Error adding excluded word:', error);
    return [];
  }
}

