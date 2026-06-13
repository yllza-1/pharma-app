const baseUrl = "http://localhost:5001";

const productEdit = document.getElementById("productEdit");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const getSupplier = async () => {
  const response = await fetch(`${baseUrl}/suppliers/${id}`);
  const supplier = await response.json();

  productEdit.innerHTML = `
    <form id="editForm">

      <input type="text" id="company" value="${supplier.company}">
      <input type="text" id="phone" value="${supplier.phone}">
      <input type="email" id="email" value="${supplier.email}">
      <input type="text" id="address" value="${supplier.address}">

      <button type="submit">
        Update Supplier
      </button>

    </form>
  `;

  document.getElementById("editForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedSupplier = {
      company: document.getElementById("company").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
      address: document.getElementById("address").value,
    };

    await fetch(`${baseUrl}/suppliers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedSupplier),
    });

    window.location.href = "suppliers.html";
  });
};

getSupplier();

const userName = document.getElementById("userName");
const notificationCount = document.getElementById("notificationCount");

const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

if (loggedUser) {
  userName.textContent = loggedUser.name;
}
