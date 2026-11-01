import { FreightHubPin, InterstateCorridor } from '../types/state';

// Highly-detailed, geographically proportional US state polygons (viewBox="0 0 960 620")
export const US_MAP_PATHS: Record<string, { path: string; x: number; y: number }> = {
  WA: {
    path: "M 92 48 L 196 60 L 182 128 L 142 122 L 118 128 L 96 112 L 85 86 Z",
    x: 140, y: 85
  },
  OR: {
    path: "M 85 86 L 96 112 L 118 128 L 142 122 L 182 128 L 168 214 L 82 196 L 72 136 Z",
    x: 125, y: 155
  },
  CA: {
    path: "M 82 196 L 168 214 L 148 288 L 208 392 L 182 434 L 142 398 L 114 366 L 78 274 Z",
    x: 124, y: 310
  },
  NV: {
    path: "M 168 214 L 238 226 L 214 348 L 182 358 L 148 288 Z",
    x: 192, y: 275
  },
  ID: {
    path: "M 178 58 L 206 62 L 198 122 L 238 156 L 228 228 L 168 214 L 182 128 Z",
    x: 196, y: 145
  },
  MT: {
    path: "M 206 62 L 368 82 L 354 172 L 238 156 L 198 122 Z",
    x: 285, y: 115
  },
  WY: {
    path: "M 238 156 L 354 172 L 338 258 L 226 242 Z",
    x: 285, y: 205
  },
  UT: {
    path: "M 226 228 L 292 238 L 286 332 L 216 322 L 214 348 Z",
    x: 252, y: 280
  },
  AZ: {
    path: "M 216 322 L 296 332 L 282 438 L 212 426 L 182 358 Z",
    x: 246, y: 380
  },
  CO: {
    path: "M 292 238 L 408 252 L 398 338 L 286 332 Z",
    x: 346, y: 285
  },
  NM: {
    path: "M 296 332 L 402 342 L 392 448 L 302 442 L 282 438 Z",
    x: 346, y: 390
  },
  ND: {
    path: "M 368 82 L 478 92 L 472 168 L 354 158 Z",
    x: 416, y: 125
  },
  SD: {
    path: "M 354 158 L 472 168 L 466 238 L 338 228 Z",
    x: 410, y: 195
  },
  NE: {
    path: "M 338 228 L 466 238 L 462 308 L 398 302 L 402 248 L 338 242 Z",
    x: 405, y: 265
  },
  KS: {
    path: "M 398 302 L 504 312 L 498 378 L 392 368 Z",
    x: 446, y: 335
  },
  OK: {
    path: "M 362 368 L 504 378 L 498 442 L 418 442 L 412 408 L 362 402 Z",
    x: 446, y: 405
  },
  TX: {
    path: "M 362 402 L 412 408 L 418 442 L 498 442 L 518 504 L 492 566 L 442 570 L 392 520 L 338 458 L 392 448 L 362 368 Z",
    x: 436, y: 485
  },
  MN: {
    path: "M 478 92 L 548 102 L 568 132 L 538 228 L 472 218 Z",
    x: 512, y: 160
  },
  IA: {
    path: "M 466 238 L 548 242 L 542 308 L 462 302 Z",
    x: 506, y: 270
  },
  MO: {
    path: "M 498 308 L 582 318 L 576 404 L 512 398 L 498 378 Z",
    x: 536, y: 350
  },
  AR: {
    path: "M 498 398 L 578 404 L 568 474 L 508 468 Z",
    x: 536, y: 430
  },
  LA: {
    path: "M 508 468 L 568 474 L 588 534 L 552 544 L 518 504 Z",
    x: 542, y: 500
  },
  WI: {
    path: "M 538 158 L 602 162 L 608 238 L 548 238 Z",
    x: 572, y: 195
  },
  IL: {
    path: "M 548 238 L 598 242 L 588 348 L 548 328 Z",
    x: 572, y: 285
  },
  MI: {
    path: "M 598 162 L 664 172 L 654 254 L 608 242 Z",
    x: 632, y: 200
  },
  IN: {
    path: "M 598 242 L 642 248 L 638 332 L 592 328 Z",
    x: 616, y: 285
  },
  KY: {
    path: "M 588 328 L 702 338 L 688 378 L 582 368 Z",
    x: 646, y: 345
  },
  TN: {
    path: "M 578 368 L 712 378 L 698 414 L 572 404 Z",
    x: 642, y: 388
  },
  MS: {
    path: "M 568 414 L 618 418 L 612 504 L 568 498 Z",
    x: 592, y: 455
  },
  AL: {
    path: "M 618 418 L 668 424 L 662 508 L 612 504 Z",
    x: 642, y: 460
  },
  GA: {
    path: "M 668 414 L 734 418 L 718 514 L 662 508 Z",
    x: 698, y: 460
  },
  FL: {
    path: "M 652 508 L 734 508 L 778 584 L 758 604 L 728 544 L 652 524 Z",
    x: 736, y: 545
  },
  OH: {
    path: "M 642 248 L 708 252 L 698 328 L 638 322 Z",
    x: 672, y: 285
  },
  WV: {
    path: "M 698 288 L 748 292 L 732 354 L 688 344 Z",
    x: 716, y: 320
  },
  VA: {
    path: "M 688 344 L 798 348 L 778 388 L 698 378 Z",
    x: 746, y: 360
  },
  NC: {
    path: "M 698 378 L 818 388 L 788 438 L 712 424 Z",
    x: 762, y: 400
  },
  SC: {
    path: "M 712 424 L 778 434 L 752 484 L 698 468 Z",
    x: 736, y: 450
  },
  PA: {
    path: "M 708 238 L 794 248 L 784 298 L 698 288 Z",
    x: 746, y: 265
  },
  NY: {
    path: "M 728 168 L 814 178 L 804 248 L 748 238 Z",
    x: 772, y: 200
  },
  VT: {
    path: "M 808 148 L 828 148 L 822 198 L 804 198 Z",
    x: 814, y: 170
  },
  NH: {
    path: "M 828 148 L 848 148 L 838 198 L 822 198 Z",
    x: 834, y: 170
  },
  ME: {
    path: "M 842 98 L 888 112 L 872 178 L 838 162 Z",
    x: 862, y: 135
  },
  MA: {
    path: "M 804 198 L 868 202 L 862 222 L 804 218 Z",
    x: 836, y: 208
  },
  CT: {
    path: "M 808 222 L 838 222 L 832 242 L 808 242 Z",
    x: 822, y: 230
  },
  RI: {
    path: "M 838 222 L 852 222 L 848 242 L 838 242 Z",
    x: 844, y: 230
  },
  NJ: {
    path: "M 788 248 L 808 252 L 798 308 L 784 298 Z",
    x: 796, y: 275
  },
  DE: {
    path: "M 788 298 L 802 298 L 798 328 L 788 328 Z",
    x: 794, y: 310
  },
  MD: {
    path: "M 744 292 L 792 298 L 788 342 L 738 332 Z",
    x: 762, y: 310
  },
  DC: {
    path: "M 768 318 L 778 318 L 778 328 L 768 328 Z",
    x: 772, y: 322
  },
  AK: {
    path: "M 82 468 L 162 478 L 172 538 L 112 558 L 72 518 Z",
    x: 122, y: 515
  },
  HI: {
    path: "M 218 528 L 292 538 L 278 564 L 208 548 Z",
    x: 250, y: 545
  }
};

