<script>
  import { enhance } from '$app/forms';

  /** @type {{ entries: Array<{_id:string, title:string, content:string, mood?:string, createdAt?:Date}>, user?: {_id:string, name:string, email:string} }} */
  export let data;

  let showForm = false;
  let isSubmitting = false;
  let formMessage = '';
  let entries = [];

  $: entries = data.entries || [];

  /** @param {string|Date|undefined} dateString */
  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year}, ${hours}:${minutes}`;
  }

  function handleSubmit() {
    isSubmitting = true;
    formMessage = '';
    return async (/** @type {any} */ { result, update }) => {
      isSubmitting = false;
      
      if (result.type === 'success' || (result.data && result.data.success)) {
        showForm = false;
        formMessage = '';
        // Reload data
        location.reload();
      } else if (result.type === 'failure' || result.data?.error) {
        formMessage = result.data?.error || 'Ein Fehler ist aufgetreten';
      } else {
        await update();
      }
    };
  }
</script>

<div class="journal-container">
  <h1>Tagebuch</h1>
  <p class="subtitle">Reflektieren Sie über Ihren Lernfortschritt</p>

  {#if !data.user}
    <div class="login-message">
      <p>Bitte melden Sie sich an, um Ihr Tagebuch zu nutzen.</p>
      <a href="/profil" class="btn-login-link">Zur Anmeldung</a>
    </div>
  {:else}
  <!-- New Entry Form -->
  <div class="new-entry-section">
    <h2>Neuer Eintrag</h2>

    <form method="POST" use:enhance={handleSubmit} class="entry-form">
      <input
        type="text"
        name="title"
        placeholder="Titel des Eintrags"
        required
        disabled={isSubmitting}
      />

      <textarea
        name="content"
        placeholder="Was haben Sie heute gelernt? Wie fühlen Sie sich? Was sind Ihre Gedanken?"
        rows="4"
        required
        disabled={isSubmitting}
      ></textarea>

      <select name="mood" disabled={isSubmitting}>
        <option value="">Stimmung (optional)</option>
        <option value="positive">Positiv 😊</option>
        <option value="neutral">Neutral 😐</option>
        <option value="negative">Negativ 😔</option>
      </select>

      <button type="submit" disabled={isSubmitting} class="btn-save">
        📔 Eintrag speichern
      </button>

      {#if formMessage}
        <p class="error-message">{formMessage}</p>
      {/if}
    </form>
  </div>

  <!-- Past Entries -->
  <div class="past-entries-section">
    <h2>Frühere Einträge</h2>

    {#if entries.length === 0}
      <div class="empty-state">
        <p>Noch keine Einträge vorhanden</p>
      </div>
    {:else}
      <div class="entries-list">
        {#each entries as entry (entry._id)}
          <article class="entry-item">
            <div class="entry-header">
              <h3>{entry.title}</h3>
              <span class="entry-date">{formatDate(entry.createdAt)}</span>
            </div>
            {#if entry.mood}
              <span class="entry-mood">
                {#if entry.mood === 'positive'}
                  😊 Positiv
                {:else if entry.mood === 'neutral'}
                  😐 Neutral
                {:else if entry.mood === 'negative'}
                  😔 Negativ
                {/if}
              </span>
            {/if}
            <p class="entry-content">{entry.content}</p>
          </article>
        {/each}
      </div>
    {/if}
  </div>
  {/if}
</div>

<style>
  .journal-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    font-size: 1.9rem;
    margin-bottom: 0.25rem;
    color: #1a1a1a;
  }

  .subtitle {
    color: #666;
    margin-bottom: 2rem;
  }

  h2 {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    color: #1a1a1a;
  }

  /* New Entry Section */
  .new-entry-section {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .entry-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  textarea,
  select {
    padding: 0.75rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-family: inherit;
    font-size: 1rem;
    resize: vertical;
  }

  textarea:focus,
  select:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
  }

  .btn-save {
    background: #0b1220;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s;
  }

  .btn-save:hover:not(:disabled) {
    background: #1a1a1a;
  }

  .btn-save:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .error-message {
    color: #d32f2f;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }

  /* Past Entries Section */
  .past-entries-section {
    margin-top: 2rem;
  }

  .empty-state {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    color: #999;
  }

  .entries-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .entry-item {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 1.5rem;
    transition: box-shadow 0.2s;
  }

  .entry-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.5rem;
    gap: 1rem;
  }

  .entry-header h3 {
    margin: 0;
    font-size: 1rem;
    color: #1a1a1a;
  }

  .entry-date {
    font-size: 0.85rem;
    color: #999;
    white-space: nowrap;
  }

  .entry-mood {
    display: inline-block;
    font-size: 0.85rem;
    color: #666;
    margin-bottom: 0.5rem;
  }

  .entry-content {
    margin: 0.75rem 0 0 0;
    color: #444;
    line-height: 1.6;
  }

  @media (max-width: 600px) {
    .journal-container {
      padding: 1rem;
    }

    h1 {
      font-size: 1.5rem;
    }

    .entry-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .entry-date {
      width: 100%;
    }
  }
</style>
