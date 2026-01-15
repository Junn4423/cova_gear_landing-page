/**
 * ============================================
 * COVASOL GEAR - High-End Landing Page
 * Smooth Parallax, Animations & Interactions
 * ============================================
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all modules
    StickyHeader.init();
    ScrollAnimations.init();
    ParallaxEngine.init();
    MobileMenu.init();
    SmoothScroll.init();
    CursorGlow.init();

    console.log('🎧 Covasol Gear - High-End Experience Loaded');
});

/**
 * ============================================
 * STICKY HEADER MODULE
 * Smart hide/show header on scroll
 * ============================================
 */
const StickyHeader = {
    header: null,
    lastScrollY: 0,
    scrollThreshold: 100,
    isHidden: false,

    init() {
        this.header = document.getElementById('header');
        if (!this.header) return;

        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    },

    handleScroll() {
        const currentScrollY = window.scrollY;

        // Add scrolled class for background
        if (currentScrollY > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }

        // Smart hide/show based on scroll direction
        if (currentScrollY > this.scrollThreshold) {
            if (currentScrollY > this.lastScrollY && !this.isHidden) {
                this.header.style.transform = 'translateY(-100%)';
                this.isHidden = true;
            } else if (currentScrollY < this.lastScrollY && this.isHidden) {
                this.header.style.transform = 'translateY(0)';
                this.isHidden = false;
            }
        } else {
            this.header.style.transform = 'translateY(0)';
            this.isHidden = false;
        }

        this.lastScrollY = currentScrollY;
    }
};

/**
 * ============================================
 * SCROLL ANIMATIONS MODULE
 * Smooth reveal animations on scroll
 * ============================================
 */
const ScrollAnimations = {
    elements: [],
    observerOptions: {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    },

    init() {
        // Select all animated elements
        this.elements = document.querySelectorAll(
            '.reveal, .reveal-left, .reveal-right, .stagger-children'
        );

        if (this.elements.length === 0) return;

        // Use Intersection Observer for performance
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                this.handleIntersect.bind(this),
                this.observerOptions
            );

            this.elements.forEach(el => observer.observe(el));
        } else {
            // Fallback for older browsers
            this.elements.forEach(el => el.classList.add('active'));
        }
    },

    handleIntersect(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }
};

/**
 * ============================================
 * PARALLAX ENGINE
 * Smooth parallax effects for background and elements
 * ============================================
 */
const ParallaxEngine = {
    parallaxBg: null,
    cyberGrid: null,
    heroProduct: null,
    heroGlow: null,
    particles: [],
    ticking: false,

    init() {
        this.parallaxBg = document.querySelector('.parallax-bg');
        this.cyberGrid = document.querySelector('.cyber-grid');
        this.heroProduct = document.querySelector('.hero-product-image');
        this.heroGlow = document.querySelector('.hero-glow');
        this.particles = document.querySelectorAll('.particle');

        if (!this.parallaxBg) return;

        // Scroll parallax
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });

        // Mouse parallax (desktop only)
        if (window.innerWidth > 768) {
            window.addEventListener('mousemove', this.handleMouseMove.bind(this), { passive: true });
        }
    },

    handleScroll() {
        if (!this.ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const speed = 0.3;

                // Parallax background
                if (this.parallaxBg) {
                    this.parallaxBg.style.transform = `translateY(${scrollY * speed}px)`;
                }

                // Cyber grid slower movement
                if (this.cyberGrid) {
                    this.cyberGrid.style.transform = `translateY(${scrollY * 0.15}px)`;
                }

                this.ticking = false;
            });
            this.ticking = true;
        }
    },

    handleMouseMove(e) {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        const xPos = (clientX / innerWidth - 0.5) * 30;
        const yPos = (clientY / innerHeight - 0.5) * 30;

        // Product image follows mouse
        if (this.heroProduct) {
            this.heroProduct.style.transform = `translate(${xPos * 0.5}px, ${yPos * 0.5}px)`;
        }

        // Glow follows mouse
        if (this.heroGlow) {
            this.heroGlow.style.transform = `translate(${xPos * -0.3}px, ${yPos * -0.3}px)`;
        }

        // Move particles slightly
        this.particles.forEach((particle, index) => {
            const factor = (index % 3 + 1) * 0.2;
            particle.style.marginLeft = `${xPos * factor}px`;
        });
    }
};

