// Public/js/mundiales-admin.js

async function cargarMundiales() {
  try {
    const res = await fetch('Public/php/api.php?endpoint=listar-mundiales');
    const data = await res.json();

    if (!data.success) {
      console.error(data.message);
      return;
    }

    const grid = document.querySelector('.worldcup-grid');
    if (!grid) {
      console.warn("No se encontró el contenedor .worldcup-grid en el HTML.");
      return;
    }

    grid.innerHTML = ""; // Limpia el contenido anterior

    data.mundiales.forEach(m => {
      const div = document.createElement('div');
      div.classList.add('worldcup-item');
      div.innerHTML = `
        <div class="worldcup-img-container">
          <img src="${m.logo || 'Imagenes/default.jpg'}" alt="${m.nombre}" class="worldcup-img">
        </div>
        <div class="worldcup-name">${m.nombre} (${m.anio})</div>
        <p class="worldcup-sede">${m.sede}</p>
        <p class="worldcup-desc">${m.descripcion}</p>
      `;
      grid.appendChild(div);
    });
  } catch (err) {
    console.error('Error cargando mundiales:', err);
  }
}

document.addEventListener('DOMContentLoaded', cargarMundiales);
