# FrameHub Accuracy Hole Checklist

Baseline captured 2026-07-21 (Phase 0). Updated as phases complete.

## Baseline run

| Check | Result |
|-------|--------|
| `npm test` (vitest) | Green at Phase 0 (190); expanded with phase audit suites |
| `scripts/audit_item_behavior_coverage.py` | **1556/1556** after removing hallucinated catalog stubs |

### Coverage counts (post Phase 2b + M3 aura paper lines)

| Kind | Count |
|------|------:|
| Mod lines → `weapon_dps` | 519 (+5 amp-aura `damage` lines) |
| Mod lines → `warframe_totals` | 179 (CP/SD armor/shield moved to panel) |
| Mod lines → `mod_panel` | 1355+ |
| Arcane lines → `weapon_dps` | 20 (+ Cascadia Overcharge) |
| Arcane lines → `warframe_totals` | 30 |
| Arcane lines → `arcane_panel` | 224 |
| Arcane lines → custom handler | 81 |

---

## Tier A — Must be exact

| ID | Area | Notes | Status |
|----|------|-------|--------|
| A1 | Core weapon math | Crit/IPS/elements/MS/FR goldens | **Locked** Phase 1 (`warframe-math-audit` bare weapons) |
| A2 | `biting_frost` | Was missing behavior; bad maxRank | **Fixed** Phase 2b (R3, +200% CC/CD, mod_panel conditional) |
| A3 | Audit regex `&` | False missing `push_&_pull` | **Fixed** Phase 2b |
| A4 | Amprex innate | Has `electricity` on weapon row | **Verified** Phase 1 |
| A5 | High-use gun mods | Serration…Blaze / Hornet…Primed TC + M1 remainder | **Locked** Phase 2a+M1 (`gun-mod-audit.test.ts`) |
| A6 | High-use melee mods | PP/TS/OS/60-60s; Volcanic Edge; M2 primed/sacrificial | **Locked** Phase 2b+M2 (`melee-mod-audit.test.ts`) |
| A7 | Warframe power mods | Intensify…Primed Flow post-U34 | **Locked** Phase 2c (`warframe-mod-audit.test.ts`) |
| A8 | Passive weapon arcanes | Gated behind `arcaneStacks>0` | **Fixed** Phase 6 (`effectiveArcaneStacks` + Cascadia Overcharge → `weapon_dps`) |
| A9 | TTK shield overflow | Was `overflowFrac * 0` (no-op) | **Fixed** Phase 4 |

---

## Tier B — Best-effort modeled

