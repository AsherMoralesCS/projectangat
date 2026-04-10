function toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    const isOpen = dropdown.classList.contains("show");

    document.querySelectorAll(".dropdown-contents").forEach(d => d.classList.remove("show"));

    if (!isOpen) {
        dropdown.classList.add("show");
    }
}

window.addEventListener("click", function (event) {
    if (!event.target.closest(".dropdown")) {
        document.querySelectorAll(".dropdown-contents").forEach(d => d.classList.remove("show"));
    }
});