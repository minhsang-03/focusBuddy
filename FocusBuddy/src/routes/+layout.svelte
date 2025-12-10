<script>
  import favicon from "$lib/assets/favicon.svg";
  import "./style.css";

  const props = $props();
  let { children } = props;
  /** @type {any} */
  const data = props.data || {};
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>
<nav
  class="navbar navbar-expand-sm bg-dark border-bottom border-body"
  data-bs-theme="dark"
>
  <div class="me-2">
    <img
      src="/img/focusbuddy-no-bg.svg"
      alt="FocusBuddy Logo"
      class="d-inline-block align-text-top logo"
    />
  </div>
  <div class="container-fluid">
    <i class="bi bi-stopwatch"></i>
    <a class="navbar-brand" href="/timer">Timer</a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNavDropdown"
      aria-controls="navbarNavDropdown"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="/activities"
            >Aktivität</a
          >
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/lernmethoden">Lernmethoden</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/tagebuch">Tagebuch</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/to-do">To-Do</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/profil">Profil</a>
        </li>
      </ul>
    </div>
    <!-- auth area on the right -->
    <div class="d-flex align-items-center ms-auto">
      {#if data?.user}
        <div class="nav-user dropdown">
          <button
            class="nav-link dropdown-toggle btn btn-link text-light p-0"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span class="avatar-sm">{data.user.email ? data.user.email.charAt(0).toUpperCase() : 'U'}</span>
            <span class="ms-2">{data.user.name}</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="/profil">Profil</a></li>
            <li><hr class="dropdown-divider" /></li>
            <li><a class="dropdown-item" href="/logout">Ausloggen</a></li>
          </ul>
        </div>
      {:else}
        <a class="btn btn-outline-light" href="/login">Anmelden</a>
      {/if}
    </div>
  </div>
</nav>

{@render children()}
