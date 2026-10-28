//Registro de Remitos
const remitoList = localStorage.getItem("Datos Lista");
if (remitoList === null || remitoList === undefined) {
    const remitoEntrega = [];
    localStorage.setItem("Datos Lista", JSON.stringify(remitoEntrega));
}

const tabla1 = document.getElementById("lista-general");
function tablaActual() {

    if (!tabla1) return; 
    tabla1.innerHTML = "";

const datosRemito = localStorage.getItem("Datos Lista");
    if (!datosRemito) return;
    const listaName = JSON.parse(datosRemito);

    listaName.forEach((dato, index) => {
    const bloqueRemito = `
        <tr class="menu-item">
        <td>${dato.numero}</td>
        <td>${dato.nombre}</td>
        <td>${dato.direccion}</td>
        <td>${dato.monto !== "-" ? '$' + dato.monto : "-"}</td>
        <td>
            <button onclick="borrarRemito(${index})" class="btn-eliminar">X</button>
        </td>
    </tr>
    `;
    tabla1.innerHTML += bloqueRemito;
    });
}


    document.addEventListener("click", (e) => {
    if (e.target.textContent.trim() === "Registro") {
    
    e.preventDefault(); 
    
    const seccionTabla = document.querySelector(".tabla1");
    const nuevoIngreso = document.querySelector(".tabla-remito")
    if (seccionTabla) {
        if (seccionTabla.style.display === "block"){
        seccionTabla.style.display = "none";

        if(nuevoIngreso) nuevoIngreso.style.display = "none";

        localStorage.setItem("verTabla", "no");

    }else{
        seccionTabla.style.display = "block";
        tablaActual();

        if(nuevoIngreso) nuevoIngreso.style.display = "block";
}
}
}
});

localStorage.setItem("verTabla", "no");

//funcion para borrar
function borrarRemito(fila) {
    const listaActual = JSON.parse(localStorage.getItem("Datos Lista"));

        listaActual.splice(fila, 1);

        localStorage.setItem("Datos Lista", JSON.stringify(listaActual));

    tablaActual();
}

//form para agregar nuevos datos 
function añadirRemito(e) {
    if (e) e.preventDefault();

try{
    const newRemito = {
    numero: document.getElementById("nuevoNumero").value.trim(),
    nombre: document.getElementById("nuevoNombre").value.trim(),
    direccion: document.getElementById("nuevaDireccion").value.trim(),
    monto: document.getElementById("nuevoMonto").value.trim()
    };

    const { numero, nombre, direccion, monto } = newRemito;
    if (!numero || !nombre || !direccion || !monto) {
    throw new Error("Todos los campos son obligatorios.");
    }

const listaActual = JSON.parse(localStorage.getItem("Datos Lista")) || [];
listaActual.push(newRemito);

localStorage.setItem("Datos Lista", JSON.stringify(listaActual));

tablaActual();

const avisoExito = document.getElementById("mensaje-exito");
    if (avisoExito) {

    Swal.fire({
    title: "Ingreso de datos exitoso",
    text: "Los datos se han guardado correctamente",
    icon: "success"
    });

        setTimeout(() => {
            avisoExito.innerText = ""; 
        }, 3000); 
    }

} catch (error) {
        const avisoExito = document.getElementById("mensaje-exito");
        if (avisoExito) {
            avisoExito.innerText = `⚠️ Error: ${error.message}`;
        }

} finally {
        document.getElementById("nuevoNumero").value = "";
        document.getElementById("nuevoNombre").value = "";
        document.getElementById("nuevaDireccion").value = "";
        document.getElementById("nuevoMonto").value = "";

}
};

window.añadirRemito = añadirRemito;


