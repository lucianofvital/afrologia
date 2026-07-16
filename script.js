/* ============================================================
   PRELOADER - TELA DE CARREGAMENTO INICIAL
   ============================================================ */
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
        // Adiciona a classe que faz o fade-out do preloader
        document.body.classList.add('loaded');
    }, 1200); // 1200 ms = 1.2 segundos
});



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





/* ============================================================
   7. AFROLOGIA ZINE
   GSAP DRAGGABLE + ROTATE Y
   MOBILE FIRST
   ============================================================ */

(function initAfroZine() {

    const zineCard = document.querySelector("#afro-zine-card");
    const zineTrigger = document.querySelector("#afro-zine-trigger");
    const zineHint = document.querySelector("#afro-zine-hint");

    if (!zineCard || !zineTrigger) return;

    if (typeof gsap === "undefined") {

        console.warn(
            "GSAP não encontrado. O Zine Afrologia não foi inicializado."
        );

        return;

    }


    /* ========================================================
       CONFIGURAÇÕES
    ======================================================== */

    const proxy = document.createElement("div");

    const setRotateY =
        gsap.quickSetter(
            zineCard,
            "rotationY",
            "deg"
        );


    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    const coarsePointer =
        window.matchMedia(
            "(pointer: coarse)"
        );


    let pixelsPerDegree = 1;

    let maxRotation = 180;

    let currentRotation = 0;

    let gestureState = null;


    /* ========================================================
       CONFIGURAÇÃO INICIAL
    ======================================================== */

    gsap.set(zineCard, {

        rotationY: 0,

        transformStyle: "preserve-3d",

        transformOrigin: "50% 50%",

        force3D: true

    });


    gsap.set(proxy, {

        x: 0

    });


    /* ========================================================
       RESPONSIVIDADE
    ======================================================== */

    function calculateResponsiveValues() {

        const cardWidth =
            zineTrigger.getBoundingClientRect().width || 300;


        pixelsPerDegree =
            cardWidth / 240;


        maxRotation = 180;

    }


    function rotationToX(rotation) {

        return rotation * pixelsPerDegree;

    }


    function xToRotation(x) {

        return x / pixelsPerDegree;

    }


    function getBounds() {

        return {

            minX:
                rotationToX(-maxRotation),

            maxX:
                rotationToX(maxRotation)

        };

    }


    /* ========================================================
       RENDER DA ROTAÇÃO
    ======================================================== */

    function renderRotation() {

        currentRotation =
            xToRotation(
                gsap.getProperty(proxy, "x")
            );


        setRotateY(currentRotation);


        if (
            zineHint &&
            Math.abs(currentRotation) > 12
        ) {

            gsap.to(
                zineHint,
                {

                    opacity: 0,

                    scale: .9,

                    duration: .35,

                    ease: "power2.out",

                    overwrite: true

                }

            );

        }

    }


    function animateToFace(targetRotation, velocityX = 0) {

        const targetX =
            rotationToX(targetRotation);


        const currentX =
            gsap.getProperty(proxy, "x");


        const distance =
            Math.abs(targetX - currentX);


        const normalizedVelocity =
            Math.min(
                Math.abs(velocityX),
                2200
            );


        const duration =
            prefersReducedMotion.matches
                ? 0.25
                : Math.min(
                    0.8,
                    0.24 + distance / 1600 + normalizedVelocity / 6000
                );


        gsap.killTweensOf(proxy);


        gsap.to(
            proxy,
            {
                x: targetX,
                duration,
                ease: "power3.out",
                onUpdate: renderRotation,
                onComplete: renderRotation
            }
        );

    }


    function rotateToNextFace(direction) {

        const current =
            currentRotationValue();


        let targetRotation;


        if (direction > 0) {

            targetRotation =
                Math.ceil(
                    (current + 1) / 180
                ) * 180;

        } else {

            targetRotation =
                Math.floor(
                    (current - 1) / 180
                ) * 180;

        }


        targetRotation =
            gsap.utils.clamp(
                -180,
                180,
                targetRotation
            );


        animateToFace(targetRotation, direction * 1200);

    }


    function currentRotationValue() {

        return xToRotation(
            gsap.getProperty(proxy, "x")
        );

    }


    function snapToNearestFace() {

        const rotation =
            currentRotationValue();


        const nearestFace =
            Math.round(
                rotation / 180
            ) * 180;


        const targetX =
            rotationToX(nearestFace);


        gsap.killTweensOf(proxy);


        gsap.to(
            proxy,
            {
                x: targetX,
                duration: 0.45,
                ease: "power2.out",
                onUpdate: renderRotation,
                onComplete: renderRotation
            }
        );

    }


    function beginGesture(event) {

        if (event.pointerType === "mouse" && event.button !== 0) {
            return;
        }


        gestureState = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            lastX: event.clientX,
            lastY: event.clientY,
            lastTime: performance.now(),
            baseX: gsap.getProperty(proxy, "x"),
            locked: false,
            pointerType: event.pointerType
        };


        zineTrigger.setPointerCapture?.(event.pointerId);

        zineTrigger.classList.add("is-dragging");

    }


    function updateGesture(event) {

        if (!gestureState || gestureState.pointerId !== event.pointerId) {
            return;
        }

        const now = performance.now();
        const elapsed = Math.max(16, now - gestureState.lastTime);

        const deltaX = event.clientX - gestureState.startX;
        const deltaY = event.clientY - gestureState.startY;

        const rawVelocityX = (event.clientX - gestureState.lastX) / elapsed * 1000;

        const velocityX =
            gestureState.lastVelocityX !== undefined
                ? (rawVelocityX * 0.6) + (gestureState.lastVelocityX * 0.4)
                : rawVelocityX;


        if (!gestureState.locked) {
            const horizontalDistance = Math.abs(deltaX);
            const verticalDistance = Math.abs(deltaY);

            if (verticalDistance > 10 && verticalDistance > horizontalDistance * 1.1) {
                return;
            }

            if (horizontalDistance > 8 && horizontalDistance > verticalDistance * 1.1) {
                gestureState.locked = true;
                event.preventDefault?.();
            }
        }


        if (!gestureState.locked) {
            return;
        }


        const nextX =
            gsap.utils.clamp(
                getBounds().minX,
                getBounds().maxX,
                gestureState.baseX + deltaX
            );


        gsap.set(proxy, { x: nextX });
        renderRotation();


        gestureState.lastX = event.clientX;
        gestureState.lastY = event.clientY;
        gestureState.lastTime = now;
        gestureState.lastVelocityX = velocityX;

    }


    function endGesture(event) {

        if (!gestureState || gestureState.pointerId !== event.pointerId) {
            return;
        }

        const deltaX = event.clientX - gestureState.startX;
        const velocityX =
            gestureState.lastVelocityX !== undefined
                ? gestureState.lastVelocityX
                : 0;

        const releaseDirection =
            deltaX > 0 ? 1 : -1;


        const shouldComplete =
            Math.abs(deltaX) > 70 ||
            Math.abs(velocityX) > 650;


        if (gestureState.locked && shouldComplete) {
            rotateToNextFace(releaseDirection);
        } else {
            snapToNearestFace();
        }


        zineTrigger.releasePointerCapture?.(event.pointerId);
        zineTrigger.classList.remove("is-dragging");
        gestureState = null;

    }


    zineTrigger.addEventListener("pointerdown", beginGesture);
    zineTrigger.addEventListener("pointermove", updateGesture);
    zineTrigger.addEventListener("pointerup", endGesture);
    zineTrigger.addEventListener("pointercancel", endGesture);
    zineTrigger.addEventListener("pointerleave", (event) => {
        if (gestureState && gestureState.pointerId === event.pointerId) {
            endGesture(event);
        }
    });


    /* ========================================================
       RESIZE
    ======================================================== */

    function rebuildForLayout() {

        const previousRotation =
            currentRotation;


        calculateResponsiveValues();


        currentRotation =
            gsap.utils.clamp(

                -maxRotation,

                maxRotation,

                previousRotation

            );


        gsap.set(

            proxy,

            {

                x:
                    rotationToX(
                        currentRotation
                    )

            }

        );


        renderRotation();

    }


    /* ========================================================
       INICIALIZAÇÃO
    ======================================================== */

    calculateResponsiveValues();

    renderRotation();


    /* ========================================================
       RESIZE DEBOUNCED
    ======================================================== */

    let resizeTimer;


    window.addEventListener(

        "resize",

        () => {

            clearTimeout(
                resizeTimer
            );


            resizeTimer = setTimeout(

                rebuildForLayout,

                150

            );

        }

    );


    /* ========================================================
       ACESSIBILIDADE
    ======================================================== */

    prefersReducedMotion.addEventListener?.(

        "change",

        () => {
            renderRotation();
        }

    );


    coarsePointer.addEventListener?.(

        "change",

        rebuildForLayout

    );


})();




/* ============================================================
   08. ANIMAÇÕES DO FOOTER (GSAP + ScrollTrigger)
   ============================================================ */
document.addEventListener("DOMContentLoaded", function() {
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        // 1. Efeito Parallax no Fundo do Footer
        const footerBg = document.querySelector('.footer-bg-parallax');
        if (footerBg) {
            gsap.fromTo(footerBg, 
                { y: "-20%" },
                {
                    y: "10%",
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".footer-afrologia",
                        start: "top bottom", 
                        end: "bottom top",
                        scrub: true
                    }
                }
            );
        }

        // 2. Animação de Entrada (Stagger) dos Elementos
        const footerReveals = gsap.utils.toArray('.footer-reveal');
        if (footerReveals.length > 0) {
            gsap.fromTo(footerReveals, 
                { 
                    y: 40, 
                    opacity: 0 
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".footer-afrologia",
                        start: "top 85%", // Inicia quando o footer atinge 85% da tela
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }
    }
});