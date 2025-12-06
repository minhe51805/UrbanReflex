// UrbanReflex Browser Extension - Background Service Worker

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('UrbanReflex extension installed');
    
    // Set default settings
    chrome.storage.sync.set({
      apiEndpoint: ''
    });
  } else if (details.reason === 'update') {
    console.log('UrbanReflex extension updated');
  }
});

// Handle messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchData') {
    // Handle data fetching if needed
    fetchDataFromAPI(request.location)
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    
    return true; // Keep message channel open for async response
  }
});

async function fetchDataFromAPI(location) {
  // This function can be used to make API calls from the background worker
  // if needed for CORS or other purposes
  const settings = await chrome.storage.sync.get(['apiEndpoint']);
  const apiEndpoint = settings.apiEndpoint;

  if (!apiEndpoint) {
    throw new Error('API endpoint not configured');
  }

  // Implement actual API calls here
  return {
    roadContext: null,
    environment: null,
    facilities: [],
    reports: []
  };
}

// Log that the background worker is active
console.log('UrbanReflex background service worker loaded');
