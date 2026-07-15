/* ============================================================
   JS PERSONALIZADO: AFROLOGIA
   Código limpo, unificado e otimizado.
   ============================================================ */

document.addEventListener("DOMContentLoaded", function() {

    /* ========================================================
       1. REVEAL AO ROLAR (Fade-in e Slide-up)
       ======================================================== */
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Para animar apenas 1x
            }
        });
    }, {
        threshold: 0.10, // Inicia a animação quando 10% do elemento estiver visível
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });

    /* ========================================================
       2. SMOOTH SCROLL (Nativo + Evento para links da mesma page)
       ======================================================== */
    const linksDeRolagem = document.querySelectorAll('.scroll-link');
    linksDeRolagem.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ========================================================
       3. MENU MOBILE - Controle de estado (Fechar automático)
       ======================================================== */
    const navCheckbox = document.getElementById('afro-navcheck');
    const navLinks = document.querySelectorAll('.afro-nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navCheckbox && navCheckbox.checked) {
                navCheckbox.checked = false;
            }
        });
    });

    /* ========================================================
       4. HEADER/ICONS AO ROLAR (Muda cor do Hambúrguer)
       ======================================================== */
    const heroSection = document.getElementById('cp-home');
    const updateHeaderState = () => {
        const scrollTop = window.scrollY;
        const heroHeight = heroSection ? heroSection.offsetHeight : 0;
        // Adiciona classe site-scrolled ao body apenas quando a rolagem passa da altura do Hero (-50px margem)
        document.body.classList.toggle('site-scrolled', scrollTop > heroHeight - 50);
    };

    window.addEventListener('scroll', updateHeaderState, { passive: true });
    updateHeaderState();

    /* ========================================================
       5. PARALLAX DO HERO VIA JS (Efeito limpo e compatível)
       ======================================================== */
    const heroBg = document.querySelector('.cp-home-bg');
    const updateHeroParallax = () => {
        if (!heroBg) return;
        const offset = window.scrollY;
        // Aplica tradução de hardware para efeito fluido em vez de mudar background-position
        heroBg.style.transform = `translate3d(0, ${offset * 0.45}px, 0)`;
    };

    window.addEventListener('scroll', updateHeroParallax, { passive: true });
    updateHeroParallax();

    /* ========================================================
       6. GSAP FLIP: SEÇÃO POETAS ANIMADA (Velocidade Otimizada)
       ======================================================== */
    if (typeof gsap === "undefined" || typeof Flip === "undefined") {
        console.warn("GSAP/Flip ausentes. Verifique a importação na index.");
        return;
    }

    gsap.registerPlugin(Flip);

    const listContainer = document.querySelector('.poetas-list');
    const listItems = gsap.utils.toArray('.poeta-list-item');
    if (!listContainer || !listItems.length) return;

    let activeItem = null;

    const getExtraContent = (item) => item ? item.querySelector('.poeta-additional-content') : null;

    const hideExtraContent = (content, callback) => {
        if (!content) {
            if (callback) callback();
            return;
        }
        // ALTERADO: Duração de fechamento de 0.14 para 0.1 (Mais rápido)
        gsap.to(content, {
            opacity: 0, y: 10, duration: 0.1, ease: 'power2.out',
            onComplete: () => {
                content.style.display = 'none';
                content.style.visibility = 'hidden';
                if (callback) callback();
            }
        });
    };

    const showExtraContent = (content) => {
        if (!content) return;
        content.style.display = 'block';
        content.style.visibility = 'hidden';
        content.style.opacity = '0';
        
        // ALTERADO: Duração de abertura e delay reduzidos
        gsap.fromTo(
            content,
            { opacity: 0, y: 10, visibility: 'hidden' },
            { opacity: 1, y: 0, visibility: 'visible', duration: 0.15, ease: 'power1.out', delay: 0.02 }
        );
    };

    listItems.forEach((item) => {
        item.addEventListener('click', (e) => {
            // Ignora o clique se for dentro de um link (Instagram) ou botão
            if (e.target.closest('a') || e.target.closest('button')) return;

            const wasExpanded = item.classList.contains('expanded');
            const state = Flip.getState([listContainer, ...listItems]);

            if (activeItem && activeItem !== item) {
                const previousContent = getExtraContent(activeItem);
                activeItem.classList.remove('expanded');
                hideExtraContent(previousContent);
            }

            if (wasExpanded) {
                item.classList.remove('expanded');
                activeItem = null;
                hideExtraContent(getExtraContent(item));
            } else {
                item.classList.add('expanded');
                activeItem = item;
                showExtraContent(getExtraContent(item));
            }

            // ALTERADO: Duração do GSAP Flip de 0.35 para 0.20 (Transição de layout mais snappy)
            Flip.from(state, {
                duration: 0.20,
                ease: 'power1.inOut',
                absolute: false,
                nested: true
            });
        });
    });
});