/**
 * ============================================
 * MOBILE MENU MODULE
 * Toggle mobile navigation menu
 * ============================================
 */
const MobileMenu = {
    toggle: null,
    menu: null,
    isOpen: false,
    body: null,

    init() {
        this.toggle = document.getElementById('menuToggle');
        this.menu = document.getElementById('navMenu');
        this.body = document.body;

        if (!this.toggle || !this.menu) return;

        this.toggle.addEventListener('click', this.handleToggle.bind(this));

        // Close menu when clicking on a link
        const links = this.menu.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.menu.contains(e.target) && !this.toggle.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });

        // Close menu on window resize to desktop size
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.closeMenu();
            }
        });
    },

    handleToggle() {
        this.isOpen = !this.isOpen;
        this.menu.classList.toggle('active', this.isOpen);
        this.toggle.classList.toggle('active', this.isOpen);
        this.body.classList.toggle('menu-open', this.isOpen);
    },

    closeMenu() {
        this.isOpen = false;
        this.menu.classList.remove('active');
        this.toggle.classList.remove('active');
        this.body.classList.remove('menu-open');
    }
};

/**
 * ============================================
 * SMOOTH SCROLL MODULE
 * Smooth scrolling for anchor links
 * ============================================
 */
const SmoothScroll = {
    init() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();

                    const headerHeight = document.getElementById('header')?.offsetHeight || 80;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};

/**
 * ============================================
 * CURSOR GLOW EFFECT (Desktop only)
 * Subtle glow that follows cursor
 * ============================================
 */
const CursorGlow = {
    glow: null,

    init() {
        if (window.innerWidth <= 768) return;

        // Create glow element
        this.glow = document.createElement('div');
        this.glow.style.cssText = `
            position: fixed;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(0, 245, 255, 0.08) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s;
            opacity: 0;
        `;
        document.body.appendChild(this.glow);

        // Show glow after a delay
        setTimeout(() => {
            this.glow.style.opacity = '1';
        }, 1000);

        // Follow cursor
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                this.glow.style.left = e.clientX + 'px';
                this.glow.style.top = e.clientY + 'px';
            });
        }, { passive: true });
    }
};

/**
 * ============================================
 * MAGNETIC BUTTONS (Desktop only)
 * Buttons that attract to cursor
 * ============================================
 */
const MagneticButtons = {
    init() {
        if (window.innerWidth <= 768) return;

        const buttons = document.querySelectorAll('.btn-primary');

        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }
};

// Initialize magnetic buttons after DOM load
document.addEventListener('DOMContentLoaded', () => {
    MagneticButtons.init();
});

/**
 * ============================================
 * LOADING ANIMATION
 * Fade in content after page load
 * ============================================
 */
window.addEventListener('load', function () {
    document.body.style.opacity = '1';

    // Add loaded class for initial animations
    document.body.classList.add('loaded');
});

/**
 * ============================================
 * PERFORMANCE OPTIMIZATIONS
 * ============================================
 */

// Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.scrollBehavior = 'auto';
}

// Add will-change hints on hover for better performance
document.querySelectorAll('.feature-card, .testimonial-card, .stat-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        el.style.willChange = 'transform';
    });
    el.addEventListener('mouseleave', () => {
        el.style.willChange = 'auto';
    });
});

/**
 * ============================================
 * CONSOLE BRANDING
 * ============================================
 */
console.log('%cCovasol Gear', 'font-size: 28px; font-weight: bold; background: linear-gradient(135deg, #00f5ff, #a855f7, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
console.log('%cPremium Headphones by covasol.com.vn', 'font-size: 14px; color: #888;');
console.log('%c🎧 High-End Landing Page Experience', 'font-size: 12px; color: #00f5ff;');
