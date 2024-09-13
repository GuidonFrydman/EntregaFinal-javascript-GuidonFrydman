// Función para mostrar reservas confirmadas en "mis-reservas.html"
function mostrarReservasConfirmadas() {
    const reservasConfirmadas = JSON.parse(localStorage.getItem("reservasConfirmadas")) || [];
    const reservasContainer = document.getElementById("reservas-confirmadas");

    reservasContainer.innerHTML = '';

    reservasConfirmadas.forEach((reserva, index) => {
        const destino = reserva.ciudad || 'Ciudad no especificada';

        const reservaCard = document.createElement("div");
        reservaCard.className = "reserva-card";
        reservaCard.innerHTML = `
            <h3>Reserva en ${destino}</h3>
            <p>Nombre: ${reserva.nombre}</p>
            <p>Email: ${reserva.email}</p>
            <p>Teléfono: ${reserva.telefono}</p>
            <button onclick="editarReserva(${index})">Editar</button>
            <button onclick="eliminarReserva(${index})">Eliminar</button>
        `;

        reservasContainer.appendChild(reservaCard);
    });
}

// Función para editar una reserva
function editarReserva(index) {
    const reservasConfirmadas = JSON.parse(localStorage.getItem("reservasConfirmadas")) || [];
    const reserva = reservasConfirmadas[index];

    const formulario = document.getElementById("formulario-edicion");
    formulario.style.display = "block";

    document.getElementById("nombre-edicion").value = reserva.nombre;
    document.getElementById("email-edicion").value = reserva.email;
    document.getElementById("telefono-edicion").value = reserva.telefono;

    formulario.onsubmit = function (event) {
        event.preventDefault();

        reserva.nombre = document.getElementById("nombre-edicion").value;
        reserva.email = document.getElementById("email-edicion").value;
        reserva.telefono = document.getElementById("telefono-edicion").value;

        reservasConfirmadas[index] = reserva;
        localStorage.setItem("reservasConfirmadas", JSON.stringify(reservasConfirmadas));

        formulario.style.display = "none";

        mostrarReservasConfirmadas();
    };
}

// Función para cancelar la edición
function cancelarEdicion() {
    const formulario = document.getElementById("formulario-edicion");
    formulario.style.display = "none";
}

const botonesEliminar = document.querySelectorAll('.eliminar-reserva');

botonesEliminar.forEach(boton => {
    boton.addEventListener('click', function() {
        const reservaId = this.getAttribute('data-id');

        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás deshacer esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarReserva(reservaId);
                
                this.parentElement.remove();
                
                Swal.fire(
                    'Eliminado!',
                    'La reserva ha sido eliminada.',
                    'success'
                );
            }
        });
    });
});

function eliminarReserva(index) {
    const reservasConfirmadas = JSON.parse(localStorage.getItem("reservasConfirmadas")) || [];

    Swal.fire({
        title: '¿Estás seguro?',
        text: "Una vez eliminada, no podrás recuperar esta reserva!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            reservasConfirmadas.splice(index, 1);

            localStorage.setItem("reservasConfirmadas", JSON.stringify(reservasConfirmadas));

            mostrarReservasConfirmadas();

            Swal.fire(
                'Eliminado!',
                'La reserva ha sido eliminada.',
                'success'
            );
        }
    });
}
function agregarBotonVolver() {
    const botonVolver = document.createElement("button");
    botonVolver.id = "volver-index";
    botonVolver.textContent = "Volver a la Página Principal";
    
    document.body.appendChild(botonVolver);

    botonVolver.addEventListener("click", function () {
        window.location.href = "../index.html";
    });
}

agregarBotonVolver();

mostrarReservasConfirmadas();