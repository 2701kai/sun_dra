/**
 * A tiny bridge between the Steely San turntable and the flower field.
 * The turntable attaches its <audio> element here; the canvas asks for the current level.
 * No React, no packages, one module-level singleton.
 */

let ctx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let data: Uint8Array<ArrayBuffer> | null = null;
let attached: HTMLAudioElement | null = null;
let playing = false;

/** Call from a user gesture, before play(). Safe to call repeatedly. */
export function attachAudio(el: HTMLAudioElement) {
  if (attached === el) {
    void ctx?.resume();
    return;
  }
  if (attached) return; // one element per page is plenty
  try {
    ctx = new AudioContext();
    const source = ctx.createMediaElementSource(el);
    analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.82;
    data = new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser);
    analyser.connect(ctx.destination);
    attached = el;
    void ctx.resume();
  } catch {
    // Older Safari without MediaElementSource support: the audio still plays, the flowers just won't dance.
  }
}

export function setPlaying(on: boolean) {
  playing = on;
  if (on) void ctx?.resume();
}

export function isPlaying() {
  return playing;
}

/** Bass-weighted energy, 0..1. Cheap enough to call every frame. */
export function audioLevel(): number {
  if (!analyser || !data || !playing) return 0;
  analyser.getByteFrequencyData(data);
  let sum = 0;
  const n = 20; // roughly the bottom 1.7 kHz at 44.1 kHz / fftSize 256
  for (let i = 0; i < n; i++) sum += data[i];
  return Math.min(1, sum / (n * 255) * 1.6);
}
