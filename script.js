document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('siteHeader');
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.main-nav');
    const navLinks = [...document.querySelectorAll('.nav-link')];
    const sections = [...document.querySelectorAll('main section[id]')];
    const progress = document.getElementById('scrollProgress');
    const toTop = document.getElementById('toTop');
    const year = document.getElementById('year');
    const cursorGlow = document.getElementById('cursorGlow');
    const form = document.getElementById('contactForm');
    const formNote = document.getElementById('formNote');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (year) year.textContent = new Date().getFullYear();

    const closeMenu = () => {
        nav?.classList.remove('open');
        document.body.classList.remove('menu-open');
        menuToggle?.setAttribute('aria-expanded', 'false');
        menuToggle?.setAttribute('aria-label', 'Open navigation');
        if (menuToggle) menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    };

    menuToggle?.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        document.body.classList.toggle('menu-open', open);
        menuToggle.setAttribute('aria-expanded', String(open));
        menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
        menuToggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    navLinks.forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
    });

    const updateScrollUi = () => {
        const y = window.scrollY;
        const doc = document.documentElement;
        const max = Math.max(1, doc.scrollHeight - window.innerHeight);
        const percent = Math.min(100, Math.max(0, (y / max) * 100));

        header?.classList.toggle('scrolled', y > 20);
        toTop?.classList.toggle('show', y > 550);
        if (progress) progress.style.width = `${percent}%`;

        let current = 'home';
        sections.forEach(section => {
            const top = section.offsetTop - 180;
            if (y >= top) current = section.id;
        });

        navLinks.forEach(link => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${current}`);
        });
    };

    window.addEventListener('scroll', updateScrollUi, { passive: true });
    updateScrollUi();

    toTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !reduceMotion) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        reveals.forEach(el => observer.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('visible'));
    }

    if (cursorGlow && window.matchMedia('(pointer:fine)').matches && !reduceMotion) {
        window.addEventListener('pointermove', event => {
            cursorGlow.style.left = `${event.clientX}px`;
            cursorGlow.style.top = `${event.clientY}px`;
        }, { passive: true });
    }

    form?.addEventListener('submit', event => {
        event.preventDefault();
        const data = new FormData(form);
        const name = String(data.get('name') || '').trim();
        const email = String(data.get('email') || '').trim();
        const subject = String(data.get('subject') || '').trim();
        const message = String(data.get('message') || '').trim();

        if (!name || !email || !subject || !message) return;

        const body = [
            `Hello Deep,`,
            '',
            `Name: ${name}`,
            `Email: ${email}`,
            '',
            message,
            '',
            'Sent from the Deep Singh portfolio website.'
        ].join('\n');

        const mailto = `mailto:singhg19deep@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        if (formNote) formNote.textContent = 'Opening your email client…';
        window.location.href = mailto;
    });
});
