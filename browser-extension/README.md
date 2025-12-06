# UrbanReflex Browser Extension

A lightweight browser extension that provides quick access to UrbanReflex city data for Ho Chi Minh City (HCMC) directly from your browser.

---

## Overview

The UrbanReflex browser extension allows users to quickly view essential city data without opening the full web application. With a simple click on the extension icon, users can access:

- **Road Context**: Information about roads, districts, length, type, condition, and traffic levels
- **Environment**: Current weather, temperature, air quality (AQI), and humidity
- **Infrastructure**: Nearby public facilities (schools, hospitals, parks, libraries)
- **Citizen Reports**: Active citizen reports about issues like potholes, street lights, traffic signals

---

## Features

### Quick Access
- Click the extension icon in your browser toolbar
- Enter a road name or coordinates
- Get instant access to city data

### Configurable API Endpoint
- Set your UrbanReflex backend API endpoint in the settings
- Connect to your own UrbanReflex instance

### Comprehensive Data Display
- **Road Context**: View detailed information about roads and traffic
- **Environment**: Monitor weather and air quality conditions
- **Nearby Facilities**: Find schools, hospitals, parks, and other facilities
- **Citizen Reports**: Stay informed about active issues and their status

### User-Friendly Interface
- Clean, modern design
- Responsive layout
- Easy-to-read data presentation
- Color-coded status indicators

---

## Installation

### From Source (Developer Mode)

1. Clone or download this repository
2. Open your browser (Chrome, Edge, or other Chromium-based browser)
3. Navigate to the extensions page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
4. Enable "Developer mode" (toggle in the top right)
5. Click "Load unpacked"
6. Select the `browser-extension` directory from this repository

### From Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store in the future.

---

## Usage

### Initial Setup

1. Click the UrbanReflex extension icon in your browser toolbar
2. Click the settings (⚙️) button
3. Enter your UrbanReflex API endpoint URL
   - Example: `https://api.urbanreflex.example.com`
4. Click "Save"

### Searching for Data

1. Click the UrbanReflex extension icon
2. Enter a location in one of two formats:
   - **Road name**: e.g., `Nguyen Hue` or `Le Loi Boulevard`
   - **Coordinates**: e.g., `10.7769,106.7009` (latitude, longitude)
3. Click "Search" or press Enter
4. View the data displayed in the popup

### Understanding the Data

#### Road Context
- **Name**: Road name
- **District**: Administrative district
- **Type**: Road classification (e.g., Boulevard, Main Street)
- **Length**: Total length of the road
- **Condition**: Current road condition
- **Traffic Level**: Current traffic intensity

#### Environment
- **Weather**: Current weather conditions
- **Temperature**: Current temperature in Celsius
- **Air Quality**: Air Quality Index (AQI) with rating
- **Humidity**: Current humidity percentage

#### Nearby Facilities
- **Name**: Facility name
- **Type**: Facility category (hospital, school, park, etc.)
- **Distance**: Approximate distance from the searched location

#### Citizen Reports
- **Title**: Brief description of the issue
- **Status**: Report status (active or resolved)
- **Date**: When the report was submitted
- **Description**: Detailed description of the issue

---

## Browser Compatibility

The extension is compatible with:
- Google Chrome (version 88+)
- Microsoft Edge (version 88+)
- Other Chromium-based browsers that support Manifest V3

---

## API Integration

### Backend Requirements

The extension expects the following API endpoints:

- **Road Context**: `POST /api/road-context`
- **Environment**: `POST /api/environment`
- **Facilities**: `POST /api/facilities`
- **Reports**: `POST /api/reports`

### Request Format

All endpoints accept JSON payloads in the following formats:

**Coordinates:**
```json
{
  "type": "coordinates",
  "lat": 10.7769,
  "lon": 106.7009
}
```

**Road Name:**
```json
{
  "type": "road",
  "name": "Nguyen Hue"
}
```

### Response Format

See the implementation in `js/popup.js` for expected response formats.

---

## Development

### Project Structure

```
browser-extension/
├── manifest.json         # Extension manifest (Manifest V3)
├── popup.html           # Popup interface HTML
├── css/
│   └── popup.css        # Popup styling
├── js/
│   ├── popup.js         # Popup logic and API calls
│   └── background.js    # Background service worker
├── icons/
│   ├── icon16.png       # 16x16 icon
│   ├── icon32.png       # 32x32 icon
│   ├── icon48.png       # 48x48 icon
│   └── icon128.png      # 128x128 icon
└── README.md            # This file
```

### Modifying the Extension

1. **Update API Endpoints**: Edit `js/popup.js` and modify the `fetch*` methods
2. **Change Styling**: Edit `css/popup.css`
3. **Modify Layout**: Edit `popup.html`
4. **Update Background Logic**: Edit `js/background.js`

After making changes:
1. Save your files
2. Go to the extensions page
3. Click the refresh icon on the UrbanReflex extension card
4. Test your changes

---

## Mock Data Mode

The extension currently includes mock data for demonstration purposes. The actual API integration points are marked in the code with comments like:

```javascript
// Mock implementation - replace with actual API call
```

To connect to a real backend:
1. Replace the mock implementations in `js/popup.js`
2. Update the fetch methods to make actual HTTP requests
3. Handle authentication if required
4. Process real API responses

---

## Privacy & Permissions

The extension requires the following permissions:

- **storage**: To save your API endpoint configuration
- **host_permissions**: To make API requests to your configured backend

The extension does not:
- Track your browsing history
- Collect personal information
- Share data with third parties
- Require account creation

---

## Troubleshooting

### "Please configure the API endpoint in settings first"
- Click the settings button (⚙️)
- Enter a valid API endpoint URL
- Click Save

### "Failed to fetch data"
- Verify your API endpoint is correct
- Check that the backend server is running
- Ensure the backend allows CORS requests from browser extensions
- Check the browser console for detailed error messages

### Extension Icon Not Appearing
- Make sure the extension is enabled in the extensions page
- Try reloading the extension
- Restart your browser

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## License

This extension is part of the UrbanReflex project. Please refer to the main project license.

---

## Support

For issues, questions, or suggestions:
- Open an issue on the GitHub repository
- Contact the UrbanReflex team

---

## Roadmap

Future enhancements planned:

- [ ] Firefox support (Manifest V2 compatibility)
- [ ] Offline caching of recent searches
- [ ] Bookmark favorite locations
- [ ] Push notifications for new citizen reports
- [ ] Map view integration
- [ ] Dark mode support
- [ ] Multiple language support
- [ ] Export data functionality

---

## Version History

### 1.0.0 (Current)
- Initial release
- Road context display
- Environment data (weather, AQI)
- Nearby facilities listing
- Citizen reports viewer
- Configurable API endpoint
- Mock data for demonstration
