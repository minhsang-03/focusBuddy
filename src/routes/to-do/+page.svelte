<script>
  import { enhance } from '$app/forms';

  /** @type {{ todos: Array<{_id:string, title?:string, text?:string, description?:string, completed:boolean, priority?:string, dueDate?:Date}>, user?: {_id:string, name:string, email:string} }} */
  export let data;

  // Modal state
  let showModal = false;
  let showEditModal = false;
  /** @type {any} */
  let editingTodo = null;
  let sortBy = 'dueDate';

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
   * @param {Date|string} dateString
   */
  function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  /**
   * @param {string} priority
   */
  function getPriorityClass(priority) {
    switch (priority) {
      case 'high': return 'bg-danger';
      case 'medium': return 'bg-warning text-dark';
      case 'low': return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  /**
   * @param {string} priority
   */
  function getPriorityLabel(priority) {
    switch (priority) {
      case 'high': return 'Hoch';
      case 'medium': return 'Mittel';
      case 'low': return 'Niedrig';
      default: return 'Mittel';
    }
  }

  function openNewModal() {
    showModal = true;
  }

  function closeNewModal() {
    showModal = false;
  }

  /**
   * @param {any} todo
   */
  function openEdit(todo) {
    editingTodo = { ...todo, title: todo.title || todo.text || '' };
    showEditModal = true;
  }

  function closeEdit() {
    showEditModal = false;
    editingTodo = null;
  }
</script>

<div class="container py-4">
  <h1 class="mb-1">To-Do Liste</h1>
  <p class="text-muted mb-4">Organisieren Sie Ihre Aufgaben</p>

  {#if !data.user}
    <div class="card">
      <div class="card-body text-center py-5">
        <p class="text-muted mb-3">Bitte melden Sie sich an, um Ihre To-Do-Liste zu nutzen.</p>
        <a href="/profil" class="btn btn-dark">
          <i class="bi bi-person me-2"></i>Zur Anmeldung
        </a>
      </div>
    </div>
  {:else}
    <!-- Header mit Button und Sortierung -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <button class="btn btn-dark" type="button" on:click={openNewModal}>
        <i class="bi bi-plus-lg me-1"></i> Neue Aufgabe
      </button>

      <div class="d-flex align-items-center gap-2">
        <label for="sortBy" class="text-muted mb-0">Sortieren:</label>
        <select id="sortBy" bind:value={sortBy} class="form-select form-select-sm" style="width: auto;">
          <option value="dueDate">Fälligkeitsdatum</option>
          <option value="priority">Priorität</option>
        </select>
      </div>
    </div>

    <!-- Offene Todos -->
    <div class="mb-4">
      <h5 class="mb-3">Offen ({openTodos.length})</h5>

      {#if openTodos.length === 0}
        <div class="card">
          <div class="card-body text-center text-muted py-4">
            Keine offenen Aufgaben
          </div>
        </div>
      {:else}
        <div class="d-flex flex-column gap-2">
          {#each openTodos as todo (todo._id)}
            <div class="card">
              <div class="card-body d-flex align-items-start gap-3">
                <!-- Checkbox -->
                <form method="POST" action="?/toggle" use:enhance class="pt-1">
                  <input type="hidden" name="id" value={todo._id} />
                  <input type="hidden" name="completed" value={todo.completed} />
                  <input
                    type="checkbox"
                    class="form-check-input"
                    style="width: 1.25rem; height: 1.25rem;"
                    checked={todo.completed}
                    on:change={(e) => e.currentTarget.form?.submit()}
                  />
                </form>

                <!-- Content -->
                <div class="flex-grow-1">
                  <div class="d-flex align-items-center gap-2 mb-1">
                    <h6 class="mb-0">{todo.title || todo.text || 'Ohne Titel'}</h6>
                    {#if todo.priority}
                      <span class="badge {getPriorityClass(todo.priority)}">
                        {getPriorityLabel(todo.priority)}
                      </span>
                    {/if}
                  </div>
                  {#if todo.description}
                    <p class="text-muted small mb-1">{todo.description}</p>
                  {/if}
                  {#if todo.dueDate}
                    <small class="text-muted">
                      <i class="bi bi-calendar me-1"></i>{formatDate(todo.dueDate)}
                    </small>
                  {/if}
                </div>

                <!-- Actions -->
                <div class="d-flex gap-1">
                  <button class="btn btn-sm btn-outline-secondary" on:click={() => openEdit(todo)} title="Bearbeiten">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <form method="POST" action="?/delete" use:enhance class="d-inline">
                    <input type="hidden" name="id" value={todo._id} />
                    <button type="submit" class="btn btn-sm btn-outline-danger" title="Löschen">
                      <i class="bi bi-trash"></i>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Erledigte Todos -->
    {#if completedTodos.length > 0}
      <div class="mb-4">
        <h5 class="mb-3 text-muted">Erledigt ({completedTodos.length})</h5>
        <div class="d-flex flex-column gap-2">
          {#each completedTodos as todo (todo._id)}
            <div class="card bg-light">
              <div class="card-body d-flex align-items-center gap-3 py-2">
                <!-- Checkbox -->
                <form method="POST" action="?/toggle" use:enhance>
                  <input type="hidden" name="id" value={todo._id} />
                  <input type="hidden" name="completed" value={todo.completed} />
                  <input
                    type="checkbox"
                    class="form-check-input"
                    style="width: 1.25rem; height: 1.25rem;"
                    checked={todo.completed}
                    on:change={(e) => e.currentTarget.form?.submit()}
                  />
                </form>

                <!-- Content -->
                <div class="flex-grow-1">
                  <span class="text-decoration-line-through text-muted">
                    {todo.title || todo.text || 'Ohne Titel'}
                  </span>
                </div>

                <!-- Delete -->
                <form method="POST" action="?/delete" use:enhance class="d-inline">
                  <input type="hidden" name="id" value={todo._id} />
                  <button type="submit" class="btn btn-sm btn-outline-danger" title="Löschen">
                    <i class="bi bi-trash"></i>
                  </button>
                </form>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</div>

<!-- NEW TODO MODAL -->
{#if showModal}
  <div class="modal-backdrop-custom"></div>
  <div class="modal-custom" tabindex="-1" role="dialog" aria-modal="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <div>
            <h5 class="modal-title">Neue Aufgabe</h5>
            <p class="text-muted small mb-0">Erstellen Sie eine neue To-Do-Aufgabe</p>
          </div>
          <button type="button" class="btn-close" on:click={closeNewModal} aria-label="Close"></button>
        </div>
        <form method="POST" action="?/create" use:enhance={() => {
          return async ({ result }) => {
            if (result.type === 'success') {
              closeNewModal();
              location.reload();
            }
          };
        }}>
          <div class="modal-body">
            <div class="mb-3">
              <label for="title" class="form-label">Titel *</label>
              <input id="title" type="text" class="form-control" name="title" required placeholder="z.B. Kapitel 5 lesen" />
            </div>
            <div class="mb-3">
              <label for="description" class="form-label">Beschreibung</label>
              <textarea id="description" class="form-control" name="description" placeholder="Zusätzliche Details..." rows="3"></textarea>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="priority" class="form-label">Priorität</label>
                <select id="priority" class="form-select" name="priority">
                  <option value="low">Niedrig</option>
                  <option value="medium" selected>Mittel</option>
                  <option value="high">Hoch</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label for="dueDate" class="form-label">Fälligkeitsdatum</label>
                <input id="dueDate" type="date" class="form-control" name="dueDate" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" on:click={closeNewModal}>Abbrechen</button>
            <button type="submit" class="btn btn-primary">Hinzufügen</button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}

<!-- EDIT TODO MODAL -->
{#if showEditModal && editingTodo}
  <div class="modal-backdrop-custom"></div>
  <div class="modal-custom" tabindex="-1" role="dialog" aria-modal="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <div>
            <h5 class="modal-title">Aufgabe bearbeiten</h5>
            <p class="text-muted small mb-0">Ändern Sie die Details Ihrer Aufgabe</p>
          </div>
          <button type="button" class="btn-close" on:click={closeEdit} aria-label="Close"></button>
        </div>
        <form method="POST" action="?/update" use:enhance={() => {
          return async ({ result }) => {
            if (result.type === 'success') {
              closeEdit();
              location.reload();
            }
          };
        }}>
          <input type="hidden" name="id" value={editingTodo._id} />
          <div class="modal-body">
            <div class="mb-3">
              <label for="edit-title" class="form-label">Titel *</label>
              <input id="edit-title" type="text" class="form-control" name="title" required bind:value={editingTodo.title} />
            </div>
            <div class="mb-3">
              <label for="edit-description" class="form-label">Beschreibung</label>
              <textarea id="edit-description" class="form-control" name="description" rows="3" bind:value={editingTodo.description}></textarea>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="edit-priority" class="form-label">Priorität</label>
                <select id="edit-priority" class="form-select" name="priority" bind:value={editingTodo.priority}>
                  <option value="low">Niedrig</option>
                  <option value="medium">Mittel</option>
                  <option value="high">Hoch</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label for="edit-dueDate" class="form-label">Fälligkeitsdatum</label>
                <input id="edit-dueDate" type="date" class="form-control" name="dueDate" value={formatDateForInput(editingTodo.dueDate)} />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" on:click={closeEdit}>Abbrechen</button>
            <button type="submit" class="btn btn-primary">Speichern</button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Card hover effect */
  .card {
    transition: box-shadow 0.2s;
  }

  .card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
</style>
