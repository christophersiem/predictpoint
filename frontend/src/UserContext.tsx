import {createContext, ReactNode, useContext, useState} from "react";

type User = {
    id: string;
    name: string;
} | null;

type UserContextType = {
    user: User;
    setUser: (u: User) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(null);
    return (
        <UserContext.Provider value={{ user, setUser }}>
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