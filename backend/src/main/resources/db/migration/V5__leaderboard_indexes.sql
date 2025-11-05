create index if not exists idx_tips_bet on tips(bet_id);
create index if not exists idx_tips_user on tips(user_id);
create index if not exists idx_bets_tournament_resolved on bets(tournament_id, resolved);