ALTER TABLE tournament_participants
    ADD CONSTRAINT uq_tournament_user UNIQUE (tournament_id, user_id);
