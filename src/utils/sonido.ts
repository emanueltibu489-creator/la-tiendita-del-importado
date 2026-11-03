// "Tin" suave al elegir un perfume, generado en el momento (no descarga ningún archivo).
// Volumen bajo a propósito; si el navegador no deja, no suena y listo.
let audioContext: AudioContext | null = null;

export function playTin() {
  try {
    const AudioCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;

    audioContext ??= new AudioCtor();
    if (audioContext.state === 'suspended') void audioContext.resume();

    const now = audioContext.currentTime;
    // Dos notas brillantes, como una copa de cristal
    [1318.5, 1975.5].forEach((frequency, index) => {
      const start = now + index * 0.07;
      const oscillator = audioContext!.createOscillator();
      const gain = audioContext!.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.05, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.45);

      oscillator.connect(gain).connect(audioContext!.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.5);
    });
  } catch {
    // Sin sonido: no es importante
  }
}
