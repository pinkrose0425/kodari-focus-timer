import { useState, useEffect, useRef } from 'react';

const playAlarm = () => {
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;

        const audioContext = new AudioContextClass();

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5
        oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.5); // Drop to A4

        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);

        // Play a second beep
        setTimeout(() => {
            try {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(880, audioContext.currentTime);
                osc2.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.5);
                gain2.gain.setValueAtTime(0.5, audioContext.currentTime);
                gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.start();
                osc2.stop(audioContext.currentTime + 0.5);
            } catch (e) {
                console.error("Second beep failed", e);
            }
        }, 600);
    } catch (error) {
        console.error("Could not play alarm", error);
    }
};

const Timer = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('focus'); // 'focus' | 'break'
    const timerRef = useRef(null);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft]);

    useEffect(() => {
        if (timeLeft === 0 && isActive) {
            setIsActive(false);
            playAlarm();
        }
    }, [timeLeft, isActive]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const themeClass = mode === 'focus'
        ? 'from-rose-400 to-orange-300 shadow-rose-500/50'
        : 'from-emerald-400 to-cyan-300 shadow-emerald-500/50';

    return (
        <div className={`flex flex-col items-center justify-center min-h-[500px] w-full max-w-md p-8 rounded-[3rem] bg-gradient-to-br ${themeClass} shadow-2xl transition-all duration-700 ease-in-out transform hover:scale-[1.02]`}>

            <h1 className="text-4xl font-extrabold text-white drop-shadow-md mb-8 tracking-wide animate-pulse">
                {mode === 'focus' ? '🍅 POWER MODE' : '🌿 CHILL MODE'}
            </h1>

            <div className="relative mb-10">
                <div className="text-8xl font-black text-white drop-shadow-lg font-mono tabular-nums tracking-tighter">
                    {formatTime(timeLeft)}
                </div>
                <div className="absolute -top-4 -right-4 text-4xl animate-bounce">
                    {mode === 'focus' ? '🔥' : '☕'}
                </div>
            </div>

            <div className="flex gap-4 mb-10 bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <button
                    onClick={() => switchMode('focus')}
                    className={`px-6 py-2 rounded-full font-bold transition-all duration-300 cursor-pointer ${mode === 'focus' ? 'bg-white text-rose-500 shadow-lg scale-105' : 'text-white hover:bg-white/10'}`}
                >
                    Focus 25
                </button>
                <button
                    onClick={() => switchMode('break')}
                    className={`px-6 py-2 rounded-full font-bold transition-all duration-300 cursor-pointer ${mode === 'break' ? 'bg-white text-emerald-500 shadow-lg scale-105' : 'text-white hover:bg-white/10'}`}
                >
                    Break 5
                </button>
            </div>

            <div className="flex gap-6 items-center">
                <button
                    onClick={toggleTimer}
                    className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-xl hover:scale-110 active:scale-95 transition-all text-slate-800 cursor-pointer"
                    aria-label={isActive ? "Pause" : "Start"}
                >
                    {isActive ? '⏸️' : '▶️'}
                </button>

                <button
                    onClick={resetTimer}
                    className="w-14 h-14 bg-white/30 rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-white/40 hover:scale-110 active:scale-95 transition-all text-white border-2 border-white/50 cursor-pointer"
                    aria-label="Reset"
                >
                    🔄
                </button>
            </div>

            <div className="mt-8 text-white/80 font-medium text-sm">
                {isActive ? (mode === 'focus' ? "You're doing great! Keep going!" : "Relax and recharge...") : "Ready to start?"}
            </div>

        </div>
    );
};

export default Timer;
