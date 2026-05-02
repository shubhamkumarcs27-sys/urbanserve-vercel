// Initialize Icons
lucide.createIcons();

// --- THEME TOGGLE LOGIC ---
const themeToggle = document.getElementById('theme-toggle');
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeToggle) themeToggle.innerHTML = '<i data-lucide="sun"></i>';
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggle.innerHTML = isDark ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
        lucide.createIcons();
    });
}

// --- MOCK DATA ---
const services = [
    { id: 1, name: "Elite Electricians", category: "electrician", rating: 4.8, reviews: 124, price: 500, image: "assets/electrician.png", coords: [28.6139, 77.2090], location: "Connaught Place, Delhi" },
    { id: 2, name: "Premium Plumbing", category: "plumber", rating: 4.9, reviews: 89, price: 800, image: "assets/plumber.png", coords: [28.5355, 77.2410], location: "Greater Kailash, Delhi" },
    { id: 3, name: "Expert AC Repair", category: "appliance_repair", rating: 4.7, reviews: 156, price: 1500, image: "assets/ac_repair.png?v=2", coords: [12.9716, 77.5946], location: "Indiranagar, Bangalore" },
    { id: 4, name: "Pest Control Experts", category: "cleaning_pest", rating: 4.9, reviews: 305, price: 1200, image: "assets/pest_control.png", coords: [28.4595, 77.0266], location: "Cyber City, Gurgaon" },
    { id: 5, name: "Safe Drive Professionals", category: "driver", rating: 4.8, reviews: 210, price: 800, image: "assets/driver.png", coords: [19.0760, 72.8777], location: "Bandra, Mumbai" },
    { id: 6, name: "Gourmet Home Cooks", category: "cook", rating: 5.0, reviews: 92, price: 15000, image: "assets/cook.png", coords: [17.3850, 78.4867], location: "Banjara Hills, Hyderabad" },
    { id: 7, name: "Care & Trust Babysitting", category: "babysitter", rating: 4.9, reviews: 145, price: 1000, image: "assets/babysitter.png", coords: [12.9716, 77.5946], location: "Koramangala, Bangalore" },
    { id: 8, name: "Relaxing Spa Massage", category: "massage", rating: 4.8, reviews: 320, price: 2000, image: "assets/massage.png", coords: [28.6139, 77.2090], location: "South Extension, Delhi" },
    { id: 9, name: "Painters", category: "painting", rating: 4.7, reviews: 85, price: 8000, image: "assets/painter.png?v=4", coords: [19.0760, 72.8777], location: "Andheri, Mumbai" },
    { id: 10, name: "Premium Hair Salon", category: "hair_salon", rating: 4.9, reviews: 412, price: 850, image: "assets/hair_salon.png", coords: [12.9352, 77.6245], location: "Koramangala, Bangalore" }
];

// --- MAP INTEGRATION (LEAFLET) ---
let map;
let markerGroup;

function initMap() {
    map = L.map('map').setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    markerGroup = L.featureGroup().addTo(map);
    updateMapMarkers(services);
}

function updateMapMarkers(filteredServices) {
    if (!markerGroup) return;
    markerGroup.clearLayers();
    if (filteredServices.length === 0) return;

    filteredServices.forEach(service => {
        const marker = L.marker(service.coords);
        marker.bindPopup(`
            <div style="padding: 5px;">
                <h4 style="margin: 0 0 5px 0; font-family: 'Inter', sans-serif;">${service.name}</h4>
                <p style="margin: 0; color: #666;">₹${service.price} &bull; <i style="color: #ec4899;">★</i> ${service.rating}</p>
            </div>
        `);
        markerGroup.addLayer(marker);
    });

    try {
        map.fitBounds(markerGroup.getBounds(), { padding: [50, 50], maxZoom: 12 });
    } catch(e) {}
}

// Delay map initialization slightly to ensure container is ready
setTimeout(initMap, 200);

