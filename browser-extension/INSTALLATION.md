# Installation Guide - UrbanReflex Browser Extension

This guide will help you install the UrbanReflex browser extension in developer mode.

---

## Prerequisites

- Google Chrome (version 88 or higher) or Microsoft Edge (version 88 or higher)
- The UrbanReflex repository cloned or downloaded to your computer

---

## Installation Steps

### Step 1: Open the Extensions Page

**For Google Chrome:**
1. Open Chrome
2. Type `chrome://extensions/` in the address bar and press Enter

**For Microsoft Edge:**
1. Open Edge
2. Type `edge://extensions/` in the address bar and press Enter

### Step 2: Enable Developer Mode

1. Look for the "Developer mode" toggle in the top-right corner of the extensions page
2. Click the toggle to enable Developer mode
3. Additional options will appear, including "Load unpacked"

### Step 3: Load the Extension

1. Click the "Load unpacked" button
2. In the file browser dialog that opens, navigate to the UrbanReflex repository
3. Select the `browser-extension` folder
4. Click "Select Folder" (or "Open" on some systems)

### Step 4: Verify Installation

1. The UrbanReflex extension should now appear in your list of extensions
2. Make sure the extension is enabled (toggle should be ON/blue)
3. You should see the UrbanReflex icon in your browser toolbar

---

## First-Time Setup

### Configure the API Endpoint

1. Click the UrbanReflex icon in your browser toolbar
2. Click the settings icon (⚙️) in the popup
3. Enter your UrbanReflex API endpoint URL
   - Example: `https://api.urbanreflex.example.com`
4. Click "Save"

---

## Using the Extension

### Search for a Location

1. Click the UrbanReflex icon in your browser toolbar
2. Enter a location in one of two formats:
   - **Road name**: e.g., `Nguyen Hue` or `Le Loi Boulevard`
   - **Coordinates**: e.g., `10.7769,106.7009` (latitude, longitude)
3. Click "Search" or press Enter
4. View the displayed data:
   - Road Context
   - Environment (Weather, Temperature, Air Quality, Humidity)
   - Nearby Facilities
   - Citizen Reports

---

## Troubleshooting

### Extension Not Loading

**Issue:** The extension doesn't appear after loading
- **Solution:** Make sure you selected the `browser-extension` folder, not the root repository folder
- **Solution:** Check that all required files are present in the folder (manifest.json, popup.html, etc.)
- **Solution:** Check the browser console for error messages

### "Please configure the API endpoint in settings first"

**Issue:** This message appears when searching
- **Solution:** Click the settings icon (⚙️) and enter your API endpoint URL
- **Solution:** Make sure the URL is valid and starts with `http://` or `https://`

### Extension Icon Not Visible

**Issue:** Can't find the extension icon in the toolbar
- **Solution:** Click the puzzle piece icon (Extensions) in your browser toolbar
- **Solution:** Click the pin icon next to UrbanReflex to pin it to the toolbar
- **Solution:** Verify the extension is enabled in `chrome://extensions/`

### Data Not Loading

**Issue:** Search completes but no data is shown
- **Solution:** Verify your API endpoint is correct and accessible
- **Solution:** Check that the backend server is running
- **Solution:** Open the browser console (F12) to check for network errors
- **Solution:** Ensure the backend allows CORS requests from browser extensions

---

## Updating the Extension

After making changes to the extension files:

1. Go to `chrome://extensions/` or `edge://extensions/`
2. Find the UrbanReflex extension
3. Click the refresh/reload icon (circular arrow)
4. The extension will reload with your changes

---

## Uninstalling the Extension

To remove the extension:

1. Go to `chrome://extensions/` or `edge://extensions/`
2. Find the UrbanReflex extension
3. Click "Remove"
4. Confirm the removal

---

## Development Mode Limitations

**Note:** Extensions loaded in developer mode have some limitations:

- The extension will be disabled when you close and reopen your browser
  - You'll need to re-enable it in the extensions page
- You may see a warning banner that says "Disable developer mode extensions"
  - This is normal for unpacked extensions
- The extension won't auto-update
  - You must manually reload it after making changes

---

## Browser Compatibility

✅ **Supported:**
- Google Chrome (88+)
- Microsoft Edge (88+)
- Brave
- Other Chromium-based browsers

❌ **Not Supported:**
- Firefox (requires Manifest V2 adaptation)
- Safari (requires different extension format)

---

## Getting Help

If you encounter issues:

1. Check the browser console for error messages (F12 → Console tab)
2. Review the extension's README.md for detailed documentation
3. Open an issue on the GitHub repository
4. Contact the UrbanReflex development team

---

## Next Steps

After installation, you can:

- Configure your API endpoint
- Search for locations in HCMC
- View real-time city data
- Monitor citizen reports
- Check nearby facilities

For more detailed information about the extension's features and API integration, see the [README.md](README.md) file.
