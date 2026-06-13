const baseUrl = "http://localhost:5001/suppliers";

const supplierForm = document.getElementById("supplierForm");

supplierForm.addEventListener("submit", (e) => {
  e.preventDefault();

  console.log("SAVE CLICKED");

  const supplier = {
    company: document.getElementById("company").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    address: document.getElementById("address").value,
  };

  console.log(supplier);

  fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(supplier),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("SAVED", data);

      window.location.href = "suppliers.html";
    })
    .catch((err) => {
      console.error(err);
    });
});
