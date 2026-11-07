export interface FreightCity {
  id: string;
  name: string;
  nameUz: string;
  stateId: string;
  lat: number;
  lng: number;
  /** SVG Albers approx label for schematic overlays */
  hub?: boolean;
}

/** Asosiy yuk shaharlari — shahar-shahar yo'nalish qidiruvi uchun */
export const FREIGHT_CITIES: FreightCity[] = [
  { id: 'SEA', name: 'Seattle', nameUz: 'Sietl', stateId: 'WA', lat: 47.6062, lng: -122.3321, hub: true },
  { id: 'PDX', name: 'Portland', nameUz: 'Portlend', stateId: 'OR', lat: 45.5152, lng: -122.6784 },
  { id: 'SAC', name: 'Sacramento', nameUz: 'Sakramento', stateId: 'CA', lat: 38.5816, lng: -121.4944 },
  { id: 'SFO', name: 'San Francisco Bay', nameUz: 'San-Fransisko', stateId: 'CA', lat: 37.7749, lng: -122.4194 },
  { id: 'LAX', name: 'Los Angeles / Inland Empire', nameUz: 'Los-Anjeles', stateId: 'CA', lat: 34.0522, lng: -118.2437, hub: true },
  { id: 'LAS', name: 'Las Vegas', nameUz: 'Las-Vegas', stateId: 'NV', lat: 36.1699, lng: -115.1398 },
  { id: 'PHX', name: 'Phoenix', nameUz: 'Feniks', stateId: 'AZ', lat: 33.4484, lng: -112.0740, hub: true },
  { id: 'SLC', name: 'Salt Lake City', nameUz: 'Solt-Leyk-Siti', stateId: 'UT', lat: 40.7608, lng: -111.8910, hub: true },
  { id: 'DEN', name: 'Denver', nameUz: 'Denver', stateId: 'CO', lat: 39.7392, lng: -104.9903, hub: true },
  { id: 'ABQ', name: 'Albuquerque', nameUz: 'Albukerke', stateId: 'NM', lat: 35.0844, lng: -106.6504 },
  { id: 'ELP', name: 'El Paso', nameUz: 'El-Paso', stateId: 'TX', lat: 31.7619, lng: -106.4850 },
  { id: 'DFW', name: 'Dallas–Fort Worth', nameUz: 'Dallas–Fort-Uort', stateId: 'TX', lat: 32.7767, lng: -96.7970, hub: true },
  { id: 'HOU', name: 'Houston', nameUz: 'Xyuston', stateId: 'TX', lat: 29.7604, lng: -95.3698, hub: true },
  { id: 'SAT', name: 'San Antonio', nameUz: 'San-Antonio', stateId: 'TX', lat: 29.4241, lng: -98.4936 },
  { id: 'LRD', name: 'Laredo', nameUz: 'Laredo', stateId: 'TX', lat: 27.5306, lng: -99.4803, hub: true },
  { id: 'OKC', name: 'Oklahoma City', nameUz: 'Oklahoma-Siti', stateId: 'OK', lat: 35.4676, lng: -97.5164 },
  { id: 'MCI', name: 'Kansas City', nameUz: 'Kanzas-Siti', stateId: 'MO', lat: 39.0997, lng: -94.5786, hub: true },
  { id: 'OMA', name: 'Omaha', nameUz: 'Omaha', stateId: 'NE', lat: 41.2565, lng: -95.9345 },
  { id: 'MSP', name: 'Minneapolis–St. Paul', nameUz: 'Minneapolis', stateId: 'MN', lat: 44.9778, lng: -93.2650 },
  { id: 'STL', name: 'St. Louis', nameUz: 'Sent-Luis', stateId: 'MO', lat: 38.6270, lng: -90.1994 },
  { id: 'MEM', name: 'Memphis', nameUz: 'Memfis', stateId: 'TN', lat: 35.1495, lng: -90.0490, hub: true },
  { id: 'MSY', name: 'New Orleans', nameUz: 'Nyu-Orlean', stateId: 'LA', lat: 29.9511, lng: -90.0715 },
  { id: 'CHI', name: 'Chicago', nameUz: 'Chikago', stateId: 'IL', lat: 41.8781, lng: -87.6298, hub: true },
  { id: 'IND', name: 'Indianapolis', nameUz: 'Indianapolis', stateId: 'IN', lat: 39.7684, lng: -86.1581, hub: true },
  { id: 'CMH', name: 'Columbus', nameUz: 'Kolumbus', stateId: 'OH', lat: 39.9612, lng: -82.9988, hub: true },
  { id: 'DET', name: 'Detroit', nameUz: 'Detroyt', stateId: 'MI', lat: 42.3314, lng: -83.0458 },
  { id: 'CLE', name: 'Cleveland', nameUz: 'Klivlend', stateId: 'OH', lat: 41.4993, lng: -81.6944 },
  { id: 'PIT', name: 'Pittsburgh', nameUz: 'Pittsburg', stateId: 'PA', lat: 40.4406, lng: -79.9959 },
  { id: 'SDF', name: 'Louisville', nameUz: 'Luisvill', stateId: 'KY', lat: 38.2527, lng: -85.7585 },
  { id: 'BNA', name: 'Nashville', nameUz: 'Neshvill', stateId: 'TN', lat: 36.1627, lng: -86.7816 },
  { id: 'ATL', name: 'Atlanta', nameUz: 'Atlanta', stateId: 'GA', lat: 33.7490, lng: -84.3880, hub: true },
  { id: 'CLT', name: 'Charlotte', nameUz: 'Sharlotta', stateId: 'NC', lat: 35.2271, lng: -80.8431 },
  { id: 'JAX', name: 'Jacksonville', nameUz: 'Jeksonvill', stateId: 'FL', lat: 30.3322, lng: -81.6557 },
  { id: 'MIA', name: 'Miami', nameUz: 'Mayami', stateId: 'FL', lat: 25.7617, lng: -80.1918 },
  { id: 'SAV', name: 'Savannah', nameUz: 'Savanna', stateId: 'GA', lat: 32.0809, lng: -81.0912, hub: true },
  { id: 'RDU', name: 'Raleigh–Durham', nameUz: 'Reyli', stateId: 'NC', lat: 35.7796, lng: -78.6382 },
  { id: 'RIC', name: 'Richmond', nameUz: 'Richmond', stateId: 'VA', lat: 37.5407, lng: -77.4360 },
  { id: 'BWI', name: 'Baltimore', nameUz: 'Baltimor', stateId: 'MD', lat: 39.2904, lng: -76.6122 },
  { id: 'PHL', name: 'Philadelphia', nameUz: 'Filadelfiya', stateId: 'PA', lat: 39.9526, lng: -75.1652 },
  { id: 'EWR', name: 'Newark / NYC Metro', nameUz: 'Nyuyork metro', stateId: 'NJ', lat: 40.7357, lng: -74.1724, hub: true },
  { id: 'BOS', name: 'Boston', nameUz: 'Boston', stateId: 'MA', lat: 42.3601, lng: -71.0589 },
  { id: 'BUF', name: 'Buffalo', nameUz: 'Buffalo', stateId: 'NY', lat: 42.8864, lng: -78.8784 },
  { id: 'MKE', name: 'Milwaukee', nameUz: 'Miluoki', stateId: 'WI', lat: 43.0389, lng: -87.9065 },
];

export const CITIES_BY_ID = new Map(FREIGHT_CITIES.map((c) => [c.id, c]));
