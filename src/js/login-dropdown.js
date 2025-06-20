document.addEventListener('DOMContentLoaded', function() {
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    // Abrir/fechar dropdown ao clicar no ícone
    dropdownToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownMenu.classList.toggle('active');
    });
    
    // Fechar dropdown ao clicar fora
    document.addEventListener('click', function(e) {
        if (!dropdownMenu.contains(e.target) && !dropdownToggle.contains(e.target)) {
            dropdownMenu.classList.remove('active');
        }
    });
    
    // Fechar dropdown ao clicar em "Sair do Perfil"
    const logoutBtn = document.querySelector('.dropdown-item');
    logoutBtn.addEventListener('click', function() {
        dropdownMenu.classList.remove('active');
        alert('Saindo do perfil...');
    });
    
    // Fechar cards ao clicar no "x"
    const closeButtons = document.querySelectorAll('.close-btn');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.parentElement.style.display = 'none';
        });
    });
});