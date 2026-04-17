// C:\AcademicVerification_Backend\AcademicVerification_Backend\src\main\resources\static\js\api.js

const API_BASE_URL = '/api';

/**
 * Global fetch wrapper to handle JWT attachment and common error scenarios.
 */
async function fetchApi(endpoint, options = {}) {
    showLoader();
    
    // Default headers
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    // Attach JWT token if it exists
    const token = localStorage.getItem('jwtToken');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        // Handle 401 Unauthorized globally
        if (response.status === 401) {
            console.error('Unauthorized access. Redirecting to login.');
            logout();
            throw new Error('Session expired. Please login again.');
        }
        
        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            data = await response.json();
        } else {
            data = await response.text();
            // If it's returning empty text but status is OK, data is just empty string
        }

        if (!response.ok) {
            let errorMsg = `HTTP Error ${response.status}`;
            if (data) {
                if (typeof data === 'string') {
                    errorMsg = data;
                } else if (data.message) {
                    errorMsg = data.message;
                } else if (data.error) {
                    errorMsg = data.error;
                } else {
                    errorMsg = JSON.stringify(data);
                }
            }
            throw new Error(errorMsg);
        }

        return data;
    } catch (error) {
        throw error;
    } finally {
        hideLoader();
    }
}

// Global loader functions
function showLoader() {
    const loader = document.getElementById('global-loader');
    if (loader) loader.classList.add('show');
}

function hideLoader() {
    const loader = document.getElementById('global-loader');
    if (loader) loader.classList.remove('show');
}

// Global Alert display
function showAlert(message, type = 'danger') {
    const alertContainer = document.getElementById('alert-container');
    if (!alertContainer) return;

    const alertEl = document.createElement('div');
    alertEl.className = `alert alert-${type} alert-dismissible fade show shadow-sm`;
    alertEl.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertContainer.appendChild(alertEl);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
        if (alertEl && alertContainer.contains(alertEl)) {
            const bsAlert = new bootstrap.Alert(alertEl);
            bsAlert.close();
        }
    }, 5000);
}
