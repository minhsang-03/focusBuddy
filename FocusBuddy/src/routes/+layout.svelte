<script>
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<nav class="navbar navbar-expand-sm bg-dark border-bottom border-body" data-bs-theme="dark">
  <div class="me-2">
    <img src="/img/focusbuddy-logo.svg" alt="FocusBuddy Logo" class="d-inline-block align-text-top logo"/>
  </div>
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Startseite</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Aktivität</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Lernmethoden</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Tagebuch</a>
        </li>
		 <li class="nav-item">
          <a class="nav-link" href="#">To-Do</a>
        </li>
		
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Profil
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Einstellungen</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>
<style>
  /* Responsive logo sizing: SVG keeps sharpness, height adjusts per breakpoint */
  .logo {
    height: 2.25rem; /* default (mobile) */
    width: auto;
    display: block;
  }

  @media (min-width: 576px) {
    .logo { height: 2.5rem; }
  }

  @media (min-width: 992px) {
    .logo { height: 3rem; }
  }
</style>

{@render children()}
