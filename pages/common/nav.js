const HOME = "pages";

const ROUTES = {
  SoundBox: "soundbox",
  SoundBoard: "soundboard",
};

function addNav() {
  const nav = document.querySelector("nav");

  const path = window.location.pathname.split("/");
  const currentRoute = path[path.length - 2];
  const isHome = currentRoute === HOME;

  // Add Home
  var a = document.createElement("a");
  a.textContent = "Home";
  if (isHome) a.className = "active";
  else a.href = "..";
  nav.appendChild(a);

  for (const [key, route] of Object.entries(ROUTES)) {
    var a = document.createElement("a");
    a.textContent = key;

    if (route === currentRoute) a.className = "active";
    else if (isHome) a.href = "./" + route;
    else a.href = "../" + route;

    nav.appendChild(a);
  }
}

addNav();
