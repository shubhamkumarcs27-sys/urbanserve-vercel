// Initialize Icons
lucide.createIcons();

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

// --- RENDER SERVICES ---
function renderServices(filteredServices) {
    const container = document.getElementById('services-container');
    container.innerHTML = '';
    
    if (filteredServices.length === 0) {
        container.innerHTML = '<p class="text-secondary" style="grid-column: 1/-1; text-align: center;">No services found matching your criteria.</p>';
        return;
    }

    filteredServices.forEach((service, index) => {
        const delay = (index % 3) * 0.15; // Stagger effect
        const card = document.createElement('div');
        card.className = 'service-card animate-on-scroll';
        card.style.animationDelay = `${delay}s`;
        card.innerHTML = `
            <div class="card-image">
                <img src="${service.image}" alt="${service.name}">
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

    // Observe newly added cards for scroll animation
    const cards = container.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    
    cards.forEach(card => observer.observe(card));
}

// Initial render
renderServices(services);

// --- SMART RECOMMENDATION LOGIC ---
document.getElementById('recommend-btn').addEventListener('click', () => {
    const eventType = document.getElementById('event-type').value;
    const budget = document.getElementById('budget').value;
    
    let filtered = services;
    
    if (eventType) {
        filtered = filtered.filter(s => s.category === eventType);
    }
    
    if (budget) {
        filtered = filtered.filter(s => {
            if (budget === 'low') return s.price < 10000;
            if (budget === 'medium') return s.price >= 10000 && s.price <= 50000;
            if (budget === 'high') return s.price > 50000;
            return true;
        });
    }
    
    renderServices(filtered);
    
    // Smooth scroll to services
    document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
});

// --- MAP INTEGRATION (LEAFLET) ---
const initMap = () => {
    // Default to India (center roughly around Nagpur/central India to show multiple cities)
    const map = L.map('map').setView([20.5937, 78.9629], 5);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Add markers for services
    services.forEach(service => {
        const marker = L.marker(service.coords).addTo(map);
        marker.bindPopup(`
            <div style="padding: 5px;">
                <h4 style="margin: 0 0 5px 0; font-family: 'Inter', sans-serif;">${service.name}</h4>
                <p style="margin: 0; color: #666;">₹${service.price} &bull; <i style="color: #ec4899;">★</i> ${service.rating}</p>
            </div>
        `);
    });
};

// Delay map initialization slightly to ensure container is ready
setTimeout(initMap, 500);

// --- CHAT WIDGET LOGIC ---
const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const chatClose = document.getElementById('chat-close');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatBody = document.getElementById('chat-body');

chatToggle.addEventListener('click', () => {
    chatWindow.classList.remove('hidden');
});

chatClose.addEventListener('click', () => {
    chatWindow.classList.add('hidden');
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    
    // Add User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'message user-message animate-fade-in';
    userMsg.textContent = text;
    chatBody.appendChild(userMsg);
    
    chatInput.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Mock Agent Response
    setTimeout(() => {
        const agentMsg = document.createElement('div');
        agentMsg.className = 'message agent-message animate-fade-in';
        agentMsg.textContent = "That sounds great! I'm checking availability for our top providers. What date were you thinking?";
        chatBody.appendChild(agentMsg);
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 1000);
});

// --- AUTHENTICATION LOGIC ---
const authModal = document.getElementById('auth-modal');
const openAuthBtn = document.getElementById('open-auth-btn');
const closeAuthBtn = document.getElementById('close-auth-btn');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');
const navActions = document.getElementById('nav-actions');

// Toggle Modal
if (openAuthBtn) {
    openAuthBtn.addEventListener('click', () => authModal.classList.remove('hidden'));
}
closeAuthBtn.addEventListener('click', () => authModal.classList.add('hidden'));

// Tab Switching
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        authTabs.forEach(t => t.classList.remove('active'));
        authForms.forEach(f => f.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(tab.dataset.target).classList.add('active');
    });
});

// Form Submissions (API Integration)
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const phone = document.getElementById('reg-phone').value;
    const password = document.getElementById('reg-password').value;

    if (password.length < 8) {
        alert('Password must be at least 8 characters long.');
        return;
    }

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
            alert('Registration successful! You are now logged in.');
        } else {
            alert(data.error || 'Registration failed');
        }
    } catch (err) {
        alert('Server error. Please make sure the Node.js backend is running.');
    }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailOrPhone = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailOrPhone, password })
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
        alert('Server error. Please make sure the Node.js backend is running.');
    }
});

document.getElementById('forgot-password-link').addEventListener('click', (e) => {
    e.preventDefault();
    const emailOrPhone = prompt("Please enter your registered email or phone number to reset your password:");
    if (emailOrPhone) {
        alert(`A password reset link has been sent to ${emailOrPhone}. Please check your inbox or messages.`);
    }
});

// Check Auth State on Load
function updateNavState() {
    const savedUser = JSON.parse(localStorage.getItem('urbanServeUser'));
    if (savedUser) {
        const firstName = savedUser.name.split(' ')[0];
        navActions.innerHTML = `
            <button class="icon-btn" aria-label="Search"><i data-lucide="search"></i></button>
            <a href="dashboard.html" class="btn-primary" style="text-decoration:none;"><i data-lucide="user"></i> ${firstName}</a>
        `;
        lucide.createIcons();
    }
}

updateNavState();

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
        searchResults.innerHTML = `<p class="search-no-results">No services found for "<strong>${query}</strong>"</p>`;
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

searchBtn.addEventListener('click', openSearch);
searchClose.addEventListener('click', closeSearch);
searchInput.addEventListener('input', e => renderSearchResults(e.target.value));
searchOverlay.addEventListener('click', e => { if (e.target === searchOverlay) closeSearch(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });

// --- LOADING SCREEN LOGIC ---
window.addEventListener('load', () => {
    const loader = document.getElementById('loading-screen');
    // Add a slight delay to ensure the beautiful loader is visible
    setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.remove();
            // Trigger landing animations
            document.body.classList.add('page-loaded');
        }, 850); // Remove from DOM after new 800ms fade out transition
    }, 1200);
});
