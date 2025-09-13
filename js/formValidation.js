/**
 * Form Validation Module - Mental Health Champion
 * Handles form validation for contact forms, community posts, and mood tracking
 */

class FormValidator {
    constructor() {
        this.forms = {};
        this.validationRules = {
            required: (value) => value.trim() !== '',
            email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            phone: (value) => /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, '')),
            minLength: (value, min) => value.length >= min,
            maxLength: (value, max) => value.length <= max,
            pattern: (value, regex) => new RegExp(regex).test(value),
            noSpecialChars: (value) => /^[a-zA-Z0-9\s.,!?-]+$/.test(value),
            safeContent: (value) => {
                // Basic content safety check
                const harmfulPatterns = [
                    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                    /javascript:/gi,
                    /on\w+\s*=/gi
                ];
                return !harmfulPatterns.some(pattern => pattern.test(value));
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupFormValidation();
        this.setupRealTimeValidation();
    }
    
    setupFormValidation() {
        // Contact form validation
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            this.setupContactForm(contactForm);
        }
        
        // Community post form validation
        const postForm = document.getElementById('postForm');
        if (postForm) {
            this.setupCommunityForm(postForm);
        }
        
        // Mood tracker form validation
        const moodForm = document.getElementById('moodForm');
        if (moodForm) {
            this.setupMoodForm(moodForm);
        }
        
