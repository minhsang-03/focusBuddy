<script>
  import { onMount } from 'svelte';

  /** @type {{ user: any, learningMethods?: Array<any> }} */
  export let data;

  let timeSeconds = 0;
  let isRunning = false;
  let selectedMethod = '';
  let selectedMode = 'Stopuhr';
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

  function startTimer() {
    if (selectedMode === 'Timer' && timeSeconds === 0 && (inputMinutes || inputSeconds)) {
      timeSeconds = inputMinutes * 60 + inputSeconds;
    }
    isRunning = true;
  }

  function pauseTimer() {
    isRunning = false;
  }

  function resetTimer() {
    isRunning = false;
    timeSeconds = 0;
    inputMinutes = 0;
    inputSeconds = 0;
  }

  function onMethodChange() {
    const method = (data.learningMethods || []).find((m) => m._id === selectedMethod);
    if (method && selectedMode === 'Timer') {
      inputMinutes = method.defaultWorkMinutes || 0;
      inputSeconds = 0;
    }
  }

  onMount(() => {
    const interval = setInterval(() => {
      if (isRunning) {
        if (selectedMode === 'Stopuhr') {
          timeSeconds += 1;
        } else if (selectedMode === 'Timer' && timeSeconds > 0) {
          timeSeconds -= 1;
        } else if (selectedMode === 'Timer' && timeSeconds === 0 && isRunning) {
          isRunning = false;
          alert('Zeit abgelaufen!');
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  });
</script>

{#if !data.user}
  <!-- Login Page -->
  <div class="login-container">
    <div class="login-box">
      <h1>FocusBuddy</h1>
      <p>Willkommen zurück!</p>
      <form method="POST" action="/login">
        <div class="form-group">
          <input type="text" name="name" placeholder="Name" />
        </div>
        <div class="form-group">
          <input type="email" name="email" placeholder="E-Mail" required />
        </div>
        <button type="submit" class="btn-login">Anmelden</button>
      </form>
      <p class="signup-hint">Noch kein Konto? <a href="/register">Registrieren</a></p>
    </div>
  </div>
{:else}
  <!-- Timer Page (main app) -->
  <div class="timer-container">
    <h1>Timer</h1>
    <p class="subtitle">Verfolgen Sie Ihre Lernzeit und Aktivitäten</p>

    <div class="timer-display">
      <div class="time">{formatTime(timeSeconds)}</div>
      <button class="btn-start" on:click={isRunning ? pauseTimer : startTimer}>
        {isRunning ? '⏸ Pause' : '▶ Start'}
      </button>
    </div>

    <div class="timer-controls">
      <div class="control-group">
        <label for="mode">Modus</label>
        <select id="mode" bind:value={selectedMode}>
          <option>Stopuhr</option>
          <option>Timer</option>
        </select>
      </div>

      <div class="control-group">
        <label for="method">Lernmethode</label>
        <select id="method" bind:value={selectedMethod} on:change={onMethodChange}>
          <option value="">-- Keine --</option>
          {#each data.learningMethods || [] as method (method._id)}
            <option value={method._id}>{method.name}</option>
          {/each}
        </select>
      </div>

      {#if selectedMode === 'Timer'}
        <div class="control-group">
          <label for="minutes">Minuten</label>
          <input id="minutes" type="number" bind:value={inputMinutes} min="0" max="999" />
        </div>
        <div class="control-group">
          <label for="seconds">Sekunden</label>
          <input id="seconds" type="number" bind:value={inputSeconds} min="0" max="59" />
        </div>
      {/if}

      <button class="btn-reset" on:click={resetTimer}>↻ Reset</button>
    </div>
  </div>
{/if}

<style>
  /* Login */
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 1rem;
  }

  .login-box {
    background: white;
    border-radius: 12px;
    padding: 3rem 2rem;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    text-align: center;
  }

  .login-box h1 {
    margin: 0 0 0.5rem 0;
    font-size: 1.8rem;
    color: #667eea;
  }

  .login-box > p {
    color: #666;
    margin-bottom: 2rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    font-family: inherit;
  }

  .form-group input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .btn-login {
    width: 100%;
    padding: 0.75rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 1rem;
    transition: background 0.2s;
  }

  .btn-login:hover {
    background: #5568d3;
  }

  .signup-hint {
    margin-top: 1.5rem;
    font-size: 0.9rem;
    color: #666;
  }

  .signup-hint a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
  }

  .signup-hint a:hover {
    text-decoration: underline;
  }

  /* Timer */
  .timer-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    font-size: 1.9rem;
    margin-bottom: 0.25rem;
  }

  .subtitle {
    color: #666;
    margin-bottom: 2rem;
  }

  .timer-display {
    background: #f5f5f5;
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    margin-bottom: 2rem;
  }

  .time {
    font-size: 3rem;
    font-weight: bold;
    font-family: 'Courier New', monospace;
    margin-bottom: 1rem;
  }

  .btn-start {
    padding: 0.75rem 2rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .btn-start:hover {
    background: #5568d3;
  }

  .timer-controls {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .control-group {
    display: flex;
    flex-direction: column;
  }

  .control-group label {
    font-weight: 600;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }

  .control-group select,
  .control-group input {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-family: inherit;
    font-size: 1rem;
  }

  .btn-reset {
    padding: 0.5rem 1rem;
    background: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }

  .btn-reset:hover {
    background: #e0e0e0;
  }

  @media (max-width: 600px) {
    .timer-container {
      padding: 1rem;
    }

    .time {
      font-size: 2rem;
    }

    .login-box {
      padding: 2rem 1.5rem;
    }
  }
</style>
