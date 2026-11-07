import { FREIGHT_CITIES, CITIES_BY_ID, FreightCity } from '../data/cities';
import { ROAD_SEGMENTS, RoadSegment } from '../data/roadNetwork';

export interface TruckSpecs {
  /** Yuk / treyler kengligi, ft */
  cargoWidthFt: number;
  /** Yuk balandligi (yeridan tepagacha yoki treyler balandligi), ft */
  cargoHeightFt: number;
  /** Umumiy uzunlik (traktor + treyler), ft */
  truckLengthFt: number;
  /** Burilish radiusi talabi, ft (kichikroq = yaxshiroq manevr) */
  turnRadiusFt: number;
  /** Yon bo'shliq zahirasi, ft */
  widthMarginFt?: number;
  /** Balandlik zahirasi, ft */
  heightMarginFt?: number;
}

export interface SegmentBlockReason {
  segmentId: string;
  highway: string;
  reasons: string[];
}

export interface RouteLeg {
  segment: RoadSegment;
  fromCity: FreightCity;
  toCity: FreightCity;
}

export interface ScoredRoute {
  cityPath: string[];
  legs: RouteLeg[];
  totalMiles: number;
  avgQuality: number;
  /** Past = yaxshiroq (masofa / sifat + jarimalar) */
  score: number;
  blockedAlternatives: SegmentBlockReason[];
  summaryUz: string;
}

export interface RouteSearchResult {
  routes: ScoredRoute[];
  blockedSegments: SegmentBlockReason[];
  origin: FreightCity;
  destination: FreightCity;
  truck: TruckSpecs;
  messageUz: string;
}

function otherEnd(seg: RoadSegment, cityId: string): string | null {
  if (seg.from === cityId) return seg.to;
  if (seg.to === cityId) return seg.from;
  return null;
}

export function evaluateSegment(
  seg: RoadSegment,
  truck: TruckSpecs
): { ok: boolean; reasons: string[] } {
  const widthMargin = truck.widthMarginFt ?? 0.5;
  const heightMargin = truck.heightMarginFt ?? 0.25;
  const reasons: string[] = [];

  if (truck.cargoWidthFt + widthMargin > seg.usableWidthFt) {
    reasons.push(
      `Yo'l kengligi yetarli emas: kerak ${ (truck.cargoWidthFt + widthMargin).toFixed(1) } ft, yo'lda ${seg.usableWidthFt} ft`
    );
  }
  if (truck.cargoHeightFt + heightMargin > seg.clearanceHeightFt) {
    reasons.push(
      `Balandlik clearance yetarli emas: yuk ${truck.cargoHeightFt.toFixed(1)} ft (+${heightMargin}), clearance ${seg.clearanceHeightFt} ft`
    );
  }
  // Uzun fura + qiyin burilish
  if (truck.truckLengthFt >= 65 && seg.turnDifficulty >= 4) {
    reasons.push(
      `Uzun fura (${truck.truckLengthFt} ft) uchun burilish sharoiti yomon (daraja ${seg.turnDifficulty}/5)`
    );
  }
  if (truck.turnRadiusFt > seg.minTurnRadiusFt + 5) {
    reasons.push(
      `Burilish radiusi katta: fura ${truck.turnRadiusFt} ft, yo'l tavsiyasi ≤ ${seg.minTurnRadiusFt} ft`
    );
  }
  // Extreme turn + wide cargo
  if (seg.turnDifficulty === 5 && truck.cargoWidthFt >= 8.5) {
    reasons.push(`Tor interchange + keng yuk (${truck.cargoWidthFt} ft) — xavfli`);
  }

  return { ok: reasons.length === 0, reasons };
}

function buildAdj(allowed: RoadSegment[]): Map<string, RoadSegment[]> {
  const adj = new Map<string, RoadSegment[]>();
  for (const seg of allowed) {
    if (!adj.has(seg.from)) adj.set(seg.from, []);
    if (!adj.has(seg.to)) adj.set(seg.to, []);
    adj.get(seg.from)!.push(seg);
    adj.get(seg.to)!.push(seg);
  }
  return adj;
}

