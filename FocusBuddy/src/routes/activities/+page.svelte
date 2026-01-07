<script>
  /**
   * Returns tag name if tag is object, else string
   * @param {any} tag
   * @returns {string}
   */
  function getTagName(tag) {
    if (typeof tag === 'object' && tag !== null && 'name' in tag) {
      return tag.name;
    }
    return String(tag);
  }
  import { enhance } from '$app/forms';
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  // Notification state
  let showNotification = false;
  let notificationType = 'success'; // 'success' or 'error'
  let notificationMessage = '';

  /** @type {{ activities: Array<{_id: string, title: string, description: string, tags?: string[], method?: string, durationSeconds?: number, startTime?: Date, endTime?: Date, createdAt?: Date}>, user: any, learningMethods?: Array<{_id: string, name: string}> }} */
  export let data;

  let viewMode = 'liste'; // 'liste' or 'diagramme'
  let totalTimeSeconds = 0;
  let timeUnit = 'minuten'; // 'minuten' or 'stunden'
  /** @type {Array<{_id: string, title?: string, description?: string, tags?: string[], method?: string, durationSeconds?: number, startTime?: Date, endTime?: Date, createdAt?: Date}>} */
  let activities = [];
  /** @type {Array<{_id: string, name: string}>} */
  let learningMethods = [];
  
  // Chart instances
  /** @type {Chart | null} */
  let dailyChart = null;
  /** @type {Chart | null} */
  let categoryChart = null;

  onMount(() => {
    activities = data.activities || [];
    learningMethods = data.learningMethods || [];
    calculateTotalTime();
  });

  // Initialize charts when switching to diagram view or changing time unit
  $: if (viewMode === 'diagramme' && activities.length > 0) {
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      initCharts();
    }, 0);
  }
  
  // Re-render charts when time unit changes
  $: if (viewMode === 'diagramme' && timeUnit) {
    setTimeout(() => {
      initCharts();
    }, 0);
  }

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
      try {
        const formData = new FormData();
        formData.append('id', id);
        const response = await fetch('/activities?/deleteActivity', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          // Remove from local list
          activities = activities.filter(a => a._id !== id);
          calculateTotalTime();
          
          // Show success notification
          showNotification = true;
          notificationType = 'success';
          notificationMessage = 'Aktivität erfolgreich gelöscht!';
          setTimeout(() => { showNotification = false; }, 3000);
        } else {
          showNotification = true;
          notificationType = 'error';
          notificationMessage = 'Fehler beim Löschen der Aktivität';
          setTimeout(() => { showNotification = false; }, 5000);
        }
      } catch (error) {
        console.error('Fehler:', error);
        showNotification = true;
        notificationType = 'error';
        notificationMessage = 'Netzwerkfehler beim Löschen';
        setTimeout(() => { showNotification = false; }, 5000);
      }
    }
  }

  /**
   * @param {Date|string|number} date
   * @returns {string}
   */
  function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Get activities grouped by date
  function getActivitiesByDate() {
    /** @type {Record<string, number>} */
    const grouped = {};
    
    activities.forEach(activity => {
      if (activity.startTime) {
        const date = new Date(activity.startTime);
        const dateKey = date.toLocaleDateString('de-DE');
        grouped[dateKey] = (grouped[dateKey] || 0) + (activity.durationSeconds || 0);
      }
    });
    
    return grouped;
  }

  // Get activities grouped by tags/category
  function getActivitiesByCategory() {
    /** @type {Record<string, number>} */
    const grouped = {};
    
    activities.forEach(activity => {
      if (activity.tags && Array.isArray(activity.tags) && activity.tags.length > 0) {
        activity.tags.forEach(tag => {
          // Tag kann ein Objekt {_id, name} oder ein String sein
          let tagName = '';
          if (typeof tag === 'object' && tag !== null) {
            tagName = tag.name || String(tag._id);
          } else {
            tagName = String(tag);
          }
          
          if (tagName) {
            grouped[tagName] = (grouped[tagName] || 0) + (activity.durationSeconds || 0);
          }
        });
      } else {
        // If no tags, add to "Keine Tags" category
        grouped['Keine Tags'] = (grouped['Keine Tags'] || 0) + (activity.durationSeconds || 0);
      }
    });
    
    return grouped;
  }

  // Initialize both charts
  function initCharts() {
    const byDate = getActivitiesByDate();
    const byCategory = getActivitiesByCategory();
    
    console.log('Activities:', activities);
    console.log('By Category:', byCategory);
    
    // Determine conversion factor and label
    const conversionFactor = timeUnit === 'stunden' ? 3600 : 60;
    const unitLabel = timeUnit === 'stunden' ? 'Stunden' : 'Minuten';
    
    // Daily chart
    const dailyCtx = document.getElementById('dailyChart');
    if (dailyCtx) {
      if (dailyChart) dailyChart.destroy();
      
      dailyChart = new Chart(dailyCtx, {
        type: 'bar',
        data: {
          labels: Object.keys(byDate),
          datasets: [{
            label: unitLabel,
            data: Object.values(byDate).map(s => parseFloat((s / conversionFactor).toFixed(2))),
            backgroundColor: '#2196f3',
            borderRadius: 6,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: `Zeit pro Tag (${unitLabel})`
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    }
    
    // Category chart
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
      if (categoryChart) categoryChart.destroy();
      
      categoryChart = new Chart(categoryCtx, {
        type: 'bar',
        data: {
          labels: Object.keys(byCategory),
          datasets: [{
            label: unitLabel,
            data: Object.values(byCategory).map(s => parseFloat((s / conversionFactor).toFixed(2))),
            backgroundColor: '#2196f3',
            borderRadius: 6,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: `Zeit pro Tag (${unitLabel})`
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
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
                <a class="action-btn edit-btn" title="Bearbeiten" href="/activities/{activity._id}">✎</a>
                <button class="action-btn delete-btn" title="Löschen" on:click={() => deleteActivityItem(activity._id)}>🗑️</button>
              </div>
            </div>
            <div class="activity-meta">
              <span class="meta-item">⏰ {activity.createdAt ? formatDate(activity.createdAt) : ''}</span>
            </div>
            {#if activity.tags && activity.tags.length > 0}
              <div class="activity-tags">
                {#each activity.tags as tag}
                  <span class="tag">{getTagName(tag)}</span>
                {/each}
              </div>
            {/if}
            <p class="activity-description">{activity.description || ''}</p>
          </div>
        {/each}
      {/if}
    </div>
  {:else}
    <!-- Diagram view -->
    <div class="diagram-view">
      <!-- Time unit toggle -->
      <div class="time-unit-toggle">
        <button
          class="unit-btn {timeUnit === 'minuten' ? 'active' : ''}"
          on:click={() => (timeUnit = 'minuten')}
        >
          In Minuten
        </button>
        <button
          class="unit-btn {timeUnit === 'stunden' ? 'active' : ''}"
          on:click={() => (timeUnit = 'stunden')}
        >
          In Stunden
        </button>
      </div>
      <div class="charts-grid">
        <div class="chart-card">
          <canvas id="dailyChart"></canvas>
        </div>
        <div class="chart-card">
          <canvas id="categoryChart"></canvas>
        </div>
      </div>
    </div>
  {/if}
  {/if}
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
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .time-unit-toggle {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    justify-content: center;
  }

  .unit-btn {
    padding: 0.6rem 1.2rem;
    border: 2px solid #e0e0e0;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 500;
    transition: all 0.2s;
    color: #666;
  }

  .unit-btn:hover {
    border-color: #2196f3;
    color: #2196f3;
  }

  .unit-btn.active {
    background: #2196f3;
    border-color: #2196f3;
    color: white;
  }

  .charts-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .chart-card {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .chart-card h3 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    color: #1a1a1a;
    text-align: left;
  }

  .chart-card canvas {
    max-height: 300px;
  }

  @media (max-width: 900px) {
    .charts-grid {
      grid-template-columns: 1fr;
    }
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
