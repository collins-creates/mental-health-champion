/**
 * Theme Toggle Module - Mental Health Champion
 * Handles dark/light mode toggle functionality
 */

class ThemeManager {
    constructor() {
        this.storageKey = 'mentalHealthChampion_theme';
        this.currentTheme = this.loadTheme();
        this.themeToggleBtn = document.querySelector('.theme-toggle');
        
        this.init();
    }
    
    init() {
        this.applyTheme();
        this.setupEventListeners();
        this.setupSystemThemeDetection();
    }
    
    setupEventListeners() {
        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        // Listen for system theme changes
        if (window.matchMedia) {
            const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            colorSchemeQuery.addEventListener('change', () => {
                if (this.currentTheme === 'system') {
                    this.applyTheme();
                }
            });
        }
    }
    
    setupSystemThemeDetection() {
        // Check if user has a saved theme preference
        if (!localStorage.getItem(this.storageKey)) {
            // No saved preference, use system theme
            this.currentTheme = 'system';
            this.saveTheme();
        }
    }
    
    toggleTheme() {
        const themes = ['light', 'dark', 'system'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        
        this.currentTheme = themes[nextIndex];
        this.saveTheme();
        this.applyTheme();
        this.updateToggleButton();
        
        this.showNotification(`Theme changed to ${this.currentTheme}`, 'success');
    }
    
    applyTheme() {
        const body = document.body;
        
        // Remove all theme classes
        body.classList.remove('light-theme', 'dark-theme');
        
        let effectiveTheme = this.currentTheme;
        
        if (this.currentTheme === 'system') {
            effectiveTheme = this.getSystemTheme();
        }
        
        // Apply the effective theme
        if (effectiveTheme === 'dark') {
            body.classList.add('dark-theme');
        } else {
            body.classList.add('light-theme');
        }
        
        // Update theme toggle button icon
        this.updateToggleButton();
        
        // Update CSS custom properties for better theme support
        this.updateThemeVariables(effectiveTheme);
        
        // Dispatch theme change event
        this.dispatchThemeChangeEvent(effectiveTheme);
    }
    
    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
    
    updateToggleButton() {
        if (!this.themeToggleBtn) return;
        
        const icon = this.themeToggleBtn.querySelector('i');
        if (!icon) return;
        
        let effectiveTheme = this.currentTheme;
        
        if (this.currentTheme === 'system') {
            effectiveTheme = this.getSystemTheme();
        }
        
        // Update icon based on current theme
        switch (this.currentTheme) {
            case 'light':
                icon.className = 'fas fa-sun';
                this.themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
                this.themeToggleBtn.setAttribute('title', 'Switch to dark theme');
                break;
            case 'dark':
                icon.className = 'fas fa-moon';
                this.themeToggleBtn.setAttribute('aria-label', 'Switch to system theme');
                this.themeToggleBtn.setAttribute('title', 'Switch to system theme');
                break;
            case 'system':
                icon.className = effectiveTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
                this.themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
                this.themeToggleBtn.setAttribute('title', 'Switch to light theme');
                break;
        }
    }
    
    updateThemeVariables(theme) {
        const root = document.documentElement;
        
        if (theme === 'dark') {
            // Dark theme variables
            root.style.setProperty('--bg-primary', '#1a1a1a');
            root.style.setProperty('--bg-secondary', '#2d2d2d');
            root.style.setProperty('--bg-tertiary', '#404040');
            root.style.setProperty('--text-primary', '#f0f0f0');
            root.style.setProperty('--text-secondary', '#b0b0b0');
            root.style.setProperty('--text-tertiary', '#808080');
            root.style.setProperty('--border-color', '#404040');
            root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.3)');
            root.style.setProperty('--accent-color', '#6bb6ff');
            root.style.setProperty('--accent-hover', '#8cc5ff');
        } else {
            // Light theme variables (reset to defaults)
            root.style.removeProperty('--bg-primary');
            root.style.removeProperty('--bg-secondary');
            root.style.removeProperty('--bg-tertiary');
            root.style.removeProperty('--text-primary');
            root.style.removeProperty('--text-secondary');
            root.style.removeProperty('--text-tertiary');
            root.style.removeProperty('--border-color');
            root.style.removeProperty('--shadow-color');
            root.style.removeProperty('--accent-color');
            root.style.removeProperty('--accent-hover');
        }
    }
    
    dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('themeChanged', {
            detail: { theme: theme }
        });
        document.dispatchEvent(event);
    }
    
    loadTheme() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            return saved || 'system';
        } catch (error) {
            console.error('Error loading theme preference:', error);
            return 'system';
        }
    }
    
    saveTheme() {
        try {
            localStorage.setItem(this.storageKey, this.currentTheme);
        } catch (error) {
            console.error('Error saving theme preference:', error);
            this.showNotification('Error saving theme preference.', 'error');
        }
    }
    
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    getEffectiveTheme() {
        if (this.currentTheme === 'system') {
            return this.getSystemTheme();
        }
        return this.currentTheme;
    }
    
    setTheme(theme) {
        if (['light', 'dark', 'system'].includes(theme)) {
            this.currentTheme = theme;
            this.saveTheme();
            this.applyTheme();
            this.showNotification(`Theme set to ${theme}`, 'success');
        } else {
            this.showNotification('Invalid theme specified.', 'error');
        }
    }
    
    // Accessibility improvements
    improveAccessibility() {
        if (this.themeToggleBtn) {
            this.themeToggleBtn.setAttribute('role', 'button');
            this.themeToggleBtn.setAttribute('tabindex', '0');
            
            // Add keyboard support
            this.themeToggleBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        }
    }
    
    // Theme transition effects
    addTransitionEffects() {
        const body = document.body;
        body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        // Add transition to all elements that might be affected by theme change
        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
            element.style.transition = 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease';
        });
    }
    
    // Remove transition effects (useful for initial page load)
    removeTransitionEffects() {
        const body = document.body;
        body.style.transition = '';
        
        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
            element.style.transition = '';
        });
    }
    
    // Show theme notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#5cb85c' : type === 'error' ? '#e74c3c' : '#4a90e2'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }
    
    // Theme-specific adjustments
    adjustForTheme(theme) {
        // Adjust images and media for better visibility in dark mode
        if (theme === 'dark') {
            this.adjustImagesForDarkMode();
            this.adjustChartsForDarkMode();
        } else {
            this.resetImageAdjustments();
            this.resetChartAdjustments();
        }
    }
    
    adjustImagesForDarkMode() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Add subtle brightness adjustment for better visibility
            img.style.filter = 'brightness(0.9) contrast(1.1)';
        });
    }
    
    resetImageAdjustments() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.style.filter = '';
        });
    }
    
    adjustChartsForDarkMode() {
        // Adjust Chart.js colors for dark mode if charts exist
        if (typeof Chart !== 'undefined') {
            Chart.defaults.color = '#f0f0f0';
            Chart.defaults.borderColor = '#404040';
        }
    }
    
    resetChartAdjustments() {
        if (typeof Chart !== 'undefined') {
            Chart.defaults.color = '#666';
            Chart.defaults.borderColor = '#e9ecef';
        }
    }
    
    // Performance optimization
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
    }
    
    // Initialize theme with performance considerations
    initializeTheme() {
        // Remove transitions during initial theme setup
        this.removeTransitionEffects();
        
        // Apply theme
        this.applyTheme();
        
        // Add transitions back after a short delay
        setTimeout(() => {
            this.addTransitionEffects();
        }, 100);
        
        // Apply theme-specific adjustments
        this.adjustForTheme(this.getEffectiveTheme());
    }
    
    // Cleanup
    destroy() {
        if (this.themeToggleBtn) {
            this.themeToggleBtn.removeEventListener('click', this.toggleTheme);
        }
        
        // Remove system theme listener
        if (window.matchMedia) {
            const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            colorSchemeQuery.removeEventListener('change', this.applyTheme);
        }
    }
}

// Initialize theme manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    
    // Improve accessibility
    window.themeManager.improveAccessibility();
    
    // Initialize with performance considerations
    window.themeManager.initializeTheme();
    
    // Listen for theme changes to make adjustments
    document.addEventListener('themeChanged', (e) => {
        window.themeManager.adjustForTheme(e.detail.theme);
    });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
} else if (typeof window !== 'undefined') {
    window.ThemeManager = ThemeManager;
}
