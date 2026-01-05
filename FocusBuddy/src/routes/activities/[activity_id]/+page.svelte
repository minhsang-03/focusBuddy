<script>
  export let data;
  /** @type {import('./$types').ActionData | null} */
  export let form = null;
  let activity = data.activity;
  let title = activity.title || '';
  let description = activity.description || '';
  let method = activity.method || '';
  let durationSeconds = activity.durationSeconds || 0;
  let startTime = activity.startTime ? new Date(activity.startTime).toISOString().slice(0,16) : '';
  let endTime = activity.endTime ? new Date(activity.endTime).toISOString().slice(0,16) : '';
</script>



<div class="activity-edit-card">
  <h1>Aktivität bearbeiten</h1>
  <form method="POST">
    <label class="activity-label">Titel:
      <input class="activity-input" name="title" bind:value={title} required />
    </label>
    <label class="activity-label">Beschreibung:
      <textarea class="activity-input" name="description" bind:value={description} rows="3"></textarea>
    </label>
    <label class="activity-label">Methode:
      <input class="activity-input" name="method" bind:value={method} />
    </label>
    <label class="activity-label">Dauer (Sekunden):
      <input class="activity-input" name="durationSeconds" type="number" bind:value={durationSeconds} min="0" />
    </label>
    <label class="activity-label">Startzeit:
      <input class="activity-input" name="startTime" type="datetime-local" bind:value={startTime} />
    </label>
    <label class="activity-label">Endzeit:
      <input class="activity-input" name="endTime" type="datetime-local" bind:value={endTime} />
    </label>
    <!-- Tags-Auswahl kann hier ergänzt werden -->
    <button class="activity-btn" type="submit">Speichern</button>
    {#if form && form.error}
      <div class="activity-error">{form.error}</div>
    {/if}
  </form>
</div>

<style>
.activity-edit-card {
  max-width: 600px;
  margin: 2rem auto;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 2rem 2rem 1.5rem 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}
.activity-edit-card h1 {
  color: #1a1a1a;
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  text-align: left;
}
.activity-label {
  display: block;
  color: #666;
  font-size: 1rem;
  margin-bottom: 1rem;
}
.activity-input {
  display: block;
  width: 100%;
  margin-top: 0.3rem;
  padding: 0.6rem 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  background: #f9f9f9;
  color: #222;
  transition: border 0.2s;
}
.activity-input:focus {
  outline: none;
  border-color: #2196f3;
}
.activity-btn {
  background: #1a1a1a;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.8rem 1.2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.2s;
}
.activity-btn:hover {
  background: #2196f3;
}
.activity-error {
  color: #d32f2f;
  background: #ffebee;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  text-align: center;
}
@media (max-width: 600px) {
  .activity-edit-card {
    padding: 1rem;
  }
}
</style>