function segmentCost(seg: RoadSegment, truck: TruckSpecs): number {
  const quality = Math.max(seg.quality, 1);
  let cost = seg.distanceMiles / quality;
  // Uzunlik va burilish jarimasi
  cost += seg.turnDifficulty * (truck.truckLengthFt / 53) * 8;
  // Kenglik bo'shliq qancha kam bo'lsa, shuncha jarima
  const widthSlack = seg.usableWidthFt - truck.cargoWidthFt;
  if (widthSlack < 2) cost += (2 - widthSlack) * 15;
  // Balandlik bo'shliq
  const heightSlack = seg.clearanceHeightFt - truck.cargoHeightFt;
  if (heightSlack < 1) cost += (1 - heightSlack) * 25;
  return cost;
}

/** k-shortest-ish: Dijkstra + simple yen for up to maxRoutes */
export function findTruckRoutes(
  originId: string,
  destinationId: string,
  truck: TruckSpecs,
  maxRoutes = 3
): RouteSearchResult {
  const origin = CITIES_BY_ID.get(originId);
  const destination = CITIES_BY_ID.get(destinationId);

  if (!origin || !destination) {
    return {
      routes: [],
      blockedSegments: [],
      origin: origin ?? FREIGHT_CITIES[0],
      destination: destination ?? FREIGHT_CITIES[1],
      truck,
      messageUz: 'Shaharni topib bo\'lmadi.',
    };
  }

  if (originId === destinationId) {
    return {
      routes: [],
      blockedSegments: [],
      origin,
      destination,
      truck,
      messageUz: 'Boshlang\'ich va manzil bir xil shahar.',
    };
  }

  const blockedSegments: SegmentBlockReason[] = [];
  const allowed: RoadSegment[] = [];

  for (const seg of ROAD_SEGMENTS) {
    const { ok, reasons } = evaluateSegment(seg, truck);
    if (ok) allowed.push(seg);
    else blockedSegments.push({ segmentId: seg.id, highway: seg.highway, reasons });
  }

  const adj = buildAdj(allowed);
  const routes: ScoredRoute[] = [];
  const usedSignatures = new Set<string>();

  // First route: classic Dijkstra
  const first = dijkstra(adj, originId, destinationId, truck);
  if (first) {
    const scored = toScoredRoute(first, originId, truck, blockedSegments);
    routes.push(scored);
    usedSignatures.add(scored.cityPath.join('>'));
  }

  // Diversify: temporarily remove one leg from best path and re-search
  if (first && maxRoutes > 1) {
    for (let i = 0; i < first.length && routes.length < maxRoutes; i++) {
      const banId = first[i].id;
      const filtered = allowed.filter((s) => s.id !== banId);
      const altAdj = buildAdj(filtered);
      const alt = dijkstra(altAdj, originId, destinationId, truck);
      if (!alt) continue;
      const scored = toScoredRoute(alt, originId, truck, blockedSegments);
      const sig = scored.cityPath.join('>');
      if (!usedSignatures.has(sig)) {
        usedSignatures.add(sig);
        routes.push(scored);
      }
    }
  }

  routes.sort((a, b) => a.score - b.score);

  return {
    routes,
    blockedSegments,
    origin,
    destination,
    truck,
    messageUz:
      routes.length > 0
        ? `${routes.length} ta mos yo'nalish topildi (eng yaqin + sifatli birinchi).`
        : `Mos yo'l topilmadi. Yuk o'lchamlari (${truck.cargoWidthFt}×${truck.cargoHeightFt} ft) yoki burilish talablari tarmoq cheklovlariga to'g'ri kelmayapti.`,
  };
}