| ID | Area | Notes | Status |
|----|------|-------|--------|
| B1 | Stance DPS | PvE Neutral hit avgs wiki-locked (81/81 mapped); Conclave/Contempt→1.0 | **Locked** — Neutral hit-avg scalar; other strings via C6 |
| B2 | TTK shield overflow | Health-mod overflow | **Improved** Phase 4 |
| B3 | TTK DoT end-time | 0.25s step instead of +3s guess | **Improved** Phase 4 |
| B4 | Set effects not in DPS | Augur/Hunter/Mecha mark+Empowered + **mark-kill spread DoT** + **claw elemental** + **sim cascade enemies** | **Improved** — cascade is user-estimated hops (not mission AI) |
| B5 | Ability scaling sparse | Full kits through mechs/Nokko + heat/battery/absorb sims | **Improved** — Contagion + EFF + armor-pool invuln + Vitrify enemy absorb + Gauss battery + Ember heat |
| B6 | Arcane custom handlers | Exodia Zaw gates + Bellicose/Tempo/Velocity + prior | **Improved** |
| B7 | Galv / CO / BR / WW | paper vs stacks + Steel/Elementalist kill stacks | **Locked** Phase 3 + Galv melee stacks |
| B8 | Incarnon + radials | … + Thalys shard trigger / Chain Shatter / Explosive Growth erupts; melee form PP-additive + gated stacks | **Improved** |
| B9 | Exalted weapons | All 37 `isExalted` rows wiki-locked; Ability Strength scales base before mods (Lizzie = additive 1.25×STR−1; Garuda Passive ignores STR); Titania Diwata melee grid | **Locked** — ability Damage relabeled/tooltipped when exalted weapon present |
| B10 | Primary weapons (base paper) | Non-exalted rifle/shotgun/bow/`primary` vs Module:Weapons/data/primary; 191 wiki-locked goldens | **Locked** — primary deferred set cleared in B19 |
| B11 | Secondary weapons (base paper) | Non-exalted pistol/secondary/`dual_pistols` vs Module:Weapons/data/secondary; 145 wiki-locked goldens | **Locked** — prior radial deferred set promoted in B16 |
| B12 | Melee weapons (base paper) | Non-exalted melee vs Module:Weapons/data/melee; 221 wiki-locked goldens | **Locked** — Rabvee zaw stub mirrors modular (excluded from melee pool); DSS Dual Swords default + Heavy Blade alternate |
| B13 | Archgun / archmelee (base paper) | Non-exalted arch vs Module:Weapons/data/archwing Space paper; 28 wiki-locked goldens | **Locked** — Arbucep 1st Attack default; modes 2–6 via sim (B23) |
| B14 | Sentinel weapons (base paper) | `sentinel_weapon` vs Module:Weapons/data/companion; 12 wiki-locked goldens | **Locked** — Deconstructor First Attack (IPS cycle); Cryotra Cold Field / Stinger embed DoT not in base paper |
| B15 | Modular parts (base paper) | Kitgun chambers + Zaw strikes + Amp prisms in `modular-weapons.ts` vs Modular/data + Weapons/data/modular | **Locked** — Sporelacer/Vermisplicer grip deltas still category-shared approx; amp mag/reload brace-composed; legacy `weapons.ts` kitgun/zaw/amp stubs not locked |
| B16 | Radial direct-hit split + legacy stubs | Acceltra/Astilla + B11 deferred secondaries: catalog = wiki direct hit; radials = explosion only; `weapons.ts` modular stubs documented as non-builder | **Locked** — Staticor charged via alternate mode (B22) |
| B17 | Launcher / rocket direct-hit paper | Ogris/Tonkor/Penta/Bramma/Shedu + category=`launcher` Envoy/Secura Penta: wiki Impact paper; explosions in radial DPS | **Locked** — Zarr dual cannon/barrage + Miter charge + Fulmin/Kohm dual-mode still deferred |
| B18 | Dual-mode primary default fire | Fulmin auto, Stradavar auto, Hind burst, Panthera(+Prime), Convectrix, Miter charged, Cernos Prime/Evensong charged, Vinquibus, Zarr cannon direct | **Locked** — remaining deferred cleared in B19 |
| B19 | Remaining primary deferred + DSS | Kohm fully-spooled MS/SC, Higasa auto FR, Nataruk charged mag, Synoid/Sirocco Void paper, Dark Split-Sword Dual Swords form | **Locked** — DSS Heavy Blade alternate (B22) |
| B20 | Arbucep / Deconstructor / Rabvee / radial cleanup | Arbucep 1st Attack mag36/MS1 + single radial; Deconstructor(+Prime) First Attack; Rabvee stub synced; Sepulcrum lock-on radial removed | **Locked** — modes 2–6 via sim (B23) |
| B21 | Archgun Atmosphere / Gravimag paper | 19 `atmosphereStats` overlays wiki-locked (Arbucep Atmosphere + prior Gravimag profiles); Corvas Prime intentionally no overlay | **Locked** |
| B22 | Alternate modes (Staticor + DSS) | `alternateModeStats` toggle: Staticor Fully Charged Explosion 106/9.6m; DSS Heavy Blade paper + slams; Dual Swords slams corrected to 232/462 | **Locked** — charged timing/ammo in B24 |
| B23 | Arbucep attack cycle | Sim `arbucepAttackMode` 1–6 swaps Space 16/114 or Atmosphere 32/228 element (Blast→…→Viral); builder dropdown | **Locked** |
| B24 | Staticor charged timing + ammo | Charged mode: ChargeTime 1s (standard EFR), ammoCost 5; sustained/TTK consume multi-ammo | **Locked** |
| C6 | Stance combo strings (hit-avg) | Sim `stanceComboDirection` Forward/Block/Forward Block/Heavy/Slide wiki hit-avgs (78 stances); Neutral default unchanged (B1) | **Locked** — cycle model in C6b |
| C6b | Stance cycle DPS (Avg Dmg Multi/s) | Sim `stanceDpsModel=cycle`: (ΣDmg%/Duration) × AS; 57 stances with Duration; default remains hit-avg | **Locked** — per-hit animation graphs still out of scope |
| M0 | Mod paper inventory | Unlocked `weapon_dps`/`warframe_totals` with non-empty stats (excl. 2a/2b/2c/amalgam) | **Report** — ~493 before M1–M3; `scripts/_m0_mod_paper_inventory.py` |
| M1 | Gun mod remainder apply goldens | Heavy Caliber, Hunter Munitions, Primed Cryo, Speed Trigger, Hammer Shot, Critical Delay, 60/60s, Lethal Torrent, Anemic Agility, Gunslinger, pistol 90s/60-60s, Primed Ravage, Contagious Spread, shotgun cores | **Locked** — +31 IDs in `gun-mod-audit.test.ts` |
| M2 | Melee remainder apply goldens | Primed Fever/Fury/Smite, Molten Impact, Berserker Fury stacks, Sacrificial Steel/Pressure; Primed Reach catalog+panel | **Locked** — +8 IDs in `melee-mod-audit.test.ts` |
| M3 | DPS aura apply goldens | Rifle/Pistol/Shotgun Amp, Steel Charge, Dead Eye paper `damage`; Growing Power panel; CP/SD no longer strip warframe armor/shield | **Locked** — `aura-mod-audit.test.ts` |
| M5 | Next gun/melee cores | Shred/Primed Shred, Vigilante Armaments/Fervor, Vile/Frail, Rifle Aptitude, IPS 90/120s, Primed Bane Corpus; Magnum Force, Augur Pact, Creeping Bullseye, Hollow Point, Primed Convulsion, pistol IPS; Primed Charged/Chilling; Fury/Quickening/Gladiator/Prowess/Amalgam OS/IPS/Focus Energy/Drifting Contact; Killing Blow heavy→panel | **Locked** — +41 IDs; Killing Blow no longer inflates light paper DPS |
| M6 | Mag/reload/set IPS cores | Wildfire, Vile Precision, Primed Bane Infested; Amalgam Barrel Diffusion, Ice Storm, Sure Shot, Stunning Speed, Shrapnel Rounds, Carnis/Jugulus/Saxum pistol; Critical Deceleration; Spoiled Strike, Jagged/Sundering/Rending, Carnis/Jugulus/Saxum melee, Primed Smite Corpus | **Locked** — +20 IDs |
| M7 | Mag/reload + magnetic cores | Fast Hands, Seeking Fury, Magazine Warp/Primed, Tainted Mag, Depleted Reload, Maximum Capacity; Slip/Primed Slip, Quickdraw, Loose Mag, Tainted Clip, Full Capacity, Merciless Gunfight, Magnetic Might, Accelerated Isotope; Burdened Magazine; Magnetic Rush, Martial Fury, Primed Smite Infested; Maiming Strike→panel | **Locked** — +21 IDs |
| M8 | Arch + leftover gun cores | Magnetic Capacity, Radiated Reload, Loose Hatch, Damzav-Vati; Rifle/Pistol/Shotgun Elementalist statusDamage (not base damage); Imperator/Veritux archgun+archmelee always-on cores | **Locked** — +47 IDs; Elementalist damage→statusDamage |
| M9 | Shotgun + utility cores | Shotgun general (Blunderbuss/Primed, Ammo Stock/Primed, Amalgam Barrage, Accelerated Blast, IPS, Chilling Reload, Atomic Fallout, Meltdown, Cryo Coating, Magnetic Strafe/Core, Loaded/Loose Chamber, Lingering Torment, Conductive Blade, Savvy); Hydraulic Gauge/Barrel, Bhisaj-Bal, Dizzying Rounds, Perpetual Agony; Lasting Sting, Reflex Coil, Focus Radon, Body Count/Rush/Combo Killer; HAE+comboDuration apply fixes; True Punishment combo→panel | **Locked** — +33 IDs |
| M10 | Warframe/Necramech + contempt | Archon Continuity/Intensify/Stretch/Flow(+185% fix)/Vitality; Augur Message/Reach/Secrets/Accord; Constitution, Armored Agility, Gladiator Aegis, Carnis Carapace, Cunning Drift, Physique, Sprint Boost, Endurance Drift; Equilibrium→panel; Necramech power/survivability; Amar/Boreal/Nira Contempt + Corrupt Charge; Augur Seeker; Necramech Augur/Deflection/Repair→panel | **Locked** — +33 IDs; Archon Flow energy fix |
| M11 | Archwing + WF remainder + claws | Archwing power/survivability (Odonata); Primed Redirection/Vigor/Streamline, Rush, Drift/Carapace/Resolve/Hastened/Controlled Slide/Sprint Speed; Flame/Frost Claws per-rank fix; Bite desc; Fast Deflection/Fortitude/Precision Intensify/Preparation/Armored DR/Mecha Pulse/Cull→panel | **Locked** — +~35 IDs; claw heat/cold 90→15 |
| M12 | Companion + WF/gun leftovers | Carrier survivability (+250% wiki); Retrievers; Flame Gland/Frost Jaw/Shock Collar/Venom Teeth + Bite/Maul on claws; Vigor/Mobilize/Adrenaline; Ravage/Barrage/Tactical Pump/Tainted Shell/IPS slash; Link/Deflection/Vicious Bond/QT/Finesse→panel | **Locked** — +~30 IDs; EV/MF desc +250% |
| M13 | RJ + parkour + convert cleanup | Railjack Hyperstrike/Predator/Section/Warhead/Artillery (alias double-count fix); WF parkour suite + Power Donation −30%; convert claws/conditioning; Galv Diffusion/Hell paper MS; IPS convert/finisher/slam/precept→panel | **Locked** — +~40 IDs; Power Donation sign fix |
| M14 | RJ remainder + gun/melee leftovers | RJ Conic/Ion/Ordnance Velocity/Overloader/Turret Velocity; mag/cannonade/Shell Rush/Necramech Redirection; Galv Shot/Savvy paper SC + Reflex HAE; Harkonar comboDuration; false always-ons→panel; turretProjectileSpeed no longer double-counts into ordnance | **Locked** — +~25 IDs; RJ speed/munitions goldens |
| M15 | Chamber/Higasa + precept cleanup | Higasa Serration +450%; Primed Chamber / Primed Charged Chamber first-shot DPS average; Jet Stream/Metem-Hakh/companion precepts/gated gun lines→panel; rename catalog `odenata`→`odonata` | **Locked** — +~15 IDs; Odonata id fix |
| M16 | Conditional paper locks + precepts | Secondary Wind/Bladed/Sharpened/Lie In Wait/Argon/Hydraulic/Galv Scope+Crosshairs/Pistol Acuity/Hemorrhage; Critical Focus/Marked Target; Protective Shots sim gate; remaining companion precept false always-ons→panel | **Locked** — +~25 IDs; conditional paper/sim goldens |
| M17 | Final gated exclusives | Archgun Ace / Deadly Efficiency(+Primed); Emergent Aftermath / Gorgon Frenzy; Catalyzer Link / Embedded Catalyzer; Spring-Loaded / Pressurized Mag; Proton Jet; Proton Snap SC (+ toxin→panel) | **Locked** — +11 IDs; always-on paper inventory cleared |
| Sim1 | Trigger-gated exclusives | Spectral Serration / Soaring Strike / Measured Burst; Aero Agility / Combat Reload / Motus Setup(+CC catalog); Laser Sight / Nano-Applicator / Repeater Clip / Shrapnel Shot; Lasting Purity; Double/Triple/Final Tap / Sudden Justice; Proton Snap toxin via trigger elemental pool | **Locked** — +15 IDs; elemental trigger apply |
| Sim2 | Weak-point / situational | Biotic Rounds (+magnetic catalog) / Leaded Gas; Kill Switch; Eximus Advantage / Range Advantage / Deadly Maneuvers | **Locked** — +6 IDs; WP elemental on kill/trigger |
| Sim3 | AE + max-stack exclusives | Brain Storm / Skull Shots / Zazvat-Kar AE; Critical Mutation / Pain Points / Critical Precision (max-stack trigger); Split Flights MS/killStacks cap 4 | **Locked** — +7 IDs; AE+WP trigger pool |
| Sim4 | Tendril / HP-cap exclusives | Sentient Surge (+SC catalog) / Dreadful Killshot / Necrophagic Vigor / Fired Up heat / Unseen Dread; Strain Infection cysts; Lohk Canticle FR | **Locked** — +7 IDs; HP-cap remaps |
| Sim5 | Cross-slot secondary buffs | Combo Fury / Mark Of The Beast via `linkage.meleeMods`; Amalgam Furax/Ripkas splits; Amalgam Javlok mag; Sentient Barrage trigger | **Locked** — +6 IDs; cross-slot helper |
| Sim6 | Syndicate exclusive paper | Scattered Justice / Gilded Truth / Deadly Sequence / Shattering Justice; Eroding/Stockpiled Blight; Blade/Bright/Justice Blades; Toxic Blight; Gleaming Blight SC; Photon Overcharge | **Locked** — +12 IDs; syndicatePower stays panel |
| Sim7 | Final SC + flat mag | Entropy Burst / Napalm Grenades final SC; Stinging Truth +40 flat mag | **Locked** — +3 IDs; `flat` apply mode |
| Sim8 | Jet Stream ability gate | Turbulence-active + Jet Stream: +40% move / +100% proj × Strength (R3); paper stays panel | **Locked** — +1 ID; display proj + loadout sprint |
| Sim9 | Elemental infusion gates | Fireball Frenzy / Freeze Force / Shock Trooper / Venom Dose / Smite Infusion: ability-gated parallel element × Strength; no exalted | **Locked** — +5 IDs; parallel elemental apply |
| Sim10 | Ability-gated primary buffs | Teeming Virulence (+120% primary CC × STR); Thrall Pact (dmg × thralls × STR); Smoke Shadow (+150% CC, no STR) | **Locked** — +3 IDs; thrallCount slider; Teeming wiki R3 fix |
| Sim11 | Thermal Transfer polarity | Thermal Sunder + Thermal Transfer: Cold/Heat/Blast parallel × Strength (R3 75%/150%); no exalted | **Locked** — +1 ID; thermalTransferPolarity sim |
| Sim12 | Blitz + Critical Surge | Razorwing Blitz FR/AS × stacks × STR (Pixia/Diwata); Critical Surge primary CC × meters × STR (cap 250%) | **Locked** — +2 IDs; stack/meter sim sliders |
| Sim13 | Harpak pull trigger | Exposing Harpoon: +300% CC after pull via `applyTriggerBuffs` | **Locked** — +1 ID |
| Sim14 | Furious Javelin | Radial Javelin hits → melee damage mult × enemies × STR (incl. Exalted Blade) | **Locked** — +1 ID; furiousJavelinEnemies slider |
| Sim15 | Valence Formation | Lavos imbue → parallel elemental × rank (50–200%) + guaranteed status; not × STR | **Locked** — +1 ID; valenceFormationElement picker |
| Sim16 | Miss / grenade decay stacks | Critical Precision / Mutation: sim stack sliders (miss −10 / grenade −1) instead of hard max | **Locked** — criticalPrecisionStacks / criticalMutationStacks |
| R1 | Riven grader | Disposition-scaled ranges (rank × buff-count); heuristic grade; no generation; unknown-disp warn; PT/combo units; IPS curses | **Locked** — `riven-calculator.test.ts` |
| R1b | Riven dispositions sync | `omegaAttenuation` from api.warframestat.us via `scripts/_sync_riven_dispositions.mjs` (not 1–5 star `disposition`) | **Locked** — 630 weapons |
| RJ1 | Railjack hardpoints + armaments | Nose/Dorsal/Ventral turrets; Cryophon/Glazio + Lavan Photor/Pulsar/Talyn; Sigma-only ordnance Mk tiers; reactor avionics capacity; Uranus presets apply Plexus mod ids | **Locked** — inventory + calc + preset goldens |
| RJ2 | Railjack ship paper | Wiki mid-range absolute plating/shields; engine cruise/boost house roles; reactor avionics + dual ability %; Mk IV components still projected | **Locked** — component goldens |
| RJ3 | Railjack engine/shield formulas | Conic on base 150 + flat engine m/s; SWB = cruise × (1.3×IonBurn + engine boost); shield %/s + delay; flux base 273 (no reactor flux); absolute UI labels | **Locked** — calc + UI goldens |
| RJ4 | Railjack house unique traits | Wiki Mk III trait catalog; Lavan reactor+plating +25% shields; shields-depleted engine/shield combat traits via sim; UI trait list | **Locked** — trait goldens |
| RJ5 | Railjack trait roll selection | One wreckage trait per house component; paper effects only for selected roll; save/load + UI selects | **Locked** — trait-roll goldens |
| RJ6 | Tunguska Forward Artillery paper | Wiki 56.5k / 300% CC / 2× CD / 4s charge; Forward Artillery mod scales damage; avg red-crit shot + charge DPS; Dome Charges out of scope | **Locked** — artillery goldens |
| RJ7 | Intrinsics (+ Dirac note) | Gunnery 1 +50% Dorsal/Ventral; Tactical 6/7/9 Battle energy & Tac CD; Engineering/Command unlocks; Dirac/grid removed U29.10 → Endo (documented) | **Locked** — intrinsic goldens |

**Remaining unlocked paper-moving mods (post Sim16):** none for always-on paper; further work is Tier B/C items (precepts, mission AI, description-only).

---

## Tier C — Documented out of scope

| ID | Area | Notes |
|----|------|-------|
| C1 | Most `mod_panel` lines | Precepts / utility |
| C2 | Most `arcane_panel` lines | Display / non-auto DPS; Magus Overload stays panel (enemy max HP) |
| C3 | Weapon passives text | Not wired into DPS |
| C4 | Full mission AI / unlisted team buffs | Disclaimer |
| C5 | `biting_frost` paper DPS | Conditional on 10 Cold freeze — panel only |
| C6 | Stance per-hit animation graphs | Hit-avg + cycle Multi/s shipped; frame-accurate hit timelines remain out of scope |
| C7 | Mecha set status-spread DoT | **Moved → B4** (sim-gated DoT + claw + cascade slider); full mark AI / Gas graphs remain out of scope |

---

## Phase completion log

