import './App.css'
import {useState} from "react";

function App() {

    const [id, setId] = useState('')
    const [bet, setBet] = useState<BetResponse | null>(null)

    interface BetResponse {
        id: string;
        status: string;
        question: string;
        options: string[];
        correctOptionIndex: number;
        resolved: boolean;
        openUntil: string;
        youtubeUrl: string | null;
    }

    const handleSubmit = async () => {
        try {
            const response = await fetch(`/api/bets/${id}`)
            if (!response.ok) throw new Error('Fehler beim Abrufen')
            const data: BetResponse = await response.json();
            setBet(data)
        } catch (error) {
            console.error(error);

            setBet(null)
        }
    }

    return (
        <>
            <div>
                <p>This is predictpoint</p>
                <input
                    type="text"
                    onChange={(e) => setId(e.target.value)}
                    value={id}
                />
                <button onClick={handleSubmit}>Bet abrufen</button>
                <p>ID: {id}</p>
                {bet && (
                    <div>
                        <p>Question: {bet.question}</p>
                        <p>Status: {bet.status}</p>
                        <ul>
                            {bet.options.map((option, index) => (
                                <li key={index}>{option}</li>
                            ))}
                        </ul>
                        <p>Correct Index: {bet.correctOptionIndex}</p>
                        <p>Resolved: {bet.resolved ? 'Ja' : 'Nein'}</p>
                        <p>Open Until: {bet.openUntil}</p>
                        {bet.youtubeUrl && <p>YouTube: {bet.youtubeUrl}</p>}
                    </div>
                )}
            </div>
        </>
    );
}

export default App
