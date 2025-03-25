import path from 'path';

// Function to dynamically import all JSON files from a specific directory
export function importAllJsonFiles() {
  // Use require.context to dynamically import all JSON files in the data directory
  const jsonContext = require.context('./data', false, /\.json$/);
  
  // Create an object to store all imported JSON data
  const mockWordSets = {};

  // Iterate through all matching files and add them to mockWordSets
  jsonContext.keys().forEach((key) => {
    // Extract the file number from the filename (remove .json extension)
    const fileNumber = parseInt(path.basename(key, '.json'), 10);
    
    // Import the JSON file
    const jsonData = jsonContext(key);
    
    // Add to mockWordSets with the file number as the key
    mockWordSets[fileNumber] = jsonData;
  });

  return mockWordSets;
}

// Function to get words from a specific file number
export function getWordsFromFile(fileNumber) {
  // Import all JSON files
  const mockWordSets = importAllJsonFiles();
  
  // Return the specific file's data or an empty array if not found
  return mockWordSets[fileNumber] || [];
}

// getAvailableFileNumbers return an array of object with value and label as keys
export function getAvailableFileNumbers() {
  const mockWordSets = importAllJsonFiles();
  
  const listOfFilesWithLabels = Object.keys(mockWordSets).map(file => ({
    value: file,
    label: file
  }));
  
  return listOfFilesWithLabels;
}
