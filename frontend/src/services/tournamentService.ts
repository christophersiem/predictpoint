import type {BackendTournament} from "../types/tournament.ts";


export async function fetchMyTournaments(): Promise<BackendTournament[]> {
    const res = await fetch('/api/tournaments/me', {
        method: 'GET',
        credentials: 'include',
    });
    if (!res.ok) {
        throw new Error(`Fehler ${res.status}`);
    }
    return res.json();
}
