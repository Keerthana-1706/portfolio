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

    // --- Contact Modal Logic ---
    const contactModal = document.getElementById('contactModal');
    const sayHelloBtn = document.getElementById('sayHelloBtn');
    const closeModalBtn = document.querySelector('.close-modal');
    const contactForm = document.getElementById('contactForm');

    // Open Modal
    if (sayHelloBtn && contactModal) {
        sayHelloBtn.addEventListener('click', () => {
            contactModal.classList.add('show');
        });
    }

    // Close Modal via 'X' Button
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            contactModal.classList.remove('show');
        });
    }

    // Close Modal via clicking outside the content window
    window.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            contactModal.classList.remove('show');
        }
    });

    // Form submission handle
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('submitBtn');
            const formStatus = document.getElementById('formStatus');

            // Set loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.style.opacity = '0.7';
            formStatus.className = 'form-status';
            formStatus.style.display = 'none';

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, message })
                });

                if (response.ok) {
                    formStatus.textContent = 'Message sent successfully! I will get back to you soon.';
                    formStatus.className = 'form-status status-success';
                    contactForm.reset();
                } else {
                    formStatus.textContent = 'Something went wrong. Please try again.';
                    formStatus.className = 'form-status status-error';
                }
            } catch (error) {
                formStatus.textContent = 'Network error. Could not send message.';
                formStatus.className = 'form-status status-error';
            } finally {
                // Restore button state
                submitBtn.textContent = 'Send Message';
                submitBtn.style.opacity = '1';
                formStatus.style.display = 'block';
            }
        });
    }
});
const form = document.getElementById("contactForm");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    try {
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, message }),
        });

        const result = await response.json();

        if (response.ok) {
            alert("Message sent successfully! 🚀");
            form.reset();
        } else {
            alert("Something went wrong. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Server error. Please try again later.");
    }
});
