ALTER TABLE tips
ADD CONSTRAINT uq_tip_user_bet UNIQUE (user_id, bet_id);
