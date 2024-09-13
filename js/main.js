let destinos = [];
let reservas = [];

// Cargar destinos desde el archivo JSON
async function cargarDestinosDesdeJSON() {
    try {
        const response = await fetch('./db/data.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo JSON');
        }

        const data = await response.json();
        destinos = data;
        mostrarDestinos();
    } catch (error) {
        console.error('Error al cargar destinos:', error);
    } finally {
        console.log('Intento de carga de destinos finalizado.');
    }
}
// Mostrar los destinos en la interfaz
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

// Agregar eventos a los botones de reserva
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
                    Swal.fire({
                        icon: 'error',
                        title: 'Entrada inválida',
                        text: 'Por favor, ingresa una cantidad válida de días y personas.'
                    });
                    return;
                }

                const precioTotal = precioPorDia * dias * personas;

                const reservaExistenteIndex = reservas.findIndex(reserva => reserva.ciudad === ciudad);

                if (reservaExistenteIndex !== -1) {
                    Swal.fire({
                        title: `Ya tienes una reserva para ${ciudad}`,
                        text: '¿Deseas modificarla o eliminarla?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Modificar',
                        cancelButtonText: 'Eliminar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Swal.fire({
                                title: 'Ingrese la nueva cantidad de días:',
                                input: 'number',
                                inputValue: reservas[reservaExistenteIndex].dias,
                                showCancelButton: true,
                                inputValidator: (value) => {
                                    return (!value || value <= 0) && 'Por favor, ingresa una cantidad válida de días.';
                                }
                            }).then((resultDias) => {
                                if (resultDias.isConfirmed) {
                                    const nuevaCantidadDias = parseInt(resultDias.value);

                                    Swal.fire({
                                        title: 'Ingrese la nueva cantidad de personas:',
                                        input: 'number',
                                        inputValue: reservas[reservaExistenteIndex].personas,
                                        showCancelButton: true,
                                        inputValidator: (value) => {
                                            return (!value || value <= 0) && 'Por favor, ingresa una cantidad válida de personas.';
                                        }
                                    }).then((resultPersonas) => {
                                        if (resultPersonas.isConfirmed) {
                                            const nuevaCantidadPersonas = parseInt(resultPersonas.value);

                                            reservas[reservaExistenteIndex].dias = nuevaCantidadDias;
                                            reservas[reservaExistenteIndex].personas = nuevaCantidadPersonas;
                                            reservas[reservaExistenteIndex].precioTotal = precioPorDia * nuevaCantidadDias * nuevaCantidadPersonas;

                                            localStorage.setItem("reservas", JSON.stringify(reservas));

                                            mostrarReservas();
                                            mostrarTotalReservas();
                                        }
                                    });
                                }
                            });
                        } else {
                            reservas.splice(reservaExistenteIndex, 1);
                            localStorage.setItem("reservas", JSON.stringify(reservas));

                            mostrarReservas();
                            mostrarTotalReservas();

                            reservas.push({ ciudad, precioTotal, dias, personas });
                            localStorage.setItem("reservas", JSON.stringify(reservas));

                            mostrarReservas();
                            mostrarTotalReservas();
                        }
                    });
                } else {
                    reservas.push({ ciudad, precioTotal, dias, personas });
                    localStorage.setItem("reservas", JSON.stringify(reservas));

                    mostrarReservas();
                    mostrarTotalReservas();
                }
            };
        }
    });
}

// Mostrar reservas en la página
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

    // Mostrar u ocultar el botón de confirmar reserva según el número de reservas
    const confirmarReservaButton = document.getElementById("confirmar-reserva-button");
    if (reservas.length > 0) {
        confirmarReservaButton.style.display = "block";
    } else {
        confirmarReservaButton.style.display = "none";
    }

    agregarEventosEliminar();
    agregarEventosModificar();
}

// Mostrar el total de las reservas
function mostrarTotalReservas() {
    const total = reservas
        .map(reserva => reserva.precioTotal)
        .reduce((acc, precio) => acc + precio, 0);

    const contenedor = document.getElementById("total-container");
    contenedor.innerHTML = `<h3>Total de Reservas: $${total.toFixed(2)}</h3>`;
}

