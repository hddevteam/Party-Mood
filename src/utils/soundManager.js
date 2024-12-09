// src/utils/SoundManager.js
export class SoundManager {
    constructor() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.volume = 0.1;
        this.soundTypes = {
            success: [
                // 成功音效组合1 - 上升的明快和弦
                [
                    [
                        { frequency: 523.25, duration: 100, type: 'sine' },  // C5
                        { frequency: 659.25, duration: 100, type: 'sine' },  // E5
                        { frequency: 783.99, duration: 100, type: 'sine' }   // G5
                    ],
                    [
                        { frequency: 587.33, duration: 150, type: 'sine' },  // D5
                        { frequency: 739.99, duration: 150, type: 'sine' },  // F#5
                        { frequency: 880.00, duration: 150, type: 'sine' }   // A5
                    ]
                ],
                // 成功音效组合2 - 华丽的琶音
                [
                    { frequency: 523.25, duration: 60, type: 'sine' },      // C5
                    { frequency: 659.25, duration: 60, type: 'sine' },      // E5
                    { frequency: 783.99, duration: 60, type: 'sine' },      // G5
                    { frequency: 1046.50, duration: 120, type: 'sine' }     // C6
                ],
                // 新增成功音效3 - 明亮的上行音阶
                [
                    { frequency: 523.25, duration: 50, type: 'sine' },    // C5
                    { frequency: 587.33, duration: 50, type: 'sine' },    // D5
                    { frequency: 659.25, duration: 50, type: 'sine' },    // E5
                    { frequency: 698.46, duration: 50, type: 'sine' },    // F5
                    { frequency: 783.99, duration: 100, type: 'sine' }    // G5
                ],
                // 新增成功音效4 - 跳跃式和弦
                [
                    [
                        { frequency: 523.25, duration: 80, type: 'triangle' },  // C5
                        { frequency: 659.25, duration: 80, type: 'triangle' }   // E5
                    ],
                    [
                        { frequency: 698.46, duration: 120, type: 'triangle' }, // F5
                        { frequency: 880.00, duration: 120, type: 'triangle' }  // A5
                    ],
                    [
                        { frequency: 1046.50, duration: 200, type: 'triangle' }, // C6
                        { frequency: 1318.51, duration: 200, type: 'triangle' }  // E6
                    ]
                ],
                // 新增成功音效5 - 欢快的音符组合
                [
                    [
                        { frequency: 783.99, duration: 60, type: 'sine' },     // G5
                        { frequency: 987.77, duration: 60, type: 'sine' }      // B5
                    ],
                    [
                        { frequency: 880.00, duration: 60, type: 'sine' },     // A5
                        { frequency: 1046.50, duration: 60, type: 'sine' }     // C6
                    ],
                    [
                        { frequency: 1174.66, duration: 120, type: 'sine' },   // D6
                        { frequency: 1396.91, duration: 120, type: 'sine' }    // F6
                    ]
                ]
            ],
            failure: [
                // 失败音效组合1 - 下降的不协和音
                [
                    [
                        { frequency: 466.16, duration: 120, type: 'triangle' }, // Bb4
                        { frequency: 554.37, duration: 120, type: 'triangle' }, // Db5
                        { frequency: 622.25, duration: 120, type: 'triangle' }  // Eb5
                    ],
                    [
                        { frequency: 392.00, duration: 200, type: 'triangle' }, // G4
                        { frequency: 466.16, duration: 200, type: 'triangle' }  // Bb4
                    ]
                ],
                // 失败音效组合2 - 急促的警告音
                [
                    { frequency: 466.16, duration: 80, type: 'sawtooth' },    // Bb4
                    { frequency: 415.30, duration: 80, type: 'sawtooth' },    // Ab4
                    { frequency: 349.23, duration: 160, type: 'sawtooth' }    // F4
                ],
                // 新增失败音效3 - 沮丧的下行音阶
                [
                    { frequency: 622.25, duration: 100, type: 'sawtooth' },   // Eb5
                    { frequency: 554.37, duration: 100, type: 'sawtooth' },   // Db5
                    { frequency: 466.16, duration: 100, type: 'sawtooth' },   // Bb4
                    { frequency: 415.30, duration: 200, type: 'sawtooth' }    // Ab4
                ],
                // 新增失败音效4 - 不协和的震荡
                [
                    [
                        { frequency: 466.16, duration: 100, type: 'triangle' }, // Bb4
                        { frequency: 493.88, duration: 100, type: 'triangle' }  // B4
                    ],
                    [
                        { frequency: 415.30, duration: 150, type: 'triangle' }, // Ab4
                        { frequency: 440.00, duration: 150, type: 'triangle' }  // A4
                    ]
                ],
                // 新增失败音效5 - 低沉的结束音
                [
                    [
                        { frequency: 392.00, duration: 80, type: 'sawtooth' },  // G4
                        { frequency: 369.99, duration: 80, type: 'sawtooth' },  // F#4
                        { frequency: 349.23, duration: 80, type: 'sawtooth' }   // F4
                    ],
                    [
                        { frequency: 311.13, duration: 200, type: 'sawtooth' }, // Eb4
                        { frequency: 293.66, duration: 200, type: 'sawtooth' }  // D4
                    ]
                ]
            ],
            pop: [
                [{ frequency: 880.00, duration: 50, type: 'sine' }],          // A5
                [{ frequency: 987.77, duration: 40, type: 'sine' }]          // B5
            ]
        };
    }

    playSound(type) {
        if (!this.soundTypes[type]) return;
        
        // 随机选择一个音效组合
        const variations = this.soundTypes[type];
        const selectedVariation = variations[Math.floor(Math.random() * variations.length)];
        
        let time = this.context.currentTime;
        
        // 处理和弦（数组中的数组）和单音符序列
        const playSequence = (sequence) => {
            if (Array.isArray(sequence[0])) {
                // 和弦: 同时播放多个音符
                sequence.forEach(chord => {
                    chord.forEach(note => this.playNote(note, time));
                    time += chord[0].duration / 1000;
                });
            } else {
                // 单音符序列
                sequence.forEach(note => {
                    this.playNote(note, time);
                    time += note.duration / 1000;
                });
            }
        };
        
        playSequence(selectedVariation);
    }

    playNote({ frequency, duration, type }, time) {
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        
        // 添加淡入淡出效果
        gainNode.gain.setValueAtTime(0, time);
        gainNode.gain.linearRampToValueAtTime(this.volume, time + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, time + duration / 1000);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.start(time);
        oscillator.stop(time + duration / 1000 + 0.01);
    }

    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
    }
}