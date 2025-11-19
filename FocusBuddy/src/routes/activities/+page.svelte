<script>
   // import Moviecard from "$lib/components/Moviecard.svelte";
    // export let data = {};
    // defensive defaults if server returned nothing
    let movies = data.movies ?? [];
</script>
<div class="container text-center">
<div class="controls">
  <a class="add-button" href="/movies/create">Add movie</a>
</div>
  <div class="row">
            {#each movies as movie}
                <a class="card-link" href={"/movies/" + movie._id}>
                    <!-- <Moviecard
                        movieId={movie._id}
                        image={movie.image}
                        title={movie.title}
                        year={movie.year}
                        duration={movie.duration}
                        actors={movie.actors}
                    /> -->
                </a>
            {/each}
    </div>
</div>
   
<style>
    /* layout: make row a responsive flex container so cards sit side-by-side */
    .row {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center; /* center the grid */
        align-items: flex-start;
        margin: 0 auto;
    }

    .card-link {
        text-decoration: none;
        color: inherit;
        display: block; /* make anchor behave like a block so width applies */
        width: 18rem; /* match Moviecard width */
    }

    /* lift the whole link/card on hover (scoped to this component) */
    .card-link {
        transition: transform 150ms ease;
    }

    .card-link:hover {
        transform: translateY(-4px);
    }

    /* small screens: allow cards to take almost full width */
    @media (max-width: 480px) {
        .card-link {
            width: calc(100% - 2rem);
        }
    }

     .controls { display:flex; justify-content:flex-start; }
  .add-button {
    display:inline-block;
    background:#0d6efd;
    color:white;
    padding:.5rem 1rem;
    border-radius:4px;
    text-decoration:none;
  }
</style>

