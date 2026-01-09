<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  /** @type {{ learningMethods: Array<{_id: string, name: string, defaultWorkMinutes?: number, defaultBreakMinutes?: number, type?: string}>, tags: Array<{_id: string, name: string}>, user: any }} */
  export let data;

  $: isLoggedIn = !!$page.data.user;

  let timeSeconds = 0;
  let isRunning = false;
  let selectedMethod = '';
  let selectedMode = 'Stopuhr';
  let inputMinutes = 0;
  let inputSeconds = 0;
  let timerStartSeconds = 0;

  let showSaveModal = false;
  let sessionTitle = '';
  let sessionDescription = '';
  /** @type {string[]} */
  let selectedTags = [];
  /** @type {Date|null} */
  let sessionStartTime = null;
  
  let showNotification = false;
  let notificationType = 'success';
  let notificationMessage = '';

  $: tagsMap = new Map(data.tags.map(tag => [tag._id, tag]));

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
    if (!isRunning) {
      sessionStartTime = new Date();
      if (selectedMode === 'Timer') {
        timerStartSeconds = timeSeconds;
      }
    }
    isRunning = true;
  }

  function pauseTimer() {
    isRunning = false;
  }

  function endSession() {
    isRunning = false;
    if (!isLoggedIn) {
      showNotification = true;
      notificationType = 'error';
      notificationMessage = 'Bitte melden Sie sich an, um Aktivitäten zu speichern.';
      setTimeout(() => { showNotification = false; }, 5000);
      return;
    }
    showSaveModal = true;
  }

  function closeModal() {
    showSaveModal = false;
    sessionTitle = '';
    sessionDescription = '';
    selectedTags = [];
  }

  async function saveSession() {
    let learnedSeconds = timeSeconds;
    if (selectedMode === 'Timer') {
      learnedSeconds = timerStartSeconds - timeSeconds;
    }
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
      
      if (response.ok) {
        let success = true;
        try {
          const result = await response.json();
          if (result.type === 'failure' || result.type === 'error') {
            success = false;
          }
        } catch (e) {
          success = true;
        }
        
        if (success) {
          showNotification = true;
          notificationType = 'success';
          notificationMessage = 'Aktivität erfolgreich gespeichert!';
          setTimeout(() => { showNotification = false; }, 3000);
          resetTimer();
          closeModal();
        }
      } else {
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

  function resetTimer() {
    isRunning = false;
    timeSeconds = 0;
    inputMinutes = 0;
    inputSeconds = 0;
    sessionStartTime = null;
    timerStartSeconds = 0;
  }

  function onMethodChange() {
    const method = data.learningMethods.find((m) => /** @type {any} */ (m)._id === selectedMethod);
    if (method) {
      const methodData = /** @type {any} */ (method);
      if (methodData.type === 'stopwatch') {
        selectedMode = 'Stopuhr';
        if (!isRunning) {
          inputMinutes = 0;
          inputSeconds = 0;
          timeSeconds = 0;
        }
      } else if (methodData.type === 'timer') {
        selectedMode = 'Timer';
        inputMinutes = methodData.defaultWorkMinutes || 25;
        inputSeconds = 0;
        if (!isRunning) {
          timeSeconds = inputMinutes * 60;
        }
      }
    } else {
      // "Keine" ausgewählt → Zeit auf 0 zurücksetzen
      if (!isRunning) {
        inputMinutes = 0;
        inputSeconds = 0;
        timeSeconds = 0;
      }
    }
  }

  function onModeChange() {
    // Bei Modus-Wechsel Zeit auf 0 zurücksetzen
    if (!isRunning) {
      inputMinutes = 0;
      inputSeconds = 0;
      timeSeconds = 0;
    }
  }

  /**
   * @param {string} tagId
   */
  function addTag(tagId) {
    if (!selectedTags.includes(tagId)) selectedTags = [...selectedTags, tagId];
  }
  /**
   * @param {string} tagId
   */
  function removeTag(tagId) {
    selectedTags = selectedTags.filter(id => id !== tagId);
  }

  onMount(() => {
    const loginParam = $page.url.searchParams.get('login');
    if (loginParam === 'success') {
      showNotification = true;
      notificationType = 'success';
      notificationMessage = 'Erfolgreich angemeldet!';
      setTimeout(() => { showNotification = false; }, 3000);
      const url = new URL(window.location.href);
      url.searchParams.delete('login');
      window.history.replaceState({}, '', url);
    }

    const registerParam = $page.url.searchParams.get('register');
    if (registerParam === 'success') {
      showNotification = true;
      notificationType = 'success';
      notificationMessage = 'Erfolgreich registriert und angemeldet!';
      setTimeout(() => { showNotification = false; }, 3000);
      const url = new URL(window.location.href);
      url.searchParams.delete('register');
      window.history.replaceState({}, '', url);
    }

    const methodParam = $page.url.searchParams.get('method');
    if (methodParam) {
      const method = data.learningMethods.find((m) => /** @type {any} */ (m)._id === methodParam);
      if (method) {
        selectedMethod = methodParam;
        const methodData = /** @type {any} */ (method);
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

<div class="container py-4 text-center">
  <h1 class="mb-1">Timer</h1>
  <p class="text-muted mb-4">Verfolgen Sie Ihre Lernzeit und Aktivitäten</p>

  <!-- Large timer display -->
  <div class="card mb-4">
    <div class="card-body py-5">
      <div class="display-1 fw-bold font-monospace mb-4">{formatTime(timeSeconds)}</div>
      <div class="d-flex gap-2 justify-content-center">
        <button class="btn btn-dark btn-lg" on:click={isRunning ? pauseTimer : startTimer}>
          <i class="bi {isRunning ? 'bi-pause-fill' : 'bi-play-fill'} me-1"></i>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        {#if isRunning}
          <button class="btn btn-danger btn-lg" on:click={endSession}>
            <i class="bi bi-stop-fill me-1"></i>Beenden
          </button>
        {/if}
      </div>
    </div>
  </div>

  <!-- Settings -->
  <div class="row g-3 mb-4">
    <div class="col-md-6">
      <div class="card h-100">
        <div class="card-body text-start">
          <label for="method" class="form-label fw-semibold">Lernmethode</label>
          <select id="method" class="form-select" bind:value={selectedMethod} on:change={onMethodChange}>
            <option value="">Keine</option>
            {#each data.learningMethods as method (method._id)}
              <option value={method._id}>{method.name}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <div class="card h-100">
        <div class="card-body text-start">
          <label for="mode" class="form-label fw-semibold">Timer-Modus</label>
          <select id="mode" class="form-select" bind:value={selectedMode} on:change={onModeChange} disabled={selectedMethod !== ''}>
            <option value="Stopuhr">Stopuhr</option>
            <option value="Timer">Timer</option>
          </select>
          {#if selectedMethod !== ''}
            <div class="form-text fst-italic">Modus wird durch Lernmethode festgelegt</div>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <!-- Timer input (only show for Timer mode) -->
  {#if selectedMode === 'Timer'}
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3 justify-content-center align-items-end">
          <div class="col-auto">
            <label for="minutes" class="form-label fw-semibold">Minuten</label>
            <input id="minutes" type="number" class="form-control text-center" style="width: 100px;" bind:value={inputMinutes} min="0" max="99" on:change={() => { if (!isRunning) timeSeconds = inputMinutes * 60 + inputSeconds; }} />
          </div>
          <div class="col-auto">
            <label for="seconds" class="form-label fw-semibold">Sekunden</label>
            <input id="seconds" type="number" class="form-control text-center" style="width: 100px;" bind:value={inputSeconds} min="0" max="59" on:change={() => { if (!isRunning) timeSeconds = inputMinutes * 60 + inputSeconds; }} />
          </div>
          <div class="col-auto">
            <button class="btn btn-outline-secondary" on:click={resetTimer}>
              <i class="bi bi-arrow-counterclockwise me-1"></i>Zurücksetzen
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<!-- Save Session Modal -->
{#if showSaveModal}
  <div class="modal-backdrop-custom"></div>
  <div class="modal-custom" tabindex="-1" role="dialog" aria-modal="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <div>
            <h5 class="modal-title">Aktivität speichern</h5>
            <p class="text-muted mb-0 small">Speichern Sie die Details Ihrer Aktivität</p>
          </div>
          <button type="button" class="btn-close" aria-label="Close" on:click={closeModal}></button>
        </div>
        <form on:submit|preventDefault={saveSession}>
          <div class="modal-body">
            <div class="mb-3">
              <label for="session-title" class="form-label fw-semibold">Titel *</label>
              <input id="session-title" type="text" class="form-control" bind:value={sessionTitle} placeholder="z.B. Mathe lernen" required />
            </div>
            <div class="mb-3">
              <span class="form-label fw-semibold d-block">Tags</span>
              <div class="d-flex flex-wrap gap-2 mb-2">
                {#each selectedTags as tagId (tagId)}
                  {#if tagsMap.get(tagId)}
                    {@const tag = tagsMap.get(tagId)}
                    <span class="badge bg-secondary d-flex align-items-center">
                      {tag?.name ?? ''}
                      <button type="button" class="btn-close btn-close-white ms-2" style="font-size: 0.6rem;" aria-label="Entfernen" on:click={() => removeTag(tagId)}></button>
                    </span>
                  {/if}
                {/each}
              </div>
              <div class="d-flex flex-wrap gap-2">
                {#each data.tags as tag (tag._id)}
                  {#if !selectedTags.includes(tag._id)}
                    <button type="button" class="btn btn-outline-secondary btn-sm" on:click={() => addTag(tag._id)}>+ {tag.name}</button>
                  {/if}
                {/each}
              </div>
            </div>
            <div class="mb-3">
              <label for="session-description" class="form-label fw-semibold">Beschreibung</label>
              <textarea id="session-description" class="form-control" bind:value={sessionDescription} placeholder="Was haben Sie gemacht?" rows="3"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" on:click={closeModal}>Abbrechen</button>
            <button type="submit" class="btn btn-dark">Speichern</button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}

<style>
  .container {
    max-width: 800px;
  }
</style>
