/**
 * ============================================
 * COVASOL GEAR - Main JavaScript
 * Features: Sticky Header, Scroll Animations, 
 *           Interactive Hotspots, Mobile Menu
 * ============================================
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    StickyHeader.init();
    ScrollAnimations.init();
    MobileMenu.init();
    SmoothScroll.init();
    FAQAccordion.init();
    
    console.log('🎧 Covasol Gear - Website initialized');
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
    announcementBar: null,

    init() {
        this.header = document.getElementById('header');
        this.announcementBar = document.querySelector('.announcement-bar');
        if (!this.header) return;

        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    },

    handleScroll() {
        const currentScrollY = window.scrollY;
        const announcementHeight = this.announcementBar?.offsetHeight || 40;
        
        // Add scrolled class for background and adjust position
        if (currentScrollY > announcementHeight) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }

        // Smart hide/show based on scroll direction
        if (currentScrollY > this.scrollThreshold) {
            if (currentScrollY > this.lastScrollY && !this.isHidden) {
                // Scrolling down - hide header
                this.header.classList.add('hidden');
                this.isHidden = true;
            } else if (currentScrollY < this.lastScrollY && this.isHidden) {
                // Scrolling up - show header
                this.header.classList.remove('hidden');
                this.isHidden = false;
            }
        } else {
            // Near top - always show
            this.header.classList.remove('hidden');
            this.isHidden = false;
        }

        this.lastScrollY = currentScrollY;
    }
};

/**
 * ============================================
 * SCROLL ANIMATIONS MODULE
 * Fade-in elements when they enter viewport
 * ============================================
 */
const ScrollAnimations = {
    elements: [],
    observerOptions: {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    },

    init() {
        // Select all animated elements
        this.elements = document.querySelectorAll(
            '.fade-in, .fade-in-left, .fade-in-right, .scale-in, .feature-card'
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
            this.elements.forEach(el => el.classList.add('visible'));
        }
    },

    handleIntersect(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing after animation
                observer.unobserve(entry.target);
            }
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

    init() {
        this.toggle = document.getElementById('menuToggle');
        this.menu = document.getElementById('navMenu');

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
    },

    handleToggle() {
        this.isOpen = !this.isOpen;
        this.menu.classList.toggle('active', this.isOpen);
        this.toggle.classList.toggle('active', this.isOpen);
        
        // Animate hamburger icon
        const spans = this.toggle.querySelectorAll('span');
        if (this.isOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    },

    closeMenu() {
        this.isOpen = false;
        this.menu.classList.remove('active');
        this.toggle.classList.remove('active');
        
        const spans = this.toggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
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
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                    
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
 * INTERACTIVE HOTSPOTS MODULE
 * For specs page exploded view
 * ============================================
 */
const InteractiveHotspots = {
    hotspots: [],
    activeTooltip: null,

    init() {
        this.hotspots = document.querySelectorAll('.hotspot');
        
        if (this.hotspots.length === 0) return;

        this.hotspots.forEach(hotspot => {
            // Mouse events for desktop
            hotspot.addEventListener('mouseenter', (e) => this.showTooltip(e, hotspot));
            hotspot.addEventListener('mouseleave', () => this.hideTooltip(hotspot));
            
            // Touch events for mobile
            hotspot.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.toggleTooltip(hotspot);
            });
        });

        // Close tooltip when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (this.activeTooltip && !e.target.closest('.hotspot')) {
                this.hideAllTooltips();
            }
        });

        console.log('✨ Interactive hotspots initialized');
    },

    showTooltip(e, hotspot) {
        const tooltip = hotspot.querySelector('.tooltip');
        if (tooltip) {
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
            tooltip.style.transform = 'translateX(-50%) translateY(0)';
            
            // Add glow effect to hotspot
            const dot = hotspot.querySelector('.hotspot-dot');
            if (dot) {
                dot.style.transform = 'scale(1.3)';
                dot.style.background = 'linear-gradient(135deg, #00f5ff, #a855f7)';
            }
        }
    },

    hideTooltip(hotspot) {
        const tooltip = hotspot.querySelector('.tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
            tooltip.style.transform = 'translateX(-50%) translateY(10px)';
        }
        
        const dot = hotspot.querySelector('.hotspot-dot');
        if (dot) {
            dot.style.transform = 'scale(1)';
            dot.style.background = 'var(--neon-cyan)';
        }
    },

    toggleTooltip(hotspot) {
        const tooltip = hotspot.querySelector('.tooltip');
        const isVisible = tooltip && tooltip.style.visibility === 'visible';
        
        // Hide all other tooltips first
        this.hideAllTooltips();
        
        if (!isVisible) {
            this.showTooltip(null, hotspot);
            this.activeTooltip = hotspot;
        } else {
            this.activeTooltip = null;
        }
    },

    hideAllTooltips() {
        this.hotspots.forEach(hotspot => this.hideTooltip(hotspot));
        this.activeTooltip = null;
    }
};

// Initialize hotspots when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on specs page
    if (document.querySelector('.exploded-section')) {
        InteractiveHotspots.init();
    }
});

/**
 * ============================================
 * PARALLAX EFFECT (Optional enhancement)
 * Subtle parallax on hero section
 * ============================================
 */
const ParallaxEffect = {
    init() {
        const hero = document.querySelector('.hero');
        const product = document.querySelector('.hero-product');
        
        if (!hero || !product) return;

        window.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            const xPos = (clientX / innerWidth - 0.5) * 20;
            const yPos = (clientY / innerHeight - 0.5) * 20;
            
            product.style.transform = `translate(${xPos}px, ${yPos}px)`;
        });
    }
};

// Initialize parallax on desktop only
if (window.innerWidth > 768) {
    document.addEventListener('DOMContentLoaded', () => {
        ParallaxEffect.init();
    });
}

/**
 * ============================================
 * LOADING ANIMATION
 * Fade in content after page load
 * ============================================
 */
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
    
    // Trigger hero animations
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }
});

/**
 * ============================================
 * UTILITY FUNCTIONS
 * ============================================
 */
const Utils = {
    // Debounce function for scroll events
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for performance
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

/**
 * ============================================
 * FAQ ACCORDION MODULE
 * Toggle FAQ answers
 * ============================================
 */
const FAQAccordion = {
    init() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        if (faqItems.length === 0) return;
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    // Close other items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                        }
                    });
                    
                    // Toggle current item
                    item.classList.toggle('active');
                });
            }
        });
    }
};

/**
 * ============================================
 * KEYBOARD ACCESSIBILITY
 * ============================================
 */
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        MobileMenu.closeMenu?.();
        InteractiveHotspots.hideAllTooltips?.();
    }
});

/**
 * ============================================
 * CONSOLE BRANDING
 * ============================================
 */
console.log('%c🎧 Covasol Gear', 'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #00f5ff, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
console.log('%cPremium Headphones by covasol.com.vn', 'font-size: 12px; color: #888;');
