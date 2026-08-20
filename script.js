/* ========================================
   NYX PORTFOLIO
======================================== */


/* ========================================
   SUPABASE
======================================== */

const SUPABASE_URL =
    "https://ybmcroqgqlzxgnrvxebm.supabase.co";


const SUPABASE_KEY =
    "sb_publishable_fJ10fiAm2QX3rokEVW7_zw_GiMwOLz6";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* ========================================
   DOM READY
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {


/* ========================================
   VIEW COUNTER
======================================== */

const viewCountElement =
    document.getElementById("view-count");


const VIEW_COOLDOWN =
    15 * 60 * 1000; // 15 minutes


const VIEW_STORAGE_KEY =
    "nyx-last-view";


/* ========================================
   GET CURRENT VIEW COUNT
======================================== */

async function getViewCount() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("page_views")
                .select("views")
                .eq("id", 1)
                .single();


        if (error) {

            console.error(
                "Erreur récupération compteur :",
                error
            );

            return null;

        }


        return Number(data.views);

    } catch (error) {

        console.error(
            "Impossible de récupérer le compteur :",
            error
        );

        return null;

    }

}


/* ========================================
   UPDATE VIEW COUNTER
======================================== */

async function updateViewCounter() {

    if (!viewCountElement) {
        return;
    }


    try {

        const now =
            Date.now();


        const lastView =
            localStorage.getItem(
                VIEW_STORAGE_KEY
            );


        const cooldownActive =
            lastView &&
            now - Number(lastView) <
            VIEW_COOLDOWN;


        /* ========================================
           COUNT NEW VIEW
        ======================================== */

        if (!cooldownActive) {

            const {
                data,
                error
            } =
                await supabaseClient
                    .rpc(
                        "increment_page_views"
                    );


            if (error) {

                console.error(
                    "Erreur compteur de vues :",
                    error
                );

            } else {

                /*
                 * La vue a bien été comptée.
                 */

                localStorage.setItem(
                    VIEW_STORAGE_KEY,
                    String(now)
                );


                /*
                 * Affiche directement le
                 * nouveau nombre retourné.
                 */

                viewCountElement.textContent =
                    Number(data).toLocaleString(
                        "fr-FR"
                    );


                return;

            }

        }


        /* ========================================
           GET CURRENT COUNT
        ======================================== */

        const currentCount =
            await getViewCount();


        if (currentCount !== null) {

            viewCountElement.textContent =
                currentCount.toLocaleString(
                    "fr-FR"
                );

        } else {

            viewCountElement.textContent =
                "—";

        }


        if (cooldownActive) {

            console.log(
                "Vue non comptée : cooldown de 15 minutes actif."
            );

        }


    } catch (error) {

        console.error(
            "Erreur compteur de vues :",
            error
        );

        viewCountElement.textContent =
            "—";

    }

}


