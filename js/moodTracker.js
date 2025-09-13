/**
 * Mood Tracker Module - Mental Health Champion
 * Handles mood logging, statistics, and Chart.js visualization
 */

class MoodTracker {
    static moodLabels = {
        1: 'Very Bad',
        2: 'Bad',
        3: 'Neutral',
        4: 'Good',
        5: 'Very Good'
    };
    
    constructor() {
        this.storageKey = 'mentalHealthChampion_moodEntries';
        this.entries = this.loadEntries();
        this.chart = null;
        this.currentView = 'week';
        this.moodColors = {
            1: '#e74c3c', // Very Bad - Red
            2: '#f39c12', // Bad - Orange
            3: '#f1c40f', // Neutral - Yellow
            4: '#2ecc71', // Good - Green
            5: '#27ae60'  // Very Good - Dark Green
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.renderMoodForm();
        this.updateStatistics();
        this.renderChart();
        this.renderRecentEntries();
        this.generateInsights();
        this.loadMoodTips();
    }
    
    setupEventListeners() {
        // Mood form submission
        const moodForm = document.getElementById('moodForm');
        if (moodForm) {
            moodForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleMoodSubmission();
            });
        }
        
        // Mood rating buttons
        const moodButtons = document.querySelectorAll('.mood-btn');
        moodButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectMoodRating(btn.dataset.rating);
            });
        });
        
        // Factor checkboxes
        const factorCheckboxes = document.querySelectorAll('.factor-checkbox');
        factorCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateSelectedFactors();
            });
        });
        
        // Chart view buttons
        const chartButtons = document.querySelectorAll('.chart-btn');
        chartButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.changeChartView(btn.dataset.view);
            });
        });
        
        // Export data button
        const exportBtn = document.getElementById('exportMoodData');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportData();
            });
        }
        
        // Clear data button
        const clearBtn = document.getElementById('clearMoodData');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearData();
            });
        }
    }
    
    renderMoodForm() {
        const moodOptions = document.getElementById('moodOptions');
        if (!moodOptions) return;
        
        moodOptions.innerHTML = '';
        
        for (let i = 1; i <= 5; i++) {
            const moodBtn = document.createElement('button');
            moodBtn.type = 'button';
            moodBtn.className = 'mood-btn';
            moodBtn.dataset.rating = i;
            moodBtn.innerHTML = `
                <i class="fas fa-${this.getMoodIcon(i)}"></i>
                <span>${this.moodLabels[i]}</span>
            `;
            moodBtn.style.borderColor = this.moodColors[i];
            
            moodOptions.appendChild(moodBtn);
        }
    }
    
    getMoodIcon(rating) {
        const icons = {
            1: 'frown',
            2: 'meh',
            3: 'meh-blank',
            4: 'smile',
            5: 'grin-stars'
        };
        return icons[rating] || 'meh-blank';
    }
    
    selectMoodRating(rating) {
        // Remove previous selection
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add selection to clicked button
        const selectedBtn = document.querySelector(`[data-rating="${rating}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
        }
        
        // Store selected rating
        this.selectedRating = parseInt(rating);
    }
    
    updateSelectedFactors() {
        const checkboxes = document.querySelectorAll('.factor-checkbox:checked');
        this.selectedFactors = Array.from(checkboxes).map(cb => cb.value);
    }
    
    handleMoodSubmission() {
        const rating = this.selectedRating;
        const note = document.getElementById('moodNote').value.trim();
        const factors = this.selectedFactors || [];
        
        if (!rating) {
            this.showNotification('Please select your mood rating.', 'error');
            return;
        }
        
        if (note && note.length > 500) {
            this.showNotification('Note is too long. Maximum 500 characters.', 'error');
            return;
        }
        
        const entry = {
            id: this.generateId(),
            rating: rating,
            note: this.sanitizeContent(note),
            factors: factors,
            timestamp: new Date().toISOString(),
            date: new Date().toDateString()
        };
        
        this.entries.unshift(entry);
        this.saveEntries();
        this.resetMoodForm();
        this.updateStatistics();
        this.renderChart();
        this.renderRecentEntries();
        this.generateInsights();
        
        this.showNotification('Mood logged successfully!', 'success');
    }
    
    resetMoodForm() {
        // Reset mood selection
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        this.selectedRating = null;
        
        // Reset note
        document.getElementById('moodNote').value = '';
        
        // Reset factors
        document.querySelectorAll('.factor-checkbox').forEach(cb => {
            cb.checked = false;
        });
        this.selectedFactors = [];
    }
    
    updateStatistics() {
        const stats = this.calculateStatistics();
        
        // Update average mood
        const avgMoodElement = document.getElementById('avgMood');
        if (avgMoodElement) {
            avgMoodElement.textContent = stats.average.toFixed(1);
            avgMoodElement.style.color = this.moodColors[Math.round(stats.average)];
        }
        
        // Update total entries
        const totalEntriesElement = document.getElementById('totalEntries');
        if (totalEntriesElement) {
            totalEntriesElement.textContent = stats.totalEntries;
        }
        
        // Update current streak
        const streakElement = document.getElementById('currentStreak');
        if (streakElement) {
            streakElement.textContent = `${stats.currentStreak} days`;
        }
        
        // Update best streak
        const bestStreakElement = document.getElementById('bestStreak');
        if (bestStreakElement) {
            bestStreakElement.textContent = `${stats.bestStreak} days`;
        }
        
        // Update mood distribution
        this.renderMoodDistribution(stats.distribution);
    }
    
    calculateStatistics() {
        if (this.entries.length === 0) {
            return {
                average: 0,
                totalEntries: 0,
                currentStreak: 0,
                bestStreak: 0,
                distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            };
        }
        
        const total = this.entries.reduce((sum, entry) => sum + entry.rating, 0);
        const average = total / this.entries.length;
        
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        this.entries.forEach(entry => {
            distribution[entry.rating]++;
        });
        
        const streaks = this.calculateStreaks();
        
        return {
            average: average,
            totalEntries: this.entries.length,
            currentStreak: streaks.current,
            bestStreak: streaks.best,
            distribution: distribution
        };
    }
    
    calculateStreaks() {
        if (this.entries.length === 0) {
            return { current: 0, best: 0 };
        }
        
        const sortedEntries = [...this.entries].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        let currentStreak = 0;
        let bestStreak = 0;
        let tempStreak = 0;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < sortedEntries.length; i++) {
            const entryDate = new Date(sortedEntries[i].timestamp);
            entryDate.setHours(0, 0, 0, 0);
            
            const daysDiff = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === tempStreak) {
                tempStreak++;
            } else if (daysDiff > tempStreak) {
                break;
            }
        }
        
        currentStreak = tempStreak;
        
        // Calculate best streak
        const dates = sortedEntries.map(entry => 
            new Date(entry.timestamp).toDateString()
        );
        
        const uniqueDates = [...new Set(dates)].sort((a, b) => 
            new Date(b) - new Date(a)
        );
        
        tempStreak = 1;
        bestStreak = 1;
        
        for (let i = 1; i < uniqueDates.length; i++) {
            const currentDate = new Date(uniqueDates[i]);
            const prevDate = new Date(uniqueDates[i - 1]);
            const daysDiff = Math.floor((prevDate - currentDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === 1) {
                tempStreak++;
            } else {
                bestStreak = Math.max(bestStreak, tempStreak);
                tempStreak = 1;
            }
        }
        
        bestStreak = Math.max(bestStreak, tempStreak);
        
        return { current: currentStreak, best: bestStreak };
    }
    
    renderMoodDistribution(distribution) {
        const container = document.getElementById('moodDistribution');
        if (!container) return;
        
        container.innerHTML = '';
        
        Object.entries(distribution).forEach(([rating, count]) => {
            const percentage = this.entries.length > 0 ? (count / this.entries.length * 100).toFixed(1) : 0;
            
            const item = document.createElement('div');
            item.className = 'distribution-item';
            item.innerHTML = `
                <div class="distribution-label">
                    <i class="fas fa-${this.getMoodIcon(parseInt(rating))}" style="color: ${this.moodColors[rating]}"></i>
                    <span>${this.moodLabels[rating]}</span>
                </div>
                <div class="distribution-bar">
                    <div class="distribution-fill" style="width: ${percentage}%; background-color: ${this.moodColors[rating]}"></div>
                </div>
                <div class="distribution-count">${count} (${percentage}%)</div>
            `;
            
            container.appendChild(item);
        });
    }
    
    renderChart() {
        const ctx = document.getElementById('moodChart');
        if (!ctx) {
            console.warn('moodChart canvas not found');
            return;
        }
        
        const chartData = this.getChartData();
        
        // Destroy existing chart instance if it exists
        if (this.chart) {
            try {
                this.chart.destroy();
                this.chart = null;
            } catch (error) {
                console.warn('Error destroying existing chart:', error);
                this.chart = null;
            }
        }
        
        // Get the 2d context and clear any existing chart
        const canvasCtx = ctx.getContext('2d');
        if (canvasCtx) {
            canvasCtx.clearRect(0, 0, ctx.width, ctx.height);
        }
        
        // Check if Chart.js is available
        if (typeof Chart === 'undefined') {
            console.error('Chart.js is not loaded');
            return;
        }
        
        // Check if canvas is already in use by another chart instance
        const chartInstance = Chart.getChart(ctx);
        if (chartInstance) {
            try {
                chartInstance.destroy();
            } catch (error) {
                console.warn('Error destroying existing chart instance:', error);
            }
        }
        
        try {
            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        label: 'Mood Rating',
                        data: chartData.data,
                        borderColor: '#4a90e2',
                        backgroundColor: 'rgba(74, 144, 226, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                    pointBackgroundColor: chartData.data.map(rating => this.moodColors[rating]),
                    pointBorderColor: chartData.data.map(rating => this.moodColors[rating]),
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#4a90e2',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.y;
                                if (value === null || value === undefined) return 'No data';
                                const label = MoodTracker.moodLabels && MoodTracker.moodLabels[value] ? MoodTracker.moodLabels[value] : 'No data';
                                return `Mood: ${value.toFixed(1)} - ${label}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                return MoodTracker.moodLabels && MoodTracker.moodLabels[value] ? MoodTracker.moodLabels[value] : value;
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
            });
        } catch (error) {
            console.error('Error creating chart:', error);
        }
    }
    
    getChartData() {
        const now = new Date();
        let labels = [];
        let data = [];
        
        if (this.currentView === 'week') {
            // Last 7 days
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                const dateStr = date.toDateString();
                
                labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
                
                const dayEntries = this.entries.filter(entry => 
                    new Date(entry.timestamp).toDateString() === dateStr
                );
                
                const avgRating = dayEntries.length > 0 
                    ? dayEntries.reduce((sum, entry) => sum + entry.rating, 0) / dayEntries.length
                    : null;
                
                data.push(avgRating);
            }
        } else if (this.currentView === 'month') {
            // Last 30 days
            for (let i = 29; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                const dateStr = date.toDateString();
                
                labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
                
                const dayEntries = this.entries.filter(entry => 
                    new Date(entry.timestamp).toDateString() === dateStr
                );
                
                const avgRating = dayEntries.length > 0 
                    ? dayEntries.reduce((sum, entry) => sum + entry.rating, 0) / dayEntries.length
                    : null;
                
                data.push(avgRating);
            }
        }
        
        return { labels, data };
    }
    
    changeChartView(view) {
        this.currentView = view;
        
        // Update button states
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        this.renderChart();
    }
    
    renderRecentEntries() {
        const container = document.getElementById('recentEntries');
        if (!container) return;
        
        const recentEntries = this.entries.slice(0, 10);
        
        if (recentEntries.length === 0) {
            container.innerHTML = `
                <div class="no-entries">
                    <i class="fas fa-chart-line"></i>
                    <p>No mood entries yet. Start tracking your mood today!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = recentEntries.map(entry => this.createEntryHTML(entry)).join('');
    }
    
    createEntryHTML(entry) {
        const date = new Date(entry.timestamp);
        const timeAgo = this.getTimeAgo(entry.timestamp);
        
        return `
            <div class="entry-item">
                <div class="entry-header">
                    <div class="entry-mood">
                        <i class="fas fa-${this.getMoodIcon(entry.rating)}" style="color: ${this.moodColors[entry.rating]}"></i>
                        <span>${this.moodLabels[entry.rating]}</span>
                    </div>
                    <div class="entry-time">${timeAgo}</div>
                </div>
                ${entry.note ? `<div class="entry-note">${entry.note}</div>` : ''}
                ${entry.factors.length > 0 ? `
                    <div class="entry-factors">
                        <strong>Factors:</strong> ${entry.factors.join(', ')}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    generateInsights() {
        const insights = this.calculateInsights();
        const container = document.getElementById('moodInsights');
        if (!container) return;
        
        if (insights.length === 0) {
            container.innerHTML = `
                <div class="no-insights">
                    <i class="fas fa-lightbulb"></i>
                    <p>Log more mood entries to get personalized insights!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = insights.map(insight => `
            <div class="insight-item">
                <i class="fas fa-${insight.icon}" style="color: ${insight.color}"></i>
                <div class="insight-content">
                    <h4>${insight.title}</h4>
                    <p>${insight.description}</p>
                </div>
            </div>
        `).join('');
    }
    
    calculateInsights() {
        const insights = [];
        
        if (this.entries.length < 3) {
            return insights;
        }
        
        const stats = this.calculateStatistics();
        
        // Overall mood trend
        if (stats.average >= 4) {
            insights.push({
                icon: 'smile',
                color: '#27ae60',
                title: 'Great Mood Trend!',
                description: 'Your average mood is quite positive. Keep doing what works for you!'
            });
        } else if (stats.average <= 2) {
            insights.push({
                icon: 'heart',
                color: '#e74c3c',
                title: 'Mood Needs Attention',
                description: 'Your mood has been lower lately. Consider reaching out for support.'
            });
        }
        
        // Streak insights
        if (stats.currentStreak >= 7) {
            insights.push({
                icon: 'fire',
                color: '#f39c12',
                title: 'Amazing Streak!',
                description: `You've tracked your mood for ${stats.currentStreak} consecutive days. Great consistency!`
            });
        }
        
        // Factor analysis
        const factorAnalysis = this.analyzeFactors();
        if (factorAnalysis.bestFactor) {
            insights.push({
                icon: 'star',
                color: '#4a90e2',
                title: 'Positive Factor Identified',
                description: `You tend to feel better when ${factorAnalysis.bestFactor} is involved.`
            });
        }
        
        if (factorAnalysis.worstFactor) {
            insights.push({
                icon: 'exclamation-triangle',
                color: '#f39c12',
                title: 'Challenging Factor',
                description: `${factorAnalysis.worstFactor} seems to negatively impact your mood.`
            });
        }
        
        return insights;
    }
    
    analyzeFactors() {
        const factorMoods = {};
        
        this.entries.forEach(entry => {
            entry.factors.forEach(factor => {
                if (!factorMoods[factor]) {
                    factorMoods[factor] = [];
                }
                factorMoods[factor].push(entry.rating);
            });
        });
        
        let bestFactor = null;
        let worstFactor = null;
        let bestAvg = 0;
        let worstAvg = 5;
        
        Object.entries(factorMoods).forEach(([factor, ratings]) => {
            const avg = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
            
            if (avg > bestAvg && ratings.length >= 3) {
                bestAvg = avg;
                bestFactor = factor;
            }
            
            if (avg < worstAvg && ratings.length >= 3) {
                worstAvg = avg;
                worstFactor = factor;
            }
        });
        
        return { bestFactor, worstFactor };
    }
    
    loadMoodTips() {
        const tips = this.getMoodTips();
        const container = document.getElementById('moodTips');
        if (!container) return;
        
        container.innerHTML = tips.map(tip => `
            <div class="tip-item">
                <i class="fas fa-${tip.icon}" style="color: ${tip.color}"></i>
                <div class="tip-content">
                    <h4>${tip.title}</h4>
                    <p>${tip.description}</p>
                </div>
            </div>
        `).join('');
    }
    
    getMoodTips() {
        return [
            {
                icon: 'sun',
                color: '#f39c12',
                title: 'Get Outside',
                description: 'Spend at least 15 minutes outdoors in natural light each day.'
            },
            {
                icon: 'dumbbell',
                color: '#e74c3c',
                title: 'Move Your Body',
                description: 'Even light exercise can significantly boost your mood and energy.'
            },
            {
                icon: 'bed',
                color: '#9b59b6',
                title: 'Prioritize Sleep',
                description: 'Aim for 7-9 hours of quality sleep each night for better emotional regulation.'
            },
            {
                icon: 'users',
                color: '#4a90e2',
                title: 'Connect with Others',
                description: 'Reach out to friends, family, or support groups regularly.'
            },
            {
                icon: 'brain',
                color: '#1abc9c',
                title: 'Practice Mindfulness',
                description: 'Take a few minutes each day to meditate or practice deep breathing.'
            },
            {
                icon: 'utensils',
                color: '#27ae60',
                title: 'Nourish Your Body',
                description: 'Eat balanced meals and stay hydrated for optimal mental health.'
            }
        ];
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
    
    exportData() {
        const dataStr = JSON.stringify(this.entries, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mood-tracker-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Mood data exported successfully!', 'success');
    }
    
    clearData() {
        if (confirm('Are you sure you want to delete all mood data? This action cannot be undone.')) {
            localStorage.removeItem(this.storageKey);
            this.entries = [];
            this.updateStatistics();
            this.renderChart();
            this.renderRecentEntries();
            this.generateInsights();
            
            this.showNotification('All mood data has been cleared.', 'success');
        }
    }
    
    loadEntries() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const entries = JSON.parse(stored);
                return entries.filter(entry => this.isValidEntry(entry));
            }
        } catch (error) {
            console.error('Error loading mood entries:', error);
        }
        return [];
    }
    
    saveEntries() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.entries));
        } catch (error) {
            console.error('Error saving mood entries:', error);
            this.showNotification('Error saving mood data. Please try again.', 'error');
        }
    }
    
    isValidEntry(entry) {
        const requiredFields = ['id', 'rating', 'timestamp'];
        return requiredFields.every(field => entry.hasOwnProperty(field) && entry[field] !== null);
    }
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
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
    
    // Cleanup method to destroy chart and prevent memory leaks
    cleanup() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}

