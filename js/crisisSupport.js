/**
 * Crisis Support Module - Mental Health Champion
 * Provides crisis hotlines, emergency resources, and wellness features
 */

class CrisisSupportManager {
    constructor() {
        this.isOpen = false;
        // Initialize crisis hotlines with user's phone number
        this.crisisHotlines = [
            {
                name: 'Your Support Line',
                number: '+254706587881', // Your actual phone number
                description: '24/7 support lines for immediate help during mental health crises',
                available: true
            }
        ];
        
        this.emergencyResources = [];
        this.copingStrategies = [];
        
        // Initialize breathing exercise properties
        this.breathingActive = false;
        this.breathingTimer = null;
        this.breathingCycleCount = 0;
        this.currentPhaseIndex = 0;
        
        // Initialize meditation properties
        this.meditationActive = false;
        this.meditationTimer = null;
        this.meditationTimeLeft = 600; // 10 minutes
        this.meditationPaused = false;
        this.meditationCurrentStep = 0;
        this.meditationTotalTime = 600;
        
        // Initialize voice properties
        this.speechSynthesis = window.speechSynthesis;
        this.voiceEnabled = true;
        
        // Initialize self-care routine properties
        this.selectedLifestyle = null;
        this.selectedFocus = [];
        this.currentRoutine = null;
        this.currentRoutineStep = 0;
        this.routineActive = false;
        
        this.init();
    }
    
    init() {
        console.log('Crisis support initialized with personal support line');
    }
    
    toggleCrisisSupport() {
        if (this.isOpen) {
            this.closeCrisisSupport();
        } else {
            this.openCrisisSupport();
        }
    }
    
    openCrisisSupport() {
        this.isOpen = true;
        this.renderCrisisSupport();
    }
    
    closeCrisisSupport() {
        this.isOpen = false;
        const modal = document.getElementById('crisisSupportModal');
        if (modal) {
            modal.remove();
        }
    }
    
    renderCrisisSupport() {
        // Remove existing modal if present
        const existingModal = document.getElementById('crisisSupportModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal overlay structure
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'crisisSupportModal';
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
            <div class="modal-content crisis-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-phone-alt"></i> Crisis Support</h3>
                    <button class="modal-close" onclick="window.crisisSupportManager.closeCrisisSupport()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="crisis-section">
                        <h4>National Crisis Hotlines</h4>
                        <p>24/7 support lines for immediate help during mental health crises.</p>
                        <div class="hotlines-list">
                            ${this.renderHotlines()}
                        </div>
                    </div>
                    
                    <div class="crisis-section">
                        <h4>Wellness Tools</h4>
                        <div class="wellness-tools">
                            <button class="wellness-btn" onclick="window.crisisSupportManager.showBreathingExercise()">
                                <i class="fas fa-wind"></i>
                                <span>Breathing Exercise</span>
                            </button>
                            <button class="wellness-btn" onclick="window.crisisSupportManager.showMindfulnessMeditation()">
                                <i class="fas fa-spa"></i>
                                <span>Meditation</span>
                            </button>
                            <button class="wellness-btn" onclick="window.crisisSupportManager.showSelfCareRoutine()">
                                <i class="fas fa-heart"></i>
                                <span>Self-Care Routine</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalOverlay);
        
        // Add modal styles
        this.addCrisisModalStyles();
        
        // Show modal with animation
        setTimeout(() => {
            modalOverlay.classList.add('active');
        }, 10);
    }
    
    // Empty methods to maintain compatibility
    getCrisisHotlines() { return []; }
    getEmergencyResources() { return []; }
    getCopingStrategies() { return []; }
    renderHotlines() {
        return this.crisisHotlines.map(hotline => `
            <div class="hotline-item">
                <div class="hotline-info">
                    <h5>${hotline.name}</h5>
                    <p>${hotline.description}</p>
                </div>
                <div class="hotline-actions">
                    <button class="call-btn" onclick="window.crisisSupportManager.callHotline('${hotline.number}')">
                        <i class="fas fa-phone"></i>
                        ${hotline.number}
                    </button>
                </div>
            </div>
        `).join('');
    }
    renderEmergencyResources() { return ''; }
    renderCopingStrategies() { return ''; }
    callHotline(number) {
        window.open(`tel:${number}`, '_self');
    }
    
    addCrisisModalStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            .crisis-modal {
                max-width: 600px;
                width: 90%;
            }
            
            .crisis-section {
                margin-bottom: 2rem;
            }
            
