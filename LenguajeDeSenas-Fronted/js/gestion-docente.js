// ==============================================
// LÓGICA DE CARGA DE DATOS Y AUTOCLOMPLETE
// ==============================================

export async function cargarUsuarios() {
    const res = await fetch("https://localhost:7061/api/Usuarios");
    const usuarios = await res.json();
    // La función renderizarUsuarios (si existe) se ejecutaría aquí.
}

async function cargarDocentes() {
    const res = await fetch("https://localhost:7061/api/Docentes");
    const docentes = await res.json();

    const tabla = document.getElementById("tablaDocentes");
    tabla.innerHTML = "";

    docentes.forEach(d => {
        const fila = document.createElement("tr");

        const fechaNacimiento = d.fechaNacimiento 
            ? new Date(d.fechaNacimiento).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) 
            : 'N/A';
        
        const telefono = d.telefono || 'N/A';
        let cvContent = 'N/A'; 
        
        if (d.cvUrl) {
            cvContent = `
                <a href="${d.cvUrl}" target="_blank" download class="btn-cv-download">
                    Descargar CV
                </a>
            `;
        }

        fila.innerHTML = `
            <td>${d.usuario.nombre}</td>
            <td>${d.usuario.email}</td>
            <td>${d.dni}</td> 
            <td>${d.especialidad}</td>
            
            <td>${d.tituloDocente}</td> 
            <td>${fechaNacimiento}</td>
            <td>${telefono}</td>
            
            <td>${cvContent}</td> 
            
            <td> 
                <button onclick="eliminarDocente(${d.idDocente})" class="btn-delete">Eliminar</button>
            </td>
        `;

        tabla.appendChild(fila);
    });
}


let listaUsuarios = [];

async function prepararAutocomplete() {
    const res = await fetch("https://localhost:7061/api/Usuarios");
    const usuarios = await res.json();

    listaUsuarios = usuarios.filter(u => u.rol !== "Docente");

    const input = document.getElementById("buscarUsuario");
    const box = document.getElementById("listaUsuarios");

    input.addEventListener("input", () => {
        const texto = input.value.toLowerCase().trim();
        box.innerHTML = "";

        if (texto.length === 0) {
            box.style.display = "none";
            return;
        }

        const filtrados = listaUsuarios.filter(u =>
            u.nombre.toLowerCase().includes(texto) ||
            u.email.toLowerCase().includes(texto)
        );

        if (filtrados.length === 0) {
            box.style.display = "none";
            return;
        }

        filtrados.forEach(u => {
            const item = document.createElement("div");
            item.className = "autocomplete-item";
            item.textContent = `${u.nombre} (${u.email})`;

            item.addEventListener("click", () => {
                document.getElementById("buscarUsuario").value = `${u.nombre} (${u.email})`;
                document.getElementById("idUsuarioSeleccionado").value = u.idUsuario;
                box.style.display = "none";
            });

            box.appendChild(item);
        });

        box.style.display = "block";
    });
}


// ==============================================
// LÓGICA DE SUBMIT DEL FORMULARIO Y VALIDACIONES
// ==============================================

