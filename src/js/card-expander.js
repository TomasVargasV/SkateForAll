
document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.card');
    const overlay = document.querySelector('.overlay');
    const closeButtons = document.querySelectorAll('.close-btn');

    cards.forEach(card => {
        const button = card.querySelector('.card-btn');

        button.addEventListener('click', () => {
            // Close any other open cards
            cards.forEach(c => {
                if (c !== card && c.classList.contains('expanded')) {
                    c.classList.remove('expanded');
                }
            });

            // Expand the clicked card
            card.classList.add('expanded');
            overlay.classList.add('active');

            // Prevent scrolling on the background
            document.body.style.overflow = 'hidden';
        });
    });

    // Close functionality
    function closeCard() {
        cards.forEach(card => {
            card.classList.remove('expanded');
        });
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Close when clicking overlay
    overlay.addEventListener('click', closeCard);

    // Close when clicking close button
    closeButtons.forEach(button => {
        button.addEventListener('click', closeCard);
    });

    // Close when pressing Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeCard();
        }
    });
});
