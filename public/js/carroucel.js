document.addEventListener('DOMContentLoaded', function () {
    const carouselTrack = document.getElementById('carouselTrack');

    const sponsors = [
        '/public/img/spitfire-logo.png',
        '/public/img/logo_psh.png',
        '/public/img/ace-logo.png',
        '/public/img/vans-logo.png',
        '/public/img/independent-logo.png',
        '/public/img/creature-logo.png',
        '/public/img/dropdead-logo.png',
        '/public/img/santacruz-logo.png',
        '/public/img/element-logo.png',
        '/public/img/bones-logo.png',
        '/public/img/powell-logo.png',
        '/public/img/187-logo.png',
    ];

    const doubleSponsors = [...sponsors, ...sponsors];

    doubleSponsors.forEach((logo, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';

        const img = document.createElement('img');
        img.src = logo;
        img.alt = `Patrocinador ${index + 1}`;

        slide.appendChild(img);
        carouselTrack.appendChild(slide);
    });
});

