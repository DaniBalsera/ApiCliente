document.addEventListener("DOMContentLoaded", function () {
    // Verificar si el usuario ya está autenticado
    if (localStorage.getItem("token")) {
        document.getElementById("login").style.display = "none";
        document.getElementById("register").style.display = "none";
    } else {
        document.getElementById("inscripciones").style.display = "none";
        document.getElementById("reservas").style.display = "none";
        document.getElementById("sistema").style.display = "none";
    }

    // Cargar las instalaciones
    fetch("http://apicentros.local/api/instalaciones")
    .then(response => response.json())
    .then(instalaciones => {
        let lista = document.getElementById("instalaciones-list");
        instalaciones.forEach(instalacion => {
            let li = document.createElement("li");
            li.innerHTML = `<strong>${instalacion.nombre}</strong><br>
                            <span class="info"><strong>Descripción</strong>: ${instalacion.descripcion}<br>
                            <strong>Capacidad máxima</strong>: ${instalacion.capacidad_maxima}</span>`;
            lista.appendChild(li);
        });
    });

    // Buscar instalaciones
    const searchForm = document.getElementById("search-form");
    const nombreInput = document.getElementById("search-nombre-instalacion");
    const descripcionInput = document.getElementById("search-descripcion-Instalacion");
    
    function debounce(fn, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    }

    function buscarInstalaciones() {
        let query = {};
        
        if (nombreInput.value.trim() !== "") {
            query.nombre = nombreInput.value.trim();
        }
    
        if (descripcionInput.value.trim() !== "") {
            query.descripcion = descripcionInput.value.trim();
        }
    
        const queryString = new URLSearchParams(query).toString();
        const url = queryString ? `http://apicentros.local/api/instalaciones?${queryString}` : `http://apicentros.local/api/instalaciones`;
    const error = document.getElementById("mensajeError");
    fetch(url)
        .then(response => {
        if (!response.ok) {
            if (response.status === 404) {
            error.style.display = 'block'; // Mostrar el mensaje
            error.innerHTML = 'No se encontraron instalaciones que coincidan con su búsqueda';
            console.log('Error 404: Instalaciones no encontradas'); // Verificar en la consola
            } else {
            console.log(`Error HTTP: ${response.status}`); // Verificar otros errores HTTP
            throw new Error(`Error HTTP: ${response.status}`);
            }
            return [];
        }
        error.style.display = 'none'; // Asegurarse de que el mensaje de error se oculta
        return response.json();
        })
        .then(instalaciones => {
                console.log("Instalaciones encontradas:", instalaciones);
                console.log("URL de búsqueda:", url);
                let lista = document.getElementById("instalaciones-list");
                lista.innerHTML = '';
                instalaciones.forEach(instalacion => {
                    let li = document.createElement("li");
                    li.innerHTML = `<strong>${instalacion.nombre}</strong><br>
                                    <span class="info"><strong>Descripción</strong>: ${instalacion.descripcion}<br>
                                    <strong>Capacidad máxima</strong>: ${instalacion.capacidad_maxima}</span>`;
                    lista.appendChild(li);
                });
            })
            .catch(error => console.error("Error buscando Instalaciones:", error));
    }

    const buscarInstalacionesDebounced = debounce(buscarInstalaciones, 300);

    // Ejecutar la búsqueda en tiempo real mientras se escribe
    nombreInput.addEventListener("input", buscarInstalacionesDebounced);
    descripcionInput.addEventListener("input", buscarInstalacionesDebounced);

    // Evitar que el formulario se envíe al presionar Enter
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        buscarInstalaciones();
    });
});