//Menu de cobranzas 
function tablaCobranzas() {
    const tabla2 = document.getElementById("cobranzas-general");
    if (!tabla2) return; 
    tabla2.innerHTML = "";

const datosCobranzas = localStorage.getItem("Datos Lista");
    if (!datosCobranzas) return;
    const listaPago = JSON.parse(datosCobranzas);

    listaPago.forEach((remito, index) => {
        const pagoGuardado = remito.formaPago || "";
        
        const finalGuardado = remito.final !== undefined ? `$${remito.final.toFixed(2)}` : "-";

        const bloquePago = `
            <tr>
                <td>${remito.numero}</td>
                <td>$${remito.monto}</td>
                <td>
                    <select id="pago-${index}" onchange="descuentoAplicado(${index}, ${remito.monto})" class="caja-seleccion">
                        <option value="">Seleccionar...</option>
                        <option value="Efectivo" ${pagoGuardado === "Efectivo" ? "selected" : ""}>Efect.</option>
                        <option value="Transferencia" ${pagoGuardado === "Transferencia" ? "selected" : ""}>Transf./MP</option>
                        <option value="Cta. Corriente" ${pagoGuardado === "Cta. Corriente" ? "selected" : ""}>Cta. Cte</option>
                        <option value="Regresa" ${pagoGuardado === "Regresa" ? "selected" : ""}>Regresa</option>
                    </select>
                </td>
                <td id="final-${index}"><strong>${finalGuardado}</strong></td>
            </tr>`;
        tabla2.innerHTML += bloquePago;
    });
}

    document.addEventListener("click", (e) => {
    if (e.target.textContent.trim() === "Cobranzas") {
    
    e.preventDefault(); 
    
    const seccionCobranzas = document.querySelector(".tabla2");
    if (seccionCobranzas) {
        seccionCobranzas.style.display = (seccionCobranzas.style.display === "block") ? "none" : "block";

        if (seccionCobranzas.style.display === "block") tablaCobranzas();
    }
}
});

//seccion de calcular la forma de pagos
function descuentoAplicado(index, montoInicial) {
    const selectPago = document.getElementById(`pago-${index}`);
    const columnaFinal = document.getElementById(`final-${index}`);

    if (!selectPago || !columnaFinal) return;
    
    const formaDePago = selectPago.value;
    if (!formaDePago) {
    columnaFinal.innerText = "-";
    return;
    }

    const precioInicial = Number(montoInicial);
    let precioACalcular = precioInicial;

    if (formaDePago === "Efectivo") {
    precioACalcular = precioInicial * 0.90;
    } else if (formaDePago === "Transferencia") {
    precioACalcular = precioInicial;
    } else if (formaDePago === "Cta. Corriente") {
    precioACalcular = precioInicial * 1.10;
    } else if (formaDePago === "Regresa"){
        precioACalcular = precioInicial;
    }

    columnaFinal.innerHTML = `<strong>$${precioACalcular.toFixed(2)}</strong>`;

    const datosCobranzas = localStorage.getItem("Datos Lista");
    if (datosCobranzas) {
    const listaCobranzas = JSON.parse(datosCobranzas);
    if (listaCobranzas[index]) {
    listaCobranzas[index].formaPago = formaDePago;
    listaCobranzas[index].final = Number(precioACalcular.toFixed(2));
        localStorage.setItem("Datos Lista", JSON.stringify(listaCobranzas));
    }
}
};

//registro de informes/reportes
function tablaReportes() {
    const tabla3 = document.getElementById("reporte-general");
    if (!tabla3) return; 
    tabla3.innerHTML = "";

const datosReporte = localStorage.getItem("Datos Lista");
    if (!datosReporte) return;
    const listaReporte = JSON.parse(datosReporte);

let totalEfectivo = 0;
let totalTransf = 0;
let totalCtaCte = 0;
let totalNoEntregado = 0; 
let totalFinal = 0;

    listaReporte.forEach((resumen) => {
        const monto = Number(resumen.final) || 0;
        const pedidoNoEntregado = Number(resumen.noentregado) || 0;

        totalFinal += monto;

    if (resumen.formaPago === "Efectivo") {
        totalEfectivo += monto;
    } else if (resumen.formaPago === "Transferencia") {
        totalTransf += monto;
    } else if (resumen.formaPago === "Cta. Corriente") {
        totalCtaCte += monto;
    } else if (resumen.formaPago === "Regresa") {
        totalNoEntregado += monto;
    }
    });
    
    const filaUnica = `
    <tr>
        <td>$${totalEfectivo.toFixed(2)}</td>
        <td>$${totalTransf.toFixed(2)}</td>
        <td>$${totalCtaCte.toFixed(2)}</td>
        <td>$${totalNoEntregado.toFixed(2)}</td>
        <td>$${totalFinal.toFixed(2)}</td>
    </tr>
    `;
tabla3.innerHTML += filaUnica;
};