// Major Freight Hubs across the USA for dispatcher map overlay
export const MAJOR_FREIGHT_HUBS: FreightHubPin[] = [
  { id: 'CHI', name: 'Chicago (Joliet / BNSF / UP)', stateId: 'IL', x: 572, y: 260, type: 'Rail Ramp', importance: 'Crucial' },
  { id: 'DFW', name: 'Dallas - Fort Worth (Alliance)', stateId: 'TX', x: 446, y: 450, type: 'Mega Warehouse', importance: 'Crucial' },
  { id: 'LAX', name: 'Inland Empire (Ontario / Fontana / Long Beach)', stateId: 'CA', x: 130, y: 350, type: 'Port', importance: 'Crucial' },
  { id: 'ATL', name: 'Atlanta (I-285 Logistics Loop)', stateId: 'GA', x: 692, y: 440, type: 'Mega Warehouse', importance: 'Crucial' },
  { id: 'MEM', name: 'Memphis (FedEx World Hub / Rail)', stateId: 'TN', x: 590, y: 395, type: 'Air Hub', importance: 'Crucial' },
  { id: 'LRD', name: 'Laredo (World Trade Bridge / Mexico)', stateId: 'TX', x: 430, y: 560, type: 'Border Crossing', importance: 'Crucial' },
  { id: 'KC', name: 'Kansas City (Logistics Park KC)', stateId: 'MO', x: 504, y: 325, type: 'Rail Ramp', importance: 'High' },
  { id: 'COL', name: 'Columbus (Rickenbacker)', stateId: 'OH', x: 672, y: 290, type: 'Mega Warehouse', importance: 'High' },
  { id: 'SAV', name: 'Savannah (Ocean Port)', stateId: 'GA', x: 730, y: 455, type: 'Port', importance: 'High' },
  { id: 'EWR', name: 'Port Newark / Elizabeth', stateId: 'NJ', x: 798, y: 265, type: 'Port', importance: 'Crucial' },
  { id: 'SEA', name: 'Seattle / Tacoma (NWSA)', stateId: 'WA', x: 110, y: 75, type: 'Port', importance: 'High' },
  { id: 'IND', name: 'Indianapolis (FedEx Hub)', stateId: 'IN', x: 622, y: 290, type: 'Air Hub', importance: 'High' },
  { id: 'SLC', name: 'Salt Lake City', stateId: 'UT', x: 250, y: 265, type: 'Rail Ramp', importance: 'High' },
  { id: 'DEN', name: 'Denver (I-70 / I-25 Hub)', stateId: 'CO', x: 355, y: 275, type: 'Mega Warehouse', importance: 'High' },
  { id: 'PHX', name: 'Phoenix Metro', stateId: 'AZ', x: 235, y: 390, type: 'Mega Warehouse', importance: 'High' }
];

