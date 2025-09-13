/**
 * Daily Affirmations Module - Mental Health Champion
 * Handles daily affirmations display and management
 */

class AffirmationManager {
    constructor() {
        this.storageKey = 'mentalHealthChampion_affirmations';
        this.dailyKey = 'mentalHealthChampion_dailyAffirmation';
        this.affirmations = this.getDefaultAffirmations();
        this.customAffirmations = this.loadCustomAffirmations();
        this.allAffirmations = [...this.affirmations, ...this.customAffirmations];
        this.currentAffirmation = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadDailyAffirmation();
        this.renderAffirmation();
        this.setupAffirmationControls();
    }
    
    setupEventListeners() {
        // New affirmation button
        const newAffirmationBtn = document.getElementById('newAffirmationBtn');
        if (newAffirmationBtn) {
            newAffirmationBtn.addEventListener('click', () => {
                this.showNewAffirmation();
            });
        }
        
        // Add custom affirmation form
        const addAffirmationForm = document.getElementById('addAffirmationForm');
        if (addAffirmationForm) {
            addAffirmationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addCustomAffirmation();
            });
        }
        
        // Favorite button
        const favoriteBtn = document.getElementById('favoriteBtn');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', () => {
                this.toggleFavorite();
            });
        }
        
        // Share affirmation functionality
        this.setupShareFunctionality();
        
        // Share button
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.shareAffirmation();
            });
        }
        
        // Copy button
        const copyBtn = document.getElementById('copyBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                this.copyAffirmation();
            });
        }
        
        // Category filter
        const categoryFilter = document.getElementById('affirmationCategory');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.filterByCategory(categoryFilter.value);
            });
        }
        
        // Search affirmations
        const searchInput = document.getElementById('searchAffirmations');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchAffirmations(e.target.value);
            });
        }
    }
    
    getDefaultAffirmations() {
        return [
            {
                id: 'default-1',
                text: 'I am worthy of love, respect, and happiness.',
                category: 'self-worth',
                author: 'Default',
                isFavorite: false
            },
            {
                id: 'default-2',
                text: 'I choose to focus on what I can control and accept what I cannot.',
                category: 'acceptance',
                author: 'Default',
                isFavorite: false
            },
            {
                id: 'default-3',
                text: 'Every day is a new opportunity for growth and positive change.',
                category: 'growth',
                author: 'Default',
                isFavorite: false
            },
            {
                id: 'default-4',
                text: 'I am strong enough to handle whatever comes my way.',
                category: 'strength',
                author: 'Default',
                isFavorite: false
            },
            {
                id: 'default-5',
                text: 'I deserve peace and tranquility in my life.',
                category: 'peace',
                author: 'Default',
                isFavorite: false
            },
            {
                id: 'default-6',
                text: 'I am capable of achieving my goals and dreams.',
                category: 'confidence',
                author: 'Default',
                isFavorite: false
            },
            {
                id: 'default-7',
                text: 'I treat myself with kindness and compassion.',
                category: 'self-compassion',
                author: 'Default',
                isFavorite: false
            },
            {
                id: 'default-8',
                text: 'I am grateful for the lessons that challenges teach me.',
                category: 'gratitude',
                author: 'Default',
                isFavorite: false
            },
            {
                id: 'default-9',
                text: 'I trust the journey of my life, even when I cannot see the path ahead.',
                category: 'trust',
                author: 'Default',
                isFavorite: false
            },
            {
                id: 'default-10',
                text: 'I radiate positive energy and attract positive experiences.',
                category: 'positivity',
                author: 'Default',
                isFavorite: false
            },
            {
                id: 'default-11',
                text: 'I am enough exactly as I am in this moment.',
                category: 'self-worth',
                author: 'Default',
                isFavorite: false
            },
            {
                id: 'default-12',
                text: 'I release all negative thoughts and embrace positivity.',
                category: 'release',
                author: 'Default',
                isFavorite: false
            },
            {
                id: 'default-13',
                text: 'I am surrounded by love and support from the universe.',
                category: 'support',
                author: 'Default',
                isFavorite: false
            },
            {
                id: 'default-14',
                text: 'I have the power to create the life I desire.',
                category: 'empowerment',
                author: 'Default',
                isFavorite: false
            },
            {
                id: 'default-15',
                text: 'I am healing, growing, and becoming stronger every day.',
                category: 'healing',
                author: 'Default',
                isFavorite: false
            },
            {
                id: 'default-16',
                text: 'I choose to see the beauty in myself and in the world around me.',
                category: 'beauty',
                author: 'Default',
                isFavorite: false
            },
            {
                id: 'default-17',
                text: 'I am open to receiving all the good that life has to offer.',
                category: 'receiving',
                author: 'Default',
                isFavorite: false
            },
            {
                id: 'default-18',
                text: 'I forgive myself and others, freeing my heart from resentment.',
                category: 'forgiveness',
                author: 'Default',
                isFavorite: false
            },
            {
                id: 'default-19',
                text: 'I am resilient and can bounce back from any setback.',
                category: 'resilience',
                author: 'Default',
                isFavorite: false
            },
            {
                id: 'default-20',
                text: 'I trust my intuition and make wise decisions for myself.',
                category: 'intuition',
                author: 'Default',
                isFavorite: false
            }
        ];
    }
    
    loadCustomAffirmations() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading custom affirmations:', error);
        }
        return [];
    }
    
    saveCustomAffirmations() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.customAffirmations));
        } catch (error) {
            console.error('Error saving custom affirmations:', error);
            this.showNotification('Error saving custom affirmations.', 'error');
        }
    }
    
    loadDailyAffirmation() {
        try {
            const stored = localStorage.getItem(this.dailyKey);
            if (stored) {
                const dailyData = JSON.parse(stored);
                const today = new Date().toDateString();
                
                if (dailyData.date === today) {
                    this.currentAffirmation = dailyData.affirmation;
                    return;
                }
            }
        } catch (error) {
            console.error('Error loading daily affirmation:', error);
        }
        
        // Get new affirmation for today
        this.getNewDailyAffirmation();
    }
    
    getNewDailyAffirmation() {
        const availableAffirmations = this.allAffirmations.filter(aff => 
            !this.isAffirmationUsedToday(aff.id)
        );
        
        if (availableAffirmations.length === 0) {
            // All affirmations used, reset and pick randomly
            this.currentAffirmation = this.getRandomAffirmation();
        } else {
            this.currentAffirmation = this.getRandomAffirmation(availableAffirmations);
        }
        
        this.saveDailyAffirmation();
    }
    
    getRandomAffirmation(affirmationList = null) {
        const list = affirmationList || this.allAffirmations;
        return list[Math.floor(Math.random() * list.length)];
    }
    
    isAffirmationUsedToday(affirmationId) {
        try {
            const stored = localStorage.getItem(this.dailyKey);
            if (stored) {
                const dailyData = JSON.parse(stored);
                return dailyData.usedAffirmations?.includes(affirmationId) || false;
            }
        } catch (error) {
            console.error('Error checking used affirmations:', error);
        }
        return false;
    }
    
    saveDailyAffirmation() {
        try {
            const today = new Date().toDateString();
            const usedAffirmations = this.getTodayUsedAffirmations();
            
            if (!usedAffirmations.includes(this.currentAffirmation.id)) {
                usedAffirmations.push(this.currentAffirmation.id);
            }
            
            const dailyData = {
                date: today,
                affirmation: this.currentAffirmation,
                usedAffirmations: usedAffirmations.slice(-50) // Keep last 50 used
            };
            
            localStorage.setItem(this.dailyKey, JSON.stringify(dailyData));
        } catch (error) {
            console.error('Error saving daily affirmation:', error);
        }
    }
    
    getTodayUsedAffirmations() {
        try {
            const stored = localStorage.getItem(this.dailyKey);
            if (stored) {
                const dailyData = JSON.parse(stored);
                const today = new Date().toDateString();
                
                if (dailyData.date === today) {
                    return dailyData.usedAffirmations || [];
                }
            }
        } catch (error) {
            console.error('Error getting used affirmations:', error);
        }
        return [];
    }
    
    renderAffirmation() {
        const affirmationText = document.getElementById('affirmationText');
        if (affirmationText && this.currentAffirmation) {
            affirmationText.textContent = this.currentAffirmation.text;
            
            // Add animation class
            affirmationText.classList.remove('fade-in');
            void affirmationText.offsetWidth; // Trigger reflow
            affirmationText.classList.add('fade-in');
        }
        
        // Update favorite button state
        const favoriteBtn = document.getElementById('favoriteBtn');
        if (favoriteBtn && this.currentAffirmation) {
            const icon = favoriteBtn.querySelector('i');
            if (icon) {
                if (this.currentAffirmation.isFavorite) {
                    icon.className = 'fas fa-heart';
                    favoriteBtn.classList.add('active');
                } else {
                    icon.className = 'far fa-heart';
                    favoriteBtn.classList.remove('active');
                }
            }
        }
    }
    
    setupShareFunctionality() {
        // Handle share button clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('button') && e.target.closest('button').onclick && 
                e.target.closest('button').getAttribute('onclick') === 'shareAffirmation()') {
                this.shareAffirmation();
            }
        });
    }
    
    shareAffirmation() {
        if (!this.currentAffirmation) return;
        
        const affirmationText = this.currentAffirmation.text;
        const shareData = {
            title: 'Daily Affirmation - Mental Health Champion',
            text: affirmationText,
            url: window.location.href
        };
        
        // Check if Web Share API is available
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => {
                    this.showNotification('Affirmation shared successfully!', 'success');
                })
                .catch((error) => {
                    console.log('Error sharing:', error);
                    this.fallbackShare(affirmationText);
                });
        } else {
            // Fallback for browsers that don't support Web Share API
            this.fallbackShare(affirmationText);
        }
    }
    
    fallbackShare(affirmationText) {
        // Create shareable text
        const shareText = `Daily Affirmation from Mental Health Champion:\n\n"${affirmationText}"\n\nJoin our supportive community: ${window.location.href}`;
        
        // Copy to clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText)
                .then(() => {
                    this.showNotification('Affirmation copied to clipboard!', 'success');
                })
                .catch(() => {
                    this.manualCopy(shareText);
                });
        } else {
            this.manualCopy(shareText);
        }
    }
    
    manualCopy(text) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showNotification('Affirmation copied to clipboard!', 'success');
        } catch (err) {
            this.showNotification('Unable to copy affirmation. Please copy manually.', 'error');
        }
        
        document.body.removeChild(textArea);
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
        `;
        
        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#10b981';
                break;
            case 'error':
                notification.style.backgroundColor = '#ef4444';
                break;
            default:
                notification.style.backgroundColor = '#3b82f6';
        }
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    setupAffirmationControls() {
        // Setup animation for affirmation text
        const affirmationText = document.getElementById('affirmationText');
        if (affirmationText) {
            affirmationText.style.animation = 'fadeIn 1s ease-out';
        }
    }
    
    showNewAffirmation() {
        this.getNewDailyAffirmation();
        this.renderAffirmation();
        
        // Add animation effect
        const affirmationCard = document.querySelector('.affirmation-card');
        if (affirmationCard) {
            affirmationCard.style.animation = 'pulse 0.5s ease-out';
            setTimeout(() => {
                affirmationCard.style.animation = '';
            }, 500);
        }
        
        this.showNotification('New affirmation loaded!', 'success');
    }
    
    addCustomAffirmation() {
        const textInput = document.getElementById('customAffirmationText');
        const categorySelect = document.getElementById('customAffirmationCategory');
        
        const text = textInput.value.trim();
        const category = categorySelect.value;
        
        if (!text) {
            this.showNotification('Please enter an affirmation text.', 'error');
            return;
        }
        
        if (text.length > 200) {
            this.showNotification('Affirmation is too long. Maximum 200 characters.', 'error');
            return;
        }
        
        const newAffirmation = {
            id: 'custom-' + Date.now(),
            text: this.sanitizeContent(text),
            category: category,
            author: 'You',
            isFavorite: false,
            isCustom: true
        };
        
        this.customAffirmations.push(newAffirmation);
        this.allAffirmations = [...this.affirmations, ...this.customAffirmations];
        this.saveCustomAffirmations();
        
        // Reset form
        textInput.value = '';
        categorySelect.value = 'self-worth';
        
        // Hide form
        this.hideAddAffirmationForm();
        
        this.showNotification('Custom affirmation added successfully!', 'success');
    }
    
    toggleFavorite() {
        if (!this.currentAffirmation) return;
        
        this.currentAffirmation.isFavorite = !this.currentAffirmation.isFavorite;
        
        // Update in custom affirmations if it's custom
        if (this.currentAffirmation.isCustom) {
            const index = this.customAffirmations.findIndex(aff => aff.id === this.currentAffirmation.id);
            if (index !== -1) {
                this.customAffirmations[index].isFavorite = this.currentAffirmation.isFavorite;
                this.saveCustomAffirmations();
            }
        }
        
        this.saveDailyAffirmation();
        this.renderAffirmation();
        
        const message = this.currentAffirmation.isFavorite ? 'Added to favorites!' : 'Removed from favorites.';
        this.showNotification(message, 'success');
    }
    
    shareAffirmation() {
        if (!this.currentAffirmation) return;
        
        const shareText = `"${this.currentAffirmation.text}" - Mental Health Champion`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Daily Affirmation',
                text: shareText
            }).catch(err => {
                console.log('Error sharing:', err);
                this.fallbackShare(shareText);
            });
        } else {
            this.fallbackShare(shareText);
        }
    }
    
    fallbackShare(text) {
        // Copy to clipboard as fallback
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Affirmation copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Error copying to clipboard:', err);
            this.showNotification('Unable to share affirmation.', 'error');
        });
    }
    
    copyAffirmation() {
        if (!this.currentAffirmation) return;
        
        const text = this.currentAffirmation.text;
        
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Affirmation copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Error copying to clipboard:', err);
            this.showNotification('Unable to copy affirmation.', 'error');
        });
    }
    
    filterByCategory(category) {
        if (category === 'all') {
            this.allAffirmations = [...this.affirmations, ...this.customAffirmations];
        } else {
            this.allAffirmations = [
                ...this.affirmations.filter(aff => aff.category === category),
                ...this.customAffirmations.filter(aff => aff.category === category)
            ];
        }
        
        if (this.allAffirmations.length === 0) {
            this.showNotification('No affirmations found in this category.', 'info');
        }
    }
    
    searchAffirmations(searchTerm) {
        if (!searchTerm.trim()) {
            this.allAffirmations = [...this.affirmations, ...this.customAffirmations];
            return;
        }
        
        const term = searchTerm.toLowerCase();
        this.allAffirmations = [
            ...this.affirmations.filter(aff => 
                aff.text.toLowerCase().includes(term) ||
                aff.category.toLowerCase().includes(term)
            ),
            ...this.customAffirmations.filter(aff => 
                aff.text.toLowerCase().includes(term) ||
                aff.category.toLowerCase().includes(term)
            )
        ];
        
        if (this.allAffirmations.length === 0) {
            this.showNotification('No affirmations found matching your search.', 'info');
        }
    }
    
    showAddAffirmationForm() {
        const form = document.getElementById('addAffirmationForm');
        const overlay = document.getElementById('formOverlay');
        
        if (form && overlay) {
            form.style.display = 'block';
            overlay.style.display = 'block';
            document.getElementById('customAffirmationText').focus();
        }
    }
    
    hideAddAffirmationForm() {
        const form = document.getElementById('addAffirmationForm');
        const overlay = document.getElementById('formOverlay');
        
        if (form && overlay) {
            form.style.display = 'none';
            overlay.style.display = 'none';
        }
    }
    
    formatCategory(category) {
        const formatted = {
            'self-worth': 'Self Worth',
            'acceptance': 'Acceptance',
            'growth': 'Growth',
            'strength': 'Strength',
            'peace': 'Peace',
            'confidence': 'Confidence',
            'self-compassion': 'Self Compassion',
            'gratitude': 'Gratitude',
            'trust': 'Trust',
            'positivity': 'Positivity',
            'release': 'Release',
            'support': 'Support',
            'empowerment': 'Empowerment',
            'healing': 'Healing',
            'beauty': 'Beauty',
            'receiving': 'Receiving',
            'forgiveness': 'Forgiveness',
            'resilience': 'Resilience',
            'intuition': 'Intuition'
        };
        return formatted[category] || category;
    }
    
    getCategoryIcon(category) {
        const icons = {
            'self-worth': 'fa-heart',
            'acceptance': 'fa-check-circle',
            'growth': 'fa-seedling',
            'strength': 'fa-dumbbell',
            'peace': 'fa-dove',
            'confidence': 'fa-star',
            'self-compassion': 'fa-hands',
            'gratitude': 'fa-gift',
            'trust': 'fa-shield-alt',
            'positivity': 'fa-sun',
            'release': 'fa-feather',
            'support': 'fa-users',
            'empowerment': 'fa-bolt',
            'healing': 'fa-band-aid',
            'beauty': 'fa-rainbow',
            'receiving': 'fa-box-open',
            'forgiveness': 'fa-hands-helping',
            'resilience': 'fa-mountain',
            'intuition': 'fa-eye'
        };
        return icons[category] || 'fa-quote-left';
    }
    
    sanitizeContent(content) {
        return content
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
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
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Utility methods
    getFavoriteAffirmations() {
        return this.allAffirmations.filter(aff => aff.isFavorite);
    }
    
    getCustomAffirmations() {
        return this.customAffirmations;
    }
    
    getAffirmationsByCategory(category) {
        return this.allAffirmations.filter(aff => aff.category === category);
    }
    
    getTotalAffirmationCount() {
        return this.allAffirmations.length;
    }
    
    exportAffirmations() {
        const data = {
            default: this.affirmations,
            custom: this.customAffirmations,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `affirmations-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Affirmations exported successfully!', 'success');
    }
    
    clearCustomAffirmations() {
        if (confirm('Are you sure you want to delete all custom affirmations? This action cannot be undone.')) {
            this.customAffirmations = [];
            this.allAffirmations = [...this.affirmations];
            this.saveCustomAffirmations();
            this.showNotification('All custom affirmations have been cleared.', 'success');
        }
    }
}

// Initialize affirmation manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.affirmationManager = new AffirmationManager();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AffirmationManager;
} else if (typeof window !== 'undefined') {
    window.AffirmationManager = AffirmationManager;
}
