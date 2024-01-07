# `music-memory` Web Component

This is a web component that allows you to play a memory game with music snippets.

## Features

-   🎲 Random cards order
-   🎵 Easy setup via HTML elements
-   😌 LightDOM for convenient styling

## Installation

```bash
npm install music-memory
```

## Example

```html
<!-- NPM -->
<script type="module">
	import "music-memory.js";
</script>

<!-- JSDelivr -->
<script type="module">
	import "https://cdn.jsdelivr.net/npm/music-memory/music-memory.js";
</script>

<music-memory>
	<audio
		src="path/to/your/audiofile1.mp3"
		data-range1="0-2000"
		data-range2="2001-4000"
	></audio>
	<audio
		src="path/to/your/audiofile2.mp3"
		data-range1="0-2000"
		data-range2="2001-4000"
	></audio>
</music-memory>
```

## How to play

1. Click on cards to hear different sections of songs.
2. Find and match pairs from the same song.
    - Correct pairs turn green and stay disabled.
    - Incorrect pairs reset for another attempt.

## Usage

1. The web component automatically creates two `<button>` elements for each audio element you provide, one for each range.
2. The component doesn't provide any styling, so you can style it however you want.
    1. "Flipped" buttons get a `disabled` attribute,
    2. "Matched" buttons get a `matched` class.
    3. You can have a look at the [demo](index.html) for example styling.
3. To make styling easy, the component uses LightDOM, so you can style it with basic CSS.
4. Button order is randomized on each component load (can be deactivated with `no-shuffle` attribute on the `<music-memory>` element).
5. If there's a match, the audio is played from the beginning of range 1 until the end of range 2.
6. Set attribute `debug` on the `<music-memory>` element to show the audio file + part in the button text.
