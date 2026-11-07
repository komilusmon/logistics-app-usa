import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateSegment, findTruckRoutes, TRUCK_PRESETS } from './truckRouteFinder';
import { ROAD_SEGMENTS } from '../data/roadNetwork';

describe('evaluateSegment', () => {
  it('blocks oversized width', () => {
    const seg = ROAD_SEGMENTS.find((s) => s.id === 'PHL-EWR')!;
    const result = evaluateSegment(seg, {
      cargoWidthFt: 12,
      cargoHeightFt: 13,
      truckLengthFt: 70,
      turnRadiusFt: 45,
    });
    assert.equal(result.ok, false);
    assert.ok(result.reasons.some((r) => r.includes('kengligi')));
  });

  it('allows standard dry van on open interstate', () => {
    const seg = ROAD_SEGMENTS.find((s) => s.id === 'LAX-PHX')!;
    const result = evaluateSegment(seg, TRUCK_PRESETS.dry_van_53.specs);
    assert.equal(result.ok, true);
  });
});

describe('findTruckRoutes', () => {
  it('finds CHI → DFW for dry van', () => {
    const result = findTruckRoutes('CHI', 'DFW', TRUCK_PRESETS.dry_van_53.specs, 3);
    assert.ok(result.routes.length >= 1);
    assert.equal(result.routes[0].cityPath[0], 'CHI');
    assert.equal(result.routes[0].cityPath.at(-1), 'DFW');
    assert.ok(result.routes[0].totalMiles > 0);
  });

  it('blocks extreme tall load on low-clearance corridors', () => {
    const tall = { ...TRUCK_PRESETS.high_load.specs, cargoHeightFt: 15.5 };
    const result = findTruckRoutes('PHL', 'EWR', tall, 3);
    // PHL-EWR has 13.5 clearance — should be blocked; may have no route or alternate
    const direct = result.blockedSegments.find((b) => b.segmentId === 'PHL-EWR');
    assert.ok(direct);
  });

  it('returns empty when same city', () => {
    const result = findTruckRoutes('CHI', 'CHI', TRUCK_PRESETS.dry_van_53.specs);
    assert.equal(result.routes.length, 0);
  });
});