document.addEventListener("click", (e) => {
    if (e.target.textContent.trim() === "Informes") {
    
    e.preventDefault(); 
    
    const seccionReportes = document.querySelector(".tabla3");
    if (seccionReportes) {
        seccionReportes.style.display = (seccionReportes.style.display === "block") ? "none" : "block";

        if (seccionReportes.style.display === "block") tablaReportes();
    }
}
});

//Observaciones
document.addEventListener("click", (e) => {
    if (e.target.textContent.trim() === "Observaciones") {
    
    e.preventDefault(); 
    
    const seccionObservac = document.querySelector("#contenedor-observaciones");
    if (seccionObservac) {
        seccionObservac.style.display = (seccionObservac.style.display === "block") ? "none" : "block";

        if (seccionObservac.style.display === "block");
    }
}
});

//Añadir observaciones
function añadirObservac(e) {
    e.preventDefault();

    const formObservac = document.getElementById('registroObservac');
    const textareaGuardar = document.getElementById('caja-texto');
    const textoGuardado = document.getElementById('textoGuardado');
    const observaciones = textareaGuardar.value.trim();

    if (observaciones !== "") {

        if (textoGuardado.innerHTML === "") {
            textoGuardado.innerHTML = observaciones;
        } else {
            textoGuardado.innerHTML += "<br>" + observaciones;
        }
        localStorage.setItem('notasDeReparto', textoGuardado.innerHTML);
        formObservac.reset();

    Swal.fire({
    title: "Ingreso de datos exitoso",
    text: "Los datos se han guardado correctamente",
    icon: "success"
    });

        setTimeout(() => {
            if (typeof avisoExito !== 'undefined') avisoExito.innerText = "";
        }, 3000); 
    
    } else {
        Swal.fire({
            title: "Error",
            text: "Por favor, ingrese un texto antes de guardar.",
            icon: "error"
        });
    }
};
window.añadirObservac = añadirObservac;

document.addEventListener('DOMContentLoaded', () => {
    const textoGuardado = document.getElementById('textoGuardado');
    const notasAlmacenadas = localStorage.getItem('notasDeReparto');
    
    if (notasAlmacenadas && textoGuardado) {
        textoGuardado.innerHTML = notasAlmacenadas;
    }
});

//Enviar observaciones
window.enviarObservac = function(e) {
    if (e) e.preventDefault();

    Swal.fire({
    title: "Ingrese e-mail para enviar las observaciones:",
    input: "email",
    inputPlaceholder: "ejemplo@correo.com",
    showCancelButton: true,
    confirmButtonText: "Siguiente",
    cancelButtonText: "Cancelar"
    }).then((inputResult) => {
    if (!inputResult.isConfirmed) return;

    let ingresarMail = inputResult.value ? inputResult.value.trim() : "";
    const validacionEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!ingresarMail|| !validacionEmail.test(ingresarMail)) {
        Swal.fire({
        icon: "error",
        title: "Correo inválido",
        text: "Por favor, introduce una dirección de correo electrónico correcta."
    });
    return;
}
    const textoGuardado = document.getElementById('textoGuardado');
    Swal.fire({
    title: `Las observaciones se enviará al correo: ${ingresarMail}. Desea confirmar envio?`,
    icon: "question",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Enviar",
    denyButtonText: "No enviar"
}).then((result) => {
    
    if (result.isConfirmed) {

        if (textoGuardado) {
        textoGuardado.innerHTML = "";
        }
        localStorage.removeItem('notasDeReparto');

        Swal.fire("¡Enviado!", "success");

    } else if (result.isDenied) {
        Swal.fire("No se envió la información", "", "info");
    }
    });
})
};

//Borrar observaciones
function borrarObservac(e) {
    if (e) e.preventDefault();

    const textoGuardado = document.getElementById('textoGuardado');

    if (textoGuardado) {
        textoGuardado.innerHTML = "";
    }

    localStorage.removeItem('notasDeReparto');
};
window.borrarObservac = borrarObservac;




