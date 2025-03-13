
const token = localStorage.getItem("token");
let decodedToken;

// Verificar si el usuario está autenticado

if (!localStorage.getItem("token")) {
    window.location.href = "./index.html";
    exit();
}
// Decodificar el token para obtener el ID del usuario
try {
    decodedToken = jwt_decode(token);
} catch (error) {
    console.error("Error al decodificar el token:", error);
    alert("Token inválido.");
}

// Obtener la información del usuario
const userId = decodedToken.data[0];

fetch(`http://apicentros.local/api/user?id=${userId}`, {
    method: "GET",
    headers: {
        "Authorization": `Bearer ${token}`
    }
})
.then(response => response.json())
.then(data => {
    if (data) {
        document.getElementById("user-name").textContent = data.nombre;
        document.getElementById("user-email").textContent = data.email;
        document.getElementById("user-info").style.display = "block";
    } else {
        alert("Error al obtener la información del usuario.");
    }
})
.catch(error => console.error("Error:", error));
// Función para eliminar el usuario
function eliminarUsuario() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No estás autenticado.");
        return;
    }

    const decodedToken = jwt_decode(token);
    const userId = decodedToken.data[0];
    // Verificar si el usuario está seguro de eliminar su cuenta
    if (confirm("¿Estás seguro de que deseas eliminar tu cuenta?")) {
        fetch(`http://apicentros.local/api/user?id=${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.message == "Usuario eliminado con éxito") {
                alert("Usuario eliminado con éxito.");
                localStorage.removeItem("token");
                window.location.href = "./login.html";
            } else {
                alert("Error al eliminar el usuario: " + data.message);
            }
            
        })
        .catch(error => console.error("Error:", error));
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem("token");
    window.location.href = "./index.html";
}

// Función para refrescar el token
function refrescarToken() {
    const token = localStorage.getItem("token");
    
    fetch("http://apicentros.local/api/token/refresh", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => {
        console.log("Respuesta completa:", response);
        if (response.status === 401) {
            alert("El token ha caducado. Por favor, inicie sesión de nuevo.");
            cerrarSesion();
            return;
        }
        return response.json();
    })
    .then(data => {
        console.log("Datos recibidos:", data);
        
        if (data.jwt) {
            localStorage.setItem("token", data.jwt);
            alert("Token Actualizado");
        } else {
            alert("Error al actualizar el token");
        }
    })
    .catch(error => console.error("Error:", error));
}