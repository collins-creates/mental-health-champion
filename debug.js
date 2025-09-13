// Debug script to check crisis support functionality
console.log('=== Debugging Crisis Support Manager ===');

// Check if CrisisSupportManager class exists
if (typeof CrisisSupportManager !== 'undefined') {
    console.log('✓ CrisisSupportManager class is defined');
    
    // Check if crisisSupportManager instance exists
    if (window.crisisSupportManager) {
        console.log('✓ crisisSupportManager instance exists');
        
        // Check methods
        const methods = ['showBreathingExercise', 'showMindfulnessMeditation', 'createBreathingExerciseModal', 'createMeditationModal'];
        methods.forEach(method => {
            if (typeof window.crisisSupportManager[method] === 'function') {
                console.log(`✓ ${method} method exists`);
            } else {
                console.log(`✗ ${method} method missing`);
            }
        });
    } else {
        console.log('✗ crisisSupportManager instance does not exist');
        console.log('Creating new instance...');
        window.crisisSupportManager = new CrisisSupportManager();
        console.log('✓ crisisSupportManager instance created');
    }
} else {
    console.log('✗ CrisisSupportManager class is not defined');
}

// Check if modal styles exist
const modalStyles = document.querySelector('#breathingModalStyles, #meditationModalStyles');
if (modalStyles) {
    console.log('✓ Modal styles found');
} else {
    console.log('✗ Modal styles not found');
}

// Check if CSS has modal classes
const testElement = document.createElement('div');
testElement.className = 'modal-overlay';
const hasModalOverlayStyle = window.getComputedStyle(testElement).position !== '';
console.log(`Modal overlay CSS available: ${hasModalOverlayStyle}`);

console.log('=== Debug Complete ===');
