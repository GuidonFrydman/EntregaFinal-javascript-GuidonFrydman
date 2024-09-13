// Mostrar los datos de la reserva en la página de confirmación
function mostrarDatosReserva(reservas) {
    const contenedor = document.getElementById("datos-reserva");
    
    if (!contenedor) {
        console.error('No se encontró el contenedor con el ID "datos-reserva"');
        return;
    }

    contenedor.innerHTML = ""; 

    reservas.forEach(reserva => {
        const reservaElement = document.createElement("div");
        reservaElement.innerHTML = `
            <h3>${reserva.ciudad}</h3>
            <p>Precio Total: $${reserva.precioTotal.toFixed(2)}</p>
            <p>Días: ${reserva.dias}</p>
            <p>Personas: ${reserva.personas}</p>
        `;
        contenedor.appendChild(reservaElement);
    });
}

const reservas = JSON.parse(localStorage.getItem("reservas")) || [];

// Verificar si hay reservas y mostrar los datos
if (reservas.length === 0) {
    window.location.href = "../index.html"; 
} else {
    mostrarDatosReserva(reservas);
}

// Manejar el envío del formulario
const formulario = document.getElementById("formulario");
if (formulario) {
    formulario.addEventListener("submit", function (event) {
        event.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const email = document.getElementById("email").value;
        const telefono = document.getElementById("telefono").value;

        const reservasConfirmadas = JSON.parse(localStorage.getItem("reservasConfirmadas")) || [];

        // Agregar las reservas actuales al array de reservas confirmadas
        reservas.forEach(reserva => {
            // Agregar datos personales a la reserva
            const reservaConDatos = {
                ...reserva,  
                nombre,      
                email,       
                telefono     
            };
            reservasConfirmadas.push(reservaConDatos);  
        });

        // Guardar el array actualizado en localStorage
        localStorage.setItem("reservasConfirmadas", JSON.stringify(reservasConfirmadas));


        Swal.fire({
            icon: 'success',
            title: '¡Muchas gracias por tu compra!',
            text: `Nombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono}\nTotal: $${reservas.reduce((acc, reserva) => acc + reserva.precioTotal, 0).toFixed(2)}`
        }).then(() => {
            // Limpiar las reservas y redirigir a la página principal
            localStorage.removeItem("reservas");
            window.location.href = "../index.html";
        });
    });
} else {
    console.error('No se encontró el formulario con el ID "formulario"');
}

// Manejar el botón de cancelar (no está en el HTML, por lo que se elimina si no existe)
const cancelarButton = document.getElementById("cancelar-formulario");
if (cancelarButton) {
    cancelarButton.onclick = function () {
        window.location.href = "../index.html";
    };
}

const botonVolver = document.createElement('button');
botonVolver.textContent = 'Volver a Agregar Destino';

botonVolver.addEventListener('click', () => {
    window.history.back(); 
});

document.body.appendChild(botonVolver);