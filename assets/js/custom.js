document.addEventListener("DOMContentLoaded", () => {
    
    const form = document.getElementById("customForm");
    const resultDiv = document.getElementById("result");
    const submitBtn = document.getElementById("submitBtn");

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent page reload

        // Collect Values
        const data = {
            name: document.getElementById("name").value.trim(),
            surname: document.getElementById("surname").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            address: document.getElementById("address").value.trim(),
            r1: Number(document.getElementById("rate1").value),
            r2: Number(document.getElementById("rate2").value),
            r3: Number(document.getElementById("rate3").value)
        };

        console.log(data);

        // Display data under form
        resultDiv.innerHTML = `
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Surname:</strong> ${data.surname}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Address:</strong> ${data.address}</p>
        `;

        // Calculate average
        let avg = (data.r1 + data.r2 + data.r3) / 3;

        let color = "black";
        if (avg <= 4) color = "red";
        else if (avg <= 7) color = "orange";
        else color = "green";

        resultDiv.innerHTML += `
            <p style="font-size:18px; font-weight:bold; color:${color};">
                ${data.name} ${data.surname}: ${avg.toFixed(2)}
            </p>
        `;

        // Popup
        showPopup("Form submitted successfully!");
    });
});

// Popup Function
function showPopup(message) {
    const popup = document.createElement("div");
    popup.classList.add("popupSuccess");
    popup.innerText = message;
    document.body.appendChild(popup);

    setTimeout(() => popup.classList.add("show"), 10);

    setTimeout(() => {
        popup.classList.remove("show");
        setTimeout(() => popup.remove(), 300);
    }, 2000);
}
