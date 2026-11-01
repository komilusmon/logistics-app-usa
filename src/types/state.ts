export interface StateData {
  id: string; // "AL", "TX", "WY", etc.
  name: string; // "Alabama", "Texas"
  nameUz?: string;
  nickname: string; // e.g. "The Lone Star State"
  aliases?: string[]; // ["W"] for Wyoming
  capital: string;
  largestCity: string;
  freightHubs: string[];
  timeZoneName: string; // e.g. "CST (Markaziy vaqt) / UTC-6"
  timeZoneId: string; // IANA e.g. "America/Chicago" for live clock
  secondaryTimeZone?: string;
  region: 'Northeast' | 'Southeast' | 'Midwest' | 'Southwest' | 'West' | 'Territory';
  regionUz: string; // "Shimoli-Sharqiy", "Janubi-Sharqiy", etc.
  interstates: string[];
  truckSpeedLimit: string;
  chainLaws: string;
  weighStationInfo: string;
  dieselTaxRate?: string;
  borderingStates: string[];
  logisticsNotesUz: string;
  coordinates: { lat: number; lng: number };
  svgLabelPos?: { x: number; y: number };
  isTerritory?: boolean;

  // Detailed Logistics & Dispatcher Specific Fields
  marketType: 'Outbound Heavy' | 'Inbound Consumer' | 'Balanced' | 'Transit Hub';
  marketTypeUz: string;
  primaryTrailers: string[]; // ['Dry Van', 'Reefer', 'Flatbed', 'Step Deck']
  kpraRule: string; // Kingpin to rear axle bridge formula rule
  maxHeight: string; // Standard height clearance
  tollSystems: string[]; // E-ZPass, PrePass, Bestpass, SunPass, TxTag
  dispatcherInsiderTip: string; // Real dispatcher insider trick/advice
  seasonalAlert: string; // Winter storms, hurricanes, high winds, mountain pass closures
  hasSpecialPermit?: boolean; // KY KYU, NM WDT, NY HUT, OR
  specialPermitName?: string;
  hasMandatoryChainLaw?: boolean;
}

export interface SearchResult {
  state: StateData | null;
  matchType: 'exact_code' | 'exact_name' | 'alias' | 'fuzzy' | 'none';
  query: string;
  suggestedState?: StateData;
  alternativeMatches?: StateData[];
  explanationUz?: string;
}

export interface FreightHubPin {
  id: string;
  name: string;
  stateId: string;
  x: number;
  y: number;
  type: 'Rail Ramp' | 'Port' | 'Mega Warehouse' | 'Air Hub' | 'Border Crossing';
  importance: 'Crucial' | 'High';
}

export interface InterstateCorridor {
  code: string;
  name: string;
  color: string;
  path: string;
  description: string;
}
