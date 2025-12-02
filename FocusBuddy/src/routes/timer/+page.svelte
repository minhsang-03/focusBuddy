<script>
  import { onMount } from 'svelte';

  /** @type {{ learningMethods: Array<{_id: string, name: string, defaultWorkMinutes?: number, defaultBreakMinutes?: number}> }} */
  export let data;

  let timeSeconds = 0;
  let isRunning = false;
  let selectedMethod = '';
  let selectedMode = 'Stopuhr'; // Stopuhr or Timer modes
  let inputMinutes = 0;
  let inputSeconds = 0;

  // Format time as HH:MM:SS
  /** @param {number} totalSeconds */
  function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  // Start the timer/stopwatch
  function startTimer() {
    if (selectedMode === 'Timer' && timeSeconds === 0 && (inputMinutes || inputSeconds)) {
      timeSeconds = inputMinutes * 60 + inputSeconds;
    }
    isRunning = true;
  }

  // Pause the timer
  function pauseTimer() {
    isRunning = false;
  }

  // Reset the timer
  function resetTimer() {
    isRunning = false;
    timeSeconds = 0;
    inputMinutes = 0;
    inputSeconds = 0;
  }

  // Update learning method when selected
  function onMethodChange() {
    const method = data.learningMethods.find((m) => /** @type {any} */ (m)._id === selectedMethod);
    if (method && selectedMode === 'Timer') {
      inputMinutes = /** @type {any} */ (method).defaultWorkMinutes || 0;
      inputSeconds = 0;
    }
  }

  // Timer interval
  onMount(() => {
    const interval = setInterval(() => {
      if (isRunning) {
        if (selectedMode === 'Stopuhr') {
          timeSeconds += 1;
        } else if (selectedMode === 'Timer' && timeSeconds > 0) {
          timeSeconds -= 1;
        } else if (selectedMode === 'Timer' && timeSeconds === 0 && isRunning) {
          isRunning = false;
          // Play a sound or show a notification
          alert('Zeit abgelaufen!');
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  });
</script>

<div class="timer-container">
  <h1>Timer</h1>
  <p class="subtitle">Verfolgen Sie Ihre Lernzeit und Aktivitäten</p>

  <!-- Large timer display -->
  <div class="timer-display">
    <div class="time">{formatTime(timeSeconds)}</div>
    <button class="btn-start" on:click={isRunning ? pauseTimer : startTimer}>
      {isRunning ? '⏸ Pause' : '▶ Start'}
    </button>
  </div>

  <!-- Settings -->
  <div class="settings">
    <!-- Learning method -->
    <div class="setting-group">
      <label for="method">Lernmethode</label>
      <select id="method" bind:value={selectedMethod} on:change={onMethodChange}>
        <option value="">Keine</option>
        {#each data.learningMethods as method (method._id)}
          <option value={method._id}>{method.name}</option>
        {/each}
      </select>
    </div>

    <!-- Timer mode -->
    <div class="setting-group">
      <label for="mode">Timer-Modus</label>
      <select id="mode" bind:value={selectedMode}>
        <option value="Stopuhr">Stopuhr</option>
        <option value="Timer">Timer</option>
      </select>
    </div>
  </div>

  <!-- Timer input (only show for Timer mode) -->
  {#if selectedMode === 'Timer'}
    <div class="timer-input">
      <div class="input-group">
        <label for="minutes">Minuten</label>
        <input
          id="minutes"
          type="number"
          bind:value={inputMinutes}
          min="0"
          max="99"
          on:change={() => {
            if (!isRunning) timeSeconds = inputMinutes * 60 + inputSeconds;
          }}
        />
      </div>
      <div class="input-group">
        <label for="seconds">Sekunden</label>
        <input
          id="seconds"
          type="number"
          bind:value={inputSeconds}
          min="0"
          max="59"
          on:change={() => {
            if (!isRunning) timeSeconds = inputMinutes * 60 + inputSeconds;
          }}
        />
      </div>
      <button class="btn-reset" on:click={resetTimer}>Zurücksetzen</button>
    </div>
  {/if}
</div>

<style>
  .timer-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: #1a1a1a;
  }

  .subtitle {
    color: #666;
    margin-bottom: 2rem;
    font-size: 0.95rem;
  }

  .timer-display {
    background: white;
    border-radius: 12px;
    padding: 3rem 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
  }

  .time {
    font-size: 4rem;
    font-weight: bold;
    color: #1a1a1a;
    font-family: 'Courier New', monospace;
    margin-bottom: 1.5rem;
    letter-spacing: 0.05em;
  }

  .btn-start {
    background: #1a1a1a;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s;
  }

  .btn-start:hover {
    background: #333;
  }

  .settings {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .setting-group {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  }

  .setting-group label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: #1a1a1a;
    text-align: left;
  }

  .setting-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    background: white;
    cursor: pointer;
  }

  .setting-group select:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
  }

  .timer-input {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: flex-end;
    flex-wrap: wrap;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .input-group label {
    font-weight: 600;
    color: #1a1a1a;
  }

  .input-group input {
    width: 80px;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    text-align: center;
  }

  .input-group input:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
  }

  .btn-reset {
    background: #f0f0f0;
    color: #1a1a1a;
    border: 1px solid #ddd;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s;
  }

  .btn-reset:hover {
    background: #e0e0e0;
  }

  @media (max-width: 600px) {
    .time {
      font-size: 2.5rem;
    }

    .settings {
      grid-template-columns: 1fr;
    }

    .timer-input {
      flex-direction: column;
      align-items: stretch;
    }

    .input-group input {
      width: 100%;
    }
  }
</style>
