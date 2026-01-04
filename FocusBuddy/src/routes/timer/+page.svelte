{#if showSaveModal}
  <div class="modal-backdrop fade show" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:1040;background:rgba(0,0,0,0.5);"></div>
  <div class="modal fade show" tabindex="-1" style="display:block;z-index:1050;" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modal-title">Aktivität speichern</h5>
          <button type="button" class="btn-close" aria-label="Close" on:click={closeModal}></button>
        </div>
        <form on:submit|preventDefault={saveSession} autocomplete="off">
          <div class="modal-body">
            <div class="mb-3">
              <label for="session-title" class="form-label">Titel *</label>
              <input id="session-title" type="text" class="form-control" bind:value={sessionTitle} placeholder="z.B. Mathe lernen" required />
            </div>
            <div class="mb-3">
              <span class="form-label">Tags</span>
              <div class="mb-2" style="display:flex; flex-wrap:wrap; gap:0.5rem;">
                {#each selectedTags as tagId (tagId)}
                  {#if tagsMap.get(tagId)}
                    <span class="tag-chip-selected">
                      {#if tagsMap.get(tagId)}{tagsMap.get(tagId).name}{/if}
                      <button type="button" class="btn-close btn-sm ms-1" aria-label="Entfernen" on:click={() => removeTag(tagId)} tabindex="0"></button>
                    </span>
                  {/if}
                {/each}
              </div>
              <div class="mb-2" style="display:flex; flex-wrap:wrap; gap:0.5rem;">
                {#each data.tags as tag (tag._id)}
                  {#if !selectedTags.includes(tag._id)}
                    <button type="button" class="btn btn-outline-secondary btn-sm tag-chip-unselected" on:click={() => addTag(tag._id)} tabindex="0">+ {tag.name}</button>
                  {/if}
                {/each}
              </div>
            </div>
            <div class="mb-3">
              <label for="session-description" class="form-label">Beschreibung</label>
              <textarea id="session-description" class="form-control" bind:value={sessionDescription} placeholder="Was haben Sie gemacht?" rows="3"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" on:click={closeModal} tabindex="0">Abbrechen</button>
            <button type="submit" class="btn btn-primary" tabindex="0">Speichern</button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}<script>
  import { onMount } from 'svelte';

  /** @type {{ learningMethods: Array<{_id: string, name: string, defaultWorkMinutes?: number, defaultBreakMinutes?: number}>, tags: Array<{_id: string, name: string}> }} */
  export let data;

  let timeSeconds = 0;
  let isRunning = false;
  let selectedMethod = '';
  let selectedMode = 'Stopuhr'; // Stopuhr or Timer modes
  let inputMinutes = 0;
  let inputSeconds = 0;

  // Modal variables
  let showSaveModal = false;
  let sessionTitle = '';
  let sessionDescription = '';
  /** @type {string[]} */
  let selectedTags = [];
  /** @type {Date|null} */
  let sessionStartTime = null;

  // Map für schnellen Zugriff auf Tag-Namen
  $: tagsMap = new Map(data.tags.map(tag => [tag._id, tag]));

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
    if (!isRunning) {
      sessionStartTime = new Date();
    }
    isRunning = true;
  }

  // Pause the timer
  function pauseTimer() {
    isRunning = false;
  }

  // End the session
  function endSession() {
    isRunning = false;
    showSaveModal = true;
    console.log('Modal should be visible now:', showSaveModal);
  }

  // Close modal
  function closeModal() {
    showSaveModal = false;
    sessionTitle = '';
    sessionDescription = '';
    selectedTags = [];
  }

  // Save session
  async function saveSession() {
    const formData = new FormData();
    formData.append('title', sessionTitle);
    formData.append('description', sessionDescription);
    selectedTags.forEach(tagId => formData.append('tags', tagId)); // <---
    formData.append('method', selectedMethod);
    formData.append('durationSeconds', timeSeconds.toString());
    if (sessionStartTime) {
      formData.append('startTime', sessionStartTime.toISOString());
    }
    formData.append('endTime', new Date().toISOString());

    try {
      const response = await fetch('/timer?/saveActivity', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        alert('Session gespeichert!');
        resetTimer();
        closeModal();
      } else {
        alert('Fehler beim Speichern: ' + (result.error || 'Unbekannter Fehler'));
      }
    } catch (error) {
      console.error('Fehler:', error);
      alert('Fehler beim Speichern der Session');
    }
  }

  // Reset the timer
  function resetTimer() {
    isRunning = false;
    timeSeconds = 0;
    inputMinutes = 0;
    inputSeconds = 0;
    sessionStartTime = null;
  }

  // Update learning method when selected
  function onMethodChange() {
    const method = data.learningMethods.find((m) => /** @type {any} */ (m)._id === selectedMethod);
    if (method && selectedMode === 'Timer') {
      inputMinutes = /** @type {any} */ (method).defaultWorkMinutes || 0;
      inputSeconds = 0;
    }
  }

  /**
   * @param {string} tagId
   */
  function addTag(tagId /** @type {string} */) {
    if (!selectedTags.includes(tagId)) selectedTags = [...selectedTags, tagId];
  }
  /**
   * @param {string} tagId
   */
  function removeTag(tagId /** @type {string} */) {
    selectedTags = selectedTags.filter(id => id !== tagId);
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
    <div class="timer-buttons">
      <button class="btn-start" on:click={isRunning ? pauseTimer : startTimer}>
        {isRunning ? '⏸ Pause' : '▶ Start'}
      </button>
      {#if isRunning}
        <button class="btn-end" on:click={endSession}>⏹ Beenden</button>
      {/if}
    </div>
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

<!-- Save Session Modal -->
{#if showSaveModal}
  <div class="modal-backdrop fade show" style="position:fixed;width:100vw;height:100vh;z-index:1040;background:rgba(0,0,0,0.5);"></div>
  <div class="modal fade show" tabindex="-1" style="display:block;z-index:1050;" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modal-title">Aktivität speichern</h5>
          <button type="button" class="btn-close" aria-label="Close" on:click={closeModal}></button>
        </div>
        <form on:submit|preventDefault={saveSession} autocomplete="off">
          <div class="modal-body">
            <div class="mb-3">
              <label for="session-title" class="form-label">Titel *</label>
              <input id="session-title" type="text" class="form-control" bind:value={sessionTitle} placeholder="z.B. Mathe lernen" required />
            </div>
            <div class="mb-3">
              <span class="form-label">Tags</span>
              <div class="mb-2" style="display:flex; flex-wrap:wrap; gap:0.5rem;">
                {#each selectedTags as tagId (tagId)}
                  {#if tagsMap.get(tagId)}
                    <span class="tag-chip-selected">
                      {#if tagsMap.get(tagId)}{tagsMap.get(tagId).name}{/if}
                      <button type="button" class="btn-close btn-sm ms-1" aria-label="Entfernen" on:click={() => removeTag(tagId)}></button>
                    </span>
                  {/if}
                {/each}
              </div>
              <div class="mb-2" style="display:flex; flex-wrap:wrap; gap:0.5rem;">
                {#each data.tags as tag (tag._id)}
                  {#if !selectedTags.includes(tag._id)}
                    <button type="button" class="btn btn-outline-secondary btn-sm tag-chip-unselected" on:click={() => addTag(tag._id)}>+ {tag.name}</button>
                  {/if}
                {/each}
              </div>
            </div>
            <div class="mb-3">
              <label for="session-description" class="form-label">Beschreibung</label>
              <textarea id="session-description" class="form-control" bind:value={sessionDescription} placeholder="Was haben Sie gemacht?" rows="3"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" on:click={closeModal}>Abbrechen</button>
            <button type="submit" class="btn btn-primary">Speichern</button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}

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

  .timer-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
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

  .btn-end {
    background: #dc3545;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s;
  }

  .btn-end:hover {
    background: #c82333;
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

    .timer-buttons {
      flex-direction: column;
      align-items: center;
    }
  }

  /* Modal Styles */


  .tag-chip-selected {
    background: #e9ecef;
    color: #222;
    border-radius: 16px;
    padding: 0.35em 0.85em 0.35em 1em;
    display: inline-flex;
    align-items: center;
    font-size: 1rem;
    font-weight: 500;
    gap: 0.25em;
    border: none;
  }
  .tag-chip-selected .btn-close {
    margin-left: 0.5em;
    font-size: 0.9em;
    opacity: 0.7;
  }
  .tag-chip-selected .btn-close:hover {
    opacity: 1;
  }
  .tag-chip-unselected {
    border-radius: 16px;
    font-size: 1rem;
    padding: 0.35em 1em;
  }
</style>
