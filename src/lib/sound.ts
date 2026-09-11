// Tactile Web Audio synthesis for editorial micro-interactions
// Zero external audio files, crisp acoustic feedback, respectful mute support

type Listener = (isMuted: boolean) => void;

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true; // Muted by default for quiet editorial elegance
  private listeners: Set<Listener> = new Set();
  private userInteracted: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("portfolio_sound_enabled");
      if (stored !== null) {
        this.isMuted = stored === "false" || stored === "muted";
      } else {
        this.isMuted = true;
      }

      // Auto-unlock AudioContext on first user gesture
      const unlockAudio = () => {
        this.userInteracted = true;
        this.initCtx();
        window.removeEventListener("pointerdown", unlockAudio);
        window.removeEventListener("keydown", unlockAudio);
      };
      window.addEventListener("pointerdown", unlockAudio, { passive: true });
      window.addEventListener("keydown", unlockAudio, { passive: true });
    }
  }

  public subscribe(listener: Listener) {
    this.listeners.add(listener);
    listener(this.isMuted);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.isMuted));
  }

  private initCtx(): AudioContext | null {
    if (typeof window === "undefined") return null;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch (_err) {
      return null;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== "undefined") {
      localStorage.setItem("portfolio_sound_enabled", (!this.isMuted).toString());
    }
    if (!this.isMuted) {
      this.playChime();
    }
    this.notify();
    return this.isMuted;
  }

  public setMuted(val: boolean) {
    this.isMuted = val;
    if (typeof window !== "undefined") {
      localStorage.setItem("portfolio_sound_enabled", (!this.isMuted).toString());
    }
    this.notify();
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Crisp mechanical tactile click (audible, satisfying, like a linear keyboard switch)
  public playClick(pitch: number = 720) {
    if (this.isMuted || typeof window === "undefined") return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.05);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (_err) {}
  }

  // Subtle hover tick for cards and buttons
  public playHover() {
    if (this.isMuted || typeof window === "undefined") return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.02);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.02);
    } catch (_err) {}
  }

  // Melodic chime on success or unmute
  public playChime() {
    if (this.isMuted || typeof window === "undefined") return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const now = ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.12, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.2);
      });
    } catch (_err) {}
  }

  // Clean dual-pip on system or tab switch
  public playSwitch() {
    if (this.isMuted || typeof window === "undefined") return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.setValueAtTime(940, now + 0.04);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (_err) {}
  }

  public playSuccess() {
    this.playChime();
  }
}

export const sound = new SoundManager();

export function playTactileClick(pitch: number = 720, _duration?: number) {
  sound.playClick(pitch);
}

