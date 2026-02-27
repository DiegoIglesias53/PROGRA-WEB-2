
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('createModal');
  const createPostBtn = document.getElementById('createPostBtn');
  const closeBtn = document.querySelector('.close');
  const cancelBtn = document.querySelector('.btn-cancel');
  const postForm = document.getElementById('create-post-form');

  function openModal() {
    if (!Auth.isLoggedIn()) {
      alert('Debe iniciar sesión para crear una publicación');
      window.location.href = 'login.html';
      return;
    }
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    postForm.reset();
  }

  createPostBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);

  window.addEventListener('click', function(event) {
    if (event.target === modal) closeModal();
  });

  postForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    if (!Auth.isLoggedIn()) {
      alert('Debe iniciar sesión para crear una publicación');
      closeModal();
      window.location.href = 'login.html';
      return;
    }

    const user = Auth.getUser();
    const formData = new FormData();
    formData.append("id_usuario", user.id);
    formData.append("title", document.getElementById("post-title").value);
    formData.append("content", document.getElementById("post-content").value);
    formData.append("category", document.getElementById("post-category").value);
    formData.append("worldcup", document.getElementById("post-worldcup").value);
    formData.append("country", document.getElementById("post-country").value);


    

    const mediaInput = document.getElementById("post-media");
    if (mediaInput.files.length > 0) {
      formData.append("media", mediaInput.files[0]);
    }


// Mostrar en consola el contenido de FormData
console.log("📌 Contenido de FormData:");
for (let [key, value] of formData.entries()) {
  if (value instanceof File) {
    console.log(key, value.name, value.type, value.size + " bytes");
  } else {
    console.log(key, value);
  }
}

    try {
      const res = await fetch("http://localhost:8012/Capa/Public/php/create-post.php", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      console.log("📡 Respuesta del servidor:", data);

      if (data.success) {
        alert("✅ Publicación creada con éxito. Esperando aprobación del administrador.");
        closeModal();
      } else {
        alert("❌ Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error al enviar la publicación.");
    }
  });
});