document.getElementById("formDocente").addEventListener("submit", async e => {
    e.preventDefault();

    const idUsuario = document.getElementById("idUsuarioSeleccionado").value;
    const dni = document.getElementById("dni").value;
    const telefono = document.getElementById("telefono").value; 
    
    if (!idUsuario) {
        alert("Debe seleccionar un usuario desde el buscador.");
        return;
    }
    
    // VALIDACIÓN DE DNI Y TELÉFONO
    if (!/^[0-9]+$/.test(dni) || dni.length < 7 || dni.length > 9) {
        alert("El DNI es inválido. Por favor, ingrese solo números (entre 7 y 9 dígitos).");
        return;
    }
    
    if (telefono) {
        if (!/^[0-9]+$/.test(telefono) || telefono.length < 7 || telefono.length > 10) {
            alert("El Teléfono es inválido. Por favor, ingrese solo números (entre 7 y 10 dígitos).");
            return;
        }
    }
    
    // LÓGICA DE NACIONALIDAD (Si se selecciona 'Otros', toma el valor del input de texto)
    const nacionalidadSeleccionada = document.getElementById("nacionalidad").value;
    const nacionalidadFinal = (nacionalidadSeleccionada === 'Otros' 
                               ? document.getElementById("otraNacionalidad").value 
                               : nacionalidadSeleccionada);

    if (nacionalidadSeleccionada === 'Otros' && !document.getElementById("otraNacionalidad").value.trim()) {
         alert("Por favor, especifique su Nacionalidad en el campo de texto.");
         return;
    }


    // Recolección de valores
    const nuevo = {
        idUsuario: parseInt(idUsuario),
        especialidad: document.getElementById("especialidad").value,
        
        DNI: dni, 
        Telefono: telefono || null, 
        Direccion: document.getElementById("direccion").value || null,
        FechaNacimiento: document.getElementById("fechaNacimiento").value,
        Nacionalidad: nacionalidadFinal || null, 
        EstadoCivil: document.getElementById("estadoCivil").value || null,
        TituloDocente: document.getElementById("tituloDocente").value,
        CvUrl: document.getElementById("cvUrl").value || null
    };

    if (!nuevo.DNI || !nuevo.TituloDocente || !nuevo.FechaNacimiento) {
        alert("Por favor, complete DNI, Fecha de Nacimiento y Título Docente.");
        return;
    }

    const res = await fetch("https://localhost:7061/api/Docentes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevo)
    });

    if (!res.ok) {
        let errorMessage = "Error al crear docente.";
        try {
            const errorData = await res.json();
            errorMessage = errorData.mensaje || errorData.title || res.statusText;
        } catch {
            errorMessage = `Error ${res.status}: Fallo al procesar la solicitud.`;
        }
        alert(errorMessage);
        return;
    }

    alert("Docente creado correctamente.");

    // Cierre del modal, recarga de datos y limpieza
    document.getElementById("modalDocente").style.display = "none";
    cargarDocentes();
    cargarUsuarios();         
    document.getElementById("formDocente").reset();
    document.getElementById("idUsuarioSeleccionado").value = ""; 
    document.getElementById("otraNacionalidadContainer").style.display = "none"; // Ocultar campo extra
});


// ==============================================
// ELIMINAR DOCENTE
// ==============================================

window.eliminarDocente = async function (id) {
    if (!confirm("¿Eliminar este docente? (Se degradará a Alumno)")) return;

    const res = await fetch(`https://localhost:7061/api/Docentes/${id}`, {
        method: "DELETE"
    });

    if (res.ok) {
        alert("Docente degradado a Alumno.");
        cargarDocentes();
        prepararAutocomplete(); 
    } else {
        console.error("Error al eliminar docente:", res.status);
        alert(`Error al eliminar docente. Código: ${res.status}`);
    }
};


 const btn = document.getElementById('toggleMenu');
  const aside = document.querySelector('.sidebar');

  btn.addEventListener('click', () => {
    aside.classList.toggle('open');
  });

// ==============================================
// LÓGICA DE INICIALIZACIÓN Y MODAL
// ==============================================

document.addEventListener("DOMContentLoaded", () => {
    cargarDocentes();
    prepararAutocomplete();
    
    // --- LÓGICA DEL MODAL ---
    const modal = document.getElementById("modalDocente");
    const btnAbrir = document.getElementById("abrirModalDocente");
    const btnCerrar = document.querySelector(".close-button");
    const form = document.getElementById("formDocente");

    // Abrir modal
    btnAbrir.onclick = function() {
        modal.style.display = "block";
        form.reset(); 
        document.getElementById("otraNacionalidadContainer").style.display = "none";
        document.getElementById("idUsuarioSeleccionado").value = ""; 
        document.getElementById("buscarUsuario").value = ""; 
    };

    // Cerrar modal con (x)
    btnCerrar.onclick = function() {
        modal.style.display = "none";
    };

    // Cerrar modal al hacer clic fuera
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };






    // --- LÓGICA DE VISIBILIDAD PARA EL CAMPO "OTRO PAÍS" ---
    const selectNacionalidad = document.getElementById('nacionalidad');
    const inputOtraNacionalidadContainer = document.getElementById('otraNacionalidadContainer');

    selectNacionalidad.addEventListener('change', () => {
        if (selectNacionalidad.value === 'Otros') {
            inputOtraNacionalidadContainer.style.display = 'block';
        } else {
            inputOtraNacionalidadContainer.style.display = 'none';
        }
    });
});