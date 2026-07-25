/**
 * Radial / AoE attack profiles sourced from https://wiki.warframe.com Module:Weapons/data.
 * Merged onto weapons in use-data.ts and loadout-stats.ts.
 * Regenerate: python scripts/generate_radial_attacks.py
 * Manual overrides: MANUAL_RADIAL_ATTACKS in generate_radial_attacks.py
 */

import type { WeaponRadialAttack } from "@/lib/types";

export const WEAPON_RADIAL_ATTACKS: Record<string, WeaponRadialAttack[]> = 
{
  "acceltra_prime": [
    {
      "name": "Rocket Explosion",
      "puncture": 42.4,
      "slash": 10.6,
      "totalDamage": 53.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    }
  ],
  "alternox_prime": [
    {
      "name": "Alt-Fire Explosion",
      "electricity": 140.0,
      "totalDamage": 140.0,
      "radius": 6.0,
      "falloffReduction": 0.6,
      "explosionDelay": 10.0
    }
  ],
  "astilla_prime": [
    {
      "name": "Glass Explosion",
      "puncture": 49.0,
      "slash": 91.0,
      "totalDamage": 140.0,
      "radius": 2.4,
      "falloffReduction": 0.3
    }
  ],
  "braton_prime": [
    {
      "name": "Incarnon Form AoE",
      "heat": 70.0,
      "totalDamage": 70.0,
      "radius": 3.0,
      "falloffReduction": 0.1
    }
  ],
  "braton_vandal": [
    {
      "name": "Incarnon Form AoE",
      "heat": 65.0,
      "totalDamage": 65.0,
      "radius": 3.0,
      "falloffReduction": 0.1
    }
  ],
  "burston_prime": [
    {
      "name": "Incarnon Form Radial Attack",
      "heat": 13.0,
      "totalDamage": 13.0,
      "radius": 2.0,
      "falloffReduction": 1.0
    }
  ],
  "carmine_penta": [
    {
      "name": "Grenade Detonation",
      "blast": 350.0,
      "totalDamage": 350.0,
      "radius": 4.0,
      "falloffReduction": 0.5
    }
  ],
  "cedo_prime": [
    {
      "name": "Glaive Radial Attack",
      "blast": 10.0,
      "totalDamage": 10.0,
      "radius": 6.0,
      "falloffReduction": 0.0
    }
  ],
  "coda_bassocyst": [
    {
      "name": "Alt-Fire",
      "blast": 303.0,
      "totalDamage": 303.0,
      "radius": 25.0
    }
  ],
  "coda_bubonico": [
    {
      "name": "Radial Attack",
      "viral": 143.0,
      "totalDamage": 143.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    }
  ],
  "coda_sporothrix": [
    {
      "name": "AoE",
      "slash": 25.0,
      "viral": 23.0,
      "totalDamage": 48.0,
      "radius": 2.0,
      "falloffReduction": 0.1,
      "explosionDelay": 0.9
    }
  ],
  "corinth_prime": [
    {
      "name": "Buckshot",
      "impact": 25.2,
      "puncture": 37.8,
      "slash": 27.0,
      "totalDamage": 90.0,
      "radius": 36.0,
      "falloffReduction": 0.64444
    },
    {
      "name": "Air Burst Explosion",
      "blast": 2200.0,
      "totalDamage": 2200.0,
      "radius": 9.8,
      "falloffReduction": 0.9
    }
  ],
  "efv_5_jupiter": [
    {
      "name": "Buckshot",
      "corrosive": 35.0,
      "puncture": 57.0,
      "slash": 35.0,
      "totalDamage": 127.0,
      "radius": 10.0,
      "falloffReduction": 0.9921
    }
  ],
  "gorgon_wraith": [
    {
      "name": "Incarnon Form AoE",
      "heat": 750.0,
      "totalDamage": 750.0,
      "radius": 5.0,
      "falloffReduction": 0.1,
      "explosionDelay": 0.9
    }
  ],
  "kuva_bramma": [
    {
      "name": "Radial Attack",
      "blast": 839.0,
      "totalDamage": 839.0,
      "radius": 8.3,
      "falloffReduction": 0.9
    },
    {
      "name": "Cluster Bomb Explosion",
      "blast": 57.0,
      "totalDamage": 57.0,
      "radius": 3.5,
      "falloffReduction": 0.5
    }
  ],
  "kuva_chakkhurr": [
    {
      "name": "Explosion",
      "blast": 25.0,
      "puncture": 52.0,
      "slash": 29.0,
      "totalDamage": 106.0,
      "radius": 2.9,
      "falloffReduction": 0.3
    }
  ],
  "kuva_ogris": [
    {
      "name": "Rocket Explosion",
      "blast": 349.0,
      "puncture": 183.0,
      "slash": 155.0,
      "totalDamage": 687.0,
      "radius": 7.9,
      "falloffReduction": 0.8
    }
  ],
  "kuva_tonkor": [
    {
      "name": "Grenade Explosion",
      "blast": 302.0,
      "puncture": 168.0,
      "slash": 204.0,
      "totalDamage": 674.0,
      "radius": 7.0,
      "falloffReduction": 0.7
    }
  ],
  "kuva_zarr": [
    {
      "name": "Cannon Mode Explosion",
      "blast": 673.0,
      "totalDamage": 673.0,
      "radius": 7.0,
      "falloffReduction": 0.7
    },
    {
      "name": "Cannon Mode Cluster Bomb Explosion",
      "blast": 50.0,
      "totalDamage": 50.0,
      "radius": 3.0,
      "falloffReduction": 0.1
    }
  ],
  "latron_prime": [
    {
      "name": "Incarnon Form AoE",
      "heat": 70.0,
      "puncture": 70.0,
      "totalDamage": 140.0,
      "radius": 4.0,
      "falloffReduction": 0.2
    }
  ],
  "latron_wraith": [
    {
      "name": "Incarnon Form AoE",
      "heat": 50.0,
      "puncture": 50.0,
      "totalDamage": 100.0,
      "radius": 4.0,
      "falloffReduction": 0.2
    }
  ],
  "mk1_braton": [
    {
      "name": "Incarnon Form AoE",
      "heat": 50.0,
      "totalDamage": 50.0,
      "radius": 3.0,
      "falloffReduction": 0.1
    }
  ],
  "mk1_strun": [
    {
      "name": "Incarnon Form AoE",
      "blast": 45.0,
      "puncture": 25.0,
      "slash": 60.0,
      "totalDamage": 130.0,
      "radius": 4.0,
      "falloffReduction": 0.2
    }
  ],
  "mutalist_cernos": [
    {
      "name": "Toxin Cloud",
      "toxin": 5.0,
      "totalDamage": 5.0,
      "radius": 2.5,
      "falloffReduction": 0.0,
      "explosionDelay": 0.25
    }
  ],
  "mutalist_quanta": [
    {
      "name": "Infested Orb",
      "radiation": 20.0,
      "totalDamage": 20.0,
      "radius": 2.0,
      "falloffReduction": 0.0
    },
    {
      "name": "Orb Explosion",
      "toxin": 100.0,
      "totalDamage": 100.0,
      "radius": 4.4,
      "falloffReduction": 0.5
    }
  ],
  "opticor_vandal": [
    {
      "name": "Charged Shot AoE",
      "magnetic": 200.0,
      "totalDamage": 200.0,
      "radius": 4.6,
      "falloffReduction": 0.6
    },
    {
      "name": "Quick Shot AoE",
      "magnetic": 100.0,
      "totalDamage": 100.0,
      "radius": 4.6,
      "falloffReduction": 0.6
    }
  ],
  "panthera_prime": [
    {
      "name": "Radial Attack",
      "slash": 20.0,
      "totalDamage": 20.0,
      "radius": 1.6,
      "falloffReduction": 0.2
    }
  ],
  "phantasma_prime": [
    {
      "name": "Plasma Bomb Explosion",
      "radiation": 73.0,
      "totalDamage": 73.0,
      "radius": 4.8,
      "falloffReduction": 0.5
    },
    {
      "name": "Cluster Bombs Explosion",
      "radiation": 18.0,
      "totalDamage": 18.0,
      "radius": 2.0
    }
  ],
  "prisma_gorgon": [
    {
      "name": "Incarnon Form AoE",
      "heat": 700.0,
      "totalDamage": 700.0,
      "radius": 5.0,
      "falloffReduction": 0.1,
      "explosionDelay": 0.8
    }
  ],
  "prisma_lenz": [
    {
      "name": "Initial Blast",
      "cold": 10.0,
      "totalDamage": 10.0,
      "radius": 7.2,
      "falloffReduction": 0.7
    },
    {
      "name": "Bubble Collapse",
      "blast": 740.0,
      "totalDamage": 740.0,
      "radius": 7.2,
      "falloffReduction": 0.7,
      "explosionDelay": 1.3
    }
  ],
  "proboscis_cernos": [
    {
      "name": "Appendages",
      "slash": 50.625,
      "viral": 39.375,
      "totalDamage": 90.0,
      "radius": 9.0,
      "falloffReduction": 0.0
    },
    {
      "name": "Charged Shot Explosion",
      "viral": 1003.0,
      "totalDamage": 1003.0,
      "radius": 7.0,
      "falloffReduction": 0.5,
      "explosionDelay": 1.7
    }
  ],
  "quanta_vandal": [
    {
      "name": "Cube (direct hit)",
      "electricity": 100.0,
      "totalDamage": 100.0,
      "radius": 15.0
    },
    {
      "name": "Cube Explosion",
      "blast": 150.0,
      "totalDamage": 150.0,
      "radius": 0.5,
      "falloffReduction": 0.0
    },
    {
      "name": "Cube (shot by player)",
      "blast": 600.0,
      "totalDamage": 600.0,
      "radius": 6.0,
      "falloffReduction": 0.0
    }
  ],
  "scourge_prime": [
    {
      "name": "Explosion",
      "corrosive": 60.0,
      "totalDamage": 60.0,
      "radius": 1.7,
      "falloffReduction": 0.3
    },
    {
      "name": "Spear Explosion",
      "corrosive": 55.0,
      "totalDamage": 55.0,
      "radius": 7.0,
      "falloffReduction": 0.6
    }
  ],
  "secura_penta": [
    {
      "name": "Grenade Detonation",
      "blast": 300.0,
      "totalDamage": 300.0,
      "radius": 6.0,
      "falloffReduction": 0.6
    }
  ],
  "strun_prime": [
    {
      "name": "Incarnon Form AoE",
      "blast": 60.0,
      "puncture": 40.0,
      "slash": 100.0,
      "totalDamage": 200.0,
      "radius": 4.0,
      "falloffReduction": 0.2
    }
  ],
  "strun_wraith": [
    {
      "name": "Incarnon Form AoE",
      "blast": 70.0,
      "puncture": 40.0,
      "slash": 90.0,
      "totalDamage": 200.0,
      "radius": 4.0,
      "falloffReduction": 0.2
    }
  ],
  "synoid_simulor": [
    {
      "name": "Orb Merging Damage",
      "magnetic": 125.0,
      "totalDamage": 125.0,
      "radius": 4.0,
      "falloffReduction": 0.0
    },
    {
      "name": "Orb Explosion",
      "magnetic": 240.0,
      "totalDamage": 240.0,
      "radius": 5.0,
      "falloffReduction": 1.0
    }
  ],
  "tenet_envoy": [
    {
      "name": "Rocket Explosion",
      "cold": 640.0,
      "totalDamage": 640.0,
      "radius": 8.0,
      "falloffReduction": 0.8
    }
  ],
  "tenet_ferrox": [
    {
      "name": "Radial Attack",
      "impact": 6.0,
      "puncture": 42.0,
      "slash": 12.0,
      "totalDamage": 60.0,
      "radius": 4.0,
      "falloffReduction": 0.3
    },
    {
      "name": "Attraction Field",
      "electricity": 150.0,
      "totalDamage": 150.0,
      "radius": 10.0
    }
  ],
  "tenet_quanta": [
    {
      "name": "Cube (direct hit)",
      "electricity": 180.0,
      "totalDamage": 180.0,
      "radius": 15.0
    },
    {
      "name": "Cube Explosion",
      "blast": 150.0,
      "totalDamage": 150.0,
      "radius": 0.5,
      "falloffReduction": 0.0
    },
    {
      "name": "Cube (shot by player)",
      "blast": 600.0,
      "totalDamage": 600.0,
      "radius": 6.0,
      "falloffReduction": 0.0
    }
  ],
  "tenet_tetra": [
    {
      "name": "Grenade AoE",
      "blast": 1000.0,
      "totalDamage": 1000.0,
      "radius": 8.0,
      "falloffReduction": 0.6
    }
  ],
  "trumna_prime": [
    {
      "name": "Auto AoE",
      "heat": 50.0,
      "totalDamage": 50.0,
      "radius": 1.6,
      "falloffReduction": 0.15
    },
    {
      "name": "Grenade Bounce AoE",
      "heat": 1150.0,
      "totalDamage": 1150.0,
      "radius": 6.0,
      "falloffReduction": 0.4
    }
  ],
  "vectis_prime": [
    {
      "name": "Incarnon Form Headshot AoE",
      "cold": 150.0,
      "totalDamage": 150.0,
      "radius": 6.7,
      "falloffReduction": 0.0
    },
    {
      "name": "Incarnon Form Embed AoE",
      "cold": 25.0,
      "totalDamage": 25.0,
      "radius": 0.15,
      "falloffReduction": 0.0
    }
  ],
  "zhuge_prime": [
    {
      "name": "Arrow Explosion",
      "impact": 11.2,
      "puncture": 4.0,
      "slash": 24.8,
      "totalDamage": 40.0,
      "radius": 2.6,
      "falloffReduction": 0.3,
      "explosionDelay": 0.6
    }
  ],
  "acceltra": [
    {
      "name": "Rocket Explosion",
      "puncture": 35.2,
      "slash": 8.8,
      "totalDamage": 44.0,
      "radius": 4.0,
      "falloffReduction": 0.5
    }
  ],
  "aeolak": [
    {
      "name": "Alt-Fire Explosion",
      "blast": 789.0,
      "totalDamage": 789.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    }
  ],
  "afentis": [
    {
      "name": "Radial Attack",
      "blast": 800.0,
      "totalDamage": 800.0,
      "radius": 3.0,
      "falloffReduction": 0.2,
      "explosionDelay": 0.8
    }
  ],
  "alternox": [
    {
      "name": "Alt-Fire Explosion",
      "electricity": 100.0,
      "totalDamage": 100.0,
      "radius": 6.0,
      "falloffReduction": 0.6,
      "explosionDelay": 10.0
    }
  ],
  "ambassador": [
    {
      "name": "Charged AoE",
      "electricity": 800.0,
      "totalDamage": 800.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    }
  ],
  "astilla": [
    {
      "name": "Glass Explosion",
      "puncture": 42.0,
      "slash": 78.0,
      "totalDamage": 120.0,
      "radius": 2.4,
      "falloffReduction": 0.3
    }
  ],
  "basmu": [
    {
      "name": "Radial Attack",
      "heat": 19.0,
      "totalDamage": 19.0,
      "radius": 1.7,
      "falloffReduction": 0.2
    }
  ],
  "battacor": [
    {
      "name": "Secondary Fire AoE",
      "radiation": 208.0,
      "totalDamage": 208.0,
      "radius": 3.4,
      "falloffReduction": 0.4
    }
  ],
  "braton": [
    {
      "name": "Incarnon Form AoE",
      "heat": 50.0,
      "totalDamage": 50.0,
      "radius": 3.0,
      "falloffReduction": 0.1
    }
  ],
  "bubonico": [
    {
      "name": "Radial Attack",
      "viral": 143.0,
      "totalDamage": 143.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    }
  ],
  "burston": [
    {
      "name": "Incarnon Form Radial Attack",
      "heat": 3.0,
      "totalDamage": 3.0,
      "radius": 2.0,
      "falloffReduction": 0.0
    }
  ],
  "cedo": [
    {
      "name": "Glaive Radial Attack",
      "blast": 10.0,
      "totalDamage": 10.0,
      "radius": 6.0,
      "falloffReduction": 0.0
    }
  ],
  "corinth": [
    {
      "name": "Buckshot",
      "impact": 25.2,
      "puncture": 37.8,
      "slash": 27.0,
      "totalDamage": 90.0,
      "radius": 36.0,
      "falloffReduction": 0.6667
    },
    {
      "name": "Air Burst Explosion",
      "blast": 404.0,
      "totalDamage": 404.0,
      "radius": 9.4,
      "falloffReduction": 0.9
    }
  ],
  "enkaus": [
    {
      "name": "Radial",
      "corrosive": 10.0,
      "puncture": 4.0,
      "totalDamage": 14.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    }
  ],
  "evensong": [
    {
      "name": "Charged Radial Attack",
      "puncture": 45.0,
      "slash": 105.0,
      "totalDamage": 150.0,
      "radius": 4.0,
      "falloffReduction": 0.7
    }
  ],
  "ferrox": [
    {
      "name": "Radial Attack",
      "impact": 100.0,
      "totalDamage": 100.0,
      "radius": 3.6,
      "falloffReduction": 0.4
    },
    {
      "name": "Attraction Field",
      "electricity": 150.0,
      "totalDamage": 150.0,
      "radius": 10.0
    }
  ],
  "gorgon": [
    {
      "name": "Incarnon Form AoE",
      "heat": 750.0,
      "totalDamage": 750.0,
      "radius": 5.0,
      "falloffReduction": 0.1,
      "explosionDelay": 1.1
    }
  ],
  "higasa": [
    {
      "name": "Charged Shot",
      "blast": 390.0,
      "totalDamage": 390.0,
      "radius": 3.0
    }
  ],
  "javlok": [
    {
      "name": "Projectile Explosion",
      "heat": 120.0,
      "totalDamage": 120.0,
      "radius": 2.4,
      "falloffReduction": 0.3
    },
    {
      "name": "Spear Throw Explosion",
      "heat": 300.0,
      "totalDamage": 300.0,
      "radius": 6.0,
      "falloffReduction": 0.6
    }
  ],
  "komorex": [
    {
      "name": "3.5x Zoom Radial Attack",
      "viral": 53.0,
      "totalDamage": 53.0,
      "radius": 3.6,
      "falloffReduction": 0.4
    }
  ],
  "latron": [
    {
      "name": "Incarnon Form AoE",
      "heat": 40.0,
      "puncture": 40.0,
      "totalDamage": 80.0,
      "radius": 4.0,
      "falloffReduction": 0.2
    }
  ],
  "lenz": [
    {
      "name": "Initial Blast",
      "cold": 10.0,
      "totalDamage": 10.0,
      "radius": 7.2,
      "falloffReduction": 0.7
    },
    {
      "name": "Bubble Collapse",
      "blast": 660.0,
      "totalDamage": 660.0,
      "radius": 7.2,
      "falloffReduction": 0.7,
      "explosionDelay": 1.3
    }
  ],
  "miter": [
    {
      "name": "Incarnon Form Radial Attack",
      "heat": 80.0,
      "totalDamage": 80.0,
      "radius": 3.0,
      "falloffReduction": 0.2
    }
  ],
  "neutralizer": [
    {
      "name": "Cryo Grenade",
      "cold": 20.0,
      "totalDamage": 20.0,
      "radius": 10.0
    }
  ],
  "ogris": [
    {
      "name": "Rocket Explosion",
      "blast": 600.0,
      "totalDamage": 600.0,
      "radius": 7.1,
      "falloffReduction": 0.8
    }
  ],
  "opticor": [
    {
      "name": "Charged Shot AoE",
      "magnetic": 400.0,
      "totalDamage": 400.0,
      "radius": 6.0,
      "falloffReduction": 0.6
    },
    {
      "name": "Quick Shot AoE",
      "magnetic": 200.0,
      "totalDamage": 200.0,
      "radius": 6.0,
      "falloffReduction": 0.6
    }
  ],
  "penta": [
    {
      "name": "Grenade Detonation",
      "blast": 350.0,
      "totalDamage": 350.0,
      "radius": 4.0,
      "falloffReduction": 0.5
    }
  ],
  "phantasma": [
    {
      "name": "Plasma Bomb Explosion",
      "radiation": 73.0,
      "totalDamage": 73.0,
      "radius": 4.8,
      "falloffReduction": 0.5
    },
    {
      "name": "Cluster Bombs Explosion",
      "radiation": 18.0,
      "totalDamage": 18.0,
      "radius": 2.0
    }
  ],
  "quanta": [
    {
      "name": "Cube (direct hit)",
      "electricity": 100.0,
      "totalDamage": 100.0,
      "radius": 15.0
    },
    {
      "name": "Cube Explosion",
      "blast": 150.0,
      "totalDamage": 150.0,
      "radius": 0.5,
      "falloffReduction": 0.0
    },
    {
      "name": "Cube (shot by player)",
      "blast": 600.0,
      "totalDamage": 600.0,
      "radius": 6.0,
      "falloffReduction": 0.0
    }
  ],
  "scourge": [
    {
      "name": "Explosion",
      "corrosive": 55.0,
      "totalDamage": 55.0,
      "radius": 1.7,
      "falloffReduction": 0.3
    },
    {
      "name": "Spear Throw Explosion",
      "corrosive": 55.0,
      "totalDamage": 55.0,
      "radius": 7.0,
      "falloffReduction": 0.6
    }
  ],
  "shedu": [
    {
      "name": "Radial Attack",
      "electricity": 87.0,
      "totalDamage": 87.0,
      "radius": 6.6,
      "falloffReduction": 0.6
    }
  ],
  "simulor": [
    {
      "name": "Orb Merging Damage",
      "magnetic": 100.0,
      "totalDamage": 100.0,
      "radius": 12.0
    },
    {
      "name": "Orb Explosion",
      "magnetic": 200.0,
      "totalDamage": 200.0,
      "radius": 5.0,
      "falloffReduction": 0.6
    }
  ],
  "sporothrix": [
    {
      "name": "AoE",
      "slash": 22.0,
      "viral": 19.0,
      "totalDamage": 41.0,
      "radius": 1.7,
      "falloffReduction": 0.1,
      "explosionDelay": 0.9
    }
  ],
  "stahlta": [
    {
      "name": "Alt-Fire AoE",
      "radiation": 1200.0,
      "totalDamage": 1200.0,
      "radius": 7.2,
      "falloffReduction": 0.7,
      "explosionDelay": 0.36
    }
  ],
  "strun": [
    {
      "name": "Incarnon Form AoE",
      "blast": 60.0,
      "puncture": 30.0,
      "slash": 80.0,
      "totalDamage": 170.0,
      "radius": 4.0,
      "falloffReduction": 0.2
    }
  ],
  "tonkor": [
    {
      "name": "Grenade Explosion",
      "blast": 650.0,
      "totalDamage": 650.0,
      "radius": 7.0,
      "falloffReduction": 0.7
    }
  ],
  "torid": [
    {
      "name": "Poison Cloud",
      "toxin": 40.0,
      "totalDamage": 40.0,
      "radius": 3.0,
      "falloffReduction": 1.0
    }
  ],
  "trumna": [
    {
      "name": "Auto AoE",
      "heat": 50.0,
      "totalDamage": 50.0,
      "radius": 1.6,
      "falloffReduction": 0.15
    },
    {
      "name": "Grenade Bounce AoE",
      "heat": 1000.0,
      "totalDamage": 1000.0,
      "radius": 6.0,
      "falloffReduction": 0.4
    }
  ],
  "vectis": [
    {
      "name": "Incarnon Form Headshot AoE",
      "cold": 5.0,
      "totalDamage": 5.0,
      "radius": 6.7,
      "falloffReduction": 0.0
    },
    {
      "name": "Incarnon Form Embed AoE",
      "cold": 5.0,
      "totalDamage": 5.0,
      "radius": 0.15,
      "falloffReduction": 0.0
    }
  ],
  "zarr": [
    {
      "name": "Cannon Mode Explosion",
      "blast": 175.0,
      "totalDamage": 175.0,
      "radius": 4.9,
      "falloffReduction": 0.5
    },
    {
      "name": "Cannon Mode Cluster Bomb Explosion",
      "blast": 50.0,
      "totalDamage": 50.0,
      "radius": 3.0,
      "falloffReduction": 0.9
    }
  ],
  "akarius_prime": [
    {
      "name": "Rocket Detonation",
      "blast": 509.0,
      "totalDamage": 509.0,
      "radius": 7.8,
      "falloffReduction": 0.7
    }
  ],
  "coda_catabolyst": [
    {
      "name": "Partial Reload Explosion",
      "corrosive": 74.0,
      "totalDamage": 74.0,
      "radius": 3.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Reload From Empty Explosion",
      "corrosive": 658.0,
      "totalDamage": 658.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    }
  ],
  "coda_pox": [
    {
      "name": "Poison Cloud",
      "toxin": 35.0,
      "totalDamage": 35.0,
      "radius": 2.8,
      "falloffReduction": 0.0
    }
  ],
  "efv_8_mars": [
    {
      "name": "Alt-Fire AoE",
      "corrosive": 313.0,
      "totalDamage": 313.0,
      "radius": 3.0,
      "falloffReduction": 0.8
    }
  ],
  "epitaph_prime": [
    {
      "name": "Uncharged AoE",
      "blast": 30.0,
      "totalDamage": 30.0,
      "radius": 10.0,
      "falloffReduction": 0.8
    }
  ],
  "euphona_prime": [
    {
      "name": "Buckshot",
      "impact": 4.4,
      "puncture": 17.6,
      "slash": 66.0,
      "totalDamage": 88.0,
      "radius": 12.0,
      "falloffReduction": 0.9886
    }
  ],
  "kompressa_prime": [
    {
      "name": "Explosion",
      "viral": 46.0,
      "totalDamage": 46.0,
      "radius": 2.8,
      "falloffReduction": 0.2,
      "explosionDelay": 0.6
    }
  ],
  "kuva_seer": [
    {
      "name": "Explosion",
      "corrosive": 69.0,
      "totalDamage": 69.0,
      "radius": 2.3,
      "falloffReduction": 0.3
    }
  ],
  "prisma_angstrum": [
    {
      "name": "Single Rocket Explosion",
      "blast": 250.0,
      "totalDamage": 250.0,
      "radius": 3.6,
      "falloffReduction": 0.4
    }
  ],
  "riot_848": [
    {
      "name": "Radial Attack",
      "blast": 48.0,
      "totalDamage": 48.0,
      "radius": 1.5,
      "falloffReduction": 0.5
    }
  ],
  "sancti_castanas": [
    {
      "name": "Mid-Flight Detonation",
      "electricity": 300.0,
      "totalDamage": 300.0,
      "radius": 3.6,
      "falloffReduction": 0.4
    },
    {
      "name": "Embedded Detonation",
      "electricity": 300.0,
      "totalDamage": 300.0,
      "radius": 3.6,
      "falloffReduction": 0.4
    }
  ],
  "synoid_gammacor": [
    {
      "name": "Incarnon Form Radial Attack",
      "cold": 800.0,
      "totalDamage": 800.0,
      "radius": 5.0,
      "falloffReduction": 0.3,
      "explosionDelay": 1.2
    }
  ],
  "tenet_plinx": [
    {
      "name": "Alt-Fire AoE",
      "radiation": 100.0,
      "totalDamage": 100.0,
      "radius": 6.0,
      "falloffReduction": 0.4,
      "explosionDelay": 0.8
    }
  ],
  "tenet_spirex": [
    {
      "name": "Explosion",
      "heat": 80.0,
      "totalDamage": 80.0,
      "radius": 2.0,
      "falloffReduction": 0.2
    }
  ],
  "zakti_prime": [
    {
      "name": "Gas Cloud",
      "gas": 100.0,
      "totalDamage": 100.0,
      "radius": 3.8,
      "falloffReduction": 0.0
    }
  ],
  "zylok_prime": [
    {
      "name": "Incarnon Form Radial Attack",
      "heat": 700.0,
      "totalDamage": 700.0,
      "radius": 6.0,
      "falloffReduction": 0.6
    }
  ],
  "aegrit": [
    {
      "name": "Detonation",
      "blast": 797.0,
      "totalDamage": 797.0,
      "radius": 9.0,
      "falloffReduction": 0.7
    }
  ],
  "akarius": [
    {
      "name": "Rocket Detonation",
      "blast": 419.0,
      "totalDamage": 419.0,
      "radius": 7.2,
      "falloffReduction": 0.7
    }
  ],
  "angstrum": [
    {
      "name": "Single Rocket Explosion",
      "blast": 250.0,
      "totalDamage": 250.0,
      "radius": 3.6,
      "falloffReduction": 0.4
    }
  ],
  "atomos": [
    {
      "name": "Incarnon Form Radial Attack",
      "blast": 450.0,
      "totalDamage": 450.0,
      "radius": 7.9,
      "falloffReduction": 0.8
    }
  ],
  "azima": [
    {
      "name": "Turret Expiry",
      "blast": 75.0,
      "totalDamage": 75.0,
      "radius": 3.0
    }
  ],
  "castanas": [
    {
      "name": "Mid-Flight Detonation",
      "electricity": 160.0,
      "totalDamage": 160.0,
      "radius": 3.6,
      "falloffReduction": 0.4
    },
    {
      "name": "Embedded Detonation",
      "electricity": 160.0,
      "totalDamage": 160.0,
      "radius": 3.6,
      "falloffReduction": 0.4
    }
  ],
  "catabolyst": [
    {
      "name": "Partial Reload Explosion",
      "corrosive": 203.0,
      "totalDamage": 203.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Reload From Empty Explosion",
      "corrosive": 1997.0,
      "totalDamage": 1997.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    }
  ],
  "cyanex": [
    {
      "name": "Projectile Explosion",
      "gas": 41.0,
      "totalDamage": 41.0,
      "radius": 0.7,
      "falloffReduction": 0.2
    }
  ],
  "despair": [
    {
      "name": "Incarnon Form Radial Attack",
      "heat": 160.0,
      "totalDamage": 160.0,
      "radius": 4.0,
      "falloffReduction": 0.2
    }
  ],
  "epitaph": [
    {
      "name": "Uncharged AoE",
      "blast": 20.0,
      "totalDamage": 20.0,
      "radius": 8.0,
      "falloffReduction": 0.8
    }
  ],
  "gammacor": [
    {
      "name": "Incarnon Form Radial Attack",
      "cold": 660.0,
      "totalDamage": 660.0,
      "radius": 5.0,
      "falloffReduction": 0.3,
      "explosionDelay": 1.2
    }
  ],
  "glory": [
    {
      "name": "Normal Attack",
      "heat": 150.0,
      "totalDamage": 150.0,
      "radius": 2.0,
      "falloffReduction": 1.0
    },
    {
      "name": "Alternate Fire",
      "heat": 1500.0,
      "totalDamage": 1500.0,
      "radius": 4.0
    }
  ],
  "grimoire": [
    {
      "name": "Normal Radial Attack",
      "electricity": 50.0,
      "totalDamage": 50.0,
      "radius": 1.0,
      "falloffReduction": 0.8
    },
    {
      "name": "Active Radial Attack",
      "electricity": 250.0,
      "totalDamage": 250.0,
      "radius": 6.0,
      "falloffReduction": 0.8
    }
  ],
  "kompressa": [
    {
      "name": "Explosion",
      "viral": 42.0,
      "totalDamage": 42.0,
      "radius": 2.4,
      "falloffReduction": 0.2,
      "explosionDelay": 0.6
    }
  ],
  "kulstar": [
    {
      "name": "Rocket Explosion",
      "blast": 300.0,
      "totalDamage": 300.0,
      "radius": 3.9,
      "falloffReduction": 0.4
    },
    {
      "name": "Cluster Bomb Explosion",
      "blast": 90.0,
      "totalDamage": 90.0,
      "radius": 3.9,
      "falloffReduction": 0.4
    }
  ],
  "laetum": [
    {
      "name": "Incarnon Form Auto Radial Attack",
      "radiation": 300.0,
      "totalDamage": 300.0,
      "radius": 2.0,
      "falloffReduction": 0.2
    }
  ],
  "onos": [
    {
      "name": "Incarnon Form Charge Radial Attack",
      "heat": 1100.0,
      "totalDamage": 1100.0,
      "radius": 3.0,
      "falloffReduction": 0.3
    }
  ],
  "pox": [
    {
      "name": "Poison Cloud",
      "toxin": 20.0,
      "totalDamage": 20.0,
      "radius": 2.5,
      "falloffReduction": 0.0
    }
  ],
  "sepulcrum": [
    {
      "name": "Radial Attack",
      "heat": 46.0,
      "totalDamage": 46.0,
      "radius": 1.6,
      "falloffReduction": 0.2
    }
  ],
  "sonicor": [
    {
      "name": "Explosion",
      "impact": 50.0,
      "totalDamage": 50.0,
      "radius": 5.0
    }
  ],
  "staticor": [
    {
      "name": "Uncharged Explosion",
      "radiation": 88.0,
      "totalDamage": 88.0,
      "radius": 2.4,
      "falloffReduction": 0.3
    }
  ],
  "stug": [
    {
      "name": "Blob Explosion",
      "corrosive": 75.0,
      "totalDamage": 75.0,
      "radius": 0.3,
      "falloffReduction": 0.3,
      "explosionDelay": 1.5
    },
    {
      "name": "Incarnon Form Blob Explosion",
      "corrosive": 200.0,
      "totalDamage": 200.0,
      "radius": 0.3,
      "falloffReduction": 0.3,
      "explosionDelay": 1.5
    },
    {
      "name": "Incarnon Form Bounce Explosion",
      "corrosive": 200.0,
      "totalDamage": 200.0,
      "radius": 1.5,
      "falloffReduction": 0.0
    }
  ],
  "talons": [
    {
      "name": "Mid-Flight Detonation",
      "blast": 120.0,
      "totalDamage": 120.0,
      "radius": 4.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Embedded Detonation",
      "blast": 250.0,
      "totalDamage": 250.0,
      "radius": 4.0,
      "falloffReduction": 0.5
    }
  ],
  "zakti": [
    {
      "name": "Gas Cloud",
      "gas": 80.0,
      "totalDamage": 80.0,
      "radius": 3.5,
      "falloffReduction": 0.0
    }
  ],
  "zylok": [
    {
      "name": "Incarnon Form Radial Attack",
      "heat": 600.0,
      "totalDamage": 600.0,
      "radius": 6.0,
      "falloffReduction": 0.6
    }
  ],
  "zymos": [
    {
      "name": "Radial Attack",
      "toxin": 61.0,
      "totalDamage": 61.0,
      "radius": 3.3,
      "falloffReduction": 0.3
    },
    {
      "name": "Headshot Explosion",
      "toxin": 953.0,
      "totalDamage": 953.0,
      "radius": 3.3,
      "falloffReduction": 0.3,
      "explosionDelay": 1.1
    },
    {
      "name": "Homing Spore Explosion",
      "toxin": 333.0,
      "totalDamage": 333.0,
      "radius": 3.3,
      "falloffReduction": 0.3
    }
  ],
  "ankyros_prime": [
    {
      "name": "Slam Attack",
      "impact": 256.0,
      "totalDamage": 256.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 384.0,
      "totalDamage": 384.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "arca_titron": [
    {
      "name": "Slam Attack",
      "electricity": 720.0,
      "totalDamage": 720.0,
      "radius": 9.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "electricity": 1080.0,
      "totalDamage": 1080.0,
      "radius": 10.0,
      "falloffReduction": 0.3
    }
  ],
  "arum_spinosa": [
    {
      "name": "Slam Attack",
      "impact": 594.0,
      "totalDamage": 594.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 891.0,
      "totalDamage": 891.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "bo_prime": [
    {
      "name": "Slam Attack",
      "impact": 352.0,
      "totalDamage": 352.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 528.0,
      "totalDamage": 528.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "broken_scepter": [
    {
      "name": "Slam Attack",
      "impact": 358.0,
      "totalDamage": 358.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 537.0,
      "totalDamage": 537.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "broken_war": [
    {
      "name": "Slam Attack",
      "impact": 374.0,
      "totalDamage": 374.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 561.0,
      "totalDamage": 561.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "ceramic_dagger": [
    {
      "name": "Spectral Dagger Explosion",
      "heat": 350.0,
      "totalDamage": 350.0,
      "radius": 4.0,
      "falloffReduction": 0.3
    },
    {
      "name": "Slam Attack",
      "impact": 280.0,
      "totalDamage": 280.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 420.0,
      "totalDamage": 420.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "ceti_lacera": [
    {
      "name": "Slam Attack",
      "electricity": 432.0,
      "totalDamage": 432.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "electricity": 648.0,
      "totalDamage": 648.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "coda_caustacyst": [
    {
      "name": "Slam Attack",
      "impact": 570.0,
      "totalDamage": 570.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 855.0,
      "totalDamage": 855.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "coda_hirudo": [
    {
      "name": "Slam Attack",
      "impact": 350.0,
      "totalDamage": 350.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 525.0,
      "totalDamage": 525.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "coda_mire": [
    {
      "name": "Slam Attack",
      "toxin": 470.0,
      "totalDamage": 470.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "toxin": 705.0,
      "totalDamage": 705.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "coda_motovore": [
    {
      "name": "Slam Attack",
      "impact": 166.5,
      "puncture": 166.5,
      "slash": 167.0,
      "totalDamage": 500.0,
      "radius": 9.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "impact": 249.75,
      "puncture": 249.75,
      "slash": 250.5,
      "totalDamage": 750.0,
      "radius": 10.0,
      "falloffReduction": 0.3
    }
  ],
  "coda_pathocyst": [
    {
      "name": "Throw Bounce Explosion",
      "viral": 405.0,
      "totalDamage": 405.0,
      "radius": 4.9,
      "falloffReduction": 0.5
    },
    {
      "name": "Throw Recall Explosion",
      "viral": 810.0,
      "totalDamage": 810.0,
      "radius": 4.9,
      "falloffReduction": 0.0
    },
    {
      "name": "Charged Throw Bounce Explosion",
      "viral": 810.0,
      "totalDamage": 810.0,
      "radius": 4.9,
      "falloffReduction": 0.5
    },
    {
      "name": "Charged Throw Recall Explosion",
      "viral": 1620.0,
      "totalDamage": 1620.0,
      "radius": 4.9,
      "falloffReduction": 0.0
    },
    {
      "name": "Slam Attack",
      "viral": 540.0,
      "totalDamage": 540.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "viral": 810.0,
      "totalDamage": 810.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "dakra_prime": [
    {
      "name": "Slam Attack",
      "impact": 340.0,
      "totalDamage": 340.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 510.0,
      "totalDamage": 510.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "dark_dagger": [
    {
      "name": "Slam Attack",
      "impact": 308.0,
      "totalDamage": 308.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "radiation": 462.0,
      "totalDamage": 462.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "dark_split_sword": [
    {
      "name": "Slam Attack",
      "impact": 232.0,
      "totalDamage": 232.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 462.0,
      "totalDamage": 462.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "dark_sword": [
    {
      "name": "Slam Attack",
      "toxin": 520.0,
      "totalDamage": 520.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "toxin": 780.0,
      "totalDamage": 780.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "desert_wind": [
    {
      "name": "Slam Attack",
      "impact": 500.0,
      "totalDamage": 500.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 750.0,
      "totalDamage": 750.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "destreza_prime": [
    {
      "name": "Slam Attack",
      "impact": 340.0,
      "totalDamage": 340.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 510.0,
      "totalDamage": 510.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "dex_dakra": [
    {
      "name": "Slam Attack",
      "blast": 284.0,
      "totalDamage": 284.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 426.0,
      "totalDamage": 426.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "dex_nikana": [
    {
      "name": "Slam Attack",
      "impact": 336.0,
      "totalDamage": 336.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 504.0,
      "totalDamage": 504.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "dragon_nikana": [
    {
      "name": "Slam Attack",
      "impact": 376.0,
      "totalDamage": 376.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 564.0,
      "totalDamage": 564.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "dual_cleavers": [
    {
      "name": "Slam Attack",
      "impact": 314.0,
      "totalDamage": 314.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 471.0,
      "totalDamage": 471.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "dual_ether": [
    {
      "name": "Slam Attack",
      "impact": 360.0,
      "totalDamage": 360.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 540.0,
      "totalDamage": 540.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "dual_heat_swords": [
    {
      "name": "Slam Attack",
      "heat": 294.0,
      "totalDamage": 294.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "heat": 441.0,
      "totalDamage": 441.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "dual_ichor": [
    {
      "name": "Slam Attack",
      "impact": 244.0,
      "totalDamage": 244.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 366.0,
      "totalDamage": 366.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "dual_kamas": [
    {
      "name": "Slam Attack",
      "impact": 192.0,
      "totalDamage": 192.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 288.0,
      "totalDamage": 288.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "dual_kamas_prime": [
    {
      "name": "Slam Attack",
      "impact": 320.0,
      "totalDamage": 320.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 480.0,
      "totalDamage": 480.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "dual_keres": [
    {
      "name": "Slam Attack",
      "impact": 230.0,
      "totalDamage": 230.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 345.0,
      "totalDamage": 345.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "dual_keres_prime": [
    {
      "name": "Slam Attack",
      "impact": 360.0,
      "totalDamage": 360.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 540.0,
      "totalDamage": 540.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "dual_raza": [
    {
      "name": "Slam Attack",
      "impact": 220.0,
      "totalDamage": 220.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 330.0,
      "totalDamage": 330.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "dual_skana": [
    {
      "name": "Slam Attack",
      "impact": 240.0,
      "totalDamage": 240.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 360.0,
      "totalDamage": 360.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "dual_viciss": [
    {
      "name": "Slam Attack",
      "gas": 510.0,
      "totalDamage": 510.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "gas": 765.0,
      "totalDamage": 765.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "dual_zoren": [
    {
      "name": "Slam Attack",
      "impact": 140.0,
      "totalDamage": 140.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 210.0,
      "totalDamage": 210.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "dual_zoren_prime": [
    {
      "name": "Slam Attack",
      "impact": 280.0,
      "totalDamage": 280.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 420.0,
      "totalDamage": 420.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "ether_daggers": [
    {
      "name": "Slam Attack",
      "impact": 448.0,
      "totalDamage": 448.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 672.0,
      "totalDamage": 672.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "ether_reaper": [
    {
      "name": "Slam Attack",
      "impact": 360.0,
      "totalDamage": 360.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 540.0,
      "totalDamage": 540.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "ether_sword": [
    {
      "name": "Slam Attack",
      "radiation": 384.0,
      "totalDamage": 384.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "radiation": 576.0,
      "totalDamage": 576.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "fang_prime": [
    {
      "name": "Slam Attack",
      "impact": 356.0,
      "totalDamage": 356.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 534.0,
      "totalDamage": 534.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "fragor_prime": [
    {
      "name": "Slam Attack",
      "impact": 540.0,
      "totalDamage": 540.0,
      "radius": 9.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 810.0,
      "totalDamage": 810.0,
      "radius": 10.0,
      "falloffReduction": 0.3
    }
  ],
  "galariak_prime": [
    {
      "name": "Slam Attack",
      "impact": 702.0,
      "totalDamage": 702.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 1170.0,
      "totalDamage": 1170.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "galatine_prime": [
    {
      "name": "Slam Attack",
      "impact": 560.0,
      "totalDamage": 560.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 840.0,
      "totalDamage": 840.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "garuda_prime_talons": [
    {
      "name": "Slam Attack",
      "impact": 560.0,
      "totalDamage": 560.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 840.0,
      "totalDamage": 840.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "garuda_talons": [
    {
      "name": "Slam Attack",
      "impact": 496.0,
      "totalDamage": 496.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 744.0,
      "totalDamage": 744.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "gazal_machete": [
    {
      "name": "Slam Attack",
      "impact": 356.0,
      "totalDamage": 356.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 534.0,
      "totalDamage": 534.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "glaive_prime": [
    {
      "name": "Throw Bounce Explosion",
      "blast": 296.0,
      "totalDamage": 296.0,
      "radius": 4.8,
      "falloffReduction": 0.4
    },
    {
      "name": "Throw Recall Explosion",
      "blast": 592.0,
      "totalDamage": 592.0,
      "radius": 4.8,
      "falloffReduction": 0.0
    },
    {
      "name": "Charged Throw Bounce Explosion",
      "blast": 592.0,
      "totalDamage": 592.0,
      "radius": 4.8,
      "falloffReduction": 0.4
    },
    {
      "name": "Charged Throw Recall Explosion",
      "blast": 1184.0,
      "totalDamage": 1184.0,
      "radius": 4.8,
      "falloffReduction": 0.0
    },
    {
      "name": "Slam Attack",
      "impact": 328.0,
      "totalDamage": 328.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 492.0,
      "totalDamage": 492.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "gram_prime": [
    {
      "name": "Slam Attack",
      "impact": 600.0,
      "totalDamage": 600.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 900.0,
      "totalDamage": 900.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "guandao_prime": [
    {
      "name": "Slam Attack",
      "impact": 480.0,
      "totalDamage": 480.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 720.0,
      "totalDamage": 720.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "gunsen_prime": [
    {
      "name": "Slam Attack",
      "impact": 450.0,
      "totalDamage": 450.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 675.0,
      "totalDamage": 675.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "halikar_wraith": [
    {
      "name": "Throw Bounce Explosion",
      "blast": 329.0,
      "totalDamage": 329.0,
      "radius": 5.1,
      "falloffReduction": 0.4
    },
    {
      "name": "Throw Recall Explosion",
      "blast": 658.0,
      "totalDamage": 658.0,
      "radius": 5.1,
      "falloffReduction": 0.0
    },
    {
      "name": "Charged Throw Bounce Explosion",
      "blast": 657.0,
      "totalDamage": 657.0,
      "radius": 5.1,
      "falloffReduction": 0.4
    },
    {
      "name": "Charged Throw Recall Explosion",
      "blast": 1314.0,
      "totalDamage": 1314.0,
      "radius": 5.1,
      "falloffReduction": 0.0
    },
    {
      "name": "Slam Attack",
      "magnetic": 450.0,
      "totalDamage": 450.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "magnetic": 675.0,
      "totalDamage": 675.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "heat_dagger": [
    {
      "name": "Slam Attack",
      "heat": 416.0,
      "totalDamage": 416.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "heat": 624.0,
      "totalDamage": 624.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "heat_sword": [
    {
      "name": "Slam Attack",
      "heat": 294.0,
      "totalDamage": 294.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "heat": 441.0,
      "totalDamage": 441.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "iron_staff": [
    {
      "name": "Slam Attack",
      "impact": 600.0,
      "totalDamage": 600.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 900.0,
      "totalDamage": 900.0,
      "radius": 10.0,
      "falloffReduction": 0.3
    }
  ],
  "jat_kittag": [
    {
      "name": "Slam Attack",
      "blast": 400.0,
      "totalDamage": 400.0,
      "radius": 9.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 600.0,
      "totalDamage": 600.0,
      "radius": 10.0,
      "falloffReduction": 0.3
    }
  ],
  "jat_kusar": [
    {
      "name": "Slam Attack",
      "heat": 436.0,
      "totalDamage": 436.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "heat": 654.0,
      "totalDamage": 654.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "jaw_sword": [
    {
      "name": "Slam Attack",
      "impact": 240.0,
      "totalDamage": 240.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 360.0,
      "totalDamage": 360.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "karyst_prime": [
    {
      "name": "Slam Attack",
      "impact": 688.0,
      "totalDamage": 688.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "toxin": 1032.0,
      "totalDamage": 1032.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "kestrel_prime": [
    {
      "name": "Throw Bounce Explosion",
      "blast": 315.0,
      "totalDamage": 315.0,
      "radius": 3.6,
      "falloffReduction": 0.4
    },
    {
      "name": "Throw Recall Explosion",
      "blast": 630.0,
      "totalDamage": 630.0,
      "radius": 3.6,
      "falloffReduction": 0.0
    },
    {
      "name": "Charged Throw Bounce Explosion",
      "blast": 630.0,
      "totalDamage": 630.0,
      "radius": 4.0,
      "falloffReduction": 0.4
    },
    {
      "name": "Charged Throw Recall Explosion",
      "blast": 1260.0,
      "totalDamage": 1260.0,
      "radius": 4.0,
      "falloffReduction": 0.0
    },
    {
      "name": "Slam Attack",
      "magnetic": 420.0,
      "totalDamage": 420.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "magnetic": 630.0,
      "totalDamage": 630.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "kogake_prime": [
    {
      "name": "Slam Attack",
      "impact": 484.0,
      "totalDamage": 484.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 726.0,
      "totalDamage": 726.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "kronen_prime": [
    {
      "name": "Slam Attack",
      "impact": 424.0,
      "totalDamage": 424.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 636.0,
      "totalDamage": 636.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "kuva_ghoulsaw": [
    {
      "name": "Slam Attack",
      "impact": 422.0,
      "totalDamage": 422.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 633.0,
      "totalDamage": 633.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "kuva_shildeg": [
    {
      "name": "Slam Attack",
      "impact": 410.0,
      "totalDamage": 410.0,
      "radius": 9.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 615.0,
      "totalDamage": 615.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "machete_wraith": [
    {
      "name": "Slam Attack",
      "impact": 240.0,
      "totalDamage": 240.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 360.0,
      "totalDamage": 360.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "masseter_prime": [
    {
      "name": "Slam Attack",
      "impact": 520.0,
      "totalDamage": 520.0,
      "radius": 10.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 780.0,
      "totalDamage": 780.0,
      "radius": 10.0,
      "falloffReduction": 0.3
    }
  ],
  "mk1_bo": [
    {
      "name": "Slam Attack",
      "impact": 180.0,
      "totalDamage": 180.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 270.0,
      "totalDamage": 270.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "mk1_furax": [
    {
      "name": "Slam Attack",
      "impact": 180.0,
      "totalDamage": 180.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 270.0,
      "totalDamage": 270.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "nami_skyla": [
    {
      "name": "Slam Attack",
      "impact": 250.0,
      "totalDamage": 250.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 375.0,
      "totalDamage": 375.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "nami_skyla_prime": [
    {
      "name": "Slam Attack",
      "impact": 360.0,
      "totalDamage": 360.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 540.0,
      "totalDamage": 540.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "nami_solo": [
    {
      "name": "Slam Attack",
      "impact": 344.0,
      "totalDamage": 344.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 516.0,
      "totalDamage": 516.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "nikana_prime": [
    {
      "name": "Slam Attack",
      "impact": 396.0,
      "totalDamage": 396.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 594.0,
      "totalDamage": 594.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "ninkondi_prime": [
    {
      "name": "Slam Attack",
      "electricity": 468.0,
      "totalDamage": 468.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "electricity": 702.0,
      "totalDamage": 702.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "okina_prime": [
    {
      "name": "Spectral Dagger Explosion",
      "cold": 184.0,
      "totalDamage": 184.0,
      "radius": 4.0,
      "falloffReduction": 0.0
    },
    {
      "name": "Slam Attack",
      "impact": 368.0,
      "totalDamage": 368.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 552.0,
      "totalDamage": 552.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "orthos_prime": [
    {
      "name": "Slam Attack",
      "blast": 468.0,
      "totalDamage": 468.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 702.0,
      "totalDamage": 702.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "pangolin_prime": [
    {
      "name": "Slam Attack",
      "impact": 496.0,
      "totalDamage": 496.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 744.0,
      "totalDamage": 744.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "pangolin_sword": [
    {
      "name": "Slam Attack",
      "puncture": 300.0,
      "totalDamage": 300.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 450.0,
      "totalDamage": 450.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "plasma_sword": [
    {
      "name": "Slam Attack",
      "electricity": 400.0,
      "totalDamage": 400.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "electricity": 600.0,
      "totalDamage": 600.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "prisma_dual_cleavers": [
    {
      "name": "Slam Attack",
      "impact": 266.0,
      "totalDamage": 266.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 399.0,
      "totalDamage": 399.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "prisma_machete": [
    {
      "name": "Slam Attack",
      "impact": 386.0,
      "totalDamage": 386.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 579.0,
      "totalDamage": 579.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "prisma_obex": [
    {
      "name": "Slam Attack",
      "electricity": 300.0,
      "totalDamage": 300.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "electricity": 450.0,
      "totalDamage": 450.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "prisma_ohma": [
    {
      "name": "Slam Attack",
      "electricity": 500.0,
      "totalDamage": 500.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 750.0,
      "totalDamage": 750.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "prisma_skana": [
    {
      "name": "Slam Attack",
      "impact": 340.0,
      "totalDamage": 340.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 510.0,
      "totalDamage": 510.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "prova_vandal": [
    {
      "name": "Slam Attack",
      "electricity": 396.0,
      "totalDamage": 396.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 594.0,
      "totalDamage": 594.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "quassus_prime": [
    {
      "name": "Slam Attack",
      "impact": 520.0,
      "totalDamage": 520.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 780.0,
      "totalDamage": 780.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "rakta_dark_dagger": [
    {
      "name": "Slam Attack",
      "impact": 492.0,
      "totalDamage": 492.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "radiation": 738.0,
      "totalDamage": 738.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "reaper_prime": [
    {
      "name": "Slam Attack",
      "impact": 400.0,
      "totalDamage": 400.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 600.0,
      "totalDamage": 600.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "redeemer_prime": [
    {
      "name": "Ranged Attack",
      "blast": 80.0,
      "totalDamage": 80.0,
      "radius": 30.0,
      "falloffReduction": 0.9375
    },
    {
      "name": "Slam Attack",
      "impact": 424.0,
      "totalDamage": 424.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 636.0,
      "totalDamage": 636.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "sancti_magistar": [
    {
      "name": "Slam Attack",
      "impact": 480.0,
      "totalDamage": 480.0,
      "radius": 9.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 720.0,
      "totalDamage": 720.0,
      "radius": 10.0,
      "falloffReduction": 0.3
    }
  ],
  "sarofang_prime": [
    {
      "name": "Slam Attack",
      "impact": 440.0,
      "totalDamage": 440.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 660.0,
      "totalDamage": 660.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "scindo_prime": [
    {
      "name": "Slam Attack",
      "impact": 500.0,
      "totalDamage": 500.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 750.0,
      "totalDamage": 750.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "secura_lecta": [
    {
      "name": "Slam Attack",
      "electricity": 352.0,
      "totalDamage": 352.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "electricity": 528.0,
      "totalDamage": 528.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "shadow_claws": [
    {
      "name": "Slam Attack",
      "impact": 500.0,
      "totalDamage": 500.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 750.0,
      "totalDamage": 750.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "skana_prime": [
    {
      "name": "Slam Attack",
      "impact": 420.0,
      "totalDamage": 420.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 630.0,
      "totalDamage": 630.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "synoid_heliocor": [
    {
      "name": "Slam Attack",
      "impact": 560.0,
      "totalDamage": 560.0,
      "radius": 9.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 840.0,
      "totalDamage": 840.0,
      "radius": 10.0,
      "falloffReduction": 0.3
    }
  ],
  "tatsu_prime": [
    {
      "name": "Slam Attack",
      "impact": 460.0,
      "totalDamage": 460.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 690.0,
      "totalDamage": 690.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "tekko_prime": [
    {
      "name": "Slam Attack",
      "impact": 360.0,
      "totalDamage": 360.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 540.0,
      "totalDamage": 540.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "telos_boltace": [
    {
      "name": "Slam Attack",
      "impact": 420.0,
      "totalDamage": 420.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 630.0,
      "totalDamage": 630.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "tenet_agendus": [
    {
      "name": "Slam Attack",
      "electricity": 520.0,
      "totalDamage": 520.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "electricity": 780.0,
      "totalDamage": 780.0,
      "radius": 10.0,
      "falloffReduction": 0.3
    }
  ],
  "tenet_exec": [
    {
      "name": "Slam Attack",
      "impact": 380.0,
      "totalDamage": 380.0,
      "radius": 4.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "impact": 570.0,
      "totalDamage": 570.0,
      "radius": 4.0,
      "falloffReduction": 0.3
    }
  ],
  "tenet_grigori": [
    {
      "name": "Slam Attack",
      "impact": 456.0,
      "totalDamage": 456.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 684.0,
      "totalDamage": 684.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "tenet_livia": [
    {
      "name": "Slam Attack",
      "impact": 396.0,
      "totalDamage": 396.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 594.0,
      "totalDamage": 594.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "tipedo_prime": [
    {
      "name": "Slam Attack",
      "impact": 340.0,
      "totalDamage": 340.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 510.0,
      "totalDamage": 510.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "twin_basolk": [
    {
      "name": "Slam Attack",
      "heat": 420.0,
      "totalDamage": 420.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "heat": 630.0,
      "totalDamage": 630.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "twin_krohkur": [
    {
      "name": "Slam Attack",
      "impact": 500.0,
      "totalDamage": 500.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 750.0,
      "totalDamage": 750.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "vaykor_sydon": [
    {
      "name": "Slam Attack",
      "blast": 426.0,
      "totalDamage": 426.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 639.0,
      "totalDamage": 639.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "venato_prime": [
    {
      "name": "Slam Attack",
      "impact": 490.0,
      "totalDamage": 490.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 735.0,
      "totalDamage": 735.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "venka_prime": [
    {
      "name": "Slam Attack",
      "impact": 376.0,
      "totalDamage": 376.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 564.0,
      "totalDamage": 564.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "vinquibus": [
    {
      "name": "Gunshot Explosion",
      "blast": 400.0,
      "totalDamage": 400.0,
      "radius": 4.0,
      "falloffReduction": 0.3,
      "explosionDelay": 0.8
    },
    {
      "name": "Slam Attack",
      "impact": 440.0,
      "totalDamage": 440.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 660.0,
      "totalDamage": 660.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "volnus_prime": [
    {
      "name": "Slam Attack",
      "slash": 500.0,
      "totalDamage": 500.0,
      "radius": 10.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "slash": 750.0,
      "totalDamage": 750.0,
      "radius": 10.0,
      "falloffReduction": 0.3
    }
  ],
  "wolf_sledge": [
    {
      "name": "Throw Bounce Explosion",
      "blast": 777.0,
      "totalDamage": 777.0,
      "radius": 5.0,
      "falloffReduction": 0.4
    },
    {
      "name": "Throw Recall Explosion",
      "blast": 1554.0,
      "totalDamage": 1554.0,
      "radius": 5.0,
      "falloffReduction": 0.0
    },
    {
      "name": "Slam Attack",
      "impact": 518.0,
      "totalDamage": 518.0,
      "radius": 9.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 777.0,
      "totalDamage": 777.0,
      "radius": 10.0,
      "falloffReduction": 0.3
    }
  ],
  "amanata": [
    {
      "name": "Slam Attack",
      "blast": 252.0,
      "totalDamage": 252.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 378.0,
      "totalDamage": 378.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "amphis": [
    {
      "name": "Slam Attack",
      "electricity": 260.0,
      "totalDamage": 260.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "electricity": 378.0,
      "totalDamage": 378.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "anku": [
    {
      "name": "Slam Attack",
      "impact": 340.0,
      "totalDamage": 340.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 510.0,
      "totalDamage": 510.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "ankyros": [
    {
      "name": "Slam Attack",
      "impact": 180.0,
      "totalDamage": 180.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 270.0,
      "totalDamage": 270.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "azothane": [
    {
      "name": "Slam Attack",
      "slash": 340.0,
      "totalDamage": 340.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 510.0,
      "totalDamage": 510.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "bo": [
    {
      "name": "Slam Attack",
      "impact": 280.0,
      "totalDamage": 280.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 420.0,
      "totalDamage": 420.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "boltace": [
    {
      "name": "Slam Attack",
      "impact": 352.0,
      "totalDamage": 352.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 528.0,
      "totalDamage": 528.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "cadus": [
    {
      "name": "Slam Attack",
      "impact": 260.0,
      "totalDamage": 260.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 390.0,
      "totalDamage": 390.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "cassowar": [
    {
      "name": "Slam Attack",
      "impact": 376.0,
      "totalDamage": 376.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 564.0,
      "totalDamage": 564.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "caustacyst": [
    {
      "name": "Slam Attack",
      "impact": 520.0,
      "totalDamage": 520.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 780.0,
      "totalDamage": 780.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "cerata": [
    {
      "name": "Throw Bounce Explosion",
      "toxin": 333.0,
      "totalDamage": 333.0,
      "radius": 4.8,
      "falloffReduction": 0.3
    },
    {
      "name": "Throw Recall Explosion",
      "toxin": 666.0,
      "totalDamage": 666.0,
      "radius": 4.8,
      "falloffReduction": 0.0
    },
    {
      "name": "Charged Throw Bounce Explosion",
      "toxin": 666.0,
      "totalDamage": 666.0,
      "radius": 4.8,
      "falloffReduction": 0.3
    },
    {
      "name": "Charged Throw Recall Explosion",
      "toxin": 1318.0,
      "totalDamage": 1318.0,
      "radius": 4.8,
      "falloffReduction": 0.0
    },
    {
      "name": "Slam Attack",
      "toxin": 366.0,
      "totalDamage": 366.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "toxin": 549.0,
      "totalDamage": 549.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "corufell": [
    {
      "name": "Slam Attack",
      "blast": 400.0,
      "totalDamage": 400.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 600.0,
      "totalDamage": 600.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "cronus": [
    {
      "name": "Slam Attack",
      "impact": 212.0,
      "totalDamage": 212.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 318.0,
      "totalDamage": 318.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "destreza": [
    {
      "name": "Slam Attack",
      "impact": 316.0,
      "totalDamage": 316.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 474.0,
      "totalDamage": 474.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "dorrclave": [
    {
      "name": "Slam Attack",
      "slash": 444.0,
      "totalDamage": 444.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "slash": 666.0,
      "totalDamage": 666.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "edun": [
    {
      "name": "Polearm Explosion",
      "blast": 400.0,
      "totalDamage": 400.0,
      "radius": 4.0,
      "falloffReduction": 0.3,
      "explosionDelay": 0.8
    },
    {
      "name": "Slam Attack",
      "impact": 440.0,
      "totalDamage": 440.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 660.0,
      "totalDamage": 660.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "ekhein": [
    {
      "name": "Slam Attack",
      "impact": 680.0,
      "totalDamage": 680.0,
      "radius": 9.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 1020.0,
      "totalDamage": 1020.0,
      "radius": 10.0,
      "falloffReduction": 0.3
    }
  ],
  "endura": [
    {
      "name": "Slam Attack",
      "impact": 400.0,
      "totalDamage": 400.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 600.0,
      "totalDamage": 600.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "falcor": [
    {
      "name": "Throw Bounce Explosion",
      "electricity": 345.0,
      "totalDamage": 345.0,
      "radius": 6.0,
      "falloffReduction": 0.4
    },
    {
      "name": "Throw Recall Explosion",
      "electricity": 690.0,
      "totalDamage": 690.0,
      "radius": 6.0,
      "falloffReduction": 0.0
    },
    {
      "name": "Charged Throw Bounce Explosion",
      "electricity": 690.0,
      "totalDamage": 690.0,
      "radius": 6.0,
      "falloffReduction": 0.4
    },
    {
      "name": "Charged Throw Recall Explosion",
      "electricity": 1380.0,
      "totalDamage": 1380.0,
      "radius": 6.0,
      "falloffReduction": 0.0
    },
    {
      "name": "Slam Attack",
      "electricity": 460.0,
      "totalDamage": 460.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "electricity": 750.0,
      "totalDamage": 750.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "fang": [
    {
      "name": "Slam Attack",
      "impact": 216.0,
      "totalDamage": 216.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 324.0,
      "totalDamage": 324.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "fragor": [
    {
      "name": "Slam Attack",
      "impact": 400.0,
      "totalDamage": 400.0,
      "radius": 9.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 600.0,
      "totalDamage": 600.0,
      "radius": 10.0,
      "falloffReduction": 0.3
    }
  ],
  "galatine": [
    {
      "name": "Slam Attack",
      "impact": 364.0,
      "totalDamage": 364.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 546.0,
      "totalDamage": 546.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "galvacord": [
    {
      "name": "Slam Attack",
      "electricity": 420.0,
      "totalDamage": 420.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "electricity": 630.0,
      "totalDamage": 630.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "ghoulsaw": [
    {
      "name": "Slam Attack",
      "impact": 394.0,
      "totalDamage": 394.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 591.0,
      "totalDamage": 591.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "glaive": [
    {
      "name": "Throw Bounce Explosion",
      "blast": 190.0,
      "totalDamage": 190.0,
      "radius": 4.8,
      "falloffReduction": 0.4
    },
    {
      "name": "Throw Recall Explosion",
      "blast": 380.0,
      "totalDamage": 380.0,
      "radius": 4.8,
      "falloffReduction": 0.0
    },
    {
      "name": "Charged Throw Bounce Explosion",
      "blast": 378.0,
      "totalDamage": 378.0,
      "radius": 4.8,
      "falloffReduction": 0.4
    },
    {
      "name": "Charged Throw Recall Explosion",
      "blast": 756.0,
      "totalDamage": 756.0,
      "radius": 4.8,
      "falloffReduction": 0.0
    },
    {
      "name": "Slam Attack",
      "impact": 210.0,
      "totalDamage": 210.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 315.0,
      "totalDamage": 315.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "gram": [
    {
      "name": "Slam Attack",
      "impact": 320.0,
      "totalDamage": 320.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 480.0,
      "totalDamage": 480.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "guandao": [
    {
      "name": "Slam Attack",
      "impact": 404.0,
      "totalDamage": 404.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 606.0,
      "totalDamage": 606.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "gunsen": [
    {
      "name": "Slam Attack",
      "impact": 320.0,
      "totalDamage": 320.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 480.0,
      "totalDamage": 480.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "halikar": [
    {
      "name": "Throw Bounce Explosion",
      "blast": 450.0,
      "totalDamage": 450.0,
      "radius": 4.9,
      "falloffReduction": 0.4
    },
    {
      "name": "Throw Recall Explosion",
      "blast": 450.0,
      "totalDamage": 450.0,
      "radius": 4.9,
      "falloffReduction": 0.0
    },
    {
      "name": "Charged Throw Bounce Explosion",
      "blast": 447.0,
      "totalDamage": 447.0,
      "radius": 4.9,
      "falloffReduction": 0.4
    },
    {
      "name": "Charged Throw Recall Explosion",
      "blast": 894.0,
      "totalDamage": 894.0,
      "radius": 4.9,
      "falloffReduction": 0.0
    },
    {
      "name": "Slam Attack",
      "magnetic": 298.0,
      "totalDamage": 298.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "magnetic": 447.0,
      "totalDamage": 447.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "harmony": [
    {
      "name": "Slam Attack",
      "impact": 480.0,
      "totalDamage": 480.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 720.0,
      "totalDamage": 720.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "hate": [
    {
      "name": "Spectral Blade Explosion",
      "heat": 130.0,
      "totalDamage": 130.0,
      "radius": 3.0,
      "falloffReduction": 0.3,
      "explosionDelay": 0.4
    },
    {
      "name": "Slam Attack",
      "impact": 460.0,
      "totalDamage": 460.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 690.0,
      "totalDamage": 690.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "heliocor": [
    {
      "name": "Slam Attack",
      "impact": 560.0,
      "totalDamage": 560.0,
      "radius": 9.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 840.0,
      "totalDamage": 840.0,
      "radius": 10.0,
      "falloffReduction": 0.3
    }
  ],
  "hespar": [
    {
      "name": "Slam Attack",
      "impact": 560.0,
      "totalDamage": 560.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 840.0,
      "totalDamage": 840.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "hirudo": [
    {
      "name": "Slam Attack",
      "impact": 260.0,
      "totalDamage": 260.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 390.0,
      "totalDamage": 390.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "innodem": [
    {
      "name": "Slam Attack",
      "impact": 720.0,
      "totalDamage": 720.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 1080.0,
      "totalDamage": 1080.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "kama": [
    {
      "name": "Slam Attack",
      "impact": 180.0,
      "totalDamage": 180.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 270.0,
      "totalDamage": 270.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "karyst": [
    {
      "name": "Slam Attack",
      "impact": 546.0,
      "totalDamage": 546.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "toxin": 819.0,
      "totalDamage": 819.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "keratinos": [
    {
      "name": "Slam Attack",
      "impact": 488.0,
      "totalDamage": 488.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "viral": 732.0,
      "totalDamage": 732.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "kesheg": [
    {
      "name": "Slam Attack",
      "blast": 482.0,
      "totalDamage": 482.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 723.0,
      "totalDamage": 723.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "kestrel": [
    {
      "name": "Throw Bounce Explosion",
      "blast": 126.0,
      "totalDamage": 126.0,
      "radius": 3.6,
      "falloffReduction": 0.4
    },
    {
      "name": "Throw Recall Explosion",
      "blast": 252.0,
      "totalDamage": 252.0,
      "radius": 3.6,
      "falloffReduction": 0.0
    },
    {
      "name": "Charged Throw Bounce Explosion",
      "blast": 252.0,
      "totalDamage": 252.0,
      "radius": 4.0,
      "falloffReduction": 0.4
    },
    {
      "name": "Charged Throw Recall Explosion",
      "blast": 504.0,
      "totalDamage": 504.0,
      "radius": 4.0,
      "falloffReduction": 0.0
    },
    {
      "name": "Slam Attack",
      "magnetic": 168.0,
      "totalDamage": 168.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "magnetic": 252.0,
      "totalDamage": 252.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "kogake": [
    {
      "name": "Slam Attack",
      "impact": 240.0,
      "totalDamage": 240.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 360.0,
      "totalDamage": 360.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "korrudo": [
    {
      "name": "Slam Attack",
      "impact": 386.0,
      "totalDamage": 386.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 579.0,
      "totalDamage": 579.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "korumm": [
    {
      "name": "Tactical Combo Slam Attack",
      "electricity": 1040.0,
      "totalDamage": 1040.0,
      "radius": 10.0,
      "falloffReduction": 0.0
    },
    {
      "name": "Slam Attack",
      "blast": 520.0,
      "totalDamage": 520.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 780.0,
      "totalDamage": 780.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "kreska": [
    {
      "name": "Slam Attack",
      "heat": 380.0,
      "totalDamage": 380.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "heat": 570.0,
      "totalDamage": 570.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "krohkur": [
    {
      "name": "Slam Attack",
      "impact": 434.0,
      "totalDamage": 434.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 651.0,
      "totalDamage": 651.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "kronen": [
    {
      "name": "Slam Attack",
      "impact": 260.0,
      "totalDamage": 260.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 390.0,
      "totalDamage": 390.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "lacera": [
    {
      "name": "Slam Attack",
      "electricity": 432.0,
      "totalDamage": 432.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "electricity": 648.0,
      "totalDamage": 648.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "lecta": [
    {
      "name": "Slam Attack",
      "electricity": 202.0,
      "totalDamage": 202.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "electricity": 303.0,
      "totalDamage": 303.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "lesion": [
    {
      "name": "Slam Attack",
      "impact": 474.0,
      "totalDamage": 474.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 711.0,
      "totalDamage": 711.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "machete": [
    {
      "name": "Slam Attack",
      "impact": 240.0,
      "totalDamage": 240.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 360.0,
      "totalDamage": 360.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "magistar": [
    {
      "name": "Slam Attack",
      "impact": 420.0,
      "totalDamage": 420.0,
      "radius": 9.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 630.0,
      "totalDamage": 630.0,
      "radius": 10.0,
      "falloffReduction": 0.3
    }
  ],
  "masseter": [
    {
      "name": "Slam Attack",
      "impact": 482.0,
      "totalDamage": 482.0,
      "radius": 10.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 723.0,
      "totalDamage": 723.0,
      "radius": 10.0,
      "falloffReduction": 0.3
    }
  ],
  "mios": [
    {
      "name": "Slam Attack",
      "toxin": 354.0,
      "totalDamage": 354.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "toxin": 531.0,
      "totalDamage": 531.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "mire": [
    {
      "name": "Slam Attack",
      "toxin": 316.0,
      "totalDamage": 316.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "toxin": 474.0,
      "totalDamage": 474.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "nepheri": [
    {
      "name": "Slam Attack",
      "impact": 522.0,
      "totalDamage": 522.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 783.0,
      "totalDamage": 783.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "nikana": [
    {
      "name": "Slam Attack",
      "impact": 284.0,
      "totalDamage": 284.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 426.0,
      "totalDamage": 426.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "obex": [
    {
      "name": "Slam Attack",
      "electricity": 240.0,
      "totalDamage": 240.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "electricity": 360.0,
      "totalDamage": 360.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "ohma": [
    {
      "name": "Slam Attack",
      "electricity": 448.0,
      "totalDamage": 448.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 672.0,
      "totalDamage": 672.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "okina": [
    {
      "name": "Spectral Dagger Explosion",
      "cold": 140.0,
      "totalDamage": 140.0,
      "radius": 4.0,
      "falloffReduction": 0.0
    },
    {
      "name": "Slam Attack",
      "impact": 280.0,
      "totalDamage": 280.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 420.0,
      "totalDamage": 420.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "orthos": [
    {
      "name": "Slam Attack",
      "blast": 370.0,
      "totalDamage": 370.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 555.0,
      "totalDamage": 555.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "orvius": [
    {
      "name": "Throw Bounce Explosion",
      "blast": 293.0,
      "totalDamage": 293.0,
      "radius": 4.0,
      "falloffReduction": 0.4
    },
    {
      "name": "Throw Recall Explosion",
      "blast": 586.0,
      "totalDamage": 586.0,
      "radius": 4.0,
      "falloffReduction": 0.0
    },
    {
      "name": "Charged Throw Bounce Explosion",
      "cold": 585.0,
      "totalDamage": 585.0,
      "radius": 4.0,
      "falloffReduction": 0.4
    },
    {
      "name": "Charged Throw Recall Explosion",
      "cold": 1170.0,
      "totalDamage": 1170.0,
      "radius": 4.0,
      "falloffReduction": 0.0
    },
    {
      "name": "Slam Attack",
      "impact": 390.0,
      "totalDamage": 390.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 585.0,
      "totalDamage": 585.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "paracesis": [
    {
      "name": "Slam Attack",
      "impact": 444.0,
      "totalDamage": 444.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 666.0,
      "totalDamage": 666.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "pathocyst": [
    {
      "name": "Throw Bounce Explosion",
      "viral": 393.0,
      "totalDamage": 393.0,
      "radius": 4.9,
      "falloffReduction": 0.5
    },
    {
      "name": "Throw Recall Explosion",
      "viral": 786.0,
      "totalDamage": 786.0,
      "radius": 4.9,
      "falloffReduction": 0.0
    },
    {
      "name": "Charged Throw Bounce Explosion",
      "viral": 786.0,
      "totalDamage": 786.0,
      "radius": 4.9,
      "falloffReduction": 0.5
    },
    {
      "name": "Charged Throw Recall Explosion",
      "viral": 1572.0,
      "totalDamage": 1572.0,
      "radius": 4.9,
      "falloffReduction": 0.0
    },
    {
      "name": "Slam Attack",
      "viral": 524.0,
      "totalDamage": 524.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "viral": 786.0,
      "totalDamage": 786.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "pennant": [
    {
      "name": "Slam Attack",
      "impact": 400.0,
      "totalDamage": 400.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 600.0,
      "totalDamage": 600.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "praedos": [
    {
      "name": "Slam Attack",
      "impact": 400.0,
      "totalDamage": 400.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 600.0,
      "totalDamage": 600.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "prova": [
    {
      "name": "Slam Attack",
      "electricity": 256.0,
      "totalDamage": 256.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "electricity": 384.0,
      "totalDamage": 384.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "pulmonars": [
    {
      "name": "Slam Attack",
      "viral": 580.0,
      "totalDamage": 580.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "viral": 870.0,
      "totalDamage": 870.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "pupacyst": [
    {
      "name": "Slam Attack",
      "impact": 296.622,
      "viral": 271.378,
      "totalDamage": 568.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "impact": 387.27,
      "toxin": 464.73,
      "totalDamage": 852.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "quassus": [
    {
      "name": "Slam Attack",
      "impact": 460.0,
      "totalDamage": 460.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 690.0,
      "totalDamage": 690.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "redeemer": [
    {
      "name": "Ranged Attack",
      "blast": 30.0,
      "totalDamage": 30.0,
      "radius": 20.0,
      "falloffReduction": 0.8333
    },
    {
      "name": "Slam Attack",
      "impact": 360.0,
      "totalDamage": 360.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 540.0,
      "totalDamage": 540.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "ripkas": [
    {
      "name": "Slam Attack",
      "impact": 346.0,
      "totalDamage": 346.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 519.0,
      "totalDamage": 519.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "rumblejack": [
    {
      "name": "Slam Attack",
      "electricity": 600.0,
      "totalDamage": 600.0,
      "radius": 4.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "electricity": 900.0,
      "totalDamage": 900.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "ruvox": [
    {
      "name": "Slam Attack",
      "impact": 340.0,
      "totalDamage": 340.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 510.0,
      "totalDamage": 510.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "sampotes": [
    {
      "name": "Slam Attack",
      "impact": 496.0,
      "totalDamage": 496.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 744.0,
      "totalDamage": 744.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "sarofang": [
    {
      "name": "Slam Attack",
      "impact": 400.0,
      "totalDamage": 400.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 600.0,
      "totalDamage": 600.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "sarpa": [
    {
      "name": "Slam Attack",
      "impact": 320.0,
      "totalDamage": 320.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 480.0,
      "totalDamage": 480.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "scindo": [
    {
      "name": "Slam Attack",
      "impact": 400.0,
      "totalDamage": 400.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 600.0,
      "totalDamage": 600.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "scoliac": [
    {
      "name": "Slam Attack",
      "toxin": 300.0,
      "totalDamage": 300.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "toxin": 450.0,
      "totalDamage": 450.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "serro": [
    {
      "name": "Slam Attack",
      "blast": 468.0,
      "totalDamage": 468.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 702.0,
      "totalDamage": 702.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "shaku": [
    {
      "name": "Slam Attack",
      "impact": 360.0,
      "totalDamage": 360.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 540.0,
      "totalDamage": 540.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "sheev": [
    {
      "name": "Slam Attack",
      "heat": 540.0,
      "totalDamage": 540.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "heat": 810.0,
      "totalDamage": 810.0,
      "radius": 6.0,
      "falloffReduction": 0.3
    }
  ],
  "sibear": [
    {
      "name": "Slam Attack",
      "cold": 540.0,
      "totalDamage": 540.0,
      "radius": 9.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "cold": 810.0,
      "totalDamage": 810.0,
      "radius": 10.0,
      "falloffReduction": 0.3
    }
  ],
  "skana": [
    {
      "name": "Slam Attack",
      "impact": 240.0,
      "totalDamage": 240.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 360.0,
      "totalDamage": 360.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "skiajati": [
    {
      "name": "Slam Attack",
      "impact": 350.0,
      "totalDamage": 350.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 525.0,
      "totalDamage": 525.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "slaytra": [
    {
      "name": "Slam Attack",
      "impact": 666.0,
      "totalDamage": 666.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 999.0,
      "totalDamage": 999.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "stropha": [
    {
      "name": "Slam Attack",
      "impact": 440.0,
      "totalDamage": 440.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 660.0,
      "totalDamage": 660.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "syam": [
    {
      "name": "Slam Attack",
      "impact": 540.0,
      "totalDamage": 540.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 810.0,
      "totalDamage": 810.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "sydon": [
    {
      "name": "Slam Attack",
      "blast": 450.0,
      "totalDamage": 450.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 675.0,
      "totalDamage": 675.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "tatsu": [
    {
      "name": "Slam Attack",
      "impact": 428.0,
      "totalDamage": 428.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 642.0,
      "totalDamage": 642.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "tekko": [
    {
      "name": "Slam Attack",
      "impact": 320.0,
      "totalDamage": 320.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 480.0,
      "totalDamage": 480.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "thalys": [
    {
      "name": "Slam Attack",
      "impact": 600.0,
      "totalDamage": 600.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 900.0,
      "totalDamage": 900.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "tipedo": [
    {
      "name": "Slam Attack",
      "impact": 248.0,
      "totalDamage": 248.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 372.0,
      "totalDamage": 372.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "tonbo": [
    {
      "name": "Slam Attack",
      "blast": 368.0,
      "totalDamage": 368.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 552.0,
      "totalDamage": 552.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "tonkkatt": [
    {
      "name": "Slam Attack",
      "impact": 330.0,
      "totalDamage": 330.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 495.0,
      "totalDamage": 495.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "vastilok": [
    {
      "name": "Slam Attack",
      "impact": 558.0,
      "totalDamage": 558.0,
      "radius": 5.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 837.0,
      "totalDamage": 837.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "venato": [
    {
      "name": "Slam Attack",
      "impact": 440.0,
      "totalDamage": 440.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 660.0,
      "totalDamage": 660.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "venka": [
    {
      "name": "Slam Attack",
      "impact": 280.0,
      "totalDamage": 280.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 420.0,
      "totalDamage": 420.0,
      "radius": 7.0,
      "falloffReduction": 0.3
    }
  ],
  "verdilac": [
    {
      "name": "Energy Wave Explosion",
      "electricity": 2.0,
      "totalDamage": 2.0,
      "radius": 2.0
    },
    {
      "name": "Slam Attack",
      "electricity": 426.0,
      "totalDamage": 426.0,
      "radius": 7.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "electricity": 639.0,
      "totalDamage": 639.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "vericres": [
    {
      "name": "Slam Attack",
      "impact": 360.0,
      "totalDamage": 360.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 540.0,
      "totalDamage": 540.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "vitrica": [
    {
      "name": "Glass Explosion",
      "impact": 299.7,
      "puncture": 299.7,
      "slash": 399.6,
      "totalDamage": 999.0,
      "radius": 6.0,
      "falloffReduction": 0.9
    },
    {
      "name": "Slam Attack",
      "impact": 666.0,
      "totalDamage": 666.0,
      "radius": 4.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "impact": 999.0,
      "totalDamage": 999.0,
      "radius": 4.0,
      "falloffReduction": 0.3
    }
  ],
  "volnus": [
    {
      "name": "Slam Attack",
      "slash": 440.0,
      "totalDamage": 440.0,
      "radius": 9.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "slash": 660.0,
      "totalDamage": 660.0,
      "radius": 10.0,
      "falloffReduction": 0.3
    }
  ],
  "war": [
    {
      "name": "Slam Attack",
      "impact": 500.0,
      "totalDamage": 500.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 750.0,
      "totalDamage": 750.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "xoris": [
    {
      "name": "Throw Bounce Explosion",
      "electricity": 250.0,
      "totalDamage": 250.0,
      "radius": 8.0,
      "falloffReduction": 0.7
    },
    {
      "name": "Throw Recall Explosion",
      "electricity": 500.0,
      "totalDamage": 500.0,
      "radius": 8.0,
      "falloffReduction": 0.0
    },
    {
      "name": "Charged Throw Bounce Explosion",
      "electricity": 500.0,
      "totalDamage": 500.0,
      "radius": 9.0,
      "falloffReduction": 0.7
    },
    {
      "name": "Charged Throw Recall Explosion",
      "electricity": 1000.0,
      "totalDamage": 1000.0,
      "radius": 9.0,
      "falloffReduction": 0.0
    },
    {
      "name": "Slam Attack",
      "electricity": 240.0,
      "totalDamage": 240.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "electricity": 360.0,
      "totalDamage": 360.0,
      "radius": 8.0,
      "falloffReduction": 0.3
    }
  ],
  "zenistar": [
    {
      "name": "Disc Explosion",
      "heat": 350.0,
      "totalDamage": 350.0,
      "radius": 4.0,
      "falloffReduction": 0.0
    },
    {
      "name": "Slam Attack",
      "impact": 596.0,
      "totalDamage": 596.0,
      "radius": 8.0,
      "falloffReduction": 0.5
    },
    {
      "name": "Heavy Slam Attack",
      "blast": 894.0,
      "totalDamage": 894.0,
      "radius": 9.0,
      "falloffReduction": 0.3
    }
  ],
  "arbucep": [
    {
      "name": "1st Attack Radial Attack",
      "blast": 114.0,
      "totalDamage": 114.0,
      "radius": 6.0,
      "falloffReduction": 1.0
    }
  ],
  "cortege": [
    {
      "name": "Alt-Fire Explosion",
      "blast": 1000.0,
      "totalDamage": 1000.0,
      "radius": 4.0,
      "falloffReduction": 0.3
    }
  ],
  "grattler": [
    {
      "name": "Explosion",
      "blast": 205.0,
      "totalDamage": 205.0,
      "radius": 9.0,
      "falloffReduction": 0.7
    }
  ],
  "kuva_ayanga": [
    {
      "name": "Explosion",
      "blast": 187.0,
      "totalDamage": 187.0,
      "radius": 6.0,
      "falloffReduction": 0.5
    }
  ],
  "kuva_grattler": [
    {
      "name": "Explosion",
      "blast": 155.0,
      "totalDamage": 155.0,
      "radius": 9.0,
      "falloffReduction": 0.7
    }
  ],
  "larkspur": [
    {
      "name": "Alt-Fire Explosion",
      "blast": 400.0,
      "radiation": 400.0,
      "totalDamage": 800.0,
      "radius": 9.6,
      "falloffReduction": 0.6
    }
  ],
  "larkspur_prime": [
    {
      "name": "Alt-Fire Explosion",
      "blast": 400.0,
      "radiation": 400.0,
      "totalDamage": 800.0,
      "radius": 9.6,
      "falloffReduction": 0.6
    }
  ],
  "mausolon": [
    {
      "name": "Auto Radial Attack",
      "heat": 48.0,
      "totalDamage": 48.0,
      "radius": 1.8,
      "falloffReduction": 0.1
    },
    {
      "name": "Charged Shot Explosion",
      "heat": 3000.0,
      "totalDamage": 3000.0,
      "radius": 8.0,
      "falloffReduction": 0.4
    }
  ],
  "morgha": [
    {
      "name": "Auto Burst Explosion",
      "blast": 164.0,
      "totalDamage": 164.0,
      "radius": 3.0,
      "falloffReduction": 0.3
    },
    {
      "name": "Charged Shot Explosion",
      "blast": 1200.0,
      "impact": 600.0,
      "puncture": 800.0,
      "slash": 1000.0,
      "totalDamage": 3600.0,
      "radius": 20.0,
      "falloffReduction": 0.6
    }
  ],
  "arquebex": [
    {
      "name": "Radial Attack",
      "blast": 9000.0,
      "heat": 3000.0,
      "totalDamage": 12000.0,
      "radius": 6.0,
      "falloffReduction": 0.0
    }
  ],
  "ignis": [
    {
      "name": "Spherical Blast",
      "heat": 33.0,
      "totalDamage": 33.0,
      "radius": 3.0
    }
  ],
  "ignis_wraith": [
    {
      "name": "Spherical Blast",
      "heat": 35.0,
      "totalDamage": 35.0,
      "radius": 3.0
    }
  ],
  "embolist": [
    {
      "name": "Spherical Blast",
      "toxin": 35.0,
      "totalDamage": 35.0,
      "radius": 1.0
    }
  ],
  "ballistica": [
    {
      "name": "Charged Shot",
      "impact": 10.0,
      "puncture": 80.0,
      "slash": 10.0,
      "totalDamage": 100.0,
      "radius": 1.0
    }
  ],
  "ballistica_prime": [
    {
      "name": "Charged Shot",
      "impact": 3.8,
      "puncture": 41.8,
      "slash": 30.4,
      "totalDamage": 76.0,
      "radius": 1.0
    }
  ],
  "rakta_ballistica": [
    {
      "name": "Charged Shot",
      "impact": 15.0,
      "puncture": 270.0,
      "slash": 15.0,
      "totalDamage": 300.0,
      "radius": 1.0
    }
  ],
  "fusilai": [
    {
      "name": "Semi-Auto Mode",
      "puncture": 30.8,
      "slash": 46.2,
      "totalDamage": 77.0,
      "radius": 1.0
    }
  ],
  "hystrix": [
    {
      "name": "Poison Quill",
      "impact": 2.16,
      "puncture": 30.96,
      "slash": 2.88,
      "totalDamage": 36.0,
      "radius": 1.0
    }
  ],
  "hystrix_prime": [
    {
      "name": "Poison Quill",
      "impact": 2.76,
      "puncture": 39.56,
      "slash": 3.68,
      "totalDamage": 46.0,
      "radius": 1.0
    }
  ],
  "pandero": [
    {
      "name": "Alt-Fire",
      "impact": 18.0,
      "puncture": 18.0,
      "slash": 36.0,
      "totalDamage": 72.0,
      "radius": 1.0
    }
  ],
  "pandero_prime": [
    {
      "name": "Alt-Fire",
      "impact": 26.0,
      "puncture": 26.0,
      "slash": 52.0,
      "totalDamage": 104.0,
      "radius": 1.0
    }
  ],
  "tenet_diplos": [
    {
      "name": "Lock-on Mode",
      "impact": 11.2,
      "puncture": 9.0,
      "slash": 7.8,
      "totalDamage": 28.0,
      "radius": 1.0
    }
  ]
}
;
