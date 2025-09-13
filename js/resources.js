/**
 * Resources Page Script - Mental Health Champion
 * Handles resource filtering, search functionality, and resource request form
 */

class ResourcesManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupFiltering();
        this.setupSearch();
        this.setupResourceRequestForm();
        this.setupAnimations();
    }
    
    setupFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const resourceCards = document.querySelectorAll('.resource-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter resources
                resourceCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    setupSearch() {
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search resources...';
        searchInput.className = 'search-input';
        
        const filterSection = document.querySelector('.filter-controls');
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.appendChild(searchInput);
        filterSection.appendChild(searchContainer);
        
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const resourceCards = document.querySelectorAll('.resource-card');
            
            resourceCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    }
    
    setupResourceRequestForm() {
        const form = document.getElementById('resourceRequestForm');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const requestData = {
                type: formData.get('resourceType'),
                topic: formData.get('resourceTopic'),
                description: formData.get('resourceDescription'),
                timestamp: new Date().toISOString()
            };
            
            // Store request in localStorage
            this.storeResourceRequest(requestData);
            
            // Show success message
            this.showNotification('Thank you for your request! We\'ll review it and add relevant resources soon.', 'success');
            
            // Reset form
            form.reset();
        });
    }
    
    storeResourceRequest(requestData) {
        const requests = JSON.parse(localStorage.getItem('resourceRequests') || '[]');
        requests.push(requestData);
        localStorage.setItem('resourceRequests', JSON.stringify(requests));
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
    
    setupAnimations() {
        const resourceCards = document.querySelectorAll('.resource-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        resourceCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(card);
        });
    }
}

// Global function for filtering resources (called from HTML)
function filterResources(category) {
    // This function is called from the HTML onclick handlers
    // The actual filtering logic is handled by the ResourcesManager class
    console.log(`Filtering resources by: ${category}`);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ResourcesManager();
});
