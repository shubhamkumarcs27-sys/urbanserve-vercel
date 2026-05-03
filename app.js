/**
 * UrbanServe Platform - Final Consolidated Logic
 * Designed for maximum stability and performance.
 */

const ALL_SERVICES = [
    { id: 1, name: "Elite Electricians", category: "electrician", rating: 4.8, reviews: 124, price: 500, image: "assets/electrician.png" },
    { id: 2, name: "Premium Plumbing", category: "plumber", rating: 4.9, reviews: 89, price: 800, image: "assets/plumber.png" },
    { id: 3, name: "Expert AC Repair", category: "appliance_repair", rating: 4.7, reviews: 156, price: 1500, image: "assets/ac_repair.png?v=2" },
    { id: 4, name: "Pest Control Experts", category: "cleaning_pest", rating: 4.9, reviews: 305, price: 1200, image: "assets/pest_control.png" },
    { id: 5, name: "Safe Drive Professionals", category: "driver", rating: 4.8, reviews: 210, price: 800, image: "assets/driver.png" },
    { id: 6, name: "Gourmet Home Cooks", category: "cook", rating: 5.0, reviews: 92, price: 15000, image: "assets/cook.png" },
    { id: 7, name: "Care & Trust Babysitting", category: "babysitter", rating: 4.9, reviews: 145, price: 1000, image: "assets/babysitter.png" },
    { id: 8, name: "Relaxing Spa Massage", category: "massage", rating: 4.8, reviews: 320, price: 2000, image: "assets/massage.png" },
    { id: 9, name: "Painters", category: "painting", rating: 4.7, reviews: 85, price: 8000, image: "assets/painter.png?v=4" },
    { id: 10, name: "Premium Hair Salon", category: "hair_salon", rating: 4.9, reviews: 412, price: 850, image: "assets/hair_salon.png" }
];

// App State
let AppState = {
    user: JSON.parse(localStorage.getItem('urbanNeedsUser')),
    theme: localStorage.getItem('theme') || 'light',
    activeBooking: null
};

// UI Helpers
const ui = {
    modal: (id) => document.getElementById(id),
    show: (id) => document.getElementById(id).classList.remove('hidden'),
    hide: (id) => document.getElementById(id).classList.add('hidden'),
    updateText: (id, text) => { const el = document.getElementById(id); if (el) el.innerText = text; }
};

function saveUser(user) {
    AppState.user = user;
    localStorage.setItem('urbanNeedsUser', JSON.stringify(user));
    renderNav();
}

// --- RENDERING ---
function renderNav() {
    const actions = document.getElementById('nav-actions');
    if (!actions) return;

    let html = `
        <button class="icon-btn" onclick="toggleTheme()"><i data-lucide="${AppState.theme === 'dark' ? 'sun' : 'moon'}"></i></button>
        <button class="icon-btn" onclick="ui.show('search-overlay')"><i data-lucide="search"></i></button>
    `;

    if (AppState.user) {
        html += `
            <a href="dashboard.html" class="btn-primary" style="text-decoration:none;"><i data-lucide="user"></i> ${AppState.user.name.split(' ')[0]}</a>
            <button class="icon-btn" style="color:#ef4444;" onclick="logout()"><i data-lucide="log-out"></i></button>
        `;
    } else {
        html += `<button class="btn-primary" onclick="ui.show('auth-modal')"><i data-lucide="user"></i> Sign In</button>`;
    }

    actions.innerHTML = html;
    lucide.createIcons();
}

