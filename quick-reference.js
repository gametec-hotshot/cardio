function showTab(tabId) {
    // Hide all tab contents
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.style.display = 'none');

    // Show the selected tab
    document.getElementById(tabId).style.display = 'block';

    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => button.classList.remove('active'));

    // Add active class to clicked button
    event.target.classList.add('active');
}

// Initialize first tab on load
window.onload = function() {
    showTab('drug-dosing');
};