        // Resource request form validation
        const resourceForm = document.getElementById('resourceForm');
        if (resourceForm) {
            this.setupResourceForm(resourceForm);
        }
    }
    
    setupContactForm(form) {
        const rules = {
            name: {
                required: true,
                minLength: 2,
                maxLength: 50,
                noSpecialChars: true
            },
            email: {
                required: true,
                email: true
            },
            phone: {
                required: false,
                phone: true
            },
            subject: {
                required: true,
                minLength: 5,
                maxLength: 100,
                noSpecialChars: true
            },
            message: {
                required: true,
                minLength: 10,
                maxLength: 1000,
                safeContent: true
            }
        };
        
        this.forms.contact = { form, rules };
        this.attachFormValidation(form, rules);
    }
    
    setupCommunityForm(form) {
        const rules = {
            postTitle: {
                required: true,
                minLength: 5,
                maxLength: 100,
                noSpecialChars: true
            },
            postContent: {
                required: true,
                minLength: 10,
                maxLength: 2000,
                safeContent: true
            },
            postCategory: {
                required: true
            }
        };
        
        this.forms.community = { form, rules };
        this.attachFormValidation(form, rules);
    }
    
    setupMoodForm(form) {
        const rules = {
            moodRating: {
                required: true,
                pattern: '^[1-5]$'
            },
            moodNote: {
                required: false,
                maxLength: 500,
                safeContent: true
            }
        };
        
        this.forms.mood = { form, rules };
        this.attachFormValidation(form, rules);
    }
    
    setupResourceForm(form) {
        const rules = {
            resourceName: {
                required: true,
                minLength: 3,
                maxLength: 100,
                noSpecialChars: true
            },
            resourceType: {
                required: true
            },
            resourceDescription: {
                required: true,
                minLength: 10,
                maxLength: 500,
                safeContent: true
            },
            requesterEmail: {
                required: true,
                email: true
            }
        };
        
        this.forms.resource = { form, rules };
        this.attachFormValidation(form, rules);
    }
    
    attachFormValidation(form, rules) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const isValid = this.validateForm(form, rules);
            
            if (isValid) {
                this.handleFormSubmit(form, rules);
            } else {
                this.showFormErrors(form);
            }
        });
        
        // Add real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input, rules);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }
    
    setupRealTimeValidation() {
        // Add input event listeners for real-time feedback
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, select, textarea')) {
                const form = e.target.closest('form');
                if (form && this.forms[form.id]) {
                    const rules = this.forms[form.id].rules;
                    this.validateField(e.target, rules);
                }
            }
        });
    }
    
    validateForm(form, rules) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            const isFieldValid = this.validateField(input, rules);
            if (!isFieldValid) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field, rules) {
        const fieldName = field.name || field.id;
        const fieldRules = rules[fieldName];
        
        if (!fieldRules) {
            return true; // No rules defined for this field
        }
        
        const value = field.value;
        let isValid = true;
        let errorMessage = '';
        
        // Check each rule
        for (const [ruleName, ruleValue] of Object.entries(fieldRules)) {
            if (ruleName === 'required' && ruleValue && !this.validationRules.required(value)) {
                isValid = false;
                errorMessage = 'This field is required.';
                break;
            }
            
            if (ruleName === 'email' && ruleValue && value && !this.validationRules.email(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
                break;
            }
            
            if (ruleName === 'phone' && ruleValue && value && !this.validationRules.phone(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number.';
                break;
            }
            
            if (ruleName === 'minLength' && value && !this.validationRules.minLength(value, ruleValue)) {
                isValid = false;
                errorMessage = `Minimum length is ${ruleValue} characters.`;
                break;
            }
            
            if (ruleName === 'maxLength' && value && !this.validationRules.maxLength(value, ruleValue)) {
                isValid = false;
                errorMessage = `Maximum length is ${ruleValue} characters.`;
                break;
            }
            
            if (ruleName === 'pattern' && value && !this.validationRules.pattern(value, ruleValue)) {
                isValid = false;
                errorMessage = 'Please enter a valid format.';
                break;
            }
            
            if (ruleName === 'noSpecialChars' && ruleValue && value && !this.validationRules.noSpecialChars(value)) {
                isValid = false;
                errorMessage = 'Special characters are not allowed.';
                break;
            }
            
            if (ruleName === 'safeContent' && ruleValue && value && !this.validationRules.safeContent(value)) {
                isValid = false;
                errorMessage = 'Content contains unsafe elements.';
                break;
            }
        }
        
        this.updateFieldValidation(field, isValid, errorMessage);
        return isValid;
    }
    
    updateFieldValidation(field, isValid, errorMessage) {
        // Remove existing validation classes
        field.classList.remove('is-valid', 'is-invalid');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        if (isValid) {
            field.classList.add('is-valid');
        } else {
            field.classList.add('is-invalid');
            
            // Add error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errorMessage;
            field.parentNode.appendChild(errorDiv);
        }
    }
    
    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    showFormErrors(form) {
        const firstInvalidField = form.querySelector('.is-invalid');
        if (firstInvalidField) {
            firstInvalidField.focus();
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Show general error message
        const existingError = form.querySelector('.form-error-message');
        if (existingError) {
            existingError.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error-message';
        errorDiv.style.cssText = `
            background-color: #f8d7da;
            color: #721c24;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            border: 1px solid #f5c6cb;
        `;
        errorDiv.innerHTML = `
            <strong>Please correct the errors above.</strong>
            <br>Make sure all required fields are filled out correctly.
        `;
        
        form.insertBefore(errorDiv, form.firstChild);
    }
    
    handleFormSubmit(form, rules) {
        // Clear any existing error messages
        const existingError = form.querySelector('.form-error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;
        
        // Check if form has Formspree action
        if (form.action && form.action.includes('formspree.io')) {
            this.submitToFormspree(form, submitButton, originalText);
        } else {
            // Fallback to simulation for forms without Formspree
            setTimeout(() => {
                this.showFormSuccess(form);
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Reset form after successful submission
                form.reset();
                this.clearFormValidation(form);
            }, 1500);
        }
    }
    
    submitToFormspree(form, submitButton, originalText) {
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
                this.showFormSuccess(form);
                form.reset();
                this.clearFormValidation(form);
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            this.showFormError(form, 'There was an error submitting your form. Please try again.');
        })
        .finally(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
    }
    
    showFormSuccess(form) {
        // Hide the form and show the existing success message
        const formWrapper = form.closest('.form-wrapper');
        const formSuccess = document.getElementById('formSuccess');
        
        if (formWrapper && formSuccess) {
            form.style.display = 'none';
            formSuccess.style.display = 'block';
        } else {
            // Fallback: create success message if existing one not found
            const successDiv = document.createElement('div');
            successDiv.className = 'form-success';
            successDiv.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <h3>Success!</h3>
                <p>Your submission has been received successfully.</p>
            `;
            
            form.insertBefore(successDiv, form.firstChild);
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                successDiv.remove();
            }, 5000);
        }
    }
    
    showFormError(form, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Error</h3>
            <p>${message}</p>
        `;
        
        form.insertBefore(errorDiv, form.firstChild);
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
    
    clearFormValidation(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
            this.clearFieldError(input);
        });
    }
    
    // Utility methods
    sanitizeInput(input) {
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }
    
    validateEmail(email) {
        return this.validationRules.email(email);
    }
    
    validatePhone(phone) {
        return this.validationRules.phone(phone);
    }
    
    validateRequired(value) {
        return this.validationRules.required(value);
    }
    
    validateLength(value, min, max) {
        const length = value.length;
        return length >= min && length <= max;
    }
    
    // Custom validation rules
    addCustomRule(name, validatorFunction) {
        this.validationRules[name] = validatorFunction;
    }
    
    // Form state management
    getFormData(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }
    
    setFormData(form, data) {
        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"], [id="${key}"]`);
            if (field) {
                field.value = data[key];
            }
        });
    }
    
    resetForm(form) {
        form.reset();
        this.clearFormValidation(form);
    }
}

// Global functions for contact form - defined immediately
function clearContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.reset();
        if (window.formValidator) {
            window.formValidator.clearFormValidation(contactForm);
        }
    }
}

function resetContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (contactForm && formSuccess) {
        contactForm.style.display = 'block';
        formSuccess.style.display = 'none';
        contactForm.reset();
        if (window.formValidator) {
            window.formValidator.clearFormValidation(contactForm);
        }
    }
}

// Initialize form validation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.formValidator = new FormValidator();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormValidator;
} else if (typeof window !== 'undefined') {
    window.FormValidator = FormValidator;
}
