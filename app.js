/**
 * UrbanServe Platform - Final Consolidated Logic
 * Designed for maximum stability and performance.
 */

const ALL_SERVICES = [
    // --- ELECTRICIAN ---
    { id: 1, name: "Basic Switch Fix", category: "electrician", rating: 4.5, reviews: 124, price: 199, image: "assets/electrician.png", quality: "Budget" },
    { id: 2, name: "Professional Full Rewiring", category: "electrician", rating: 4.8, reviews: 256, price: 2499, image: "assets/electrician.png", quality: "Standard" },
    { id: 3, name: "Smart Home Automation", category: "electrician", rating: 5.0, reviews: 45, price: 15000, image: "assets/electrician.png", quality: "Luxury" },
    
    // --- PLUMBER ---
    { id: 4, name: "Tap Leakage Repair", category: "plumber", rating: 4.6, reviews: 89, price: 249, image: "assets/plumber.png", quality: "Budget" },
    { id: 5, name: "Full Bathroom Installation", category: "plumber", rating: 4.9, reviews: 112, price: 8500, image: "assets/plumber.png", quality: "Standard" },
    
    // --- APPLIANCE REPAIR ---
    { id: 6, name: "AC Filter Cleaning", category: "appliance_repair", rating: 4.7, reviews: 305, price: 499, image: "assets/ac_repair.png?v=2", quality: "Budget" },
    { id: 7, name: "Comprehensive AC Service", category: "appliance_repair", rating: 4.9, reviews: 850, price: 1299, image: "assets/ac_repair.png?v=2", quality: "Standard" },
    { id: 8, name: "Washing Machine Motherboard Fix", category: "appliance_repair", rating: 4.5, reviews: 120, price: 3500, image: "assets/ac_repair.png?v=2", quality: "Standard" },
    
    // --- CLEANING & PEST ---
    { id: 9, name: "General Pest Control", category: "cleaning_pest", rating: 4.7, reviews: 412, price: 899, image: "assets/pest_control.png", quality: "Standard" },
    { id: 10, name: "Deep Home Cleaning (3BHK)", category: "cleaning_pest", rating: 4.9, reviews: 520, price: 5499, image: "assets/pest_control.png", quality: "Premium" },
    { id: 11, name: "Bathroom Deep Cleaning", category: "cleaning_pest", rating: 4.6, reviews: 230, price: 399, image: "assets/pest_control.png", quality: "Budget" },
    
    // --- SOFA & CARPET ---
    { id: 12, name: "3-Seater Sofa Cleaning", category: "sofa_cleaning", rating: 4.8, reviews: 145, price: 999, image: "https://images.unsplash.com/photo-1589365278144-c9e705f843ba?w=500&q=80", quality: "Standard" },
    { id: 13, name: "Luxury Carpet Shampooing", category: "sofa_cleaning", rating: 4.9, reviews: 85, price: 2499, image: "https://images.unsplash.com/photo-1589365278144-c9e705f843ba?w=500&q=80", quality: "Premium" },
    
    // --- COOK ---
    { id: 14, name: "Traditional Home Cook", category: "cook", rating: 4.7, reviews: 156, price: 8000, image: "assets/cook.png", quality: "Standard" },
    { id: 15, name: "Private Gourmet Chef", category: "cook", rating: 5.0, reviews: 42, price: 25000, image: "assets/cook.png", quality: "Luxury" },
    
    // --- MASSAGE ---
    { id: 16, name: "Stress Relief Massage", category: "massage", rating: 4.7, reviews: 120, price: 1499, image: "assets/massage.png", quality: "Standard" },
    { id: 17, name: "Deep Tissue Therapy", category: "massage", rating: 4.9, reviews: 85, price: 2499, image: "assets/massage.png", quality: "Premium" },
    { id: 18, name: "Luxury Ayurvedic Spa", category: "massage", rating: 5.0, reviews: 30, price: 4500, image: "assets/massage.png", quality: "Luxury" },
    
    // --- PAINTING ---
    { id: 19, name: "Fresh Wall Painting", category: "painting", rating: 4.6, reviews: 305, price: 5999, image: "assets/painter.png?v=4", quality: "Budget" },
    { id: 20, name: "Textured Accent Walls", category: "painting", rating: 4.9, reviews: 92, price: 12000, image: "assets/painter.png?v=4", quality: "Premium" },
    
    // --- SALON ---
    { id: 21, name: "Men's Basic Haircut", category: "hair_salon", rating: 4.5, reviews: 1500, price: 199, image: "assets/hair_salon.png", quality: "Budget" },
    { id: 22, name: "Luxury Bridal Makeup", category: "hair_salon", rating: 4.9, reviews: 210, price: 15000, image: "assets/hair_salon.png", quality: "Luxury" },
    { id: 23, name: "Professional Facial", category: "hair_salon", rating: 4.7, reviews: 450, price: 899, image: "assets/hair_salon.png", quality: "Standard" },
    
    // --- RO SERVICE ---
    { id: 24, name: "RO Water Filter Service", category: "ro_service", rating: 4.8, reviews: 320, price: 499, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80", quality: "Standard" },
    { id: 25, name: "RO Membrane Replacement", category: "ro_service", rating: 4.7, reviews: 180, price: 2499, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80", quality: "Premium" },
    
    // --- CARPENTER ---
    { id: 26, name: "Furniture Repair", category: "carpenter", rating: 4.6, reviews: 95, price: 399, image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=500&q=80", quality: "Standard" },
    { id: 27, name: "Custom Wardrobe Design", category: "carpenter", rating: 4.9, reviews: 54, price: 45000, image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=500&q=80", quality: "Luxury" },
    
    // --- YOGA ---
    { id: 28, name: "Personal Yoga Trainer", category: "yoga", rating: 5.0, reviews: 65, price: 1500, image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80", quality: "Standard" },
    
    // --- TUTOR ---
    { id: 29, name: "K-10 Home Tutor", category: "tutor", rating: 4.8, reviews: 88, price: 500, image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&q=80", quality: "Standard" },
    { id: 30, name: "IIT-JEE Entrance Expert", category: "tutor", rating: 5.0, reviews: 42, price: 2500, image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&q=80", quality: "Premium" },
    
    // --- VEHICLE CARE ---
    { id: 31, name: "Full Car Detailing", category: "vehicle_care", rating: 4.8, reviews: 156, price: 2999, image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=500&q=80", quality: "Standard" },
    { id: 32, name: "Luxury Ceramic Coating", category: "vehicle_care", rating: 5.0, reviews: 24, price: 15000, image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=500&q=80", quality: "Luxury" },
    
    // --- SECURITY ---
    { id: 33, name: "8-Camera CCTV Install", category: "security", rating: 4.9, reviews: 88, price: 12500, image: "https://images.unsplash.com/photo-1557597774-9d2739f85a76?w=500&q=80", quality: "Standard" },
    
    // --- CARETAKER ---
    { id: 34, name: "Elderly Care Assistant", category: "caretaker", rating: 4.9, reviews: 112, price: 18000, image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=500&q=80", quality: "Standard" }
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
                <div class="quality-badge ${s.quality.toLowerCase()}">${s.quality}</div>
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
    const closeBookingBtn = document.getElementById('close-booking-btn');
    if (closeBookingBtn) closeBookingBtn.onclick = () => ui.hide('booking-modal');
    
    const closeAuthBtn = document.getElementById('close-auth-btn');
    if (closeAuthBtn) closeAuthBtn.onclick = () => ui.hide('auth-modal');
    
    const searchCloseBtn = document.getElementById('search-close');
    if (searchCloseBtn) searchCloseBtn.onclick = () => ui.hide('search-overlay');

    const openAuthBtn = document.getElementById('open-auth-btn');
    if (openAuthBtn) openAuthBtn.onclick = () => ui.show('auth-modal');

    // Recommendation Logic
    const recommendBtn = document.getElementById('recommend-btn');
    if (recommendBtn) {
        recommendBtn.onclick = () => {
            const type = document.getElementById('event-type').value;
            const budget = document.getElementById('budget').value;

            let filtered = ALL_SERVICES;

            if (type) {
                filtered = filtered.filter(s => s.category === type);
            }

            if (budget) {
                filtered = filtered.filter(s => {
                    if (budget === 'budget') return s.price < 1000;
                    if (budget === 'standard') return s.price >= 1000 && s.price < 5000;
                    if (budget === 'mid') return s.price >= 5000 && s.price < 15000;
                    if (budget === 'premium') return s.price >= 15000 && s.price < 50000;
                    if (budget === 'luxury') return s.price >= 50000;
                    return true;
                });
            }

            renderServices(filtered);
            
            // Scroll to services section
            const servicesSection = document.getElementById('services');
            if (servicesSection) {
                servicesSection.scrollIntoView({ behavior: 'smooth' });
            }

            if (filtered.length === 0) {
                const container = document.getElementById('services-container');
                if (container) {
                    container.innerHTML = `
                        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem; background: var(--bg-secondary); border-radius: 1.5rem; border: 1px dashed var(--glass-border);">
                            <i data-lucide="search-x" style="width: 48px; height: 48px; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                            <h3 class="heading-3">No matching services found</h3>
                            <p style="color: var(--text-secondary);">Try adjusting your filters or browsing all services.</p>
                            <button class="btn-secondary" style="margin-top: 1.5rem;" onclick="renderServices()">View All Services</button>
                        </div>
                    `;
                    lucide.createIcons();
                }
            }
        };
    }

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
