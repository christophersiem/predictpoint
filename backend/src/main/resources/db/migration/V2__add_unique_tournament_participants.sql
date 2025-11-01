-- V2__add_unique_tournament_participants.sql

-- 1) sicherstellen, dass es die Tabelle gibt
CREATE TABLE IF NOT EXISTS tournament_participants (
    tournament_id varchar(255) NOT NULL,
    user_id       varchar(255) NOT NULL,
    CONSTRAINT fk_tp_tournament
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id)
    ON DELETE CASCADE,
    CONSTRAINT fk_tp_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    );

-- 2) unique nur anlegen, wenn nicht vorhanden
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'uq_tournament_user'
    ) THEN
ALTER TABLE tournament_participants
    ADD CONSTRAINT uq_tournament_user
        UNIQUE (tournament_id, user_id);
END IF;
END$$;
