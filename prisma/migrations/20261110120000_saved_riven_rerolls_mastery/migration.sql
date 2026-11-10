-- Saved rivens keep the player's reroll count and mastery rank requirement.
-- Nullable: rows saved before this migration read as "unknown" so clients keep their local values.
ALTER TABLE "SavedRiven" ADD COLUMN "rerolls" INTEGER;
ALTER TABLE "SavedRiven" ADD COLUMN "masteryRank" INTEGER;
