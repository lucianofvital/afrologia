/* ============================================================
   JS PERSONALIZADO: AFROLOGIA - LINK NA BIO (Moderno)
   Animações e Interatividade Otimizadas
   ============================================================ */

document.addEventListener("DOMContentLoaded", function() {
    
    /* ========================================================
       1. SCROLLREVEAL: Animações Sofisticadas
       ======================================================== */
    const sr = ScrollReveal({
        origin: 'bottom',
        distance: '50px',
        duration: 1100,
        delay: 100,
        reset: false,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    });

    // Título Principal
    sr.reveal('.hero-title-bio', { delay: 200, distance: '30px' });

    // Story Indicator
    sr.reveal('.story-indicator', { delay: 0, scale: 0.95 });

    // Carrossel de Frases
    sr.reveal('.carousel-bio', { delay: 300 });

    // Foto Destaque
    sr.reveal('.foto-destaque-bio', { delay: 400, scale: 0.98 });

    // Botões
    sr.reveal('.container-botoes-bio', { delay: 500 });

    // Cards dos Poetas
    sr.reveal('.poeta-bio-card', { 
        delay: 200, 
        interval: 150,
        distance: '40px'
    });

    /* ========================================================
       2. SMOOTH SCROLL - Rolagem Suave
       ======================================================== */
    const linksDeRolagem = document.querySelectorAll('.scroll-link');

    linksDeRolagem.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    /* ========================================================
       3. MENU MOBILE - Auto-close
       ======================================================== */
    const menuLateral = document.getElementById('menuLateral');
    const linksMenu = menuLateral.querySelectorAll('.nav-link');
    const bsOffcanvas = new bootstrap.Offcanvas(menuLateral);

    linksMenu.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992) {
                bsOffcanvas.hide();
            }
        });
    });

    /* ========================================================
       4. NAVBAR HIDE/SHOW AO SCROLL
       ======================================================== */
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        let scrollTop = window.scrollY;

        if (scrollTop > 100) {
            if (scrollTop > lastScrollTop) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);

    /* ========================================================
       5. EFEITO HOVER NOS CARDS
       ======================================================== */
    const cards = document.querySelectorAll('.poeta-bio-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            cards.forEach(c => {
                if (c !== this) {
                    c.style.filter = 'brightness(0.95)';
                }
            });
        });

        card.addEventListener('mouseleave', function() {
            cards.forEach(c => {
                c.style.filter = 'brightness(1)';
            });
        });
    });

    /* ========================================================
       6. CARROSSEL AUTO-PLAY OTIMIZADO
       ======================================================== */
    const carousel = document.querySelector('#frasesCarousel');
    if (carousel) {
        new bootstrap.Carousel(carousel, {
            interval: 3800,
            wrap: true,
            cycle: true
        });
    }

});