function dijkstra(
  adj: Map<string, RoadSegment[]>,
  start: string,
  goal: string,
  truck: TruckSpecs
): RoadSegment[] | null {
  const dist = new Map<string, number>();
  const prev = new Map<string, { city: string; seg: RoadSegment } | null>();
  const visited = new Set<string>();

  for (const c of FREIGHT_CITIES) {
    dist.set(c.id, Infinity);
    prev.set(c.id, null);
  }
  dist.set(start, 0);

  while (visited.size < FREIGHT_CITIES.length) {
    let u: string | null = null;
    let best = Infinity;
    for (const [id, d] of dist) {
      if (!visited.has(id) && d < best) {
        best = d;
        u = id;
      }
    }
    if (u === null || best === Infinity) break;
    if (u === goal) break;
    visited.add(u);

    const edges = adj.get(u) || [];
    for (const seg of edges) {
      const v = otherEnd(seg, u);
      if (!v || visited.has(v)) continue;
      const nd = best + segmentCost(seg, truck);
      if (nd < (dist.get(v) ?? Infinity)) {
        dist.set(v, nd);
        prev.set(v, { city: u, seg });
      }
    }
  }

  if ((dist.get(goal) ?? Infinity) === Infinity) return null;

  const pathSegs: RoadSegment[] = [];
  let cur: string | null = goal;
  while (cur && cur !== start) {
    const p = prev.get(cur);
    if (!p) return null;
    pathSegs.push(p.seg);
    cur = p.city;
  }
  pathSegs.reverse();
  return pathSegs;
}

function toScoredRoute(
  segs: RoadSegment[],
  originId: string,
  truck: TruckSpecs,
  blocked: SegmentBlockReason[]
): ScoredRoute {
  const legs: RouteLeg[] = [];
  const cityPath: string[] = [originId];
  if (segs.length === 0) {
    return {
      cityPath: [],
      legs: [],
      totalMiles: 0,
      avgQuality: 0,
      score: Infinity,
      blockedAlternatives: blocked,
      summaryUz: '',
    };
  }

  let cur = originId;
  for (const seg of segs) {
    const next = otherEnd(seg, cur);
    if (!next) break;
    const fromCity = CITIES_BY_ID.get(cur)!;
    const toCity = CITIES_BY_ID.get(next)!;
    legs.push({ segment: seg, fromCity, toCity });
    cityPath.push(next);
    cur = next;
  }

  const totalMiles = segs.reduce((s, x) => s + x.distanceMiles, 0);
  const avgQuality =
    segs.reduce((s, x) => s + x.quality, 0) / Math.max(segs.length, 1);
  const score = segs.reduce((s, x) => s + segmentCost(x, truck), 0);

  const highways = [...new Set(segs.map((s) => s.highway))].join(' → ');
  const summaryUz = `${cityPath.map((id) => CITIES_BY_ID.get(id)?.name ?? id).join(' → ')} • ${totalMiles} mil • sifat ${avgQuality.toFixed(1)}/10 • ${highways}`;

  return {
    cityPath,
    legs,
    totalMiles,
    avgQuality,
    score,
    blockedAlternatives: blocked,
    summaryUz,
  };
}

/** Preset truck profiles for UI */
export const TRUCK_PRESETS: Record<
  string,
  { label: string; labelUz: string; specs: TruckSpecs }
> = {
  dry_van_53: {
    label: '53\' Dry Van',
    labelUz: '53 fut Dry Van',
    specs: { cargoWidthFt: 8.5, cargoHeightFt: 13.5, truckLengthFt: 70, turnRadiusFt: 45 },
  },
  reefer_53: {
    label: '53\' Reefer',
    labelUz: '53 fut Reefer',
    specs: { cargoWidthFt: 8.5, cargoHeightFt: 13.5, truckLengthFt: 70, turnRadiusFt: 45 },
  },
  flatbed: {
    label: '48\' Flatbed',
    labelUz: '48 fut Flatbed',
    specs: { cargoWidthFt: 8.5, cargoHeightFt: 8.5, truckLengthFt: 65, turnRadiusFt: 42 },
  },
  oversize_wide: {
    label: 'Oversize Wide',
    labelUz: 'Keng oversized yuk',
    specs: { cargoWidthFt: 10, cargoHeightFt: 13.5, truckLengthFt: 75, turnRadiusFt: 55 },
  },
  high_load: {
    label: 'High / Tall Load',
    labelUz: 'Baland yuk',
    specs: { cargoWidthFt: 8.5, cargoHeightFt: 14.5, truckLengthFt: 70, turnRadiusFt: 48 },
  },
  box_26: {
    label: '26\' Box Truck',
    labelUz: '26 fut Box Truck',
    specs: { cargoWidthFt: 8, cargoHeightFt: 12, truckLengthFt: 26, turnRadiusFt: 30 },
  },
};
