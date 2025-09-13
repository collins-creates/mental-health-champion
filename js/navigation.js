/**
 * Navigation Module - Mental Health Champion
 * Handles sticky navbar, smooth scroll, and mobile menu functionality
 */

class NavigationManager {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.currentPage = this.getCurrentPage();
        this.lastScrollTop = 0;
        this.scrollThreshold = 50;
        this.hasScrollSpy = false;
        this.sections = [];
        this.observer = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setActiveNavLink();
        this.handleScroll();
    }
    
    setupEventListeners() {
        // Enhanced smooth scroll for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Handle external links
                if (href.startsWith('http')) {
                    return;
                }
                
                // Handle anchor links (same page)
                if (href.startsWith('#')) {
                    e.preventDefault();
                    if (href === '#') {
                        this.scrollToTop();
                    } else {
                        this.scrollToAnchor(href);
                    }
                    return;
                }
                
                // Handle internal page navigation
                e.preventDefault();
                this.navigateToPage(href);
            });
        });
        
        // Mobile menu toggle
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.navMenu && this.navMenu.classList.contains('active')) {
                if (!this.navbar.contains(e.target)) {
                    this.closeMobileMenu();
                }
            }
        });
        
        // Close mobile menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 767 && this.navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
        
        // Scroll event for navbar behavior
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.setActiveNavLink();
        });
    }
    
    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        return filename;
    }
    
    navigateToPage(href) {
        // Update active state
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Find and activate the clicked link
        const clickedLink = Array.from(this.navLinks).find(link => 
            link.getAttribute('href') === href
        );
        if (clickedLink) {
            clickedLink.classList.add('active');
        }
        
        // Navigate to the page
        window.location.href = href;
        
        // Close mobile menu if open
        this.closeMobileMenu();
    }
    
    setActiveNavLink() {
        const currentPage = this.getCurrentPage();
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            if (href === currentPage || 
                (currentPage === 'index.html' && href === 'index.html') ||
                (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
    
    toggleMobileMenu() {
        if (this.navMenu) {
            this.navMenu.classList.toggle('active');
            this.hamburger.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (this.navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    }
    
    closeMobileMenu() {
        if (this.navMenu) {
            this.navMenu.classList.remove('active');
            this.hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for navbar styling
        if (scrollTop > this.scrollThreshold) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
        
        // Handle navbar hide/show on scroll (smart scrolling)
        this.handleNavbarHideShow(scrollTop);
        
        // Update scroll spy if enabled
        if (this.hasScrollSpy) {
            this.updateScrollSpy(scrollTop);
        }
        
        this.lastScrollTop = scrollTop;
    }
    
    handleNavbarHideShow(scrollTop) {
        // Smart navbar hide/show logic
        const navbarHeight = this.navbar.offsetHeight;
        const scrollDelta = scrollTop - this.lastScrollTop;
        
        // Only hide/show if we've scrolled past the threshold
        if (scrollTop > navbarHeight + this.scrollThreshold) {
            // Scrolling down - hide navbar
            if (scrollDelta > 5 && !this.navbar.classList.contains('nav-hidden')) {
                this.navbar.style.transform = 'translateY(-100%)';
                this.navbar.classList.add('nav-hidden');
            }
            // Scrolling up - show navbar
            else if (scrollDelta < -5 && this.navbar.classList.contains('nav-hidden')) {
                this.navbar.style.transform = 'translateY(0)';
                this.navbar.classList.remove('nav-hidden');
            }
        } else {
            // Always show navbar when near the top
            if (this.navbar.classList.contains('nav-hidden')) {
                this.navbar.style.transform = 'translateY(0)';
                this.navbar.classList.remove('nav-hidden');
            }
        }
    }
    
    // Enhanced smooth scroll to anchor links
    scrollToAnchor(anchorId, offset = 0) {
        const element = document.querySelector(anchorId);
        if (element) {
            const navbarHeight = this.navbar.offsetHeight;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - navbarHeight - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Update URL hash without triggering jump
            if (history.pushState) {
                history.pushState(null, null, anchorId);
            } else {
                location.hash = anchorId;
            }
            
            // Update active nav link
            this.updateActiveNavLinkForAnchor(anchorId);
        }
    }
    
    // Get current scroll position
    getScrollPosition() {
        return window.pageYOffset || document.documentElement.scrollTop;
    }
    
    // Scroll to top
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Enhanced scroll spy for sections
    setupScrollSpy() {
        this.sections = document.querySelectorAll('section[id]');
        this.hasScrollSpy = this.sections.length > 0;
        
        if (!this.hasScrollSpy) return;
        
        // Initial setup
        this.updateScrollSpy(this.getScrollPosition());
        
        // Setup intersection observer for better performance
        this.setupIntersectionObserver();
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: `-${this.navbar.offsetHeight + 50}px 0px -50% 0px`,
            threshold: [0, 0.1, 0.5, 1]
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.updateActiveNavLinkForAnchor(`#${id}`);
                }
            });
        }, observerOptions);
        
        this.sections.forEach(section => {
            this.observer.observe(section);
        });
    }
    
    updateScrollSpy(scrollTop) {
        const navbarHeight = this.navbar.offsetHeight;
        const scrollPos = scrollTop + navbarHeight + 100;
        
        this.sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                this.updateActiveNavLinkForAnchor(`#${id}`);
            }
        });
    }
    
    updateActiveNavLinkForAnchor(anchorId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === anchorId) {
                link.classList.add('active');
            }
        });
    }
    
    // Handle keyboard navigation
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Escape key to close mobile menu
            if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
            
            // Tab key navigation enhancement
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });
    }
    
    handleTabNavigation(e) {
        const focusableElements = this.navbar.querySelectorAll(
            'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // If tabbing from last element, go to first
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        }
        
        // If tabbing from first element with shift, go to last
        if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
    
    // Accessibility improvements
    improveAccessibility() {
        // Add ARIA attributes
        if (this.hamburger) {
            this.hamburger.setAttribute('aria-expanded', 'false');
            this.hamburger.setAttribute('aria-controls', 'nav-menu');
            this.hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        }
        
        if (this.navMenu) {
            this.navMenu.setAttribute('id', 'nav-menu');
            this.navMenu.setAttribute('aria-label', 'Main navigation');
        }
        
        // Update ARIA when menu toggles
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const isActive = this.navMenu.classList.contains('active');
                    if (this.hamburger) {
                        this.hamburger.setAttribute('aria-expanded', isActive.toString());
                    }
                }
            });
        });
        
        if (this.navMenu) {
            observer.observe(this.navMenu, { attributes: true });
        }
    }
    
    // Enhanced cleanup event listeners
    destroy() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.closeMobileMenu);
        window.removeEventListener('click', this.closeMobileMenu);
        window.removeEventListener('popstate', this.setActiveNavLink);
        
        if (this.hamburger) {
            this.hamburger.removeEventListener('click', this.toggleMobileMenu);
        }
        
        this.navLinks.forEach(link => {
            link.removeEventListener('click', this.navigateToPage);
        });
        
        // Cleanup intersection observer
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if navigation elements exist
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.navigationManager = new NavigationManager();
        
        // Improve accessibility
        window.navigationManager.improveAccessibility();
        
        // Setup keyboard navigation
        window.navigationManager.setupKeyboardNavigation();
        
        // Setup scroll spy if there are sections with IDs
        const sections = document.querySelectorAll('section[id]');
        if (sections.length > 0) {
            window.navigationManager.setupScrollSpy();
        }
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationManager;
} else if (typeof window !== 'undefined') {
    window.NavigationManager = NavigationManager;
}
