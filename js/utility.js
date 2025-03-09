function includeHTML() {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
      elmnt = z[i];
      /*search for elements with a certain atrribute:*/
      file = elmnt.getAttribute("w3-include-html");
      if (file) {
        /* Make an HTTP request using the attribute value as the file name: */
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status == 200) {elmnt.innerHTML = this.responseText;}
            if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
            /* Remove the attribute, and call this function once more: */
            elmnt.removeAttribute("w3-include-html");
            includeHTML();
          }
        }
        xhttp.open("GET", file, true);
        xhttp.send();
        /* Exit the function: */
        return;
      }
    }
  }
  // Function to display initials in the header
// Function to show a toast notification
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message; // Set the toast message
  toast.classList.add('show'); // Show the toast

  // Hide the toast after 3 seconds
  setTimeout(() => {
      toast.classList.remove('show');
  }, 3000);
}
document.addEventListener("DOMContentLoaded", function () {
  const observer = new MutationObserver((mutations, obs) => {
      const sidebar = document.getElementById("sidelinks");
      if (sidebar) {
          console.log("✅ Sidebar detected, running script...");
          applyActiveState();
          addSidebarClickListeners(); // Attach click event listeners
          obs.disconnect(); // Stop observing once sidebar is found
      }
  });

  observer.observe(document.body, { childList: true, subtree: true });
});

function applyActiveState() {
  const currentPath = window.location.pathname.split("/").pop();
  console.log("Checking active state for:", currentPath);

  const pageMap = {
      "summary.html": "widget_1",
      "addTask.html": "widget_2",
      "board.html": "widget_3",
      "contacts.html": "widget_4"
  };

  // Remove active state from all widgets
  document.querySelectorAll(".widget").forEach(widget => {
      widget.classList.remove("active");
      widget.style.backgroundColor = ""; // Reset color
      widget.style.color = ""; // Reset text color
      widget.style.fontWeight = ""; // Reset font weight
  });

  // Apply active state to the matching widget
  if (pageMap[currentPath]) {
      const activeWidget = document.getElementById(pageMap[currentPath]);
      if (activeWidget) {
          activeWidget.style.backgroundColor = "#1A1F2E";
          activeWidget.style.color = "white";
          activeWidget.style.fontWeight = "bold";
          activeWidget.classList.add("active");

          console.log("✅ Active widget set:", activeWidget.id);
      } else {
          console.error("❌ Active widget not found in DOM!");
      }
  }
}

function addSidebarClickListeners() {
  document.querySelectorAll(".widget a").forEach(link => {
      link.addEventListener("click", function (event) {
          event.preventDefault(); // Stop default navigation
          const targetPage = this.getAttribute("href");
          
          // Update active state immediately
          history.pushState({}, "", targetPage); // Update URL without reload
          applyActiveState();
      });
  });
}
