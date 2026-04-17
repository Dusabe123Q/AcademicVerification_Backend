// C:\AcademicVerification_Backend\AcademicVerification_Backend\src\main\resources\static\js\auth.js

const AUTH_API = {
    login: async (email, password) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed. Please check your credentials.');
            }

            console.log('Login response:', data); // To debug structure

            // The backend returns a JWT token, let's assume it's data.token or similar
            const jwtToken = data.token || data.jwt || data.accessToken || data.jwtToken;
            
            // Assume role comes in the response, otherwise we might need to decode JWT or call profile API
            // For now, assume it's data.role
            const role = data.role || data.userRole || 'ALUMNI'; // default to alumni if not provided

            if (jwtToken) {
                localStorage.setItem('jwtToken', jwtToken);
                localStorage.setItem('userRole', role);
                localStorage.setItem('userEmail', email);

                return redirectByRole(role);
            } else {
                throw new Error('No token received from backend.');
            }
        } catch (error) {
            console.error('Login Error:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        window.location.href = '/login';
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('jwtToken');
    },

    checkAuth: (requiredRole = null) => {
        if (!AUTH_API.isAuthenticated()) {
            window.location.href = '/login';
            return false;
        }

        const role = localStorage.getItem('userRole');
        if (requiredRole && role !== requiredRole) {
            console.error('Unauthorized access to role page.', role, requiredRole);
            // Redirect to appropriate dashboard based on actual role
            redirectByRole(role);
            return false;
        }
        return true;
    }
};

function redirectByRole(role) {
    if (role === 'ADMIN' || role === 'ROLE_ADMIN') {
        window.location.href = '/admin/dashboard';
    } else if (role === 'ALUMNI' || role === 'ROLE_ALUMNI') {
        window.location.href = '/alumni/dashboard';
    } else if (role === 'EMPLOYER' || role === 'ROLE_EMPLOYER') {
        window.location.href = '/verify';
    } else {
        window.location.href = '/alumni/dashboard';
    }
}
