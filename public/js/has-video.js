const withVideoBtn = document.getElementById('withVideoBtn');
const withoutVideoBtn = document.getElementById('withoutVideoBtn');
const videoSection = document.getElementById('videoSection');
const mainContent = document.getElementById('mainContent');
const instructionsWithVideo = document.getElementById('instructionsWithVideo');
const instructionsWithoutVideo = document.getElementById('instructionsWithoutVideo');

let hasVideo = true;

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

updateLayout();

withVideoBtn.addEventListener('click', () => {
    hasVideo = true;
    updateLayout();
});

withoutVideoBtn.addEventListener('click', () => {
    hasVideo = false;
    updateLayout();
});