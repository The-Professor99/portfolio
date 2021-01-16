export function animateButton(e) {
  e.preventDefault;
  e.target.classList.remove("animate");
  e.target.classList.add("animate");

  setTimeout(function () {
    e.target.classList.remove("animate");
  }, 700);
}

export function animateMode() {
  document.documentElement.classList.add("transition");
  window.setTimeout(() => {
    document.documentElement.classList.remove("transition");
  }, 1000);
}

export function enableDarkMode() {
  animateMode();
  document.documentElement.setAttribute("data-theme", "dark");
  document
    .querySelector("meta[name=theme-color]")
    .setAttribute("content", "#111");
  document.documentElement
    .querySelector("meta[name=apple-mobile-web-app-status-bar]")
    .setAttribute("content", "#111");
  localStorage.setItem("darkMode", "enabled");
  document.querySelector(".about-illustration img").src =
    "./images/static/about_dark.svg";
  document.querySelector(".skills-illustration img").src =
    "./images/static/skills_dark.svg";
}

export function disableDarkMode() {
  animateMode();
  document.documentElement.setAttribute("data-theme", "light");
  document
    .querySelector("meta[name=theme-color]")
    .setAttribute("content", "#fff");
  document.documentElement
    .querySelector("meta[name=apple-mobile-web-app-status-bar]")
    .setAttribute("content", "#fff");
  localStorage.setItem("darkMode", null);
  document.querySelector(".about-illustration img").src =
    "./images/static/about_light.svg";
  document.querySelector(".skills-illustration img").src =
    "./images/static/skills_light.svg";
}

export function toggleNav(header, scrollPos, lastScrollPos) {
  if (scrollPos > lastScrollPos) {
    header.classList.remove("shade");
    header.classList.add("scrolled");
  } else {
    if (scrollPos == 0) {
      header.classList.remove("shade");
    } else {
      header.classList.add("shade");
      header.classList.remove("scrolled");
    }
  }
}
