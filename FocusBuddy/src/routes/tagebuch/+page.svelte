<script>
  /** @type {{ user?: {_id:string, name:string, email:string} }} */
  export let data;
</script>

<div class="container py-4">
  <h1 class="mb-1">Tagebuch</h1>
  <p class="text-muted mb-4">Reflektieren Sie über Ihren Lernfortschritt</p>

  {#if !data.user}
    <div class="card">
      <div class="card-body text-center py-5">
        <p class="text-muted mb-3">Bitte melden Sie sich an, um diese Funktion zu nutzen.</p>
        <a href="/profil" class="btn btn-dark">
          <i class="bi bi-person me-2"></i>Zur Anmeldung
        </a>
      </div>
    </div>
  {:else}
    <!-- Work in Progress Message -->
    <div class="d-flex justify-content-center align-items-center" style="min-height: 300px;">
      <div class="card border-warning" style="max-width: 500px;">
        <div class="card-body text-center p-5">
          <div class="display-3 mb-3">🚧</div>
          <h2 class="h4 mb-3">Noch in Bearbeitung</h2>
          <p class="text-muted mb-2">Das Tagebuch-Feature wird derzeit entwickelt und wird bald verfügbar sein.</p>
          <p class="text-muted small fst-italic mb-0">Nutzen Sie in der Zwischenzeit die anderen Funktionen des FocusBuddy-Systems.</p>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 800px;
  }
</style>
