ALTER TABLE bet_options ADD COLUMN option_pos INT;

-- vorhandene Reihen in Einfüge-Reihenfolge 0,1,2,... nummerieren
WITH numbered AS (
    SELECT ctid, ROW_NUMBER() OVER (PARTITION BY bet_id ORDER BY ctid) - 1 AS pos
    FROM bet_options
)
UPDATE bet_options bo
SET option_pos = n.pos
FROM numbered n
WHERE bo.ctid = n.ctid;

ALTER TABLE bet_options ALTER COLUMN option_pos SET NOT NULL;

-- optional, für Konsistenz/Schnelle Abfragen:
CREATE UNIQUE INDEX IF NOT EXISTS uq_bet_options_bet_pos
    ON bet_options(bet_id, option_pos);