function renderServices(list = ALL_SERVICES) {
    const container = document.getElementById('services-container');
    if (!container) return;

    container.innerHTML = list.map(s => `
        <div class="service-card">
            <div class="card-image">
                <img src="${s.image}" alt="${s.name}">
            </div>
            <div class="card-content">
                <div class="flex-between">
                    <span class="category-tag">${s.category.replace('_', ' ')}</span>
                    <div class="rating">★ ${s.rating}</div>
                </div>
                <h3 class="card-title">${s.name}</h3>
                <div class="card-footer">
                    <div class="card-price">Starting at<br><span>₹${s.price}</span></div>
                    <button class="book-btn">Book Now</button>
                </div>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
    attachBookButtons();
}

// --- ACTIONS ---
function toggleTheme() {
    AppState.theme = AppState.theme === 'light' ? 'dark' : 'light';
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', AppState.theme);
    renderNav();
}

function transitionTo(url) {
    const overlay = document.getElementById('page-transition');
    if (overlay) {
        overlay.classList.add('active');
        setTimeout(() => window.location.href = url, 500);
    } else {
        window.location.href = url;
    }
}

function logout() {
    localStorage.removeItem('urbanNeedsUser');
    transitionTo('index.html');
}

function attachBookButtons() {
    document.querySelectorAll('.book-btn').forEach((btn, idx) => {
        btn.onclick = () => {
            AppState.activeBooking = ALL_SERVICES[idx];
            openBooking(AppState.activeBooking.id);
        };
    });
}

function openBooking(sid) {
    AppState.activeBooking = ALL_SERVICES.find(s => s.id === sid);
    ui.updateText('booking-title', `Book ${AppState.activeBooking.name}`);
    ui.updateText('summary-price', `₹${AppState.activeBooking.price}`);
    ui.updateText('summary-total', `₹${AppState.activeBooking.price + 49}`);

    // Pre-fill user data if logged in
    if (AppState.user) {
        const nameInput = document.getElementById('booking-name');
        const phoneInput = document.getElementById('booking-phone');
        if (nameInput) nameInput.value = AppState.user.name;
        if (phoneInput) phoneInput.value = AppState.user.phone;
    }

    document.querySelectorAll('.booking-step').forEach(s => s.classList.add('hidden'));
    ui.show('step-1');
    ui.show('booking-modal');
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    if (AppState.theme === 'dark') document.body.classList.add('dark-mode');
    renderNav();
    renderServices();

    // Time Slots
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.onclick = () => {
            document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
        };
    });

    // Booking Flow
    document.getElementById('confirm-time-btn').onclick = () => {
        if (!document.getElementById('booking-date').value || !document.querySelector('.time-slot.selected')) return alert("Select date & time");
        ui.hide('step-1'); ui.show('step-2');
    };

    document.getElementById('confirm-details-btn').onclick = () => {
        if (!document.getElementById('booking-name').value || !document.getElementById('booking-phone').value) return alert("Enter details");
        ui.hide('step-2'); ui.show('step-3');
    };

    document.getElementById('final-book-btn').onclick = () => {
        ui.hide('step-3'); ui.show('step-4');
        setTimeout(() => ui.hide('booking-modal'), 3000);
    };

    // Auth Tab Switching
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.onclick = () => {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.target).classList.add('active');
        };
    });

    // Auth Forms
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            const res = await fetch('/api/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    emailOrPhone: document.getElementById('login-email').value,
                    password: document.getElementById('login-password').value
                })
            });
            const data = await res.json();
            if (res.ok) { saveUser(data.user); transitionTo('index.html'); }
            else alert(data.error);
        };
    }

    const regForm = document.getElementById('register-form');
    if (regForm) {
        regForm.onsubmit = async (e) => {
            e.preventDefault();
            const res = await fetch('/api/register/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: document.getElementById('reg-name').value,
                    email: document.getElementById('reg-email').value,
                    phone: document.getElementById('reg-phone').value,
                    password: document.getElementById('reg-password').value
                })
            });
            const data = await res.json();
            if (res.ok) { saveUser(data.user); transitionTo('index.html'); }
            else alert(data.error);
        };
    }

    // Close Modals
    document.getElementById('close-booking-btn').onclick = () => ui.hide('booking-modal');
    document.getElementById('close-auth-btn').onclick = () => ui.hide('auth-modal');
    document.getElementById('search-close').onclick = () => ui.hide('search-overlay');

    // Loading & Welcome Logic
    setTimeout(() => {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.classList.add('fade-out');

        // Trigger reveal animations
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));

        if (AppState.user) {
            showWelcome(AppState.user.name);
        }
    }, 1500);
});

function showWelcome(name) {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'welcome-toast';
    toast.innerHTML = `
        <i data-lucide="sparkles"></i>
        <div>
            <div style="font-weight: 700; font-size: 1.1rem;">Welcome back, ${name.split(' ')[0]}!</div>
            <div style="font-size: 0.9rem; color: var(--text-secondary);">Ready for your next service?</div>
        </div>
    `;
    container.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 5000);
}
