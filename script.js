document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinksContainer = document.getElementById('nav-links');
    const navLinks = document.querySelectorAll('.nav-item');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('open');
        navLinksContainer.classList.toggle('active');
        document.body.classList.toggle('blur-bg');
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('open');
            navLinksContainer.classList.remove('active');
            document.body.classList.remove('blur-bg');
        });
    });


    // --- Scroll Spy (Highlight active section) ---
    const sections = document.querySelectorAll('section');

    // Options for Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -68% 0px', // Trigger highlight when section reaches ~30% from top
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get the ID of the intersecting section
                const currentId = entry.target.getAttribute('id');

                // Remove active class from all nav links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -15% 0px',
        threshold: 0.1
    };

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only reveal once
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Smooth Scrolling for Desktop/Mobile links ---
    // (CSS handles the smooth scroll natively via scroll-behavior: smooth)
    // We only need to adjust scroll padding top if on mobile navbar

    const setScrollPadding = () => {
        const navbar = document.getElementById('navbar');
        // Only apply scroll padding if navbar is not taking full height (mobile topnav mode)
        if (window.innerWidth <= 768) {
            document.documentElement.style.scrollPaddingTop = `${navbar.offsetHeight}px`;
        } else {
            document.documentElement.style.scrollPaddingTop = '0px';
        }
    };

    // Initial setting
    setScrollPadding();

    // Update on resize
    window.addEventListener('resize', setScrollPadding);

    // --- Sidebar Visibility Toggle ---
    const navbarElement = document.getElementById('navbar');
    const mainContentElement = document.querySelector('.main-content');

    const toggleSidebarOnScroll = () => {
        // Show sidebar when scrolled past ~80% of viewport height (i.e. near bottom of hero)
        if (window.scrollY > window.innerHeight * 0.8) {
            navbarElement.classList.add('sidebar-visible');
            mainContentElement.classList.add('sidebar-visible');
        } else {
            navbarElement.classList.remove('sidebar-visible');
            mainContentElement.classList.remove('sidebar-visible');
        }
    };

    window.addEventListener('scroll', toggleSidebarOnScroll);
    toggleSidebarOnScroll(); // init on load
});
