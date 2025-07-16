function initCardExpanders() {
    const cards = document.querySelectorAll('.card');
    const overlay = document.querySelector('.overlay');

    cards.forEach(card => {
        const button = card.querySelector('.card-btn');
        const detailBtn = card.querySelector('.detail-btn');
        const closeBtn = card.querySelector('.close-btn');

        button.addEventListener('click', () => {
            card.classList.add('expanded');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        if (detailBtn) {
            detailBtn.addEventListener('click', function () {
                const drawId = this.getAttribute('data-draw-id');
                window.location.href = `../html/draw.html?drawId=${drawId}`;
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                card.classList.remove('expanded');
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
    });

    overlay.addEventListener('click', () => {
        document.querySelectorAll('.card.expanded').forEach(card => {
            card.classList.remove('expanded');
        });
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.card.expanded').forEach(card => {
                card.classList.remove('expanded');
            });
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}