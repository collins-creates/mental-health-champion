/**
 * Community Module - Mental Health Champion
 * Handles anonymous discussion board functionality using localStorage
 */

class CommunityManager {
    constructor() {
        this.storageKey = 'mentalHealthChampion_posts';
        this.posts = this.loadPosts();
        this.currentFilter = 'all';
        this.sortOrder = 'newest';
        this.maxPosts = 100; // Maximum posts to store
        
        this.init();
    }
    
    init() {
        this.initializeDummyPosts();
        this.setupEventListeners();
        this.renderPosts();
        this.setupPostForm();
        this.setupFiltering();
        this.setupSorting();
        this.setupSearch();
    }
    
    setupEventListeners() {
        // Post form submission
        const postForm = document.getElementById('postForm');
        if (postForm) {
            postForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePostSubmission();
            });
        }
        
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleFilterChange(button.dataset.filter);
            });
        });
        
        // Sort buttons
        const sortButtons = document.querySelectorAll('.sort-btn');
        sortButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleSortChange(button.dataset.sort);
            });
        });
        
        // Search input
        const searchInput = document.getElementById('searchPosts');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
    }
    
    setupPostForm() {
        // Character counter for post content
        const postContent = document.getElementById('postContent');
        const charCounter = document.getElementById('charCounter');
        
        if (postContent && charCounter) {
            postContent.addEventListener('input', () => {
                const remaining = 2000 - postContent.value.length;
                charCounter.textContent = `${remaining} characters remaining`;
                charCounter.style.color = remaining < 100 ? '#e74c3c' : '#6c757d';
            });
        }
        
        // Category selection
        const categorySelect = document.getElementById('postCategory');
        if (categorySelect) {
            categorySelect.addEventListener('change', () => {
                this.updateCategoryGuidelines(categorySelect.value);
            });
        }
    }
    
    setupFiltering() {
        this.updateFilterButtons();
    }
    
    setupSorting() {
        this.updateSortButtons();
    }
    
    setupSearch() {
        // Search functionality is handled in the event listener above
    }
    
    initializeDummyPosts() {
        // Only add dummy posts if there are no existing posts
        if (this.posts.length === 0) {
            const dummyPosts = [
                {
                    id: 'dummy1',
                    title: 'Today I finally practiced self-care!',
                    content: 'After weeks of putting it off, I finally took 30 minutes just for myself today. I went for a walk, listened to my favorite music, and even did a short meditation. It feels amazing to prioritize my own wellbeing. Remember, small steps count too! 💚',
                    category: 'general',
                    author: 'HopefulHelper1234',
                    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
                    likes: 15,
                    replies: [],
                    isLiked: false,
                    isReported: false
                },
                {
                    id: 'dummy2',
                    title: 'Anxiety tip that changed my life',
                    content: 'I wanted to share something that helped me with panic attacks: the 5-4-3-2-1 grounding technique. When you feel overwhelmed, name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. It brings you back to the present moment. It really works! 🌟',
                    category: 'anxiety',
                    author: 'BraveWarrior5678',
                    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
                    likes: 23,
                    replies: [],
                    isLiked: false,
                    isReported: false
                },
                {
                    id: 'dummy3',
                    title: 'One month medication-free and feeling hopeful',
                    content: 'With my doctor\'s guidance, I\'ve been off my anxiety medication for one month now. It\'s been challenging, but I\'ve learned so many coping strategies. Therapy, exercise, and this supportive community have been my anchors. If you\'re on a similar journey, know that progress isn\'t always linear, and that\'s okay. Keep going! 🌈',
                    category: 'depression',
                    author: 'StrongSupporter9012',
                    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
                    likes: 31,
                    replies: [],
                    isLiked: false,
                    isReported: false
                },
                {
                    id: 'dummy4',
                    title: 'Finding joy in the little things',
                    content: 'Depression made me forget how beautiful small moments can be. Today I noticed the way sunlight hits my window in the morning, the sound of birds outside, and the warmth of my morning coffee. These tiny moments of peace are building blocks for healing. What small joy did you notice today? 🌻',
                    category: 'depression',
                    author: 'GentleAdvocate3456',
                    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
                    likes: 18,
                    replies: [],
                    isLiked: false,
                    isReported: false
                },
                {
                    id: 'dummy5',
                    title: 'My mindfulness journey - 100 days!',
                    content: 'Today marks 100 days of consistent mindfulness practice! I started with just 5 minutes a day and now meditate for 20 minutes daily. The changes have been profound - better sleep, less reactivity, and more compassion for myself and others. If you\'re thinking about starting, just begin with one breath. You got this! 🧘‍♀️',
                    category: 'mindfulness',
                    author: 'CalmChampion7890',
                    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
                    likes: 42,
                    replies: [],
                    isLiked: false,
                    isReported: false
                },
                {
                    id: 'dummy6',
                    title: 'Thank you to this community',
                    content: 'I was feeling so alone with my anxiety until I found this space. Reading your stories and knowing I\'m not the only one struggling has given me so much courage. Yesterday I finally reached out to a therapist, something I\'ve been avoiding for years. This community saved me. Thank you for being here. 🤗',
                    category: 'general',
                    author: 'KindListener1357',
                    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
                    likes: 28,
                    replies: [],
                    isLiked: false,
                    isReported: false
                },
                {
                    id: 'dummy7',
                    title: 'Breathing exercises for instant calm',
                    content: 'I want to share the box breathing technique that helps me during panic attacks: Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 4-8 times. It\'s simple but incredibly effective. I keep a note on my phone with this technique for emergencies. Hope it helps someone else too! 🌬️',
                    category: 'anxiety',
                    author: 'PeacefulCounselor2468',
                    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
                    likes: 19,
                    replies: [],
                    isLiked: false,
                    isReported: false
                },
                {
                    id: 'dummy8',
                    title: 'Celebrating small victories',
                    content: 'Today I got out of bed before 10 AM, took a shower, and made myself a healthy breakfast. For someone struggling with depression, this is a huge win! I\'m learning to celebrate these small victories instead of focusing on what I didn\'t do. Progress, not perfection! Remember to be kind to yourself today. ✨',
                    category: 'depression',
                    author: 'WiseFriend3579',
                    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
                    likes: 35,
                    replies: [],
                    isLiked: false,
                    isReported: false
                }
            ];
            
            this.posts = dummyPosts;
            this.savePosts();
        }
    }
    
    loadPosts() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const posts = JSON.parse(stored);
                // Ensure posts have required fields and are not expired
                return posts.filter(post => this.isValidPost(post));
            }
        } catch (error) {
            console.error('Error loading posts:', error);
        }
        return [];
    }
    
    savePosts() {
        try {
            // Keep only the most recent posts
            const sortedPosts = this.posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            const limitedPosts = sortedPosts.slice(0, this.maxPosts);
            
            localStorage.setItem(this.storageKey, JSON.stringify(limitedPosts));
            this.posts = limitedPosts;
        } catch (error) {
            console.error('Error saving posts:', error);
            this.showNotification('Error saving posts. Please try again.', 'error');
        }
    }
    
    isValidPost(post) {
        const requiredFields = ['id', 'title', 'content', 'category', 'timestamp', 'author'];
        return requiredFields.every(field => post.hasOwnProperty(field) && post[field] !== null);
    }
    
    handlePostSubmission() {
        const title = document.getElementById('postTitle').value.trim();
        const content = document.getElementById('postContent').value.trim();
        const category = document.getElementById('postCategory').value;
        
        if (!title || !content || !category) {
            this.showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        if (content.length > 2000) {
            this.showNotification('Post content is too long. Maximum 2000 characters.', 'error');
            return;
        }
        
        const newPost = {
            id: this.generateId(),
            title: this.sanitizeContent(title),
            content: this.sanitizeContent(content),
            category: category,
            author: this.generateAnonymousName(),
            timestamp: new Date().toISOString(),
            likes: 0,
            replies: [],
            isLiked: false,
            isReported: false
        };
        
        this.posts.unshift(newPost);
        this.savePosts();
        this.renderPosts();
        this.resetPostForm();
        this.showNotification('Post created successfully!', 'success');
    }
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    generateAnonymousName() {
        const adjectives = ['Brave', 'Kind', 'Strong', 'Wise', 'Calm', 'Hopeful', 'Gentle', 'Peaceful'];
        const nouns = ['Warrior', 'Friend', 'Helper', 'Listener', 'Supporter', 'Champion', 'Advocate', 'Counselor'];
        const numbers = Math.floor(Math.random() * 9999) + 1;
        
        const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        
        return `${adjective}${noun}${numbers}`;
    }
    
    sanitizeContent(content) {
        // Basic sanitization to prevent XSS
        return content
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }
    
    resetPostForm() {
        document.getElementById('postTitle').value = '';
        document.getElementById('postContent').value = '';
        document.getElementById('postCategory').value = '';
        
        const charCounter = document.getElementById('charCounter');
        if (charCounter) {
            charCounter.textContent = '2000 characters remaining';
            charCounter.style.color = '#6c757d';
        }
    }
    
    renderPosts() {
        const postsContainer = document.getElementById('postsContainer');
        if (!postsContainer) return;
        
        let filteredPosts = this.filterPosts(this.posts);
        filteredPosts = this.sortPosts(filteredPosts);
        
        if (filteredPosts.length === 0) {
            postsContainer.innerHTML = `
                <div class="no-posts">
                    <i class="fas fa-comments"></i>
                    <h3>No posts found</h3>
                    <p>Be the first to share your thoughts with the community.</p>
                </div>
            `;
            return;
        }
        
        postsContainer.innerHTML = filteredPosts.map(post => this.createPostHTML(post)).join('');
        
        // Add event listeners to post elements
        this.attachPostEventListeners();
    }
    
    filterPosts(posts) {
        let filtered = posts;
        
        // Category filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(post => post.category === this.currentFilter);
        }
        
        // Search filter
        const searchTerm = document.getElementById('searchPosts')?.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(post => 
                post.title.toLowerCase().includes(searchTerm) ||
                post.content.toLowerCase().includes(searchTerm) ||
                post.category.toLowerCase().includes(searchTerm)
            );
        }
        
        return filtered;
    }
    
    sortPosts(posts) {
        return [...posts].sort((a, b) => {
            switch (this.sortOrder) {
                case 'newest':
                    return new Date(b.timestamp) - new Date(a.timestamp);
                case 'oldest':
                    return new Date(a.timestamp) - new Date(b.timestamp);
                case 'most-liked':
                    return b.likes - a.likes;
                case 'most-replies':
                    return b.replies.length - a.replies.length;
                default:
                    return 0;
            }
        });
    }
    
    createPostHTML(post) {
        const timeAgo = this.getTimeAgo(post.timestamp);
        const categoryIcon = this.getCategoryIcon(post.category);
        
        return `
            <div class="post-card" data-post-id="${post.id}">
                <div class="post-header">
                    <div class="post-category">
                        <i class="${categoryIcon}"></i>
                        <span>${this.formatCategory(post.category)}</span>
                    </div>
                    <div class="post-meta">
                        <span class="post-author">${post.author}</span>
                        <span class="post-time">${timeAgo}</span>
                    </div>
                </div>
                
                <div class="post-content">
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-text">${post.content}</p>
                </div>
                
                <div class="post-actions">
                    <button class="post-action-btn like-btn" data-post-id="${post.id}">
                        <i class="fas fa-heart"></i>
                        <span class="like-count">${post.likes}</span>
                    </button>
                    <button class="post-action-btn reply-btn" data-post-id="${post.id}">
                        <i class="fas fa-reply"></i>
                        <span>Reply</span>
                    </button>
                    <button class="post-action-btn report-btn" data-post-id="${post.id}">
                        <i class="fas fa-flag"></i>
                        <span>Report</span>
                    </button>
                </div>
                
                <div class="post-replies" id="replies-${post.id}" style="display: none;">
                    <div class="replies-list">
                        ${post.replies.map(reply => this.createReplyHTML(reply)).join('')}
                    </div>
                    <div class="reply-form">
                        <textarea class="reply-input" placeholder="Write a supportive reply..." maxlength="500"></textarea>
                        <button class="btn btn-primary submit-reply-btn" data-post-id="${post.id}">Post Reply</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    createReplyHTML(reply) {
        const timeAgo = this.getTimeAgo(reply.timestamp);
        
        return `
            <div class="reply">
                <div class="reply-header">
                    <span class="reply-author">${reply.author}</span>
                    <span class="reply-time">${timeAgo}</span>
                </div>
                <p class="reply-content">${reply.content}</p>
            </div>
        `;
    }
    
    getCategoryIcon(category) {
        const icons = {
            'support': 'fas fa-hands-helping',
            'recovery': 'fas fa-heart',
            'wellness': 'fas fa-spa',
            'crisis': 'fas fa-exclamation-triangle',
            'general': 'fas fa-comments'
        };
        return icons[category] || 'fas fa-comments';
    }
    
    formatCategory(category) {
        const formatted = {
            'support': 'Support',
            'recovery': 'Recovery',
            'wellness': 'Wellness',
            'crisis': 'Crisis',
            'general': 'General'
        };
        return formatted[category] || category;
    }
    
    getTimeAgo(timestamp) {
        const now = new Date();
        const past = new Date(timestamp);
        const diffMs = now - past;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return past.toLocaleDateString();
    }
    
    attachPostEventListeners() {
        // Like buttons
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleLike(btn.dataset.postId);
            });
        });
        
        // Reply buttons
        document.querySelectorAll('.reply-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.toggleReplies(btn.dataset.postId);
            });
        });
        
        // Report buttons
        document.querySelectorAll('.report-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleReport(btn.dataset.postId);
            });
        });
        
        // Submit reply buttons
        document.querySelectorAll('.submit-reply-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleReplySubmission(btn.dataset.postId);
            });
        });
    }
    
    handleLike(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;
        
        if (post.isLiked) {
            post.likes--;
            post.isLiked = false;
        } else {
            post.likes++;
            post.isLiked = true;
        }
        
        this.savePosts();
        this.renderPosts();
    }
    
    handleReplySubmission(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;
        
        const replyInput = document.querySelector(`#replies-${postId} .reply-input`);
        const replyContent = replyInput.value.trim();
        
        if (!replyContent) {
            this.showNotification('Please enter a reply.', 'error');
            return;
        }
        
        if (replyContent.length > 500) {
            this.showNotification('Reply is too long. Maximum 500 characters.', 'error');
            return;
        }
        
        const reply = {
            id: this.generateId(),
            content: this.sanitizeContent(replyContent),
            author: this.generateAnonymousName(),
            timestamp: new Date().toISOString()
        };
        
        post.replies.push(reply);
        this.savePosts();
        this.renderPosts();
        this.showNotification('Reply posted successfully!', 'success');
    }
    
    handleReport(postId) {
        if (confirm('Are you sure you want to report this post? This will help us maintain a safe community.')) {
            const post = this.posts.find(p => p.id === postId);
            if (post) {
                post.isReported = true;
                this.savePosts();
                this.showNotification('Post reported. Thank you for helping keep our community safe.', 'success');
            }
        }
    }
    
    toggleReplies(postId) {
        const repliesContainer = document.getElementById(`replies-${postId}`);
        if (repliesContainer) {
            const isVisible = repliesContainer.style.display !== 'none';
            repliesContainer.style.display = isVisible ? 'none' : 'block';
            
            if (!isVisible) {
                // Focus on reply input
                const replyInput = repliesContainer.querySelector('.reply-input');
                if (replyInput) {
                    replyInput.focus();
                }
            }
        }
    }
    
    handleFilterChange(filter) {
        this.currentFilter = filter;
        this.updateFilterButtons();
        this.renderPosts();
    }
    
    handleSortChange(sort) {
        this.sortOrder = sort;
        this.updateSortButtons();
        this.renderPosts();
    }
    
    handleSearch(searchTerm) {
        this.renderPosts();
    }
    
    updateFilterButtons() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === this.currentFilter);
        });
    }
    
    updateSortButtons() {
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.sort === this.sortOrder);
        });
    }
    
    updateCategoryGuidelines(category) {
        const guidelinesElement = document.getElementById('categoryGuidelines');
        if (!guidelinesElement) return;
        
        const guidelines = {
            'support': 'Share your experiences and offer support to others.',
            'recovery': 'Discuss your recovery journey and celebrate milestones.',
            'wellness': 'Share wellness tips and self-care strategies.',
            'crisis': 'For immediate support and crisis resources.',
            'general': 'General discussions about mental health.'
        };
        
        guidelinesElement.textContent = guidelines[category] || '';
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
    getPostCount() {
        return this.posts.length;
    }
    
    getPostsByCategory(category) {
        return this.posts.filter(post => post.category === category);
    }
    
    getRecentPosts(count = 5) {
        return this.posts
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, count);
    }
    
    clearAllPosts() {
        if (confirm('Are you sure you want to delete all posts? This action cannot be undone.')) {
            localStorage.removeItem(this.storageKey);
            this.posts = [];
            this.renderPosts();
            this.showNotification('All posts have been cleared.', 'success');
        }
    }
    
    exportPosts() {
        const dataStr = JSON.stringify(this.posts, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mental-health-champion-posts-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CommunityManager;
} else if (typeof window !== 'undefined') {
    window.CommunityManager = CommunityManager;
}
