//Mensaje de bienvenida
const mainIncio = document.getElementById("seccion-mensajes");

const tituloInicial = document.getElementById("mensaje-bienvenida");
tituloInicial.textContent = "Simulador de Repartos";

const guiaInicial = document.querySelector(".mensaje-guia");
guiaInicial.innerText = `Bienvenidos!
                        Agilice su jornada laboral con nuestro simulador, es una herramienta diseñada para llevar un registro seguro y eficiente de sus operaciones. 
                        Aquí podrán cargar los datos de sus remitos/facturas para organizar sus recaudaciones de forma eficiente.
                        El sistema calculará el total de sus paquetes, les permitirá seleccionar las formas de pago y les mostrará el monto final a rendir.
                        Muy pronto integraremos nuevas soluciones para seguir acompañando y mejorardo su actividas día a día.
                        Gracias por elegirnos.`

const mensajeInicio = document.querySelector(".mensaje-Inicio");
mensajeInicio.textContent = "Para ingresar coloque la ID y la Contraseña Habilitada."

mainIncio.prepend(tituloInicial, guiaInicial, mensajeInicio);


//Menu
const repartosMenu =  [ 'Registro', 'Cobranzas', 'Informes', 'Ruta'];
const boxIngreso = document.querySelector("#box-seccion");
function processMenu(opciones) {
    boxIngreso.innerHTML = "";
    opciones.forEach((fila) => { 
        const itemHtml = `<li><a href="#" onclick="cambiarAyuda('${fila.trim()}')">${fila.trim()}</a></li>`;

    boxIngreso.innerHTML += itemHtml;
});
}

const guiasMenu = {
    'Registro': 'Añade los remitos/facturas colocando el numero, el nombre, la dirección y el monto final. Estos datos se reflejaran en la tabla inferior. Si cometes un error, usa el botón rojo para eliminarlos y volver a ingresar los datos nuevamente.',
    'Cobranzas': 'Gestiona el estado de tus entregas y los pagos recibidos. Los descuentos se aplicaran según la forma de pago indicada y se reflejará el monto final en la columna "Final".',
    'Informes': 'Revisa el reporte de tus entregas y el dinero recaudado según el método de pago seleccionado.',
    'Ruta': 'Consulta tu ruta y el orden para optimizado tus entregas.',
};

function cambiarAyuda(seccion) {
    const mensajeGuia = document.querySelector("#texto-ayuda"); 
    if (mensajeGuia && guiasMenu[seccion]) {
        mensajeGuia.innerText = guiasMenu[seccion];
    }
};



//Aqui trabajo mi acceso con los datos necesarios para cada id y password
const inputID = document.getElementById('ID');
const inputPassword = document.getElementById('password');
const ingreso = document.getElementById('boton');
//buscador 
const cajaBuscador = document.getElementById("container-buscador")
const itemBusqueda = document.getElementById("buscador-Item");

