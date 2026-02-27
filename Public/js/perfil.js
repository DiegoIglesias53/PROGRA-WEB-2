document.addEventListener('DOMContentLoaded', async () => {
    if (!Auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    const user = await Auth.fetchUserProfile() || Auth.getUser();

    // Mostrar datos en la sección de perfil
    displayUserProfile(user);

    // Cargar publicaciones del usuario
    cargarPublicaciones(user.id_usuario || user.id);

    // Botón regresar al inicio
    document.getElementById('btn-regresar').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Modal de edición
    const modal = document.getElementById('edit-modal');
    const btnEditar = document.getElementById('btn-editar');
    const closeModal = modal.querySelector('.close');
    const btnCancelar = document.getElementById('btn-cancelar');

    // Abrir modal y llenar formulario
    btnEditar.addEventListener('click', () => {
        document.getElementById('nombre_completo').value = user.nombre_completo || '';
        document.getElementById('fecha_nacimiento').value = user.fecha_nacimiento || '';
        document.getElementById('genero').value = user.genero || 'Otro';
        document.getElementById('pais_nacimiento').value = user.pais_nacimiento || '';
        document.getElementById('nacionalidad').value = user.nacionalidad || '';
        modal.style.display = 'block';
    });

    // Cerrar modal
    closeModal.addEventListener('click', () => modal.style.display = 'none');
    btnCancelar.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', e => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // Guardar cambios del modal
    document.getElementById('edit-profile-form').addEventListener('submit', async e => {
        e.preventDefault();

        const datosActualizados = {
            id_usuario: user.id_usuario || user.id,
            nombre_completo: document.getElementById('nombre_completo').value.trim(),
            fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
            genero: document.getElementById('genero').value,
            pais_nacimiento: document.getElementById('pais_nacimiento').value.trim(),
            nacionalidad: document.getElementById('nacionalidad').value.trim()
        };

        try {
            const response = await fetch('./Public/php/api.php?endpoint=updateProfile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosActualizados)
            });


            // Revisar si la respuesta fue ok
            if (!response.ok) {
                console.error("HTTP error:", response.status, response.statusText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Leer texto crudo del servidor
            const text = await response.text();
            console.log("Texto recibido del servidor:", text);

            // Intentar parsear JSON
            let data;
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error("Error al parsear JSON:", parseError);
                throw parseError;
            }

            // Revisar estado
            if (data.status === 'success') {
                modal.style.display = 'none';

                const updatedUser = { ...user, ...datosActualizados };
                localStorage.setItem("userId", updatedUser.id_usuario);
                localStorage.setItem("userName", updatedUser.nombre_completo);
                localStorage.setItem("userEmail", updatedUser.correo || updatedUser.email);

                displayUserProfile(updatedUser);
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            alert('Ocurrió un error al guardar los cambios. Revisa la consola para más detalles.');
        }

            });
        });

// Función para mostrar datos de usuario en la página
function displayUserProfile(user) {
    document.getElementById('profile-name').textContent = user.nombre_completo || 'No disponible';
    document.getElementById('profile-email').textContent = user.correo || user.email || 'No disponible';
}

// Función para cargar publicaciones del usuario
async function cargarPublicaciones(userId) {
    const container = document.getElementById('posts-container');
    container.innerHTML = '';

    try {
        const response = await fetch(`./Public/php/api.php?endpoint=userPosts&userId=${userId}`);
        const data = await response.json();

        if (data.status === 'success' && data.posts.length > 0) {
            data.posts.forEach(pub => {
                const div = document.createElement('div');
                div.className = 'post-card';
                div.innerHTML = `
                    <h3>${pub.titulo}</h3>
                    <p><strong>Mundial:</strong> ${pub.mundial || '-'}</p>
                    <p><strong>Categoría:</strong> ${pub.categoria || '-'}</p>
                    <p>${pub.descripcion || ''}</p>
                    ${pub.multimedia ? `<img src="data:image/jpeg;base64,${pub.multimedia}" alt="Multimedia" class="post-img">` : ''}
                    <div class="post-icons">
                        <span><i class="fa-regular fa-heart"></i> ${pub.likes || 0}</span>
                        <span><i class="fa-regular fa-comment"></i> ${pub.comentarios || 0}</span>
                        <span><i class="fa-regular fa-eye"></i> ${pub.vistas || 0}</span>
                    </div>
                `;
                console.log(pub.multimedia);

                
                container.appendChild(div);
            });
        } else {
            container.innerHTML = '<p>No hay publicaciones aún.</p>';
        }
    } catch (error) {
        console.error('Error al cargar publicaciones:', error);
        container.innerHTML = '<p>Error al cargar publicaciones.</p>';
    }
}

/*

document.addEventListener('DOMContentLoaded', async () => {
    if (!Auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    const user = await Auth.fetchUserProfile() || Auth.getUser();

    // Mostrar datos en la sección de perfil
    displayUserProfile(user);

    // Cargar publicaciones del usuario
    cargarPublicaciones(user.id_usuario || user.id);

    // Botón regresar al inicio
    document.getElementById('btn-regresar').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Modal de edición
    const modal = document.getElementById('edit-modal');
    const btnEditar = document.getElementById('btn-editar');
    const closeModal = modal.querySelector('.close');
    const btnCancelar = document.getElementById('btn-cancelar');

    // Abrir modal y llenar formulario
    btnEditar.addEventListener('click', () => {
        document.getElementById('nombre_completo').value = user.nombre_completo || '';
        document.getElementById('fecha_nacimiento').value = user.fecha_nacimiento || '';
        document.getElementById('genero').value = user.genero || 'Otro';
        document.getElementById('pais_nacimiento').value = user.pais_nacimiento || '';
        document.getElementById('nacionalidad').value = user.nacionalidad || '';
        modal.style.display = 'block';
    });

    // Cerrar modal
    closeModal.addEventListener('click', () => modal.style.display = 'none');
    btnCancelar.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', e => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // Guardar cambios del modal
    document.getElementById('edit-profile-form').addEventListener('submit', async e => {
        e.preventDefault();

        const datosActualizados = {
            id_usuario: user.id_usuario || user.id,
            nombre_completo: document.getElementById('nombre_completo').value.trim(),
            fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
            genero: document.getElementById('genero').value,
            pais_nacimiento: document.getElementById('pais_nacimiento').value.trim(),
            nacionalidad: document.getElementById('nacionalidad').value.trim()
        };

        try {
            const response = await fetch('./Public/php/api.php?endpoint=updateProfile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosActualizados)
            });


            // Revisar si la respuesta fue ok
            if (!response.ok) {
                console.error("HTTP error:", response.status, response.statusText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Leer texto crudo del servidor
            const text = await response.text();
            console.log("Texto recibido del servidor:", text);

            // Intentar parsear JSON
            let data;
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error("Error al parsear JSON:", parseError);
                throw parseError;
            }

            // Revisar estado
            if (data.status === 'success') {
                modal.style.display = 'none';

                const updatedUser = { ...user, ...datosActualizados };
                localStorage.setItem("userId", updatedUser.id_usuario);
                localStorage.setItem("userName", updatedUser.nombre_completo);
                localStorage.setItem("userEmail", updatedUser.correo || updatedUser.email);

                displayUserProfile(updatedUser);
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            alert('Ocurrió un error al guardar los cambios. Revisa la consola para más detalles.');
        }

            });
        });

// Función para mostrar datos de usuario en la página
function displayUserProfile(user) {
    document.getElementById('profile-name').textContent = user.nombre_completo || 'No disponible';
    document.getElementById('profile-email').textContent = user.correo || user.email || 'No disponible';
}

// Función para cargar publicaciones del usuario
async function cargarPublicaciones(userId) {
    const container = document.getElementById('posts-container');
    container.innerHTML = '';

    try {
        const response = await fetch(`./Public/php/api.php?endpoint=userPosts&userId=${userId}`);
        const data = await response.json();

        if (data.status === 'success' && data.posts.length > 0) {
            data.posts.forEach(pub => {
            const div = document.createElement('div');
            div.className = 'post-card';

            div.innerHTML = `
                <h3>${pub.titulo}</h3>
                <p><strong>Mundial:</strong> ${pub.mundial || '-'}</p>
                <p><strong>Categoría:</strong> ${pub.categoria || '-'}</p>
                <p>${pub.descripcion || ''}</p>
                <div class="img-container"></div>
                <div class="post-icons">
                    <span><i class="fa-regular fa-heart"></i> ${pub.likes || 0}</span>
                    <span><i class="fa-regular fa-comment"></i> ${pub.comentarios || 0}</span>
                    <span><i class="fa-regular fa-eye"></i> ${pub.vistas || 0}</span>
                </div>
            `;
            if (pub.multimedia) {
                console.log("multimedia length:", (pub.multimedia || "").length);
                console.log("multimedia starts:", (pub.multimedia || "").slice(0, 30));

                try {
                    const sample = pub.multimedia.slice(0, 20);
                    const decoded = atob(sample);
                    const firstByte = decoded.charCodeAt(0);
                    const secondByte = decoded.charCodeAt(1);
                    console.log("first bytes:", firstByte, secondByte);
                } catch (err) {
                    console.warn("base64 sample invalid or atob failed:", err);
                }

                const img = new Image();
                img.alt = "Multimedia";
                img.className = "post-img";
                img.style.maxWidth = "100%";
                img.style.display = "block";
                img.style.height = "auto";
                img.style.objectFit = "cover";
                img.style.border = "1px solid #ddd";

                img.onload = function() {
                    console.log("Image loaded OK for post id:", pub.id_publicacion);
                };
                img.onerror = function(e) {
                    console.error("Image failed to load for post id:", pub.id_publicacion, e);
                    const errNote = document.createElement('div');
                    errNote.style.color = "red";
                    errNote.textContent = "Error cargando imagen (ver src en consola)";
                    div.querySelector('.img-container').appendChild(errNote);
                    console.log("img.src was:", img.src.slice(0,200));
                };

                img.src = `data:image/jpeg;base64,${pub.multimedia}`;

                const imgContainer = div.querySelector('.img-container');
                if (imgContainer) {
                    imgContainer.appendChild(img);
                } else {
                    console.warn("No se encontró .img-container para este post, se adjuntará al div principal.");
                    div.appendChild(img);
                }
            }

            container.appendChild(div);

            });
        } else {
            container.innerHTML = '<p>No hay publicaciones aún.</p>';
        }
    } catch (error) {
        console.error('Error al cargar publicaciones:', error);
        container.innerHTML = '<p>Error al cargar publicaciones.</p>';
    }
}

*/