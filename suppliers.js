const baseUrl = "http://localhost:5001";

const supplierTable = document.getElementById("supplierTable");
const activeSuppliers = document.getElementById("activeSuppliers");
const searchInput = document.getElementById("searchInput");
const supplierDeleteModal = document.getElementById("supplierDeleteModal");
const supplierDeleteMessage = document.getElementById("supplierDeleteMessage");
const supplierConfirmDelete = document.getElementById("supplierConfirmDelete");
const supplierCancelDelete = document.getElementById("supplierCancelDelete");
const totalMedicines = document.getElementById("totalMedicines");
const totalSuppliers = document.getElementById("totalSuppliers");
const totalSales = document.getElementById("totalSales");
const totalRevenue = document.getElementById("totalRevenue");
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

let suppliers = [];

const getAllSuppliers = async () => {
  try {
    const response = await fetch(`${baseUrl}/suppliers`);
    suppliers = await response.json();

    supplierTable.innerHTML = "";

    suppliers.forEach((supplier) => {
      supplierTable.innerHTML += `
        <tr>
          <td>${supplier.company}</td>
          <td>${supplier.phone}</td>
          <td>${supplier.email}</td>
          <td>${supplier.address}</td>

         <td class="actions">
  <a href="viewSupplier.html?id=${supplier.id}" class="view-btn">
    View
  </a>

  <a href="editSupplier.html?id=${supplier.id}" class="edit-btn">
    Edit
  </a>
<button
  class="supplier-delete-btn"
  onclick="deleteSupplier(${supplier.id}, '${supplier.company}')"
>
  Delete
</button>
</td>

    
        </tr>
      `;
    });

    totalSuppliers.textContent = suppliers.length;
    activeSuppliers.textContent = suppliers.length;
    totalMedicines.textContent = suppliers.length;
  } catch (error) {
    console.log(error);
  }
};

let supplierIdToDelete = null;

window.deleteSupplier = (id, company) => {
  supplierIdToDelete = id;

  supplierDeleteMessage.textContent = `Are you sure you want to delete ${company}?`;

  supplierDeleteModal.style.display = "flex";
};

supplierCancelDelete.addEventListener("click", () => {
  supplierDeleteModal.style.display = "none";
});

supplierConfirmDelete.addEventListener("click", async () => {
  try {
    await fetch(`${baseUrl}/suppliers/${supplierIdToDelete}`, {
      method: "DELETE",
    });

    supplierDeleteModal.style.display = "none";

    getAllSuppliers();
  } catch (error) {
    console.log(error);
  }
});

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.company.toLowerCase().includes(value),
  );

  supplierTable.innerHTML = "";

  filteredSuppliers.forEach((supplier) => {
    supplierTable.innerHTML += `
      <tr>
        <td>${supplier.company}</td>
        <td>${supplier.phone}</td>
        <td>${supplier.email}</td>
        <td>${supplier.address}</td>

       <td class="actions">
  <a href="viewSupplier.html?id=${supplier.id}" class="view-btn">
    View
  </a>

  <a href="editSupplier.html?id=${supplier.id}" class="edit-btn">
    Edit
  </a>

  <button
   onclick="deleteSupplier(${supplier.id}, '${supplier.company}')"
  >
    Delete
  </button>
</td>
      </tr>
    `;
  });
});

getAllSuppliers();
