export const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:3000/api';

export const login = async (email: string, password: string) => {
    try {
        // Try participant login first
        const participantRes = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (participantRes.ok) {
            const data = await participantRes.json();
            return { type: 'participant', data };
        }

        // Try admin login if participant fails
        const adminRes = await fetch(`${API_BASE_URL}/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (adminRes.ok) {
            const data = await adminRes.json();
            return { type: 'admin', data };
        }

        throw new Error('Invalid email or password');
    } catch (error: any) {
        throw new Error(error.message || 'Login failed');
    }
};
