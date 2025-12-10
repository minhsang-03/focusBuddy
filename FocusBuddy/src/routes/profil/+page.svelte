<script>
  import { enhance } from '$app/forms';

  /** @type {{ user: { _id: string; name: string; email: string } }} */
  export let data;

  let user = data.user;
  let showPasswordSection = false;
  let passwordSuccess = false;
  let profileSuccess = false;

  /**
   * @param {string} email
   */
  function getInitial(email) {
    return email?.charAt(0).toUpperCase() || 'U';
  }

  /**
   * @param {Event} e
   */
  function handleProfileSubmit(e) {
    profileSuccess = false;
  }

  /**
   * @param {Event} e
   */
  function handlePasswordSubmit(e) {
    passwordSuccess = false;
  }
</script>

<!-- Profile Management Section -->
<div class="profile-container">
  <h1>Profil</h1>
  <p class="subtitle">Verwalten Sie Ihre Kontoeinstellungen</p>

  <!-- Profile Card -->
  <div class="profile-card">
    <div class="profile-header">
      <div class="avatar">{getInitial(user.email)}</div>
      <div class="profile-info">
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    </div>

    <form method="POST" action="?/updateProfile" use:enhance={() => {
      return async ({ result }) => {
        if (result.type === 'success') {
          profileSuccess = true;
          setTimeout(() => {
            profileSuccess = false;
          }, 3000);
        }
      };
    }}>
      <div class="form-group">
        <label for="name">Name</label>
        <div class="input-wrapper">
          <span class="icon">👤</span>
          <input
            id="name"
            type="text"
            name="name"
            value={user.name}
            placeholder="Ihr Name"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="email">E-Mail</label>
        <div class="input-wrapper">
          <span class="icon">✉️</span>
          <input
            id="email"
            type="email"
            name="email"
            value={user.email}
            placeholder="Ihre E-Mail"
          />
        </div>
      </div>

      <button type="submit" class="btn-save">💾 Profil speichern</button>

      {#if profileSuccess}
        <p class="success-message">Profil erfolgreich aktualisiert!</p>
      {/if}
    </form>
  </div>

  <!-- Password Change Section -->
  <div class="password-card">
    <h3>Passwort ändern</h3>

    <form method="POST" action="?/changePassword" use:enhance={() => {
      return async ({ result }) => {
        if (result.type === 'success') {
          passwordSuccess = true;
          setTimeout(() => {
            passwordSuccess = false;
          }, 3000);
          // Reset form
          const form = document.querySelector('form[action*="changePassword"]');
          if (form instanceof HTMLFormElement) form.reset();
        }
      };
    }}>
      <div class="form-group">
        <label for="currentPassword">Aktuelles Passwort</label>
        <input
          id="currentPassword"
          type="password"
          name="currentPassword"
          placeholder="••••••••"
        />
      </div>

      <div class="form-group">
        <label for="newPassword">Neues Passwort</label>
        <input
          id="newPassword"
          type="password"
          name="newPassword"
          placeholder="••••••••"
        />
      </div>

      <div class="form-group">
        <label for="confirmPassword">Neues Passwort bestätigen</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
        />
      </div>

      <button type="submit" class="btn-change">Passwort ändern</button>

      {#if passwordSuccess}
        <p class="success-message">Passwort erfolgreich geändert!</p>
      {/if}
    </form>
  </div>

  <!-- Danger Zone -->
  <div class="danger-card">
    <h3>Gefahrenzone</h3>
    <p>Das Löschen Ihres Kontos ist permanent und kann nicht rückgängig gemacht werden.</p>

    <form method="POST" action="?/deleteAccount" on:submit={(e) => {
      if (!confirm('Sind Sie sicher, dass Sie Ihr Konto löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.')) {
        e.preventDefault();
      }
    }}>
      <button type="submit" class="btn-delete">🗑️ Konto löschen</button>
    </form>
  </div>
  </div>

<style>
  /* Profile */
  .profile-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    font-size: 1.9rem;
    margin-bottom: 0.25rem;
  }

  .subtitle {
    color: #666;
    margin-bottom: 2rem;
  }

  /* Profile Card */
  .profile-card,
  .password-card,
  .danger-card {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 2rem;
  }

  .profile-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #e0e0e0;
  }

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #e8e8e8;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    color: #666;
  }

  .profile-info h2 {
    margin: 0 0 0.25rem 0;
    font-size: 1.3rem;
  }

  .profile-info p {
    margin: 0;
    color: #666;
  }

  /* Form */
  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    position: relative;
  }

  .input-wrapper .icon {
    position: absolute;
    left: 0.75rem;
    font-size: 1rem;
    pointer-events: none;
  }

  .form-group input {
    width: 100%;
    padding: 0.75rem 0.75rem 0.75rem 2.5rem;
    border: none;
    background: #f5f5f5;
    border-radius: 6px;
    font-family: inherit;
    font-size: 1rem;
    transition: background 0.2s;
  }

  .form-group input:focus {
    outline: none;
    background: #f0f0f0;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
  }

  .password-card .form-group input {
    padding: 0.75rem;
  }

  /* Buttons */
  .btn-save,
  .btn-change,
  .btn-delete {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 1rem;
  }

  .btn-save,
  .btn-change {
    background: #0b1220;
    color: white;
  }

  .btn-save:hover,
  .btn-change:hover {
    background: #1a1a1a;
  }

  .btn-delete {
    background: #d32f2f;
    color: white;
    width: 100%;
  }

  .btn-delete:hover {
    background: #b71c1c;
  }

  /* Messages */
  .success-message {
    color: #4caf50;
    font-size: 0.95rem;
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    background: #e8f5e9;
    border-radius: 6px;
  }

  /* Danger Zone */
  .danger-card {
    border: 1px solid #f5a5a5;
    background: #fafafa;
  }

  .danger-card h3 {
    color: #d32f2f;
    margin: 0 0 0.5rem 0;
  }

  .danger-card p {
    color: #1a7fa5;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }

  @media (max-width: 600px) {
    .profile-container {
      padding: 1rem;
    }

    h1 {
      font-size: 1.5rem;
    }

    .profile-header {
      flex-direction: column;
      text-align: center;
    }

    .profile-info h2 {
      font-size: 1.1rem;
    }

    .input-wrapper .icon {
      display: none;
    }

    .form-group input {
      padding: 0.75rem !important;
    }
  }
</style>
