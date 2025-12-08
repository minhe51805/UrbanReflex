# User Guide

Complete guide for using the UrbanReflex platform. This documentation covers all features from basic navigation to advanced data analysis.

## Table of Contents

- [Getting Started](#getting-started)
- [Dashboard Overview](#dashboard-overview)
- [Air Quality Monitoring](#air-quality-monitoring)
- [Weather Information](#weather-information)
- [Citizen Reporting](#citizen-reporting)
- [AI Chatbot](#ai-chatbot)
- [Data Visualization](#data-visualization)
- [Search and Filters](#search-and-filters)
- [User Account](#user-account)
- [Mobile Usage](#mobile-usage)
- [Troubleshooting](#troubleshooting)

---

## Getting Started

### Accessing UrbanReflex

**Development Environment**:

```
http://localhost:3000
```

**Production** (Future):

```
https://urbanreflex.dev
```

### System Requirements

**Supported Browsers**:

- Google Chrome 90+
- Mozilla Firefox 88+
- Microsoft Edge 90+
- Safari 14+

**Minimum Screen Resolution**:

- Desktop: 1024x768
- Tablet: 768x1024
- Mobile: 375x667

**Internet Connection**:

- Recommended: 5 Mbps or faster
- Minimum: 1 Mbps

### First Time Setup

**Step 1: Access the Platform**

- Open your web browser
- Navigate to http://localhost:3000
- Wait for the dashboard to load

**Step 2: Explore the Interface**

- Review the dashboard overview
- Check available data visualizations
- Familiarize yourself with navigation menu

**Step 3: Try Key Features**

- View air quality data
- Check weather information
- Interact with the AI chatbot
- Submit a test report (optional)

---

## Dashboard Overview

### Main Dashboard Layout

The dashboard is divided into several key sections:

**1. Navigation Bar** (Top)

- Platform logo
- Main menu items
- User account menu (future)
- Search functionality

**2. Sidebar** (Left)

- Quick navigation links
- Data categories
- Filter options
- Recent activities

**3. Main Content Area** (Center)

- Interactive map
- Data visualizations
- Entity listings
- Detailed views

**4. Information Panels** (Right)

- Quick stats
- Alerts and notifications
- Contextual help
- Related information

### Quick Statistics

The dashboard displays real-time statistics:

**Environmental Metrics**:

- Current air quality index (AQI)
- PM2.5 concentration
- Temperature and humidity
- Weather conditions

**Infrastructure Status**:

- Total streetlights monitored
- Active vs inactive lights
- Road segments tracked
- Points of interest

**Citizen Engagement**:

- Total reports submitted
- Pending reports
- Resolved issues this week
- Average resolution time

### Interactive Map

**Map Features**:

- Zoom: Mouse wheel or +/- buttons
- Pan: Click and drag
- Entity markers: Click for details
- Layer control: Toggle different data layers

**Available Layers**:

- Road segments
- Streetlights
- Air quality stations
- Weather stations
- Points of interest
- Citizen reports

**Map Controls**:

- Zoom in/out buttons
- Reset view
- Fullscreen mode
- Layer selector
- Search location

---

## Air Quality Monitoring

### Viewing Air Quality Data

**Access Air Quality Section**:

1. Click "Air Quality" in navigation menu
2. View the air quality map
3. Check current AQI readings

**Understanding AQI Values**:

- 0-50: Good (Green)
- 51-100: Moderate (Yellow)
- 101-150: Unhealthy for Sensitive Groups (Orange)
- 151-200: Unhealthy (Red)
- 201-300: Very Unhealthy (Purple)
- 301+: Hazardous (Maroon)

### Detailed Air Quality Information

**View Station Details**:

1. Click on a station marker on the map
2. View popup with current readings
3. Click "View Details" for full information

**Available Pollutant Data**:

- PM2.5: Fine particulate matter
- PM10: Coarse particulate matter
- NO2: Nitrogen dioxide
- O3: Ozone
- CO: Carbon monoxide
- SO2: Sulfur dioxide

**Historical Data**:

1. Select a monitoring station
2. Click "Historical Data" tab
3. Choose time range (24h, 7 days, 30 days)
4. View trend charts

### Health Recommendations

Based on current AQI, the platform provides:

**For Good Air Quality (0-50)**:

- Air quality is satisfactory
- No health concerns
- Perfect for outdoor activities

**For Moderate (51-100)**:

- Acceptable for most people
- Unusually sensitive people should consider limiting prolonged outdoor exertion

**For Unhealthy for Sensitive Groups (101-150)**:

- General public not affected
- Sensitive groups should reduce prolonged outdoor exertion

**For Unhealthy (151-200)**:

- Everyone may begin to experience health effects
- Sensitive groups should avoid outdoor exertion

**For Very Unhealthy (201-300)**:

- Health alert: everyone may experience serious effects
- Everyone should avoid outdoor exertion

**For Hazardous (301+)**:

- Health warning of emergency conditions
- Everyone should remain indoors

---

## Weather Information

### Current Weather

**View Current Conditions**:

1. Access "Weather" section
2. Select a location on the map
3. View current readings

**Available Information**:

- Temperature (°C)
- Feels like temperature
- Humidity (%)
- Atmospheric pressure (hPa)
- Wind speed and direction
- Precipitation (mm)
- Cloud cover
- UV index

### Weather Forecast

**7-Day Forecast**:

1. Click "Forecast" tab
2. View daily predictions
3. Check hourly breakdown

**Forecast Details**:

- High/low temperatures
- Precipitation probability
- Wind conditions
- Sunrise/sunset times

### Weather Alerts

**Types of Alerts**:

- Heavy rain warnings
- Extreme heat advisories
- Strong wind alerts
- Thunderstorm warnings

**Alert Actions**:

- View alert details
- Check affected areas
- See safety recommendations
- Subscribe to notifications (future)

---

## Citizen Reporting

### Creating a Report

**Step-by-Step Process**:

1. **Navigate to Reporting**
   - Click "Report Issue" button
   - Or go to "Citizen Reports" section

2. **Choose Report Type**
   - Infrastructure (potholes, broken lights, etc.)
   - Environment (pollution, trash, etc.)
   - Safety (hazards, accidents, etc.)
   - Other (general issues)

3. **Provide Location**
   - Click on map to set location
   - Or enter address manually
   - Or use "Current Location" button

4. **Add Description**
   - Write clear, concise description
   - Include relevant details
   - Specify urgency if applicable

5. **Attach Photos** (Optional)
   - Click "Add Photos" button
   - Select up to 5 images
   - Photos should clearly show the issue

6. **Review and Submit**
   - Check all information
   - Click "Submit Report"
   - Save confirmation number

### Viewing Your Reports

**Access Your Reports**:

1. Go to "My Reports" section
2. View list of submitted reports
3. Click on report for details

**Report Status Types**:

- **Pending**: Awaiting review
- **In Progress**: Being addressed
- **Resolved**: Issue fixed
- **Rejected**: Not actionable

**Report Details Include**:

- Submission date
- Category and priority
- Current status
- Location on map
- Photos attached
- Updates and notes
- Assigned department (if applicable)

### Tracking Report Progress

**Receive Updates**:

- Status changes
- Notes from authorities
- Resolution confirmation
- Estimated completion time

**View Update History**:

1. Open your report
2. Click "History" tab
3. See timeline of changes

---

## AI Chatbot

### Starting a Conversation

**Access the Chatbot**:

1. Click chatbot icon (bottom right)
2. Chat window opens
3. Type your question

**Example Questions**:

- "What is the current air quality in District 1?"
- "Show me weather forecast for this week"
- "Find streetlights near Nguyen Hue Boulevard"
- "How many reports were submitted today?"
- "What areas have the worst air quality?"

### Chatbot Capabilities

**Data Queries**:

- Air quality information
- Weather conditions
- Infrastructure status
- Citizen report statistics
- Points of interest

**Analysis Requests**:

- Trend analysis
- Comparisons between areas
- Historical patterns
- Correlations

**Recommendations**:

- Health advice based on air quality
- Best times for outdoor activities
- Areas to avoid
- Report submission guidance

### Tips for Effective Use

**Be Specific**:

- Bad: "How's the air?"
- Good: "What is the PM2.5 level in District 1 right now?"

**Use Natural Language**:

- No need for technical syntax
- Ask as you would ask a person
- Follow-up questions are understood

**Request Clarification**:

- If response is unclear, ask for more details
- Request examples or explanations
- Ask for data sources

### Chat History

**View Previous Conversations**:

1. Click "History" in chat window
2. Browse past conversations
3. Click to continue previous chat

**Managing Conversations**:

- Start new conversation
- Clear chat history
- Export conversation (future)

---

## Data Visualization

### Available Chart Types

**Time Series Charts**:

- Air quality trends over time
- Temperature variations
- Historical comparisons
- Seasonal patterns

**Bar Charts**:

- Reports by category
- Pollution levels by area
- Infrastructure counts

**Pie Charts**:

- Report status distribution
- Issue category breakdown
- Priority levels

**Heatmaps**:

- Air quality hotspots
- Incident density
- Coverage areas

### Customizing Visualizations

**Adjust Time Range**:

1. Click date range selector
2. Choose predefined range or custom dates
3. Charts update automatically

**Filter Data**:

1. Use filter panel
2. Select categories, areas, or types
3. Apply filters
4. View updated visualizations

**Export Charts**:

1. Click "Export" button
2. Choose format (PNG, PDF, CSV)
3. Download file

---

## Search and Filters

### Search Functionality

**Global Search**:

1. Click search bar (top of page)
2. Type search term
3. View results across all entities

**Search by Category**:

- Road segments by name
- Reports by description
- POIs by name or type
- Entities by ID

**Search Results**:

- Categorized by type
- Location shown on map
- Quick preview
- Click for full details

### Advanced Filters

**Filter Options**:

**By Location**:

- District
- Ward
- Radius from point
- Within boundary

**By Date**:

- Last 24 hours
- Last week
- Last month
- Custom range

**By Category**:

- Entity type
- Report category
- Priority level
- Status

**By Attributes**:

- AQI range
- Temperature range
- Custom properties

**Applying Filters**:

1. Open filter panel
2. Select desired options
3. Click "Apply"
4. Results update automatically

**Saving Filters** (Future):

- Save commonly used filters
- Quick access to saved searches
- Share filter configurations

---

## User Account

### Account Features (Future)

**Creating an Account**:

1. Click "Sign Up"
2. Provide email and password
3. Verify email address
4. Complete profile

**Account Benefits**:

- Track your submitted reports
- Save favorite locations
- Receive personalized alerts
- Access historical data
- Contribute to discussions

**Profile Settings**:

- Update personal information
- Change password
- Set notification preferences
- Manage privacy settings
- Delete account

**Notification Preferences**:

- Report status updates
- Air quality alerts
- Weather warnings
- System announcements

---

## Mobile Usage

### Mobile-Optimized Interface

**Responsive Design**:

- Auto-adjusts to screen size
- Touch-friendly controls
- Simplified navigation
- Optimized performance

**Mobile Features**:

**Location Services**:

- Use current GPS location
- Report issues on the go
- Find nearby issues

**Camera Integration**:

- Take photos directly
- Attach to reports
- Document issues immediately

**Offline Capability** (Future):

- View cached data
- Submit reports offline
- Sync when online

### Mobile Tips

**Battery Saving**:

- Disable location when not needed
- Close app when not in use
- Use WiFi when available

**Data Usage**:

- Load lighter map tiles
- Limit image uploads
- Download reports for offline viewing

---

## Troubleshooting

### Common Issues

**Map Not Loading**:

- Check internet connection
- Refresh the page
- Clear browser cache
- Try different browser

**Data Not Updating**:

- Wait a few seconds for refresh
- Check if auto-refresh is enabled
- Manually refresh the page
- Verify backend service status

**Reports Not Submitting**:

- Check all required fields filled
- Verify internet connection
- Ensure images are under size limit (5MB each)
- Try again in a few minutes

**Chatbot Not Responding**:

- Check internet connection
- Verify AI service is running
- Try rephrasing your question
- Start a new conversation

### Getting Help

**Documentation**:

- Read this user guide
- Check FAQ section
- View tutorial videos (future)

**Support Channels** (Future):

- Email: support@urbanreflex.dev
- Live chat during business hours
- Community forum
- Bug reporting on GitHub

**Reporting Bugs**:

1. Note the exact error message
2. Describe steps to reproduce
3. Include browser and OS info
4. Submit via GitHub Issues

---

## Best Practices

### Effective Reporting

**Good Reports Include**:

- Clear, specific description
- Accurate location
- Recent photos
- Context about impact
- Contact information (optional)

**Avoid**:

- Vague descriptions
- Multiple issues in one report
- Outdated photos
- Inappropriate content

### Data Interpretation

**Consider Context**:

- Air quality varies throughout day
- Weather can affect sensor readings
- Compare with historical data
- Check multiple sources

**Use Multiple Metrics**:

- Don't rely on single indicator
- Compare different pollutants
- Look at trends, not just snapshots
- Consider local conditions

### Privacy and Security

**Protect Your Information**:

- Use strong passwords
- Don't share account credentials
- Be careful with location sharing
- Review privacy settings

**Report Safely**:

- Don't include personal information in reports
- Avoid identifying yourself in photos
- Report sensitive issues through proper channels

---

## Keyboard Shortcuts

### Navigation (Future)

- `Ctrl + /` - Open search
- `Ctrl + K` - Open chatbot
- `Ctrl + R` - New report
- `Ctrl + M` - Focus map
- `Esc` - Close modals

### Map Controls

- `+` or `=` - Zoom in
- `-` - Zoom out
- Arrow keys - Pan map
- `F` - Fullscreen
- `L` - Toggle layers

---

## Glossary

**AQI (Air Quality Index)**: Numerical scale indicating air pollution level

**PM2.5**: Fine particulate matter (2.5 micrometers or smaller)

**PM10**: Coarse particulate matter (10 micrometers or smaller)

**NGSI-LD**: Standard for context information management

**Orion-LD**: Context broker implementing NGSI-LD

**POI (Point of Interest)**: Notable location like schools, hospitals

**Entity**: Data object in NGSI-LD (e.g., road segment, sensor)

**Relationship**: Link between two entities

**GeoProperty**: Geographic location data

---

## Additional Resources

### Related Documentation

- [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) - For developers
- [API_REFERENCE.md](./API_REFERENCE.md) - API documentation
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
- [DATA_MODEL_AND_ENTITIES.md](./DATA_MODEL_AND_ENTITIES.md) - Data structures

### External Resources

- [FIWARE Documentation](https://fiware.org/)
- [NGSI-LD Specification](https://www.etsi.org/deliver/etsi_gs/CIM/001_099/009/01.08.01_60/gs_CIM009v010801p.pdf)
- [Air Quality Standards](https://www.epa.gov/criteria-air-pollutants)
- [OpenStreetMap](https://www.openstreetmap.org/)

---

**Need More Help?**

For technical support or feature requests, please visit:

- GitHub: https://github.com/minhe51805/UrbanReflex
- Documentation: https://docs.urbanreflex.dev (future)
- Email: support@urbanreflex.dev (future)
