/**
 * Accessibility Module - Mental Health Champion
 * Handles font resizing, text-to-speech, and other accessibility features
 */

class AccessibilityManager {
    constructor() {
        this.storageKey = 'mentalHealthChampion_accessibility';
        this.speechSynthesis = window.speechSynthesis;
        this.currentUtterance = null;
        this.currentSettings = this.loadSettings();
        this.applySettings();
        this.setupEventListeners();
        this.createAccessibilityControls();
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.hideAccessibilityPanel();
    }
    
    hideAccessibilityPanel() {
        const panel = document.getElementById('accessibilityPanel');
        if (panel) {
            panel.style.display = 'none';
        }
    }
    
    init() {
        this.setupEventListeners();
        this.applySettings();
        this.createAccessibilityControls();
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
    }
    
    setupEventListeners() {
        // Font size controls
        const fontIncreaseBtn = document.getElementById('fontIncrease');
        const fontDecreaseBtn = document.getElementById('fontDecrease');
        const fontResetBtn = document.getElementById('fontReset');
        
        if (fontIncreaseBtn) {
            fontIncreaseBtn.addEventListener('click', () => {
                this.adjustFontSize(1);
            });
        }
        
        if (fontDecreaseBtn) {
            fontDecreaseBtn.addEventListener('click', () => {
                this.adjustFontSize(-1);
            });
        }
        
        if (fontResetBtn) {
            fontResetBtn.addEventListener('click', () => {
                this.resetFontSize();
            });
        }
        
        // Text-to-speech controls
        const speakBtn = document.getElementById('speakText');
        const stopSpeakingBtn = document.getElementById('stopSpeaking');
        
        if (speakBtn) {
            speakBtn.addEventListener('click', () => {
                this.speakSelectedText();
            });
        }
        
        if (stopSpeakingBtn) {
            stopSpeakingBtn.addEventListener('click', () => {
                this.stopSpeaking();
            });
        }
        
        // High contrast toggle
        const highContrastToggle = document.getElementById('highContrastToggle');
        if (highContrastToggle) {
            highContrastToggle.addEventListener('change', () => {
                this.toggleHighContrast(highContrastToggle.checked);
            });
        }
        
        // Reduced motion toggle
        const reducedMotionToggle = document.getElementById('reducedMotionToggle');
        if (reducedMotionToggle) {
            reducedMotionToggle.addEventListener('change', () => {
                this.toggleReducedMotion(reducedMotionToggle.checked);
            });
        }
        
        // Focus indicators toggle
        const focusIndicatorsToggle = document.getElementById('focusIndicatorsToggle');
        if (focusIndicatorsToggle) {
            focusIndicatorsToggle.addEventListener('change', () => {
                this.toggleFocusIndicators(focusIndicatorsToggle.checked);
            });
        }
        
        // Dyslexia font toggle
        const dyslexiaFontToggle = document.getElementById('dyslexiaFontToggle');
        if (dyslexiaFontToggle) {
            dyslexiaFontToggle.addEventListener('change', () => {
                this.toggleDyslexiaFont(dyslexiaFontToggle.checked);
            });
        }
        
        // Line height controls
        const lineHeightIncreaseBtn = document.getElementById('lineHeightIncrease');
        const lineHeightDecreaseBtn = document.getElementById('lineHeightDecrease');
        
        if (lineHeightIncreaseBtn) {
            lineHeightIncreaseBtn.addEventListener('click', () => {
                this.adjustLineHeight(0.1);
            });
        }
        
        if (lineHeightDecreaseBtn) {
            lineHeightDecreaseBtn.addEventListener('click', () => {
                this.adjustLineHeight(-0.1);
            });
        }
        
        // Speech rate control
        const speechRateInput = document.getElementById('speechRate');
        const speechRateDisplay = document.getElementById('speechRateDisplay');
        
        if (speechRateInput) {
            speechRateInput.addEventListener('input', () => {
                const rate = parseFloat(speechRateInput.value);
                this.currentSettings.speechRate = rate;
                if (speechRateDisplay) {
                    speechRateDisplay.textContent = rate.toFixed(1);
                }
                this.saveSettings();
            });
        }
        
        // Speech pitch control
        const speechPitchInput = document.getElementById('speechPitch');
        const speechPitchDisplay = document.getElementById('speechPitchDisplay');
        
        if (speechPitchInput) {
            speechPitchInput.addEventListener('input', () => {
                const pitch = parseFloat(speechPitchInput.value);
                this.currentSettings.speechPitch = pitch;
                if (speechPitchDisplay) {
                    speechPitchDisplay.textContent = pitch.toFixed(1);
                }
                this.saveSettings();
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
        
        // Text selection for speech
        document.addEventListener('mouseup', () => {
            this.updateSpeakButton();
        });
    }
    
    createAccessibilityControls() {
        // Create accessibility panel if it doesn't exist
        if (!document.getElementById('accessibilityPanel')) {
            this.createAccessibilityPanel();
        }
    }
    
    createAccessibilityPanel() {
        const panel = document.createElement('div');
        panel.id = 'accessibilityPanel';
        panel.className = 'accessibility-panel';
        panel.setAttribute('role', 'complementary');
        panel.setAttribute('aria-label', 'Accessibility controls');
        
        panel.innerHTML = `
            <div class="accessibility-header">
                <h3><i class="fas fa-universal-access"></i> Accessibility</h3>
                <button id="accessibilityToggle" class="accessibility-toggle" aria-label="Toggle accessibility panel">
                    <i class="fas fa-cog"></i>
                </button>
            </div>
            
            <div class="accessibility-content">
                <div class="accessibility-section">
                    <h4>Text Size</h4>
                    <div class="font-controls">
                        <button id="fontDecrease" class="font-btn" aria-label="Decrease font size">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span id="fontSizeDisplay">100%</span>
                        <button id="fontIncrease" class="font-btn" aria-label="Increase font size">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button id="fontReset" class="font-btn" aria-label="Reset font size">
                            <i class="fas fa-undo"></i>
                        </button>
                    </div>
                </div>
                
                <div class="accessibility-section">
                    <h4>Line Height</h4>
                    <div class="line-height-controls">
                        <button id="lineHeightDecrease" class="font-btn" aria-label="Decrease line height">
                            <i class="fas fa-compress-alt"></i>
                        </button>
                        <span id="lineHeightDisplay">1.5</span>
                        <button id="lineHeightIncrease" class="font-btn" aria-label="Increase line height">
                            <i class="fas fa-expand-alt"></i>
                        </button>
                    </div>
                </div>
                
                <div class="accessibility-section">
                    <h4>Text-to-Speech</h4>
                    <div class="speech-controls">
                        <button id="speakText" class="speech-btn" aria-label="Speak selected text" disabled>
                            <i class="fas fa-volume-up"></i>
                            Speak Selection
                        </button>
                        <button id="stopSpeaking" class="speech-btn" aria-label="Stop speaking">
                            <i class="fas fa-stop"></i>
                            Stop
                        </button>
                    </div>
                    <div class="speech-settings">
                        <label for="speechRate">Speech Rate:</label>
                        <input type="range" id="speechRate" min="0.5" max="2" step="0.1" value="1">
                        <span id="speechRateDisplay">1.0</span>
                        
                        <label for="speechPitch">Pitch:</label>
                        <input type="range" id="speechPitch" min="0.5" max="2" step="0.1" value="1">
                        <span id="speechPitchDisplay">1.0</span>
                    </div>
                </div>
                
                <div class="accessibility-section">
                    <h4>Display Options</h4>
                    <div class="toggle-controls">
                        <label class="toggle-label">
                            <input type="checkbox" id="highContrastToggle">
                            <span class="toggle-slider"></span>
                            High Contrast
                        </label>
                        
                        <label class="toggle-label">
                            <input type="checkbox" id="reducedMotionToggle">
                            <span class="toggle-slider"></span>
                            Reduced Motion
                        </label>
                        
                        <label class="toggle-label">
                            <input type="checkbox" id="focusIndicatorsToggle">
                            <span class="toggle-slider"></span>
                            Focus Indicators
                        </label>
                        
                        <label class="toggle-label">
                            <input type="checkbox" id="dyslexiaFontToggle">
                            <span class="toggle-slider"></span>
                            Dyslexia Font
                        </label>
                    </div>
                </div>
                
                <div class="accessibility-section">
                    <h4>Keyboard Shortcuts</h4>
                    <div class="shortcuts-list">
                        <div class="shortcut-item">
                            <kbd>Ctrl</kbd> + <kbd>+</kbd> - Increase font size
                        </div>
                        <div class="shortcut-item">
                            <kbd>Ctrl</kbd> + <kbd>-</kbd> - Decrease font size
                        </div>
                        <div class="shortcut-item">
                            <kbd>Ctrl</kbd> + <kbd>0</kbd> - Reset font size
                        </div>
                        <div class="shortcut-item">
                            <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>S</kbd> - Speak selection
                        </div>
                        <div class="shortcut-item">
                            <kbd>Escape</kbd> - Stop speaking
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Setup panel toggle
        const toggleBtn = document.getElementById('accessibilityToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggleAccessibilityPanel();
            });
        }
        
        // Setup speech rate and pitch controls
        this.setupSpeechControls();
    }
    
    setupSpeechControls() {
        const speechRate = document.getElementById('speechRate');
        const speechPitch = document.getElementById('speechPitch');
        const speechRateDisplay = document.getElementById('speechRateDisplay');
        const speechPitchDisplay = document.getElementById('speechPitchDisplay');
        
        if (speechRate && speechRateDisplay) {
            speechRate.addEventListener('input', () => {
                this.currentSettings.speechRate = parseFloat(speechRate.value);
                speechRateDisplay.textContent = speechRate.value;
                this.saveSettings();
            });
        }
        
        if (speechPitch && speechPitchDisplay) {
            speechPitch.addEventListener('input', () => {
                this.currentSettings.speechPitch = parseFloat(speechPitch.value);
                speechPitchDisplay.textContent = speechPitch.value;
                this.saveSettings();
            });
        }
    }
    
    adjustFontSize(change) {
        const newSize = Math.max(50, Math.min(200, this.currentSettings.fontSize + (change * 10)));
        this.currentSettings.fontSize = newSize;
        this.applyFontSize();
        this.saveSettings();
        this.updateFontSizeDisplay();
    }
    
    resetFontSize() {
        this.currentSettings.fontSize = 100;
        this.applyFontSize();
        this.saveSettings();
        this.updateFontSizeDisplay();
    }
    
    applyFontSize() {
        const root = document.documentElement;
        root.style.fontSize = `${this.currentSettings.fontSize}%`;
    }
    
    updateFontSizeDisplay() {
        const display = document.getElementById('fontSizeDisplay');
        if (display) {
            display.textContent = `${this.currentSettings.fontSize}%`;
        }
    }
    
    adjustLineHeight(change) {
        const newHeight = Math.max(1, Math.min(3, this.currentSettings.lineHeight + change));
        this.currentSettings.lineHeight = newHeight;
        this.applyLineHeight();
        this.saveSettings();
        this.updateLineHeightDisplay();
    }
    
    applyLineHeight() {
        const root = document.documentElement;
        root.style.setProperty('--line-height', this.currentSettings.lineHeight);
        
        // Apply to body text
        const body = document.body;
        body.style.lineHeight = this.currentSettings.lineHeight;
    }
    
    updateLineHeightDisplay() {
        const display = document.getElementById('lineHeightDisplay');
        if (display) {
            display.textContent = this.currentSettings.lineHeight.toFixed(1);
        }
    }
    
    speakSelectedText() {
        const selection = window.getSelection();
        const text = selection.toString().trim();
        
        if (!text) {
            this.showNotification('Please select text to speak.', 'error');
            return;
        }
        
        if (this.speechSynthesis.speaking) {
            this.speechSynthesis.cancel();
        }
        
        this.currentUtterance = new SpeechSynthesisUtterance(text);
        this.currentUtterance.rate = this.currentSettings.speechRate;
        this.currentUtterance.pitch = this.currentSettings.speechPitch;
        this.currentUtterance.volume = 1;
        
        this.currentUtterance.onstart = () => {
            this.updateSpeakButton(true);
        };
        
        this.currentUtterance.onend = () => {
            this.updateSpeakButton(false);
        };
        
        this.currentUtterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            this.showNotification('Error speaking text.', 'error');
            this.updateSpeakButton(false);
        };
        
        this.speechSynthesis.speak(this.currentUtterance);
    }
    
    stopSpeaking() {
        if (this.speechSynthesis.speaking) {
            this.speechSynthesis.cancel();
            this.updateSpeakButton(false);
        }
    }
    
    updateSpeakButton(isSpeaking = false) {
        const speakBtn = document.getElementById('speakText');
        const selection = window.getSelection();
        const hasSelection = selection.toString().trim().length > 0;
        
        if (speakBtn) {
            speakBtn.disabled = !hasSelection || isSpeaking;
            speakBtn.innerHTML = isSpeaking 
                ? '<i class="fas fa-volume-up fa-pulse"></i> Speaking...'
                : '<i class="fas fa-volume-up"></i> Speak Selection';
        }
    }
    
    speakPageContent() {
        // Get all readable text content from the page
        const mainContent = document.querySelector('main') || document.body;
        const text = this.extractReadableText(mainContent);
        
        if (!text.trim()) {
            this.showNotification('No readable content found on this page.', 'error');
            return;
        }
        
        // Stop any current speech
        if (this.speechSynthesis.speaking) {
            this.speechSynthesis.cancel();
        }
        
        // Create and configure utterance
        this.currentUtterance = new SpeechSynthesisUtterance(text);
        this.currentUtterance.rate = this.currentSettings.speechRate;
        this.currentUtterance.pitch = this.currentSettings.speechPitch;
        this.currentUtterance.volume = 1;
        
        this.currentUtterance.onstart = () => {
            this.showNotification('Reading page content...', 'info');
        };
        
        this.currentUtterance.onend = () => {
            this.showNotification('Finished reading page content.', 'success');
        };
        
        this.currentUtterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            this.showNotification('Error reading page content.', 'error');
        };
        
        // Start speaking
        this.speechSynthesis.speak(this.currentUtterance);
    }
    
    extractReadableText(element) {
        // Extract readable text while skipping navigation, scripts, and other non-content elements
        const ignoredTags = ['script', 'style', 'noscript', 'nav', 'header', 'footer', 'aside'];
        const ignoredClasses = ['accessibility-panel', 'modal-overlay', 'notification'];
        
        let text = '';
        
        if (element.nodeType === Node.TEXT_NODE) {
            return element.textContent.trim() + ' ';
        }
        
        if (element.nodeType === Node.ELEMENT_NODE) {
            const tagName = element.tagName.toLowerCase();
            const className = element.className;
            
            // Skip ignored elements
            if (ignoredTags.includes(tagName) || 
                ignoredClasses.some(cls => className.includes(cls))) {
                return '';
            }
            
            // Add appropriate pauses for different elements
            if (tagName === 'h1' || tagName === 'h2') {
                text += '. ';
            } else if (tagName === 'h3' || tagName === 'h4' || tagName === 'h5' || tagName === 'h6') {
                text += '. ';
            } else if (tagName === 'p' || tagName === 'div') {
                text += ' ';
            } else if (tagName === 'li') {
                text += '. ';
            }
            
            // Process child nodes
            for (let child of element.childNodes) {
                text += this.extractReadableText(child);
            }
        }
        
        return text;
    }
    
    toggleHighContrast(enabled) {
        this.currentSettings.highContrast = enabled;
        this.applyHighContrast();
        this.saveSettings();
    }
    
    applyHighContrast() {
        const body = document.body;
        if (this.currentSettings.highContrast) {
            body.classList.add('high-contrast');
        } else {
            body.classList.remove('high-contrast');
        }
    }
    
    toggleReducedMotion(enabled) {
        this.currentSettings.reducedMotion = enabled;
        this.applyReducedMotion();
        this.saveSettings();
    }
    
    applyReducedMotion() {
        const root = document.documentElement;
        if (this.currentSettings.reducedMotion) {
            root.style.setProperty('--animation-duration', '0s');
            root.style.setProperty('--transition-duration', '0s');
            document.body.classList.add('reduced-motion');
        } else {
            root.style.removeProperty('--animation-duration');
            root.style.removeProperty('--transition-duration');
            document.body.classList.remove('reduced-motion');
        }
    }
    
    toggleFocusIndicators(enabled) {
        this.currentSettings.focusIndicators = enabled;
        this.applyFocusIndicators();
        this.saveSettings();
    }
    
    applyFocusIndicators() {
        const root = document.documentElement;
        if (this.currentSettings.focusIndicators) {
            root.style.setProperty('--focus-outline-width', '3px');
            root.style.setProperty('--focus-outline-style', 'solid');
            root.style.setProperty('--focus-outline-color', '#ff6b6b');
            document.body.classList.add('enhanced-focus');
        } else {
            root.style.removeProperty('--focus-outline-width');
            root.style.removeProperty('--focus-outline-style');
            root.style.removeProperty('--focus-outline-color');
            document.body.classList.remove('enhanced-focus');
        }
    }
    
    toggleDyslexiaFont(enabled) {
        this.currentSettings.dyslexiaFont = enabled;
        this.applyDyslexiaFont();
        this.saveSettings();
    }
    
    applyDyslexiaFont() {
        const body = document.body;
        if (this.currentSettings.dyslexiaFont) {
            body.classList.add('dyslexia-font');
        } else {
            body.classList.remove('dyslexia-font');
        }
    }
    
    toggleAccessibilityPanel() {
        const panel = document.getElementById('accessibilityPanel');
        if (panel) {
            panel.classList.toggle('open');
        }
    }
    
    handleKeyboardShortcuts(e) {
        // Font size shortcuts
        if ((e.ctrlKey || e.metaKey) && e.key === '+' && !e.shiftKey) {
            e.preventDefault();
            this.adjustFontSize(1);
        } else if ((e.ctrlKey || e.metaKey) && e.key === '-') {
            e.preventDefault();
            this.adjustFontSize(-1);
        } else if ((e.ctrlKey || e.metaKey) && e.key === '0') {
            e.preventDefault();
            this.resetFontSize();
        }
        
        // Text-to-speech shortcuts
        if ((e.ctrlKey || e.metaKey) && e.altKey && e.key === 's') {
            e.preventDefault();
            this.speakSelectedText();
        }
        
        // Stop speaking
        if (e.key === 'Escape' && this.speechSynthesis.speaking) {
            e.preventDefault();
            this.stopSpeaking();
        }
        
        // Accessibility panel toggle
        if ((e.ctrlKey || e.metaKey) && e.altKey && e.key === 'a') {
            e.preventDefault();
            this.toggleAccessibilityPanel();
        }
    }
    
    setupKeyboardNavigation() {
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Tab navigation enhancement
            if (e.key === 'Tab') {
                // Add visual feedback for keyboard navigation
                document.body.classList.add('keyboard-nav');
            }
            
            // Arrow key navigation for certain elements
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                const focusedElement = document.activeElement;
                if (focusedElement && focusedElement.classList.contains('navigable')) {
                    e.preventDefault();
                    this.navigateWithArrows(focusedElement, e.key);
                }
            }
        });
        
        document.addEventListener('mousedown', () => {
            // Remove keyboard navigation visual feedback when using mouse
            document.body.classList.remove('keyboard-nav');
        });
    }
    
    navigateWithArrows(currentElement, direction) {
        const navigableElements = document.querySelectorAll('.navigable');
        const currentIndex = Array.from(navigableElements).indexOf(currentElement);
        
        if (currentIndex === -1) return;
        
        let nextIndex;
        if (direction === 'ArrowDown') {
            nextIndex = (currentIndex + 1) % navigableElements.length;
        } else {
            nextIndex = currentIndex === 0 ? navigableElements.length - 1 : currentIndex - 1;
        }
        
        navigableElements[nextIndex].focus();
    }
    
    setupScreenReaderSupport() {
        // Add ARIA labels and descriptions
        this.addAriaLabels();
        
        // Setup live regions for dynamic content
        this.setupLiveRegions();
        
        // Announce page changes to screen readers
        this.announcePageChanges();
    }
    
    addAriaLabels() {
        // Add ARIA labels to important elements
        const importantElements = document.querySelectorAll('nav, main, footer, section');
        importantElements.forEach(element => {
            if (!element.getAttribute('aria-label')) {
                const tagName = element.tagName.toLowerCase();
                const defaultLabels = {
                    'nav': 'Main navigation',
                    'main': 'Main content',
                    'footer': 'Footer',
                    'section': 'Content section'
                };
                element.setAttribute('aria-label', defaultLabels[tagName] || 'Content area');
            }
        });
    }
    
    setupLiveRegions() {
        // Create live regions for announcements
        if (!document.getElementById('announcements')) {
            const announcements = document.createElement('div');
            announcements.id = 'announcements';
            announcements.className = 'sr-only';
            announcements.setAttribute('aria-live', 'polite');
            announcements.setAttribute('aria-atomic', 'true');
            document.body.appendChild(announcements);
        }
    }
    
    announceToScreenReader(message) {
        const announcements = document.getElementById('announcements');
        if (announcements) {
            announcements.textContent = message;
            setTimeout(() => {
                announcements.textContent = '';
            }, 1000);
        }
    }
    
    announcePageChanges() {
        // Announce when page content changes significantly
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    const addedContent = Array.from(mutation.addedNodes)
                        .filter(node => node.nodeType === Node.ELEMENT_NODE)
                        .map(node => node.textContent || '')
                        .join(' ')
                        .trim();
                    
                    if (addedContent.length > 10) {
                        this.announceToScreenReader('Content updated');
                    }
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    applySettings() {
        this.applyFontSize();
        this.applyLineHeight();
        this.applyHighContrast();
        this.applyReducedMotion();
        this.applyFocusIndicators();
        this.applyDyslexiaFont();
        this.updateFontSizeDisplay();
        this.updateLineHeightDisplay();
        
        // Update control states
        const highContrastToggle = document.getElementById('highContrastToggle');
        const reducedMotionToggle = document.getElementById('reducedMotionToggle');
        const focusIndicatorsToggle = document.getElementById('focusIndicatorsToggle');
        const dyslexiaFontToggle = document.getElementById('dyslexiaFontToggle');
        const speechRate = document.getElementById('speechRate');
        const speechPitch = document.getElementById('speechPitch');
        
        if (highContrastToggle) highContrastToggle.checked = this.currentSettings.highContrast;
        if (reducedMotionToggle) reducedMotionToggle.checked = this.currentSettings.reducedMotion;
        if (focusIndicatorsToggle) focusIndicatorsToggle.checked = this.currentSettings.focusIndicators;
        if (dyslexiaFontToggle) dyslexiaFontToggle.checked = this.currentSettings.dyslexiaFont;
        if (speechRate) speechRate.value = this.currentSettings.speechRate;
        if (speechPitch) speechPitch.value = this.currentSettings.speechPitch;
    }
    
    loadSettings() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading accessibility settings:', error);
        }
        
        return this.getDefaultSettings();
    }
    
    getDefaultSettings() {
        return {
            fontSize: 100,
            lineHeight: 1.5,
            highContrast: false,
            reducedMotion: false,
            focusIndicators: false,
            dyslexiaFont: false,
            speechRate: 1.0,
            speechPitch: 1.0
        };
    }
    
    saveSettings() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.currentSettings));
        } catch (error) {
            console.error('Error saving accessibility settings:', error);
            this.showNotification('Error saving accessibility settings.', 'error');
        }
    }
    
    resetSettings() {
        if (confirm('Are you sure you want to reset all accessibility settings?')) {
            this.currentSettings = this.getDefaultSettings();
            this.applySettings();
            this.saveSettings();
            this.showNotification('Accessibility settings reset to defaults.', 'success');
        }
    }
    
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
        }, 3000);
    }
}

// Initialize accessibility manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityManager = new AccessibilityManager();
});

// Global functions for inline event handlers
function increaseFontSize() {
    if (window.accessibilityManager) {
        window.accessibilityManager.adjustFontSize(1);
    }
}

function decreaseFontSize() {
    if (window.accessibilityManager) {
        window.accessibilityManager.adjustFontSize(-1);
    }
}

function readPage() {
    if (window.accessibilityManager) {
        window.accessibilityManager.speakPageContent();
    }
}

function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const icon = button.querySelector('i');
    
    if (answer.style.maxHeight && answer.style.maxHeight !== '0px') {
        // Close FAQ
        answer.style.maxHeight = '0px';
        answer.style.padding = '0';
        icon.style.transform = 'rotate(0deg)';
        button.setAttribute('aria-expanded', 'false');
    } else {
        // Open FAQ
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.padding = '1rem 0';
        icon.style.transform = 'rotate(180deg)';
        button.setAttribute('aria-expanded', 'true');
    }
}

function toggleAccessibilityPanel() {
    const panel = document.getElementById('accessibilityPanel');
    const toggleBtn = document.getElementById('accessibilityToggleBtn');
    
    if (!panel) {
        console.error('Accessibility panel not found');
        return;
    }
    
    const isVisible = panel.style.display !== 'none' && panel.style.display !== '';
    
    if (isVisible) {
        // Hide panel
        panel.style.display = 'none';
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
    } else {
        // Show panel
        panel.style.display = 'block';
        toggleBtn.classList.add('active');
        toggleBtn.setAttribute('aria-expanded', 'true');
        
        // Load current settings into the panel
        if (window.accessibilityManager) {
            loadAccessibilitySettings();
        }
    }
}

function loadAccessibilitySettings() {
    if (!window.accessibilityManager) return;
    
    const settings = window.accessibilityManager.currentSettings;
    
    // Update toggle states
    const highContrastToggle = document.getElementById('highContrastToggle');
    const reducedMotionToggle = document.getElementById('reducedMotionToggle');
    const focusIndicatorsToggle = document.getElementById('focusIndicatorsToggle');
    const dyslexiaFontToggle = document.getElementById('dyslexiaFontToggle');
    
    if (highContrastToggle) highContrastToggle.checked = settings.highContrast;
    if (reducedMotionToggle) reducedMotionToggle.checked = settings.reducedMotion;
    if (focusIndicatorsToggle) focusIndicatorsToggle.checked = settings.focusIndicators;
    if (dyslexiaFontToggle) dyslexiaFontToggle.checked = settings.dyslexiaFont;
    
    // Update displays
    const fontSizeDisplay = document.getElementById('fontSizeDisplay');
    const lineHeightDisplay = document.getElementById('lineHeightDisplay');
    const speechRateDisplay = document.getElementById('speechRateDisplay');
    const speechPitchDisplay = document.getElementById('speechPitchDisplay');
    
    if (fontSizeDisplay) fontSizeDisplay.textContent = `${settings.fontSize}%`;
    if (lineHeightDisplay) lineHeightDisplay.textContent = settings.lineHeight.toFixed(1);
    if (speechRateDisplay) speechRateDisplay.textContent = settings.speechRate.toFixed(1);
    if (speechPitchDisplay) speechPitchDisplay.textContent = settings.speechPitch.toFixed(1);
    
    // Update range inputs
    const speechRateInput = document.getElementById('speechRate');
    const speechPitchInput = document.getElementById('speechPitch');
    
    if (speechRateInput) speechRateInput.value = settings.speechRate;
    if (speechPitchInput) speechPitchInput.value = settings.speechPitch;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityManager;
} else if (typeof window !== 'undefined') {
    window.AccessibilityManager = AccessibilityManager;
}
