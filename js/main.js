/**
 * Main Application Module - Mental Health Champion
 * Initializes all modules and handles common functionality
 */

class MentalHealthChampion {
    constructor() {
        this.modules = {};
        this.isInitialized = false;
        this.initStartTime = Date.now();
        
        this.init();
    }
    
    async init() {
        try {
            console.log('Initializing Mental Health Champion application...');
            
            // Check browser compatibility
            this.checkBrowserCompatibility();
            
            // Initialize core modules
            await this.initializeModules();
            
            // Setup global event listeners
            this.setupGlobalEventListeners();
            
            // Setup error handling
            this.setupErrorHandling();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            // Mark as initialized
            this.isInitialized = true;
            
            // Log initialization success
            const initTime = Date.now() - this.initStartTime;
            console.log(`Mental Health Champion initialized successfully in ${initTime}ms`);
            
            // Dispatch initialization complete event
            this.dispatchAppEvent('initialized', { initTime });
            
        } catch (error) {
            console.error('Error initializing Mental Health Champion:', error);
            this.handleInitializationError(error);
        }
    }
    
    checkBrowserCompatibility() {
        const incompatible = [];
        
        // Check for required features
        if (!window.localStorage) {
            incompatible.push('localStorage');
        }
        
        if (!window.fetch) {
            incompatible.push('fetch API');
        }
        
        if (!window.Promise) {
            incompatible.push('Promises');
        }
        
        if (!('classList' in document.createElement('_'))) {
            incompatible.push('classList');
        }
        
        if (incompatible.length > 0) {
            this.showBrowserCompatibilityWarning(incompatible);
        }
    }
    
    showBrowserCompatibilityWarning(missingFeatures) {
        const warning = document.createElement('div');
        warning.className = 'browser-warning';
        warning.innerHTML = `
            <div class="warning-content">
                <h3><i class="fas fa-exclamation-triangle"></i> Browser Compatibility Warning</h3>
                <p>Your browser may not support all features of this application. Missing features:</p>
                <ul>
                    ${missingFeatures.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <p>Please consider using a modern browser like Chrome, Firefox, Safari, or Edge for the best experience.</p>
                <button onclick="this.parentElement.parentElement.remove()">I Understand</button>
            </div>
        `;
        
        document.body.insertBefore(warning, document.body.firstChild);
    }
    
    async initializeModules() {
        const moduleOrder = [
            { name: 'themeManager', className: 'ThemeManager', file: 'themeToggle.js' },
            { name: 'accessibilityManager', className: 'AccessibilityManager', file: 'accessibility.js' },
            { name: 'formValidation', className: 'FormValidator', file: 'formValidation.js' },
            { name: 'crisisSupportManager', className: 'CrisisSupportManager', file: 'crisisSupport.js' },
            { name: 'affirmationManager', className: 'AffirmationManager', file: 'affirmations.js' },
            { name: 'moodTracker', className: 'MoodTracker', file: 'moodTracker.js' },
            { name: 'communityManager', className: 'CommunityManager', file: 'community.js' }
        ];
        
        for (const moduleConfig of moduleOrder) {
            try {
                await this.initializeModule(moduleConfig);
            } catch (error) {
                console.error(`Error initializing ${moduleConfig.name}:`, error);
                // Continue with other modules even if one fails
            }
        }
    }
    