// Agregar eventos a los botones de eliminar
function agregarEventosEliminar() {
    reservas.forEach((_, index) => {
        const botonEliminar = document.getElementById(`eliminar-${index}`);

        if (botonEliminar) {
            botonEliminar.onclick = function () {
                Swal.fire({
                    title: '¿Estás seguro de que quieres eliminar esta reserva?',
                    text: 'Una vez eliminada, no podrás recuperar esta reserva.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Eliminar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        reservas.splice(index, 1);
                        localStorage.setItem("reservas", JSON.stringify(reservas));
                        mostrarReservas();
                        mostrarTotalReservas();
                    }
                });
            };
        }
    });
}

// Agregar eventos a los botones de modificar
function agregarEventosModificar() {
    reservas.forEach((_, index) => {
        const botonModificar = document.getElementById(`modificar-${index}`);

        if (botonModificar) {
            botonModificar.onclick = function () {
                Swal.fire({
                    title: 'Ingrese la nueva cantidad de días:',
                    input: 'number',
                    inputValue: reservas[index].dias,
                    showCancelButton: true,
                    inputValidator: (value) => {
                        return (!value || value <= 0) && 'Por favor, ingresa una cantidad válida de días.';
                    }
                }).then((resultDias) => {
                    if (resultDias.isConfirmed) {
                        const nuevaCantidadDias = parseInt(resultDias.value);

                        Swal.fire({
                            title: 'Ingrese la nueva cantidad de personas:',
                            input: 'number',
                            inputValue: reservas[index].personas,
                            showCancelButton: true,
                            inputValidator: (value) => {
                                return (!value || value <= 0) && 'Por favor, ingresa una cantidad válida de personas.';
                            }
                        }).then((resultPersonas) => {
                            if (resultPersonas.isConfirmed) {
                                const nuevaCantidadPersonas = parseInt(resultPersonas.value);


                                const precioPorDia = reservas[index].precioTotal / (reservas[index].dias * reservas[index].personas);

                          
                                reservas[index].dias = nuevaCantidadDias;
                                reservas[index].personas = nuevaCantidadPersonas;
                                reservas[index].precioTotal = precioPorDia * nuevaCantidadDias * nuevaCantidadPersonas;

                                localStorage.setItem("reservas", JSON.stringify(reservas));
                                mostrarReservas();
                                mostrarTotalReservas();
                            }
                        });
                    }
                });
            };
        }
    });
}

// Inicializar la aplicación
function inicializarApp() {

    const reservasGuardadas = localStorage.getItem("reservas");
    if (reservasGuardadas) {
        reservas = JSON.parse(reservasGuardadas);
    }

       // Cargar destinos desde el JSON y esperar a que termine
        cargarDestinosDesdeJSON();

       
mostrarReservas(); // Mostrar reservas cargadas desde localStorage
mostrarTotalReservas(); // Mostrar el total cargado desde localStorage


    const confirmarReservaButton = document.getElementById("confirmar-reserva-button");
    confirmarReservaButton.onclick = function () {
        if (reservas.length > 0) {
            window.location.href = './pages/confirmacion.html'; 
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'No hay reservas',
                text: 'No hay reservas para confirmar.'
            });
        }
    };
}
// Función para crear y agregar el botón de modificar reservas
function crearBotonModificar() {
    // Obtener las reservas confirmadas del localStorage
    const reservasConfirmadas = JSON.parse(localStorage.getItem("reservasConfirmadas")) || [];
    
    // Solo crear y agregar el botón si hay reservas confirmadas
    if (reservasConfirmadas.length > 0) {
        // Crear el botón
        const botonModificar = document.createElement("button");
        botonModificar.textContent = "Modificar Reservas";
        botonModificar.id = "modificar-reservas-button";
        
        // Agregar el evento al botón
        botonModificar.onclick = function () {
            window.location.href = './pages/reservas.html';
        };
        
        // Agregar el botón al cuerpo de la página (o a otro contenedor adecuado)
        document.body.appendChild(botonModificar);
    }
}

// Ejecutar la función de inicialización cuando se carga el script
inicializarApp();
crearBotonModificar();
