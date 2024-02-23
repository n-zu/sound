const ROUTES = {
  Home: "/pages/",
  SoundBox: "/pages/soundbox/",
  SoundBoard: "/pages/soundboard/",
};

function addNav() {
  const nav = document.querySelector("nav");

  const currentRoute = window.location.pathname;
  const domain = window.location.origin;

  for (const [key, route] of Object.entries(ROUTES)) {
    var a = document.createElement("a");
    a.textContent = key;

    if (route === currentRoute) {
      a.className = "active";
    } else {
      a.href = domain + route;
    }
    nav.appendChild(a);
  }
}

addNav();

/*

nav in pages/index.html:

<nav>
    <a class="active">Home</a>
    <a href="soundbox/">SoundBox</a>
    <a href="soundboard/">SoundBoard</a>
  </nav>

  */
