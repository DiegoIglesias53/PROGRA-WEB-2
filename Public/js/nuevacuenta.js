// Función para inicializar el switcher de tema
function initializeThemeSwitcher() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const body = document.body;
    const iconLight = themeToggle.querySelector('.icon-light');
    const iconDark = themeToggle.querySelector('.icon-dark');

    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        if (iconLight) iconLight.style.display = 'none';
        if (iconDark) iconDark.style.display = 'inline';
        themeToggle.setAttribute('aria-pressed', 'true');
    } else {
        if (iconLight) iconLight.style.display = 'inline';
        if (iconDark) iconDark.style.display = 'none';
        themeToggle.setAttribute('aria-pressed', 'false');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        if (isDark) {
            if (iconLight) iconLight.style.display = 'none';
            if (iconDark) iconDark.style.display = 'inline';
            themeToggle.setAttribute('aria-pressed', 'true');
            localStorage.setItem('theme', 'dark');
        } else {
            if (iconLight) iconLight.style.display = 'inline';
            if (iconDark) iconDark.style.display = 'none';
            themeToggle.setAttribute('aria-pressed', 'false');
            localStorage.setItem('theme', 'light');
        }
    });
}

// Función accesibilidad mensajes de error
function enhanceErrorAccessibility(input, errorElement) {
    input.setAttribute('aria-describedby', errorElement.id);
    input.setAttribute('aria-invalid', 'false');

    input.addEventListener('blur', () => {
        if (input.classList.contains('invalid')) {
            input.setAttribute('aria-invalid', 'true');
        } else {
            input.setAttribute('aria-invalid', 'false');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initializeThemeSwitcher();

    const form = document.getElementById('registerForm');
    if (!form) return;

    const nombre = document.getElementById('nombreCompleto');
    const fechaNacimiento = document.getElementById('fechaNacimiento');
    const password = document.getElementById('password');
    const email = document.getElementById('email');

    // Crear contenedores de error
    function setupErrorMessages() {
        function createErrorElement(inputElement) {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.id = `${inputElement.id}-error`;
            errorElement.setAttribute('role', 'alert');
            errorElement.setAttribute('aria-live', 'polite');
            inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
            enhanceErrorAccessibility(inputElement, errorElement);
            return errorElement;
        }
        createErrorElement(password);
        createErrorElement(email);
        createErrorElement(fechaNacimiento);
    }
    setupErrorMessages();

    // Validaciones
    function validatePassword() {
        const value = this.value;
        const errorElement = this.nextElementSibling;
        let errors = [];

        if (value.length < 8) errors.push("Mínimo 8 caracteres");
        if (!/[a-z]/.test(value)) errors.push("Al menos una minúscula");
        if (!/[A-Z]/.test(value)) errors.push("Al menos una mayúscula");
        if (!/\d/.test(value)) errors.push("Al menos un número");
        if (!/[=)§\]€&]/.test(value)) errors.push("Al menos un caracter especial (=)§)]€&)");

        if (errors.length > 0 && value.length > 0) {
            errorElement.innerHTML = '<ul><li>' + errors.join('</li><li>') + '</li></ul>';
            this.classList.add('invalid');
        } else {
            errorElement.innerHTML = '';
            this.classList.remove('invalid');
        }
    }

    function validateEmail() {
        const value = this.value.trim();
        const errorElement = this.nextElementSibling;
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regex.test(value) && value.length > 0) {
            errorElement.textContent = 'Ingresa un email válido (ejemplo@dominio.com)';
            this.classList.add('invalid');
        } else {
            errorElement.textContent = '';
            this.classList.remove('invalid');
        }
    }

    function validateEdad() {
        const value = this.value;
        const errorElement = this.nextElementSibling;
        if (!value) return;

        const hoy = new Date();
        const nacimiento = new Date(value);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const m = hoy.getMonth() - nacimiento.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }

        if (edad < 12) {
            errorElement.textContent = 'Debes tener al menos 12 años para registrarte';
            this.classList.add('invalid');
        } else {
            errorElement.textContent = '';
            this.classList.remove('invalid');
        }
    }

    password.addEventListener('input', validatePassword);
    email.addEventListener('input', validateEmail);
    fechaNacimiento.addEventListener('change', validateEdad);
    
});

document.getElementById("registerForm").addEventListener("submit", async e => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const res = await fetch("Public/php/api.php?endpoint=register", {
        method: "POST",
        body: formData
    });

    const data = await res.json(); // Ahora JSON correcto
    alert(data.message);
    if (data.success) window.location.href = "index.html";
});

//Contraseña1&