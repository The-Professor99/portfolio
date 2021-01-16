import {
  animateButton,
  enableDarkMode,
  disableDarkMode,
  toggleNav,
} from "./modules/ui.js";

window.onload = () => {
  let buttons = document.querySelectorAll(".btn");

  buttons.forEach((el) => {
    el.onclick = animateButton;
  });

  let header = document.getElementById("header");
  let lastScrollPos = 0;
  window.onscroll = () => {
    let scrollPos = window.pageYOffset || document.documentElement.scrollTop;
    toggleNav(header, scrollPos, lastScrollPos);
    lastScrollPos = scrollPos;
  };

  let darkMode = localStorage.getItem("darkMode");
  let darkModeToggle = document.querySelector("input[name=mode]");

  if (darkMode == "enabled") {
    enableDarkMode();
    darkModeToggle.checked = true;
  }

  darkModeToggle.addEventListener("change", function () {
    darkMode = localStorage.getItem("darkMode");
    if (this.checked && darkMode != "enabled") {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
  });

  let headerWrapper = document.querySelector(".header-wrapper");
  let menuToggle = document.querySelector(".menu-toggle");
  let menu = document.querySelector(".main-menu");

  menuToggle.onclick = (e) => {
    e.stopPropagation();
    menuToggle.classList.toggle("active");
    menu.classList.toggle("active");
    headerWrapper.classList.toggle("active");

    document.documentElement.onclick = () => {
      if (e.target.closest(".main-menu")) return;
      menuToggle.classList.remove("active");
      menu.classList.remove("active");
      headerWrapper.classList.remove("active");
    };
  };
};
