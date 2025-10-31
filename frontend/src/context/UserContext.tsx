import {createContext, ReactNode, useContext, useEffect, useState} from "react";

type User = {
    id: string;
    name: string;
} | null;

type UserContextType = {
    user: User;
    setUser: (u: User) => void;
    loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await fetch('/api/user/me', {
                    credentials: 'include',
                });
                if (!res.ok) {
                    setUser(null);
                    return;
                }
                const data = await res.json();
                setUser({ id: data.id, name: data.name });
            } catch (e) {
                console.error(e);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMe();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) {
        throw new Error('useUser must be used within UserProvider');
    }
    return ctx;
}
