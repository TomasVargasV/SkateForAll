document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.card');
    const overlay = document.querySelector('.overlay');
    let expandedCardClone = null;

    cards.forEach(card => {
        const button = card.querySelector('.card-btn');

        button.addEventListener('click', () => {
            if (expandedCardClone) {
                closeCard(expandedCardClone);
            }

            const clone = card.cloneNode(true);
            clone.classList.add('expanded');
            document.body.appendChild(clone);
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            expandedCardClone = clone;

            const closeButton = clone.querySelector('.close-btn');
            closeButton.addEventListener('click', function () {
                closeCard(clone);
            });
        });
    });

    function closeCard(clone) {
        clone.remove();
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
        expandedCardClone = null;
    }

    overlay.addEventListener('click', () => {
        if (expandedCardClone) {
            closeCard(expandedCardClone);
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && expandedCardClone) {
            closeCard(expandedCardClone);
        }
    });
});