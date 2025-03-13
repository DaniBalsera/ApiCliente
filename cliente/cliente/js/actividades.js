document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("token")) {
        document.getElementById("login").style.display = "none";
        document.getElementById("register").style.display = "none";
    } else {
        document.getElementById("inscripciones").style.display = "none";
        document.getElementById("reservas").style.display = "none";
        document.getElementById("sistema").style.display = "none";
    }

    // Cargar las actividades disponibles

    fetch("http://apicentros.local/api/actividades")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(actividades => {
            let lista = document.getElementById("actividades-list");
            actividades.forEach(actividad => {
                let li = document.createElement("li");
                li.innerHTML = `<strong>${actividad.nombre}</strong><br>
                            <span class="info"><strong>Descripción</strong>: ${actividad.descripcion}<br>
                            <strong>Inicio</strong>: ${actividad.fecha_inicio} - Fin: ${actividad.fecha_final}<br>
                            <strong>Horario</strong>: ${actividad.horario}<br>
                            <strong>Plazas</strong>: ${actividad.plazas}</span>`;
                lista.appendChild(li);
            });
        });

    // Buscar actividades

    const searchForm = document.getElementById("search-form");
    const nombreInput = document.getElementById("search-nombre-actividad");
    const descripcionInput = document.getElementById("search-descripcion-actividad");

    // Función para evitar múltiples búsquedas mientras se escribe

    function debounce(fn, delay) {
        let timeoutId; // Variable para almacenar el identificador del temporizador
        return function (...args) {
            clearTimeout(timeoutId); // Cancela cualquier temporizador previo para evitar ejecución prematura
            timeoutId = setTimeout(() => fn(...args), delay); // Establece un nuevo temporizador para ejecutar la función después del delay
        };
    }


    // Función para buscar actividades

    function buscarActividades() {
        let query = {};

        if (nombreInput.value.trim() !== "") {
            query.nombre = nombreInput.value.trim();
        }

        if (descripcionInput.value.trim() !== "") {
            query.descripcion = descripcionInput.value.trim();
        }

        const queryString = new URLSearchParams(query).toString();
        const url = queryString ? `http://apicentros.local/api/actividades?${queryString}` : `http://apicentros.local/api/actividades`;
        const error = document.getElementById("mensajeError");
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) {
                        error.style.display = 'block'; // Mostrar el mensaje
                        error.innerHTML = 'No se encontraron actividades que coincidan con su búsqueda';
                        console.log('Error 404: Actividades no encontradas'); // Verificar en la consola
                    } else {
                        console.log(`Error HTTP: ${response.status}`); // Verificar otros errores HTTP
                        throw new Error(`Error HTTP: ${response.status}`);
                    }
                    return [];
                    
                }
                error.style.display = 'none'; // Asegurarse de que el mensaje de error se oculta

                return response.json();
            })

            .then(actividades => {
                console.log("Actividades encontradas:", actividades);
                console.log("URL de búsqueda:", url);
                let lista = document.getElementById("actividades-list");
                lista.innerHTML = ''; // Limpiar la lista antes de mostrar los resultados
                actividades.forEach(actividad => {
                    let li = document.createElement("li");
                    li.innerHTML = `<strong>${actividad.nombre}</strong><br>
                                    <span class="info"><strong>Descripción</strong>: ${actividad.descripcion}<br>
                                    <strong>Inicio</strong>: ${actividad.fecha_inicio} - Fin: ${actividad.fecha_final}<br>
                                    <strong>Horario</strong>: ${actividad.horario}<br>
                                    <strong>Plazas</strong>: ${actividad.plazas}</span>`;
                    lista.appendChild(li);
                });
            })
            .catch(error => console.error("Error buscando actividades:", error));
    }

    const buscarActividadesDebounced = debounce(buscarActividades, 300);

    // Ejecutar la búsqueda en tiempo real mientras se escribe
    nombreInput.addEventListener("input", buscarActividadesDebounced);
    descripcionInput.addEventListener("input", buscarActividadesDebounced);

    // Evitar que el formulario se envíe al presionar Enter
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        buscarActividades();
    });
});
