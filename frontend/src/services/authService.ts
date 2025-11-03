export type LoginResponse = {
    id: string;
    name: string;
};

export async function  handleLogout(){

        await fetch('/api/user/logout', { method: 'POST', credentials: 'include' });
};

export async function loginWithId(id: string): Promise<LoginResponse> {
    const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
        credentials: 'include',
    });
    if (!res.ok) {
        throw new Error('Login fehlgeschlagen');
    }
    return res.json();
}

export async function registerUser(name: string): Promise<string> {
    const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    });
    if (!res.ok) {
        throw new Error('Registrierung fehlgeschlagen');
    }
    return res.text();
}
