document.addEventListener("DOMContentLoaded", cargarUsuarios);

function cargarUsuarios() {
    fetch("Public/php/api.php?endpoint=getUsuarios")
        .then(res => res.json())
        .then(data => mostrarUsuarios(data))
        .catch(err => console.error("Error al obtener usuarios:", err));
}

function mostrarUsuarios(usuarios) {
    const tbody = document.querySelector("#tabla-usuarios tbody");
    tbody.innerHTML = "";

    usuarios.forEach(user => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${user.id_usuario}</td>
            <td>${user.nombre_completo}</td>
            <td>${user.fecha_nacimiento}</td>
            <td>${user.genero}</td>
            <td>${user.pais_nacimiento}</td>
            <td>${user.nacionalidad}</td>
            <td>${user.correo}</td>
            <td>${user.fecha_registro}</td>
        `;

        tbody.appendChild(fila);
    });
}