// Initialize mood tracker when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded. Please include Chart.js library.');
        return;
    }
    
    // Cleanup existing instance if it exists
    if (window.moodTracker) {
        window.moodTracker.cleanup();
    }
    
    window.moodTracker = new MoodTracker();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.moodTracker) {
        window.moodTracker.cleanup();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MoodTracker;
} else if (typeof window !== 'undefined') {
    window.MoodTracker = MoodTracker;
    
    // Global function for HTML onclick handlers
    window.selectMood = function(mood) {
        if (window.moodTracker) {
            // Convert mood string to rating
            const moodToRating = {
                'very-sad': 1,
                'sad': 2,
                'neutral': 3,
                'happy': 4,
                'very-happy': 5
            };
            const rating = moodToRating[mood];
            if (rating) {
                window.moodTracker.selectMoodRating(rating);
            }
        } else {
            console.error('MoodTracker not initialized');
        }
    };
    
    // Global function for chart view switching
    window.showChart = function(view) {
        if (window.moodTracker) {
            // Convert view parameter to match expected format
            const viewMap = {
                '7days': 'week',
                '30days': 'month',
                'all': 'all'
            };
            const mappedView = viewMap[view] || view;
            window.moodTracker.changeChartView(mappedView);
        } else {
            console.error('MoodTracker not initialized');
        }
    };
}
