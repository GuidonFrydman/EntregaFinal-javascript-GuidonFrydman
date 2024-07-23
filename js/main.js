const destino1 = { ciudad: "Santorini", precio: 200 }
const destino2 = { ciudad: "Paris", precio: 350 }
const destino3 = { ciudad: "Tokyo", precio: 600 }
const destino4 = { ciudad: "Rio de Janeiro", precio: 150 }

const destinos = { destino1, destino2, destino3, destino4 }

const datosReservas = [];

function calculadoraprecio(preciopordia, dias) {
    let valorfinal = preciopordia * dias
    return preciopordia * dias;
}

function datospersonales() {
    const nombre = prompt("Introduzca su nombre");
    const apellido = prompt("Introduzca su apellido");
    const email = prompt("Introduzca su mail");
    return { nombre, apellido, email };
}


function guardarDatosReserva(datos, ciudad, dias, precio) {
    datosReservas.push({ ...datos, ciudad, dias, precio });
}


let ciudades = prompt("que ciudad deseas elegir? Santorini, Paris, Tokyo, Rio de Janeiro")

if (ciudades == destino1.ciudad) {
    let dias = parseInt(prompt("cuantos dias queres viajar?"))
    let preciototal = calculadoraprecio(destino1.precio, dias);
    let confirmar = prompt("El precio para " + dias + " dias es " + preciototal + " dolares. desea continuar?")
    if (confirmar == "si") {
        let datos = datospersonales()
        guardarDatosReserva(datos, destino1.ciudad, dias, preciototal);
        alert("Reserva confirmada a nombre de " + datos.nombre + " " + datos.apellido + " Detalles enviados a " + datos.email + ".")
    }} else if (ciudades == destino2.ciudad) {
        let dias = parseInt(prompt("cuantos dias queres viajar?"))
        let preciototal = calculadoraprecio(destino2.precio, dias);
        let confirmar = prompt("El precio para " + dias + " dias es " + preciototal + " dolares. desea continuar?")
        if (confirmar == "si") {
            let datos = datospersonales()
            guardarDatosReserva(datos, destino2.ciudad, dias, preciototal);
            alert("Reserva confirmada a nombre de " + datos.nombre + " " + datos.apellido + " Detalles enviados a " + datos.email + ".")
        }} else if (ciudades == destino3.ciudad) {
            let dias = parseInt(prompt("cuantos dias queres viajar?"))
            let preciototal = calculadoraprecio(destino3.precio, dias);
            let confirmar = prompt("El precio para " + dias + " dias es " + preciototal + " dolares. desea continuar?")
            if (confirmar == "si") {
                let datos = datospersonales()
                guardarDatosReserva(datos, destino3.ciudad, dias, preciototal);
                alert("Reserva confirmada a nombre de " + datos.nombre + " " + datos.apellido + " Detalles enviados a " + datos.email + ".")
            }} else if (ciudades == destino4.ciudad) {
                let dias = parseInt(prompt("cuantos dias queres viajar?"))
                let preciototal = calculadoraprecio(destino4.precio, dias);
                let confirmar = prompt("El precio para " + dias + " dias es " + preciototal + " dolares. desea continuar?")
                if (confirmar == "si") {
                    let datos = datospersonales()
                    guardarDatosReserva(datos, destino4.ciudad, dias, preciototal);
                    alert("Reserva confirmada a nombre de " + datos.nombre + " " + datos.apellido + " Detalles enviados a " + datos.email + ".")
        } else {
            alert("cancelaste la reserva")
        }
    }
    else {
        alert("error de escritura")
    }

    for (let i = 0; i < datosReservas.length; i++) {
        console.log("Reserva " + i + ": " + datosReservas[i].nombre + " " + datosReservas[i].apellido + ", Ciudad: " + datosReservas[i].ciudad + ", Días: " + datosReservas[i].dias + ", Precio: " + datosReservas[i].precio);
    }