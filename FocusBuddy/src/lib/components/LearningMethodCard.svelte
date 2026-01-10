<script>
  /** @type {{ _id: string, name: string, description?: string, defaultWorkMinutes?: number, defaultBreakMinutes?: number, icon?: string, iconColor?: string, steps?: string[], notificationText?: string }} */
  export let method;
</script>

<div class="card h-100">
  <div class="card-body">
    <div class="text-center mb-3">
      {#if method.icon}
        <div class="icon-circle mx-auto">
          <i class="bi {method.icon}"></i>
        </div>
      {:else}
        <div class="icon-circle mx-auto">
          <span>📘</span>
        </div>
      {/if}
    </div>
    <h5 class="card-title text-center">{method.name}</h5>
    <p class="card-text text-muted">{method.description || ''}</p>

    {#if method.steps && method.steps.length > 0}
      <div class="mb-3">
        <strong class="small">So funktioniert's:</strong>
        <ol class="small text-muted mt-1 mb-0">
          {#each method.steps as step}
            <li>{step}</li>
          {/each}
        </ol>
      </div>
    {/if}

    {#if method.notificationText}
      <div class="alert alert-warning py-2 small mb-3">
        <strong>Erinnerung:</strong> {method.notificationText}
      </div>
    {/if}

    <div class="text-center">
      <a class="btn btn-primary" href={`/timer?method=${method._id}`}>
        <i class="bi bi-play-fill me-1"></i>Im Timer anwenden
      </a>
    </div>
  </div>
</div>

<style>
  .icon-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e7f1ff;
  }
  
  .icon-circle i,
  .icon-circle span {
    font-size: 2.5rem;
    color: #0d6efd;
  }
</style>
