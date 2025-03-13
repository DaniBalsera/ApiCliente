const token = localStorage.getItem("token");
// Si no hay token, redirigir al usuario a la página de login
if (!token) {
    window.location.href = "./login.html";
}
// Decodificar el token para obtener el ID del usuario
const decodedToken = jwt_decode(token);
const userId = decodedToken.data[0];
const userEmail = decodedToken.data.usuario;

// Obtener los datos del usuario mediante su ID
fetch(`http://apicentros.local/api/user?id=${userId}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
})
.then(response => response.json())
.then(data => {
    console.log("Datos recibidos:", data);

    if (data) {
        document.getElementById("nombre").value = data.nombre;
        document.getElementById("email").value = data.email;
        document.getElementById("password").value = data.password;
        document.getElementById("repassword").value = data.password;
    } else {
        alert("Error al obtener los datos del usuario.");
    }
})
.catch(error => console.error("Error:", error));

// Agregar el evento submit al formulario de edición
document.getElementById("edit-user-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Evitar la recarga automática del formulario

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const repassword = document.getElementById("repassword").value;

    if (password !== repassword) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    const userData = { nombre, email, password };
    // Enviar los datos al servidor
    fetch(`http://apicentros.local/api/user?id=${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo actualizar el usuario.`);
        }
        return response.json();
    })
    .then(data => {
        if (data.message === "Usuario actualizado con éxito") {
            alert("Usuario actualizado con éxito.");
            refrescarToken(email, password); // Llamar a la función para refrescar el token con los nuevos datos del usuario
        } else {
            alert("Error al actualizar el usuario: " + data.message);
        }
    })
    .catch(error => console.error("Error:", error));
});

// Función para refrescar el token con los nuevos datos
function refrescarToken(email, password) {
    const loginData = { email, password };

    fetch("http://apicentros.local/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo refrescar el token.`);
        }
        return response.json();
    })
    .then(data => {
        if (data.jwt) {
            localStorage.setItem("token", data.jwt);
            window.location.href = "./sistema.html"; 
        } else {
            alert("Error al refrescar el token");
        }
    })
    .catch(error => console.error("Error:", error));
}

function cerrarSesion() {
    localStorage.removeItem("token");
    window.location.href = "./login.html";
}