function toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    const isOpen = dropdown.classList.contains("show");

    document.querySelectorAll(".dropdown-contents").forEach(d => d.classList.remove("show"));

    if (!isOpen) {
        dropdown.classList.add("show");
    }
}

function toggleMobileMenu() {
    const nav = document.getElementById("main-nav");
    const btn = document.querySelector(".hamburger");
    nav.classList.toggle("open");
    btn.classList.toggle("open");
}

function closeMobileMenu() {
    const nav = document.getElementById("main-nav");
    const btn = document.querySelector(".hamburger");
    nav.classList.remove("open");
    btn.classList.remove("open");
}

// Close dropdowns when clicking outside
window.addEventListener("click", function (event) {
    if (!event.target.closest(".dropdown")) {
        document.querySelectorAll(".dropdown-contents").forEach(d => d.classList.remove("show"));
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            e.preventDefault();
            closeMobileMenu();
            target.scrollIntoView({ behavior: "smooth" });
        }
    });
});