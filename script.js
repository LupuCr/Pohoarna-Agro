
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".page-section");
  const exploreBtn = document.querySelector(".explore-trigger");

  function switchPage(targetPageId) {
    sections.forEach(section => {
      if (section.id === targetPageId) {
        section.classList.add("active");
      } else {
        section.classList.remove("active");
      }
    });

    navLinks.forEach(link => {
      if (link.getAttribute("data-page") === targetPageId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Reset components upon layout change
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (targetPageId === 'stats') {
       triggerCounters();
    }
    // Refresh map layout dynamically if switching to contact page
    if (targetPageId === 'contact' && window.agriculturalMap) {
      setTimeout(() => { window.agriculturalMap.invalidateSize(); }, 200);
    }
  }

  // Handle click on nav menu
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetPage = link.getAttribute("data-page");
      switchPage(targetPage);
    });
  });

  // Handle click on Hero Action Button
  if (exploreBtn) {
    exploreBtn.addEventListener("click", (e) => {
      e.preventDefault();
      switchPage("about");
    });
  }
});

// 2. PAGE LOADER INITIALIZATION
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => {
    loader.style.opacity = "0";
    setTimeout(() => { loader.style.display = "none"; }, 500);
  }, 1000);
  // Init maps and charts
  initCharts();
  initMap();
});

// 3. AOS ANIMATION INITIALIZATION
AOS.init({
  duration: 1000,
  once: true
});

// 4. DARK MODE LAYER MANAGER
const themeBtn = document.getElementById("themeToggle");
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// 5. RE-ENGAGED COUNTERS ENGINE
function triggerCounters() {
  const counters = document.querySelectorAll(".counter");
  counters.forEach(counter => {
    counter.innerText = '0';
    const target = +counter.getAttribute("data-target");
    
    const updateCounter = () => {
      const current = +counter.innerText.replace(/,/g, '');
      // Viteză ajustabilă a numărătorii pentru a arăta natural
      const increment = target / 80; 

      if (current < target) {
        counter.innerText = `${Math.ceil(current + increment).toLocaleString()}`;
        setTimeout(updateCounter, 20);
      } else {
        counter.innerText = target.toLocaleString();
      }
    };
    updateCounter();
  });
}

// 6. PROGRESS BAR ON SCROLL
window.onscroll = () => {
  let scrollTop = document.documentElement.scrollTop;
  let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  let progress = (scrollTop / height) * 100;
  document.getElementById("progressBar").style.width = progress + "%";
}

// 7. CHART JS INITIALIZATION
function initCharts() {
  // Chart 1: Income Chart (Line)
  new Chart(document.getElementById("incomeChart"), {
    type: "line",
    data: {
      labels: ["2024", "2025", "2026"],
      datasets: [{
        label: "Venit din Vânzări (MDL)",
        data: [23320000, 19080000, 22030000],
        borderColor: "#2e7d32",
        backgroundColor: "rgba(46, 125, 50, 0.1)",
        borderWidth: 3,
        tension: 0.3,
        fill: true
      }]
    },
    options: { responsive: true }
  });

  // Chart 2: Profit Chart (Bar)
  new Chart(document.getElementById("profitChart"), {
    type: "bar",
    data: {
      labels: ["2024", "2025", "2026"],
      datasets: [{
        label: "Profit Curat / Pierderi (MDL)",
        data: [807100, -3000000, -2640000],
        backgroundColor: function(context) {
          const index = context.dataIndex;
          const value = context.dataset.data[index];
          return value < 0 ? 'rgba(211, 47, 47, 0.8)' : 'rgba(46, 125, 50, 0.8)';
        },
        borderRadius: 6
      }]
    },
    options: { responsive: true }
  });

  // Chart 3: Crop Distribution Pie
  new Chart(document.getElementById("cropChart"), {
    type: "pie",
    data: {
      labels: ["Grâu (1200 ha)", "Porumb (850 ha)", "Floarea-Soarelui (600 ha)", "Orz (300 ha)", "Rapiță (250 ha)"],
      datasets: [{
        data: [1200, 850, 600, 300, 250],
        backgroundColor: ["#2e7d32", "#ffc107", "#ffa000", "#81c784", "#c8e6c9"]
      }]
    },
    options: { responsive: true }
  });

  // Chart 4: Human Resources Distribution (Doughnut)
  new Chart(document.getElementById("employeeChart"), {
    type: "doughnut",
    data: {
      labels: ["Mecanizatori", "Agronomi", "Șoferi/Logisitică", "Administrație & Control"],
      datasets: [{
        data: [35, 5, 15, 10],
        backgroundColor: ["#1b5e20", "#ffd54f", "#26a69a", "#78909c"]
      }]
    },
    options: { responsive: true }
  });
}

// 8. LEAFLET MAP ENGINE - UPDATED COORDINATES
function initMap() {
  const farmCoords = [47.8443106, 28.4887099];
  
  const map = L.map('map').setView(farmCoords, 14);
  window.agriculturalMap = map; // Save global reference

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  L.marker(farmCoords).addTo(map)
    .bindPopup('<b>SRL POHOARNA AGRO</b><br>Baza tehnico-materială.')
    .openPopup();
}