<script>
  import { page } from '$app/stores';
  import favicon from "$lib/assets/favicon.svg";
  import "./style.css";

  const props = $props();
  let { children } = props;
  /** @type {any} */
  const data = props.data || {};
  
  // Check if current path matches
  /** @param {string} href */
  function isActive(href) {
    // @ts-ignore
    const currentPath = $page.url.pathname;
    if (href === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(href);
  }
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>
<nav class="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
  <div class="container-fluid">
    <a class="navbar-brand d-flex align-items-center" href="/timer">
      <span class="brand-text">FocusBuddy</span>
    </a>
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
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link {isActive('/timer') ? 'active' : ''}" href="/timer">
            <i class="bi bi-stopwatch me-1"></i>Timer
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link {isActive('/activities') ? 'active' : ''}" href="/activities">
            <i class="bi bi-activity me-1"></i>Aktivitäten
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link {isActive('/lernmethoden') ? 'active' : ''}" href="/lernmethoden">
            <i class="bi bi-book me-1"></i>Lernmethoden
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link {isActive('/tagebuch') ? 'active' : ''}" href="/tagebuch">
            <i class="bi bi-journal-text me-1"></i>Tagebuch
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link {isActive('/to-do') ? 'active' : ''}" href="/to-do">
            <i class="bi bi-check2-square me-1"></i>To-Do
          </a>
        </li>
      </ul>
      <!-- auth area on the right -->
      <div class="d-flex align-items-center">
        {#if data?.user}
          <div class="nav-user dropdown">
            <button
              class="nav-link dropdown-toggle btn btn-link text-light p-0 d-flex align-items-center"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span class="avatar-sm">{data.user.email ? data.user.email.charAt(0).toUpperCase() : 'U'}</span>
              <span class="ms-2 d-none d-md-inline">{data.user.name}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="/profil"><i class="bi bi-person me-2"></i>Profil</a></li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item text-danger" href="/logout"><i class="bi bi-box-arrow-right me-2"></i>Ausloggen</a></li>
            </ul>
          </div>
        {:else}
          <a class="btn btn-outline-light btn-sm" href="/login">
            <i class="bi bi-box-arrow-in-right me-1"></i>Anmelden
          </a>
        {/if}
      </div>
    </div>
  </div>
</nav>

{@render children()}

<style>
  .navbar {
    padding: 0.5rem 1rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
  
  .brand-text {
    font-weight: 600;
    font-size: 1.25rem;
    background: linear-gradient(135deg, #fff 0%, #a0c4ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .nav-link {
    padding: 0.5rem 1rem !important;
    border-radius: 6px;
    margin: 0 0.15rem;
    transition: all 0.2s ease;
    color: rgba(255, 255, 255, 0.75) !important;
  }
  
  .nav-link:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff !important;
  }
  
  .nav-link.active {
    background: rgba(33, 150, 243, 0.25);
    color: #fff !important;
    font-weight: 500;
    border-bottom: 2px solid #2196f3;
  }
  
  .avatar-sm {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2196f3 0%, #1565c0 100%);
    color: #fff;
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  .dropdown-menu {
    border: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .dropdown-item {
    padding: 0.5rem 1rem;
  }
  
  .dropdown-item:hover {
    background: #f5f5f5;
  }
  
  @media (max-width: 991px) {
    .navbar-nav {
      padding-top: 1rem;
    }
    
    .nav-link {
      margin: 0.25rem 0;
    }
    
    .nav-link.active {
      border-bottom: none;
      border-left: 3px solid #2196f3;
    }
  }
</style>
