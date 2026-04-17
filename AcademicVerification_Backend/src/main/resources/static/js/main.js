// C:\AcademicVerification_Backend\AcademicVerification_Backend\src\main\resources\static\js\main.js

document.addEventListener('DOMContentLoaded', () => {

    // Sidebar Toggle Logic
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });
    }

    // Global Logout Handler
    const logoutBtns = document.querySelectorAll('.logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    });

    // Populate user info if exists
    const userDisplay = document.getElementById('user-display');
    if (userDisplay) {
        const email = localStorage.getItem('userEmail');
        if (email) {
            userDisplay.textContent = email;
        }
    }

    // Set active link in sidebar
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.sidebar-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

});

// Define global logout simply referencing AUTH_API
window.logout = function() {
    if (typeof AUTH_API !== 'undefined') {
        AUTH_API.logout();
    } else {
        localStorage.clear();
        window.location.href = '/login';
    }
};

// Formatting helpers
function formatDate(dateString) {
    if (!dateString) return '-';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
