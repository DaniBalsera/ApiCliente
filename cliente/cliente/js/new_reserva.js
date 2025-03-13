document.addEventListener("DOMContentLoaded", () => {
    // Verificar si el usuario ya está autenticado
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "./login.html";
        return;
    }
    // Decodificar el token para obtener el ID del usuario
    const decodedToken = jwt_decode(token);
    const userId = decodedToken.data[0];
    // Cargar las instalaciones en el select
    cargarInstalaciones(document.getElementById("instalacion"));

    document.getElementById("new-reserva-form").addEventListener("submit", function(event) {
        event.preventDefault();
        crearReserva(token, userId);
    });
});

// Función para cargar las instalaciones en el select
function cargarInstalaciones(selectElement) {
    fetch("http://apicentros.local/api/instalaciones")
        .then(response => response.json())
        .then(instalaciones => {
            instalaciones.forEach(instalacion => {
                console.log(instalacion);
                fetch(`http://apicentros.local/api/centros/${instalacion.centro_id}`)
                    .then(response => response.json())
                    .then(centro => {
                        console.log(instalacion.centro_id);
                        let option = document.createElement("option");
                        option.value = instalacion.id;
                        option.textContent = `${instalacion.nombre} - ${centro.nombre}`;
                        selectElement.appendChild(option);
                    })
                    .catch(error => console.error("Error cargando centro:", error));
            });
        })
        .catch(error => console.error("Error cargando instalaciones:", error));
}

// Función para crear una reserva
function crearReserva(token, userId) {
    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
    const email = document.getElementById("email").value;
    const instalacion = document.getElementById("instalacion").value;
    const fecha_hora_inicio = document.getElementById("fecha_hora_inicio").value;
    const fecha_hora_final = document.getElementById("fecha_hora_final").value;

    // Validar los datos
    if (!nombre || !telefono || !email || !instalacion || !fecha_hora_inicio || !fecha_hora_final) {
        alert("Por favor, complete todos los campos.");
        return;
    }
    // Enviar los datos al servidor
    const reservaData = {
        nombre_solicitante: nombre,
        id_usuario: userId,
        telefono: telefono,
        email: email,
        id_instalacion: instalacion,
        fecha_hora_inicio: fecha_hora_inicio,
        fecha_hora_final: fecha_hora_final,
        estado: "Pendiente"
    };

    console.log(reservaData);
    
    // Enviar los datos al servidor
    fetch("http://apicentros.local/api/reservas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(reservaData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Reserva creada con éxito") {
            alert("Reserva creada.");
            window.location.href = "./reservas.html";
        } else {
            alert("Error al crear la reserva: " + data.message);
        }
    })
    .catch(error => console.error("Error al crear la reserva:", error));
}