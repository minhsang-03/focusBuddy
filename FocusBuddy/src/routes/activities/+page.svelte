<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  function getTagName(tag) {
    if (typeof tag === 'object' && tag !== null && 'name' in tag) {
      return tag.name;
    }
    return String(tag);
  }

  let showNotification = false;
  let notificationType = 'success';
  let notificationMessage = '';

  /** @type {{ activities: Array<{_id: string, title: string, description: string, tags?: string[], method?: string, durationSeconds?: number, startTime?: Date, endTime?: Date, createdAt?: Date}>, user: any, learningMethods?: Array<{_id: string, name: string}> }} */
  export let data;

  let viewMode = 'liste';
  let totalTimeSeconds = 0;
  let timeUnit = 'minuten';
  /** @type {Array<{_id: string, title?: string, description?: string, tags?: string[], method?: string, durationSeconds?: number, startTime?: Date, endTime?: Date, createdAt?: Date}>} */
  let activities = [];
  /** @type {Array<{_id: string, name: string}>} */
  let learningMethods = [];
  
  /** @type {Chart | null} */
  let dailyChart = null;
  /** @type {Chart | null} */
  let categoryChart = null;

  onMount(() => {
    activities = data.activities || [];
    learningMethods = data.learningMethods || [];
    calculateTotalTime();
  });

  $: if (viewMode === 'diagramme' && activities.length > 0) {
    setTimeout(() => { initCharts(); }, 0);
  }
  
  $: if (viewMode === 'diagramme' && timeUnit) {
    setTimeout(() => { initCharts(); }, 0);
  }

  function calculateTotalTime() {
    totalTimeSeconds = activities.reduce((sum, activity) => {
      return sum + (activity.durationSeconds || 0);
    }, 0);
  }

  /** @param {number} seconds */
  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
  }

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
          activities = activities.filter(a => a._id !== id);
          calculateTotalTime();
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

  function getActivitiesByCategory() {
    /** @type {Record<string, number>} */
    const grouped = {};
    activities.forEach(activity => {
      if (activity.tags && Array.isArray(activity.tags) && activity.tags.length > 0) {
        activity.tags.forEach(tag => {
          const tagName = getTagName(tag);
          if (tagName) {
            grouped[tagName] = (grouped[tagName] || 0) + (activity.durationSeconds || 0);
          }
        });
      } else {
        grouped['Keine Tags'] = (grouped['Keine Tags'] || 0) + (activity.durationSeconds || 0);
      }
    });
    return grouped;
  }

  function initCharts() {
    const byDate = getActivitiesByDate();
    const byCategory = getActivitiesByCategory();
    const conversionFactor = timeUnit === 'stunden' ? 3600 : 60;
    const unitLabel = timeUnit === 'stunden' ? 'Stunden' : 'Minuten';
    
    const dailyCtx = /** @type {HTMLCanvasElement | null} */ (document.getElementById('dailyChart'));
    if (dailyCtx) {
      if (dailyChart) dailyChart.destroy();
      dailyChart = new Chart(dailyCtx, {
        type: 'bar',
        data: {
          labels: Object.keys(byDate),
          datasets: [{
            label: unitLabel,
            data: Object.values(byDate).map(s => parseFloat((s / conversionFactor).toFixed(2))),
            backgroundColor: '#0d6efd',
            borderRadius: 6,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: { legend: { display: false }, title: { display: true, text: `Zeit pro Tag (${unitLabel})` } },
          scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
      });
    }
    
    const categoryCtx = /** @type {HTMLCanvasElement | null} */ (document.getElementById('categoryChart'));
    if (categoryCtx) {
      if (categoryChart) categoryChart.destroy();
      categoryChart = new Chart(categoryCtx, {
        type: 'bar',
        data: {
          labels: Object.keys(byCategory),
          datasets: [{
            label: unitLabel,
            data: Object.values(byCategory).map(s => parseFloat((s / conversionFactor).toFixed(2))),
            backgroundColor: '#0d6efd',
            borderRadius: 6,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: { legend: { display: false }, title: { display: true, text: `Zeit pro Kategorie (${unitLabel})` } },
          scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
      });
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
  <h1 class="mb-1">Aktivitäten</h1>
  <p class="text-muted mb-4">Überblick über Ihre getrackte Zeit</p>

  {#if !data.user}
    <div class="card">
      <div class="card-body text-center py-5">
        <p class="text-muted mb-3">Bitte melden Sie sich an, um Ihre Aktivitäten zu sehen.</p>
        <a href="/profil" class="btn btn-dark">
          <i class="bi bi-person me-2"></i>Zur Anmeldung
        </a>
      </div>
    </div>
  {:else}
    <!-- Total time display -->
    <div class="card mb-4">
      <div class="card-body d-flex align-items-center gap-3">
        <span class="display-6">⏱️</span>
        <div>
          <div class="text-muted small">Gesamte Zeit</div>
          <div class="h4 mb-0 fw-semibold">{formatTime(totalTimeSeconds)}</div>
        </div>
      </div>
    </div>

    <!-- View toggle buttons -->
    <div class="btn-group mb-4" role="group">
      <button type="button" class="btn {viewMode === 'liste' ? 'btn-dark' : 'btn-outline-dark'}" on:click={() => (viewMode = 'liste')}>
        <i class="bi bi-list-ul me-1"></i>Liste
      </button>
      <button type="button" class="btn {viewMode === 'diagramme' ? 'btn-dark' : 'btn-outline-dark'}" on:click={() => (viewMode = 'diagramme')}>
        <i class="bi bi-bar-chart me-1"></i>Diagramme
      </button>
    </div>

    <!-- List view -->
    {#if viewMode === 'liste'}
      <div class="d-flex flex-column gap-3">
        {#if activities.length === 0}
          <p class="text-center text-muted py-4">Noch keine Aktivitäten erfasst</p>
        {:else}
          {#each activities as activity (activity._id)}
            <div class="card">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h5 class="card-title mb-0">{activity.title || 'Ohne Titel'}</h5>
                  <div class="d-flex gap-2">
                    <a class="btn btn-sm btn-outline-secondary" title="Bearbeiten" href="/activities/{activity._id}">
                      <i class="bi bi-pencil"></i>
                    </a>
                    <button class="btn btn-sm btn-outline-danger" title="Löschen" on:click={() => deleteActivityItem(activity._id)}>
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
                <div class="text-muted small mb-2">
                  <i class="bi bi-clock me-1"></i>{activity.createdAt ? formatDate(activity.createdAt) : ''}
                </div>
                {#if activity.tags && activity.tags.length > 0}
                  <div class="mb-2">
                    {#each activity.tags as tag}
                      <span class="badge bg-primary me-1">{getTagName(tag)}</span>
                    {/each}
                  </div>
                {/if}
                {#if activity.description}
                  <p class="card-text text-muted mb-0">{activity.description}</p>
                {/if}
              </div>
            </div>
          {/each}
        {/if}
      </div>
    {:else}
      <!-- Diagram view -->
      <div>
        <!-- Time unit toggle -->
        <div class="d-flex justify-content-center gap-2 mb-4">
          <button class="btn {timeUnit === 'minuten' ? 'btn-primary' : 'btn-outline-primary'}" on:click={() => (timeUnit = 'minuten')}>
            In Minuten
          </button>
          <button class="btn {timeUnit === 'stunden' ? 'btn-primary' : 'btn-outline-primary'}" on:click={() => (timeUnit = 'stunden')}>
            In Stunden
          </button>
        </div>
        <div class="row g-4">
          <div class="col-md-6">
            <div class="card">
              <div class="card-body">
                <canvas id="dailyChart"></canvas>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card">
              <div class="card-body">
                <canvas id="categoryChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  .container {
    max-width: 960px;
  }
</style>
