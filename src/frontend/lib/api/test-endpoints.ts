/**
 * ============================================================================
 * UrbanReflex — Smart City Intelligence Platform
 * Copyright (C) 2025  WAG
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * For more information, visit: https://github.com/minhe51805/UrbanReflex
 * ============================================================================
 */

// Test configuration
const API_BASE = '/api'; // or 'http://localhost:3000/api' for external testing

/**
 * Test 1: Fetch all roads
 */
export async function testFetchRoads() {
  console.log('🧪 Test 1: Fetch Roads');
  
  try {
    const response = await fetch(`${API_BASE}/roads?limit=10`);
    const data = await response.json();
    
    console.log('✅ Success:', {
      count: data.count,
      firstRoad: data.roads[0],
    });
    
    return data;
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

/**
 * Test 2: Fetch complete road data
 */
export async function testFetchRoadDetail(roadId: string) {
  console.log('🧪 Test 2: Fetch Road Detail');
  
  try {
    const response = await fetch(`${API_BASE}/roads/${encodeURIComponent(roadId)}`);
    const data = await response.json();
    
    console.log('✅ Success:', {
      roadName: data.road.name,
      weatherTemp: data.weather?.temperature,
      aqiStations: data.aqi.length,
      streetlightsTotal: data.streetlights.total,
      reportsCount: data.reports.length,
    });
    
    return data;
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

/**
 * Test 3: Fetch weather
 */
export async function testFetchWeather() {
  console.log('🧪 Test 3: Fetch Weather');
  
  try {
    const response = await fetch(`${API_BASE}/weather`);
    const weather = await response.json();
    
    console.log('✅ Success:', {
      temperature: weather.temperature,
      humidity: weather.relativeHumidity,
      windSpeed: weather.windSpeed,
      dewPoint: weather.dewPoint,
    });
    
    return weather;
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

/**
 * Test 4: Fetch AQI
 */
export async function testFetchAQI(lat = 10.78, lon = 106.7) {
  console.log('🧪 Test 4: Fetch AQI');
  
  try {
    const response = await fetch(`${API_BASE}/aqi?lat=${lat}&lon=${lon}&maxDistance=5000`);
    const data = await response.json();
    
    console.log('✅ Success:', {
      stationsCount: data.count,
      firstStation: data.stations[0],
    });
    
    return data;
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

/**
 * Test 5: Fetch streetlights
 */
export async function testFetchStreetlights(roadId?: string) {
  console.log('🧪 Test 5: Fetch Streetlights');
  
  try {
    const url = roadId 
      ? `${API_BASE}/streetlights?roadId=${encodeURIComponent(roadId)}`
      : `${API_BASE}/streetlights?limit=100`;
      
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('✅ Success:', {
      total: data.statistics.total,
      on: data.statistics.on,
      off: data.statistics.off,
    });
    
    return data;
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

/**
 * Test 6: Fetch reports
 */
export async function testFetchReports(lat?: number, lon?: number) {
  console.log('🧪 Test 6: Fetch Reports');

  try {
    const url = lat && lon
      ? `${API_BASE}/reports?lat=${lat}&lon=${lon}&maxDistance=1000`
      : `${API_BASE}/reports?limit=20`;
      
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('✅ Success:', {
      count: data.count,
      reports: data.reports,
    });
    
    return data;
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

/**
 * Test 7: Create report
 */
export async function testCreateReport() {
  console.log('🧪 Test 7: Create Report');
  
  const report = {
    id: `urn:ngsi-ld:CitizenReport:HCMC-TEST-${Date.now()}`,
    type: 'CitizenReport',
    '@context': ['https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld'],
    location: {
      type: 'GeoProperty',
      value: {
        type: 'Point',
        coordinates: [106.7008, 10.775],
      },
    },
    category: {
      type: 'Property',
      value: 'test',
    },
    status: {
      type: 'Property',
      value: 'submitted',
    },
    title: {
      type: 'Property',
      value: 'Test Report',
    },
    description: {
      type: 'Property',
      value: 'This is a test report from API testing',
    },
    priority: {
      type: 'Property',
      value: 'low',
    },
    dateCreated: {
      type: 'Property',
      value: {
        '@type': 'DateTime',
        '@value': new Date().toISOString(),
      },
    },
  };
  
  try {
    const response = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(report),
    });
    
    const result = await response.json();
    
    console.log('✅ Success:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

/**
 * Run all tests
 */
export async function runAllTests() {
  console.log('🚀 Running All Tests...\n');
  
  try {
    // Test 1: Fetch roads
    const roadsData = await testFetchRoads();
    console.log('\n');
    
    // Test 2: Fetch road detail (use first road from test 1)
    if (roadsData.roads.length > 0) {
      await testFetchRoadDetail(roadsData.roads[0].id);
      console.log('\n');
    }
    
    // Test 3: Fetch weather
    await testFetchWeather();
    console.log('\n');
    
    // Test 4: Fetch AQI
    await testFetchAQI();
    console.log('\n');
    
    // Test 5: Fetch streetlights
    await testFetchStreetlights();
    console.log('\n');
    
    // Test 6: Fetch reports
    await testFetchReports();
    console.log('\n');
    
    // Test 7: Create report (commented out to avoid creating test data)
    // await testCreateReport();
    // console.log('\n');
    
    console.log('✅ All tests completed!');
  } catch (error) {
    console.error('❌ Tests failed:', error);
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testAPI = {
    testFetchRoads,
    testFetchRoadDetail,
    testFetchWeather,
    testFetchAQI,
    testFetchStreetlights,
    testFetchReports,
    testCreateReport,
    runAllTests,
  };
  
  console.log('💡 Test functions available at window.testAPI');
  console.log('   Run: window.testAPI.runAllTests()');
}

