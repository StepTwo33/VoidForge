// Vendored from @wfcd/arsenal-parser 2.1.2 (MIT, Copyright (c) 2020 NicksWorld), dist/ArsenalParser.mjs.
// Only change: `find` comes from the cached index in ../wfcd-item-index instead of
// @wfcd/items/utilities, which rebuilt the whole item list on every lookup (R10-E).
/* eslint-disable @typescript-eslint/ban-ts-comment -- vendored file, kept verbatim apart from the documented change */
// @ts-nocheck
import { colors } from "@wfcd/items/utilities";
import { find } from "../wfcd-item-index";
import { translateFocus } from "warframe-worldstate-data/utilities";
//#region src/supporting/FindItem.ts
function findItem$1(uniqueName) {
	const item = find.findItem(uniqueName);
	if (item === void 0) return void 0;
	delete item.patchlogs;
	if ("components" in item) {
		delete item.components;
		delete item.buildPrice;
		delete item.skipBuildTimePrice;
		delete item.buildQuantity;
		delete item.consumeOnBuild;
		delete item.buildTime;
	}
	if ("damagePerShot" in item) delete item.damagePerShot;
	if ("conclave" in item) {
		delete item.conclave;
		delete item.introduced;
	}
	return item;
}
//#endregion
//#region src/Archwing.ts
const { loadMods: loadMods$6 } = find;
const { mapColors: mapColors$7 } = colors;
var WarframeArchwing = class {
	uniqueName;
	archwing;
	xp;
	polarized;
	upgrades;
	colors;
	constructor(archwing) {
		this.uniqueName = archwing.uniqueName;
		this.archwing = findItem$1(archwing.uniqueName);
		this.xp = archwing.xp;
		this.polarized = archwing.polarized;
		this.upgrades = loadMods$6(archwing.upgrades);
		this.colors = {
			primary: archwing.pricol ? mapColors$7(archwing.pricol) : void 0,
			attachments: archwing.attcol ? mapColors$7(archwing.attcol) : void 0
		};
	}
};
//#endregion
//#region src/Companion.ts
const { loadMods: loadMods$5 } = find;
const { mapColors: mapColors$6 } = colors;
var WarframeCompanion = class {
	uniqueName;
	name;
	companion;
	xp;
	polarized;
	cosmetics;
	colors;
	upgrades;
	type;
	constructor(companion) {
		this.uniqueName = companion.uniqueName;
		if (companion.itemName) this.name = companion.itemName;
		this.companion = findItem$1(companion.uniqueName);
		this.xp = companion.xp;
		this.polarized = companion.polarized;
		if (companion.skins) this.cosmetics = companion.skins.map((cosmetic) => findItem$1(cosmetic.uniqueName) || cosmetic);
		this.colors = {
			primary: companion.pricol ? mapColors$6(companion.pricol) : void 0,
			attachments: companion.attcol ? mapColors$6(companion.attcol) : void 0
		};
		this.upgrades = loadMods$5(companion.upgrades);
		this.type = companion.type;
		if (companion.itemName) this.name = companion.itemName;
	}
};
//#endregion
//#region src/Mech.ts
const { loadMods: loadMods$4 } = find;
const { mapColors: mapColors$5 } = colors;
var WarframeMech = class {
	uniqueName;
	mech;
	xp;
	polarized;
	cosmetics;
	colors;
	upgrades;
	features;
	constructor(mech) {
		this.uniqueName = mech.uniqueName;
		this.mech = findItem$1(mech.uniqueName);
		this.xp = mech.xp;
		this.polarized = mech.polarized;
		if (mech.skins) this.cosmetics = mech.skins.filter((cosmetic) => cosmetic).map((cosmetic) => findItem$1(cosmetic.uniqueName) || cosmetic);
		this.colors = {
			primary: mech.pricol ? mapColors$5(mech.pricol) : void 0,
			sigil: mech.sigcol ? mapColors$5(mech.sigcol) : void 0,
			attachments: mech.attcol ? mapColors$5(mech.attcol) : void 0
		};
		this.upgrades = loadMods$4(mech.upgrades);
		this.features = mech.features;
	}
};
//#endregion
//#region src/OperatorAmp.ts
const { mapColors: mapColors$4 } = colors;
var OperatorAmp = class {
	xp;
	polarized;
	amp;
	parts;
	colors;
	constructor(amp) {
		this.xp = amp.xp;
		this.polarized = amp.polarized;
		this.amp = findItem$1(amp.uniqueName) || amp;
		if (!amp.modularParts) return;
		this.parts = {
			prism: findItem$1(amp.modularParts.LWPT_AMP_OCULUS) || { uniqueName: amp.modularParts.LWPT_AMP_OCULUS },
			scaffold: findItem$1(amp.modularParts.LWPT_AMP_CORE) || { uniqueName: amp.modularParts.LWPT_AMP_CORE },
			brace: findItem$1(amp.modularParts.LWPT_AMP_BRACE) || { uniqueName: amp.modularParts.LWPT_AMP_BRACE }
		};
		this.colors = amp.pricol ? mapColors$4(amp.pricol) : void 0;
	}
};
//#endregion
//#region src/Parazon.ts
const { loadMods: loadMods$3 } = find;
const { mapColors: mapColors$3 } = colors;
var WarframeParazon = class {
	uniqueName;
	xp;
	polarized;
	upgrades;
	cosmetics;
	colors;
	constructor(parazon) {
		this.uniqueName = parazon.uniqueName;
		this.xp = parazon.xp;
		this.polarized = parazon.polarized;
		this.upgrades = loadMods$3(parazon.upgrades);
		if (parazon.skins) this.cosmetics = parazon.skins.map((cosmetic) => findItem$1(cosmetic.uniqueName) || cosmetic);
		this.colors = parazon.pricol ? mapColors$3(parazon.pricol) : void 0;
	}
};
//#endregion
//#region src/Player.ts
const { findItem } = find;
/** Warframe Player information */
var WarframePlayer = class {
	/**
	* Player name
	*/
	name;
	/**
	* Player mastery rank
	*/
	masteryRank;
	/**
	* Last updated date/time
	*/
	lastUpdated;
	/**
	* Glyph item
	*/
	glyph;
	/**
	* Currently selected focus school
	*/
	focusSchool;
	constructor(data) {
		this.name = data.playerName;
		this.masteryRank = data.masteryRank;
		this.lastUpdated = /* @__PURE__ */ new Date(data.lastUpdated * 1e3);
		this.glyph = findItem(data.glyph) || data.glyph;
		this.focusSchool = translateFocus(data.focus || "");
	}
};
//#endregion
//#region src/Weapon.ts
const { loadMods: loadMods$2 } = find;
const { mapColors: mapColors$2 } = colors;
var WarframeWeapon = class {
	xp;
	polarized;
	upgrades;
	name;
	cosmetics;
	parts;
	weapon;
	colors;
	constructor(weapon) {
		this.xp = weapon.xp;
		this.polarized = weapon.polarized;
		this.upgrades = loadMods$2(weapon.upgrades);
		if (weapon.itemName) this.name = weapon.itemName.includes("|") ? weapon.itemName.split("|").reverse()[0] : weapon.itemName;
		this.cosmetics = (weapon.skins || []).map((skin) => findItem$1(skin.uniqueName) || skin);
		if (weapon.modularParts) {
			const parts = {};
			Object.keys(weapon.modularParts).forEach((part) => {
				parts[part] = findItem$1(weapon.modularParts[part]) || { uniqueName: weapon.modularParts[part] };
			});
			this.parts = parts;
		} else {
			this.weapon = findItem$1(weapon.uniqueName) || { uniqueName: weapon.uniqueName };
			this.colors = { primary: weapon.pricol ? mapColors$2(weapon.pricol) : void 0 };
		}
	}
};
//#endregion
//#region src/Railjack.ts
const { mapColors: mapColors$1 } = colors;
const { loadMods: loadMods$1 } = find;
var Armaments = class {
	pilot;
	portGuns;
	ordinance;
	constructor(armaments) {
		const { PILOT, ORDINANCE, PORT_GUNS } = armaments.modularParts;
		this.pilot = findItem$1(PILOT.uniqueName) || PILOT;
		this.portGuns = findItem$1(PORT_GUNS.uniqueName) || PORT_GUNS;
		this.ordinance = findItem$1(ORDINANCE.uniqueName) || ORDINANCE;
	}
};
var CrewMember = class {
	uniqueName;
	xp;
	skills;
	isSecondInCommand;
	weapon;
	colors;
	/**
	* 1 - Defender
	* 2 - Pilot
	* 3 - Gunner
	* 4 - Engineer
	*/
	role;
	constructor(member) {
		this.uniqueName = member.uniqueName;
		this.xp = member.xp;
		this.role = member.role;
		this.skills = {
			piloting: member.skills.PILOTING.Assinged,
			gunnery: member.skills.GUNNERY.Assinged,
			repair: member.skills.ENGINEERING.Assinged,
			combat: member.skills.COMBAT.Assinged,
			endurance: member.skills.SURVIVABILITY.Assinged
		};
		this.isSecondInCommand = member.secondincommand;
		this.weapon = new WarframeWeapon(member.crewweapon);
		this.colors = {
			primary: member.pricol ? mapColors$1(member.pricol) : void 0,
			attachments: member.attcol ? mapColors$1(member.attcol) : void 0,
			syandana: member.eyecol ? mapColors$1(member.eyecol) : void 0,
			sigil: member.sigcol ? mapColors$1(member.sigcol) : void 0
		};
	}
};
var Railjack = class {
	uniqueName;
	name;
	loadout;
	upgrades;
	armaments;
	crewMembers;
	color;
	constructor({ railjack, armaments, crew }) {
		this.uniqueName = railjack.uniqueName;
		this.name = railjack.itemName;
		const { SHIELD, ENGINES, REACTOR, HULL } = railjack.modularParts;
		this.loadout = {
			shield: findItem$1(SHIELD.uniqueName) || SHIELD,
			engines: findItem$1(ENGINES.uniqueName) || ENGINES,
			reactor: findItem$1(REACTOR.uniqueName) || REACTOR,
			hull: findItem$1(HULL.uniqueName) || HULL
		};
		this.upgrades = loadMods$1(railjack.upgrades);
		this.armaments = new Armaments(armaments);
		this.crewMembers = [];
		Object.keys(crew.members).forEach((c) => {
			const member = new CrewMember(crew.members[c]);
			this.crewMembers.push(member);
		});
		this.color = { primary: railjack.pricol ? mapColors$1(railjack.pricol) : void 0 };
	}
};
//#endregion
//#region src/Warframe.ts
const { loadMods } = find;
const { mapColors } = colors;
var Warframe = class {
	uniqueName;
	warframe;
	xp;
	polarized;
	features;
	cosmetics;
	upgrades;
	colors;
	constructor(frame) {
		this.uniqueName = frame.uniqueName;
		this.warframe = findItem$1(frame.uniqueName);
		this.xp = frame.xp || 0;
		this.polarized = frame.polarized || 0;
		this.features = frame.features;
		this.cosmetics = (frame.skins || []).map((skin) => findItem$1(skin.uniqueName) || skin);
		this.upgrades = loadMods(frame.upgrades);
		this.colors = {
			primary: frame.pricol ? mapColors(frame.pricol) : void 0,
			attachments: frame.attcol ? mapColors(frame.attcol) : void 0,
			sigil: frame.sigcol ? mapColors(frame.sigcol) : void 0,
			syandana: frame.eyecol ? mapColors(frame.eyecol) : void 0
		};
	}
};
//#endregion
//#region src/ArsenalParser.ts
var ArsenalData = class {
	account;
	loadout;
	exalted;
	constructor(data) {
		this.account = new WarframePlayer(data.accountInfo);
		const { NORMAL, ARCHWING, DATAKNIFE, OPERATOR, SENTINEL, MECH, RAILJACK } = data.loadOuts;
		const { warframe, primary, secondary, melee, heavy, exalted } = NORMAL;
		const { archwing, primary: archPrimary, melee: archMelee } = ARCHWING;
		const { parazon } = DATAKNIFE;
		const { amp } = OPERATOR;
		const { companion, roboticweapon } = SENTINEL;
		this.loadout = { warframe: new Warframe(warframe) };
		if (primary && !primary.hide) this.loadout.primary = new WarframeWeapon(primary);
		if (secondary && !secondary.hide) this.loadout.secondary = new WarframeWeapon(secondary);
		if (melee && !melee.hide) this.loadout.melee = new WarframeWeapon(melee);
		if (heavy && !heavy.hide) this.loadout.heavy = new WarframeWeapon(heavy);
		if (exalted) if (typeof exalted.skins !== "undefined") this.exalted = new WarframeCompanion(exalted);
		else this.loadout.exalted = new WarframeWeapon(exalted);
		this.loadout.vechiles = {};
		if (archwing && !archwing.hide) this.loadout.vechiles.archwing = new WarframeArchwing(archwing);
		if (archPrimary && !archPrimary.hide) this.loadout.vechiles.primary = new WarframeWeapon(archPrimary);
		if (archMelee && !archMelee.hide) this.loadout.vechiles.melee = new WarframeWeapon(archMelee);
		if (parazon && !parazon.hide) this.loadout.parazon = new WarframeParazon(parazon);
		if (amp) this.loadout.amp = new OperatorAmp(amp);
		if (companion) this.loadout.companion = new WarframeCompanion(companion);
		if (roboticweapon) this.loadout.roboticweapon = new WarframeWeapon(roboticweapon);
		if (MECH) {
			const { mech, heavy: mechLong, exalted: mechExalted } = MECH;
			if (mech) this.loadout.vechiles.necramech = {
				mech: new WarframeMech(mech),
				heavy: new WarframeWeapon(mechLong),
				exalted: new WarframeWeapon(mechExalted)
			};
		}
		if (RAILJACK) this.loadout.railjack = new Railjack(RAILJACK);
	}
};
//#endregion
export { ArsenalData as default };
