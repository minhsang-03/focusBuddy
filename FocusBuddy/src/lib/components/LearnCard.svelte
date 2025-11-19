<script>
  // use Svelte props and handle missing/invalid actors safely
  export let image = "";
  export let title = "";
  export let year = "";
  export let duration = "";
  export let actors = [];

  // ensure actorList is always an array
  const actorList = Array.isArray(actors) ? actors : (actors ? [actors] : []);
</script>


<div class="card" style="width: 18rem;">
  <div class="card-body">
    <img src={image} class="card-img-top" alt={title} style="height:250px; object-fit:cover; width:100%;" />
    <h5 class="card-title">{title} ({year})</h5>
    <p class="card-text">Duration: {duration} minutes</p>
    <p class="card-text">Actors: {actorList.join(", ")}</p>
  </div>
</div>
