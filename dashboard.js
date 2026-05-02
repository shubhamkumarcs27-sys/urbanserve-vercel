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

    // Populate Data Function
    function populateData(user) {
        document.getElementById('profile-name').textContent = user.name;
        document.getElementById('profile-email-small').textContent = user.email;
        document.getElementById('avatar-initial').textContent = user.name.charAt(0).toUpperCase();

        document.getElementById('display-name').textContent = user.name;
        document.getElementById('display-email').textContent = user.email;
        document.getElementById('display-phone').textContent = user.phone;
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
