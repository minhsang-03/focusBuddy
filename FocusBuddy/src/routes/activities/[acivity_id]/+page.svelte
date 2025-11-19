<script>
  // use the normalized movie shape returned by db.getMovie
  export let data = {};
  const movie = data.movie ?? {};
  // confirm before submitting the delete form (runs only in the browser)
  function confirmDelete(e) {
    if (!confirm(`Delete "${movie.title}"?`)) {
      e.preventDefault();
    }
  }
</script>

<a href="/movies">Back</a>

<h1>{movie.title}</h1>

<div class="movie-layout">
  <img
    src={movie.image}
    class="card-img-top"
    alt={movie.title}
    style="height:400px; object-fit:cover; width:300px;"
  />

  <div class="movie-info">
    <p>Year: {movie.year}</p>
    <p>Duration: {movie.duration}</p>

    <div>
      <h3>Cast</h3>
      {#if movie.actors && movie.actors.length}
        <ul>
          {#each movie.actors as actor}
            <li>{actor}</li>
          {/each}
        </ul>
      {:else}
        <p>No cast info</p>
      {/if}
    </div>

    <form method="POST" action="?/delete" on:submit={confirmDelete}>
      <button type="submit" class="btn btn-danger">Delete movie</button>
    </form>
  </div>
</div>

<style>
  .movie-layout { display:flex; gap:1.5rem; align-items:flex-start; }
  .movie-info { max-width:40rem; }
  .card-img-top { border-radius:6px; }
</style>