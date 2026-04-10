function toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    dropdown.classList.toggle("show");
}

// Close dropdown when clicking outside
window.onclick = function(event) {
    if (!event.target.matches('.dropdown-button-nav')) {
        const dropdowns = document.getElementsByClassName("dropdown-contents");

        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];

            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}