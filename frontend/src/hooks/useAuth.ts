import {handleLogout, loginWithId, registerUser} from '../services/authService';
import {useUser} from "../context/UserContext.tsx";
import {useNavigate} from "react-router-dom";

export function useAuth() {
    const {setUser} = useUser();
    const navigate = useNavigate();
    const login = async (id: string) => {
        const data = await loginWithId(id);
        setUser({id: data.id, name: data.name});
        return data;
    };

    const register = async (name: string) => {
        const newId = await registerUser(name);
        return newId;
    };

    const logout = async () => {
        await handleLogout()
        setUser(null)
navigate('/')
    }

    return {login, logout, register};
}
