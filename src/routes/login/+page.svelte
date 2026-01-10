<script>
  import { enhance } from '$app/forms';

  let email = '';
  let password = '';
  let isSubmitting = false;
  let errorMessage = '';

  function handleSubmit() {
    isSubmitting = true;
    errorMessage = '';
    return async (/** @type {any} */ { result, update }) => {
      isSubmitting = false;
      
      if (result.type === 'redirect') {
        window.location.href = result.location;
      } else if (result.type === 'failure' || result.data?.error) {
        errorMessage = result.data?.error || 'Ein Fehler ist aufgetreten';
      } else {
        await update();
      }
    };
  }
</script>

<div class="min-vh-100 d-flex align-items-center justify-content-center bg-light py-4">
  <div class="card shadow-lg" style="max-width: 480px; width: 100%;">
    <div class="card-body p-4 p-md-5 text-center">
      <h1 class="h3 fw-bold mb-2">Willkommen bei FocusBuddy</h1>
      <p class="text-muted mb-4">Melden Sie sich an, um fortzufahren</p>

      <form method="POST" use:enhance={handleSubmit}>
        <div class="mb-3 text-start">
          <label for="email" class="form-label fw-semibold">E-Mail</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="ihre@email.de"
            bind:value={email}
            required
            disabled={isSubmitting}
            class="form-control"
          />
        </div>

        <div class="mb-3 text-start">
          <label for="password" class="form-label fw-semibold">Passwort</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="••••••••"
            bind:value={password}
            required
            disabled={isSubmitting}
            class="form-control"
          />
        </div>

        {#if errorMessage}
          <div class="alert alert-danger py-2 text-start">
            <i class="bi bi-exclamation-triangle me-2"></i>{errorMessage}
          </div>
        {/if}

        <button type="submit" class="btn btn-dark w-100 py-2 fw-semibold" disabled={isSubmitting}>
          {isSubmitting ? 'Wird angemeldet...' : 'Anmelden'}
        </button>
      </form>

      <p class="text-muted mt-4 mb-0">
        Noch kein Konto? <a href="/register" class="text-primary fw-semibold text-decoration-none">Registrieren</a>
      </p>
    </div>
  </div>
</div>
