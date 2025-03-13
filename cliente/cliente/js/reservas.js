document.addEventListener("DOMContentLoaded", () => {
    // Verificar si el usuario ya está autenticado
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "./login.html";
        return;
    }

    const decodedToken = jwt_decode(token);
    const userId = decodedToken.data[0];

    // Obtener todas las instalaciones
    fetch("http://apicentros.local/api/instalaciones", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(instalaciones => {
        const instalacionesMap = new Map();
        const centrosPromises = instalaciones.map(instalacion => {
            instalacionesMap.set(instalacion.id, instalacion.nombre);
            return fetch(`http://apicentros.local/api/centros/${instalacion.centro_id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(centro => {
                return { instalacionId: instalacion.id, centroNombre: centro.nombre };
            });
        });

        Promise.all(centrosPromises).then(centros => {
            const centrosMap = new Map();
            centros.forEach(centro => {
                centrosMap.set(centro.instalacionId, centro.centroNombre);
            });

            // Obtener las reservas del usuario a través de su id
            fetch(`http://apicentros.local/api/reservas?user_id=${userId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(reservas => {
                const reservasList = document.getElementById("reservas-list");
                reservas.forEach(reserva => {
                    const nombreInstalacion = instalacionesMap.get(reserva.id_instalacion) || "Desconocida";
                    const nombreCentro = centrosMap.get(reserva.id_instalacion) || "Desconocido";
                    const li = document.createElement("li");
                    li.innerHTML = `<div class="reserva-card">
                                        <h3>${nombreInstalacion} - ${nombreCentro}</h3>
                                        <p><strong>Nombre del Solicitante:</strong> ${reserva.nombre_solicitante}</p>
                                        <p><strong>Teléfono:</strong> ${reserva.telefono}</p>
                                        <p><strong>Email:</strong> ${reserva.email}</p>
                                        <p><strong>Fecha y Hora de Inicio:</strong> ${reserva.fecha_hora_inicio}</p>
                                        <p><strong>Fecha y Hora de Final:</strong> ${reserva.fecha_hora_final}</p>
                                        <p><strong>Estado:</strong> ${reserva.estado}</p>
                                        <button class="cancel-button" style="background-color: #003d5b; color: white;" onclick="cancelarReserva(${reserva.id})">Cancelar Reserva</button>
                                    </div>`;
                    reservasList.appendChild(li);
                });
            })
            .catch(error => console.error("Error cargando reservas:", error));
        });
    })
    .catch(error => console.error("Error cargando instalaciones:", error));
});

// Función para cancelar una reserva
function cancelarReserva(reservaId) {
    if (confirm("¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer.")) {
        const token = localStorage.getItem("token");
        fetch(`http://apicentros.local/api/reservas/${reservaId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message == "Reserva eliminada con éxito") {
                window.location.reload();
            } else {
                window.location.reload();
                
            }
        })
        .catch(error => console.error("Error:", error));
    }
}