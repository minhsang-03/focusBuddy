<script>
  import { enhance } from '$app/forms';

  /** @type {{ todos: Array<{_id:string, text:string, completed:boolean, priority?:string, dueDate?:Date}>, user?: {_id:string, name:string, email:string} }} */
  export let data;

  let showModal = false;
  let sortBy = 'dueDate';
  let todos = [];

  $: todos = data.todos || [];

  $: openTodos = todos.filter((t) => !t.completed);
  $: completedTodos = todos.filter((t) => t.completed);

  /**
   * @param {Date|string} dateString
   */
  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  /**
   * @param {string} priority
   */
  function getPriorityColor(priority) {
    switch (priority) {
      case 'high':
        return '#d32f2f';
      case 'medium':
        return '#f57c00';
      case 'low':
        return '#388e3c';
      default:
        return '#1976d2';
    }
  }

  /**
   * @param {string} priority
   */
  function getPriorityLabel(priority) {
    switch (priority) {
      case 'high':
        return 'Hoch';
      case 'medium':
        return 'Mittel';
      case 'low':
        return 'Niedrig';
      default:
        return 'Normal';
    }
  }
</script>

<div class="todo-container">
  <h1>To-Do Liste</h1>
  <p class="subtitle">Organisieren Sie Ihre Aufgaben</p>

  {#if !data.user}
    <div class="login-message">
      <p>Bitte melden Sie sich an, um Ihre To-Do-Liste zu nutzen.</p>
      <a href="/profil" class="btn-login-link">Zur Anmeldung</a>
    </div>
  {:else}
  <div class="todo-header">
    <button class="btn-add" on:click={() => (showModal = true)}>
      ➕ Neue Aufgabe
    </button>

    <select bind:value={sortBy} class="sort-select">
      <option value="dueDate">Sortieren: Fälligkeitsdatum</option>
      <option value="priority">Sortieren: Priorität</option>
    </select>
  </div>

  <!-- Modal for new todo -->
  {#if showModal}
    <div class="modal-overlay" role="presentation" on:click={() => (showModal = false)} on:keydown={(e) => e.key === 'Escape' && (showModal = false)}>
      <div class="modal" role="dialog" aria-modal="true" tabindex="-1" on:click|stopPropagation={() => {}} on:keydown={() => {}}>
        <button class="modal-close" on:click={() => (showModal = false)}>✕</button>
        <h2>Neue Aufgabe</h2>
        <p>Erstellen Sie eine neue To-Do-Aufgabe</p>

        <form method="POST" action="?/create" use:enhance={() => {
          return async ({ result }) => {
            if (result.type === 'success' && result.data?.success) {
              showModal = false;
              location.reload();
            }
          };
        }}>
          <div class="form-group">
            <label for="text">Titel *</label>
            <input id="text" type="text" name="text" required placeholder="das" />
          </div>

          <div class="form-group">
            <label for="desc">Beschreibung</label>
            <textarea id="desc" name="description" placeholder="asd"></textarea>
          </div>

          <div class="form-group">
            <label for="priority">Priorität</label>
            <select id="priority" name="priority">
              <option value="low">Niedrig</option>
              <option value="normal" selected>Normal</option>
              <option value="medium">Mittel</option>
              <option value="high">Hoch</option>
            </select>
          </div>

          <div class="form-group">
            <label for="dueDate">Fälligkeitsdatum</label>
            <input id="dueDate" type="date" name="dueDate" />
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" on:click={() => (showModal = false)}>
              Abbrechen
            </button>
            <button type="submit" class="btn-submit">Hinzufügen</button>
          </div>
        </form>
      </div>
    </div>
  {/if}

  <!-- Open todos -->
  <div class="todos-section">
    <h2>Offen ({openTodos.length})</h2>

    {#if openTodos.length === 0}
      <p class="empty-state">Keine offenen Aufgaben</p>
    {:else}
      <div class="todos-list">
        {#each openTodos as todo (todo._id)}
          <div class="todo-item">
            <div class="todo-checkbox">
              <form method="POST" action="?/toggle" use:enhance>
                <input type="hidden" name="id" value={todo._id} />
                <input type="hidden" name="completed" value={todo.completed} />
                <input
                  type="checkbox"
                  checked={todo.completed}
                  on:change={(e) => e.currentTarget.form?.submit()}
                />
              </form>
            </div>

            <div class="todo-content">
              <h3>{todo.text}</h3>
              <div class="todo-meta">
                {#if todo.priority}
                  <span class="priority-badge" style="background-color: {getPriorityColor(todo.priority)}">
                    {getPriorityLabel(todo.priority)}
                  </span>
                {/if}
                {#if todo.dueDate}
                  <span class="date-badge">📅 {formatDate(todo.dueDate)}</span>
                {/if}
              </div>
            </div>

            <div class="todo-actions">
              <button class="action-btn edit-btn">✏️</button>
              <form method="POST" action="?/delete" use:enhance class="inline-form">
                <input type="hidden" name="id" value={todo._id} />
                <button type="submit" class="action-btn delete-btn">🗑️</button>
              </form>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Completed todos (collapsed) -->
  {#if completedTodos.length > 0}
    <div class="todos-section completed-section">
      <h2>Abgeschlossen ({completedTodos.length})</h2>
    </div>
  {/if}
  {/if}
</div>

<style>
  .todo-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    font-size: 1.9rem;
    margin-bottom: 0.25rem;
  }

  .subtitle {
    color: #666;
    margin-bottom: 1.5rem;
  }

  .todo-header {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    align-items: center;
  }

  .btn-add {
    background: #0b1220;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.3s;
  }

  .btn-add:hover {
    background: #1a1a1a;
  }

  .sort-select {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: white;
    cursor: pointer;
  }

  /* Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    position: relative;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  }

  .modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #999;
  }

  .modal h2 {
    margin: 0 0 0.5rem 0;
  }

  .modal > p {
    color: #666;
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .form-group input,
  .form-group textarea,
  .form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    font-family: inherit;
    font-size: 1rem;
  }

  .form-group textarea {
    resize: vertical;
    min-height: 80px;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
  }

  .btn-cancel,
  .btn-submit {
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 600;
  }

  .btn-cancel {
    background: #f0f0f0;
    color: #1a1a1a;
  }

  .btn-submit {
    background: #0b1220;
    color: white;
  }

  .btn-submit:hover {
    background: #1a1a1a;
  }

  /* Todos section */
  .todos-section {
    margin-bottom: 2rem;
  }

  .todos-section h2 {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    color: #1a1a1a;
  }

  .empty-state {
    color: #999;
    text-align: center;
    padding: 2rem;
    background: #f9f9f9;
    border-radius: 8px;
  }

  .todos-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .todo-item {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1rem;
    transition: box-shadow 0.2s;
  }

  .todo-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .todo-checkbox {
    padding-top: 0.25rem;
  }

  .todo-checkbox input[type='checkbox'] {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .todo-content {
    flex: 1;
  }

  .todo-content h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
  }

  .todo-meta {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .priority-badge,
  .date-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.8rem;
    color: white;
  }

  .date-badge {
    background: #1976d2;
  }

  .todo-actions {
    display: flex;
    gap: 0.5rem;
  }

  .action-btn {
    background: none;
    border: none;
    font-size: 1.1rem;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
  }

  .action-btn:hover {
    opacity: 1;
  }

  .inline-form {
    margin: 0;
  }

  .completed-section {
    opacity: 0.6;
    padding: 1rem;
    background: #f9f9f9;
    border-radius: 8px;
  }

  /* Login message */
  .login-message {
    background: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    margin-bottom: 2rem;
  }

  .login-message p {
    margin: 0 0 1rem 0;
    color: #333;
    font-size: 1rem;
  }

  .btn-login-link {
    display: inline-block;
    background: #0b1220;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    text-decoration: none;
    transition: background 0.3s;
  }

  .btn-login-link:hover {
    background: #1a1a1a;
  }

  @media (max-width: 600px) {
    .todo-container {
      padding: 1rem;
    }

    h1 {
      font-size: 1.5rem;
    }

    .todo-header {
      flex-direction: column;
      align-items: stretch;
    }

    .btn-add,
    .sort-select {
      width: 100%;
    }

    .modal {
      width: 100%;
      max-width: none;
    }

    .todo-item {
      flex-wrap: wrap;
    }
  }
</style>
