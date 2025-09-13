/**
 * Back to Top Button - Mental Health Champion
 * Handles smooth scrolling to top and button visibility
 */

class BackToTopManager {
    constructor() {
        this.backToTopButton = document.getElementById('backToTop');
        this.scrollThreshold = 300; // Show button after scrolling 300px
        this.init();
    }

    init() {
        if (!this.backToTopButton) {
            console.warn('Back to top button not found');
            return;
        }

        this.setupEventListeners();
        this.checkScrollPosition(); // Initial check
    }

    setupEventListeners() {
        // Scroll event to show/hide button
        window.addEventListener('scroll', this.throttle(() => {
            this.checkScrollPosition();
        }, 100));

        // Click event for smooth scroll to top
        this.backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.scrollToTop();
        });

        // Keyboard accessibility
        this.backToTopButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.scrollToTop();
            }
        });
    }

    checkScrollPosition() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > this.scrollThreshold) {
            this.backToTopButton.classList.add('visible');
            this.backToTopButton.setAttribute('aria-hidden', 'false');
        } else {
            this.backToTopButton.classList.remove('visible');
            this.backToTopButton.setAttribute('aria-hidden', 'true');
        }
    }

    scrollToTop() {
        const startPosition = window.pageYOffset;
        const startTime = performance.now();
        const duration = 800; // Animation duration in milliseconds

        const animateScroll = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Easing function for smooth animation
            const easeInOutCubic = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            const scrollPosition = startPosition * (1 - easeInOutCubic);
            window.scrollTo(0, scrollPosition);

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                // Ensure we're exactly at the top
                window.scrollTo(0, 0);
                
                // Focus management for accessibility
                const mainContent = document.querySelector('main') || document.querySelector('h1') || document.body;
                if (mainContent) {
                    mainContent.focus({ preventScroll: true });
                }
            }
        };

        requestAnimationFrame(animateScroll);
    }

    // Utility function to throttle scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize back to top manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.backToTopManager = new BackToTopManager();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BackToTopManager;
} else if (typeof window !== 'undefined') {
    window.BackToTopManager = BackToTopManager;
}
