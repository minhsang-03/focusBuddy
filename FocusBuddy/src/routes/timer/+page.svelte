<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  /** @type {{ learningMethods: Array<{_id: string, name: string, defaultWorkMinutes?: number, defaultBreakMinutes?: number}>, tags: Array<{_id: string, name: string}>, user: any }} */
  export let data;

  // Prüfe ob Benutzer eingeloggt ist (aus Layout-Daten)
  $: isLoggedIn = !!$page.data.user;

  let timeSeconds = 0;
  let isRunning = false;
  let selectedMethod = '';
  let selectedMode = 'Stopuhr'; // Stopuhr or Timer modes
  let inputMinutes = 0;
  let inputSeconds = 0;
  let timerStartSeconds = 0; // Ursprüngliche Timer-Zeit für Berechnung der gelernten Zeit

  // Modal variables
  let showSaveModal = false;
  let sessionTitle = '';
  let sessionDescription = '';
  /** @type {string[]} */
  let selectedTags = [];
  /** @type {Date|null} */
  let sessionStartTime = null;
  
  // Notification variables
  let showNotification = false;
  let notificationType = 'success'; // 'success' oder 'error'
  let notificationMessage = '';

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
      // Speichere ursprüngliche Timer-Zeit für Berechnung der gelernten Zeit
      if (selectedMode === 'Timer') {
        timerStartSeconds = timeSeconds;
      }
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
    
    // Prüfe ob Benutzer eingeloggt ist
    if (!isLoggedIn) {
      showNotification = true;
      notificationType = 'error';
      notificationMessage = 'Bitte melden Sie sich an, um Aktivitäten zu speichern.';
      setTimeout(() => { showNotification = false; }, 5000);
      return;
    }
    
    showSaveModal = true;
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
    // Berechne die tatsächlich gelernte Zeit
    let learnedSeconds = timeSeconds;
    if (selectedMode === 'Timer') {
      // Bei Timer: ursprüngliche Zeit minus verbleibende Zeit = gelernte Zeit
      learnedSeconds = timerStartSeconds - timeSeconds;
    }
    // Sicherstellen, dass die Zeit nicht negativ ist
    if (learnedSeconds < 0) learnedSeconds = 0;

    const formData = new FormData();
    formData.append('title', sessionTitle);
    formData.append('description', sessionDescription);
    selectedTags.forEach(tagId => formData.append('tags', tagId));
    formData.append('method', selectedMethod);
    formData.append('durationSeconds', learnedSeconds.toString());
    if (sessionStartTime) {
      formData.append('startTime', sessionStartTime.toISOString());
    }
    formData.append('endTime', new Date().toISOString());

    try {
      const response = await fetch('/timer?/saveActivity', {
        method: 'POST',
        body: formData,
      });
      
      // Prüfe HTTP Status zuerst
      if (response.ok) {
        // Bei SvelteKit Actions ist ein 200 OK ein Erfolg
        // Versuche die Response zu parsen
        let success = true;
        let errorMessage = '';
        
        try {
          const result = await response.json();
          console.log('Server response:', result); // Debug
          
          // SvelteKit Action Response Format
          if (result.type === 'success' || result.type === 'redirect') {
            success = true;
          } else if (result.type === 'failure' || result.type === 'error') {
            success = false;
            // Versuche Fehlermeldung aus data zu extrahieren
            if (result.data) {
              errorMessage = result.data.error || '';
            }
          } else if (result.success !== undefined) {
            // Direktes Response-Objekt
            success = result.success;
            errorMessage = result.error || '';
          }
        } catch (parseError) {
          // JSON parsing fehlgeschlagen, aber Response war OK
          console.log('Response parse info:', parseError);
          success = true;
        }
        
        if (success) {
          showNotification = true;
          notificationType = 'success';
          notificationMessage = 'Aktivität erfolgreich gespeichert!';
          setTimeout(() => { showNotification = false; }, 3000);
          resetTimer();
          closeModal();
        } else if (errorMessage === 'Nicht eingeloggt') {
          showNotification = true;
          notificationType = 'error';
          notificationMessage = 'Bitte melden Sie sich an, um Aktivitäten zu speichern.';
          setTimeout(() => { showNotification = false; }, 5000);
        } else {
          showNotification = true;
          notificationType = 'error';
          notificationMessage = 'Fehler beim Speichern: ' + (errorMessage || 'Unbekannter Fehler');
          setTimeout(() => { showNotification = false; }, 5000);
        }
      } else {
        // HTTP Error
        showNotification = true;
        notificationType = 'error';
        notificationMessage = 'Server-Fehler: ' + response.status;
        setTimeout(() => { showNotification = false; }, 5000);
      }
    } catch (error) {
      console.error('Fehler:', error);
      showNotification = true;
      notificationType = 'error';
      notificationMessage = 'Netzwerkfehler beim Speichern der Session';
      setTimeout(() => { showNotification = false; }, 5000);
    }
  }

  // Reset the timer
  function resetTimer() {
    isRunning = false;
    timeSeconds = 0;
    inputMinutes = 0;
    inputSeconds = 0;
    sessionStartTime = null;
    timerStartSeconds = 0;
  }

  // Update learning method when selected
  function onMethodChange() {
    const method = data.learningMethods.find((m) => /** @type {any} */ (m)._id === selectedMethod);
    if (method) {
      const methodData = /** @type {any} */ (method);
      // Timer-Modus basierend auf dem type der Lernmethode setzen
      if (methodData.type === 'stopwatch') {
        selectedMode = 'Stopuhr';
        // Bei Stopuhr starten wir bei 0
        if (!isRunning) {
          inputMinutes = 0;
          inputSeconds = 0;
          timeSeconds = 0;
        }
      } else if (methodData.type === 'timer') {
        selectedMode = 'Timer';
        // Bei Timer die defaultWorkMinutes verwenden
        inputMinutes = methodData.defaultWorkMinutes || 25;
        inputSeconds = 0;
        if (!isRunning) {
          timeSeconds = inputMinutes * 60;
        }
      }
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
    // Prüfe ob Benutzer gerade eingeloggt wurde
    const loginParam = $page.url.searchParams.get('login');
    if (loginParam === 'success') {
      showNotification = true;
      notificationType = 'success';
      notificationMessage = 'Erfolgreich angemeldet!';
      setTimeout(() => { showNotification = false; }, 3000);
      // Entferne den Parameter aus der URL
      const url = new URL(window.location.href);
      url.searchParams.delete('login');
      window.history.replaceState({}, '', url);
    }

    // Prüfe ob Benutzer gerade registriert wurde
    const registerParam = $page.url.searchParams.get('register');
    if (registerParam === 'success') {
      showNotification = true;
      notificationType = 'success';
      notificationMessage = 'Erfolgreich registriert und angemeldet!';
      setTimeout(() => { showNotification = false; }, 3000);
      // Entferne den Parameter aus der URL
      const url = new URL(window.location.href);
      url.searchParams.delete('register');
      window.history.replaceState({}, '', url);
    }

    // URL-Parameter lesen und Lernmethode setzen
    const methodParam = $page.url.searchParams.get('method');
    if (methodParam) {
      const method = data.learningMethods.find((m) => /** @type {any} */ (m)._id === methodParam);
      if (method) {
        selectedMethod = methodParam;
        const methodData = /** @type {any} */ (method);
        // Timer-Modus basierend auf type setzen
        if (methodData.type === 'stopwatch') {
          selectedMode = 'Stopuhr';
          inputMinutes = 0;
          inputSeconds = 0;
          timeSeconds = 0;
        } else if (methodData.type === 'timer') {
          selectedMode = 'Timer';
          inputMinutes = methodData.defaultWorkMinutes || 25;
          inputSeconds = 0;
          timeSeconds = inputMinutes * 60;
        }
      }
    }

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

<!-- Notification Toast -->
{#if showNotification}
  <div class="notification-container">
    <div class="alert {notificationType === 'success' ? 'alert-success' : 'alert-danger'} alert-dismissible fade show d-flex align-items-center" role="alert">
      <i class="bi {notificationType === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2"></i>
      <div>{notificationMessage}</div>
      <button type="button" class="btn-close" aria-label="Close" on:click={() => showNotification = false}></button>
    </div>
  </div>
{/if}

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
      <select id="mode" bind:value={selectedMode} disabled={selectedMethod !== ''}>
        <option value="Stopuhr">Stopuhr</option>
        <option value="Timer">Timer</option>
      </select>
      {#if selectedMethod !== ''}
        <small class="mode-hint">Modus wird durch Lernmethode festgelegt</small>
      {/if}
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
  <div class="modal-backdrop-custom"></div>
  <div class="modal-custom" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <div>
            <h5 class="modal-title" id="modal-title">Aktivität speichern</h5>
            <p class="modal-subtitle">Speichern Sie die Details Ihrer Aktivität</p>
          </div>
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
              <!-- Ausgewählte Tags -->
              <div class="tag-container">
                {#each selectedTags as tagId (tagId)}
                  {#if tagsMap.get(tagId)}
                    {@const tag = tagsMap.get(tagId)}
                    <span class="tag-chip-selected">
                      {tag?.name ?? ''}
                      <button type="button" class="btn-close btn-sm ms-1" aria-label="Entfernen" on:click={() => removeTag(tagId)}></button>
                    </span>
                  {/if}
                {/each}
              </div>
              <!-- Verfügbare Tags aus MongoDB -->
              <div class="tag-container">
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

  .setting-group select:disabled {
    background: #f5f5f5;
    color: #888;
    cursor: not-allowed;
  }

  .mode-hint {
    display: block;
    margin-top: 0.25rem;
    color: #888;
    font-size: 0.8rem;
    font-style: italic;
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
  .modal-backdrop-custom {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1040;
    background: rgba(0, 0, 0, 0.5);
  }

  .modal-custom {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1050;
    overflow-y: auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-dialog {
    position: relative;
    width: 100%;
    max-width: 500px;
    margin: 1.75rem auto;
    pointer-events: auto;
  }

  .modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1.5rem 1.5rem 1rem;
    border-bottom: 1px solid #e9ecef;
  }

  .modal-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a1a1a;
  }

  .modal-subtitle {
    color: #666;
    font-size: 0.9rem;
    margin: 0.25rem 0 0 0;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 1rem 1.5rem 1.5rem;
    border-top: 1px solid #e9ecef;
  }

  .tag-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

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

  /* Notification Container */
  .notification-container {
    position: fixed;
    top: 1.5rem;
    right: 1.5rem;
    z-index: 2000;
    max-width: 400px;
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
</style>
