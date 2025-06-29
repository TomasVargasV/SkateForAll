const withVideoBtn = document.getElementById('withVideoBtn');
const withoutVideoBtn = document.getElementById('withoutVideoBtn');
const videoSection = document.getElementById('videoSection');
const mainContent = document.getElementById('mainContent');
const instructionsWithVideo = document.getElementById('instructionsWithVideo');
const instructionsWithoutVideo = document.getElementById('instructionsWithoutVideo');

// Simulate database flag for video presence
// In real implementation, this would come from your database
let hasVideo = true;

// Function to update layout based on video presence
function updateLayout() {
    if (hasVideo) {
        videoSection.style.display = 'block';
        mainContent.className = 'main-content with-video';
        withVideoBtn.classList.add('active');
        withoutVideoBtn.classList.remove('active');
        instructionsWithVideo.style.display = 'block';
        instructionsWithoutVideo.style.display = 'none';
        document.body.classList.remove('without-video');
        document.body.classList.add('with-video');
    } else {
        videoSection.style.display = 'none';
        mainContent.className = 'main-content without-video';
        withoutVideoBtn.classList.add('active');
        withVideoBtn.classList.remove('active');
        instructionsWithVideo.style.display = 'none';
        instructionsWithoutVideo.style.display = 'block';
        document.body.classList.remove('with-video');
        document.body.classList.add('without-video');
    }

    if (typeof updateButtonState === 'function') {
        updateButtonState();
    }
}

// Initial layout update
updateLayout();

// Event listeners for toggle buttons
withVideoBtn.addEventListener('click', () => {
    hasVideo = true;
    updateLayout();
});

withoutVideoBtn.addEventListener('click', () => {
    hasVideo = false;
    updateLayout();
});

// Form validation
// document.querySelector('.btn-participate').addEventListener('click', function () {
//     const usernameInput = document.getElementById('instagram-username');
//     const username = usernameInput.value.trim();

//     if (!username) {
//         alert('Please enter your Instagram username');
//         usernameInput.focus();
//         return;
//     }

//     if (!username.startsWith('@')) {
//         alert('Username must start with @');
//         usernameInput.focus();
//         return;
//     }

//     // Check video requirement if applicable
//     if (hasVideo) {
//         alert(`Thank you for watching the video and entering, ${username}! Good luck!`);
//     } else {
//         alert(`Thank you for entering, ${username}! Good luck!`);
//     }

//     // Reset the form
//     usernameInput.value = '';
// });