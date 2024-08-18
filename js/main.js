const destinos = [
    { ciudad: "Santorini", precio: 200 },
    { ciudad: "Paris", precio: 350 },
    { ciudad: "Tokyo", precio: 600 },
    { ciudad: "Rio de Janeiro", precio: 150 }
];

let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

// Función para mostrar los destinos
function mostrarDestinos() {
    const contenedor = document.getElementById("destinos-container");
    contenedor.innerHTML = "";

    destinos.forEach((destino, index) => {
        const destinoElement = document.createElement("div");
        destinoElement.innerHTML = `
            <h2>${destino.ciudad}</h2>
            <p>Precio por día: $${destino.precio}</p>
            <input type="number" id="dias-${index}" min="1" placeholder="Cantidad de días">
            <input type="number" id="personas-${index}" min="1" placeholder="Cantidad de personas">
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

        if (boton) {
            boton.onclick = function () {
                const ciudad = this.getAttribute("data-ciudad");
                const precioPorDia = parseFloat(this.getAttribute("data-precio"));
                const dias = parseInt(document.getElementById(`dias-${index}`).value);
                const personas = parseInt(document.getElementById(`personas-${index}`).value);

                if (isNaN(dias) || dias <= 0 || isNaN(personas) || personas <= 0) {
                    alert("Por favor, ingresa una cantidad válida de días y personas.");
                    return;
                }

                const precioTotal = precioPorDia * dias * personas;

                // Buscar si ya existe una reserva para esta ciudad
                const reservaExistenteIndex = reservas.findIndex(reserva => reserva.ciudad === ciudad);

                if (reservaExistenteIndex !== -1) {
                    // Mostrar mensaje de aviso
                    if (confirm(`Ya tienes una reserva para ${ciudad}. ¿Deseas modificarla o eliminarla?`)) {
                        // Modificar reserva existente
                        const nuevaCantidadDias = parseInt(prompt("Ingrese la nueva cantidad de días:", reservas[reservaExistenteIndex].dias));
                        const nuevaCantidadPersonas = parseInt(prompt("Ingrese la nueva cantidad de personas:", reservas[reservaExistenteIndex].personas));

                        if (!isNaN(nuevaCantidadDias) && nuevaCantidadDias > 0 && !isNaN(nuevaCantidadPersonas) && nuevaCantidadPersonas > 0) {
                            reservas[reservaExistenteIndex].dias = nuevaCantidadDias;
                            reservas[reservaExistenteIndex].personas = nuevaCantidadPersonas;
                            reservas[reservaExistenteIndex].precioTotal = precioPorDia * nuevaCantidadDias * nuevaCantidadPersonas;

                            localStorage.setItem("reservas", JSON.stringify(reservas));

                            mostrarReservas();
                            mostrarTotalReservas();
                        } else {
                            alert("Entrada inválida. Asegúrate de ingresar valores válidos para la cantidad de días y personas.");
                        }
                    } else {
                        // Eliminar reserva existente
                        reservas.splice(reservaExistenteIndex, 1);
                        localStorage.setItem("reservas", JSON.stringify(reservas));

                        mostrarReservas();
                        mostrarTotalReservas();

                        // Hacer nueva reserva
                        reservas.push({ ciudad, precioTotal, dias, personas });
                        localStorage.setItem("reservas", JSON.stringify(reservas));

                        mostrarReservas();
                        mostrarTotalReservas();
                    }
                } else {
                    // Agregar una nueva reserva
                    reservas.push({ ciudad, precioTotal, dias, personas });
                    localStorage.setItem("reservas", JSON.stringify(reservas));

                    mostrarReservas();
                    mostrarTotalReservas();
                }

                // Mostrar el botón de confirmar reserva
                document.getElementById("confirmar-reserva-button").style.display = "block";
            };
        }
    });
}

document.getElementById("confirmar-reserva-button").onclick = function () {
    document.getElementById("formulario-container").style.display = "block";
};

document.getElementById("cancelar-formulario").onclick = function () {
    document.getElementById("formulario-container").style.display = "none";
};

document.getElementById("formulario").onsubmit = function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const mail = document.getElementById("email").value;
    const telefono = document.getElementById("telefono").value;

    if (nombre && mail && telefono) {
        alert(`Reserva confirmada!\nNombre: ${nombre}\nMail: ${mail}\nTeléfono: ${telefono}`);

        // Limpiar reservas y localStorage después de confirmar
        reservas = [];
        localStorage.removeItem("reservas");

        mostrarReservas();
        mostrarTotalReservas();

        document.getElementById("formulario-container").style.display = "none";
        document.getElementById("confirmar-reserva-button").style.display = "none";
    } else {
        alert("Por favor, completa todos los campos.");
    }
};

function agregarEventosEliminar() {
    reservas.forEach((_, index) => {
        const botonEliminar = document.getElementById(`eliminar-${index}`);

        if (botonEliminar) {
            botonEliminar.onclick = function () {
                reservas.splice(index, 1);
                localStorage.setItem("reservas", JSON.stringify(reservas));
                mostrarReservas();
                mostrarTotalReservas();
            };
        }
    });
}

function agregarEventosModificar() {
    reservas.forEach((_, index) => {
        const botonModificar = document.getElementById(`modificar-${index}`);

        if (botonModificar) {
            botonModificar.onclick = function () {
                const reservaIndex = parseInt(this.getAttribute("data-index"));
                const nuevaCantidadDias = parseInt(prompt("Ingrese la nueva cantidad de días:", reservas[reservaIndex].dias));
                const nuevaCantidadPersonas = parseInt(prompt("Ingrese la nueva cantidad de personas:", reservas[reservaIndex].personas));

                if (!isNaN(nuevaCantidadDias) && nuevaCantidadDias > 0 && !isNaN(nuevaCantidadPersonas) && nuevaCantidadPersonas > 0) {
                    const precioPorDia = destinos.find(destino => destino.ciudad === reservas[reservaIndex].ciudad).precio;
                    reservas[reservaIndex].dias = nuevaCantidadDias;
                    reservas[reservaIndex].personas = nuevaCantidadPersonas;
                    reservas[reservaIndex].precioTotal = precioPorDia * nuevaCantidadDias * nuevaCantidadPersonas;

                    localStorage.setItem("reservas", JSON.stringify(reservas));

                    mostrarReservas();
                    mostrarTotalReservas();
                } else {
                    alert("Entrada inválida. Asegúrate de ingresar valores válidos para la cantidad de días y personas.");
                }
            };
        }
    });
}

// Función para mostrar las reservas en la página
function mostrarReservas() {
    const contenedor = document.getElementById("reservas-container");
    contenedor.innerHTML = "";

    reservas.forEach((reserva, index) => {
        const reservaElement = document.createElement("div");

        const precioTotal = typeof reserva.precioTotal === "number" ? reserva.precioTotal.toFixed(2) : "0.00";

        reservaElement.innerHTML = `
            <h3>${reserva.ciudad}</h3>
            <p>Precio Total: $${precioTotal}</p>
            <p>Días: ${reserva.dias}</p>
            <p>Personas: ${reserva.personas}</p>
            <button id="eliminar-${index}" data-index="${index}">Eliminar</button>
            <button id="modificar-${index}" data-index="${index}">Modificar</button>
        `;
        contenedor.appendChild(reservaElement);
    });

    agregarEventosEliminar();
    agregarEventosModificar();
}

// Función para mostrar el total de las reservas
function mostrarTotalReservas() {
    const total = reservas
        .map(reserva => reserva.precioTotal) 
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