updateViewCounter();

        /* ========================================
           PARTICLE SYSTEM
        ======================================== */

        const canvas =
            document.getElementById(
                "particle-canvas"
            );


        if (!canvas) {
            return;
        }


        const ctx =
            canvas.getContext("2d");


        let particles = [];


        let mouse = {

            x: null,

            y: null,

            radius: 180

        };


        let particlesEnabled = true;


        function resizeCanvas() {

            canvas.width =
                window.innerWidth;

            canvas.height =
                window.innerHeight;


            createParticles();

        }


        function createParticles() {

            particles = [];


            const amount =
                Math.min(
                    110,
                    Math.floor(
                        (
                            window.innerWidth *
                            window.innerHeight
                        ) / 14000
                    )
                );


            for (
                let i = 0;
                i < amount;
                i++
            ) {

                particles.push({

                    x:
                        Math.random() *
                        canvas.width,

                    y:
                        Math.random() *
                        canvas.height,

                    size:
                        Math.random() *
                        1.8 + 0.5,

                    speedX:
                        (
                            Math.random() -
                            0.5
                        ) * 0.25,

                    speedY:
                        (
                            Math.random() -
                            0.5
                        ) * 0.25,

                    opacity:
                        Math.random() *
                        0.5 + 0.15

                });

            }

        }


        function drawParticles() {

            if (!particlesEnabled) {

                requestAnimationFrame(
                    drawParticles
                );

                return;

            }


            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );


            const styles =
                getComputedStyle(
                    document.documentElement
                );


            const accentRGB =
                styles
                    .getPropertyValue(
                        "--accent-rgb"
                    )
                    .trim();


            particles.forEach(
                (particle) => {

                    particle.x +=
                        particle.speedX;

                    particle.y +=
                        particle.speedY;


                    /* Screen wrapping */

                    if (
                        particle.x < -20
                    ) {

                        particle.x =
                            canvas.width + 20;

                    }


                    if (
                        particle.x >
                        canvas.width + 20
                    ) {

                        particle.x = -20;

                    }


                    if (
                        particle.y < -20
                    ) {

                        particle.y =
                            canvas.height + 20;

                    }


                    if (
                        particle.y >
                        canvas.height + 20
                    ) {

                        particle.y = -20;

                    }


                    /* Mouse interaction */

                    if (
                        mouse.x !== null &&
                        mouse.y !== null
                    ) {

                        const dx =
                            mouse.x -
                            particle.x;


                        const dy =
                            mouse.y -
                            particle.y;


                        const distance =
                            Math.sqrt(
                                dx * dx +
                                dy * dy
                            );


                        if (
                            distance <
                            mouse.radius &&
                            distance > 0
                        ) {

                            const force =
                                (
                                    mouse.radius -
                                    distance
                                ) /
                                mouse.radius;


                            particle.x -=
                                (
                                    dx /
                                    distance
                                ) *
                                force *
                                0.7;


                            particle.y -=
                                (
                                    dy /
                                    distance
                                ) *
                                force *
                                0.7;

                        }

                    }


                    /* Particle */

                    ctx.beginPath();


                    ctx.arc(
                        particle.x,
                        particle.y,
                        particle.size,
                        0,
                        Math.PI * 2
                    );


                    ctx.fillStyle =
                        `rgba(${accentRGB}, ${particle.opacity})`;


                    ctx.fill();

                }
            );


            /* ========================================
               PARTICLE CONNECTIONS
            ======================================== */

            for (
                let i = 0;
                i < particles.length;
                i++
            ) {

                for (
                    let j = i + 1;
                    j < particles.length;
                    j++
                ) {

                    const dx =
                        particles[i].x -
                        particles[j].x;


                    const dy =
                        particles[i].y -
                        particles[j].y;


                    const distance =
                        Math.sqrt(
                            dx * dx +
                            dy * dy
                        );


                    if (
                        distance < 115
                    ) {

                        const opacity =
                            (
                                1 -
                                distance / 115
                            ) * 0.12;


                        ctx.beginPath();


                        ctx.moveTo(
                            particles[i].x,
                            particles[i].y
                        );


                        ctx.lineTo(
                            particles[j].x,
                            particles[j].y
                        );


                        ctx.strokeStyle =
                            `rgba(${accentRGB}, ${opacity})`;


                        ctx.lineWidth =
                            0.6;


                        ctx.stroke();

                    }

                }

            }


            /* ========================================
               MOUSE CONNECTIONS
            ======================================== */

            if (
                mouse.x !== null &&
                mouse.y !== null
            ) {

                particles.forEach(
                    (particle) => {

                        const dx =
                            mouse.x -
                            particle.x;


                        const dy =
                            mouse.y -
                            particle.y;


                        const distance =
                            Math.sqrt(
                                dx * dx +
                                dy * dy
                            );


                        if (
                            distance <
                            mouse.radius
                        ) {

                            const opacity =
                                (
                                    1 -
                                    distance /
                                    mouse.radius
                                ) * 0.35;


                            ctx.beginPath();


                            ctx.moveTo(
                                mouse.x,
                                mouse.y
                            );


                            ctx.lineTo(
                                particle.x,
                                particle.y
                            );


                            ctx.strokeStyle =
                                `rgba(${accentRGB}, ${opacity})`;


                            ctx.lineWidth =
                                0.8;


                            ctx.stroke();

                        }

                    }
                );


                /* Mouse glow */

                const gradient =
                    ctx.createRadialGradient(
                        mouse.x,
                        mouse.y,
                        0,
                        mouse.x,
                        mouse.y,
                        100
                    );


                gradient.addColorStop(
                    0,
                    `rgba(${accentRGB}, 0.10)`
                );


                gradient.addColorStop(
                    1,
                    `rgba(${accentRGB}, 0)`
                );


                ctx.beginPath();


                ctx.arc(
                    mouse.x,
                    mouse.y,
                    100,
                    0,
                    Math.PI * 2
                );


                ctx.fillStyle =
                    gradient;


                ctx.fill();

            }


            requestAnimationFrame(
                drawParticles
            );

        }


        /* ========================================
           MOUSE TRACKING
        ======================================== */

        window.addEventListener(
            "mousemove",
            (event) => {

                mouse.x =
                    event.clientX;

                mouse.y =
                    event.clientY;

            }
        );


        window.addEventListener(
            "mouseleave",
            () => {

                mouse.x = null;

                mouse.y = null;

            }
        );


        window.addEventListener(
            "resize",
            resizeCanvas
        );


        resizeCanvas();

        drawParticles();


        /* ========================================
           PARTICLE TOGGLE
        ======================================== */

        const particleToggle =
            document.getElementById(
                "particle-toggle"
            );


        const savedParticleState =
            localStorage.getItem(
                "nyx-particles"
            );


        if (
            savedParticleState ===
            "false"
        ) {

            particlesEnabled =
                false;


            if (particleToggle) {

                particleToggle.classList.remove(
                    "active"
                );


                particleToggle.setAttribute(
                    "aria-pressed",
                    "false"
                );

            }


            canvas.classList.add(
                "disabled"
            );

        }


        if (particleToggle) {

            particleToggle.addEventListener(
                "click",
                () => {

                    particlesEnabled =
                        !particlesEnabled;


                    particleToggle.classList.toggle(
                        "active",
                        particlesEnabled
                    );


                    particleToggle.setAttribute(
                        "aria-pressed",
                        String(
                            particlesEnabled
                        )
                    );


                    canvas.classList.toggle(
                        "disabled",
                        !particlesEnabled
                    );


                    localStorage.setItem(
                        "nyx-particles",
                        String(
                            particlesEnabled
                        )
                    );

                }
            );

        }


        /* ========================================
           HERO PARALLAX
        ======================================== */

        const hero =
            document.querySelector(
                ".hero"
            );


        const orbOne =
            document.querySelector(
                ".orb-one"
            );


        const orbTwo =
            document.querySelector(
                ".orb-two"
            );


        if (
            hero &&
            orbOne &&
            orbTwo
        ) {

            hero.addEventListener(
                "mousemove",
                (event) => {

                    const rect =
                        hero.getBoundingClientRect();


                    const mouseX =
                        event.clientX -
                        rect.left;


                    const mouseY =
                        event.clientY -
                        rect.top;


                    const centerX =
                        rect.width / 2;


                    const centerY =
                        rect.height / 2;


                    const moveX =
                        (
                            mouseX -
                            centerX
                        ) / 40;


                    const moveY =
                        (
                            mouseY -
                            centerY
                        ) / 40;


                    orbOne.style.transform =
                        `translate(${moveX}px, ${moveY}px)`;


                    orbTwo.style.transform =
                        `translate(${-moveX}px, ${-moveY}px)`;

                }
            );


            hero.addEventListener(
                "mouseleave",
                () => {

                    orbOne.style.transform =
                        "translate(0, 0)";


                    orbTwo.style.transform =
                        "translate(0, 0)";

                }
            );

        }


        /* ========================================
           SCROLL ANIMATIONS
        ======================================== */

        const animatedElements =
            document.querySelectorAll(
                ".about-card, .skill-card, .project-card, .social-link"
            );


        if (
            "IntersectionObserver"
            in window
        ) {

            const observer =
                new IntersectionObserver(
                    (entries) => {

                        entries.forEach(
                            (entry) => {

                                if (
                                    entry.isIntersecting
                                ) {

                                    entry.target.classList.add(
                                        "visible"
                                    );


                                    observer.unobserve(
                                        entry.target
                                    );

                                }

                            }
                        );

                    },
                    {
                        threshold: 0.15
                    }
                );


            animatedElements.forEach(
                (element) => {

                    element.classList.add(
                        "animate-on-scroll"
                    );


                    observer.observe(
                        element
                    );

                }
            );

        }


        /* ========================================
           DISCORD COPY
        ======================================== */

        const copyButtons =
            document.querySelectorAll(
                ".copy-button"
            );


        copyButtons.forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    async () => {

                        const text =
                            button.dataset.copy;


                        if (!text) {
                            return;
                        }


                        try {

                            await navigator.clipboard.writeText(
                                text
                            );


                            const originalText =
                                button.textContent;


                            button.textContent =
                                "Copié ✓";


                            button.classList.add(
                                "copied"
                            );


                            setTimeout(
                                () => {

                                    button.textContent =
                                        originalText;


                                    button.classList.remove(
                                        "copied"
                                    );

                                },
                                2000
                            );


                        } catch (error) {

                            console.error(
                                "Impossible de copier :",
                                error
                            );

                        }

                    }
                );

            }
        );


        /* ========================================
           THEME SYSTEM
        ======================================== */

        const themeButtons =
            document.querySelectorAll(
                ".theme-button"
            );


        const themes = {

            purple: {

                accent:
                    "#9c7cff",

                secondary:
                    "#45caff",

                accentRGB:
                    "156, 124, 255",

                secondaryRGB:
                    "69, 202, 255"

            },


            blue: {

                accent:
                    "#00aaff",

                secondary:
                    "#00e5ff",

                accentRGB:
                    "0, 170, 255",

                secondaryRGB:
                    "0, 229, 255"

            },


            green: {

                accent:
                    "#00c853",

                secondary:
                    "#7cffb2",

                accentRGB:
                    "0, 200, 83",

                secondaryRGB:
                    "124, 255, 178"

            },


            red: {

                accent:
                    "#ff3d71",

                secondary:
                    "#ff9a44",

                accentRGB:
                    "255, 61, 113",

                secondaryRGB:
                    "255, 154, 68"

            },


            pink: {

                accent:
                    "#ff5fd2",

                secondary:
                    "#a66cff",

                accentRGB:
                    "255, 95, 210",

                secondaryRGB:
                    "166, 108, 255"

            }

        };


        function setTheme(
            themeName
        ) {

            const theme =
                themes[themeName];


            if (!theme) {
                return;
            }


            const root =
                document.documentElement;


            root.style.setProperty(
                "--accent",
                theme.accent
            );


            root.style.setProperty(
                "--accent-secondary",
                theme.secondary
            );


            root.style.setProperty(
                "--accent-rgb",
                theme.accentRGB
            );


            root.style.setProperty(
                "--secondary-rgb",
                theme.secondaryRGB
            );


            themeButtons.forEach(
                (button) => {

                    button.classList.toggle(
                        "active",
                        button.dataset.theme ===
                        themeName
                    );

                }
            );


            localStorage.setItem(
                "nyx-theme",
                themeName
            );

        }


        themeButtons.forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        setTheme(
                            button.dataset.theme
                        );

                    }
                );

            }
        );


        /* ========================================
           LOAD SAVED THEME
        ======================================== */

        const savedTheme =
            localStorage.getItem(
                "nyx-theme"
            );


        if (
            savedTheme &&
            themes[savedTheme]
        ) {

            setTheme(
                savedTheme
            );

        }


        /* ========================================
           CONSOLE
        ======================================== */

        console.log(
            "%cNyx Portfolio",
            "color: #9c7cff; font-size: 20px; font-weight: bold;"
        );


        console.log(
            "Welcome to Nyx's portfolio."
        );


    }
);