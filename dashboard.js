// Initialize Icons
lucide.createIcons();

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
    localStorage.removeItem('urbanServeUser');
    transitionTo('index.html');
}

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
            const response = await fetch('/api/profile/', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'user-email': oldEmail
                },
                body: JSON.stringify(updatedData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('urbanServeUser', JSON.stringify(data.user));
                populateData(data.user);
                settingsView.classList.add('hidden');
                profileView.classList.remove('hidden');
                alert('Profile updated successfully!');
            } else {
                alert(data.error || 'Failed to update profile');
            }
        } catch (err) {
            alert('Server error.');
        }
    });

    // Sidebar Navigation Logic
    const menuItems = {
        'menu-info': ['profile-view'],
        'menu-settings': ['app-settings-view']
    };

    const allViews = ['profile-view', 'settings-view', 'app-settings-view'];

    Object.keys(menuItems).forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('click', () => {
            document.querySelectorAll('.menu-item').forEach(btn => btn.classList.remove('active'));
            el.classList.add('active');
            allViews.forEach(viewId => {
                const view = document.getElementById(viewId);
                if (view) view.classList.add('hidden');
            });
            const targetViews = menuItems[id];
            targetViews.forEach(viewId => {
                const view = document.getElementById(viewId);
                if (view) view.classList.remove('hidden');
            });
        });
    });
});
