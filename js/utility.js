/**
 * Includes HTML content into elements with a specific attribute.
 * This function searches for elements with the `w3-include-html` attribute,
 * fetches the corresponding HTML file, and inserts the content into the element.
 * The function is recursive, reapplying the inclusion process for any newly inserted elements.
 * 
 * @returns {void}
 */
function includeHTML() {
  var z, i, elmnt, file, xhttp;
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) { elmnt.innerHTML = this.responseText; }
          if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
  }
}

/**
 * Displays a toast notification with a given message.
 * The toast will appear briefly on the screen and fade out after 3 seconds.
 * 
 * @param {string} message - The message to be displayed in the toast notification.
 * @returns {void}
 */
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/**
 * Observes the document for changes and applies an active state to the sidebar widget
 * once it is rendered. The function waits until the sidebar element is added to the DOM,
 * then applies styles and active state based on the current page.
 * 
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", function () {
  const observer = new MutationObserver((mutations, obs) => {
    const sidebar = document.getElementById("sidelinks");
    if (sidebar) {
      applyActiveState();
      obs.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
});

/**
 * Applies the active state to the widget based on the current page.
 */
function applyActiveState() {
  const currentPath = getCurrentPagePath();
  const pageMap = getPageMap();
  if (pageMap[currentPath]) {
    const activeWidget = document.getElementById(pageMap[currentPath]);
    if (activeWidget) {
      resetWidgetsState();
      setActiveWidgetState(activeWidget);
    } else {
      console.error("Active widget not found in DOM!");
    }
  }
}

/**
 * Gets the current page path (last part of the URL).
 * @returns {string} - The current page path.
 */
function getCurrentPagePath() {
  return window.location.pathname.split("/").pop();
}

/**
 * Returns a mapping of page paths to widget IDs.
 * @returns {Object} - The page to widget mapping.
 */
function getPageMap() {
  return {
    "summary.html": "widget_1",
    "addTask.html": "widget_2",
    "board.html": "widget_3",
    "contacts.html": "widget_4"
  };
}

/**
 * Resets the styles and state of all widgets.
 */
function resetWidgetsState() {
  const allWidgets = document.querySelectorAll('.widget');
  allWidgets.forEach(widget => {
    widget.classList.remove('active');
    widget.style.backgroundColor = '';
    widget.style.color = '';
    widget.style.fontWeight = '';
  });
}

/**
 * Sets the active state for a specific widget.
 * @param {HTMLElement} widget - The widget element to activate.
 */
function setActiveWidgetState(widget) {
  widget.classList.add("active");
  widget.style.backgroundColor = "#1A1F2E";
  widget.style.color = "white";
  widget.style.fontWeight = "bold";
}