/**
 * AQSh asosiy yuk koridorlari tarmog'i.
 * Har bir bo'lak: yo'l kengligi, balandlik clearance, burilish qiyinligi, sifat.
 *
 * O'lchovlar taxminiy dispetcher/DOT amaliyotiga asoslangan (ft).
 */

export interface RoadSegment {
  id: string;
  from: string;
  to: string;
  highway: string;
  distanceMiles: number;
  /** Foydali yo'l kengligi (lane + shoulder margin), ft */
  usableWidthFt: number;
  /** Ko'prik/tunnel clearance, ft */
  clearanceHeightFt: number;
  /**
   * Burilish/interchange sharoiti 1–5
   * 1 = keng rampalar, 5 = tor shahar/tunel burilishlari
   */
  turnDifficulty: 1 | 2 | 3 | 4 | 5;
  /** Minimal tavsiya etilgan burilish radiusi, ft */
  minTurnRadiusFt: number;
  /** Yo'l sifati 1–10 (pavement, tirbandlik, truck-friendly) */
  quality: number;
  notesUz: string;
}

/** Undirected freight graph edges */
export const ROAD_SEGMENTS: RoadSegment[] = [
  // West Coast I-5
  { id: 'SEA-PDX', from: 'SEA', to: 'PDX', highway: 'I-5', distanceMiles: 175, usableWidthFt: 12, clearanceHeightFt: 15.5, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'Shimoliy-g\'arbiy koridor, qishda zanjir ehtimoli.' },
  { id: 'PDX-SAC', from: 'PDX', to: 'SAC', highway: 'I-5', distanceMiles: 580, usableWidthFt: 12, clearanceHeightFt: 14.5, turnDifficulty: 3, minTurnRadiusFt: 50, quality: 7, notesUz: 'Siskiyou Pass — balandlik va burilish diqqat talab qiladi.' },
  { id: 'SAC-SFO', from: 'SAC', to: 'SFO', highway: 'I-80', distanceMiles: 90, usableWidthFt: 11.5, clearanceHeightFt: 14.5, turnDifficulty: 3, minTurnRadiusFt: 45, quality: 7, notesUz: 'Bay Area kirish yo\'llari torroq.' },
  { id: 'SAC-LAX', from: 'SAC', to: 'LAX', highway: 'I-5', distanceMiles: 380, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 3, minTurnRadiusFt: 50, quality: 8, notesUz: 'Grapevine (Tejon) — uzunlik va tormoz nazorati.' },
  { id: 'SFO-LAX', from: 'SFO', to: 'LAX', highway: 'I-5 / US-101', distanceMiles: 380, usableWidthFt: 11.5, clearanceHeightFt: 14.5, turnDifficulty: 3, minTurnRadiusFt: 48, quality: 7, notesUz: 'Markaziy vodiydan yoki sohil yo\'lidan.' },

  // Southwest
  { id: 'LAX-LAS', from: 'LAX', to: 'LAS', highway: 'I-15', distanceMiles: 270, usableWidthFt: 12, clearanceHeightFt: 15.5, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'Cajon Pass — nishab va shamol.' },
  { id: 'LAX-PHX', from: 'LAX', to: 'PHX', highway: 'I-10', distanceMiles: 370, usableWidthFt: 12, clearanceHeightFt: 16, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 9, notesUz: 'Janubiy quyosh koridori, yaxshi clearance.' },
  { id: 'LAS-PHX', from: 'LAS', to: 'PHX', highway: 'US-93 / I-10', distanceMiles: 300, usableWidthFt: 11, clearanceHeightFt: 14.5, turnDifficulty: 3, minTurnRadiusFt: 50, quality: 6, notesUz: 'Ba\'zi qismlar torroq, sifat o\'rtacha.' },
  { id: 'PHX-ABQ', from: 'PHX', to: 'ABQ', highway: 'I-40', distanceMiles: 420, usableWidthFt: 12, clearanceHeightFt: 15.5, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'I-40 Flagstaff orqali — qishda zanjir.' },
  { id: 'LAS-SLC', from: 'LAS', to: 'SLC', highway: 'I-15', distanceMiles: 420, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'I-15 shimoliy yo\'nalish.' },
  { id: 'SLC-DEN', from: 'SLC', to: 'DEN', highway: 'I-80 / I-70', distanceMiles: 520, usableWidthFt: 11.5, clearanceHeightFt: 14, turnDifficulty: 4, minTurnRadiusFt: 55, quality: 6, notesUz: 'Tog\'li yo\'llar, Eisenhower tunnel cheklovlari.' },
  { id: 'DEN-ABQ', from: 'DEN', to: 'ABQ', highway: 'I-25', distanceMiles: 440, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 3, minTurnRadiusFt: 48, quality: 7, notesUz: 'Raton Pass — balandlik va shamol.' },
  { id: 'ABQ-ELP', from: 'ABQ', to: 'ELP', highway: 'I-25 / I-10', distanceMiles: 270, usableWidthFt: 12, clearanceHeightFt: 15.5, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'Janubi-g\'arbiy tranzit.' },
  { id: 'ELP-SAT', from: 'ELP', to: 'SAT', highway: 'I-10', distanceMiles: 550, usableWidthFt: 12, clearanceHeightFt: 16, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 9, notesUz: 'Keng I-10 Texas koridori.' },
  { id: 'PHX-ELP', from: 'PHX', to: 'ELP', highway: 'I-10', distanceMiles: 350, usableWidthFt: 12, clearanceHeightFt: 16, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 9, notesUz: 'I-10 to\'g\'ridan-to\'g\'ri.' },

  // Texas hub
  { id: 'SAT-HOU', from: 'SAT', to: 'HOU', highway: 'I-10', distanceMiles: 200, usableWidthFt: 12, clearanceHeightFt: 15.5, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'San Antonio–Xyuston.' },
  { id: 'SAT-DFW', from: 'SAT', to: 'DFW', highway: 'I-35', distanceMiles: 275, usableWidthFt: 12, clearanceHeightFt: 15.5, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 9, notesUz: 'I-35 NAFTA o\'qi.' },
  { id: 'SAT-LRD', from: 'SAT', to: 'LRD', highway: 'I-35', distanceMiles: 155, usableWidthFt: 12, clearanceHeightFt: 15.5, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'Meksika chegarasiga.' },
  { id: 'DFW-HOU', from: 'DFW', to: 'HOU', highway: 'I-45', distanceMiles: 240, usableWidthFt: 12, clearanceHeightFt: 15.5, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'Dallas–Xyuston.' },
  { id: 'DFW-OKC', from: 'DFW', to: 'OKC', highway: 'I-35', distanceMiles: 205, usableWidthFt: 12, clearanceHeightFt: 15.5, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 9, notesUz: 'I-35 shimol.' },
  { id: 'HOU-MSY', from: 'HOU', to: 'MSY', highway: 'I-10', distanceMiles: 350, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'Gulf Coast I-10.' },
  { id: 'LRD-HOU', from: 'LRD', to: 'HOU', highway: 'US-59 / I-69', distanceMiles: 315, usableWidthFt: 11.5, clearanceHeightFt: 14.5, turnDifficulty: 3, minTurnRadiusFt: 48, quality: 7, notesUz: 'Chegara yuklari uchun muqobil.' },

  // Central Plains
  { id: 'OKC-MCI', from: 'OKC', to: 'MCI', highway: 'I-35', distanceMiles: 350, usableWidthFt: 12, clearanceHeightFt: 15.5, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'Plains I-35.' },
  { id: 'DFW-MCI', from: 'DFW', to: 'MCI', highway: 'I-35', distanceMiles: 500, usableWidthFt: 12, clearanceHeightFt: 15.5, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'Dallas–Kanzas-Siti.' },
  { id: 'MCI-OMA', from: 'MCI', to: 'OMA', highway: 'I-29', distanceMiles: 185, usableWidthFt: 12, clearanceHeightFt: 15.5, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'I-29 shimol.' },
  { id: 'OMA-MSP', from: 'OMA', to: 'MSP', highway: 'I-29 / I-35', distanceMiles: 380, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'Shimoliy plains.' },
  { id: 'MCI-CHI', from: 'MCI', to: 'CHI', highway: 'I-35 / I-55', distanceMiles: 510, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'Markaziy Midwest koridori.' },
  { id: 'MCI-STL', from: 'MCI', to: 'STL', highway: 'I-70', distanceMiles: 250, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'I-70 sharq.' },
  { id: 'DEN-MCI', from: 'DEN', to: 'MCI', highway: 'I-70', distanceMiles: 600, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'I-70 plains — keng va sifatli.' },
  { id: 'DEN-OMA', from: 'DEN', to: 'OMA', highway: 'I-76 / I-80', distanceMiles: 540, usableWidthFt: 12, clearanceHeightFt: 15.5, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'I-80 sharqiy qismi.' },
  { id: 'SLC-OMA', from: 'SLC', to: 'OMA', highway: 'I-80', distanceMiles: 950, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 3, minTurnRadiusFt: 50, quality: 7, notesUz: 'I-80 Wyoming — shamol blow-over xavfi.' },

  // South Central / Southeast
  { id: 'MEM-MSY', from: 'MEM', to: 'MSY', highway: 'I-55', distanceMiles: 395, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'I-55 janub.' },
  { id: 'MEM-ATL', from: 'MEM', to: 'ATL', highway: 'I-22 / I-20', distanceMiles: 380, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'Memfis–Atlanta.' },
  { id: 'MEM-STL', from: 'MEM', to: 'STL', highway: 'I-55', distanceMiles: 285, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'I-55 shimol.' },
  { id: 'MEM-BNA', from: 'MEM', to: 'BNA', highway: 'I-40', distanceMiles: 210, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 9, notesUz: 'I-40 Tennessee.' },
  { id: 'DFW-MEM', from: 'DFW', to: 'MEM', highway: 'I-30 / I-40', distanceMiles: 450, usableWidthFt: 12, clearanceHeightFt: 15.5, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'Janubiy I-30/I-40.' },
  { id: 'HOU-MEM', from: 'HOU', to: 'MEM', highway: 'US-59 / I-30', distanceMiles: 570, usableWidthFt: 11.5, clearanceHeightFt: 14.5, turnDifficulty: 3, minTurnRadiusFt: 48, quality: 7, notesUz: 'Muqobil janubiy yo\'l.' },
  { id: 'STL-CHI', from: 'STL', to: 'CHI', highway: 'I-55', distanceMiles: 300, usableWidthFt: 12, clearanceHeightFt: 14.5, turnDifficulty: 3, minTurnRadiusFt: 48, quality: 7, notesUz: 'Chikago yaqinida tirbandlik.' },
  { id: 'STL-IND', from: 'STL', to: 'IND', highway: 'I-70', distanceMiles: 240, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'I-70 Midwest.' },
  { id: 'CHI-MSP', from: 'CHI', to: 'MSP', highway: 'I-90 / I-94', distanceMiles: 410, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'Shimoliy Midwest.' },
  { id: 'CHI-MKE', from: 'CHI', to: 'MKE', highway: 'I-94', distanceMiles: 90, usableWidthFt: 12, clearanceHeightFt: 14.5, turnDifficulty: 3, minTurnRadiusFt: 45, quality: 7, notesUz: 'Qisqa shaharlararo.' },
  { id: 'CHI-IND', from: 'CHI', to: 'IND', highway: 'I-65', distanceMiles: 185, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'I-65 janub.' },
  { id: 'CHI-DET', from: 'CHI', to: 'DET', highway: 'I-94', distanceMiles: 280, usableWidthFt: 12, clearanceHeightFt: 14.5, turnDifficulty: 3, minTurnRadiusFt: 48, quality: 7, notesUz: 'I-94 avtomobil sanoati.' },

  // Midwest East
  { id: 'IND-CMH', from: 'IND', to: 'CMH', highway: 'I-70', distanceMiles: 175, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 9, notesUz: 'Rickenbacker logistika zonasi.' },
  { id: 'IND-SDF', from: 'IND', to: 'SDF', highway: 'I-65', distanceMiles: 115, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'I-65 Kentucky.' },
  { id: 'SDF-BNA', from: 'SDF', to: 'BNA', highway: 'I-65', distanceMiles: 175, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'I-65 janub.' },
  { id: 'BNA-ATL', from: 'BNA', to: 'ATL', highway: 'I-24 / I-75', distanceMiles: 250, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'Neshvill–Atlanta.' },
  { id: 'CMH-CLE', from: 'CMH', to: 'CLE', highway: 'I-71', distanceMiles: 140, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'Ohio I-71.' },
  { id: 'DET-CLE', from: 'DET', to: 'CLE', highway: 'I-75 / I-90', distanceMiles: 170, usableWidthFt: 12, clearanceHeightFt: 14.5, turnDifficulty: 3, minTurnRadiusFt: 48, quality: 7, notesUz: 'Buyuk ko\'llar koridori.' },
  { id: 'CLE-PIT', from: 'CLE', to: 'PIT', highway: 'I-76 / I-80', distanceMiles: 135, usableWidthFt: 11.5, clearanceHeightFt: 14.5, turnDifficulty: 3, minTurnRadiusFt: 50, quality: 7, notesUz: 'Appalachian yaqinida burilishlar.' },
  { id: 'CMH-PIT', from: 'CMH', to: 'PIT', highway: 'I-70', distanceMiles: 185, usableWidthFt: 12, clearanceHeightFt: 14.5, turnDifficulty: 3, minTurnRadiusFt: 48, quality: 7, notesUz: 'I-70 Appalachian.' },
  { id: 'PIT-PHL', from: 'PIT', to: 'PHL', highway: 'I-76 PA Turnpike', distanceMiles: 300, usableWidthFt: 11.5, clearanceHeightFt: 14, turnDifficulty: 4, minTurnRadiusFt: 55, quality: 6, notesUz: 'Turnpike — to\'lov + tunnel balandligi cheklovlari.' },
  { id: 'PIT-BUF', from: 'PIT', to: 'BUF', highway: 'I-79 / I-90', distanceMiles: 220, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'Shimoli-sharqiy yo\'l.' },

  // Southeast Atlantic
  { id: 'ATL-CLT', from: 'ATL', to: 'CLT', highway: 'I-85', distanceMiles: 245, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'I-85 Piedmont.' },
  { id: 'ATL-SAV', from: 'ATL', to: 'SAV', highway: 'I-16', distanceMiles: 250, usableWidthFt: 12, clearanceHeightFt: 15.5, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 9, notesUz: 'Savanna portiga.' },
  { id: 'ATL-JAX', from: 'ATL', to: 'JAX', highway: 'I-75 / I-10', distanceMiles: 345, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'Florida shimoli.' },
  { id: 'JAX-MIA', from: 'JAX', to: 'MIA', highway: 'I-95', distanceMiles: 345, usableWidthFt: 12, clearanceHeightFt: 14.5, turnDifficulty: 3, minTurnRadiusFt: 48, quality: 7, notesUz: 'I-95 Florida — tirbandlik.' },
  { id: 'SAV-JAX', from: 'SAV', to: 'JAX', highway: 'I-95', distanceMiles: 140, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'Sohil I-95.' },
  { id: 'CLT-RDU', from: 'CLT', to: 'RDU', highway: 'I-85 / I-40', distanceMiles: 170, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'Carolinas.' },
  { id: 'CLT-RIC', from: 'CLT', to: 'RIC', highway: 'I-85 / I-95', distanceMiles: 290, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'Carolinas–Virginia.' },
  { id: 'RDU-RIC', from: 'RDU', to: 'RIC', highway: 'I-85 / I-95', distanceMiles: 160, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'I-85/I-95.' },
  { id: 'RIC-BWI', from: 'RIC', to: 'BWI', highway: 'I-95', distanceMiles: 110, usableWidthFt: 11.5, clearanceHeightFt: 14.5, turnDifficulty: 3, minTurnRadiusFt: 48, quality: 7, notesUz: 'I-95 DC yaqinida tirbandlik.' },
  { id: 'BWI-PHL', from: 'BWI', to: 'PHL', highway: 'I-95', distanceMiles: 100, usableWidthFt: 11.5, clearanceHeightFt: 14, turnDifficulty: 4, minTurnRadiusFt: 52, quality: 6, notesUz: 'Tor shahar interchangelari.' },
  { id: 'PHL-EWR', from: 'PHL', to: 'EWR', highway: 'I-95 NJ Turnpike', distanceMiles: 90, usableWidthFt: 11, clearanceHeightFt: 13.5, turnDifficulty: 5, minTurnRadiusFt: 60, quality: 5, notesUz: 'NJ Turnpike — balandlik va burilish qattiq cheklov.' },
  { id: 'EWR-BOS', from: 'EWR', to: 'BOS', highway: 'I-95 / I-90', distanceMiles: 220, usableWidthFt: 11, clearanceHeightFt: 13.5, turnDifficulty: 4, minTurnRadiusFt: 55, quality: 6, notesUz: 'Shimoli-sharqiy megalopolis — tor yo\'llar.' },
  { id: 'BUF-EWR', from: 'BUF', to: 'EWR', highway: 'I-81 / I-80', distanceMiles: 370, usableWidthFt: 12, clearanceHeightFt: 14.5, turnDifficulty: 3, minTurnRadiusFt: 48, quality: 7, notesUz: 'Ichki NY koridori (shahar 95 dan yaxshiroq).' },
  { id: 'CLE-BUF', from: 'CLE', to: 'BUF', highway: 'I-90', distanceMiles: 190, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'I-90 qirg\'oq.' },
  { id: 'CHI-CLE', from: 'CHI', to: 'CLE', highway: 'I-80 / I-90', distanceMiles: 340, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'Indiana Toll Road.' },
  { id: 'IND-ATL', from: 'IND', to: 'ATL', highway: 'I-65 / I-24 / I-75', distanceMiles: 530, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'Midwest–Southeast magistrali.' },
  { id: 'MSY-ATL', from: 'MSY', to: 'ATL', highway: 'I-10 / I-65 / I-85', distanceMiles: 470, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'Gulf–Atlanta.' },
  { id: 'OKC-MEM', from: 'OKC', to: 'MEM', highway: 'I-40', distanceMiles: 465, usableWidthFt: 12, clearanceHeightFt: 15.5, turnDifficulty: 2, minTurnRadiusFt: 45, quality: 8, notesUz: 'I-40 o\'rta janub.' },
  { id: 'DEN-OKC', from: 'DEN', to: 'OKC', highway: 'I-25 / I-40', distanceMiles: 680, usableWidthFt: 12, clearanceHeightFt: 15, turnDifficulty: 3, minTurnRadiusFt: 48, quality: 7, notesUz: 'Tog\'dan plainsga.' },
];
