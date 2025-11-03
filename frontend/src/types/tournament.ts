export type BackendTip = {
    tipId: string;
    betId: string;
    selectedOptionIndex: number | null;
    selectedAnswer: string | null;
    points: number;
    correct: boolean | null;
};

export type BackendBet = {
    id: string;
    question: string;
    options?: string[];
    resolved: boolean;
    correctOptionIndex: number;
    openUntil?: string | null;
    status: string;
    myTip?: BackendTip | null;
};

export type BackendTournament = {
    id: string;
    adminId?: string;
    adminName: string;
    name: string;
    inviteCode: string;
    start: string;
    durationDays: number;
    participantNames: string[];
    activeBets: BackendBet[];
    pastBets: BackendBet[];
    resolvedBets: BackendBet[];
};

export type UiOpenBet = {
    id: string;
    title: string;
    meta: string;
    options: string[];
    myTip: {
        selectedOptionIndex: number | null;
    } | null;
};

export type UiEvaluatedBet = {
    id: string;
    title: string;
    meta: string;
    result: 'win' | 'loss' | 'pending';
    resultText: string;
    options?: string[];
    correctOptionIndex?: number | null;
    myTip?: { selectedOptionIndex: number | null } | null;
};

export type UiTournament = {
    id: string;
    name: string;
    adminId?: string;
    openBets: UiOpenBet[];
    evaluated: UiEvaluatedBet[];
    leaderboard: {
        name: string;
        score: string;
    }[];
};