| Phase | Date | Outcome |
|-------|------|---------|
| 0 Baseline | 2026-07-21 | Tests green; checklist written |
| 1 Core math | 2026-07-21 | Bare Braton/Lex/Skana/Amprex goldens |
| 2a Gun mods | 2026-07-21 | 20 wiki max-rank apply tests |
| 2b Melee + biting_frost | 2026-07-21 | Volcanic Edge heat restore; biting_frost; coverage 1600/1600 |
| 2c Warframe mods | 2026-07-21 | Post-U34 survivability + power mod goldens |
| M0–M3 Mod paper | 2026-07-23 | Inventory + gun/melee/aura apply goldens; amp aura paper; CP/SD panel fix |
| M5 Mod paper cores | 2026-07-23 | +41 gun/melee/shotgun apply goldens; Killing Blow heavy-only → mod_panel |
| M6 Mag/set IPS cores | 2026-07-23 | +20 Wildfire/Ice Storm/Amalgam BD/Sure Shot/Shrapnel/set IPS/Spoiled/Smite Corpus |
| M7 Mag/reload cores | 2026-07-23 | +21 magazine/reload/magnetic/smite; Maiming Strike slide→panel |
| M8 Arch + leftovers | 2026-07-23 | +47 gun leftovers/Elementalist + archgun/archmelee cores; Elementalist statusDamage fix |
| M9 Shotgun + utility | 2026-07-23 | +33 shotgun/utility/melee cores; HAE+comboDuration apply; True Punishment panel |
| M10 Warframe/Necramech | 2026-07-23 | +33 Archon/Augur/Necramech/Contempt cores; Archon Flow + Equilibrium/Necramech panel fixes |
| M11 Archwing/WF/claws | 2026-07-23 | +~35 archwing + warframe remainder + claw goldens; panel mis-tags; claw element per-rank fix |
| M12 Companion/WF/gun | 2026-07-23 | +~30 companion survivability + claw glands + WF/gun leftovers; Link/recharge panel fixes |
| M13 RJ/parkour/convert | 2026-07-23 | +~40 RJ cores + parkour + convert claws; RJ alias double-count + Power Donation sign |
| M14 RJ/gun leftovers | 2026-07-23 | +~25 RJ remainder + mag/cannonade/Galv SC/Reflex/Harkonar; panel mis-tags; turret proj speed alias fix |
| M15 Chamber/precepts | 2026-07-23 | +~15 Higasa/Chamber goldens; precept/gated panel cleanup; Odonata rename |
| M16 Conditional locks | 2026-07-23 | +~25 on-kill/trigger/headshot paper vs sim goldens; companion precept panel; Protective Shots sim |
| M17 Final gated exclusives | 2026-07-23 | +11 Archgun Ace/Deadly Eff/Catalyzer/Spring-Loaded/Proton Jet/Snap; toxin mis-tag panel |
| Sim1 Trigger-gated exclusives | 2026-07-23 | +15 panel→trigger; Proton Snap toxin remap; Motus CC catalog; elemental trigger pool |
| Sim2 Weak-point / situational | 2026-07-23 | +6 Biotic/Leaded/Kill Switch/Eximus/Range/Deadly; Biotic magnetic catalog |
| Sim3 AE + max-stack exclusives | 2026-07-23 | +7 Brain/Skull/Zazvat AE; Mutation/Pain/Precision max stacks; Split Flights cap 4 |
| Sim4 Tendril / HP-cap exclusives | 2026-07-23 | +7 Surge/Killshot/Vigor/Fired Up/Unseen/Strain/Lohk; Surge SC catalog; HP→cap remaps |
| Sim5 Cross-slot secondary buffs | 2026-07-23 | +6 Combo Fury/Mark/Amalgam Furax·Ripkas·Javlok/Barrage; melee→gun linkage |
| Sim6 Syndicate exclusive paper | 2026-07-23 | +12 syndicate always-on combat lines; syndicatePower panel |
| Sim7 Final SC + flat mag | 2026-07-23 | +3 Entropy/Napalm final SC; Stinging Truth flat mag; `flat` mode wiring |
| Sim8 Jet Stream ability gate | 2026-07-23 | Jet Stream via Turbulence toggle; STR-scaled move/proj; paper panel |
| Sim9 Elemental infusion gates | 2026-07-23 | +5 hold-cast infusions; parallel element × STR; no exalted |
| Sim10 Ability-gated primary buffs | 2026-07-23 | Teeming/Thrall/Smoke Shadow; thrallCount sim; Teeming 120% wiki fix |
| Sim11 Thermal Transfer polarity | 2026-07-23 | Cold/Heat/Blast parallel × STR; polarity sim select; no exalted |
| Sim12 Blitz + Critical Surge | 2026-07-23 | Razorwing stacks FR; Surge teleport meters CC; Critical Surge per-m catalog fix |
| Sim13 Harpak pull trigger | 2026-07-23 | Exposing Harpoon → trigger CC on Harpak |
| Sim14 Furious Javelin | 2026-07-23 | Radial Javelin enemy count → melee damageMult × STR |
| Sim15 Valence Formation | 2026-07-23 | Lavos imbue → parallel elemental + guaranteed status (not × STR) |
| Sim16 Miss/grenade decay stacks | 2026-07-23 | Critical Precision / Mutation stack sliders for miss/grenade decay |
| R1 Riven grader | 2026-07-23 | Disposition ranges + heuristic grade; no generation; unknown-disp warn |
| RJ1 Railjack hardpoints/armaments | 2026-07-23 | 3 turret slots; Cryophon/Glazio/Lavan trio; Sigma ordnance; avionics capacity; presets equip Plexus |
| R1b Riven dispositions sync | 2026-07-23 | omegaAttenuation sync script; 630 weapons |
| RJ2 Railjack ship paper | 2026-07-23 | Absolute plating/shields; engine house cruise/boost; reactor avionics + dual ability % |
| RJ3 Engine/shield formulas | 2026-07-23 | Conic on base 150; SWB mult model; shield %/s + delay; flux 273; absolute UI labels |
| RJ4 House unique traits | 2026-07-23 | Trait catalog; Lavan plating synergy; shields-depleted sim traits; UI |
| RJ5 Trait roll selection | 2026-07-23 | Per-component trait picker; effects gated to selected roll |
| RJ6 Tunguska paper | 2026-07-23 | Fixed chin mount paper; FA mod × damage; red-crit avg shot; Dome Charges deferred |
| RJ7 Intrinsics | 2026-07-23 | Gunnery/Tactical paper; forge/elite unlocks; Dirac→Endo note (no grid) |
| 3 Conditionals | 2026-07-21 | Galv Chamber/Aptitude, CO, BR, WW stack goldens |
| 4 TTK | 2026-07-21 | Shield overflow + DoT end-time improvements |
| 5–9 Satellite | 2026-07-21 | Stance type fallbacks; Cascadia Overcharge DPS; Roar registry; companion/RJ smoke |
| 5–9 deepen | 2026-07-21 | Kinship/Hot Shot stack DPS; Mirage+Helminth Eclipse; Umbral set; Helminth buff fallback |
| Sets + abilities + Incarnon | 2026-07-21 | Augur/Hunter panel scaling; Breach Surge not weapon buff; Electric Shield gun buff; Laetum form golden |
| Ability Extra Hits + Felarx | 2026-07-21 | Nourish/Toxic Lash/Xata/Vex loadout buffs; Helminth Nourish/Xata data fix; Felarx form golden |
| Helminth + SG + Augur Seeker | 2026-07-21 | Helminth Roar 30%; SG additive; Empower not weapon buff; Augur Seeker→pistol |
| Parasitic Link + Incarnon forms | 2026-07-21 | PL mult golden; Braton/Latron/Onos/Dread forms; Celestial Twin health STR |
| Misc multiplier display | 2026-07-21 | Fixed bare multipliers misread as seconds/percent (Celestial Twin 2×) |
| Spores + more Incarnons + Ruvox | 2026-07-21 | Spores growth×STR; Paris/Lato/Gorgon/Despair forms; Ruvox trigger Melee |
| Melee triggers + Miasma + Genesis | 2026-07-21 | Dual Viciss/Ekhein→Melee; Miasma 4× Spores misc; Bronco/Cestra/Sicarus/Kunai/Zylok forms |
| Mk1 melee triggers + more forms | 2026-07-21 | Mk1-Bo/Mk1-Furax→Melee; Gammacor/Miter form goldens |
| Prova/Venato data | 2026-07-21 | Prova(s)→Melee; Venato(+Prime) stance scythe + Venato trigger Melee |
| Strun form golden | 2026-07-21 | Impact 100 Semi / mag 40 + Blast/Puncture/Slash AoE |
| Synoid/Bo/Nami/Pillage | 2026-07-21 | Synoid form override; Bo +4 / Nami +3 form range; Pillage strip×STR |
| Native melee form range | 2026-07-21 | Innodem/Praedos +3 Range; Ruvox +3 Range/−35% AS |
| Ruvox IPS + Terrify | 2026-07-21 | Ruvox form Impact→Puncture; Terrify 15m/25s/60% strip + enemy count×STR |
| TL dip + Vex fill + Onos charge | 2026-07-21 | Extra Hit × (1+elem mods); Vex Fury 0–1; Onos charge Heat 2200 mode |
| TL DoT + Thalys T1 | 2026-07-21 | Guaranteed TL Toxin DoT + Extra Hit faction² / DoT faction³; Thalys +3 Range/+40% AS |
| Spores TL + stances + combo evos | 2026-07-21 | Spores 2× Extra Hit (1 DoT); stance avg fill-ins; Adept Reflexes/Resolute Force/Magistar IC |
| Genesis HAE/windup/reload + Tharros | 2026-07-21 | Obex +50/+10; Overhand set HAE; Swift Break windup; Ready Retaliation reload; Tharros/Gravitic misc |
| Sicarus SE + max-stack Genesis | 2026-07-21 | Sicarus SE/EV variants; Edge of Justice +40% AS; Avalanche/Headcracker/Accel/Resonant; PL 0.25 |
| Genesis conditionals | 2026-07-21 | Fatal Affliction×statusTypes; Wiseman/High Ground/Decisive cross-stats; Prelude CM gate |
| Genesis bleed/HS/status | 2026-07-21 | Flashing Bleed; Caput/Deadhead; Carnage; Alchemy dur; Fevered MS; Reaver; Neurotoxin |
| Genesis max-stack paper | 2026-07-21 | Kill Joy/Stormburst/Infused/Crimson/Paragon/Riddled/Blazing/Synergist/Skullbuster/Gun&Blade; sprint FA/FR |
| Genesis conditional uptime | 2026-07-21 | Haven/Paladin/Guardian/Daring/Deathtrap/Red Right/Dawn/half-HP/Hoplite/Swooping/Impaler/Zylok stacks |
| Contagion Cloud panel | 2026-07-21 | R3 300/s×STR, 5m×RNG, 12s×DUR on Toxic Lash miscStats; mod stats absolutes |
| Contagion Cloud DPS | 2026-07-21 | Sim-gated enemies (0–8) × ability toxin DPS × STR (×2 melee) when Contagion Cloud augment + Toxic Lash active; separate panel row; not in TTK |
| Lavos Probe CDR×EFF | 2026-07-21 | Transmutation Probe cooldownReduction × Ability Efficiency (1.5s×EFF); EFF scale attr + badge wired for misc panel |
| Garuda Bloodletting×EFF | 2026-07-21 | energyGainPercent × Ability Efficiency (40%×EFF); health deduct / min HP Misc-fixed |
| Inverse-DUR misc | 2026-07-21 | EV pulseInterval÷DUR (floor 0.5s); Shadows healthDecay÷DUR; Navigator growth÷DUR; Prowl stealTime÷DUR; stealTime display as seconds |
| Equinox Pacify DR | 2026-07-21 | pacifyDamageReduction = 1−(0.5÷STR); wiki Intensify 130% → ~61.5% (panel 62%) |
| Sol Gate channeled drain | 2026-07-21 | energyDrain/boostedEnergyDrain × max((2−EFF)÷DUR, 0.25); 12→8.4 at 130% EFF |
| Nyx Absorb convert×STR | 2026-07-21 | weaponDamageConvert 0.025%×STR (cap 400% Misc) |
| Nyx Absorb √buff DPS | 2026-07-21 | Sim-gated absorbed damage (0–64k) → additive weapon buff √(0.025%×STR×absorbed) cap 400%; wiki 20k@130% STR → +255% |
| Nourish energy×STR | 2026-07-21 | energyMultiplier 1+((base−1)×STR); native 2→2.3 / Helminth 1.6→1.78 at 130% STR |
| Gloom channeled drain | 2026-07-21 | energyDrainPerEnemy × max((2−EFF)÷DUR, 0.25); fixed 0.75→75% / cap→10% display bugs |
| Equinox channeled drains | 2026-07-21 | Pacify 0.5/s/enemy + Mend & Maim 3.5/s × max((2−EFF)÷DUR, 0.25) |
| Channeled drain batch | 2026-07-21 | Peacemaker/Hysteria/Spectral Scream/Effigy/Exalted Blade(+Umbra family)/Elude/Sound Quake/Danse/Razorwing/Primal Fury/Prism/Navigator/Prowl/Renewal/Mass Vitrify/Glory/Pulverize/Silken Stride/Mach Rush/Tail Wind/Guard Mode/Ironbride × EFF/DUR |
| Hildryn shield costs | 2026-07-21 | Haven/Aegis drains × EFF/DUR; Haven recharge × DUR; Haven/Aegis/Balefire shieldCost cast × EFF (25% floor) |
| Genesis leftovers paper | 2026-07-21 | Boar Reified 24; Steadfast ×3 CM; Felarx MM +60% FR; Kinetic CM set 4; Lethal +90% reload; OA +1200%; Sawblades +70% FR; Gambit +150% CC |
| Genesis P0 + Shroud + stance | 2026-07-21 | Bo +50% HAE; Templar +70% HAE; Ballistica FR/CC stacks; Ruvox Impetus/Brutal; Phenmor Spiteful/Lingering; Praedos TM; Shroud CD/SC×STR; Coiling Viper 1.85 |
| Ammo efficiency sustained | 2026-07-21 | AE extends mag cycle; Daring/Trusty/Enough/Feather/Agile/Reaper paper; arcane AE no longer no-op |
| Flensing + stances + Shroud fix | 2026-07-21 | Latron −20% armor/Puncture in TTK; stance avgs; Shroud SC/speed no longer ×STR; Felarx/Lato AE |
| Cascade + Bolts + range paper | 2026-07-21 | Onos +250% CC/CM; Psychic Bolts 80%×STR; Ulfrun speed fixed; Thalys/Skyborne/Brigand/Reaching; Flensing→damage-sim |
| Boltor variants + Genesis paper | 2026-07-21 | Prime/Telos form overlays; Crimson Overture AE stacks; Vendetta +30% MS; Torid Plentiful +60%; Gnashing Payara 1.85 |
| Cyclone + Chroma panel + Genesis | 2026-07-21 | Cyclone Kraken 2.4; EW/Vex misc×STR/DUR/RNG; Larva mutation×STR; Destreza SC/windup; Ronin +30% AS |
| Variant forms + Contempt stance | 2026-07-21 | Latron Prime/Wraith, Lex Prime, Strun Prime/Wraith form overlays; Sinking Talon 1.7; Archon Contempt 1.0 |
| Gorgon/Soma forms + Effigy | 2026-07-21 | Gorgon Wraith/Prisma + Soma Prime form overlays; Atlantis Vulcan 1.7; Effigy misc camelCase (Misc fixed) |
| More variant forms + Fangs | 2026-07-21 | Braton Prime/Vandal, Lato/Sybaris/Paris Prime, Dera Vandal forms; Butcher's Revelry 1.9; Fangs counts |
| Sibling forms + Sybaris ED | 2026-07-21 | Lato Vandal, Dex Sybaris, Mk1-Braton forms; Burston Prime 28% CC; Sybaris Prime ED form +23% SC |
| More sibling Incarnon forms | 2026-07-21 | Sicarus Prime, Prisma Angstrum, Mk1-Strun, Boar Prime forms; Boar form MS 1 |
| Zylok/Ballistica/Bronco Prime | 2026-07-21 | Zylok Prime 500 IPS + Heat 700; Ballistica Prime Slash 830 MS 1; Bronco Prime 34 IPS |
| Vasto/Paris/Vectis/Rakta forms | 2026-07-21 | Vasto Prime IPS 70; Mk1-Paris 50+250; Vectis Prime Cold 150; Rakta Ballistica Slash 734 |
| Mk1 Furis/Kunai + stances | 2026-07-21 | Mk1-Furis Heat 60; Mk1-Kunai IPS 24; Kunai SC/Deathtrap variants; Stinging Thorn + Astral Twilight 2.2 |
| Vasto Deathtrap + dagger/glaive stances | 2026-07-21 | Vasto Prime Deathtrap +0.8× CM; Gleaming Talon 2.6; Homing Fang / Pointed Wind 2.4 |
| Stance Neutral avgs batch | 2026-07-21 | Iron Phoenix 2.3; Crossing Snakes 1.8; Flailing Branch / Fracturing Wind 3.0; Eleventh Storm 2.7; Rising Steel / Celestial Nightfall Conclave 1.0 |
| Gemini Cross Neutral avg | 2026-07-21 | Vagrant Blight hit avg ~1.2× (was 1.65; many 50% hits) |
| Swirling Tiger Neutral avg | 2026-07-21 | Winding Claws hit avg ~1.4× (was 1.6) |
| Carving Mantis Neutral avg | 2026-07-21 | Rapid Incisions hit avg ~2.4× (was 1.65) |
| Stance Neutral batch 2 | 2026-07-21 | Crimson Dervish 2.8; Bleeding Willow 1.3; Sovereign Outcast 1.5; Seismic Palm / Four Riders 2.6; Clashing Forest 1.7 |
| Stance Neutral batch 3 | 2026-07-21 | Blind Justice / Swooping Falcon 2.4; Stalking Fan 3.0 |
| Stance Neutral batch 4 | 2026-07-21 | Reaping 3.2; Twirling/Vengeful 2.8; Crushing Ruin 3.0; Defiled 2.3; Vermillion 2.2; Shimmering 1.3; Brutal Tide 1.8 |
| Stance Neutral batch 5 | 2026-07-21 | Shattering Storm 3.5; Tranquil Cleave 2.2; Slicing Feathers 2.4; Fateful Truth / Crashing Havoc Conclave 1.0 |
| Stance Neutral batch 6 | 2026-07-21 | Galeforce/Mountain's Edge 3.0; Rending Crane 2.8; Grim Fury 2.6; Votive 2.0; Noble Cadence Conclave 1.0 |
| Stance Neutral batch 7 | 2026-07-21 | Tempo Royale 2.3; High Noon 1.6; Bullet Dance 1.7 |
| Stance Neutral batch 8 | 2026-07-21 | Cleaving Whirlwind 3.3; Gaia's Tragedy 3.0; Decisive Judgement / Wise Razor 2.8 |
| Stance Neutral batch 9 | 2026-07-21 | Burning Wasp / Sundering 3.0; Spinning/Gnashing/Butcher 2.8; Vulpine 2.3; Coiling 2.0; Harbinger 1.9; Sinking 1.0; Atlantis 0.7 |
| Conclave stance paper | 2026-07-21 | Remaining Conclave stances (Quaking Hand, Rending Wind, Argent Scourge, …) → 1.0; Argent mapped in stances.ts |
| B5 Ember + Prismatic | 2026-07-21 | Prismatic placementDistance not ×RNG; Immolation 85%/40% DR×STR; Fire Blast 200/25m + strip×STR; Effigy/Lycath/Ulfrun/Shroud fixed-misc goldens |
| Catalog hallucination purge | 2026-07-21 | Removed 44 wiki-missing stubs (fake stances, misnamed dups, junk); kept real dups under correct names |
| Jade Ophanim + Symphony | 2026-07-21 | Wiki-fixed Ophanim Eyes 50/20m/30s/Heat+strip; Symphony Deathbringer additive DPS; Jade's Judgment → augment + warframeId |
| Jade Judgment + Glory | 2026-07-21 | Light's Judgment 500 Heat/6m/10s + heal×STR; Glory 25+5/s, 150/1500 Heat, DR 35%×STR (cap 50%) |
| B5 Gauss kit | 2026-07-21 | Thermal Sunder 750/1500 + radii×RNG; Helminth 450/900; Plating DR×STR; Redline buffs×DUR + loadout FR |
| B5 Gyre kit | 2026-07-21 | Arcsphere/Coil/Rotorswell wiki numbers; Cathode Grace 75/8s/+50% CC×STR; Helminth→Coil Horizon (was wrong Cathode) |
| B5 Protea kit | 2026-07-21 | Fan 500 Slash/5m/13s + satellites; Artillery 50/500 Heat; Dispensary 75/25s (Helminth 12.5s); Anchor 100/8s/15m |
| B5 Dante kit | 2026-07-21 | Noctua 5+2/shot 250/2750; Light/Dark 25 energy; Final 50/45s/30m; Helminth→Dark Verse (was wrong Noctua) |
| B5 Qorvex kit | 2026-07-21 | Pillar 1000/8m/35s; Wall 50/3500 Impact+200 Rad tick; Guard 75/5–10 stacks×STR; Blast 100/10k DPS; Helminth→Pillar |
| B5 Lavos kit | 2026-07-21 | Bite 1000/10m/8s CD +15% heal×STR; Vial 250/s 30m/8s/5s CD; Probe 250/s 6m/10s CD +1.5s CDR×EFF; Catalyze 2000/25m/30s CD |
| B5 Kullervo kit | 2026-07-21 | WA +200% flat final melee CC×STR (Helminth +100%/12.5m); Recompense 500/8m; Curse 50% redirect; Ukko 2500/s/10m/15s |
| B5 Sevagoth kit | 2026-07-21 | Reap 250 Rad/8m +50% vuln; Sow 50/250 True DPS; Gloom 50+0.75/s/enemy×EFF/DUR slow/lifesteal×STR; Shadow Death Well 75%/1%/s |
| B5 Dagath kit | 2026-07-21 | Wyrd 500/1000 Viral +35% slow; Doom 500/15m; Grave +50% CD×STR; Cavalry 30k/strip; Helminth→Wyrd (was Doom) |
| B5 Caliban kit | 2026-07-21 | Gyre 500 Tau/s; Wrath 2000/+35% vuln; Progeny 50/45s; Fusion 15k/s +50% strip; Helminth Wrath filled |
| B5 Baruuk kit | 2026-07-21 | Elude 25+2.5/s 180°; Lull 50/20s/25m; Hands 250 Blast/8 daggers×STR; Storm 250 +25% DR (cap 40%) |
| B5 Harrow kit | 2026-07-21 | Condemn 150 shields/enemy×STR (flat); Penance +35% FR/+70% reload×STR; Thurible EPK; Covenant Retaliation CC absorb sim |
| B5 Garuda kit | 2026-07-21 | Mirror 2× capture/20s/30m; Altar 25%/s heal; Bloodletting 40% energy×EFF; Talons 300/75% SC |
| B5 Nezha kit | 2026-07-21 | Walker 200 Heat/s +1250 blast; Chakram 250/+100% vuln; Halo 1000 HP/2.5× armor+absorb Misc + Initial=(base+mult×armor)×STR; Spears 600/19m/12s |
| B5 Styanax Helminth | 2026-07-21 | Helminth→Tharros Strike (was wrongly Rally Point); native Tharros 1000 Impact / 50% strip / 100 heal |
| B5 Voruna kit | 2026-07-21 | Shroud flat melee CD×STR buff; Helminth→Lycath's Hunt 50% orbs (was wrongly Shroud); Ulfrun kill CD numeric |
| B5 Nekros kit | 2026-07-21 | Soul Punch mark/threshold; Desecrate 25m/60% orb/10e/corpse×EFF; Shadows +150% dmg/+100% HP/SP +3% decay÷DUR; Helminth Terrify 75 |
| B5 Hydroid kit | 2026-07-21 | Barrage 300 Corrosive; Plunder 75/25m armor+Corrosive bonus; Tentacle 50/200 DPS (was 100 energy) |
| B5 Limbo kit | 2026-07-21 | Banish 250 Impact/35m/25s; Stasis 15s; Surge 25m/18s banish; Cataclysm 500 Blast/16→5m |
| B5 Loki kit | 2026-07-21 | Decoy 25s/15% absorb; Invis 12s (was 30); Switch 75m/+50% speed; Disarm 500 Impact/20m |
| B5 Mag kit | 2026-07-21 | Pull 300/25m; Magnetize 300 Blast/2×/15s; Polarize 400/8m; Crush 1500/18m |
| B5 Frost kit | 2026-07-21 | Freeze 350/150 area/5m; Ice Wave 700/20m/45°; Globe 3500/5m/5× Misc + Initial HP=(base+mult×armor)×STR; Avalanche 1500/15m/60% strip |
| B5 Gara kit | 2026-07-21 | Lash 400/12m; Storm 250/s 70% DR/2.5m; Spectrorage 800/1500; Vitrify 75/11m/50% vuln/1600 seg/5× Misc + Initial seg pool + crystallized absorb |
| B5 Equinox kit | 2026-07-21 | Meta 25s Night/Day +150 Night Shields×STR (flat); Rest&Rage 25/50m/22s; Pacify 50% DR via 1−(0.5÷STR)/16m +0.5/s/enemy×EFF/DUR +3e/ability×EFF; Mend&Maim 50/150 Slash/18m +3.5/s×EFF/DUR |
| B5 Ivara kit | 2026-07-21 | Quiver Cloak 12s/2.5m; Navigator 5× +growth÷DUR +drain/growth×EFF/DUR; Prowl +40% HS/stealTime÷DUR +melee/dmg energy×EFF; Artemis 240×7 |
| B5 Ash kit | 2026-07-21 | Shuriken 750×5; Smoke 12s/10m; Teleport +200% finisher; Blade Storm 1500 True/12e/mark×EFF |
| B5 Atlas kit | 2026-07-21 | Landslide 350/12m; Tectonics 1500 HP/5× Misc + Initial=(base+mult×armor)×STR; Petrify 20s/14m/+50% vuln; Rumblers 2000/1200 HP |
| B5 Banshee kit | 2026-07-21 | Boom 50 Impact/15m; Sonar 5×/35m/30s; Silence 30s/20m; Quake 200 Blast/s/20m |
| B5 Revenant kit | 2026-07-21 | Enthrall 1000/30s; Mesmer 6 charges; Reave 50/8%/6m (was 75); Danse 1250/s |
| B5 Oberon kit | 2026-07-21 | Smite 500/35%/50m; Ground 100 Rad/15m; Renewal 25/50% armor/40 HPS; Reckoning 7500/60% strip |
| B5 Octavia kit | 2026-07-21 | Mallet 2.5×/10m/20s; Resonator 125/6→15m; Metronome 12m/20s buffs; Amp 25–200%/14m |
| B5 Trinity kit | 2026-07-21 | Well 100 HPS/1% LS/20s; Vampire 25 energy/pulse×STR +interval÷DUR (floor 0.5s); Link 3/75% redirect; Blessing 80%/50% DR |
| B5 Nova kit | 2026-07-21 | Null Star 200 Blast/12/10m/5% DR; AMD 200/8×; Wormhole 50m/4; MP 800/50% slow/30s |
| B5 Volt kit | 2026-07-21 | Shock 15/200/5 chains; Speed 75%/25% reload; Shield +50% Elec; Discharge 1200/s |
| B5 Excalibur kit | 2026-07-21 | Slash Dash 20m/7m chain (dmg via Exalted); Blind/Howl 25m/15s; Javelin 1000/25m; Blade 250/2.5/s +5m/6s slide blind +25 slide×EFF |
| B5 Wisp kit | 2026-07-21 | Reservoirs 5m/30s motes (300 HP/30 HPS/20% haste/10 Shock); Wil-O 4s; Breach 2×/18m/16s; Sol Gate 1500/s +drain×EFF/DUR; Helminth 18m |
| B5 Zephyr kit | 2026-07-21 | Tail Wind 750/4500 dive/2m/7m +12.5 air×EFF; Airburst 500/8m/+35% +25 air×EFF; Turbulence 6m/20s; Tornado 160/0.25s (640 DPS)/25m/3 |
| B5 Nyx kit | 2026-07-21 | Mind Control 60m/60s; Bolts 80% strip/6/11s; Chaos 25m/25s/10 Rad; Absorb 1500/15m→50m/5s +0.025% convert×STR; Helminth MC 60s |
| B5 Mesa kit | 2026-07-21 | Battery 70%/140/5k; Gallery 25%/16m/30s; Shatter 80% DR (cap 95%); Peacemaker 50/+150%/15/s/50m |
| B5 Mirage kit | 2026-07-21 | Hall 4 clones/25s; Sleight 200/40m/18s; Eclipse 75% DR/200% dmg/25s (cap 90%); Prism 250/12s/20 lasers; Helminth Eclipse 25s |
| B5 Nidus kit | 2026-07-21 | Virulence 200 Puncture/16m × Mutation stacks panel; Larva 12m (Helminth 8m); Link 1 stack/40m; Ravenous 150/20 HPS/8m |
| B5 Rhino kit | 2026-07-21 | Charge 650/12m/2m; Iron Skin 1200 OG/2.5× Misc + Initial OG=(base+mult×armor)×STR; Roar 50%/25m/30s; Stomp 800/97.5% slow; Helminth Roar 30% |
| B5 Valkyr kit | 2026-07-21 | Rip Line 600/75m; Warcry 50% AS/50% armor/20s (Affinity); Paralysis 400/10m/30% slow; Hysteria 250/5/s; Helminth Warcry AS 30% |
| B5 Grendel kit | 2026-07-21 | Feast 500 Toxin/25m/5; Nourish +75% Viral/2× energy/1000 heal/25s; Pulverize 500–2000/50% strip; Regurgitate 2000/6m/75% strip; Helminth Nourish 45%/1.6×/no heal; energy 1+((mult−1)×STR) |
| B5 Hildryn kit | 2026-07-21 | Balefire 500–1500/3m/50 shields×EFF; Pillage 8m/25% strip/150 shields×EFF; Haven 500 ally shields/80% recharge×DUR/drains×EFF/DUR; Aegis Storm 200 DPS/500 Impact/drains×EFF/DUR/50 dodge×EFF |
| B5 Titania kit | 2026-07-21 | Spellbind 50m/5m/16s; Tribute 500/12s +120s aura; Lantern 350 DPS/2500/25s; Razorwing 160/Diwata 200/5/s; Helminth→Spellbind (was wrongly Tribute) |
| B5 Saryn kit | 2026-07-21 | Spores 10/60m/16m spread/+2 growth; Molt 500 HP/400 Toxin/40s/50% speed; Toxic Lash 30%/60%/45s; Miasma 150 Viral/s ×4 Spores; Helminth Molt 40s |
| B5 Wukong kit | 2026-07-21 | Twin 2× HP/0.5×/3× mark; Cloud 8m/1%/m; Defy 7.5×/1.5× armor/1500 cap; Primal Fury/Iron Staff 300/5/s; Helminth Defy armorCap 750 |
| B5 Xaku kit | 2026-07-21 | Xata +26% Void/35s; Grasp 50/15m/6 targets; Lost Deny 4000/Gaze 50% strip; Vast Untime 1200/25% slow (cap 95%)/50% Void vuln |
| B5 Yareli kit | 2026-07-21 | Sea Snares 250 Cold/s/+125/s/100% vuln/12s; Merulina 7500 HP/90% redirect; Aquablades 750/45s/75e/5m; Riptide 500/2500 burst; Helminth Aquablades 75e |
| B5 Khora kit | 2026-07-21 | Whipclaw 150/10m/5m; Ensnare 30m/15s/10m spread; Venari 1.15× speed/350 snare/50 HPS; Strangledome 250/5m/10m grab; Helminth Ensnare 30m |
| B5 Inaros kit | 2026-07-21 | Desiccation 150 True/8 DPS/15m/8s/25% LS; Sandstorm 500 Slash DPS/7.5m; Scarab Shell 350 armor/0e; Scarab Swarm 100e/10% HP/tick; Helminth Desiccation filled |
| B5 Vauban kit | 2026-07-21 | Tesla 150/25 DPS/6m/10 charges; Minelayer 25e/250 tether/300 flechette/25% Overdrive; Photon 2500 Blast/7m/50e; Bastille 10m/10%/s strip/1500 armor cap |
| B5 Chroma kit | 2026-07-21 | Spectral 400 DPS/3/s; Ward Heat +55%/100 DPS / Cold +145% armor; Vex Scorn 350%/Fury 275%/18m; Effigy 8k HP/2000 DPS/10/s; Helminth Ward |
| B5 Ember kit | 2026-07-21 | Fireball 800/300 area/3m; Immolation 40–85% DR (cap 90%); Fire Blast 200/25m/100% strip; Inferno 2500/350–700 DPS/15s/0+10e/enemy; Helminth Fire Blast 25m |
| B5 Citrine kit | 2026-07-21 | Fractured 500/14m/50%/20% orbs; Shell 40% DR (cap 90%, Affinity); Gem 1000/15m/30s; Crystallize 500 Impact/300% crit; Helminth→Fractured Blast 250/25%/10% (was wrongly Preserving Shell) |
| B5 Jade kit | 2026-07-21 | Judgment 500 Heat/tick/8% HPS/6m; Symphony +25% STR/+100% weapon/10% shield regen; Eyes 50/10% strip/s/20m; Glory 150/1500/35% DR (cap 50%) |
| B5 Styanax kit | 2026-07-21 | Axios 1250/1250/50m/15m; Tharros 1000/50% strip/100 heal; Rally 50 shields/kill/3 EPS/30m; Final Stand 1500×30 javelins×DUR |
| B5 Cyte-09 kit | 2026-07-21 | Seek 60m/75% WP/35s; Resupply +25%/+50% sniper/2–6 packs; Evade 75e/10s/cap 30/100 heal×STR (flat); Neutralize 1.25×/10m ricochet; Helminth→Evade cap 25 (was wrongly Resupply) |
| B5 Temple kit | 2026-07-21 | Pyrotechnics 1000 IPS/25m/20m/5 pillars; Overdrive 750 Heat/25% crit vuln/20m; Ripper's Wail 50e/+75% Heat (cap 750%)/30s; Exalted Solo 75e/1.25× Lizzie; Helminth Pyro 1000 |
| B5 Koumei kit | 2026-07-21 | Kumihimo 25×dice/30m/12s/15 threads; Omikuji rare 15%/CD cap 150; Omamori 75e/heal×1/50% block (no duration); Bunraku 500 Puncture/20s/30m; Helminth Omamori 75e/10–20 charms |
| B5 Oraxia kit | 2026-07-21 | Mercy's Kiss 4000 Toxin/40m/200% HP orb/50% energy/50% threshold; Embrace 250/50% vuln/10m/25s; Brood 750/25m/45s Scuttlers; Stride 2× HP/+40% Toxin/5eps; Helminth Embrace 6.67m |
| B5 Uriel kit | 2026-07-21 | Infernalis 1500 cast/250 DPS/2m/35s; Remedium 50e/50% heal; Demonium 75e/250/50% vuln/6m; Brimstone 75e/1500/15m/10s; Helminth Remedium 35% (no demons) |
| B5 Follie kit | 2026-07-21 | Forced Perspective 750/5m/3.5s invuln; Shadowgraph 250/4m/20s; Self Portrait 550/50% DR (cap 90%)/8→20m; Plein Air 250–25k/50% strip/18m; Helminth Portrait DR cap 75% |
| B5 Sirius & Orion kit | 2026-07-21 | Coronal 1500 Heat/5m; Gravitic 2000 Slash/50% strip/8m; Jade Stars 500/35s/7 motes; Astral Shell 35s/200 Blast decoy; Sanctuary 30s/25–55 HPS/45% DR (cap 75%); Event Horizon 750/8m→12m; Clash 10k Blast/26m; Helminth→Jade Stars 500/35s |
| B5 Nokko kit | 2026-07-21 | Stinkbrain 250 Viral/5m/25s/4 cap; Brightbonnet 15 energy×STR/+30% STR (cap 150%)/15m/25s; Reroot 50e/10s/10 HPS/80 pickup; Sporespring 75e/2500 Toxin/3m/10 bounces×1.5; Helminth Brightbonnet 10e/+20% STR (cap 100%) |
| B5 Voidrig kit | 2026-07-21 | Necraweb 2000 Blast/20m mire/25m explode/50% slow; Storm Shroud 50e/1200 HP/2× absorb/100% reflect; Gravemines 75e/200 Heat×24/8m; Guard Mode 50e/500/5eps (Arquebex) |
| B5 Bonewidow kit | 2026-07-21 | Meathook 20% HP/s/40% LS/50% throw; Shield Maiden 25e/2000 HP Misc/2× reflect×STR/2.5× armor Misc + Initial pool/Kiss 15e×EFF; Firing Line 50e/25m/5s Lifted/+50% vuln; Ironbride 50e/1500/2.5eps |
| B5 Helminth unique | 2026-07-21 | Infested Mobility +60% sprint/+30% parkour/8s; Energized Munitions 75% ammo/5s; Empower +50% next STR; Marked for Death 75% spread; Rebuild Shields 12s CD |
| Misc flat≠% root fix | 2026-07-21 | Bare numbers ≥1 no longer auto-% (was Shuriken 5%, AMD 25000%, angles…); true fraction keys + cooldown/angles/× growth; Plunder/Covenant caps 200% |
| Exalted/Inferno cast costs | 2026-07-21 | Artemis/Noctua/Neutralize energyPerShot (+ altFire) × EFF; Inferno energyPerEnemy × EFF; combo/kill windows + kavat lifespan as seconds |
| Fire Blast max-heat + Glory alt | 2026-07-21 | Ember Fire Blast maxHeatEnergyCost 25 × EFF (heat energy/strip later panel-lerped); Jade Glory altFireEnergy 25 × EFF |
| Virulence energy refund × EFF | 2026-07-21 | energyRefundPerHit follows cast_cost (¼ of ability cost); low EFF increases refund |
| Armor-pool invuln absorb | 2026-07-21 | Sim-gated Invuln Absorb (k): Iron Skin/Globe/Tectonics/Maiden +absorb; Halo absorb×2.5 inside STR |
| Storm Shroud + FB heat | 2026-07-21 | Shroud Initial=(base+absorb×mult)×STR; absorbMult×STR; Fire Blast Immolation Heat% lerps 75→25 × EFF |
| Ember heat lerps | 2026-07-21 | Inferno ring DPS×(1+heat)×STR; Immolation DR wiki blend (75%@130%→80%); Fire Blast strip 50–100%×STR cap |
| Fireball heat + Gauss battery | 2026-07-21 | Fireball ×(1+2×heat)×STR (×3 at max heat); Kinetic Plating DR at battery (wiki 80%→84%) |
| Gauss Redline + Sunder battery | 2026-07-21 | Redline FR/AS/reload/cast lerp min→max (÷5) × battery × DUR; Thermal Sunder Cold/Heat dmg + status dur × battery (not radius; Helminth fixed) |
| Genesis PT + projectileSpeed | 2026-07-21 | CalculatedStats punchThrough/projectileSpeed; Swift Deliverance/Frictionless; Fortress Salvo/Hunter's Mantra/Tenno/Inciting PT; Speeding Bullet (assume uptime) |
| Genesis followThrough panel | 2026-07-21 | Magistar Crushing Verdict +40% (channel); Nami Solo Lone Blade +60% (melee equipped) |
| Gauss passive battery shields | 2026-07-21 | Shield recharge +delay reduction × battery (wiki 80%→96%/64%; full 120%/80%); not × STR |
| Thermal Sunder Redline strip | 2026-07-21 | Blast armor strip 0% at ≤80% battery → 100% at full (Redline synergy; not × STR) |
| Mass Vitrify enemy absorb | 2026-07-21 | Segment += N×max((320+5×armor)×STR, enemyEHP÷10); wiki 4160+2496; Enemy HP+Shields (k) for max path |
| Thurible energy per kill | 2026-07-21 | EPK = 1+[channel×0.15÷(2−EFF)]×STR; HS ×4; wiki 25/130%/130% → ≈7.96 / ≈31.86 |
| Metamorphosis linear decay | 2026-07-21 | Peak×STR decays linearly to 0 over duration×DUR; wiki mid-duration half peak (250→162.5 @130% STR) |
| Covenant Retaliation CC | 2026-07-21 | CC=(5%+absorb÷100×1.5%)×STR; body cap 50% / HS ×4 cap 200%; wiki 3k→cap, 2k@130%→45.5%/182% |
| Baruuk Restraint passive DR | 2026-07-21 | DR = eroded×50% (full erosion → 50%); passive text 50%; not × STR |
| Virulence × Mutation stacks | 2026-07-21 | floor(base×STR×(1+stacks)); wiki 200×1.45×101=29290; Field DPS = half base × same |
| Valkyr Rage passive | 2026-07-21 | Melee dmg bonus = Rage% (cap 300%); death prevention ≥150%; passive text filled |
| Passive placeholder hygiene | 2026-07-22 | Filled wiki-known \|PLACEHOLDER\| passives (Ash→Zephyr batch); Ember Heat-enemy STR + Garuda kill-stack panel sims |
| Fireball combo×heat | 2026-07-22 | Chain 1/2/4/8 + 4×heat; dmg=(base÷2)×(combo+1)×STR; wiki 3600/5200 goldens + Prior Casts slider |
| Frost Fortifying Freeze | 2026-07-22 | +50 Armor × Cold enemies in Affinity Range (panel; after mods, not × STR) |
| Cyte-09 + Grendel passives | 2026-07-22 | Practiced Aim +1% WP CC/kill cap 300%; Grendel +250 Armor/gut enemy cap 5 (+1250) |
| Caliban + Protea passives | 2026-07-22 | Adaptive Armor +5%/hit cap 50% (panel DR/EHP); Protea 4th cast +100% STR at 3 power bars |
| Styanax + Yareli passives | 2026-07-22 | Hoplite +1% CC / 40 shields (×2 Speargun); Critical Flow +200% secondary CC while moving |
| Zephyr + Xaku passives | 2026-07-22 | Airborne +150% weapon CC; Xaku 25% dodge/AoE DR → 75% during Vast Untime |
| Volt + Trinity passives | 2026-07-22 | Static Discharge 10/m Electric cap 1000; Lifegiver allies +50% of max Energy as Health |
| Mesa + Qorvex passives | 2026-07-22 | Mesa dual FR +15% / single reload +25% / +50 HP no melee; Qorvex Core Exposure +3 PT |
| Excalibur + Saryn passives | 2026-07-22 | Swordsmanship +10% dmg/AS with swords; Saryn status duration ×1.25 (+25%) |
| Kullervo + Vauban passives | 2026-07-22 | Kullervo +75% HAE / +100% Heavy Wind Up; Vauban +25% mult dmg vs incapacitated |
| Ash + Hydroid passives | 2026-07-22 | Ash Slash status +25% dmg / +50% dur; Hydroid Corrosive 1st/full strip 50%/100% |
| Dante + Dagath passives | 2026-07-22 | Chronicler's Mark SC ×1.5 on scanned; Abundant Abyss 35% ×4 orb yield (E[×]=2.05) |
| Equinox + Revenant passives | 2026-07-22 | Equinox 10% orb cross-convert; Revenant shield-break 100 Impact / 7.5m (75% edge falloff) |
| Octavia + Nekros passives | 2026-07-22 | Inspiration 1 energy/s × 30s @ 15m; Nekros +5 Health per death within 10m |
| Nova + Ivara passives | 2026-07-22 | Nova 15% Health/Energy orb on slow/sped kills; Ivara 50m radar (+ extras) |
| Nezha + Mirage passives | 2026-07-22 | Nezha +60% slide speed / +35% distance; Mirage +85% slide dur / +50% maneuvers |
| Loki + Lavos passives | 2026-07-22 | Loki wall latch 60s (×10); Lavos Valence Block 10s status immunity / 5s orb CD |
| Khora + Oberon passives | 2026-07-22 | Venari +15% move speed / 45s respawn; Righteous Negation cap 3 (0.25s / 0.5s final invuln) |
| Jade + Temple passives | 2026-07-22 | Judgments +50% vuln / 10s + 2 Aura slots; Backbeat +50% Ability Efficiency on beat |
| Oraxia + Rhino passives | 2026-07-22 | Predator's Lurk 8s wall-latch invis; Rhino hard-landing 100 Impact / 6m (90% edge falloff) |
| Gara + Limbo passives | 2026-07-22 | Gara blind 15%+20%/miss / 10s / 12m; Limbo Rift +10 Energy/kill + 2 Energy/s |
| Mag + Koumei passives | 2026-07-22 | Mag 8m pickup vacuum; Koumei Fate random status 60s every 60s |
| Banshee + Atlas passives | 2026-07-22 | Banshee all weapons silent; Atlas knockdown immune while grounded |
| Nyx + Harrow passives | 2026-07-22 | Nyx +40% gun CC/Confused (cap +200%); Harrow overshield ×2 (2400) + start max Energy |
| Gyre + Citrine passives | 2026-07-22 | Gyre +10% ability CC/Electric (tiers/cap 300%); Citrine Geoluminesence 5→25 HP/s @ 50m |
| Chroma + Titania + Hildryn passives | 2026-07-22 | Chroma extra jump + element cycle; Titania +25% parkour / Upsurge 4HP/s 20s 15m; Hildryn 3.5s gate |
| Nidus + Sirius/Orion + Wisp passives | 2026-07-22 | Nidus Undying ≥15 stacks; Sirius/Orion +45% EFF ×2 casts; Wisp airborne invis |
| Follie + Sevagoth passives | 2026-07-22 | Follie Inkblot 50% slow 10s / 20% balloon×3 orbs; Sevagoth Tombstone 5 souls @ 14m |
| Inaros + Nokko + Wukong passives | 2026-07-22 | Inaros Sarcophagus + 20% Finisher heal; Nokko Vital Decay 15s; Wukong 3 of 5 techniques |
| Voruna + Uriel passives | 2026-07-22 | Voruna Dynar/Raksh/Lycath/Ulfrun hold-passives; Uriel Catenach/Gulphagor/Vythelas + 60s rez |
| Augur shields/cast panel | 2026-07-22 | Augur energy→shields sim: EFF-scaled cast cost × 40%/piece (not weapon DPS) |
| Hunter set vs Slash DPS | 2026-07-22 | Optional +25%/piece companion weapon DPS vs Slash (beast claws / sentinel); wiki Slash not generic status |
| Mecha mark + Empowered DPS | 2026-07-22 | Mark CD/dur/range by pieces (60→15s / 3→12s / 7.5→30m); optional Empowered ×2.5 vs marked |
| Genesis aim-feel panel | 2026-07-22 | Accuracy/recoil on CalculatedStats + Void's Guidance / Marksman's Hand / Kinetic Battle / Practiced Grip / Attuned Accuracy / Hunter's Mantra |
| Genesis holster / reload procs | 2026-07-22 | Holster reload %/s + instant reload on kill/HS panel (Autoloader / Awakened / Rogue / Exact Penance / Executioner's Fortune) |
| Genesis kill-PT + stacked aim-feel | 2026-07-22 | Kinetic Baffle; Slayer's Nerve 10×; Lex Talionis 4×; Ripper Rounds / Lethal Lance PT; Vicious Promise undamaged paper |
| Genesis zoom + mobility panel | 2026-07-22 | Marksman's Focus −30% zoom; Striking Swiftness / Drifting Grace / Evolved Ascension / Raging Drift slide |
| Genesis melee/ammo utility panel | 2026-07-22 | Finisher/slam/move; Standoff combo pause; Gunsmoke/Hunter/Galvanic ammo restore; HS charge; Silent Running; Rapid Conclusion 16× |
| Instant reload → sustained DPS | 2026-07-22 | Kill/HS instant-reload chance shortens E[reload] (one opportunity per mag); Exact Penance / Executioner's Fortune goldens |
| Genesis leftover utility panel | 2026-07-22 | Gathering Momentum 12×; Vault/Ternary; ammo-combo; Poison Parasite heal; Vulnerability Serum SC×1.35; Permanent Perforation |
| Ammo restore → sustained DPS | 2026-07-22 | Hunter/Gunsmoke/Galvanic E[extra ammo] extends mag (1 opportunity/mag); holster reload stays swap-only |
| Genesis combo/shard panel | 2026-07-22 | Hawk/Shockwave/Nimble/Echoes/Protracted combo; stun/KD radii; Void Splinters/Explosive Growth; Renewed Horror ×2 linger |
| B1 Neutral-only lock | 2026-07-22 | Stance DPS locked to wiki Neutral hit-avg scalars (81/81); full combo strings → C6; Atlantis ×0.7 shown in sim |
| Conjunction Voltage → DPS | 2026-07-22 | R5 @ 40 Electricity stacks: +120% multishot / +60% reload (weapon_dps; was arcane_panel) |
| Primary Crux SC → DPS | 2026-07-22 | statusChancePerHit maps to SC; R5 @ 10: +300% SC / +60% AE; Blight +72% MS / +144% CD; Flare +480% dmg |
| Merciless reload + Frostbite/Slip/Overcharge | 2026-07-22 | Merciless R5 reload flat +30% (not ×12); Frostbite +90% MS/+120% CD; Slip Shot +65% AE; Overcharge +350% MS |
| Deadhead/Dexterity passives | 2026-07-22 | Deadhead +30% HS mult into headshotDamageBonus (not × stacks); Dexterity combo +7.5s once; both +360% dmg at cap |
| Cascadia Accuracy + Exposure + Compression | 2026-07-22 | Accuracy +300% CC only with stacks+applyHeadshots; Exposure Corrosive capped 240%; Compression → panel (per-meter radius) |
| Enervate/Doughty/Retaliation/Plated/Outburst | 2026-07-22 | Enervate absolute +10% CC/hit; Doughty puncture-SC CM; Retaliation shield-steps; Plated 15√(5mag); Outburst CC+CD; pass raw sim stacks |
| Crescendo/Assimilation/Vendetta/Surge/Pistoleer | 2026-07-22 | Crescendo +6 IC/finisher; Assimilation +150% heavy; Vendetta +180% MS/+75% reload; Surge ×8; Pistoleer +102% AE |
| Acceleration/Tempo/Velocity/Strike/Charger/Careen | 2026-07-22 | Accel +90% FR (no shotgun); Tempo +90%; Velocity +120%; Strike +60% AS; Charger +300% dmg; Careen ×2.5 vs frozen |
| Avenger/Fury/Awakening/Rage/Precision/Blade/Arachne | 2026-07-22 | Avenger absolute +45% CC; Fury +180% melee; Awakening +150% sec; Rage +180% pri; Precision +300% sec; Blade +300% melee; Arachne +150% latch |
| Rise/Momentum/Longbow Sharpshot/Fractalized Reset | 2026-07-22 | Rise +150% pri; Momentum +150% sniper reload; Longbow ×4 next shot; Fractalized +240% reload |
| Theorem Demulcent + Secondary Shiver | 2026-07-22 | Demulcent +12%/stack cap 15 → +180%; Shiver +45%/Cold stack cap 10 → +450% |
| Bulwark/Fortifier/Empowered/Eternal amp | 2026-07-22 | Bulwark via warframeArmor; Fortifier ×8 vs OG; Empowered flat×SC×MS; Eradicate +60%; Onslaught +180% CC |
| Crepuscular/Melt/Logistics/Ghost + Bellicose | 2026-07-22 | Crepuscular +3 final CM/+30% STR; Melt +30% Heat×7; Logistics +72% AE; Ghost +60% SC; Bellicose → totals |
| Expertise/Battery/Impetus/Aggress/Force/Irradiate | 2026-07-22 | Expertise shields←STR; Battery energy←armor cap 1k; Impetus ×14 stacks; Aggress HB/hammer CD; Force/Irradiate 1-nearby splash |
| Virtuos Fury/Strike/Tempo/Shadow + Camisado/Pax/Influence | 2026-07-22 | Virtuos stacks>0 buffs; Strike/Shadow multiplicative; Camisado ×10; Pax +30% STR/EFF; Influence sum(elements) splash |
| Power Ramp/Ice Storm/Vigor/Overcharge/Haras/Osbok | 2026-07-22 | Ramp ×4→+36% STR; Ice ×20→+40% STR/DUR; Vigor +45%; Overcharge stacks>0; Haras AE; Osbok +3 flat CD |
| Blessing/Augmented/Concentration/Sculptor/armor procs | 2026-07-22 | Blessing +1200 HP; Augmented +60% STR; Conc +60% DUR; Sculptor lock 175% EFF; Ultimatum/Tanker/Guardian/Reaper flat armor |
| Intention/Agility/Consequence/Double Back/Grace/Duplicate/Fortification | 2026-07-22 | Intention ×4→+1000 HP; parkour +60%; Double Back ×3 DR; Grace 6% HP/s; Duplicate ×2; Fortification ×30 armor |
| Animosity/Afflictions/Compression/Contagion/Firewall/Overload | 2026-07-22 | Animosity heavy-only +42% CC×10; Afflictions ×2 DoT; Compression 0.8×radius aiming; Contagion 1× burst panel; Firewall Operator DR; Overload 80% enemy HP panel |
| Uskos/Asheir/Victory/Encumber/Infection/Exhilarate | 2026-07-22 | Uskos Heat cap 250% (stackCap 105); Asheir +300% SC; Victory 3% HP/s; Encumber +SC×0.24; Infection ×15→+360%; Exhilarate +3.6 energy/s |
| Expertise clamp + Virtuos convert + Magus Accelerant | 2026-07-22 | Expertise no negative shields; Forge/Spike/Surge/Trojan Void→elem at 96%; Accelerant Heat ×(1+0.65×stacks) |
| Aegis + Residuals + Magus Destruct | 2026-07-22 | Aegis +30% shield recharge; Residual zone DPS (DoT 40/s; Boils/Shock 1 hit/s paper); Destruct Puncture ×(1+0.65×stacks) |
| Exodia Triumph/Valor + Debilitate + Magus Husk/Vigor/Elevate | 2026-07-22 | Zaw combo chance panel; Debilitate expected component procs @≥10; Operator armor/HP/heal panels (Elevate 95%×300) |
| Exodia Hunt/Might/Epidemic + Obstruct + Nourish/Repair/Replenish | 2026-07-22 | Zaw slam pull / lifesteal / suspend panels; Obstruct jam 15m CD 60→10; Nourish +35 HP/s; Repair 25% HP/s @30m; Replenish 30% Operator heal |
| Magus Cadence/Cloud/Glitch/Lockdown/Revert + Emergence trio | 2026-07-22 | Operator sprint/sling/static/tether/revert panels; Dissipate mote energy 5–10; Savior Operator lethal; Renewed +300% energy regen panel |
| Eruption/Escapist/Steadfast/Truculence + Reconstruct + Anomaly/Drive + Vortex/Contagion/Sek-Eel | 2026-07-22 | Fixed scaling (Escapist invuln 2→12; Reconstruct 1→6; Truculence radius 5→30; Anomaly 5→30; Vortex chance 20→45); cleared last trackAllEffects stubs |
| Barrier/Trickery/Pulse + Molt Efficiency + Bodyguard | 2026-07-22 | Barrier chance 1–6% (was wrongly 100%); Trickery 15%×5–30s; Pulse wiki heal ranks + 60%/25m/15s; Efficiency +36% DUR at cap; Bodyguard 900 heal/6 kills |
| Pax Charge/Seeker/Soar + Phantasm + Healing/Ice/Nullifier/Resistance | 2026-07-22 | Charge passive +50% reload; Seeker 4 bolts; Soar glide 1.25–5s; Phantasm was dodge/heal→+60% speed; resists 102% (Healing panel-only Slash) |
| Residuals + Circumvent + Deflection/Warmth | 2026-07-22 | Residuals: killProcChance 20%, zoneDuration 3–12, radii, drop healthRegenChance/electricZoneDuration; Circumvent 25–50% +1000 armor/15s; Deflection/Warmth 102% |
| Pax Bolt + Secondary Cryogenic + Universal Fallout + Virtuos Null | 2026-07-22 | Bolt onHeadshot +4s window; Cryogenic 1–3 Cold / 10–15m; Fallout 6%/60% cap; Null +20% amp regen/4s |
| Arcane Energize + Conjunction Voltage duration | 2026-07-22 | Energize was healthRegenChance→energyPickupChance 60% + 150 Energy/15m/15s CD; Conjunction +12s stack window panel |
| Stacking arcane buffDuration windows | 2026-07-22 | Duration/cooldown/radius no longer × stacks (Hot Shot/Fortification/Exhilarate stay 10s); `stacking: true` still × stacks (Ice Storm) |
| Bellicose + Tempo/Velocity gates + Persistence | 2026-07-22 | Bellicose round(HP/250×%) cap 72%; Tempo shotgun-only / Velocity pistol-only FR; Persistence 500 DPS + armor≥700; Secondary Merciless/Deadhead goldens; drop Acceleration holsterDamage |
| Exodia Brave/Force/Contagion Zaw gates | 2026-07-22 | Brave 15 Energy/s / 4s @ 3 stacks; Force/Contagion Zaw-only (was applying on Skana); Secondary Dexterity golden |
| Galv Steel/Elementalist stacks + Munitions Grit | 2026-07-22 | Steel CD / Elementalist SC × kill stacks (cap 4); Melee Elementalist wind-up; Munitions Grit Y% + Vendetta +100% capacity-MS paper |
| Miter Plentiful + last-shot MS + Reaver Rapture | 2026-07-22 | flatMsPelletDamage +20 EV; Forceful/Fusillade lastShotBaseMultishot mag EV; Rapture 5×/+100% & 4×/+80% Serration-additive |
| Half-HP / Lone Gun / Cascade charge gate | 2026-07-22 | Feigned/Hitman/Swift halfHealthAdditiveDamage (ignore own flat); Impaler additiveBaseDamage; Vasto Lone Gun X+40/+14 mag; Cascade chargeStatChanges |
| Miter Sawblade Storm radial | 2026-07-22 | Evolution-gated 1400 Blast / 5m no falloff; excluded in Incarnon form; papers into radial DPS |
| Attrition / Gambit / Swift form / Seeing Red | 2026-07-22 | Laetum Overwhelming additiveBaseDamage 12; King's Gambit body CC×0; Kunai Swift form ×damage; Slash/Toxin/Cold/undamaged combo panels |
| Capacity-MS pellet % (Grit/Vendetta/Torid) | 2026-07-22 | capacityMsDamageMult EV (MS−1)/MS; Torid form capacityMsBonusMult ×1.6 on MS bonuses |
| Mecha spread + Thalys shards + melee form stacks | 2026-07-22 | Mecha mark-kill DoT DPS (sum×frac/CD); Thalys shardTrigger+Chain Shatter; form additiveBaseDamage; Swooping/Destreza sim stacks |
| Explosive Growth + Mecha claw elemental | 2026-07-22 | Thalys shardFullyGrownHosts ×2 erupt; claw mods via companionWeaponMods (Sepsis wiki 1075); C6 deferred |
| Exalted weapons accuracy | 2026-07-22 | STR×base before mods (Lizzie additive; Garuda ignore); P0–P2 wiki row fixes (Balefire/Arquebex/Shadow Clones/Artemis/Desert Wind/Talons/Exalted Blade/Regulators/Diwata/Iron Staff/Shattered Lash/Ironbride/Shadow Claws); `exalted-weapon-audit` goldens |
| Mecha cascade + Titania Diwata | 2026-07-23 | `mechaCascadeEnemies` sim hop; ability Damage dual-display tooltip; Titania Exalted Melee grid (Diwata) + save/loadout preview |
| Primary weapons base paper | 2026-07-23 | Wiki-lock 165 primaries (innate elements, IPS/CC/CM/reload/burst FR); defer Acceltra/Astilla/Kohm/Fulmin/Stradavar/launchers; `primary-weapon-audit` |
| Secondary weapons base paper | 2026-07-23 | Wiki-lock 137 secondaries (innate elements, Ballistica burst paper, Tysis/Pox direct-only, burst FR); defer Akarius/Angstrum/Sepulcrum/Sonicor/Staticor/Stug; `secondary-weapon-audit` |
| Melee weapons base paper | 2026-07-23 | Wiki-lock 220 melee (Sarofang Prime IPS, Silva & Aegis heat); defer Dark Split-Sword dual-form + Rabvee zaw stub; `melee-weapon-audit` |
| Arch weapons base paper | 2026-07-23 | Wiki-lock 27 archgun/archmelee Space paper (archmelee IPS, Fluctus IPS, Veritux crit, Velocitus FR); defer Arbucep; `arch-weapon-audit` |
| Sentinel weapons base paper | 2026-07-23 | Wiki-lock 10 sentinel guns (Artax/Sweeper/Vulklok/etc.); defer Deconstructor cycling; `sentinel-weapon-audit` |
| Modular parts base paper | 2026-07-23 | Wiki-lock kitgun Damage.Base + zaw strikes + amp prism Direct/Normal; Sporelacer CM3; Tombfinger grip deltas; Granmu Direct 1000; `modular-weapon-audit` |
| Radial direct-hit paper (B16) | 2026-07-23 | Split Acceltra/Astilla/Akarius/Angstrum/Sepulcrum/Sonicor/Staticor/Stug direct vs radial; drop Impact/Embed from radial table; legacy modular stubs documented |
| Launcher / rocket direct-hit (B17) | 2026-07-23 | Split Ogris/Kuva Ogris/Tonkor/Kuva Tonkor/Penta/Secura Penta/Tenet Envoy/Kuva Bramma/Shedu; `launcher-weapon-audit`; Bramma radial no longer folded |
| Dual-mode primary default fire (B18) | 2026-07-23 | Wiki-lock Fulmin auto / Stradavar / Hind / Panthera / Convectrix / Miter charged / bows / Vinquibus / Zarr cannon direct; 185 primary goldens |
| Remaining primary deferred + DSS (B19) | 2026-07-23 | Kohm/Kuva Kohm fully-spooled; Higasa auto; Nataruk charged; Synoid/Sirocco; Dark Split-Sword Dual Swords; 191 primary / 221 melee goldens |
| Arbucep / Deconstructor / Rabvee (B20) | 2026-07-23 | Arbucep 1st Attack + single radial; Deconstructor First Attack paper; Rabvee stub↔modular; Sepulcrum primary radial only |
| Arch Atmosphere / Gravimag (B21) | 2026-07-23 | Wiki-lock 19 atmosphereStats overlays (add Arbucep Atmosphere blast32/radial228); Corvas Prime no overlay; `ARCH_ATMOSPHERE_GOLDENS` |
| Alternate modes Staticor + DSS (B22) | 2026-07-23 | `alternateModeStats` + builder toggle; Staticor charged radial 106/9.6m; DSS Heavy Blade paper; Dual Swords slam radials 232/462 |
| Arbucep attack cycle (B23) | 2026-07-23 | Sim mode 1–6 elemental paper (Space 16/114, Atmosphere 32/228); `weapon-arbucep-mode` + builder dropdown |
| Staticor charged timing + ammo (B24) | 2026-07-23 | Charged overlay: CT 1s / Charge trigger / ammoCost 5; sustained + TTK + radial mag cycles |
| Stance combo directions (C6) | 2026-07-23 | Wiki Forward/Block/Forward Block hit-avgs for 78 stances; Neutral B1 lock intact; sim combo-string picker |
| Stance cycle DPS (C6b) | 2026-07-23 | Optional `stanceDpsModel=cycle` wiki Avg Dmg Multi/s (Σ/Duration); Iron Phoenix Neutral 5.2 vs hit-avg 2.3 |
| Mod paper verification (M0–M3) | 2026-07-23 | Inventory ~493 unlocked paper mods; +31 gun / +8 melee / +8 aura apply goldens; amp aura `damage`→weapon_dps; CP/SD no longer strip warframe armor/shield |
| Mod paper cores (M5) | 2026-07-23 | +41 FR/MS/IPS/CM/status/element cores; Killing Blow heavy damage panel-only |
| Mod paper cores (M6) | 2026-07-23 | +20 mag/reload/set-IPS/bane/smite/spoiled cores |
| Mod paper cores (M7) | 2026-07-23 | +21 mag/reload/magnetic cores; Maiming Strike panel fix |
| Mod paper cores (M8) | 2026-07-23 | +47 leftovers/Elementalist + arch cores; Elementalist damage→statusDamage |
| Mod paper cores (M9) | 2026-07-23 | +33 shotgun/utility cores; HAE+comboDuration apply; True Punishment panel |
| Mod paper cores (M10) | 2026-07-23 | +33 Archon/Augur/Necramech/Contempt; Archon Flow energy; Equilibrium/Necramech panel |

## New / extended test files

- `src/lib/calc/warframe-math-audit.test.ts` — Phase 1 bare-weapon block
- `src/lib/calc/gun-mod-audit.test.ts` — Phase 2a + M1 gun remainder
- `src/lib/calc/melee-mod-audit.test.ts` — Phase 2b + M2 melee remainder
- `src/lib/calc/arch-mod-audit.test.ts` — M8 archgun/archmelee apply goldens
- `src/lib/calc/necramech-mod-audit.test.ts` — M10 Necramech power/survivability goldens
- `src/lib/calc/aura-mod-audit.test.ts` — M3 DPS aura apply goldens
- `src/lib/calc/warframe-mod-audit.test.ts`
- `src/lib/calc/conditional-stack-audit.test.ts`
- `src/lib/calc/phase5-9-audit.test.ts`
- `src/lib/calc/set-bonus-audit.test.ts` — Augur/Hunter/Mecha + damageBuff gating
- `src/lib/calc/ttk-discrete.test.ts` — shield overflow case
- `src/lib/calc/exalted-weapon-audit.test.ts` — B9 inventory + STR + bare wiki goldens
- `src/lib/calc/primary-weapon-audit.test.ts` — B10 primary bare paper (+ `primary-bare-goldens.ts`)
- `src/lib/calc/secondary-weapon-audit.test.ts` — B11 secondary bare paper (+ `secondary-bare-goldens.ts`)
- `src/lib/calc/melee-weapon-audit.test.ts` — B12 melee bare paper (+ `melee-bare-goldens.ts`)
- `src/lib/calc/arch-weapon-audit.test.ts` — B13 Space + B21 Atmosphere Gravimag paper (+ `arch-bare-goldens.ts`, `arch-atmosphere-goldens.ts`)
- `src/lib/calc/sentinel-weapon-audit.test.ts` — B14 sentinel bare paper (+ `sentinel-bare-goldens.ts`)
- `src/lib/calc/modular-weapon-audit.test.ts` — B15 kitgun/zaw/amp modular part paper
- `src/lib/calc/launcher-weapon-audit.test.ts` — B17 category=launcher bare paper (+ `launcher-bare-goldens.ts`)
- `src/lib/calc/riven-calculator.test.ts` — R1 grader ranges / scoring / disposition
- `src/lib/calc/railjack-armament-inventory.test.ts` — RJ1 Cryophon/Glazio/Lavan/ordnance inventory
- `src/lib/calc/railjack-calculator.test.ts` — RJ2–RJ6 ship paper + Tunguska / Conic / traits goldens
