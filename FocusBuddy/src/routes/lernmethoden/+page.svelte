<script>
  /** @type {{ learningMethods: Array<{_id:string,name:string,description?:string,defaultWorkMinutes?:number,defaultBreakMinutes?:number,icon?:string,iconColor?:string,steps?:string[],notificationText?:string}> }} */
  export let data;
</script>

<div class="container py-4">
  <h1 class="mb-1">Lernmethoden</h1>
  <p class="text-muted mb-4">Bewährte Techniken für effizientes Lernen</p>

  <div class="row row-cols-1 row-cols-md-2 g-4">
    {#each data.learningMethods as method (method._id)}
      <div class="col">
        <div class="card h-100">
          <div class="card-body">
            <div class="text-center mb-3">
              {#if method.icon}
                <i class="bi {method.icon} display-5" style:color={method.iconColor || '#6b7280'}></i>
              {:else}
                <span class="display-5">📘</span>
              {/if}
            </div>
            <h5 class="card-title">{method.name}</h5>
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
      </div>
    {/each}
  </div>
</div>

<style>
  .container {
    max-width: 1100px;
  }
</style>
