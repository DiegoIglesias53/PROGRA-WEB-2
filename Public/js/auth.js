// Public/js/Auth.js
class Auth {
    static isLoggedIn() {
        return localStorage.getItem("isLoggedIn") === "true";
    }

    static getUser() {
        if (!this.isLoggedIn()) {
            return null;
        }

        return {
            id: localStorage.getItem("userId"),
            name: localStorage.getItem("userName"),
            email: localStorage.getItem("userEmail")
        };
    }

    static setUserSession(name, email, id) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", name);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userId", id);
    }

    static logout() {
        localStorage.clear();
        window.location.href = "login.html";
    }

    // Método nuevo para actualizar los datos del usuario
    static updateUser(updatedData) {
        // Actualiza los datos en localStorage
        if (updatedData.nombre_completo) {
            localStorage.setItem("userName", updatedData.nombre_completo);
        }
        if (updatedData.correo) {
            localStorage.setItem("userEmail", updatedData.correo);
        }
        if (updatedData.id_usuario) {
            localStorage.setItem("userId", updatedData.id_usuario);
        }

        console.log("Datos del usuario actualizados en localStorage:", updatedData);
    }

    // Obtener datos desde la base de datos
    static async fetchUserProfile() {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                throw new Error("No user ID found");
            }

            const response = await fetch(`./Public/php/api.php?endpoint=userProfile&id=${userId}`);
            const data = await response.json();

            if (data.status === 'success') {
                return data.user;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }
}
