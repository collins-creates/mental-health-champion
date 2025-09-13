class LiveTherapistsManager {
    constructor() {
        this.therapists = [];
        this.groupSessions = [];
        this.filteredTherapists = [];
        this.filteredSessions = [];
        this.init();
    }

    init() {
        this.loadTherapists();
        this.loadGroupSessions();
        this.setupEventListeners();
        this.renderTherapists();
        this.renderGroupSessions();
        this.startLiveUpdates();
    }

    loadTherapists() {
        console.log('Loading therapists...');
        // In a real application, this would come from an API
        this.therapists = [
            {
                id: 1,
                name: "Collins Muguro",
                credentials: "Mental Health Counselor",
                specialty: "general",
                experience: "5+ years",
                rating: 4.8,
                reviews: 127,
                price: 75,
                availability: "now",
                nextAvailable: "Available Now",
                bio: "Compassionate mental health counselor dedicated to helping individuals navigate life's challenges and achieve emotional well-being.",
                approach: "Client-centered approach with cognitive behavioral therapy techniques and mindfulness practices.",
                education: "Master's in Counseling Psychology",
                languages: ["english", "swahili"],
                sessionTypes: ["individual", "couples"],
                phone: "0706587881",
                image: "https://picsum.photos/seed/collins-muguro/200/200.jpg"
            },
            {
                id: 2,
                name: "Dr. Sarah Johnson",
                credentials: "Clinical Psychologist",
                specialty: "anxiety",
                experience: "10+ years",
                rating: 4.9,
                reviews: 245,
                price: 120,
                availability: "unavailable",
                nextAvailable: "Currently Unavailable",
                bio: "Specialized in anxiety disorders and stress management with evidence-based therapeutic approaches.",
                approach: "Cognitive Behavioral Therapy (CBT) and mindfulness-based interventions.",
                education: "PhD in Clinical Psychology",
                languages: ["english"],
                sessionTypes: ["individual", "group"],
                phone: "0706587882",
                image: "https://picsum.photos/seed/sarah-johnson/200/200.jpg"
            },
            {
                id: 3,
                name: "Michael Chen",
                credentials: "Marriage and Family Therapist",
                specialty: "couples",
                experience: "8+ years",
                rating: 4.7,
                reviews: 189,
                price: 100,
                availability: "unavailable",
                nextAvailable: "Currently Unavailable",
                bio: "Dedicated to helping couples and families improve communication and build stronger relationships.",
                approach: "Emotionally Focused Therapy (EFT) and solution-focused brief therapy.",
                education: "Master's in Marriage and Family Therapy",
                languages: ["english", "mandarin"],
                sessionTypes: ["couples", "individual"],
                phone: "0706587883",
                image: "https://picsum.photos/seed/michael-chen/200/200.jpg"
            }
        ];
        this.filteredTherapists = [...this.therapists];
        console.log('Loaded', this.therapists.length, 'therapists');
    }

    loadGroupSessions() {
        // In a real application, this would come from an API
        this.groupSessions = [];
        this.filteredSessions = [];
    }

    setupEventListeners() {
        // Filter change listeners are handled by inline onchange attributes
        // Additional event listeners can be added here
    }

    renderTherapists() {
        console.log('Rendering therapists...');
        const grid = document.getElementById('therapists-grid');
        if (!grid) {
            console.error('therapists-grid element not found');
            return;
        }

        grid.innerHTML = '';
        console.log('Rendering', this.filteredTherapists.length, 'filtered therapists');

        this.filteredTherapists.forEach(therapist => {
            const therapistCard = this.createTherapistCard(therapist);
            grid.appendChild(therapistCard);
            console.log('Added therapist card for:', therapist.name);
        });

        if (this.filteredTherapists.length === 0) {
            grid.innerHTML = '<div class="no-results">No therapists found matching your criteria. Please try different filters.</div>';
        }
    }

    createTherapistCard(therapist) {
        const card = document.createElement('div');
        card.className = 'therapist-card';
        card.setAttribute('data-specialty', therapist.specialty);
        card.setAttribute('data-availability', therapist.availability);
        card.setAttribute('data-session-type', therapist.sessionTypes.join(','));
        card.setAttribute('data-language', therapist.languages.join(','));

        const availabilityBadge = therapist.availability === 'now' 
            ? '<span class="availability-badge live">Available Now</span>'
            : therapist.availability === 'unavailable'
            ? '<span class="availability-badge unavailable">Currently Unavailable</span>'
            : `<span class="availability-badge">${therapist.nextAvailable}</span>`;

        const sessionTypeIcons = therapist.sessionTypes.map(type => {
            const icons = {
                individual: 'fa-user',
                group: 'fa-users',
                couples: 'fa-heart'
            };
            return `<i class="fas ${icons[type]}" title="${type}"></i>`;
        }).join(' ');

        const isUnavailable = therapist.availability === 'unavailable';
        const bookingButton = isUnavailable 
            ? '<button class="btn btn-secondary" disabled>Currently Unavailable</button>'
            : `<button class="btn btn-primary" onclick="bookSession(${therapist.id})">
                ${therapist.availability === 'now' ? 'Join Now' : 'Book Session'}
              </button>`;

        card.innerHTML = `
            <div class="therapist-header">
                <img src="${therapist.image}" alt="${therapist.name}" class="therapist-image">
                <div class="therapist-info">
                    <h3>${therapist.name}</h3>
                    <p class="credentials">${therapist.credentials}</p>
                    <div class="therapist-meta">
                        <span class="experience">${therapist.experience} experience</span>
                        <span class="rating">
                            <i class="fas fa-star"></i> ${therapist.rating} (${therapist.reviews} reviews)
                        </span>
                    </div>
                </div>
            </div>
            <div class="therapist-body">
                <div class="specialty">
                    <i class="fas fa-tag"></i>
                    ${this.getSpecialtyName(therapist.specialty)}
                </div>
                <div class="bio">${therapist.bio}</div>
                <div class="therapist-details">
                    <div class="detail-item">
                        <i class="fas fa-language"></i>
                        ${therapist.languages.map(lang => lang.charAt(0).toUpperCase() + lang.slice(1)).join(', ')}
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-video"></i>
                        ${sessionTypeIcons}
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-dollar-sign"></i>
                        $${therapist.price}/session
                    </div>
                </div>
                ${availabilityBadge}
            </div>
            <div class="therapist-actions">
                ${bookingButton}
                <button class="btn btn-secondary" onclick="viewTherapistProfile(${therapist.id})">
                    View Profile
                </button>
            </div>
        `;

        return card;
    }

    renderGroupSessions() {
        const grid = document.getElementById('sessions-grid');
        if (!grid) return;

        grid.innerHTML = '';

        this.filteredSessions.forEach(session => {
            const sessionCard = this.createGroupSessionCard(session);
            grid.appendChild(sessionCard);
        });

        if (this.filteredSessions.length === 0) {
            grid.innerHTML = '<div class="no-results">No group sessions found matching your criteria.</div>';
        }
    }

    createGroupSessionCard(session) {
        const card = document.createElement('div');
        card.className = 'session-card';
        card.setAttribute('data-specialty', session.specialty);

        const spotsLeft = session.maxParticipants - session.participants;
        const availabilityClass = spotsLeft > 0 ? 'available' : 'full';
        const availabilityText = spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full';

        card.innerHTML = `
            <div class="session-header">
                <h3>${session.title}</h3>
                <span class="session-badge ${availabilityClass}">${availabilityText}</span>
            </div>
            <div class="session-body">
                <div class="session-info">
                    <div class="info-item">
                        <i class="fas fa-user-md"></i>
                        <span>${session.therapist}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-calendar"></i>
                        <span>${this.formatDate(session.date)} at ${session.time}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-clock"></i>
                        <span>${session.duration}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-users"></i>
                        <span>${session.participants}/${session.maxParticipants} participants</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-dollar-sign"></i>
                        <span>$${session.price}</span>
                    </div>
                </div>
                <div class="session-description">${session.description}</div>
            </div>
            <div class="session-actions">
                <button class="btn btn-primary" onclick="joinGroupSession(${session.id})" ${spotsLeft === 0 ? 'disabled' : ''}>
                    ${spotsLeft === 0 ? 'Session Full' : 'Join Session'}
                </button>
                <button class="btn btn-secondary" onclick="viewSessionDetails(${session.id})">
                    Details
                </button>
            </div>
        `;

        return card;
    }

    filterTherapists() {
        const specialty = document.getElementById('specialtyFilter').value;
        const availability = document.getElementById('availabilityFilter').value;
        const sessionType = document.getElementById('sessionTypeFilter').value;
        const language = document.getElementById('languageFilter').value;

        this.filteredTherapists = this.therapists.filter(therapist => {
            const specialtyMatch = specialty === 'all' || therapist.specialty === specialty;
            const availabilityMatch = availability === 'all' || therapist.availability === availability;
            const sessionTypeMatch = sessionType === 'all' || therapist.sessionTypes.includes(sessionType);
            const languageMatch = language === 'all' || therapist.languages.includes(language);

            return specialtyMatch && availabilityMatch && sessionTypeMatch && languageMatch;
        });

        this.renderTherapists();
    }

    filterGroupSessions() {
        const specialty = document.getElementById('specialtyFilter').value;
        
        this.filteredSessions = this.groupSessions.filter(session => {
            return specialty === 'all' || session.specialty === specialty;
        });

        this.renderGroupSessions();
    }

    getSpecialtyName(specialty) {
        const specialties = {
            anxiety: 'Anxiety & Stress',
            depression: 'Depression',
            trauma: 'Trauma & PTSD',
            relationships: 'Relationships',
            addiction: 'Addiction',
            grief: 'Grief & Loss',
            lgbtq: 'LGBTQ+',
            couples: 'Couples Therapy'
        };
        return specialties[specialty] || specialty;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    bookSession(therapistId) {
        console.log('bookSession called with therapistId:', therapistId);
        const therapist = this.therapists.find(t => t.id === therapistId);
        if (!therapist) {
            console.error('Therapist not found with id:', therapistId);
            return;
        }

        console.log('Found therapist:', therapist.name);
        // Show booking modal with Formspree form
        this.showBookingModal(therapist);
    }
    
    showBookingModal(therapist) {
        console.log('showBookingModal called for therapist:', therapist.name);
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-calendar-plus"></i> Book Session with ${therapist.name}</h3>
                    <button class="modal-close" onclick="closeBookingModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="therapist-info">
                        <div class="info-row">
                            <strong>Specialty:</strong>
                            <span>${this.getSpecialtyName(therapist.specialty)}</span>
                        </div>
                        <div class="info-row">
                            <strong>Price:</strong>
                            <span>$${therapist.price}/session</span>
                        </div>
                        <div class="info-row">
                            <strong>Credentials:</strong>
                            <span>${therapist.credentials}</span>
                        </div>
                    </div>
                    
                    <form action="https://formspree.io/f/xkgvepvz" method="POST" class="booking-form">
                        <input type="hidden" name="therapist_id" value="${therapist.id}">
                        <input type="hidden" name="therapist_name" value="${therapist.name}">
                        <input type="hidden" name="specialty" value="${therapist.specialty}">
                        <input type="hidden" name="price" value="${therapist.price}">
                        
                        <div class="form-group">
                            <label for="client_name">Your Name *</label>
                            <input type="text" id="client_name" name="client_name" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="client_email">Your Email *</label>
                            <input type="email" id="client_email" name="client_email" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="client_phone">Phone Number</label>
                            <input type="tel" id="client_phone" name="client_phone">
                        </div>
                        
                        <div class="form-group">
                            <label for="session_type">Session Type *</label>
                            <select id="session_type" name="session_type" required>
                                <option value="">Select session type</option>
                                ${therapist.sessionTypes.map(type => 
                                    `<option value="${type}">${type.charAt(0).toUpperCase() + type.slice(1)}</option>`
                                ).join('')}
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="preferred_date">Preferred Date *</label>
                            <input type="date" id="preferred_date" name="preferred_date" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="preferred_time">Preferred Time *</label>
                            <select id="preferred_time" name="preferred_time" required>
                                <option value="">Select time</option>
                                <option value="9:00 AM">9:00 AM</option>
                                <option value="10:00 AM">10:00 AM</option>
                                <option value="11:00 AM">11:00 AM</option>
                                <option value="1:00 PM">1:00 PM</option>
                                <option value="2:00 PM">2:00 PM</option>
                                <option value="3:00 PM">3:00 PM</option>
                                <option value="4:00 PM">4:00 PM</option>
                                <option value="5:00 PM">5:00 PM</option>
                                <option value="6:00 PM">6:00 PM</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="concerns">Your Concerns (Optional)</label>
                            <textarea id="concerns" name="concerns" rows="4" placeholder="Please briefly describe what you'd like to discuss in your session..."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="emergency_contact">Emergency Contact (Optional)</label>
                            <input type="text" id="emergency_contact" name="emergency_contact" placeholder="Name and phone number">
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" onclick="closeBookingModal()">Cancel</button>
                            <button type="submit" class="btn btn-primary">Submit Booking Request</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalOverlay);
        console.log('Booking modal added to DOM');
        
        // Show modal with animation
        setTimeout(() => {
            modalOverlay.classList.add('active');
            console.log('Booking modal activated');
        }, 10);
        
        // Set minimum date to today
        const dateInput = modalOverlay.querySelector('#preferred_date');
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        // Handle form submission
        const form = modalOverlay.querySelector('form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleBookingSubmission(form, therapist);
        });
    }
    
    handleBookingSubmission(form, therapist) {
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        // Submit to Formspree
        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                showNotification('Booking request submitted successfully! We will contact you soon to confirm your appointment.', 'success');
                closeBookingModal();
                this.logBookingAttempt(therapist.id, 'success');
            } else {
                throw new Error('Submission failed');
            }
        })
        .catch(error => {
            showNotification('There was an error submitting your booking request. Please try again.', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            this.logBookingAttempt(therapist.id, 'error');
        });
    }
    
    logBookingAttempt(therapistId, status) {
        // Log booking attempts for analytics
        const bookingHistory = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
        bookingHistory.push({
            therapistId,
            status,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('bookingHistory', JSON.stringify(bookingHistory));
    }

    viewTherapistProfile(therapistId) {
        const therapist = this.therapists.find(t => t.id === therapistId);
        if (!therapist) return;

        // In a real application, this would show a detailed profile modal or page
        alert(`${therapist.name}\n${therapist.credentials}\n\nExperience: ${therapist.experience}\nRating: ${therapist.rating}/5 (${therapist.reviews} reviews)\n\nBio: ${therapist.bio}\n\nApproach: ${therapist.approach}\n\nEducation: ${therapist.education}\n\nLanguages: ${therapist.languages.map(lang => lang.charAt(0).toUpperCase() + lang.slice(1)).join(', ')}\n\nSession Types: ${therapist.sessionTypes.join(', ')}\nPrice: $${therapist.price}/session`);
    }

    joinGroupSession(sessionId) {
        const session = this.groupSessions.find(s => s.id === sessionId);
        if (!session) return;

        const spotsLeft = session.maxParticipants - session.participants;
        if (spotsLeft <= 0) {
            alert('This session is full. Please try another session.');
            return;
        }

        // In a real application, this would handle payment and session joining
        alert(`Joining group session: ${session.title}\n\nDate: ${this.formatDate(session.date)}\nTime: ${session.time}\nDuration: ${session.duration}\nPrice: $${session.price}\n\nThis would handle payment and session joining in a real application.`);
    }

    viewSessionDetails(sessionId) {
        const session = this.groupSessions.find(s => s.id === sessionId);
        if (!session) return;

        // In a real application, this would show detailed session information
        alert(`${session.title}\nFacilitated by: ${session.therapist}\n\nDate: ${this.formatDate(session.date)}\nTime: ${session.time}\nDuration: ${session.duration}\nParticipants: ${session.participants}/${session.maxParticipants}\nPrice: $${session.price}\n\nDescription: ${session.description}`);
    }

    handleScheduledSession(sessionId) {
        const session = this.groupSessions.find(s => s.id === sessionId);
        if (!session) return;

        // In a real application, this would handle the scheduled session
        alert(`Handling scheduled session: ${session.title}\n\nDate: ${this.formatDate(session.date)}\nTime: ${session.time}\nDuration: ${session.duration}\nPrice: $${session.price}\n\nThis would handle the scheduled session in a real application.`);
    }

    updateTherapistAvailability() {
        // Simulate random availability changes for therapists
        this.therapists.forEach(therapist => {
            // Randomly change availability (in real app, this would come from API)
            const random = Math.random();
            if (random < 0.1) { // 10% chance to change availability
                therapist.availability = therapist.availability === 'now' ? 'soon' : 'now';
            }
        });
        
        // Re-render therapists to show updated availability
        this.renderTherapists();
    }
    
    startLiveUpdates() {
        // Simulate real-time updates for therapist availability
        setInterval(() => {
            this.updateTherapistAvailability();
        }, 30000); // Update every 30 seconds
        
        // Check for scheduled sessions and update their status
        setInterval(() => {
            this.checkScheduledSessions();
        }, 60000); // Check every minute
    }
    
    addScheduledSession(session) {
        // Add to scheduled sessions array
        if (!this.scheduledSessions) {
            this.scheduledSessions = [];
        }
        this.scheduledSessions.push(session);
        
        // Save to localStorage
        localStorage.setItem('scheduledSessions', JSON.stringify(this.scheduledSessions));
        
        // Show notification
        showNotification('Session added to your schedule!', 'success');
        
        // Update the display
        this.renderScheduledSessions();
    }
    
    checkScheduledSessions() {
        if (!this.scheduledSessions) return;
        
        const now = new Date();
        this.scheduledSessions.forEach(session => {
            const sessionTime = new Date(session.scheduledTime);
            const timeDiff = sessionTime - now;
            
            // Notify user 15 minutes before session
            if (timeDiff > 0 && timeDiff <= 15 * 60 * 1000 && session.status === 'scheduled') {
                this.notifyUpcomingSession(session);
                session.status = 'notified';
            }
            
            // Mark session as started
            if (timeDiff <= 0 && session.status !== 'completed') {
                session.status = 'live';
                this.notifySessionStarted(session);
            }
        });
        
        // Save updated sessions
        localStorage.setItem('scheduledSessions', JSON.stringify(this.scheduledSessions));
    }
    
    notifyUpcomingSession(session) {
        showNotification(`Your session with ${getTherapistName(session.sessionData.therapist)} starts in 15 minutes!`, 'info');
    }
    
    notifySessionStarted(session) {
        showNotification(`Your session with ${getTherapistName(session.sessionData.therapist)} has started!`, 'success');
        
        // Update the YouTube embed to show the live session
        this.updateLiveVideoEmbed(session);
    }
    
    updateLiveVideoEmbed(session) {
        const iframe = document.querySelector('.video-wrapper iframe');
        if (iframe && session.streamEmbedUrl) {
            iframe.src = session.streamEmbedUrl;
            
            // Update the video header to show session info
            const videoHeader = document.querySelector('.video-header h3');
            if (videoHeader) {
                videoHeader.textContent = `Live Session: ${getTherapistName(session.sessionData.therapist)}`;
            }
            
            // Enable the iframe
            iframe.style.pointerEvents = 'auto';
            iframe.style.opacity = '1';
        }
    }
    
    renderScheduledSessions() {
        // This would render scheduled sessions in a dedicated section
        // For now, we'll just log it
        console.log('Scheduled sessions:', this.scheduledSessions);
    }
}

// Global functions for HTML onclick handlers
function filterTherapists() {
    if (window.liveTherapistsManager) {
        window.liveTherapistsManager.filterTherapists();
        window.liveTherapistsManager.filterGroupSessions();
    }
}

function joinLiveSession() {
    // Show notification and simulate joining live session
    showNotification('Connecting to live session...', 'info');
    
    // Simulate connection delay
    setTimeout(() => {
        showNotification('Successfully joined the live session! You can now interact with the therapist.', 'success');
        
        // Enable the iframe for interaction
        const iframe = document.querySelector('.video-wrapper iframe');
        if (iframe) {
            iframe.style.pointerEvents = 'auto';
            iframe.style.opacity = '1';
        }
        
        // Log session participation
        logSessionParticipation('live');
    }, 2000);
}

function scheduleSession() {
    // Create and show scheduling modal
    showSchedulingModal();
}

function viewTherapistProfile() {
    showNotification('Loading therapist profile...', 'info');
    
    // In a real application, this would open a modal or navigate to a detailed profile
    setTimeout(() => {
        showNotification('Therapist profile feature coming soon!', 'info');
    }, 1000);
}

function showSchedulingModal() {
    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay" id="schedulingModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-calendar-plus"></i> Schedule Live Session</h3>
                    <button class="modal-close" onclick="closeSchedulingModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="schedulingForm">
                        <div class="form-group">
                            <label for="sessionType">Session Type:</label>
                            <select id="sessionType" required>
                                <option value="">Select session type</option>
                                <option value="individual">Individual Therapy</option>
                                <option value="group">Group Therapy</option>
                                <option value="couples">Couples Therapy</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="therapistSelect">Preferred Therapist:</label>
                            <select id="therapistSelect" required>
                                <option value="">Select therapist</option>
                                <option value="dr-sarah">Dr. Sarah Johnson</option>
                                <option value="dr-michael">Dr. Michael Chen</option>
                                <option value="dr-emily">Dr. Emily Rodriguez</option>
                                <option value="dr-james">Dr. James Wilson</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="sessionDate">Preferred Date:</label>
                            <input type="date" id="sessionDate" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="sessionTime">Preferred Time:</label>
                            <select id="sessionTime" required>
                                <option value="">Select time</option>
                                <option value="09:00">9:00 AM</option>
                                <option value="10:00">10:00 AM</option>
                                <option value="11:00">11:00 AM</option>
                                <option value="14:00">2:00 PM</option>
                                <option value="15:00">3:00 PM</option>
                                <option value="16:00">4:00 PM</option>
                                <option value="17:00">5:00 PM</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="sessionTopic">Session Topic (Optional):</label>
                            <textarea id="sessionTopic" rows="3" placeholder="What would you like to discuss in this session?"></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="youtubeStream">YouTube Stream Settings:</label>
                            <div class="youtube-options">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="makePublic" value="public">
                                    <span>Make session public on YouTube</span>
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" id="enableChat" value="chat" checked>
                                    <span>Enable live chat</span>
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" id="saveRecording" value="recording" checked>
                                    <span>Save recording for later viewing</span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" onclick="closeSchedulingModal()">Cancel</button>
                            <button type="submit" class="btn btn-primary">Schedule Session</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to the page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Set minimum date to today
    const dateInput = document.getElementById('sessionDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    
    // Add form submit handler
    document.getElementById('schedulingForm').addEventListener('submit', handleSchedulingSubmit);
    
    // Show modal with animation
    setTimeout(() => {
        document.getElementById('schedulingModal').classList.add('active');
    }, 100);
}

function closeSchedulingModal() {
    const modal = document.getElementById('schedulingModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function handleSchedulingSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = {
        sessionType: document.getElementById('sessionType').value,
        therapist: document.getElementById('therapistSelect').value,
        date: document.getElementById('sessionDate').value,
        time: document.getElementById('sessionTime').value,
        topic: document.getElementById('sessionTopic').value,
        youtubeSettings: {
            public: document.getElementById('makePublic').checked,
            chat: document.getElementById('enableChat').checked,
            recording: document.getElementById('saveRecording').checked
        }
    };
    
    // Show processing notification
    showNotification('Scheduling your session...', 'info');
    
    // Simulate API call to schedule session and create YouTube stream
    setTimeout(() => {
        const scheduledSession = scheduleYouTubeSession(formData);
        
        if (scheduledSession.success) {
            showNotification('Session scheduled successfully! YouTube stream will be available at the scheduled time.', 'success');
            
            // Show session details
            showSessionDetails(scheduledSession);
            
            // Close modal
            closeSchedulingModal();
            
            // Update upcoming sessions display
            if (window.liveTherapistsManager) {
                window.liveTherapistsManager.addScheduledSession(scheduledSession);
            }
        } else {
            showNotification('Failed to schedule session. Please try again.', 'error');
        }
    }, 2000);
}

function scheduleYouTubeSession(sessionData) {
    // Simulate YouTube API integration
    // In a real application, this would make actual API calls to YouTube Live Streaming API
    
    const sessionId = 'session_' + Date.now();
    const streamKey = 'stream_' + Math.random().toString(36).substr(2, 9);
    
    // Create YouTube stream URL (simulated)
    const youtubeStreamUrl = `https://www.youtube.com/watch?v=${sessionId}`;
    const streamEmbedUrl = `https://www.youtube.com/embed/${sessionId}`;
    
    // Calculate session datetime
    const sessionDateTime = new Date(`${sessionData.date}T${sessionData.time}:00`);
    
    return {
        success: true,
        sessionId: sessionId,
        streamKey: streamKey,
        youtubeStreamUrl: youtubeStreamUrl,
        streamEmbedUrl: streamEmbedUrl,
        sessionData: sessionData,
        scheduledTime: sessionDateTime.toISOString(),
        status: 'scheduled',
        youtubeSettings: sessionData.youtubeSettings
    };
}

function showSessionDetails(session) {
    // Create session details modal
    const detailsHTML = `
        <div class="modal-overlay" id="sessionDetailsModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-check-circle"></i> Session Scheduled Successfully</h3>
                    <button class="modal-close" onclick="closeSessionDetails()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="session-confirmation">
                        <div class="confirmation-icon">
                            <i class="fas fa-calendar-check"></i>
                        </div>
                        <h4>Your session has been scheduled!</h4>
                        
                        <div class="session-info">
                            <div class="info-row">
                                <strong>Date:</strong> ${new Date(session.sessionData.date).toLocaleDateString()}
                            </div>
                            <div class="info-row">
                                <strong>Time:</strong> ${session.sessionData.time}
                            </div>
                            <div class="info-row">
                                <strong>Therapist:</strong> ${getTherapistName(session.sessionData.therapist)}
                            </div>
                            <div class="info-row">
                                <strong>Session Type:</strong> ${session.sessionData.sessionType}
                            </div>
                            <div class="info-row">
                                <strong>Session ID:</strong> ${session.sessionId}
                            </div>
                        </div>
                        
                        <div class="youtube-info">
                            <h5><i class="fab fa-youtube"></i> YouTube Stream Information</h5>
                            <div class="info-row">
                                <strong>Stream URL:</strong> 
                                <a href="${session.youtubeStreamUrl}" target="_blank">${session.youtubeStreamUrl}</a>
                            </div>
                            <div class="info-row">
                                <strong>Stream Key:</strong> <code>${session.streamKey}</code>
                            </div>
                            <div class="info-row">
                                <strong>Public Stream:</strong> ${session.youtubeSettings.public ? 'Yes' : 'No'}
                            </div>
                            <div class="info-row">
                                <strong>Live Chat:</strong> ${session.youtubeSettings.chat ? 'Enabled' : 'Disabled'}
                            </div>
                            <div class="info-row">
                                <strong>Recording:</strong> ${session.youtubeSettings.recording ? 'Will be saved' : 'Not saved'}
                            </div>
                        </div>
                        
                        <div class="session-actions">
                            <button class="btn btn-primary" onclick="copyStreamKey('${session.streamKey}')">
                                <i class="fas fa-copy"></i> Copy Stream Key
                            </button>
                            <button class="btn btn-secondary" onclick="openYouTubeStream('${session.youtubeStreamUrl}')">
                                <i class="fab fa-youtube"></i> Open YouTube Stream
                            </button>
                            <button class="btn btn-info" onclick="addToCalendar('${session.sessionId}')">
                                <i class="fas fa-calendar-plus"></i> Add to Calendar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to the page
    document.body.insertAdjacentHTML('beforeend', detailsHTML);
    
    // Show modal with animation
    setTimeout(() => {
        document.getElementById('sessionDetailsModal').classList.add('active');
    }, 100);
}

function closeSessionDetails() {
    const modal = document.getElementById('sessionDetailsModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function getTherapistName(therapistId) {
    const therapists = {
        'dr-sarah': 'Dr. Sarah Johnson',
        'dr-michael': 'Dr. Michael Chen',
        'dr-emily': 'Dr. Emily Rodriguez',
        'dr-james': 'Dr. James Wilson'
    };
    return therapists[therapistId] || 'Unknown Therapist';
}

function copyStreamKey(streamKey) {
    navigator.clipboard.writeText(streamKey).then(() => {
        showNotification('Stream key copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy stream key.', 'error');
    });
}

function openYouTubeStream(url) {
    window.open(url, '_blank');
}

function addToCalendar(sessionId) {
    // Simulate adding to calendar
    showNotification('Adding session to calendar...', 'info');
    setTimeout(() => {
        showNotification('Session added to calendar successfully!', 'success');
    }, 1000);
}

function logSessionParticipation(type) {
    // Log session participation for analytics
    const participationData = {
        type: type,
        timestamp: new Date().toISOString(),
        sessionId: type === 'live' ? 'current_live_session' : 'scheduled_session'
    };
    
    // In a real application, this would send data to analytics service
    console.log('Session participation logged:', participationData);
    
    // Store in localStorage for session history
    let sessionHistory = JSON.parse(localStorage.getItem('sessionHistory') || '[]');
    sessionHistory.push(participationData);
    localStorage.setItem('sessionHistory', JSON.stringify(sessionHistory));
}

function bookSession(therapistId) {
    console.log('Global bookSession called with therapistId:', therapistId);
    if (window.liveTherapistsManager) {
        console.log('Calling liveTherapistsManager.bookSession');
        window.liveTherapistsManager.bookSession(therapistId);
    } else {
        console.error('liveTherapistsManager not available');
        showNotification('Therapist booking system not available', 'error');
    }
}

function viewTherapistProfile(therapistId) {
    if (window.liveTherapistsManager) {
        window.liveTherapistsManager.viewTherapistProfile(therapistId);
    }
}

function joinGroupSession(sessionId) {
    if (window.liveTherapistsManager) {
        window.liveTherapistsManager.joinGroupSession(sessionId);
    }
}

function viewSessionDetails(sessionId) {
    if (window.liveTherapistsManager) {
        window.liveTherapistsManager.viewSessionDetails(sessionId);
    }
}

function scrollToTherapists() {
    const section = document.getElementById('therapists-section');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function showEmergencyInfo() {
    if (window.toggleCrisisSupport) {
        window.toggleCrisisSupport();
    }
}

function toggleFAQ(element) {
    const content = element.nextElementSibling;
    const icon = element.querySelector('i');
    const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';
    
    if (isOpen) {
        content.style.maxHeight = '0';
        content.style.padding = '0 var(--spacing-lg)';
        icon.style.transform = 'rotate(0deg)';
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.padding = 'var(--spacing-lg)';
        icon.style.transform = 'rotate(180deg)';
    }
}

// Global function to close booking modal
function closeBookingModal() {
    const modalOverlay = document.querySelector('.modal-overlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        setTimeout(() => {
            modalOverlay.remove();
        }, 300);
    }
}

// Global notification function
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Set icon based on type
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Initialize the live therapists manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.liveTherapistsManager = new LiveTherapistsManager();
});

// Booking functions for pricing cards
function bookIndividualSession(event) {
    console.log('bookIndividualSession called');
    
    // Prevent default button behavior that might cause page jump
    if (event) {
        event.preventDefault();
    }
    
    if (window.liveTherapistsManager) {
        try {
            // Filter for individual sessions
            const sessionTypeFilter = document.getElementById('sessionTypeFilter');
            
            if (sessionTypeFilter) {
                sessionTypeFilter.value = 'individual';
                window.liveTherapistsManager.filterTherapists();
            }
            
            // Show a notification to select a therapist
            showNotification('Please select a therapist from the list below to book your individual session', 'info');
            
            // Scroll to therapists section so user can select a therapist
            const therapistsSection = document.getElementById('therapists-section');
            if (therapistsSection) {
                therapistsSection.scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
        } catch (error) {
            console.error('Error in bookIndividualSession:', error);
            showNotification('Error booking individual session', 'error');
        }
    } else {
        console.error('liveTherapistsManager not available');
        showNotification('Therapist booking system not available', 'error');
    }
}

function bookGroupSession(event) {
    console.log('bookGroupSession called');
    
    // Prevent default button behavior that might cause page jump
    if (event) {
        event.preventDefault();
    }
    
    if (window.liveTherapistsManager) {
        try {
            // Show a notification about group sessions
            showNotification('Please browse the upcoming group sessions below and click "Join Session" to register', 'info');
            
            // Scroll to group sessions section
            const sessionsSection = document.getElementById('sessions-section');
            if (sessionsSection) {
                sessionsSection.scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
        } catch (error) {
            console.error('Error in bookGroupSession:', error);
            showNotification('Error booking group session', 'error');
        }
    } else {
        console.error('liveTherapistsManager not available');
        showNotification('Group session booking not available', 'error');
    }
}

function bookCouplesSession(event) {
    console.log('bookCouplesSession called');
    
    // Prevent default button behavior that might cause page jump
    if (event) {
        event.preventDefault();
    }
    
    if (window.liveTherapistsManager) {
        try {
            // Filter for couples therapy
            const specialtyFilter = document.getElementById('specialtyFilter');
            const sessionTypeFilter = document.getElementById('sessionTypeFilter');
            
            if (specialtyFilter && sessionTypeFilter) {
                specialtyFilter.value = 'couples';
                sessionTypeFilter.value = 'couples';
                window.liveTherapistsManager.filterTherapists();
            }
            
            // Show a notification to select a therapist
            showNotification('Please select a therapist from the list below to book your couples session', 'info');
            
            // Scroll to therapists section so user can select a therapist
            const therapistsSection = document.getElementById('therapists-section');
            if (therapistsSection) {
                therapistsSection.scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
        } catch (error) {
            console.error('Error in bookCouplesSession:', error);
            showNotification('Error booking couples session', 'error');
        }
    } else {
        console.error('liveTherapistsManager not available');
        showNotification('Couples session booking not available', 'error');
    }
}
