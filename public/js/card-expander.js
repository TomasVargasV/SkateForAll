// document.addEventListener('DOMContentLoaded', function () {
//     const cards = document.querySelectorAll('.card');
//     const overlay = document.querySelector('.overlay');
//     let expandedCardClone = null;

//     cards.forEach(card => {
//         const button = card.querySelector('.card-btn');

//         button.addEventListener('click', () => {
//             if (expandedCardClone) {
//                 closeCard(expandedCardClone);
//             }

//             const clone = card.cloneNode(true);
//             clone.classList.add('expanded');
//             document.body.appendChild(clone);
//             overlay.classList.add('active');
//             document.body.style.overflow = 'hidden';
//             expandedCardClone = clone;

//             // Adicionar funcionalidade ao novo botão
//             const detailBtn = clone.querySelector('.detail-btn');
//             detailBtn.addEventListener('click', function() {
//                 // Aqui você pode definir a URL para onde o botão deve levar
//                 window.location.href = '../html/draw.html'; 
//             });

//             const closeButton = clone.querySelector('.close-btn');
//             closeButton.addEventListener('click', function () {
//                 closeCard(clone);
//             });
//         });
//     });

//     function closeCard(clone) {
//         clone.remove();
//         overlay.classList.remove('active');
//         document.body.style.overflow = 'auto';
//         expandedCardClone = null;
//     }

//     overlay.addEventListener('click', () => {
//         if (expandedCardClone) {
//             closeCard(expandedCardClone);
//         }
//     });

//     document.addEventListener('keydown', function (e) {
//         if (e.key === 'Escape' && expandedCardClone) {
//             closeCard(expandedCardClone);
//         }
//     });
// });

function initCardExpanders() {
    const cards = document.querySelectorAll('.card');
    const overlay = document.querySelector('.overlay');

    cards.forEach(card => {
        const button = card.querySelector('.card-btn');
        const detailBtn = card.querySelector('.detail-btn');
        const closeBtn = card.querySelector('.close-btn');

        // Evento para expandir o card
        button.addEventListener('click', () => {
            // Adiciona classe expanded ao card original
            card.classList.add('expanded');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Evento para o botão de inscrição (no card expandido)
        if (detailBtn) {
            detailBtn.addEventListener('click', function () {
                const drawId = this.getAttribute('data-draw-id');
                window.location.href = `../html/draw.html?drawId=${drawId}`;
            });
        }

        // Evento para fechar o card
        if (closeBtn) {
            closeBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                card.classList.remove('expanded');
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
    });

    // Fechar ao clicar no overlay
    overlay.addEventListener('click', () => {
        document.querySelectorAll('.card.expanded').forEach(card => {
            card.classList.remove('expanded');
        });
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Fechar ao pressionar ESC
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