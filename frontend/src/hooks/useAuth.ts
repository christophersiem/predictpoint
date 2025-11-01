import { loginWithId, registerUser } from '../services/authService';
import {useUser} from "../context/UserContext.tsx";

export function useAuth() {
    const { setUser } = useUser();

    const login = async (id: string) => {
        const data = await loginWithId(id);
        setUser({ id: data.id, name: data.name });
        return data;
    };

    const register = async (name: string) => {
        const newId = await registerUser(name);
        return newId;
    };

    return { login, register };
}
