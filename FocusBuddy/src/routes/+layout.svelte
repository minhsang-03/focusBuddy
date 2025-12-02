<script>
	import favicon from '$lib/assets/favicon.svg';
  import "./style.css";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<nav class="navbar navbar-expand-sm bg-dark border-bottom border-body" data-bs-theme="dark">
  <div class="me-2">
    <img src="/img/focusbuddy-no-bg.svg" alt="FocusBuddy Logo" class="d-inline-block align-text-top logo"/>
  </div>
  <div class="container-fluid">
  <i class="bi bi-stopwatch"></i>
    <a class="navbar-brand" href="/.">Startseite</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="/activities">Aktivität</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/lernmethoden">Lernmethoden</a>
		 <li class="nav-item">
          <a class="nav-link" href="/to-do">To-Do</a>
        </li>
		
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="/profil" role="button" data-bs-toggle="dropdown" aria-expanded="false">
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


{@render children()}
