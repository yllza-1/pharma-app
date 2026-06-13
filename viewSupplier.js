const baseUrl = "http://localhost:5001";

const supplierDetails = document.getElementById("supplierDetails");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch(`${baseUrl}/suppliers/${id}`)
  .then((response) => response.json())
  .then((supplier) => {
    supplierDetails.innerHTML = `
      <div class="supplier-card">
        <h2>${supplier.company}</h2>

        <p><strong>Phone:</strong> ${supplier.phone}</p>
        <p><strong>Email:</strong> ${supplier.email}</p>
        <p><strong>Address:</strong> ${supplier.address}</p>
      </div>
    `;
  });
