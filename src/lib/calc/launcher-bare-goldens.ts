/**
 * Wiki-locked bare paper for category=launcher weapons (B17).
 * Source: Module:Weapons/data/primary Grenade Impact (direct hit only).
 */
export const LAUNCHER_BARE_GOLDENS: Array<{
  id: string;
  damage: number;
  impact?: number;
  puncture?: number;
  slash?: number;
  heat?: number;
  cold?: number;
  toxin?: number;
  electricity?: number;
  radiation?: number;
  viral?: number;
  corrosive?: number;
  blast?: number;
  gas?: number;
  magnetic?: number;
  criticalChance: number;
  criticalMultiplier: number;
  statusChance: number;
  fireRate: number;
  multishot: number;
}> = [
  {
    id: "secura_penta",
    damage: 75,
    impact: 75,
    criticalChance: 0.26,
    criticalMultiplier: 2,
    statusChance: 0.26,
    fireRate: 2,
    multishot: 1,
  },
  {
    id: "tenet_envoy",
    damage: 100,
    impact: 100,
    criticalChance: 0.28,
    criticalMultiplier: 2.6,
    statusChance: 0.24,
    fireRate: 0.8333,
    multishot: 1,
  },
];
