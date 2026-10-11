"use strict";
/* Shared navigation behaviour for every chapter page: opens and closes the mobile menu */
function initNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("site-nav");
    /* Stop quietly if a page has no menu markup */
    if (!toggle || !nav) {
        return;
    }
    /* One place that keeps the CSS class and the aria-expanded attribute in sync */
    const setOpen = (open) => {
        nav.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
    };
    const isOpen = () => nav.classList.contains("is-open");
    /* Menu button opens and closes the list */
    toggle.addEventListener("click", () => {
        setOpen(!isOpen());
    });
    /* Tapping a link closes the menu, useful for links that stay on the same page */
    nav.addEventListener("click", (event) => {
        const target = event.target;
        if (target.closest("a")) {
            setOpen(false);
        }
    });
    /* Escape closes the menu and returns focus to the button */
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && isOpen()) {
            setOpen(false);
            toggle.focus();
        }
    });
    /* Growing the window past the mobile breakpoint resets the menu state */
    const desktopQuery = window.matchMedia("(min-width: 801px)");
    desktopQuery.addEventListener("change", (event) => {
        if (event.matches) {
            setOpen(false);
        }
    });
}
initNav();