// --- RENDER SERVICES ---
function renderServices(filteredServices) {
    const container = document.getElementById('services-container');
    container.innerHTML = '';
    
    if (filteredServices.length === 0) {
        container.innerHTML = '<p class="text-secondary" style="grid-column: 1/-1; text-align: center;">No services found matching your criteria.</p>';
        updateMapMarkers([]);
        return;
    }

    filteredServices.forEach((service) => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `
            <div class="card-image">
                <img src="${service.image}" alt="${service.name}" loading="lazy">
            </div>
            <div class="card-content">
                <h3 class="card-title">${service.name}</h3>
                <div class="card-rating">
                    <i data-lucide="star"></i>
                    <span>${service.rating}</span>
                    <span class="text-secondary">(${service.reviews} reviews)</span>
                </div>
                <div class="card-location">
                    <i data-lucide="map-pin" style="width: 16px;"></i>
                    <span>${service.location}</span>
                </div>
                <div class="card-footer">
                    <div class="card-price">
                        Starting at <br><span>₹${service.price}</span>
                    </div>
                    <button class="book-btn">Book Now</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
    lucide.createIcons();
    updateMapMarkers(filteredServices);
}

// Initial render
renderServices(services);

// --- SMART RECOMMENDATION LOGIC ---
const recBtn = document.getElementById('recommend-btn');
if (recBtn) {
    recBtn.addEventListener('click', () => {
        const eventType = document.getElementById('event-type').value;
        const budget = document.getElementById('budget').value;
        
        let filtered = services;
        
        if (eventType) {
            filtered = filtered.filter(s => s.category === eventType);
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
        document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
    });
}

// --- AUTHENTICATION LOGIC ---
const authModal = document.getElementById('auth-modal');
const openAuthBtn = document.getElementById('open-auth-btn');
const closeAuthBtn = document.getElementById('close-auth-btn');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');

if (openAuthBtn) openAuthBtn.addEventListener('click', () => authModal.classList.remove('hidden'));
if (closeAuthBtn) closeAuthBtn.addEventListener('click', () => authModal.classList.add('hidden'));

authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        authTabs.forEach(t => t.classList.remove('active'));
        authForms.forEach(f => f.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.target).classList.add('active');
    });
});

// Check Auth State on Load
function updateNavState() {
    const savedUser = JSON.parse(localStorage.getItem('urbanServeUser'));
    if (savedUser) {
        const firstName = savedUser.name.split(' ')[0];
        const authBtn = document.getElementById('open-auth-btn');
        if (authBtn) {
            authBtn.outerHTML = `<a href="dashboard.html" class="btn-primary" id="open-auth-btn" style="text-decoration:none;"><i data-lucide="user"></i> ${firstName}</a>`;
            lucide.createIcons();
        }
    }
}
updateNavState();

// Login Form Submit
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailOrPhone: email, password })
            });
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('urbanServeUser', JSON.stringify(data.user));
                authModal.classList.add('hidden');
                updateNavState();
                alert('Welcome back, ' + data.user.name + '!');
            } else {
                alert(data.error || 'Invalid credentials');
            }
        } catch (err) {
            alert('Server error. Please make sure the backend is running.');
        }
    });
}

// Register Form Submit
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const phone = document.getElementById('reg-phone').value;
        const password = document.getElementById('reg-password').value;
        
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, password })
            });
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('urbanServeUser', JSON.stringify(data.user));
                authModal.classList.add('hidden');
                updateNavState();
                alert('Registration successful! Welcome, ' + name);
            } else {
                alert(data.error || 'Registration failed');
            }
        } catch (err) {
            alert('Server error. Please try again.');
        }
    });
}

// --- SEARCH OVERLAY LOGIC ---
const searchBtn = document.getElementById('search-btn');
const searchOverlay = document.getElementById('search-overlay');
const searchClose = document.getElementById('search-close');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

function openSearch() {
    searchOverlay.classList.remove('hidden');
    searchInput.value = '';
    searchResults.innerHTML = '';
    setTimeout(() => searchInput.focus(), 50);
}

function closeSearch() {
    searchOverlay.classList.add('hidden');
}

function renderSearchResults(query) {
    const q = query.trim().toLowerCase();
    if (!q) { searchResults.innerHTML = ''; return; }

    const matches = services.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q)
    );

    if (matches.length === 0) {
        searchResults.innerHTML = `<p class="search-no-results">No services found</p>`;
        return;
    }

    searchResults.innerHTML = matches.map(s => `
        <div class="search-result-item" data-id="${s.id}">
            <img class="search-result-img" src="${s.image}" alt="${s.name}">
            <div class="search-result-info">
                <div class="search-result-name">${s.name}</div>
                <div class="search-result-meta">⭐ ${s.rating} · 📍 ${s.location}</div>
            </div>
            <div class="search-result-price">₹${s.price.toLocaleString('en-IN')}</div>
        </div>
    `).join('');

    searchResults.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            closeSearch();
            renderServices(matches);
            document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

if(searchBtn) searchBtn.addEventListener('click', openSearch);
if(searchClose) searchClose.addEventListener('click', closeSearch);
if(searchInput) searchInput.addEventListener('input', e => renderSearchResults(e.target.value));
if(searchOverlay) searchOverlay.addEventListener('click', e => { if (e.target === searchOverlay) closeSearch(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });

// --- CATEGORY SCROLLER LOGIC ---
const categoryPills = document.querySelectorAll('.category-pill');
categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
        categoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        
        const filter = pill.dataset.filter;
        if (filter === 'all') {
            renderServices(services);
        } else {
            renderServices(services.filter(s => s.category === filter));
        }
        
        // Auto-scroll to services section
        document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
    });
});

// --- BOOKING FLOW LOGIC ---
const bookingModal = document.getElementById('booking-modal');
const closeBookingBtn = document.getElementById('close-booking-btn');
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');
const step4 = document.getElementById('step-4');
const summaryPrice = document.getElementById('summary-price');
const summaryTotal = document.getElementById('summary-total');

let currentBookingService = null;

// Add event listener to Book Now buttons (needs to be attached inside renderServices)
function attachBookButtons() {
    document.querySelectorAll('.book-btn').forEach((btn, index) => {
        // Find the service based on DOM structure
        btn.addEventListener('click', (e) => {
            const cardName = e.target.closest('.card-content').querySelector('.card-title').innerText;
            currentBookingService = services.find(s => s.name === cardName);
            
            if (currentBookingService) {
                document.getElementById('booking-title').innerText = `Book ${currentBookingService.name}`;
                summaryPrice.innerText = `₹${currentBookingService.price}`;
                summaryTotal.innerText = `₹${currentBookingService.price + 49}`;
                
                // Reset steps
                step1.classList.remove('hidden');
                step2.classList.add('hidden');
                step3.classList.add('hidden');
                step4.classList.add('hidden');
                
                // Reset selections
                document.querySelectorAll('.time-slot').forEach(t => t.classList.remove('selected'));
                document.getElementById('booking-date').value = '';
                document.getElementById('booking-name').value = '';
                document.getElementById('booking-phone').value = '';
                document.getElementById('booking-address').value = '';
                document.getElementById('booking-landmark').value = '';
                
                bookingModal.classList.remove('hidden');
            }
        });
    });
}

// Call this right after rendering services
const originalRenderServices = renderServices;
renderServices = function(filtered) {
    originalRenderServices(filtered);
    attachBookButtons();
};
// Re-render initially to attach
renderServices(services);

if (closeBookingBtn) closeBookingBtn.addEventListener('click', () => bookingModal.classList.add('hidden'));

// Time slots selection
document.querySelectorAll('.time-slot').forEach(slot => {
    slot.addEventListener('click', () => {
        document.querySelectorAll('.time-slot').forEach(t => t.classList.remove('selected'));
        slot.classList.add('selected');
    });
});

// Step 1 -> Step 2
document.getElementById('confirm-time-btn').addEventListener('click', () => {
    const date = document.getElementById('booking-date').value;
    const time = document.querySelector('.time-slot.selected');
    
    if (!date) { alert('Please select a date'); return; }
    if (!time) { alert('Please select a time slot'); return; }
    
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
});

// Step 2 -> Step 3
document.getElementById('confirm-details-btn').addEventListener('click', () => {
    const name = document.getElementById('booking-name').value;
    const phone = document.getElementById('booking-phone').value;
    const address = document.getElementById('booking-address').value;
    
    if (!name || !phone || !address) { alert('Please fill in all mandatory customer details to continue.'); return; }
    
    // Phone number validation
    if (!/^\d{10}$/.test(phone)) {
        alert('Please enter a valid 10-digit phone number.');
        return;
    }
    
    step2.classList.add('hidden');
    step3.classList.remove('hidden');
});

// Step 3 -> Step 4
document.getElementById('final-book-btn').addEventListener('click', () => {
    step3.classList.add('hidden');
    step4.classList.remove('hidden');
    
    // Auto close after 3 seconds
    setTimeout(() => {
        bookingModal.classList.add('hidden');
    }, 3000);
});
