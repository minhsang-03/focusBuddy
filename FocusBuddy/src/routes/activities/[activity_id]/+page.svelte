<script>
  import { goto } from '$app/navigation';
  
  export let data;
  /** @type {import('./$types').ActionData | null} */
  export let form = null;
  let activity = data.activity;
  let title = activity.title || '';
  let description = activity.description || '';
  let method = activity.method || '';
  let durationSeconds = activity.durationSeconds || 0;
  let startTime = activity.startTime ? new Date(activity.startTime).toISOString().slice(0,16) : '';
  let endTime = activity.endTime ? new Date(activity.endTime).toISOString().slice(0,16) : '';
  
  // Tags state - extract IDs from activity tags
  /** @type {string[]} */
  let selectedTags = (activity.tags || []).map(/** @param {any} t */ t => typeof t === 'object' ? t._id : t);
  /** @type {Array<{_id: string, name: string}>} */
  let availableTags = data.tags || [];
  /** @type {Array<{_id: string, name: string}>} */
  let learningMethods = data.learningMethods || [];

  /**
   * Toggle tag selection
   * @param {string} tagId
   */
  function toggleTag(tagId) {
    if (selectedTags.includes(tagId)) {
      selectedTags = selectedTags.filter(id => id !== tagId);
    } else {
      selectedTags = [...selectedTags, tagId];
    }
  }

  // Notification state
  let showNotification = false;
  let notificationType = 'success';
  let notificationMessage = '';
  let isSubmitting = false;

  async function handleSubmit(event) {
    event.preventDefault();
    isSubmitting = true;
    
    const formData = new FormData(event.target);
    
    try {
      const response = await fetch(`/activities/${activity._id}`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        showNotification = true;
        notificationType = 'success';
        notificationMessage = 'Aktivität erfolgreich gespeichert!';
        // Redirect to activities page after short delay
        setTimeout(() => { 
          goto('/activities');
        }, 1500);
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
    <div class="alert {notificationType === 'success' ? 'alert-success' : 'alert-danger'} alert-dismissible fade show" role="alert">
      {#if notificationType === 'success'}
        <strong>✓</strong>
      {:else}
        <strong>✕</strong>
      {/if}
      {notificationMessage}
      <button type="button" class="btn-close" aria-label="Close" on:click={() => showNotification = false}></button>
    </div>
  </div>
{/if}

<div class="activity-edit-card">
  <h1>Aktivität bearbeiten</h1>
  <form on:submit={handleSubmit}>
    <label class="activity-label">Titel:
      <input class="activity-input" name="title" bind:value={title} required />
    </label>
    <label class="activity-label">Beschreibung:
      <textarea class="activity-input" name="description" bind:value={description} rows="3"></textarea>
    </label>
    <label class="activity-label">Methode:
      <select class="activity-input" name="method" bind:value={method}>
        <option value="">Keine Methode</option>
        {#each learningMethods as lm}
          <option value={lm._id}>{lm.name}</option>
        {/each}
      </select>
    </label>
    <label class="activity-label">Dauer (Sekunden):
      <input class="activity-input" name="durationSeconds" type="number" bind:value={durationSeconds} min="0" />
    </label>
    <label class="activity-label">Startzeit:
      <input class="activity-input" name="startTime" type="datetime-local" bind:value={startTime} />
    </label>
    <label class="activity-label">Endzeit:
      <input class="activity-input" name="endTime" type="datetime-local" bind:value={endTime} />
    </label>
    
    <!-- Tags selection -->
    <div class="activity-label">Tags:
      <div class="tags-container">
        {#each availableTags as tag}
          <button 
            type="button" 
            class="tag-chip {selectedTags.includes(tag._id) ? 'selected' : ''}"
            on:click={() => toggleTag(tag._id)}
          >
            {tag.name}
          </button>
        {/each}
        {#if availableTags.length === 0}
          <span class="no-tags">Keine Tags verfügbar</span>
        {/if}
      </div>
      <!-- Hidden inputs for selected tags -->
      {#each selectedTags as tagId}
        <input type="hidden" name="tags" value={tagId} />
      {/each}
    </div>
    
    <div class="button-group">
      <a href="/activities" class="activity-btn activity-btn-cancel">Abbrechen</a>
      <button class="activity-btn" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Speichern...' : 'Speichern'}
      </button>
    </div>
  </form>
</div>

<style>
/* Notification styles */
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1050;
  min-width: 300px;
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

.alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.alert-success {
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.alert-danger {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  margin-left: auto;
  opacity: 0.5;
  padding: 0;
  line-height: 1;
}

.btn-close:hover {
  opacity: 1;
}

.btn-close::before {
  content: '×';
}

/* Tags styles */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag-chip {
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tag-chip:hover {
  background: #e0e0e0;
}

.tag-chip.selected {
  background: #e3f2fd;
  border-color: #1565c0;
  color: #1565c0;
}

.no-tags {
  color: #999;
  font-size: 0.9rem;
}

.activity-edit-card {
  max-width: 600px;
  margin: 2rem auto;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 2rem 2rem 1.5rem 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}
.activity-edit-card h1 {
  color: #1a1a1a;
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  text-align: left;
}
.activity-label {
  display: block;
  color: #666;
  font-size: 1rem;
  margin-bottom: 1rem;
}
.activity-input {
  display: block;
  width: 100%;
  margin-top: 0.3rem;
  padding: 0.6rem 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  background: #f9f9f9;
  color: #222;
  transition: border 0.2s;
}
.activity-input:focus {
  outline: none;
  border-color: #2196f3;
}
.activity-btn {
  background: #1a1a1a;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.8rem 1.2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.2s;
}
.activity-btn:hover {
  background: #2196f3;
}
.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
.activity-btn-cancel {
  background: #f0f0f0;
  color: #1a1a1a;
  text-decoration: none;
  text-align: center;
}
.activity-btn-cancel:hover {
  background: #e0e0e0;
}
.activity-error {
  color: #d32f2f;
  background: #ffebee;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  text-align: center;
}
@media (max-width: 600px) {
  .activity-edit-card {
    padding: 1rem;
  }
}
</style>