            .crisis-section h4 {
                color: var(--primary-color, #4a90e2);
                margin-bottom: 0.5rem;
                font-size: 1.2rem;
            }
            
            .crisis-section p {
                color: var(--text-secondary, #666);
                margin-bottom: 1rem;
                line-height: 1.6;
            }
            
            .hotlines-list {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .hotline-item {
                background: var(--background-light, #f8f9fa);
                padding: 1.5rem;
                border-radius: 8px;
                border: 1px solid var(--border-color, #e9ecef);
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 1rem;
            }
            
            .hotline-info h5 {
                color: var(--text-primary, #333);
                margin: 0 0 0.5rem 0;
                font-size: 1.1rem;
            }
            
            .hotline-info p {
                color: var(--text-secondary, #666);
                margin: 0;
                font-size: 0.9rem;
            }
            
            .hotline-actions .call-btn {
                background: var(--success-color, #28a745);
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
            }
            
            .hotline-actions .call-btn:hover {
                background: var(--success-hover, #218838);
                transform: translateY(-2px);
            }
            
            .wellness-tools {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }
            
            .wellness-btn {
                background: var(--primary-color, #4a90e2);
                color: white;
                border: none;
                padding: 1.5rem;
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
                text-align: center;
            }
            
            .wellness-btn:hover {
                background: var(--primary-hover, #357abd);
                transform: translateY(-2px);
            }
            
            .wellness-btn i {
                font-size: 2rem;
            }
            
            .wellness-btn span {
                font-weight: 600;
            }
        `;
        
        document.head.appendChild(styles);
    }
    setupCopyButtons() {}
    setupStrategyButtons() {}
    showStrategyDetails() {}
    checkTimerMilestones() {}
    showTimerNotification() {}
    
    // Voice functionality
    speak(text) {
        if (!this.voiceEnabled || !this.speechSynthesis) return;
        
        try {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = this.speechSynthesis.getVoices()[0];
            utterance.pitch = 1;
            utterance.rate = 1;
            this.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error('Voice synthesis error:', error);
        }
    }
    
    // Breathing exercise functionality
    showBreathingExercise() {
        this.createBreathingExerciseModal();
    }
    
    // Meditation functionality
    showMindfulnessMeditation() {
        this.createMeditationModal();
    }
    
    // Self-care routine functionality
    showSelfCareRoutine() {
        this.createSelfCareRoutineModal();
    }
    
    createBreathingExerciseModal() {
        // Remove existing modal if present
        const existingModal = document.getElementById('breathingExerciseModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal overlay structure to match existing CSS
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'breathingExerciseModal';
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
            <div class="modal-content breathing-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-wind"></i> Breathing Exercise</h3>
                    <button class="modal-close" onclick="window.crisisSupportManager.closeBreathingExercise()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="breathing-instructions">
                        <h3>4-7-8 Breathing Technique</h3>
                        <p>This simple breathing exercise can help reduce stress and anxiety quickly.</p>
                        <div class="breathing-steps">
                            <div class="step">
                                <span class="step-number">1</span>
                                <div class="step-content">
                                    <h4>Inhale</h4>
                                    <p>Breathe in through your nose for 4 seconds</p>
                                </div>
                            </div>
                            <div class="step">
                                <span class="step-number">2</span>
                                <div class="step-content">
                                    <h4>Hold</h4>
                                    <p>Hold your breath for 7 seconds</p>
                                </div>
                            </div>
                            <div class="step">
                                <span class="step-number">3</span>
                                <div class="step-content">
                                    <h4>Exhale</h4>
                                    <p>Breathe out through your mouth for 8 seconds</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="breathing-visualizer">
                        <div class="breathing-circle" id="breathingCircle"></div>
                        <div class="breathing-text" id="breathingText">Ready to begin?</div>
                        <div class="breathing-timer" id="breathingTimer">00:00</div>
                    </div>
                    
                    <div class="breathing-controls">
                        <button class="btn btn-primary" id="startBreathingBtn" onclick="window.crisisSupportManager.startBreathingExercise()">
                            <i class="fas fa-play"></i> Start Exercise
                        </button>
                        <button class="btn btn-secondary" id="stopBreathingBtn" onclick="window.crisisSupportManager.stopBreathingExercise()" style="display: none;">
                            <i class="fas fa-stop"></i> Stop Exercise
                        </button>
                        <button class="btn btn-outline" onclick="window.crisisSupportManager.closeBreathingExercise()">
                            <i class="fas fa-times"></i> Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalOverlay);
        // Trigger the modal to show with animation
        setTimeout(() => {
            modalOverlay.classList.add('active');
        }, 10);
        
        // Add modal styles
        this.addBreathingModalStyles();
    }
    
    addBreathingModalStyles() {
        // Check if styles already exist
        if (document.getElementById('breathingModalStyles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'breathingModalStyles';
        styles.textContent = `
            .breathing-modal {
                max-width: 600px;
                margin: 50px auto;
            }
            
            .breathing-instructions {
                margin-bottom: 2rem;
            }
            
            .breathing-steps {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
                margin-top: 1rem;
            }
            
            .step {
                display: flex;
                align-items: flex-start;
                gap: 0.5rem;
                padding: 1rem;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                background: #f9f9f9;
            }
            
            .step-number {
                background: #4a90e2;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
                font-weight: bold;
                flex-shrink: 0;
            }
            
            .step-content h4 {
                margin: 0 0 0.5rem 0;
                color: #333;
            }
            
            .step-content p {
                margin: 0;
                font-size: 0.9rem;
                color: #666;
            }
            
            .breathing-visualizer {
                text-align: center;
                margin: 2rem 0;
                padding: 2rem;
                background: #f0f8ff;
                border-radius: 12px;
            }
            
            .breathing-circle {
                width: 120px;
                height: 120px;
                border: 3px solid #4a90e2;
                border-radius: 50%;
                margin: 0 auto 1rem;
                transition: all 0.3s ease;
            }
            
            .breathing-circle.inhale {
                transform: scale(1.2);
                background: rgba(74, 144, 226, 0.1);
            }
            
            .breathing-circle.hold {
                transform: scale(1.2);
                background: rgba(255, 193, 7, 0.1);
                border-color: #ffc107;
            }
            
            .breathing-circle.exhale {
                transform: scale(0.8);
                background: rgba(40, 167, 69, 0.1);
                border-color: #28a745;
            }
            
            .breathing-text {
                font-size: 1.2rem;
                font-weight: bold;
                color: #333;
                margin-bottom: 0.5rem;
            }
            
            .breathing-timer {
                font-size: 1rem;
                color: #666;
            }
            
            .breathing-controls {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    startBreathingExercise() {
        this.breathingActive = true;
        this.breathingStep = 0; // 0: inhale, 1: hold, 2: exhale
        this.breathingCount = 0;
        this.totalTime = 0;
        
        const startBtn = document.getElementById('startBreathingBtn');
        const stopBtn = document.getElementById('stopBreathingBtn');
        
        if (startBtn) startBtn.style.display = 'none';
        if (stopBtn) stopBtn.style.display = 'inline-block';
        
        this.runBreathingCycle();
    }
    
    runBreathingCycle() {
        if (!this.breathingActive) return;
        
        const phases = [
            { name: 'inhale', duration: 4000, instruction: 'Breathe In', color: '#4a90e2', voice: 'Breathe in slowly through your nose' },
            { name: 'hold', duration: 7000, instruction: 'Hold', color: '#28a745', voice: 'Hold your breath' },
            { name: 'exhale', duration: 8000, instruction: 'Breathe Out', color: '#dc3545', voice: 'Breathe out slowly through your mouth' }
        ];
        
        const currentPhase = phases[this.currentPhaseIndex];
        
        // Update UI
        const circle = document.querySelector('.breathing-circle');
        const instruction = document.querySelector('.breathing-text');
        const timer = document.querySelector('.breathing-timer');
        
        if (circle && instruction && timer) {
            circle.style.backgroundColor = currentPhase.color;
            instruction.textContent = currentPhase.instruction;
            
            // Update timer
            let timeLeft = currentPhase.duration / 1000;
            timer.textContent = `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`;
            
            const timerInterval = setInterval(() => {
                timeLeft--;
                timer.textContent = `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`;
                
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                }
            }, 1000);
        }
        
        // Provide voice guidance
        this.speak(currentPhase.voice);
        
        // Set timer to advance to next phase
        setTimeout(() => {
            if (this.breathingActive) {
                this.currentPhaseIndex = (this.currentPhaseIndex + 1) % 3; // Cycle through 3 phases
                this.runBreathingCycle();
            }
        }, currentPhase.duration);
    }
    
    stopBreathingExercise() {
        this.breathingActive = false;
        
        const startBtn = document.getElementById('startBreathingBtn');
        const stopBtn = document.getElementById('stopBreathingBtn');
        const circle = document.getElementById('breathingCircle');
        const text = document.getElementById('breathingText');
        
        if (startBtn) startBtn.style.display = 'inline-block';
        if (stopBtn) stopBtn.style.display = 'none';
        if (circle) circle.className = 'breathing-circle';
        if (text) text.textContent = 'Exercise completed';
        
        // Show completion message
        setTimeout(() => {
            if (text) text.textContent = 'Ready to begin?';
        }, 3000);
    }
    
    closeBreathingExercise() {
        this.stopBreathingExercise();
        const modal = document.getElementById('breathingExerciseModal');
        if (modal) {
            modal.remove();
        }
    }
    
    createMeditationModal() {
        // Remove existing modal if present
        const existingModal = document.getElementById('meditationModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal overlay structure to match existing CSS
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'meditationModal';
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
            <div class="modal-content meditation-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-brain"></i> Mindfulness Meditation</h3>
                    <button class="modal-close" onclick="window.crisisSupportManager.closeMeditation()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="meditation-instructions">
                        <h3>Guided Mindfulness Meditation</h3>
                        <p>This 10-minute guided meditation will help you find peace and clarity through mindfulness practice.</p>
                        <div class="meditation-steps">
                            <div class="meditation-step">
                                <h4><i class="fas fa-chair"></i> Find a Comfortable Position</h4>
                                <p>Sit comfortably with your back straight but not rigid. Rest your hands on your knees or lap.</p>
                            </div>
                            <div class="meditation-step">
                                <h4><i class="fas fa-eye"></i> Close Your Eyes</h4>
                                <p>Gently close your eyes or soften your gaze. Let your awareness settle into the present moment.</p>
                            </div>
                            <div class="meditation-step">
                                <h4><i class="fas fa-lungs"></i> Focus on Your Breath</h4>
                                <p>Notice the sensation of breathing. Don't try to change it, just observe it naturally.</p>
                            </div>
                            <div class="meditation-step">
                                <h4><i class="fas fa-cloud"></i> Observe Your Thoughts</h4>
                                <p>When thoughts arise, acknowledge them without judgment and gently return to your breath.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="meditation-visualizer">
                        <div class="meditation-circle" id="meditationCircle"></div>
                        <div class="meditation-text" id="meditationText">Ready to begin meditation?</div>
                        <div class="meditation-timer" id="meditationTimer">10:00</div>
                        <div class="meditation-progress">
                            <div class="progress-bar" id="meditationProgress"></div>
                        </div>
                    </div>
                    
                    <div class="meditation-controls">
                        <button class="btn btn-primary" id="startMeditationBtn" onclick="window.crisisSupportManager.startMeditation()">
                            <i class="fas fa-play"></i> Start Meditation
                        </button>
                        <button class="btn btn-secondary" id="pauseMeditationBtn" onclick="window.crisisSupportManager.pauseMeditation()" style="display: none;">
                            <i class="fas fa-pause"></i> Pause
                        </button>
                        <button class="btn btn-secondary" id="resumeMeditationBtn" onclick="window.crisisSupportManager.resumeMeditation()" style="display: none;">
                            <i class="fas fa-play"></i> Resume
                        </button>
                        <button class="btn btn-outline" onclick="window.crisisSupportManager.closeMeditation()">
                            <i class="fas fa-times"></i> Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalOverlay);
        // Trigger the modal to show with animation
        setTimeout(() => {
            modalOverlay.classList.add('active');
        }, 10);
        
        // Add modal styles
        this.addMeditationModalStyles();
    }
    
    addMeditationModalStyles() {
        // Check if styles already exist
        if (document.getElementById('meditationModalStyles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'meditationModalStyles';
        styles.textContent = `
            .meditation-modal {
                max-width: 700px;
                margin: 50px auto;
            }
            
            .meditation-instructions {
                margin-bottom: 2rem;
            }
            
            .meditation-steps {
                display: grid;
                gap: 1rem;
                margin-top: 1rem;
            }
            
            .meditation-step {
                padding: 1rem;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                background: #f9f9f9;
                margin-bottom: 1rem;
            }
            
            .meditation-step h4 {
                margin: 0 0 0.5rem 0;
                color: #333;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .meditation-step p {
                margin: 0;
                color: #666;
            }
            
            .meditation-visualizer {
                text-align: center;
                margin: 2rem 0;
                padding: 2rem;
                background: #f0f8ff;
                border-radius: 12px;
            }
            
            .meditation-circle {
                width: 150px;
                height: 150px;
                border: 3px solid #9c27b0;
                border-radius: 50%;
                margin: 0 auto 1rem;
                transition: all 2s ease;
                background: rgba(156, 39, 176, 0.1);
            }
            
            .meditation-circle.active {
                animation: meditationPulse 4s infinite ease-in-out;
            }
            
            @keyframes meditationPulse {
                0%, 100% { transform: scale(1); opacity: 0.8; }
                50% { transform: scale(1.1); opacity: 1; }
            }
            
            .meditation-text {
                font-size: 1.3rem;
                font-weight: bold;
                color: #333;
                margin-bottom: 0.5rem;
            }
            
            .meditation-timer {
                font-size: 1.5rem;
                color: #9c27b0;
                font-weight: bold;
                margin-bottom: 1rem;
            }
            
            .meditation-progress {
                width: 100%;
                height: 8px;
                background: #e0e0e0;
                border-radius: 4px;
                overflow: hidden;
            }
            
            .progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #9c27b0, #e91e63);
                width: 0%;
                transition: width 1s linear;
            }
            
            .meditation-controls {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    startMeditation() {
        this.meditationActive = true;
        this.meditationPaused = false;
        this.meditationTimeLeft = 600; // 10 minutes in seconds
        this.meditationTotalTime = 600;
        
        const startBtn = document.getElementById('startMeditationBtn');
        const pauseBtn = document.getElementById('pauseMeditationBtn');
        const resumeBtn = document.getElementById('resumeMeditationBtn');
        const circle = document.getElementById('meditationCircle');
        const text = document.getElementById('meditationText');
        
        if (startBtn) startBtn.style.display = 'none';
        if (pauseBtn) pauseBtn.style.display = 'inline-block';
        if (resumeBtn) resumeBtn.style.display = 'none';
        if (circle) circle.classList.add('active');
        if (text) text.textContent = 'Breathe naturally and observe your thoughts...';
        
        // Provide initial voice guidance
        this.speak('Welcome to your meditation session. Find a comfortable position and close your eyes. Breathe naturally and observe your thoughts without judgment.');
        
        this.runMeditationTimer();
    }
    
    runMeditationTimer() {
        if (!this.meditationActive || this.meditationPaused) return;
        
        const timer = document.getElementById('meditationTimer');
        const progressBar = document.getElementById('meditationProgress');
        
        if (timer) {
            const minutes = Math.floor(this.meditationTimeLeft / 60);
            const seconds = this.meditationTimeLeft % 60;
            timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        if (progressBar) {
            const progress = ((this.meditationTotalTime - this.meditationTimeLeft) / this.meditationTotalTime) * 100;
            progressBar.style.width = progress + '%';
        }
        
        if (this.meditationTimeLeft <= 0) {
            this.completeMeditation();
            return;
        }
        
        this.meditationTimeLeft--;
        
        setTimeout(() => this.runMeditationTimer(), 1000);
    }
    
    pauseMeditation() {
        this.meditationPaused = true;
        
        const pauseBtn = document.getElementById('pauseMeditationBtn');
        const resumeBtn = document.getElementById('resumeMeditationBtn');
        const circle = document.getElementById('meditationCircle');
        const text = document.getElementById('meditationText');
        
        if (pauseBtn) pauseBtn.style.display = 'none';
        if (resumeBtn) resumeBtn.style.display = 'inline-block';
        if (circle) circle.classList.remove('active');
        if (text) text.textContent = 'Meditation paused';
    }
    
    resumeMeditation() {
        this.meditationPaused = false;
        
        const pauseBtn = document.getElementById('pauseMeditationBtn');
        const resumeBtn = document.getElementById('resumeMeditationBtn');
        const circle = document.getElementById('meditationCircle');
        const text = document.getElementById('meditationText');
        
        if (pauseBtn) pauseBtn.style.display = 'inline-block';
        if (resumeBtn) resumeBtn.style.display = 'none';
        if (circle) circle.classList.add('active');
        if (text) text.textContent = 'Breathe naturally and observe your thoughts...';
        
        this.runMeditationTimer();
    }
    
    completeMeditation() {
        this.meditationActive = false;
        
        const startBtn = document.getElementById('startMeditationBtn');
        const pauseBtn = document.getElementById('pauseMeditationBtn');
        const resumeBtn = document.getElementById('resumeMeditationBtn');
        const circle = document.getElementById('meditationCircle');
        const text = document.getElementById('meditationText');
        const progressBar = document.getElementById('meditationProgress');
        
        if (startBtn) startBtn.style.display = 'inline-block';
        if (pauseBtn) pauseBtn.style.display = 'none';
        if (resumeBtn) resumeBtn.style.display = 'none';
        if (circle) circle.classList.remove('active');
        if (text) text.textContent = 'Meditation complete! Take a moment to notice how you feel.';
        if (progressBar) progressBar.style.width = '100%';
        
        // Provide completion voice guidance
        this.speak('Congratulations on completing your meditation session. Take a moment to notice how you feel. You may open your eyes when ready.');
        
        // Show completion message
        setTimeout(() => {
            if (text) text.textContent = 'Ready to begin meditation?';
            if (progressBar) progressBar.style.width = '0%';
        }, 5000);
    }
    
    closeMeditation() {
        this.meditationActive = false;
        this.meditationPaused = false;
        const modal = document.getElementById('meditationModal');
        if (modal) {
            modal.remove();
        }
    }
    
    createSelfCareRoutineModal() {
        // Remove existing modal if present
        const existingModal = document.getElementById('selfCareRoutineModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal overlay structure
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'selfCareRoutineModal';
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
            <div class="modal-content selfcare-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-heart"></i> Daily Self-Care Routine</h3>
                    <button class="modal-close" onclick="window.crisisSupportManager.closeSelfCareRoutine()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="selfcare-intro">
                        <h4>Build a personalized self-care routine that fits your lifestyle and needs.</h4>
                        <div class="selfcare-badge">
                            <i class="fas fa-star"></i>
                            <span>Beginner Friendly</span>
                        </div>
                    </div>
                    
                    <div class="selfcare-lifestyle-selector">
                        <h5>What's your daily schedule like?</h5>
                        <div class="lifestyle-options">
                            <button class="lifestyle-btn" data-lifestyle="busy" onclick="window.crisisSupportManager.selectLifestyle('busy')">
                                <i class="fas fa-briefcase"></i>
                                <span>Busy Professional</span>
                                <small>15-30 min daily</small>
                            </button>
                            <button class="lifestyle-btn" data-lifestyle="moderate" onclick="window.crisisSupportManager.selectLifestyle('moderate')">
                                <i class="fas fa-clock"></i>
                                <span>Moderate Schedule</span>
                                <small>30-60 min daily</small>
                            </button>
                            <button class="lifestyle-btn" data-lifestyle="relaxed" onclick="window.crisisSupportManager.selectLifestyle('relaxed')">
                                <i class="fas fa-leaf"></i>
                                <span>Relaxed Lifestyle</span>
                                <small>60+ min daily</small>
                            </button>
                        </div>
                    </div>
                    
                    <div class="selfcare-focus-selector">
                        <h5>What would you like to focus on?</h5>
                        <div class="focus-options">
                            <label class="focus-option">
                                <input type="checkbox" value="stress" onchange="window.crisisSupportManager.updateFocus()">
                                <i class="fas fa-brain"></i>
                                <span>Stress Relief</span>
                            </label>
                            <label class="focus-option">
                                <input type="checkbox" value="energy" onchange="window.crisisSupportManager.updateFocus()">
                                <i class="fas fa-bolt"></i>
                                <span>Energy Boost</span>
                            </label>
                            <label class="focus-option">
                                <input type="checkbox" value="sleep" onchange="window.crisisSupportManager.updateFocus()">
                                <i class="fas fa-moon"></i>
                                <span>Better Sleep</span>
                            </label>
                            <label class="focus-option">
                                <input type="checkbox" value="mood" onchange="window.crisisSupportManager.updateFocus()">
                                <i class="fas fa-smile"></i>
                                <span>Mood Enhancement</span>
                            </label>
                            <label class="focus-option">
                                <input type="checkbox" value="mindfulness" onchange="window.crisisSupportManager.updateFocus()">
                                <i class="fas fa-spa"></i>
                                <span>Mindfulness</span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="selfcare-preview" id="routinePreview" style="display: none;">
                        <h5>Your Personalized Routine</h5>
                        <div class="routine-steps" id="routineSteps">
                            <!-- Routine steps will be populated here -->
                        </div>
                    </div>
                    
                    <div class="selfcare-actions">
                        <button class="start-routine-btn" id="startRoutineBtn" onclick="window.crisisSupportManager.startSelfCareRoutine()" disabled>
                            <i class="fas fa-play"></i>
                            Start Routine
                        </button>
                        <button class="save-routine-btn" onclick="window.crisisSupportManager.saveSelfCareRoutine()">
                            <i class="fas fa-save"></i>
                            Save for Later
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalOverlay);
        
        // Add modal styles
        this.addSelfCareModalStyles();
        
        // Show modal with animation
        setTimeout(() => {
            modalOverlay.classList.add('active');
        }, 10);
    }
    
    closeSelfCareRoutine() {
        const modal = document.getElementById('selfCareRoutineModal');
        if (modal) {
            modal.remove();
        }
    }
    
    selectLifestyle(lifestyle) {
        // Remove active class from all buttons
        document.querySelectorAll('.lifestyle-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to selected button
        document.querySelector(`[data-lifestyle="${lifestyle}"]`).classList.add('active');
        
        this.selectedLifestyle = lifestyle;
        this.updateRoutinePreview();
    }
    
    updateFocus() {
        const checkboxes = document.querySelectorAll('.focus-option input[type="checkbox"]');
        this.selectedFocus = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        this.updateRoutinePreview();
    }
    
    updateRoutinePreview() {
        if (!this.selectedLifestyle || !this.selectedFocus || this.selectedFocus.length === 0) {
            const preview = document.getElementById('routinePreview');
            const startBtn = document.getElementById('startRoutineBtn');
            
            if (preview) preview.style.display = 'none';
            if (startBtn) startBtn.disabled = true;
            return;
        }
        
        const routine = this.generateRoutine();
        const stepsContainer = document.getElementById('routineSteps');
        
        stepsContainer.innerHTML = routine.map((step, index) => `
            <div class="routine-step">
                <span class="step-number">${index + 1}</span>
                <div class="step-content">
                    <h6>${step.title}</h6>
                    <p>${step.description}</p>
                    <span class="step-duration">${step.duration}</span>
                </div>
            </div>
        `).join('');
        
        document.getElementById('routinePreview').style.display = 'block';
        document.getElementById('startRoutineBtn').disabled = false;
    }
    
    generateRoutine() {
        // Validate required properties
        if (!this.selectedLifestyle || !this.selectedFocus || this.selectedFocus.length === 0) {
            console.warn('Cannot generate routine: missing lifestyle or focus selection');
            return [];
        }
        
        const routines = {
            busy: {
                stress: [
                    { title: 'Morning Breathing', description: '4-7-8 breathing exercise to start your day calm', duration: '5 min' },
                    { title: 'Quick Stretch', description: 'Simple stretches to release tension', duration: '3 min' },
                    { title: 'Gratitude Moment', description: 'Think of 3 things you\'re grateful for', duration: '2 min' }
                ],
                energy: [
                    { title: 'Hydration Check', description: 'Drink a glass of water', duration: '1 min' },
                    { title: 'Power Stretch', description: 'Quick energizing movements', duration: '4 min' },
                    { title: 'Positive Affirmation', description: 'Repeat a positive statement', duration: '2 min' }
                ],
                sleep: [
                    { title: 'Digital Detox', description: 'Put away screens 30 min before bed', duration: '30 min' },
                    { title: 'Evening Breathing', description: 'Calming breathwork', duration: '5 min' },
                    { title: 'Gratitude Journal', description: 'Write down 3 positive things', duration: '3 min' }
                ],
                mood: [
                    { title: 'Smile Practice', description: 'Smile at yourself in the mirror', duration: '1 min' },
                    { title: 'Quick Meditation', description: 'Focus on your breath', duration: '3 min' },
                    { title: 'Music Break', description: 'Listen to your favorite song', duration: '4 min' }
                ],
                mindfulness: [
                    { title: 'Mindful Minute', description: 'Focus on present moment', duration: '1 min' },
                    { title: 'Body Scan', description: 'Quick body awareness check', duration: '3 min' },
                    { title: 'Breathing Awareness', description: 'Focus on natural breathing', duration: '2 min' }
                ]
            },
            moderate: {
                stress: [
                    { title: 'Morning Meditation', description: '10-minute guided meditation', duration: '10 min' },
                    { title: 'Yoga Flow', description: 'Gentle yoga sequence', duration: '15 min' },
                    { title: 'Journaling', description: 'Write about your thoughts and feelings', duration: '10 min' },
                    { title: 'Nature Walk', description: 'Walk in nature and observe surroundings', duration: '15 min' }
                ],
                energy: [
                    { title: 'Morning Exercise', description: 'Light cardio or stretching', duration: '20 min' },
                    { title: 'Healthy Breakfast', description: 'Nutritious meal planning', duration: '15 min' },
                    { title: 'Power Nap', description: 'Short restorative nap', duration: '20 min' },
                    { title: 'Hydration Routine', description: 'Regular water intake schedule', duration: '5 min' }
                ],
                sleep: [
                    { title: 'Evening Routine', description: 'Consistent bedtime schedule', duration: '30 min' },
                    { title: 'Sleep Meditation', description: 'Guided sleep meditation', duration: '15 min' },
                    { title: 'Herbal Tea', description: 'Calming caffeine-free tea', duration: '10 min' },
                    { title: 'Reading Time', description: 'Relaxing book reading', duration: '20 min' }
                ],
                mood: [
                    { title: 'Creative Expression', description: 'Draw, write, or create something', duration: '20 min' },
                    { title: 'Social Connection', description: 'Call or meet with a friend', duration: '15 min' },
                    { title: 'Music Therapy', description: 'Listen to uplifting music', duration: '15 min' },
                    { title: 'Laughter Break', description: 'Watch something funny', duration: '10 min' }
                ],
                mindfulness: [
                    { title: 'Meditation Session', description: '20-minute mindfulness practice', duration: '20 min' },
                    { title: 'Mindful Eating', description: 'Eat with full attention', duration: '15 min' },
                    { title: 'Walking Meditation', description: 'Mindful walking practice', duration: '15 min' },
                    { title: 'Gratitude Practice', description: 'Daily gratitude exercises', duration: '10 min' }
                ]
            },
            relaxed: {
                stress: [
                    { title: 'Extended Meditation', description: '30-minute deep meditation', duration: '30 min' },
                    { title: 'Full Yoga Session', description: 'Complete yoga practice', duration: '45 min' },
                    { title: 'Therapeutic Journaling', description: 'Deep emotional processing', duration: '30 min' },
                    { title: 'Nature Immersion', description: 'Extended time in nature', duration: '60 min' },
                    { title: 'Massage/Spa', description: 'Self-massage or spa treatment', duration: '30 min' }
                ],
                energy: [
                    { title: 'Full Workout', description: 'Complete exercise routine', duration: '45 min' },
                    { title: 'Meal Planning', description: 'Plan and prepare healthy meals', duration: '30 min' },
                    { title: 'Sunlight Exposure', description: 'Get natural sunlight', duration: '20 min' },
                    { title: 'Power Rest', description: 'Extended relaxation time', duration: '30 min' },
                    { title: 'Supplement Routine', description: 'Vitamin and supplement schedule', duration: '10 min' }
                ],
                sleep: [
                    { title: 'Complete Wind-down', description: 'Full evening relaxation routine', duration: '60 min' },
                    { title: 'Sleep Yoga', description: 'Gentle yoga for sleep', duration: '30 min' },
                    { title: 'Aromatherapy', description: 'Essential oils for relaxation', duration: '15 min' },
                    { title: 'Sleep Stories', description: 'Listen to calming stories', duration: '30 min' },
                    { title: 'Temperature Control', description: 'Optimize sleep environment', duration: '10 min' }
                ],
                mood: [
                    { title: 'Creative Project', description: 'Work on a creative hobby', duration: '60 min' },
                    { title: 'Social Gathering', description: 'Meet with friends or family', duration: '45 min' },
                    { title: 'Music Creation', description: 'Play an instrument or create music', duration: '30 min' },
                    { title: 'Dance Therapy', description: 'Expressive dance movement', duration: '30 min' },
                    { title: 'Art Therapy', description: 'Expressive art activities', duration: '45 min' }
                ],
                mindfulness: [
                    { title: 'Extended Meditation', description: '45-minute mindfulness session', duration: '45 min' },
                    { title: 'Mindful Movement', description: 'Tai chi or qigong practice', duration: '30 min' },
                    { title: 'Silent Retreat', description: 'Period of silent contemplation', duration: '30 min' },
                    { title: 'Mindful Chores', description: 'Practice mindfulness during daily tasks', duration: '30 min' },
                    { title: 'Gratitude Ritual', description: 'Extended gratitude practice', duration: '20 min' }
                ]
            }
        };
        
        let routine = [];
        
        // Check if the selected lifestyle exists in routines
        if (!routines[this.selectedLifestyle]) {
            console.warn(`Lifestyle "${this.selectedLifestyle}" not found in routines`);
            return [];
        }
        
        this.selectedFocus.forEach(focus => {
            if (routines[this.selectedLifestyle][focus]) {
                routine = routine.concat(routines[this.selectedLifestyle][focus]);
            } else {
                console.warn(`Focus "${focus}" not found for lifestyle "${this.selectedLifestyle}"`);
            }
        });
        
        return routine.slice(0, 6); // Limit to 6 steps maximum
    }
    
    startSelfCareRoutine() {
        console.log('startSelfCareRoutine called');
        
        // Check if required selections are made
        if (!this.selectedLifestyle || !this.selectedFocus || this.selectedFocus.length === 0) {
            console.error('Missing required selections:', { lifestyle: this.selectedLifestyle, focus: this.selectedFocus });
            alert('Please select your lifestyle and focus areas first.');
            return;
        }
        
        const routine = this.generateRoutine();
        console.log('Generated routine:', routine);
        
        if (!routine || routine.length === 0) {
            console.error('Failed to generate routine');
            alert('Failed to generate routine. Please try again.');
            return;
        }
        
        this.currentRoutineStep = 0;
        this.routineActive = true;
        
        console.log('Closing self-care routine modal');
        // Close the modal and start the routine
        this.closeSelfCareRoutine();
        
        // Small delay to ensure modal is closed before showing progress
        setTimeout(() => {
            console.log('Showing routine progress modal');
            // Show routine progress modal
            this.showRoutineProgress(routine);
        }, 100);
    }
    
    showRoutineProgress(routine) {
        console.log('showRoutineProgress called with routine:', routine);
        
        if (!routine || routine.length === 0) {
            console.error('Invalid routine passed to showRoutineProgress');
            return;
        }
        
        // Remove existing modal if present
        const existingModal = document.getElementById('routineProgressModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        console.log('Creating routine progress modal');
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'routineProgressModal';
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
            <div class="modal-content routine-progress-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-heart"></i> Your Self-Care Routine</h3>
                    <button class="modal-close" onclick="window.crisisSupportManager.closeRoutineProgress()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="routine-progress-header">
                        <div class="progress-info">
                            <h4 id="currentStepTitle">${routine[0].title}</h4>
                            <p id="currentStepDesc">${routine[0].description}</p>
                            <span class="step-duration">${routine[0].duration}</span>
                        </div>
                        <div class="progress-counter">
                            <span id="stepCounter">1 / ${routine.length}</span>
                        </div>
                    </div>
                    
                    <div class="routine-progress-bar">
                        <div class="progress-fill" id="routineProgressFill" style="width: ${(1/routine.length) * 100}%"></div>
                    </div>
                    
                    <div class="routine-controls">
                        <button class="complete-step-btn" onclick="window.crisisSupportManager.completeRoutineStep()">
                            <i class="fas fa-check"></i>
                            Complete Step
                        </button>
                        <button class="skip-step-btn" onclick="window.crisisSupportManager.skipRoutineStep()">
                            <i class="fas fa-forward"></i>
                            Skip
                        </button>
                        <button class="end-routine-btn" onclick="window.crisisSupportManager.endRoutine()">
                            <i class="fas fa-stop"></i>
                            End Routine
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalOverlay);
        console.log('Modal added to DOM, checking if it exists:', document.getElementById('routineProgressModal') !== null);
        
        // Show modal with animation
        setTimeout(() => {
            console.log('Adding active class to modal');
            modalOverlay.classList.add('active');
            console.log('Modal active class added, checking visibility:', modalOverlay.classList.contains('active'));
        }, 10);
        
        // Store current routine
        this.currentRoutine = routine;
        console.log('Current routine stored:', this.currentRoutine);
        
        // Provide voice guidance
        this.speak(`Starting your self-care routine. First step: ${routine[0].title}. ${routine[0].description}`);
    }
    
    completeRoutineStep() {
        this.currentRoutineStep++;
        
        if (this.currentRoutineStep >= this.currentRoutine.length) {
            this.completeRoutine();
            return;
        }
        
        this.updateRoutineProgress();
    }
    
    skipRoutineStep() {
        this.currentRoutineStep++;
        
        if (this.currentRoutineStep >= this.currentRoutine.length) {
            this.completeRoutine();
            return;
        }
        
        this.updateRoutineProgress();
    }
    
    updateRoutineProgress() {
        const step = this.currentRoutine[this.currentRoutineStep];
        const progress = ((this.currentRoutineStep + 1) / this.currentRoutine.length) * 100;
        
        document.getElementById('currentStepTitle').textContent = step.title;
        document.getElementById('currentStepDesc').textContent = step.description;
        document.querySelector('.step-duration').textContent = step.duration;
        document.getElementById('stepCounter').textContent = `${this.currentRoutineStep + 1} / ${this.currentRoutine.length}`;
        document.getElementById('routineProgressFill').style.width = `${progress}%`;
        
        // Provide voice guidance
        this.speak(`Next step: ${step.title}. ${step.description}`);
    }
    
    completeRoutine() {
        this.routineActive = false;
        this.closeRoutineProgress();
        
        // Show completion message
        setTimeout(() => {
            alert('Congratulations! You have completed your self-care routine. Keep up the great work!');
        }, 500);
        
        // Provide voice guidance
        this.speak('Congratulations! You have completed your self-care routine. Keep up the great work!');
    }
    
    endRoutine() {
        this.routineActive = false;
        this.closeRoutineProgress();
    }
    
    closeRoutineProgress() {
        const modal = document.getElementById('routineProgressModal');
        if (modal) {
            modal.remove();
        }
    }
    
    saveSelfCareRoutine() {
        if (!this.selectedLifestyle || this.selectedFocus.length === 0) {
            alert('Please select your lifestyle and focus areas first.');
            return;
        }
        
        const routine = {
            lifestyle: this.selectedLifestyle,
            focus: this.selectedFocus,
            steps: this.generateRoutine(),
            savedAt: new Date().toISOString()
        };
        
        // Save to localStorage
        localStorage.setItem('savedSelfCareRoutine', JSON.stringify(routine));
        
        alert('Your self-care routine has been saved! You can access it anytime.');
        
        // Provide voice guidance
        this.speak('Your self-care routine has been saved successfully.');
    }
    
    addSelfCareModalStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            .selfcare-modal {
                max-width: 700px;
                width: 90%;
            }
            
            .selfcare-intro {
                text-align: center;
                margin-bottom: 2rem;
            }
            
            .selfcare-intro h4 {
                color: var(--primary-color, #4a90e2);
                margin-bottom: 1rem;
                font-size: 1.3rem;
            }
            
            .selfcare-badge {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                background: var(--success-color, #28a745);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 600;
            }
            
            .selfcare-lifestyle-selector,
            .selfcare-focus-selector {
                margin-bottom: 2rem;
            }
            
            .selfcare-lifestyle-selector h5,
            .selfcare-focus-selector h5 {
                color: var(--text-primary, #333);
                margin-bottom: 1rem;
                font-size: 1.1rem;
            }
            
            .lifestyle-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }
            
            .lifestyle-btn {
                background: var(--background-light, #f8f9fa);
                border: 2px solid var(--border-color, #e9ecef);
                padding: 1.5rem;
                border-radius: 8px;
                cursor: pointer;
                text-align: center;
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
            }
            
            .lifestyle-btn:hover {
                border-color: var(--primary-color, #4a90e2);
                transform: translateY(-2px);
            }
            
            .lifestyle-btn.active {
                background: var(--primary-color, #4a90e2);
                color: white;
                border-color: var(--primary-color, #4a90e2);
            }
            
            .lifestyle-btn i {
                font-size: 2rem;
                margin-bottom: 0.5rem;
            }
            
            .lifestyle-btn span {
                font-weight: 600;
                font-size: 1rem;
            }
            
            .lifestyle-btn small {
                color: var(--text-secondary, #666);
                font-size: 0.8rem;
            }
            
            .lifestyle-btn.active small {
                color: rgba(255, 255, 255, 0.8);
            }
            
            .focus-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
            }
            
            .focus-option {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 1rem;
                background: var(--background-light, #f8f9fa);
                border: 2px solid var(--border-color, #e9ecef);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .focus-option:hover {
                border-color: var(--primary-color, #4a90e2);
            }
            
            .focus-option input[type="checkbox"] {
                width: 18px;
                height: 18px;
                accent-color: var(--primary-color, #4a90e2);
            }
            
            .focus-option i {
                font-size: 1.2rem;
                color: var(--primary-color, #4a90e2);
            }
            
            .focus-option span {
                font-weight: 500;
            }
            
            .selfcare-preview {
                background: var(--background-light, #f8f9fa);
                padding: 1.5rem;
                border-radius: 8px;
                margin-bottom: 2rem;
                border: 1px solid var(--border-color, #e9ecef);
            }
            
            .selfcare-preview h5 {
                color: var(--primary-color, #4a90e2);
                margin-bottom: 1rem;
            }
            
            .routine-steps {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .routine-step {
                display: flex;
                gap: 1rem;
                align-items: flex-start;
            }
            
            .step-number {
                background: var(--primary-color, #4a90e2);
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                flex-shrink: 0;
            }
            
            .step-content {
                flex: 1;
            }
            
            .step-content h6 {
                color: var(--text-primary, #333);
                margin: 0 0 0.5rem 0;
                font-size: 1rem;
            }
            
            .step-content p {
                color: var(--text-secondary, #666);
                margin: 0 0 0.5rem 0;
                font-size: 0.9rem;
            }
            
            .step-duration {
                background: var(--success-color, #28a745);
                color: white;
                padding: 0.2rem 0.5rem;
                border-radius: 4px;
                font-size: 0.8rem;
                font-weight: 600;
            }
            
            .selfcare-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .start-routine-btn {
                background: var(--success-color, #28a745);
                color: white;
                border: none;
                padding: 1rem 2rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                font-size: 1.1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
            }
            
            .start-routine-btn:hover:not(:disabled) {
                background: var(--success-hover, #218838);
                transform: translateY(-2px);
            }
            
            .start-routine-btn:disabled {
                background: var(--text-secondary, #666);
                cursor: not-allowed;
                opacity: 0.6;
            }
            
            .save-routine-btn {
                background: var(--primary-color, #4a90e2);
                color: white;
                border: none;
            padding: 1rem 2rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
        }
        
        .save-routine-btn:hover {
            background: var(--primary-hover, #357abd);
            transform: translateY(-2px);
        }
        
        .routine-progress-modal {
            max-width: 600px;
            width: 90%;
        }
        
        .routine-progress-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 2rem;
        }
        
        .progress-info h4 {
            color: var(--primary-color, #4a90e2);
            margin: 0 0 0.5rem 0;
            font-size: 1.3rem;
        }
        
        .progress-info p {
            color: var(--text-secondary, #666);
            margin: 0 0 1rem 0;
            line-height: 1.6;
        }
        
        .progress-counter {
            background: var(--primary-color, #4a90e2);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 600;
        }
        
        .routine-progress-bar {
            width: 100%;
            height: 12px;
            background: var(--background-light, #f8f9fa);
            border-radius: 6px;
            overflow: hidden;
            margin-bottom: 2rem;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--success-color, #28a745), var(--primary-color, #4a90e2));
            transition: width 0.5s ease;
        }
        
        .routine-controls {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .complete-step-btn {
            background: var(--success-color, #28a745);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
        }
        
        .complete-step-btn:hover {
            background: var(--success-hover, #218838);
            transform: translateY(-2px);
        }
        
        .skip-step-btn {
            background: var(--warning-color, #ffc107);
            color: var(--text-primary, #333);
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
        }
        
        .skip-step-btn:hover {
            background: var(--warning-hover, #e0a800);
            transform: translateY(-2px);
        }
        
        .end-routine-btn {
            background: var(--danger-color, #dc3545);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
        }
        
        .end-routine-btn:hover {
            background: var(--danger-hover, #c82333);
            transform: translateY(-2px);
        }
    `;
    
    document.head.appendChild(styles);
}
}

// Initialize crisis support manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.crisisSupportManager = new CrisisSupportManager();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CrisisSupportManager;
} else if (typeof window !== 'undefined') {
    window.CrisisSupportManager = CrisisSupportManager;
}

// Global function for backward compatibility with inline onclick handlers
function toggleCrisisSupport() {
    if (window.crisisSupportManager) {
        window.crisisSupportManager.toggleCrisisSupport();
    } else {
        // Crisis support functionality has been disabled
        console.log('Crisis support functionality has been disabled');
        
        // Try to initialize the crisis support manager
        if (typeof CrisisSupportManager !== 'undefined') {
            window.crisisSupportManager = new CrisisSupportManager();
            console.log('Crisis support manager initialized on demand');
        }
    }
}
