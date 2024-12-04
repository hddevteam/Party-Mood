// src/utils/SoundManager.js
export class SoundManager {
    constructor() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.volume = 0.1;
        this.soundTypes = {
            success: [
                { frequency: 523.25, duration: 80, type: 'sine' },  // C5
                { frequency: 659.25, duration: 80, type: 'sine' },  // E5
                { frequency: 783.99, duration: 120, type: 'sine' }  // G5
            ],
            failure: [
                { frequency: 466.16, duration: 120, type: 'triangle' }, // Bb4
                { frequency: 349.23, duration: 160, type: 'triangle' }  // F4
            ],
            pop: [
                { frequency: 880.00, duration: 50, type: 'sine' }   // A5
            ]
        };
    }

    playSound(type) {
        if (!this.soundTypes[type]) return;
        
        let time = this.context.currentTime;
        const sequence = this.soundTypes[type];
        
        sequence.forEach(({ frequency, duration, type: waveType }) => {
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            
            oscillator.type = waveType;
            oscillator.frequency.value = frequency;
            gainNode.gain.value = this.volume;
            
            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            oscillator.start(time);
            oscillator.stop(time + duration / 1000);
            
            time += duration / 1000;
        });
    }

    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
    }
}