    async initializeModule(config) {
        const { name, className, file } = config;
        
        // Check if class is already available (script already loaded via HTML)
        if (window[className]) {
            try {
                this.modules[name] = new window[className]();
                console.log(`${name} initialized successfully`);
                return;
            } catch (error) {
                console.error(`Error creating instance of ${className}:`, error);
                // Continue with other modules
                return;
            }
        }
        
        // If class is not available, check if we should try to load the script
        // Only try to load if it's not one of the scripts included in HTML
        const htmlIncludedScripts = ['themeToggle.js', 'accessibility.js', 'formValidation.js', 'affirmations.js', 'crisisSupport.js', 'moodTracker.js', 'community.js'];
        
        if (htmlIncludedScripts.includes(file)) {
            // For HTML-included scripts, try to wait a bit and retry
            if (name === 'communityManager') {
                // Special handling for CommunityManager due to potential loading timing issues
                let retries = 0;
                const maxRetries = 10;
                const retryInterval = setInterval(() => {
                    if (window[className]) {
                        try {
                            this.modules[name] = new window[className]();
                            console.log(`${name} initialized successfully after ${retries} retries`);
                            clearInterval(retryInterval);
                        } catch (error) {
                            console.error(`Error creating instance of ${className} after ${retries} retries:`, error);
                            clearInterval(retryInterval);
                        }
                    } else if (retries >= maxRetries) {
                        console.log(`${name}: Script ${file} should be included in HTML but class ${className} not found after ${maxRetries} retries. This might be a loading order issue.`);
                        clearInterval(retryInterval);
                    }
                    retries++;
                }, 100); // Check every 100ms
                return;
            }
            
            console.log(`${name}: Script ${file} should be included in HTML but class ${className} not found. This might be a loading order issue.`);
            // Don't try to load scripts that are already in HTML to avoid duplication
            return;
        }
        
        // For other scripts not in HTML, try to load them
        try {
            console.log(`Loading script: ${file}`);
            await this.loadScript(file);
            
            // Check again after loading
            if (window[className]) {
                this.modules[name] = new window[className]();
                console.log(`${name} initialized successfully`);
            } else {
                console.warn(`Class ${className} not found after loading ${file}.`);
            }
        } catch (error) {
            console.error(`Failed to initialize ${name}:`, error);
            // Continue with other modules
        }
    }
    
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            // Get the base path to ensure scripts load correctly from any directory
            const basePath = this.getBasePath();
            script.src = `${basePath}js/${src}`;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.head.appendChild(script);
        });
    }
    
    getBasePath() {
        // Get the current path and determine the base path
        const currentPath = window.location.pathname;
        
        // If we're at the root (just / or /index.html), return empty string
        if (currentPath === '/' || currentPath === '/index.html') {
            return '';
        }
        
        // Remove trailing slash if present
        const cleanPath = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
        
        // Get the filename if present
        const lastPart = cleanPath.split('/').pop();
        
        // If the last part is a file (has extension), we're in a directory
        if (lastPart.includes('.')) {
            const pathParts = cleanPath.split('/');
            // If we have more than 2 parts (including empty first part), we're in a subdirectory
            if (pathParts.length > 2) {
                return '../';
            }
        } else {
            // If last part doesn't have extension, we're in a subdirectory
            return '../';
        }
        
        // Default to root
        return '';
    }
    
    setupGlobalEventListeners() {
        // Handle theme changes
        document.addEventListener('themeChanged', (e) => {
            this.handleThemeChange(e.detail.theme);
        });
        
        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleWindowResize();
            }, 250);
        });
        
        // Handle online/offline status
        window.addEventListener('online', () => {
            this.handleOnlineStatus(true);
        });
        
        window.addEventListener('offline', () => {
            this.handleOnlineStatus(false);
        });
        
        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
        
        // Handle before unload
        window.addEventListener('beforeunload', (e) => {
            this.handleBeforeUnload(e);
        });
        
        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeyboardShortcuts(e);
        });
    }
    
    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.handleGlobalError(e.error);
        });
        
        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.handlePromiseRejection(e.reason);
        });
        
        // Custom error handling for modules
        window.addEventListener('moduleError', (e) => {
            console.error('Module error:', e.detail);
            this.handleModuleError(e.detail);
        });
    }
    
    setupPerformanceMonitoring() {
        // Monitor page load performance
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load performance:', {
                    loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                    domReady: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    firstPaint: this.getFirstPaintTime()
                });
            });
        }
        
        // Setup performance observer
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.entryType === 'measure') {
                        console.log(`Performance measure: ${entry.name} = ${entry.duration}ms`);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['measure'] });
        }
    }
    
    getFirstPaintTime() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : null;
    }
    
    handleThemeChange(theme) {
        console.log(`Theme changed to: ${theme}`);
        
        // Update theme-specific elements
        this.updateThemeSpecificElements(theme);
        
        // Save theme preference if needed
        this.saveThemePreference(theme);
    }
    
    updateThemeSpecificElements(theme) {
        // Update any theme-specific elements or behaviors
        const body = document.body;
        body.setAttribute('data-theme', theme);
        
        // Update chart colors if charts exist
        if (this.modules.moodTracker && this.modules.moodTracker.chart) {
            this.updateChartColors(theme);
        }
    }
    
    updateChartColors(theme) {
        // This would update chart colors based on theme
        // Implementation depends on the chart library being used
        console.log('Updating chart colors for theme:', theme);
    }
    
    saveThemePreference(theme) {
        try {
            localStorage.setItem('mentalHealthChampion_themePreference', theme);
        } catch (error) {
            console.error('Error saving theme preference:', error);
        }
    }
    
    handleWindowResize() {
        console.log('Window resized');
        
        // Handle responsive adjustments
        this.handleResponsiveLayout();
        
        // Notify modules about resize
        this.notifyModules('resize', {
            width: window.innerWidth,
            height: window.innerHeight
        });
    }
    
    handleResponsiveLayout() {
        const width = window.innerWidth;
        const body = document.body;
        
        // Update responsive classes
        body.classList.remove('mobile', 'tablet', 'desktop');
        
        if (width < 768) {
            body.classList.add('mobile');
        } else if (width < 1024) {
            body.classList.add('tablet');
        } else {
            body.classList.add('desktop');
        }
    }
    
    handleOnlineStatus(isOnline) {
        console.log(`Network status: ${isOnline ? 'online' : 'offline'}`);
        
        const status = document.getElementById('networkStatus');
        if (status) {
            status.className = isOnline ? 'online' : 'offline';
            status.textContent = isOnline ? 'Online' : 'Offline';
        }
        
        // Show notification
        this.showNotification(
            isOnline ? 'Connection restored' : 'You are offline',
            isOnline ? 'success' : 'warning'
        );
        
        // Notify modules
        this.notifyModules('networkChange', { isOnline });
    }
    
    handleVisibilityChange() {
        const isVisible = document.visibilityState === 'visible';
        console.log(`Page visibility: ${isVisible ? 'visible' : 'hidden'}`);
        
        // Pause/resume certain activities when page is not visible
        if (!isVisible) {
            this.pauseBackgroundActivities();
        } else {
            this.resumeBackgroundActivities();
        }
        
        // Notify modules
        this.notifyModules('visibilityChange', { isVisible });
    }
    
    pauseBackgroundActivities() {
        // Pause animations, timers, etc.
        console.log('Pausing background activities');
        
        // Pause mood tracking if active
        if (this.modules.moodTracker) {
            // Implementation depends on mood tracker
        }
    }
    
    resumeBackgroundActivities() {
        // Resume paused activities
        console.log('Resuming background activities');
        
        // Resume mood tracking if paused
        if (this.modules.moodTracker) {
            // Implementation depends on mood tracker
        }
    }
    
    handleBeforeUnload(e) {
        // Check if there are unsaved changes
        if (this.hasUnsavedChanges()) {
            e.preventDefault();
            e.returnValue = '';
            return '';
        }
    }
    
    hasUnsavedChanges() {
        // Check if any module has unsaved changes
        for (const [moduleName, module] of Object.entries(this.modules)) {
            if (module.hasUnsavedChanges && module.hasUnsavedChanges()) {
                return true;
            }
        }
        return false;
    }
    
    handleGlobalKeyboardShortcuts(e) {
        // Global keyboard shortcuts
        if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
            e.preventDefault();
            this.showHelp();
        }
        
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            this.toggleDebugMode();
        }
    }
    
    showHelp() {
        const helpContent = `
            <div class="help-modal">
                <h3>Keyboard Shortcuts</h3>
                <ul>
                    <li><strong>Ctrl/Cmd + H</strong> - Show this help</li>
                    <li><strong>Ctrl/Cmd + D</strong> - Toggle debug mode</li>
                    <li><strong>Ctrl/Cmd + +/-</strong> - Adjust font size</li>
                    <li><strong>Ctrl/Cmd + 0</strong> - Reset font size</li>
                    <li><strong>Ctrl/Cmd + Alt + S</strong> - Speak selected text</li>
                    <li><strong>Ctrl/Cmd + Alt + A</strong> - Toggle accessibility panel</li>
                    <li><strong>Ctrl/Cmd + Shift + C</strong> - Open crisis support</li>
                    <li><strong>Escape</strong> - Close modals, stop speaking</li>
                </ul>
                <button onclick="this.closest('.help-modal').remove()">Close</button>
            </div>
        `;
        
        const helpModal = document.createElement('div');
        helpModal.className = 'modal-overlay';
        helpModal.innerHTML = helpContent;
        document.body.appendChild(helpModal);
        
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) {
                helpModal.remove();
            }
        });
    }
    
    toggleDebugMode() {
        const body = document.body;
        body.classList.toggle('debug-mode');
        
        const isDebugMode = body.classList.contains('debug-mode');
        console.log(`Debug mode ${isDebugMode ? 'enabled' : 'disabled'}`);
        
        if (isDebugMode) {
            this.enableDebugFeatures();
        } else {
            this.disableDebugFeatures();
        }
    }
    
    enableDebugFeatures() {
        // Add debug information to the page
        const debugInfo = document.createElement('div');
        debugInfo.id = 'debug-info';
        debugInfo.className = 'debug-panel';
        debugInfo.innerHTML = `
            <h4>Debug Information</h4>
            <div class="debug-stats">
                <p>Modules loaded: ${Object.keys(this.modules).length}</p>
                <p>Initialization time: ${Date.now() - this.initStartTime}ms</p>
                <p>Page: ${window.location.pathname}</p>
                <p>Viewport: ${window.innerWidth}x${window.innerHeight}</p>
            </div>
        `;
        document.body.appendChild(debugInfo);
    }
    
    disableDebugFeatures() {
        const debugInfo = document.getElementById('debug-info');
        if (debugInfo) {
            debugInfo.remove();
        }
    }
    
    handleGlobalError(error) {
        console.error('Global error occurred:', error);
        
        // Show user-friendly error message
        this.showNotification('An error occurred. Please refresh the page.', 'error');
        
        // Send error to analytics if available
        this.trackError(error);
    }
    
    handlePromiseRejection(reason) {
        console.error('Unhandled promise rejection:', reason);
        
        // Show user-friendly error message
        this.showNotification('An error occurred. Please try again.', 'error');
        
        // Track error
        this.trackError(reason);
    }
    
    handleModuleError(errorData) {
        console.error('Module error:', errorData);
        
        // Show module-specific error message
        const message = `Error in ${errorData.module}: ${errorData.message}`;
        this.showNotification(message, 'error');
        
        // Track error
        this.trackError(errorData);
    }
    
    trackError(error) {
        // Send error to analytics service
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: error.message || error.toString(),
                fatal: false
            });
        }
        
        // Log error for debugging
        console.error('Error tracked:', error);
    }
    
    handleInitializationError(error) {
        console.error('Initialization error:', error);
        
        // Show critical error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'critical-error';
        errorMessage.innerHTML = `
            <div class="error-content">
                <h3><i class="fas fa-exclamation-circle"></i> Application Error</h3>
                <p>Failed to initialize the Mental Health Champion application.</p>
                <p>Please refresh the page or try again later.</p>
                <button onclick="location.reload()">Reload Page</button>
            </div>
        `;
        
        document.body.appendChild(errorMessage);
    }
    
    notifyModules(event, data) {
        for (const [moduleName, module] of Object.entries(this.modules)) {
            if (module.handleEvent && typeof module.handleEvent === 'function') {
                try {
                    module.handleEvent(event, data);
                } catch (error) {
                    console.error(`Error in ${moduleName} event handler:`, error);
                }
            }
        }
    }
    
    dispatchAppEvent(eventName, data) {
        const event = new CustomEvent(`mentalHealthChampion:${eventName}`, {
            detail: data
        });
        document.dispatchEvent(event);
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#5cb85c' : type === 'error' ? '#e74c3c' : type === 'warning' ? '#f39c12' : '#4a90e2'};
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
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Utility methods
    getModule(name) {
        return this.modules[name];
    }
    
    isModuleLoaded(name) {
        return !!this.modules[name];
    }
    
    getAllModules() {
        return { ...this.modules };
    }
    
    reloadModule(name) {
        if (this.modules[name]) {
            try {
                // Clean up existing module
                if (this.modules[name].destroy) {
                    this.modules[name].destroy();
                }
                
                // Remove from modules object
                delete this.modules[name];
                
                // Re-initialize
                const moduleConfig = this.findModuleConfig(name);
                if (moduleConfig) {
                    this.initializeModule(moduleConfig);
                }
            } catch (error) {
                console.error(`Error reloading module ${name}:`, error);
            }
        }
    }
    
    findModuleConfig(name) {
        const moduleConfigs = [
            { name: 'themeManager', className: 'ThemeManager', file: 'themeToggle.js' },
            { name: 'accessibilityManager', className: 'AccessibilityManager', file: 'accessibility.js' },
            { name: 'navigation', className: 'NavigationManager', file: 'navigation.js' },
            { name: 'formValidation', className: 'FormValidator', file: 'formValidation.js' },
            { name: 'crisisSupportManager', className: 'CrisisSupportManager', file: 'crisisSupport.js' },
            { name: 'affirmationManager', className: 'AffirmationManager', file: 'affirmations.js' },
            { name: 'moodTracker', className: 'MoodTracker', file: 'moodTracker.js' },
            { name: 'communityManager', className: 'CommunityManager', file: 'community.js' }
        ];
        
        return moduleConfigs.find(config => config.name === name);
    }
    
    // Application lifecycle methods
    pause() {
        console.log('Pausing application');
        this.notifyModules('pause', {});
    }
    
    resume() {
        console.log('Resuming application');
        this.notifyModules('resume', {});
    }
    
    destroy() {
        console.log('Destroying application');
        
        // Clean up all modules
        for (const [moduleName, module] of Object.entries(this.modules)) {
            if (module.destroy && typeof module.destroy === 'function') {
                try {
                    module.destroy();
                } catch (error) {
                    console.error(`Error destroying ${moduleName}:`, error);
                }
            }
        }
        
        // Clear modules
        this.modules = {};
        
        // Remove event listeners
        this.removeGlobalEventListeners();
        
        console.log('Application destroyed');
    }
    
    removeGlobalEventListeners() {
        // Remove all global event listeners
        window.removeEventListener('error', this.handleGlobalError);
        window.removeEventListener('unhandledrejection', this.handlePromiseRejection);
        window.removeEventListener('resize', this.handleWindowResize);
        window.removeEventListener('online', this.handleOnlineStatus);
        window.removeEventListener('offline', this.handleOnlineStatus);
        window.removeEventListener('visibilitychange', this.handleVisibilityChange);
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
        document.removeEventListener('keydown', this.handleGlobalKeyboardShortcuts);
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.mentalHealthChampion = new MentalHealthChampion();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MentalHealthChampion;
} else if (typeof window !== 'undefined') {
    window.MentalHealthChampion = MentalHealthChampion;
}
