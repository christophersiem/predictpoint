import type {LeaderboardEntry} from "../types/tournament.ts";


export async function fetchLeaderboard(
    tournamentId: string,
    signal?: AbortSignal
): Promise<LeaderboardEntry[]> {
    const res = await fetch(`/api/tournaments/${tournamentId}/leaderboard`, {signal});
    if (!res.ok) throw new Error(`Failed to load leaderboard (${res.status})`);
    return res.json();
}