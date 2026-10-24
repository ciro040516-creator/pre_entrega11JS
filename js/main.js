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
    const response = await fetch("./data/usuarios.json");

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