ingreso.addEventListener('click', async function acceso(e){

    e.preventDefault();

const ingresoId = Number(inputID.value); 
const ingresoPassword = Number(inputPassword.value);

try {
    const response = await fetch("./usuarios.json");

    if (!response.ok) {
    throw new Error("Usuario y/o contraseña incorrectos");
    }

    const usuarios = await response.json();

    const usuarioFree = usuarios.find((user) => user.id === ingresoId && user.password === ingresoPassword);

    if (!usuarioFree) {
    throw new Error("Usuario y/o contraseña incorrectos");
    }

                    //aviso espontaneo de ingreso
                    const mainMensaje = document.querySelector('main');
                    mainMensaje.innerHTML =``;

                    const avisoExito = document.createElement("div");
                    avisoExito.className = "mensaje-espontaneo";
                    avisoExito.innerHTML = `¡Bienvenido! Ya puedes empezar a cargar los datos de tus repartos en el item 'Registro'.`;
                    mainMensaje.prepend(avisoExito);

                    setTimeout(() => {
                    avisoExito.remove();
                    }, 3000)

                    //guia
                    document.getElementById("caja-Ayuda").style.display = "block";
                    processMenu(repartosMenu);
                    cambiarAyuda('Registro'); 

                    //indicaciones del buscador
                    cajaBuscador.style.display = "flex";

        itemBusqueda.addEventListener("input", () => {
            const texto = itemBusqueda.value.toLowerCase().trim();
            const fila = tabla1.querySelectorAll("tr");

            fila.forEach((fila) =>{
                const containerFila = fila.innerText.toLowerCase();

        if (containerFila.includes(texto)) {
            fila.style.display = "";
        } else {
            fila.style.display = "none";
        }
    });
});
} catch (error) {
        const formInicial = document.querySelector('.form-Ingreso');
        const mainAviso = document.querySelector('main');
    //Oculta el formulario
    if (formInicial) {
    formInicial.style.display = "none";
    }
  // Busca un contenedor para el aviso 
    let boxAviso = document.querySelector('#aviso-error');
    if (!boxAviso) {
    boxAviso = document.createElement('div');
    boxAviso.id = 'aviso-error';
    mainAviso.appendChild(boxAviso);
    }

        boxAviso.className = "mensaje-denegado";

        let cuentaRegresiva = 5;
        boxAviso.innerHTML = `ACCESO DENEGADO: Los datos ingresados son incorrectos. El formulario reaparecerá en: <strong>${cuentaRegresiva}</strong>s.`;
  // Intervalo
        const conteo = setInterval(() => {
        cuentaRegresiva--;

        if (cuentaRegresiva > 0) {
        boxAviso.innerHTML = `ACCESO DENEGADO: Los datos ingresados son incorrectos. El formulario reaparecerá en: <strong>${cuentaRegresiva}</strong>s.`;
        } else {
        clearInterval(conteo);
      // Eliminamos el mensaje de aviso
        boxAviso.remove();

        if (formInicial) {
        formInicial.style.display = "flex";
        }

        const inputID = document.getElementById('ID');
        const inputPassword = document.getElementById('password');
        if (inputID) inputID.value = "";
        if (inputPassword) inputPassword.value = "";
        }
    }, 1000);
}
finally{
    document.querySelector('.form-Ingreso').reset();
}
});


//Registro de remitos
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

        const estadoGuardado = remito.estado || "";
        
        const finalGuardado = remito.final !== undefined ? `$${remito.final.toFixed(2)}` : "-";

        const bloquePago = `
            <tr>
                <td>${remito.numero}</td>
                <td>$${remito.monto}</td>
                <td>
                    <select id="estado-${index} class="caja-seleccion1">
                        <option value="">Seleccionar...</option>
                        <option value="En ruta" ${estadoGuardado === "En ruta" ? "selected" : ""}>En Ruta</option>
                        <option value="Entregado" ${estadoGuardado === "Entregado" ? "selected" : ""}>Entregado</option>
                        <option value="No Entregado" ${estadoGuardado === "No Entregado" ? "selected" : ""}>No Entregado</option>
                    </select>
                </td>
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
    }

    columnaFinal.innerHTML = `<strong>$${precioACalcular.toFixed(2)}</strong>`;

    const datosCobranzas = localStorage.getItem("Datos Lista");
    if (datosCobranzas) {
    const listaCobranzas = JSON.parse(datosCobranzas);
    if (listaCobranzas[index]) {
    listaCobranzas[index].formaPago = formaDePago;
    listaCobranzas[index].final = Number(precioACalcular.toFixed(2));
    
    // Eliminamos o ajustamos celdaIndicada para evitar el ReferenceError
        listaCobranzas[index].estado = "Actualizado";
        localStorage.setItem("Datos Lista", JSON.stringify(listaCobranzas));
    }
    }
}

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

        totalFinal += monto;

    if (resumen.formaPago === "Efectivo") {
        totalEfectivo += monto;
        totalNoEntregado += monto;
    } else if (resumen.formaPago === "Transferencia" || resumen.formaDePago === "Regresa") {
        totalTransf += monto;
    } else if (resumen.formaPago === "Cta. Corriente") {
        totalCtaCte += monto;
    } 

    if (resumen.estado === "No Entregado" || resumen.noentregado > 0) {
        totalNoEntregado += Number(resumen.noentregado) || monto;
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

//Ruta

document.addEventListener("click", (e) => {
    if (e.target.textContent.trim() === "Ruta") {
    
    e.preventDefault(); 
    
    const seccionReportes = document.querySelector("");
    if (seccionReportes) {
        seccionReportes.style.display = (seccionReportes.style.display === "block") ? "none" : "block";

        if (seccionReportes.style.display === "block") tablaReportes();
    }
}
});
