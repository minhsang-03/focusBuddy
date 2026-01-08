<script>
  import { goto } from '$app/navigation';
  
  export let data;
  let activity = data.activity;
  let title = activity.title || '';
  let description = activity.description || '';
  let method = activity.method || '';
  
  let durationHours = 0;
  let durationMinutes = 0;
  let durationSeconds = 0;
  
  $: if (activity.durationSeconds) {
    const totalSecs = activity.durationSeconds;
    durationHours = Math.floor(totalSecs / 3600);
    durationMinutes = Math.floor((totalSecs % 3600) / 60);
    durationSeconds = totalSecs % 60;
  }
  
  /** @type {string[]} */
  let selectedTags = (activity.tags || []).map(/** @param {any} t */ t => typeof t === 'object' ? t._id : t);
  /** @type {Array<{_id: string, name: string}>} */
  let availableTags = /** @type {Array<{_id: string, name: string}>} */ (data.tags || []);
  /** @type {Array<{_id: string, name: string}>} */
  let learningMethods = /** @type {Array<{_id: string, name: string}>} */ (data.learningMethods || []);

  /**
   * @param {string} tagId
   */
  function toggleTag(tagId) {
    if (selectedTags.includes(tagId)) {
      selectedTags = selectedTags.filter(id => id !== tagId);
    } else {
      selectedTags = [...selectedTags, tagId];
    }
  }

  /**
   * @returns {number}
   */
  function getTotalDurationSeconds() {
    return (durationHours * 3600) + (durationMinutes * 60) + durationSeconds;
  }

  let showNotification = false;
  let notificationType = 'success';
  let notificationMessage = '';
  let isSubmitting = false;

  /** @param {SubmitEvent} event */
  async function handleSubmit(event) {
    event.preventDefault();
    isSubmitting = true;
    
    const form = /** @type {HTMLFormElement} */ (event.target);
    const formData = new FormData(form);
    const totalDurationSeconds = getTotalDurationSeconds();
    formData.set('durationSeconds', String(totalDurationSeconds));
    
    try {
      const response = await fetch(`/activities/${activity._id}`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        showNotification = true;
        notificationType = 'success';
        notificationMessage = 'Aktivität erfolgreich gespeichert!';
        setTimeout(() => { goto('/activities'); }, 1500);
      } else {
        showNotification = true;
        notificationType = 'error';
        notificationMessage = 'Fehler beim Speichern der Aktivität';
        setTimeout(() => { showNotification = false; }, 5000);
      }
    } catch (error) {
      console.error('Fehler:', error);
      showNotification = true;
      notificationType = 'error';
      notificationMessage = 'Netzwerkfehler beim Speichern';
      setTimeout(() => { showNotification = false; }, 5000);
    } finally {
      isSubmitting = false;
    }
  }
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

<div class="container py-4">
  <div class="card" style="max-width: 600px; margin: 0 auto;">
    <div class="card-body">
      <h1 class="h4 mb-4">Aktivität bearbeiten</h1>
      
      <form on:submit={handleSubmit}>
        <div class="mb-3">
          <label for="title" class="form-label fw-semibold">Titel</label>
          <input id="title" type="text" name="title" class="form-control" bind:value={title} required />
        </div>
        
        <div class="mb-3">
          <label for="description" class="form-label fw-semibold">Beschreibung</label>
          <textarea id="description" name="description" class="form-control" rows="3" bind:value={description}></textarea>
        </div>
        
        <div class="mb-3">
          <label for="method" class="form-label fw-semibold">Methode</label>
          <select id="method" name="method" class="form-select" bind:value={method}>
            <option value="">Keine Methode</option>
            {#each learningMethods as lm}
              <option value={lm._id}>{lm.name}</option>
            {/each}
          </select>
        </div>
        
        <div class="mb-3">
          <span class="form-label fw-semibold d-block">Dauer</span>
          <div class="row g-2">
            <div class="col-4">
              <input type="number" class="form-control text-center" bind:value={durationHours} min="0" max="23" />
              <div class="text-muted small text-center mt-1">Stunden</div>
            </div>
            <div class="col-4">
              <input type="number" class="form-control text-center" bind:value={durationMinutes} min="0" max="59" />
              <div class="text-muted small text-center mt-1">Minuten</div>
            </div>
            <div class="col-4">
              <input type="number" class="form-control text-center" bind:value={durationSeconds} min="0" max="59" />
              <div class="text-muted small text-center mt-1">Sekunden</div>
            </div>
          </div>
        </div>
    
        <div class="mb-4">
          <span class="form-label fw-semibold d-block">Tags</span>
          <div class="d-flex flex-wrap gap-2">
            {#each availableTags as tag}
              <button 
                type="button" 
                class="btn btn-sm {selectedTags.includes(tag._id) ? 'btn-primary' : 'btn-outline-secondary'}"
                on:click={() => toggleTag(tag._id)}
              >
                {tag.name}
              </button>
            {/each}
            {#if availableTags.length === 0}
              <span class="text-muted">Keine Tags verfügbar</span>
            {/if}
          </div>
          {#each selectedTags as tagId}
            <input type="hidden" name="tags" value={tagId} />
          {/each}
        </div>
    
        <div class="d-flex gap-2">
          <a href="/activities" class="btn btn-secondary flex-grow-1">
            <i class="bi bi-x-lg me-1"></i>Abbrechen
          </a>
          <button type="submit" class="btn btn-dark flex-grow-1" disabled={isSubmitting}>
            <i class="bi bi-save me-1"></i>{isSubmitting ? 'Speichern...' : 'Speichern'}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>


