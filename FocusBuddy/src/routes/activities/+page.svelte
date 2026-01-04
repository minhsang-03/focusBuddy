<script>
  import { enhance } from '$app/forms';
  import { onMount } from 'svelte';

  /** @type {{ activities: Array<{_id: string, title: string, description: string, tags?: string[], method?: string, durationSeconds?: number, startTime?: Date, endTime?: Date, createdAt?: Date}>, user: any }} */
  export let data;

  let viewMode = 'liste'; // 'liste' or 'diagramme'
  let totalTimeSeconds = 0;
  /** @type {Array<{_id: string, title?: string, description?: string, tags?: string[], method?: string, durationSeconds?: number, startTime?: Date, endTime?: Date, createdAt?: Date}>} */
  let activities = [];

  onMount(() => {
    activities = data.activities || [];
    calculateTotalTime();
  });

  // Calculate total time from all activities
  function calculateTotalTime() {
    totalTimeSeconds = activities.reduce((sum, activity) => {
      return sum + (activity.durationSeconds || 0);
    }, 0);
  }

  // Format seconds to HH:MM:SS
  /** @param {number} seconds */
  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
  }

  // Delete activity
  /**
   * @param {string} id
   */
  async function deleteActivityItem(id) {
    if (confirm('Möchten Sie diese Aktivität wirklich löschen?')) {
      const formData = new FormData();
      formData.append('id', id);
      await fetch('/activities?/deleteActivity', {
        method: 'POST',
        body: formData,
      });
      // Reload page or update list
      location.reload();
    }
  }
</script>

<div class="activities-container">
  <h1>Aktivitäten</h1>
  <p class="subtitle">Überblick über Ihre getrackte Zeit</p>

  {#if !data.user}
    <div class="login-message">
      <p>Bitte melden Sie sich an, um Ihre Aktivitäten zu sehen.</p>
      <a href="/profil" class="btn-login-link">Zur Anmeldung</a>
    </div>
  {:else}
  <!-- Total time display -->
  <div class="total-time">
    <div class="time-icon">⏱️</div>
    <div>
      <div class="time-label">Gesamte Zeit</div>
      <div class="time-value">{formatTime(totalTimeSeconds)}</div>
    </div>
  </div>

  <!-- View toggle buttons -->
  <div class="view-toggle">
    <button
      class="toggle-btn {viewMode === 'liste' ? 'active' : ''}"
      on:click={() => (viewMode = 'liste')}
    >
      Liste
    </button>
    <button
      class="toggle-btn {viewMode === 'diagramme' ? 'active' : ''}"
      on:click={() => (viewMode = 'diagramme')}
    >
      Diagramme
    </button>
  </div>

  <!-- List view -->
  {#if viewMode === 'liste'}
    <div class="activities-list">
      {#if activities.length === 0}
        <p class="empty-state">Noch keine Aktivitäten erfasst</p>
      {:else}
        {#each activities as activity (activity._id)}
          <div class="activity-card">
            <div class="activity-header">
              <h3>{activity.title || 'Ohne Titel'}</h3>
              <div class="activity-actions">
                <button class="action-btn edit-btn" title="Bearbeiten">✎</button>
                <button class="action-btn delete-btn" title="Löschen" on:click={() => deleteActivityItem(activity._id)}>🗑️</button>
              </div>
            </div>
            <div class="activity-meta">
              <span class="meta-item">⏰ {formatTime(activity.createdAt)}</span>
            </div>
            {#if activity.tags && activity.tags.length > 0}
              <div class="activity-tags">
                {#each activity.tags as tag}
                  <span class="tag">{tag}</span>
                {/each}
              </div>
            {/if}
            <p class="activity-description">{activity.description || ''}</p>
          </div>
        {/each}
      {/if}
    </div>
  {:else}
    <!-- Diagram view (placeholder) -->
    <div class="diagram-view">
      <p>Diagramme-Ansicht (In Entwicklung)</p>
    </div>
  {/if}
  {/if}
</div>

<style>
  .activities-container {
    max-width: 960px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
    color: #1a1a1a;
  }

  .subtitle {
    color: #666;
    margin-bottom: 2rem;
    font-size: 0.95rem;
  }

  /* Total time display */
  .total-time {
    background: #f5f5f5;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .time-icon {
    font-size: 2.5rem;
  }

  .time-label {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }

  .time-value {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1a1a1a;
  }

  /* View toggle */
  .view-toggle {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }

  .toggle-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s;
  }

  .toggle-btn:hover {
    background: #f5f5f5;
  }

  .toggle-btn.active {
    background: #1a1a1a;
    color: white;
    border-color: #1a1a1a;
  }

  /* Activities list */
  .activities-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .empty-state {
    text-align: center;
    color: #999;
    padding: 2rem;
  }

  /* Activity card */
  .activity-card {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.5rem;
    transition: box-shadow 0.2s;
  }

  .activity-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .activity-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .activity-header h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #1a1a1a;
  }

  .activity-actions {
    display: flex;
    gap: 0.5rem;
  }

  .action-btn {
    background: none;
    border: none;
    font-size: 1.1rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    opacity: 0.7;
    transition: opacity 0.2s;
  }

  .action-btn:hover {
    opacity: 1;
  }

  .edit-btn:hover {
    color: #2196f3;
  }

  .delete-btn:hover {
    color: #f44336;
  }

  .activity-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.85rem;
    color: #666;
    margin-bottom: 0.75rem;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .activity-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .tag {
    background: #e3f2fd;
    color: #1565c0;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.8rem;
  }

  .activity-description {
    margin: 0;
    color: #333;
    line-height: 1.5;
  }

  .diagram-view {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    color: #999;
  }

  /* Login message */
  .login-message {
    background: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    margin-bottom: 2rem;
  }

  .login-message p {
    margin: 0 0 1rem 0;
    color: #333;
    font-size: 1rem;
  }

  .btn-login-link {
    display: inline-block;
    background: #0b1220;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    text-decoration: none;
    transition: background 0.3s;
  }

  .btn-login-link:hover {
    background: #1a1a1a;
  }

  @media (max-width: 600px) {
    .activities-container {
      padding: 1rem;
    }

    h1 {
      font-size: 1.5rem;
    }

    .total-time {
      padding: 1rem;
    }

    .activity-card {
      padding: 1rem;
    }

    .activity-header {
      flex-direction: column;
      gap: 0.75rem;
    }
  }
</style>
