<script>
  import { enhance } from '$app/forms';

  /** @type {{ user: { _id: string; name: string; email: string } }} */
  export let data;

  let user = data.user;
  let passwordSuccess = false;
  let profileSuccess = false;

  /**
   * @param {string} email
   */
  function getInitial(email) {
    return email?.charAt(0).toUpperCase() || 'U';
  }
</script>

<div class="container py-4">
  <h1 class="mb-1">Profil</h1>
  <p class="text-muted mb-4">Verwalten Sie Ihre Kontoeinstellungen</p>

  <!-- Profile Card -->
  <div class="card mb-4">
    <div class="card-body">
      <div class="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom">
        <div class="avatar bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 80px; height: 80px; font-size: 2rem; font-weight: bold;">
          {getInitial(user.email)}
        </div>
        <div>
          <h5 class="mb-1">{user.name}</h5>
          <p class="text-muted mb-0">{user.email}</p>
        </div>
      </div>

      <form method="POST" action="?/updateProfile" use:enhance={() => {
        return async ({ result }) => {
          if (result.type === 'success') {
            profileSuccess = true;
            setTimeout(() => { profileSuccess = false; }, 3000);
          }
        };
      }}>
        <div class="mb-3">
          <label for="name" class="form-label fw-semibold">Name</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-person"></i></span>
            <input id="name" type="text" name="name" value={user.name} placeholder="Ihr Name" class="form-control" />
          </div>
        </div>

        <div class="mb-3">
          <label for="email" class="form-label fw-semibold">E-Mail</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-envelope"></i></span>
            <input id="email" type="email" name="email" value={user.email} placeholder="Ihre E-Mail" class="form-control" />
          </div>
        </div>

        <button type="submit" class="btn btn-dark">
          <i class="bi bi-save me-2"></i>Profil speichern
        </button>

        {#if profileSuccess}
          <div class="alert alert-success mt-3 mb-0 py-2">
            <i class="bi bi-check-circle me-2"></i>Profil erfolgreich aktualisiert!
          </div>
        {/if}
      </form>
    </div>
  </div>

  <!-- Password Change Section -->
  <div class="card mb-4">
    <div class="card-body">
      <h5 class="card-title mb-3">Passwort ändern</h5>

      <form method="POST" action="?/changePassword" use:enhance={() => {
        return async ({ result }) => {
          if (result.type === 'success') {
            passwordSuccess = true;
            setTimeout(() => { passwordSuccess = false; }, 3000);
            const form = document.querySelector('form[action*="changePassword"]');
            if (form instanceof HTMLFormElement) form.reset();
          }
        };
      }}>
        <div class="mb-3">
          <label for="currentPassword" class="form-label fw-semibold">Aktuelles Passwort</label>
          <input id="currentPassword" type="password" name="currentPassword" placeholder="••••••••" class="form-control" />
        </div>

        <div class="mb-3">
          <label for="newPassword" class="form-label fw-semibold">Neues Passwort</label>
          <input id="newPassword" type="password" name="newPassword" placeholder="••••••••" class="form-control" />
        </div>

        <div class="mb-3">
          <label for="confirmPassword" class="form-label fw-semibold">Neues Passwort bestätigen</label>
          <input id="confirmPassword" type="password" name="confirmPassword" placeholder="••••••••" class="form-control" />
        </div>

        <button type="submit" class="btn btn-dark">Passwort ändern</button>

        {#if passwordSuccess}
          <div class="alert alert-success mt-3 mb-0 py-2">
            <i class="bi bi-check-circle me-2"></i>Passwort erfolgreich geändert!
          </div>
        {/if}
      </form>
    </div>
  </div>

  <!-- Danger Zone -->
  <div class="card border-danger">
    <div class="card-body">
      <h5 class="card-title text-danger mb-2">Gefahrenzone</h5>
      <p class="text-muted mb-3">Das Löschen Ihres Kontos ist permanent und kann nicht rückgängig gemacht werden.</p>

      <form method="POST" action="?/deleteAccount" on:submit={(e) => {
        if (!confirm('Sind Sie sicher, dass Sie Ihr Konto löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.')) {
          e.preventDefault();
        }
      }}>
        <button type="submit" class="btn btn-danger w-100">
          <i class="bi bi-trash me-2"></i>Konto löschen
        </button>
      </form>
    </div>
  </div>
</div>

<style>
  .container {
    max-width: 800px;
  }
</style>
