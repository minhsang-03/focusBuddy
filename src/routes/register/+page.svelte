<script>
  import { enhance } from '$app/forms';

  let errorMessage = '';
  let isSubmitting = false;

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
      <h1 class="h3 fw-bold mb-2">Registrieren</h1>
      <p class="text-muted mb-4">Erstellen Sie ein neues Konto</p>

      <form method="POST" use:enhance={handleSubmit}>
        <div class="mb-3 text-start">
          <label for="name" class="form-label fw-semibold">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Ihr Name"
            required
            disabled={isSubmitting}
            class="form-control"
          />
        </div>

        <div class="mb-3 text-start">
          <label for="email" class="form-label fw-semibold">E-Mail</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="ihre@email.de"
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
            required
            disabled={isSubmitting}
            class="form-control"
          />
        </div>

        <div class="mb-3 text-start">
          <label for="confirm" class="form-label fw-semibold">Passwort bestätigen</label>
          <input
            id="confirm"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
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
          {isSubmitting ? 'Wird registriert...' : 'Registrieren'}
        </button>
      </form>

      <p class="text-muted mt-4 mb-0">
        Haben Sie bereits ein Konto? <a href="/login" class="text-primary fw-semibold text-decoration-none">Anmelden</a>
      </p>
    </div>
  </div>
</div>
