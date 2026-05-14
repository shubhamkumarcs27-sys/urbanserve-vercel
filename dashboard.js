// Initialize Icons
lucide.createIcons();

function transitionTo(url) {
  const overlay = document.getElementById("page-transition");
  if (overlay) {
    overlay.classList.add("active");
    setTimeout(() => (window.location.href = url), 500);
  } else {
    window.location.href = url;
  }
}

function logout() {
  localStorage.removeItem("urbanNeedsUser");
  transitionTo("index.html");
}

// --- THEME PERSISTENCE ---
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
}

document.addEventListener("DOMContentLoaded", () => {
  const savedUser = JSON.parse(localStorage.getItem("urbanNeedsUser"));

  // Redirect to home if not logged in
  if (!savedUser) {
    window.location.href = "index.html";
    return;
  }

  // Populate Data Function
  function populateData(user) {
    document.getElementById("profile-name").textContent = user.name;
    document.getElementById("profile-email-small").textContent = user.email;
    document.getElementById("avatar-initial").textContent = user.name
      .charAt(0)
      .toUpperCase();

    document.getElementById("display-name").textContent = user.name;
    document.getElementById("display-email").textContent = user.email;
    document.getElementById("display-phone").textContent = user.phone;

    lucide.createIcons();
  }

  // Initial Population
  populateData(savedUser);

  // Edit Profile Logic
  const profileView = document.getElementById("profile-view");
  const settingsView = document.getElementById("settings-view");
  const openEditBtn = document.getElementById("open-edit-btn");
  const cancelEditBtn = document.getElementById("cancel-edit-btn");
  const editForm = document.getElementById("edit-profile-form");

  openEditBtn.addEventListener("click", () => {
    const user = JSON.parse(localStorage.getItem("urbanNeedsUser"));
    document.getElementById("edit-name").value = user.name;
    document.getElementById("edit-email").value = user.email;
    document.getElementById("edit-phone").value = user.phone;

    profileView.classList.add("hidden");
    settingsView.classList.remove("hidden");
  });

  cancelEditBtn.addEventListener("click", () => {
    settingsView.classList.add("hidden");
    profileView.classList.remove("hidden");
  });

  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("urbanNeedsUser"));
    const oldEmail = user.email;

    const updatedData = {
      name: document.getElementById("edit-name").value,
      email: document.getElementById("edit-email").value,
      phone: document.getElementById("edit-phone").value,
    };

    try {
      const response = await fetch("/api/profile/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "user-email": oldEmail,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("urbanNeedsUser", JSON.stringify(data.user));
        populateData(data.user);
        settingsView.classList.add("hidden");
        profileView.classList.remove("hidden");
        alert("Profile updated successfully!");
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (err) {
      alert("Server error.");
    }
  });

  // Sidebar Navigation Logic
  const menuItems = {
    "menu-info": ["profile-view"],
    "menu-bookings": ["bookings-view"],
    "menu-settings": ["app-settings-view"],
  };

  const allViews = [
    "profile-view",
    "settings-view",
    "app-settings-view",
    "bookings-view",
  ];

  Object.keys(menuItems).forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("click", () => {
      document
        .querySelectorAll(".menu-item")
        .forEach((btn) => btn.classList.remove("active"));
      el.classList.add("active");
      allViews.forEach((viewId) => {
        const view = document.getElementById(viewId);
        if (view) view.classList.add("hidden");
      });
      const targetViews = menuItems[id];
      targetViews.forEach((viewId) => {
        const view = document.getElementById(viewId);
        if (view) view.classList.remove("hidden");
      });

      if (id === "menu-bookings") {
        renderBookings();
      }
    });
  });

  function renderBookings() {
    const container = document.getElementById("bookings-view");
    const history =
      JSON.parse(localStorage.getItem("urbanNeedsBookings")) || [];
    const userBookings = history.filter((b) => b.userEmail === savedUser.email);

    if (userBookings.length === 0) {
      container.innerHTML = `
                <h2 class="heading-2" style="font-size: 1.8rem; margin-bottom: 2rem;">My Bookings</h2>
                <div class="empty-state" style="text-align: center; padding: 4rem 2rem;">
                    <i data-lucide="calendar-x" style="width: 48px; height: 48px; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                    <p class="text-secondary">You have no upcoming or past bookings.</p>
                    <a href="index.html" class="btn-primary" style="display:inline-flex; margin-top:1.5rem;">Book a Service</a>
                </div>
            `;
    } else {
      container.innerHTML = `
                <h2 class="heading-2" style="font-size: 1.8rem; margin-bottom: 2rem;">My Bookings</h2>
                <div class="bookings-list">
                    ${userBookings
                      .reverse()
                      .map(
                        (b) => `
                        <div class="booking-card">
                            <div class="booking-info">
                                <h4>${b.service}</h4>
                                <p><i data-lucide="calendar" style="width:14px;"></i> ${b.date} • ${b.time}</p>
                                <div class="expert-info">
                                    <div class="expert-name">Top Rated Professional Assigned</div>
                                    <div class="expert-status">Verified • 4.9/5 Average Rating</div>
                                </div>
                                <p><i data-lucide="hash" style="width:14px;"></i> ${b.id}</p>
                            </div>
                            <div style="text-align: right;">
                                <div class="info-value" style="margin-bottom:0.5rem;">₹${b.amount}</div>
                                <span class="booking-status">${b.status}</span>
                            </div>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            `;
    }
    lucide.createIcons();
  }
});
