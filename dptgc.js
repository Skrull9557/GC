function toggleDarkMode() {
    let isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
}

// On page load
document.addEventListener('DOMContentLoaded', (event) => {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }
});
document.getElementById('menuButton').addEventListener('click', function() {
    const menu = document.getElementById('slidingMenu');
    // Toggle the visibility of the sliding menu
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden'); // Show the menu
        menu.classList.add('visible'); // Add visible class
    } else {
        menu.classList.remove('visible'); // Hide the menu
        menu.classList.add('hidden'); // Add hidden class
    }
});