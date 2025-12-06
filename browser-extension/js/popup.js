// UrbanReflex Browser Extension - Popup Script

class UrbanReflexPopup {
  constructor() {
    this.apiEndpoint = '';
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.attachEventListeners();
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['apiEndpoint']);
      this.apiEndpoint = result.apiEndpoint || '';
      document.getElementById('apiEndpoint').value = this.apiEndpoint;
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  attachEventListeners() {
    // Settings button
    document.getElementById('settingsBtn').addEventListener('click', () => {
      this.toggleSettings();
    });

    // Save settings
    document.getElementById('saveSettings').addEventListener('click', () => {
      this.saveSettings();
    });

    // Close settings
    document.getElementById('closeSettings').addEventListener('click', () => {
      this.hideSettings();
    });

    // Search button
    document.getElementById('searchBtn').addEventListener('click', () => {
      this.performSearch();
    });

    // Enter key in location input
    document.getElementById('locationInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.performSearch();
      }
    });
  }

  toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    panel.classList.toggle('hidden');
  }

  hideSettings() {
    document.getElementById('settingsPanel').classList.add('hidden');
  }

  async saveSettings() {
    const apiEndpoint = document.getElementById('apiEndpoint').value.trim();
    
    if (!apiEndpoint) {
      this.showError('Please enter a valid API endpoint');
      return;
    }

    try {
      await chrome.storage.sync.set({ apiEndpoint });
      this.apiEndpoint = apiEndpoint;
      this.hideSettings();
      this.showSuccess('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      this.showError('Failed to save settings');
    }
  }

  async performSearch() {
    const locationInput = document.getElementById('locationInput').value.trim();

    if (!locationInput) {
      this.showError('Please enter a road name or coordinates');
      return;
    }

    if (!this.apiEndpoint) {
      this.showError('Please configure the API endpoint in settings first');
      document.getElementById('settingsPanel').classList.remove('hidden');
      return;
    }

    this.hideError();
    this.showLoading();
    this.hideDataContainer();

    try {
      const coordinates = this.parseLocation(locationInput);
      const data = await this.fetchData(coordinates);
      this.displayData(data);
    } catch (error) {
      console.error('Search error:', error);
      this.showError(error.message || 'Failed to fetch data');
      this.hideLoading();
    }
  }

  parseLocation(input) {
    // Check if input is coordinates (lat, lon)
    const coordPattern = /^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/;
    const match = input.match(coordPattern);

    if (match) {
      return {
        lat: parseFloat(match[1]),
        lon: parseFloat(match[2]),
        type: 'coordinates'
      };
    } else {
      return {
        name: input,
        type: 'road'
      };
    }
  }

  async fetchData(location) {
    // Simulate API calls for demonstration
    // In production, replace with actual API endpoints

    const data = {
      roadContext: null,
      environment: null,
      facilities: [],
      reports: []
    };

    try {
      // Fetch road context
      data.roadContext = await this.fetchRoadContext(location);
    } catch (error) {
      console.error('Error fetching road context:', error);
    }

    try {
      // Fetch environment data
      data.environment = await this.fetchEnvironment(location);
    } catch (error) {
      console.error('Error fetching environment:', error);
    }

    try {
      // Fetch nearby facilities
      data.facilities = await this.fetchFacilities(location);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    }

    try {
      // Fetch citizen reports
      data.reports = await this.fetchReports(location);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }

    return data;
  }

  async fetchRoadContext(location) {
    // Mock implementation - replace with actual API call
    const endpoint = `${this.apiEndpoint}/api/road-context`;
    
    // For demo purposes, return mock data
    await this.delay(500);
    
    if (location.type === 'coordinates') {
      return {
        name: 'Sample Road',
        district: 'District 1',
        length: '2.5 km',
        type: 'Main Street',
        condition: 'Good',
        trafficLevel: 'Moderate'
      };
    } else {
      return {
        name: location.name,
        district: 'District 1',
        length: '3.2 km',
        type: 'Boulevard',
        condition: 'Good',
        trafficLevel: 'High'
      };
    }

    // Actual implementation would be:
    // const response = await fetch(endpoint, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(location)
    // });
    // return await response.json();
  }

  async fetchEnvironment(location) {
    // Mock implementation - replace with actual API call
    await this.delay(500);
    
    return {
      weather: 'Partly Cloudy',
      temperature: '32°C',
      airQuality: 'Moderate (AQI 78)',
      humidity: '65%'
    };
  }

  async fetchFacilities(location) {
    // Mock implementation - replace with actual API call
    await this.delay(500);
    
    return [
      {
        name: 'General Hospital',
        type: 'hospital',
        distance: '0.8 km'
      },
      {
        name: 'Central Park',
        type: 'park',
        distance: '1.2 km'
      },
      {
        name: 'Primary School No. 5',
        type: 'school',
        distance: '0.5 km'
      },
      {
        name: 'City Library',
        type: 'library',
        distance: '1.5 km'
      }
    ];
  }

  async fetchReports(location) {
    // Mock implementation - replace with actual API call
    await this.delay(500);
    
    return [
      {
        title: 'Pothole on main road',
        status: 'active',
        date: '2 days ago',
        description: 'Large pothole causing traffic issues near intersection'
      },
      {
        title: 'Street light outage',
        status: 'resolved',
        date: '1 week ago',
        description: 'Multiple street lights not working in the evening'
      },
      {
        title: 'Traffic signal malfunction',
        status: 'active',
        date: '5 hours ago',
        description: 'Traffic light stuck on red at main junction'
      }
    ];
  }

  displayData(data) {
    this.hideLoading();
    this.showDataContainer();

    // Display road context
    this.displayRoadContext(data.roadContext);

    // Display environment
    this.displayEnvironment(data.environment);

    // Display facilities
    this.displayFacilities(data.facilities);

    // Display reports
    this.displayReports(data.reports);
  }

  displayRoadContext(roadContext) {
    const container = document.getElementById('roadContext');
    
    if (!roadContext) {
      container.innerHTML = '<p class="no-data">No data available</p>';
      return;
    }

    container.innerHTML = `
      <div class="road-info">
        <div class="road-name">${roadContext.name}</div>
        <div class="road-details">
          <strong>District:</strong> ${roadContext.district}<br>
          <strong>Type:</strong> ${roadContext.type}<br>
          <strong>Length:</strong> ${roadContext.length}<br>
          <strong>Condition:</strong> ${roadContext.condition}<br>
          <strong>Traffic Level:</strong> ${roadContext.trafficLevel}
        </div>
      </div>
    `;
  }

  displayEnvironment(environment) {
    if (!environment) {
      return;
    }

    document.getElementById('weather').textContent = environment.weather || '--';
    document.getElementById('temperature').textContent = environment.temperature || '--';
    document.getElementById('airQuality').textContent = environment.airQuality || '--';
    document.getElementById('humidity').textContent = environment.humidity || '--';
  }

  displayFacilities(facilities) {
    const container = document.getElementById('facilitiesList');

    if (!facilities || facilities.length === 0) {
      container.innerHTML = '<p class="no-data">No facilities found</p>';
      return;
    }

    const html = facilities.map(facility => `
      <div class="facility-item">
        <div class="facility-name">${facility.name}</div>
        <div>
          <span class="facility-type">${facility.type}</span>
          <span class="facility-distance">${facility.distance}</span>
        </div>
      </div>
    `).join('');

    container.innerHTML = html;
  }

  displayReports(reports) {
    const container = document.getElementById('reportsList');

    if (!reports || reports.length === 0) {
      container.innerHTML = '<p class="no-data">No reports found</p>';
      return;
    }

    const html = reports.map(report => `
      <div class="report-item">
        <div class="report-title">${report.title}</div>
        <div class="report-meta">
          <span class="report-status ${report.status}">${report.status}</span> · ${report.date}
        </div>
        <div class="report-description">${report.description}</div>
      </div>
    `).join('');

    container.innerHTML = html;
  }

  showLoading() {
    document.getElementById('loadingIndicator').classList.remove('hidden');
  }

  hideLoading() {
    document.getElementById('loadingIndicator').classList.add('hidden');
  }

  showDataContainer() {
    document.getElementById('dataContainer').classList.remove('hidden');
  }

  hideDataContainer() {
    document.getElementById('dataContainer').classList.add('hidden');
  }

  showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
  }

  hideError() {
    document.getElementById('errorMessage').classList.add('hidden');
  }

  showSuccess(message) {
    // Could implement a success notification
    console.log(message);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new UrbanReflexPopup();
});
