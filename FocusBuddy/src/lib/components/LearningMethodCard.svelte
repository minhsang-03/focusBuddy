<script>
  /** @type {{ _id: string, name: string, description?: string, defaultWorkMinutes?: number, defaultBreakMinutes?: number, icon?: string, iconColor?: string, steps?: string[], notificationText?: string }} */
  export let method;
</script>

<div class="lm-card">
  <div class="lm-icon">
    {#if method.icon}
      <i class="bi {method.icon}" style="color: {method.iconColor || '#6b7280'}; font-size: 2rem;"></i>
    {:else}
      📘
    {/if}
  </div>
  <div class="lm-content">
    <h3>{method.name}</h3>
    <p class="lm-desc">{method.description}</p>

    {#if method.steps && method.steps.length > 0}
      <div class="lm-steps">
        <strong>So funktioniert's:</strong>
        <ol>
          {#each method.steps as step}
            <li>{step}</li>
          {/each}
        </ol>
      </div>
    {/if}

    {#if method.notificationText}
      <div class="lm-notification">
        <strong>Erinnerung:</strong> {method.notificationText}
      </div>
    {/if}

    <div class="lm-actions">
      <a class="btn-apply" href={`/timer?method=${method._id}`}>Im Timer anwenden</a>
    </div>
  </div>
</div>

<style>
  .lm-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
    border: 1px solid #e5e7eb;
  }

  .lm-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .lm-icon {
    text-align: center;
    margin-bottom: 1rem;
    font-size: 2rem;
  }

  .lm-content h3 {
    color: #1f2937;
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .lm-desc {
    color: #6b7280;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .lm-steps {
    margin-bottom: 1rem;
  }

  .lm-steps strong {
    color: #374151;
    display: block;
    margin-bottom: 0.5rem;
  }

  .lm-steps ol {
    padding-left: 1.5rem;
    margin: 0;
  }

  .lm-steps li {
    color: #4b5563;
    margin-bottom: 0.25rem;
    line-height: 1.4;
  }

  .lm-notification {
    background: #fef3c7;
    border: 1px solid #f59e0b;
    border-radius: 6px;
    padding: 0.75rem;
    margin-bottom: 1rem;
  }

  .lm-notification strong {
    color: #92400e;
  }

  .lm-actions {
    text-align: center;
  }

  .btn-apply {
    display: inline-block;
    background: #3b82f6;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
    transition: background 0.2s;
  }

  .btn-apply:hover {
    background: #2563eb;
  }
</style>