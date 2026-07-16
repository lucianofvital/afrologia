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
    const heroSection =
        document.getElementById('cp-home') ||
        document.getElementById('integrante-hero-track') ||
        document.querySelector('.integrante-page .integrante-hero');

    const updateHeaderState = () => {
        const scrollTop = window.scrollY;
        const heroHeight = heroSection
            ? (heroSection.offsetHeight || heroSection.getBoundingClientRect().height || 0)
            : 0;
        const threshold = Math.max(120, heroHeight - 80);

        // Adiciona classe site-scrolled ao body apenas quando a rolagem passa da altura do hero da página atual
        document.body.classList.toggle('site-scrolled', scrollTop > threshold);
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



/* ============================================================
   ANIMAÇÃO HERO DO INTEGRANTE (ScrollTrigger)
   ============================================================ */
document.addEventListener("DOMContentLoaded", function() {
    const heroTrack = document.querySelector("#integrante-hero-track, #integrante-hero-anim");
    const heroScrollIcon = heroTrack ? heroTrack.querySelector('.integrante-hero .scroll-icon') : null;

    // Verifica se a seção existe na página atual antes de rodar o GSAP
    if (heroTrack && typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        let tlIntegrante = gsap.timeline({
            scrollTrigger: {
                trigger: heroTrack,
                pin: true,
                start: '50% 50%',
                end: '+=300px',
                scrub: 1,
                snap: {
                    snapTo: 'labels',
                    duration: { min: 0.1, max: 0.5 },
                    delay: 0,
                    ease: 'linear'
                }
            }
        });

        tlIntegrante.to(heroTrack, {
            scale: 0.92,
            borderBottomRightRadius: "2.5em",
            borderBottomLeftRadius: "2.5em",
            borderTopRightRadius: "2.5em",
            borderTopLeftRadius: "2.5em",
            duration: 1.5
        }, 0)
        .to(heroScrollIcon, {
            rotate: 180,
            duration: 0.2
        }, 0)
        .to(heroTrack, {
            boxShadow: '0 0px 0px rgba(0,0,0,0.30), 0 0px 0px rgba(0,0,0,0.22)',
            duration: 2,
            ease: 'linear'
        }, 0);
    }
});





/* ============================================================
   LÓGICA SEÇÃO DE LIVROS AFROLOGIA (GSAP)
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.querySelector(".afro-obras-wrapper");
  if (!wrapper || typeof gsap === "undefined") return;

  let activeBookIndex = 3; 
  let activeBookTimeline = null;
  const books = wrapper.querySelectorAll(".books__item");
  const bookTimelines = [];
  const descriptions = wrapper.querySelectorAll(".book-description");

  // Configura GSAP
  books.forEach((book, index) => {
    const hitbox = book.querySelector(".books__hitbox");
    const bookImage = book.querySelector(".books__image");
    const bookEffect = book.querySelector(".books__effect");
    const pages = book.querySelectorAll(".books__page");
    const bookLight = book.querySelector(".books__light");
    const bookShadow = wrapper.querySelectorAll(".book-shadow__item")[index];

    gsap.set(bookImage, { boxShadow: "var(--book-shadow) 10px 5px 20px, var(--book-shadow) 20px 0px 30px" });
    gsap.set(bookLight, { opacity: 0.1 });
    gsap.set(pages, { x: 0 });

    const hoverIn = gsap.timeline({ paused: true, defaults: { duration: 0.6, ease: "power3.out" } });

    hoverIn.to(bookImage, {
      translateX: -12,
      scaleX: 0.95,
      boxShadow: "var(--book-shadow-strong) 25px 10px 25px, var(--book-shadow) 35px 0px 35px"
    }, 0);

    if(bookShadow) hoverIn.to(bookShadow, { width: 140, opacity: 0.8 }, 0);
    hoverIn.to(bookEffect, { marginLeft: 10 }, 0);
    hoverIn.to(bookLight, { opacity: 0.25 }, 0);

    if (pages.length) {
      hoverIn.to(pages[0], { x: "3px", ease: "power2.inOut" }, 0);
      hoverIn.to(pages[1], { x: "0px", ease: "power2.inOut" }, 0);
      hoverIn.to(pages[2], { x: "-3px", ease: "power2.inOut" }, 0);
    }

    bookTimelines[index] = hoverIn;

    // Desktop: interação via Mouse Enter
    hitbox.addEventListener("mouseenter", () => {
      if (window.innerWidth > 800) activateBook(index);
    });
  });

  // Inicializa SplitType 
  descriptions.forEach((desc) => {
    const titleElement = desc.querySelector("h3");
    const authorElement = desc.querySelector(".author");
    const textElement = desc.querySelector(".lines-animation p");

    if (typeof SplitType !== "undefined") {
      new SplitType(titleElement, { types: "lines", lineClass: "line" });
      new SplitType(authorElement, { types: "lines", lineClass: "line" });
      new SplitType(textElement, { types: "lines", lineClass: "line" });
      
      desc.querySelectorAll(".line").forEach(line => {
        line.innerHTML = `<span class="line-inner">${line.innerHTML}</span>`;
      });
    }

    // Configuração inicial CSS
    if (desc.getAttribute("data-book-index") !== "3") {
      gsap.set(desc.querySelectorAll(".line-inner"), { yPercent: 100, opacity: 0 });
      gsap.set(desc.querySelector(".btn-minimal-buy"), { y: 15, opacity: 0 });
    } else {
      gsap.set(desc.querySelectorAll(".line-inner"), { yPercent: 0, opacity: 1 });
      gsap.set(desc.querySelector(".btn-minimal-buy"), { y: 0, opacity: 1 });
    }
  });

  function updateDescription(indexStr) {
    descriptions.forEach((desc) => {
      const descIndex = desc.getAttribute("data-book-index");
      if (descIndex !== indexStr && desc.classList.contains("active")) {
        desc.classList.remove("active");
        gsap.to(desc.querySelectorAll(".line-inner"), { yPercent: 100, opacity: 0, duration: 0.3, stagger: 0.02 });
        gsap.to(desc.querySelector(".btn-minimal-buy"), { y: 15, opacity: 0, duration: 0.3 });
      }
    });

    const activeDesc = wrapper.querySelector(`.book-description[data-book-index="${indexStr}"]`);
    if (activeDesc) {
      activeDesc.classList.add("active");
      gsap.fromTo(activeDesc.querySelectorAll(".line-inner"),
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: "power2.out", delay: 0.1 }
      );
      gsap.fromTo(activeDesc.querySelector(".btn-minimal-buy"),
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.3 }
      );
    }
  }

  function activateBook(index) {
    if (activeBookIndex !== null && activeBookIndex !== index && activeBookTimeline) {
      activeBookTimeline.reverse();
    }
    activeBookIndex = index;
    activeBookTimeline = bookTimelines[index];
    bookTimelines[index].play();
    updateDescription(index.toString());
  }

  // Volta pro livro default ao sair (apenas no desktop)
  wrapper.querySelector(".shelf-container").addEventListener("mouseleave", () => {
    if (window.innerWidth > 800) activateBook(3);
  });

  // O PULO DO GATO NO MOBILE: 
  // Intersection Observer detecta qual livro está no centro do scroll
  if (window.innerWidth <= 800 && typeof IntersectionObserver !== "undefined") {
    const shelfContainer = wrapper.querySelector(".shelf-container");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const indexStr = entry.target.querySelector('.books__hitbox').dataset.bookIndex;
          activateBook(parseInt(indexStr));
        }
      });
    }, { 
      root: shelfContainer, 
      threshold: 0.7 // O livro precisa estar 70% visível para ativar
    });

    books.forEach(book => observer.observe(book));
  } else {
    // Inicia o livro padrão no desktop
    activateBook(3); 
  }
});