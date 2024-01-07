class MusicMemory extends HTMLElement {
  constructor() {
    super();

    this.selectedRanges = [];
    this.currentButtons = [];
    this.noShuffle = this.hasAttribute('no-shuffle') || false;

    console.log(this.noShuffle);
  }

  connectedCallback() {
    this.initializeAudioElements();
  }

  initializeAudioElements() {
    let buttons = [];

    this.querySelectorAll('audio').forEach((audio, index) => {
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
    this.currentButtons.push(button);
    button.disabled = true;
    if (this.checkForMatch(audio)) {
      this.currentButtons.forEach(button => {
        button.classList.add('matched');
      });
      this.currentButtons = [];
      return;
    };

    const [start, end] = this.parseRange(rangeData);

    // Set the audio to the start of the range and play
    audio.currentTime = start / 1000;
    audio.play();

    // Pause the audio at the end of the range
    const playDuration = (end - start) / 1000;
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0; // Reset to start for next play
      if (this.currentButtons.length === 2) {
        console.log('Resetting buttons');
        this.currentButtons.forEach(button => {
          button.disabled = false;
        });
        this.currentButtons = [];
      }
    }, playDuration * 1000);


  }

  parseRange(rangeData) {
    return rangeData.split('-').map(Number);
  }

  checkForMatch(selectedAudio) {
    this.selectedRanges.push(selectedAudio);
    console.log(this.selectedRanges)

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
}

customElements.define('music-memory', MusicMemory);
