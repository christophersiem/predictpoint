ALTER TABLE bets
    DROP CONSTRAINT bets_status_check;

ALTER TABLE bets
    ADD CONSTRAINT bets_status_check
        CHECK (status IN ('OPEN', 'PENDING', 'RESOLVED'));
