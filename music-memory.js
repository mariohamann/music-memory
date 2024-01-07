class MusicMemory extends HTMLElement {
  constructor() {
    super();

    this.selectedRanges = [];
    this.currentButtons = [];
    this.noShuffle = this.hasAttribute('no-shuffle') || false;
    this.audioElements = [];
    this.activeTimeout = null;
  }

  connectedCallback() {
    this.initializeAudioElements();
  }

  initializeAudioElements() {
    let buttons = [];

    this.querySelectorAll('audio').forEach((audio, index) => {
      this.audioElements.push(audio); // Add to audio elements array
      ['range1', 'range2'].forEach(rangeKey => {
        const button = document.createElement('button');
        button.textContent = `Play Part ${rangeKey === 'range1' ? '1' : '2'} of Audio ${index + 1}`;
        button.addEventListener('click', () => this.handlePlay(audio, audio.dataset[rangeKey], button));
        buttons.push(button);
      });
    });

    if (!this.noShuffle) {
      buttons = this.shuffleArray(buttons);
    }

    buttons.forEach(button => this.appendChild(button));
  }

  // Utility function
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  handlePlay(audio, rangeData, button) {
    this.stopAllAudios(); // Stop all other audios
    this.clearActiveTimeout(); // Clear any active timeout

    // This handles the case where the user clicks a button after two were already clicked but didn't reset
    if (this.currentButtons.length === 2 && !this.currentButtons.every(btn => btn.classList.contains('matched'))) {
      this.currentButtons.forEach(btn => {
        btn.disabled = false;
      });
      this.currentButtons = [];
    }

    this.currentButtons.push(button);

    button.disabled = true;
    if (this.checkForMatch(audio)) {
      this.currentButtons.forEach(button => button.classList.add('matched'));
      this.currentButtons = [];
      return;
    };

    const [start, end] = this.parseRange(rangeData);
    audio.currentTime = 0; // Reset audio to start
    audio.currentTime = start / 1000; // Set to the start of the range
    audio.play();

    const playDuration = (end - start) / 1000;
    this.activeTimeout = setTimeout(() => {
      audio.pause();
      audio.currentTime = 0; // Reset to start for next play
      if (this.currentButtons.length === 2) {
        this.currentButtons.forEach(button => button.disabled = false);
        this.currentButtons = [];
      }
    }, playDuration * 1000);
  }

  parseRange(rangeData) {
    return rangeData.split('-').map(Number);
  }

  checkForMatch(selectedAudio) {
    this.selectedRanges.push(selectedAudio);
    if (this.selectedRanges.length === 2) {
      if (this.selectedRanges[0].src === this.selectedRanges[1].src) {
        this.playFullAudio(this.selectedRanges[0]);
        this.selectedRanges = [];
        return true;
      }
      this.selectedRanges = [];
    }
    return false;
  }

  playFullAudio(audio) {
    audio.currentTime = 0;

    const end = audio.dataset['range2'].split('-')[1];

    audio.play();

    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0; // Reset to start for next play
    }, end);

  }

  stopAllAudios() {
    this.audioElements.forEach(audio => audio.pause());
  }

  clearActiveTimeout() {
    if (this.activeTimeout) {
      clearTimeout(this.activeTimeout);
      this.activeTimeout = null;
    }
  }
}

customElements.define('music-memory', MusicMemory);
