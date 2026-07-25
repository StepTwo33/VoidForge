/**
 * Wiki-locked bare paper for sentinel weapons (B14).
 * Source: Module:Weapons/data/companion Normal/Direct Attack.
 * Generated from catalog after per-id wiki patches — do not blanket-edit.
 */
export const SENTINEL_BARE_GOLDENS: Array<{
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
    "id": "artax",
    "damage": 5.0,
    "cold": 5.0,
    "criticalChance": 0.02,
    "criticalMultiplier": 1.5,
    "statusChance": 0.35,
    "fireRate": 16.67,
    "multishot": 1.0
  },
  {
    "id": "cryotra",
    "damage": 10.0,
    "impact": 10.0,
    "criticalChance": 0.1,
    "criticalMultiplier": 1.75,
    "statusChance": 0.1,
    "fireRate": 0.667,
    "multishot": 1.0
  },
  {
    "id": "deconstructor",
    "damage": 130.0,
    "impact": 130.0,
    "criticalChance": 0.0,
    "criticalMultiplier": 1.0,
    "statusChance": 0.25,
    "fireRate": 1.33,
    "multishot": 1.0
  },
  {
    "id": "deconstructor_prime",
    "damage": 160.0,
    "impact": 160.0,
    "criticalChance": 0.0,
    "criticalMultiplier": 1.0,
    "statusChance": 0.25,
    "fireRate": 1.33,
    "multishot": 1.0
  },
  {
    "id": "laser_rifle",
    "damage": 45.0,
    "impact": 4.5,
    "puncture": 36.0,
    "slash": 4.5,
    "criticalChance": 0.17,
    "criticalMultiplier": 1.75,
    "statusChance": 0.075,
    "fireRate": 5.0,
    "multishot": 1.0
  },
  {
    "id": "prime_laser_rifle",
    "damage": 55.0,
    "impact": 5.5,
    "puncture": 38.5,
    "slash": 11.0,
    "criticalChance": 0.2,
    "criticalMultiplier": 2.0,
    "statusChance": 0.1,
    "fireRate": 5.0,
    "multishot": 1.0
  },
  {
    "id": "stinger",
    "damage": 15.0,
    "toxin": 15.0,
    "criticalChance": 0.025,
    "criticalMultiplier": 1.5,
    "statusChance": 0.2,
    "fireRate": 3.33,
    "multishot": 1.0
  },
  {
    "id": "sweeper",
    "damage": 35.0,
    "impact": 29.75,
    "puncture": 1.75,
    "slash": 3.5,
    "criticalChance": 0.1,
    "criticalMultiplier": 1.75,
    "statusChance": 0.045,
    "fireRate": 1.0,
    "multishot": 6.0
  },
  {
    "id": "sweeper_prime",
    "damage": 45.0,
    "impact": 38.25,
    "puncture": 2.25,
    "slash": 4.5,
    "criticalChance": 0.1,
    "criticalMultiplier": 2.25,
    "statusChance": 0.05,
    "fireRate": 1.0,
    "multishot": 6.0
  },
  {
    "id": "tazicor",
    "damage": 5.0,
    "electricity": 5.0,
    "criticalChance": 0.05,
    "criticalMultiplier": 1.5,
    "statusChance": 0.25,
    "fireRate": 12.0,
    "multishot": 1.0
  },
  {
    "id": "verglas",
    "damage": 26.0,
    "cold": 26.0,
    "criticalChance": 0.08,
    "criticalMultiplier": 2.0,
    "statusChance": 0.34,
    "fireRate": 12.0,
    "multishot": 1.0
  },
  {
    "id": "vulklok",
    "damage": 175.0,
    "electricity": 175.0,
    "criticalChance": 0.35,
    "criticalMultiplier": 2.5,
    "statusChance": 0.25,
    "fireRate": 0.15,
    "multishot": 1.0
  }
] as const;
