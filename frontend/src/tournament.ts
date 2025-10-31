type BackendBet = {
    id: string;
    question: string;
    options?: string[];
    openUntil?: string;
    resolved: boolean;
    status: string;
    correctOptionIndex?: number;
    myTip?: {
        tipId: string;
        betId: string;
        selectedOptionIndex: number | null;
        selectedAnswer: string | null;
        points: number;
        correct: boolean | null;
    };
};


export type BackendTournament = {
    id: string;
    adminName: string;
    name: string;
    inviteCode: string;
    start: string;
    durationDays: number;
    activeBets: BackendBet[];
    pastBets: BackendBet[];
    resolvedBets: BackendBet[];
    participantNames: string[];
};

export type UiOpenBet = {
    id: string;
    title: string;
    meta: string;
    options?: string[];

};

export type UiEvaluatedBet = {
    id: string;
    title: string;
    meta: string;
    result: 'win' | 'loss' | 'pending';
    resultText: string;
};

export type UiLeaderboardEntry = {
    name: string;
    score: string;
};

export type UiTournament = {
    id: string;
    name: string;
    openBets: {
        id: string;
        title: string;
        meta: string;
        options?: string[];
    }
}
