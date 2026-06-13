const baseUrl = "http://localhost:5001";

const reportMedicines = document.getElementById("reportMedicines");
const reportSuppliers = document.getElementById("reportSuppliers");
const reportRevenue = document.getElementById("reportRevenue");
const reportSales = document.getElementById("reportSales");
const lowStockMedicines = document.getElementById("lowStockMedicines");
const showLowStockBtn = document.getElementById("showLowStockBtn");
const showTopSellingBtn = document.getElementById("showTopSellingBtn");
const topSellingMedicines = document.getElementById("topSellingMedicines");
const profileCard = document.getElementById("profileCard");
const profileDropdown = document.getElementById("profileDropdown");

const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

if (!loggedUser) {
  alert("Please login first!");
  window.location.href = "log-in.html";
} else {
  const userName = document.getElementById("userName");

  if (userName) {
    userName.textContent = loggedUser.name;
  }
}

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("loggedUser");
  window.location.href = "log-in.html";
});

profileCard.addEventListener("click", () => {
  profileDropdown.classList.toggle("show");
});

document.addEventListener("click", (e) => {
  if (!profileCard.contains(e.target) && !profileDropdown.contains(e.target)) {
    profileDropdown.classList.remove("show");
  }
});

let salesData = [];

const loadReports = async () => {
  const medicinesRes = await fetch(`${baseUrl}/medicines`);
  const suppliersRes = await fetch(`${baseUrl}/suppliers`);
  const salesRes = await fetch(`${baseUrl}/sales`);

  const medicines = await medicinesRes.json();
  const suppliers = await suppliersRes.json();
  const sales = await salesRes.json();

  salesData = sales;

  reportMedicines.textContent = medicines.length;
  reportSuppliers.textContent = suppliers.length;
  reportSales.textContent = sales.length;

  const revenue = sales.reduce((sum, sale) => {
    return sum + sale.price * sale.quantity;
  }, 0);

  reportRevenue.textContent = `€${revenue}`;

  google.charts.load("current", {
    packages: ["corechart", "bar"],
  });

  google.charts.setOnLoadCallback(() => {
    drawCategoryChart(medicines);
    drawSalesChart(sales);
    drawStockChart(medicines);
  });

  showLowStockBtn.addEventListener("click", () => {
    if (lowStockMedicines.innerHTML !== "") {
      lowStockMedicines.innerHTML = "";
      showLowStockBtn.textContent = "Show Medicines";
      return;
    }

    const lowStock = medicines.filter((medicine) => Number(medicine.stock) < 5);

    lowStockMedicines.innerHTML = "";

    lowStock.forEach((medicine) => {
      lowStockMedicines.innerHTML += `
        <div class="low-stock-item">
          ${medicine.name} (${medicine.stock})
        </div>
      `;
    });

    showLowStockBtn.textContent = "Hide Medicines";
  });
};

showTopSellingBtn.addEventListener("click", () => {
  if (topSellingMedicines.innerHTML !== "") {
    topSellingMedicines.innerHTML = "";
    showTopSellingBtn.textContent = "Show Medicines";
    return;
  }

  const products = {};

  salesData.forEach((sale) => {
    products[sale.medicine] = (products[sale.medicine] || 0) + sale.quantity;
  });

  const sortedProducts = Object.entries(products)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  sortedProducts.forEach(([medicine, quantity]) => {
    topSellingMedicines.innerHTML += `
      <div class="top-selling-item">
        ${medicine} - Sold: ${quantity}
      </div>
    `;
  });

  showTopSellingBtn.textContent = "Hide Medicines";
});

const drawCategoryChart = (medicines) => {
  const categories = {};

  medicines.forEach((medicine) => {
    categories[medicine.category] = (categories[medicine.category] || 0) + 1;
  });

  const dataArray = [["Category", "Count"]];

  Object.entries(categories).forEach(([category, count]) => {
    dataArray.push([category, count]);
  });

  const data = google.visualization.arrayToDataTable(dataArray);

  const chart = new google.visualization.PieChart(
    document.getElementById("categoryChart"),
  );

  chart.draw(data, {
    pieHole: 0.5,
    legend: {
      position: "bottom",
    },
  });
};

const drawSalesChart = (sales) => {
  const products = {};

  sales.forEach((sale) => {
    products[sale.medicine] = (products[sale.medicine] || 0) + sale.quantity;
  });

  const dataArray = [["Medicine", "Sold"]];

  Object.entries(products)
    .slice(0, 5)
    .forEach(([medicine, quantity]) => {
      dataArray.push([medicine, quantity]);
    });

  const data = google.visualization.arrayToDataTable(dataArray);

  const chart = new google.visualization.ColumnChart(
    document.getElementById("salesChart"),
  );

  chart.draw(data, {
    legend: "none",
  });
};

const drawStockChart = (medicines) => {
  const inStock = medicines.filter((m) => m.stock > 10).length;

  const lowStock = medicines.filter((m) => m.stock > 0 && m.stock <= 10).length;

  const outStock = medicines.filter((m) => m.stock === 0).length;

  const data = google.visualization.arrayToDataTable([
    ["Status", "Count"],
    ["In Stock", inStock],
    ["Low Stock", lowStock],
    ["Out Of Stock", outStock],
  ]);

  const chart = new google.visualization.BarChart(
    document.getElementById("stockChart"),
  );

  chart.draw(data, {
    legend: "none",
    chartArea: {
      width: "70%",
      height: "80%",
    },
    hAxis: {
      minValue: 0,
    },
  });
};

loadReports();
