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
        // Erfolgreich eingeloggt - Weiterleitung wird automatisch durchgeführt
        window.location.href = result.location;
      } else if (result.type === 'failure' || result.data?.error) {
        // Fehler bei der Anmeldung
        errorMessage = result.data?.error || 'Ein Fehler ist aufgetreten';
      } else {
        // Fallback für andere Fälle
        await update();
      }
    };
  }
</script>

<div class="login-wrapper">
  <div class="login-container">
    <h1>Willkommen bei FocusBuddy</h1>
    <p class="subtitle">Melden Sie sich an, um fortzufahren</p>

    <form method="POST" use:enhance={handleSubmit} class="login-form">
      <div class="form-group">
        <label for="email">E-Mail</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="ihre@email.de"
          bind:value={email}
          required
          disabled={isSubmitting}
        />
      </div>

      <div class="form-group">
        <label for="password">Passwort</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder=""
          bind:value={password}
          required
          disabled={isSubmitting}
        />
      </div>

      {#if errorMessage}
        <div class="error-message">{errorMessage}</div>
      {/if}

      <button type="submit" class="btn-login" disabled={isSubmitting}>
        {isSubmitting ? 'Wird angemeldet...' : 'Anmelden'}
      </button>
    </form>

    <p class="register-link">
      Noch kein Konto? <a href="/register">Registrieren</a>
    </p>
  </div>
</div>

<style>
  .login-wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    padding: 1rem;
  }

  .login-container {
    background: white;
    border-radius: 16px;
    padding: 3rem 2rem;
    width: 100%;
    max-width: 480px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    text-align: center;
  }

  h1 {
    font-size: 2rem;
    margin: 0 0 0.5rem 0;
    color: #1a1a1a;
    font-weight: 700;
  }

  .subtitle {
    color: #666;
    margin: 0 0 2rem 0;
    font-size: 1rem;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .form-group {
    text-align: left;
  }

  .form-group label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #1a1a1a;
    font-size: 0.9rem;
  }

  .form-group input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    transition: all 0.3s;
    background: #f8f8f8;
  }

  .form-group input:focus {
    outline: none;
    background: white;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .form-group input::placeholder {
    color: #999;
  }

  .error-message {
    background: #ffebee;
    border: 1px solid #ef5350;
    color: #c62828;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
  }

  .btn-login {
    background: #0b1220;
    color: white;
    border: none;
    padding: 0.875rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s;
  }

  .btn-login:hover:not(:disabled) {
    background: #1a1a1a;
  }

  .btn-login:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .register-link {
    margin: 0;
    color: #666;
    font-size: 0.95rem;
  }

  .register-link a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s;
  }

  .register-link a:hover {
    color: #764ba2;
  }

  @media (max-width: 600px) {
    .login-wrapper {
      padding: 1rem;
    }

    .login-container {
      padding: 2rem 1.5rem;
    }

    h1 {
      font-size: 1.5rem;
    }

    .logo-circle {
      width: 70px;
      height: 70px;
      margin-bottom: 1.5rem;
    }

    .logo-circle svg {
      width: 35px;
      height: 35px;
    }
  }
</style>
