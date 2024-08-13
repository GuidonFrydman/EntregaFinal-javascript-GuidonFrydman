const destinos = [
    { ciudad: "Santorini", precio: 200 },
    { ciudad: "Paris", precio: 350 },
    { ciudad: "Tokyo", precio: 600 },
    { ciudad: "Rio de Janeiro", precio: 150 }
];

const reservas = JSON.parse(localStorage.getItem("reservas")) || [];


// Función para mostrar los destinos
function mostrarDestinos() {
    const contenedor = document.getElementById("destinos-container");
    contenedor.innerHTML = "";

    destinos.forEach((destino, index) => {
        const destinoElement = document.createElement("div");
        destinoElement.innerHTML = `
            <h2>${destino.ciudad}</h2>
            <p>Precio: $${destino.precio}</p>
            <button id="reservar-${index}" data-ciudad="${destino.ciudad}" data-precio="${destino.precio}">Reservar</button>
        `;
        contenedor.appendChild(destinoElement);
    });

    agregarEventosBotones();
}

// Función para agregar eventos a los botones
function agregarEventosBotones() {
    destinos.forEach((_, index) => {
        const boton = document.getElementById(`reservar-${index}`);

        boton.onclick = function () {
            const ciudad = this.getAttribute("data-ciudad");
            const precio = parseFloat(this.getAttribute("data-precio"));

            reservas.push({ ciudad, precio });

            // Guardar las reservas en localStorage
            localStorage.setItem("reservas", JSON.stringify(reservas));

            alert(`Reserva confirmada para ${ciudad} con un precio de $${precio}`);

            mostrarReservas();
            mostrarTotalReservas(); 
        };
    });
}

// Función para mostrar las reservas en la página
function mostrarReservas() {
    const contenedor = document.getElementById("reservas-container");
    contenedor.innerHTML = "";

    reservas.forEach(reserva => {
        const reservaElement = document.createElement("div");
        reservaElement.innerHTML = `
            <h3>${reserva.ciudad}</h3>
            <p>Precio: $${reserva.precio}</p>
        `;
        contenedor.appendChild(reservaElement);
    });
}

// Función para mostrar el total de las reservas
function mostrarTotalReservas() {
    const total = reservas
        .map(reserva => reserva.precio) 
        .reduce((acc, precio) => acc + precio, 0); 

    const contenedor = document.getElementById("total-container");
    contenedor.innerHTML = `<h3>Total de Reservas: $${total.toFixed(2)}</h3>`;
}

// Llamar a la función cuando la página cargue
document.addEventListener("DOMContentLoaded", () => {
    mostrarDestinos();
    mostrarReservas(); 
    mostrarTotalReservas(); 
});
