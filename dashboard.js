// Initialize Icons
lucide.createIcons();

// --- THEME PERSISTENCE ---
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

document.addEventListener('DOMContentLoaded', () => {
    const savedUser = JSON.parse(localStorage.getItem('urbanServeUser'));

    // Redirect to home if not logged in
    if (!savedUser) {
        window.location.href = 'index.html';
        return;
    }

    // Services Data (Mock)
    const services = [
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

    // Populate Data Function
    function populateData(user) {
        document.getElementById('profile-name').textContent = user.name;
        document.getElementById('profile-email-small').textContent = user.email;
        document.getElementById('avatar-initial').textContent = user.name.charAt(0).toUpperCase();

        document.getElementById('display-name').textContent = user.name;
        document.getElementById('display-email').textContent = user.email;
        document.getElementById('display-phone').textContent = user.phone;

        // Render Bookings
        const bookingsView = document.getElementById('bookings-view');
        if (user.bookings && user.bookings.length > 0) {
            let bookingsHtml = `<h2 class="heading-2" style="font-size: 1.8rem; margin-bottom: 2rem;">My Bookings</h2>`;
            user.bookings.slice().reverse().forEach(b => {
                bookingsHtml += `
                    <div class="card" style="background: var(--bg-secondary); border: 1px solid var(--glass-border); border-radius: var(--border-radius-md); padding: 1.5rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h4 style="margin: 0; font-size: 1.1rem;">${b.serviceName}</h4>
                            <p style="margin: 0.3rem 0; color: var(--text-secondary); font-size: 0.9rem;"><i data-lucide="calendar" style="width: 14px;"></i> ${b.date} at ${b.time}</p>
                            <div style="display: flex; align-items: center; gap: 0.4rem; color: #10b981; font-size: 0.85rem; font-weight: 600;">
                                <i data-lucide="check-circle" style="width: 14px;"></i> Confirmed
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: 700; font-size: 1.2rem;">₹${b.price}</div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary);">Paid</div>
                        </div>
                    </div>
                `;
            });
            bookingsView.innerHTML = bookingsHtml;
        }

        // Render Favorites
        const savedView = document.getElementById('saved-view');
        if (user.favorites && user.favorites.length > 0) {
            let favsHtml = `<h2 class="heading-2" style="font-size: 1.8rem; margin-bottom: 2rem;">Saved Services</h2>`;
            favsHtml += `<div class="grid-auto" style="grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem;">`;
            
            user.favorites.forEach(favId => {
                // Use loose comparison or Number() to ensure it works even if stored as string
                const service = services.find(s => Number(s.id) === Number(favId));
                if (service) {
                    favsHtml += `
                        <div class="service-card" style="padding-bottom: 1rem; position: relative;">
                            <div class="card-image" style="height: 150px;">
                                <img src="${service.image}" alt="${service.name}" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <div class="card-content" style="padding: 1rem;">
                                <h4 style="margin: 0; font-size: 1.1rem;">${service.name}</h4>
                                <div style="color: var(--accent-secondary); font-size: 0.9rem; margin: 0.5rem 0;">★ ${service.rating}</div>
                                <div style="font-weight: 700; font-size: 1.1rem;">₹${service.price}</div>
                            </div>
                        </div>
                    `;
                }
            });
            favsHtml += `</div>`;
            savedView.innerHTML = favsHtml;
        }
        lucide.createIcons();
    }

    // Initial Population
    populateData(savedUser);

    // Edit Profile Logic
    const profileView = document.getElementById('profile-view');
    const settingsView = document.getElementById('settings-view');
    const openEditBtn = document.getElementById('open-edit-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const editForm = document.getElementById('edit-profile-form');

    openEditBtn.addEventListener('click', () => {
        const user = JSON.parse(localStorage.getItem('urbanServeUser'));
        document.getElementById('edit-name').value = user.name;
        document.getElementById('edit-email').value = user.email;
        document.getElementById('edit-phone').value = user.phone;
        
        profileView.classList.add('hidden');
        settingsView.classList.remove('hidden');
    });

    cancelEditBtn.addEventListener('click', () => {
        settingsView.classList.add('hidden');
        profileView.classList.remove('hidden');
    });

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('urbanServeUser'));
        const oldEmail = user.email;
        
        const updatedData = {
            name: document.getElementById('edit-name').value,
            email: document.getElementById('edit-email').value,
            phone: document.getElementById('edit-phone').value
        };
        
        try {
            const response = await fetch('/api/users', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'user-email': oldEmail
                },
                body: JSON.stringify(updatedData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Save updated session to localStorage
                localStorage.setItem('urbanServeUser', JSON.stringify(data.user));
                
                // Update UI
                populateData(data.user);
                
                // Switch views
                settingsView.classList.add('hidden');
                profileView.classList.remove('hidden');
                
                alert('Profile updated successfully!');
            } else {
                alert(data.error || 'Failed to update profile');
            }
        } catch (err) {
            alert('Server error. Please make sure the backend is running.');
        }
    });

    // Logout Logic
    document.getElementById('logout-btn').addEventListener('click', () => {
        const confirmLogout = confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            localStorage.removeItem('urbanServeUser');
            window.location.href = 'index.html';
        }
    });

    // Sidebar Navigation Logic
    const menuItems = {
        'menu-info': ['profile-view'],
        'menu-bookings': ['bookings-view'],
        'menu-saved': ['saved-view'],
        'menu-settings': ['app-settings-view']
    };

    const allViews = ['profile-view', 'settings-view', 'bookings-view', 'saved-view', 'app-settings-view'];

    Object.keys(menuItems).forEach(id => {
        document.getElementById(id).addEventListener('click', () => {
            // Update active state in sidebar
            document.querySelectorAll('.menu-item').forEach(btn => btn.classList.remove('active'));
            document.getElementById(id).classList.add('active');

            // Hide all views and show the relevant one
            const targetViews = menuItems[id];
            allViews.forEach(viewId => {
                const view = document.getElementById(viewId);
                if (view) view.classList.add('hidden');
            });

            targetViews.forEach(viewId => {
                const view = document.getElementById(viewId);
                if (view) view.classList.remove('hidden');
            });
        });
    });
});