// Major US Freight Interstates (Corridors)
export const MAJOR_CORRIDORS: InterstateCorridor[] = [
  {
    code: 'I-80',
    name: 'I-80 (San Francisco - New York)',
    color: '#f59e0b',
    path: 'M 100 270 L 160 250 L 250 265 L 290 238 L 400 260 L 500 270 L 572 265 L 670 260 L 750 260 L 795 265',
    description: 'AQShning eng asosiy sharq-g\'arb koridori. Donner Pass (CA) va Elk Mountain (WY) xavfli tog\' qismlariga ega.'
  },
  {
    code: 'I-90',
    name: 'I-90 (Seattle - Boston)',
    color: '#38bdf8',
    path: 'M 110 75 L 180 85 L 280 110 L 410 120 L 510 145 L 570 235 L 670 235 L 770 200 L 840 205',
    description: 'Eng shimoliy qirg\'oqdan-qirg\'oqqa magistral. Qish oylarida qor bo\'ronlari (blizzards) ko\'p bo\'ladi.'
  },
  {
    code: 'I-10',
    name: 'I-10 (Los Angeles - Jacksonville)',
    color: '#10b981',
    path: 'M 130 350 L 235 390 L 340 440 L 436 490 L 542 505 L 642 510 L 735 515',
    description: 'Janubiy Quyosh mintaqasi koridori. Texas hududida 880 mil uzunlikka ega, qishda zanjir talab qilinmaydi.'
  },
  {
    code: 'I-40',
    name: 'I-40 (Barstow - Wilmington)',
    color: '#a855f7',
    path: 'M 160 320 L 246 345 L 346 350 L 446 375 L 536 385 L 590 395 L 642 388 L 760 400',
    description: 'O\'rta-janubiy mega yuk arteriyasi. Flagstaff (AZ), Albuquerque (NM), Memphis (TN) orqali o\'tadi.'
  },
  {
    code: 'I-35',
    name: 'I-35 (Laredo - Duluth "NAFTA")',
    color: '#ec4899',
    path: 'M 430 560 L 440 500 L 446 450 L 446 405 L 446 335 L 505 270 L 512 160',
    description: 'AQShning markaziy shimol-janub o\'qi. Laredo (Meksika) yuklarini DFW, Kansas City va Minnesotaga olib boradi.'
  },
  {
    code: 'I-95',
    name: 'I-95 (Miami - Maine)',
    color: '#f97316',
    path: 'M 758 590 L 736 515 L 736 450 L 762 400 L 746 360 L 762 310 L 796 275 L 836 208 L 862 135',
    description: 'Sharqiy qirg\'oq poytaxti. Miami, Atlanta yaqini, DC, Philadelphia, New York, Boston koridori.'
  },
  {
    code: 'I-5',
    name: 'I-5 (San Diego - Seattle)',
    color: '#06b6d4',
    path: 'M 142 398 L 130 350 L 124 310 L 125 155 L 110 75',
    description: 'Tinch okeani vertikal magistrali. Siskiyou Pass (OR/CA) va Grapevine (CA) tog\'lariga ega.'
  }
];
