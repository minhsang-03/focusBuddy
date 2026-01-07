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
        // Erfolgreich registriert - Weiterleitung wird durchgeführt
        window.location.href = result.location;
      } else if (result.type === 'failure' || result.data?.error) {
        // Fehler bei der Registrierung
        errorMessage = result.data?.error || 'Ein Fehler ist aufgetreten';
      } else {
        // Fallback für andere Fälle
        await update();
      }
    };
  }
</script>

<div class="register-wrapper">
  <div class="register-container">
    <h1>Registrieren</h1>
    <p class="subtitle">Erstellen Sie ein neues Konto</p>

    <form method="POST" use:enhance={handleSubmit} class="register-form">
      <div class="form-group">
        <label for="name">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Ihr Name"
          required
          disabled={isSubmitting}
        />
      </div>

      <div class="form-group">
        <label for="email">E-Mail</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="ihre@email.de"
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
          required
          disabled={isSubmitting}
        />
      </div>

      <div class="form-group">
        <label for="confirm">Passwort bestätigen</label>
        <input
          id="confirm"
          type="password"
          name="confirmPassword"
          placeholder=""
          required
          disabled={isSubmitting}
        />
      </div>

      {#if errorMessage}
        <div class="error-message">{errorMessage}</div>
      {/if}

      <button type="submit" class="btn-register" disabled={isSubmitting}>
        {isSubmitting ? 'Wird registriert...' : 'Registrieren'}
      </button>
    </form>

    <p class="login-link">
      Haben Sie bereits ein Konto? <a href="/login">Anmelden</a>
    </p>
  </div>
</div>

<style>
  .register-wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    padding: 1rem;
  }

  .register-container {
    background: white;
    border-radius: 16px;
    padding: 3rem 2rem;
    width: 100%;
    max-width: 480px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    text-align: center;
  }

  .logo-circle {
    width: 80px;
    height: 80px;
    margin: 0 auto 2rem;
    background: #e3f2fd;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #5c7cfa;

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

  .register-form {
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
    box-sizing: border-box;
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

  .btn-register {
    background: #0b1220;
    color: white;
    border: none;
    padding: 0.875rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s;
    width: 100%;
  }

  .btn-register:hover:not(:disabled) {
    background: #1a1a1a;
  }

  .btn-register:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .login-link {
    margin: 0;
    color: #666;
    font-size: 0.95rem;
  }

  .login-link a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s;
  }

  .login-link a:hover {
    color: #764ba2;
  }

  @media (max-width: 600px) {
    .register-wrapper {
      padding: 1rem;
    }

    .register-container {
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