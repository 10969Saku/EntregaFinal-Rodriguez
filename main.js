// Productos
const productos = [
  { 
    id: 1, 
    nombre: "Tarjeta Gráfica", 
    precio: 500,
    descripcion: "Tarjeta gráfica RTX 4060, alto rendimiento para gaming y diseño.",
    imagen: "componentes/tarjeta-grafica.jpg"
  },
  { 
    id: 2, 
    nombre: "Procesador", 
    precio: 300,
    descripcion: "Intel Core i5 12400F, 6 núcleos, excelente rendimiento para tareas exigentes.",
    imagen: "componentes/procesador.jpg"
  },
  { 
    id: 3, 
    nombre: "Memoria RAM", 
    precio: 90,
    descripcion: "Memoria RAM Corsair RGB, 16GB DDR4, iluminación personalizable.",
    imagen: "componentes/memoria-ram.jpg"
  }
];

// Guarda los productos que se agregan al carrito en localStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const iva = 0.22;

// Muestra el formulario de usuario o el saludo si ya ingresó datos
function mostrarFormularioUsuario() {
  const saludoDiv = document.getElementById("saludo");
  const datosUsuario = JSON.parse(localStorage.getItem("usuario"));

  if (datosUsuario) {
    saludoDiv.innerHTML = `<p>Hola <strong>${datosUsuario.nombre}</strong>, bienvenido a ZonaGaming.<br>
    Tel: ${datosUsuario.telefono} | Envío: ${datosUsuario.lugar}</p>`;
    document.getElementById("formUsuario").style.display = "none";
    return;
  }

  // Los datos del usuario se guardan en localStorage
  document.getElementById("formUsuario").addEventListener("submit", e => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
    const lugar = document.getElementById("lugar").value;

    const usuario = { nombre, telefono, lugar };
    localStorage.setItem("usuario", JSON.stringify(usuario));
    mostrarFormularioUsuario();
  });

  // No permite que se ingresen letras en el campo teléfono
  const inputTelefono = document.getElementById("telefono");
  inputTelefono.addEventListener("input", () => {
    inputTelefono.value = inputTelefono.value.replace(/\D/g, "");
  });
}

// Muestra productos completos
function mostrarProductos() {
  const lista = document.getElementById("listaProductos");
  lista.innerHTML = "";
  productos.forEach(prod => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p>${prod.descripcion}</p>
      <p>Precio: U$D${prod.precio}</p>
      <button>Agregar al carrito</button>
    `;
    div.querySelector("button").addEventListener("click", () => {
      agregarAlCarrito(prod.id);
      mostrarMensaje(`Agregaste ${prod.nombre} al carrito`, "exito");
    });
    lista.appendChild(div);
  });
}

// Agregar productos al carrito
function agregarAlCarrito(id) {
  const prod = productos.find(p => p.id === id);
  carrito.push(prod);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

// Quitar productos del carrito con botón
function quitarDelCarrito(index) {
  const prod = carrito[index];
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
  mostrarMensaje(`Quitaste ${prod.nombre} del carrito`, "exito");
}

// Carrito
function mostrarCarrito() {
  const ul = document.getElementById("carritoLista");
  ul.innerHTML = "";
  carrito.forEach((prod, idx) => {
    const li = document.createElement("li");
    li.textContent = `${prod.nombre} - U$D${prod.precio}`;
    const btn = document.createElement("button");
    btn.textContent = "Quitar";
    btn.addEventListener("click", () => quitarDelCarrito(idx));
    li.appendChild(btn);
    ul.appendChild(li);
  });
  mostrarResumen();
}

// Función para resumen de compra
function mostrarResumen() {
  const resumen = document.getElementById("resumenCompra");
  if (carrito.length === 0) {
    resumen.textContent = "El carrito está vacío.";
    return;
  }
  let subtotal = carrito.reduce((acc, prod) => acc + prod.precio, 0);
  let impuestos = subtotal * iva;
  let total = subtotal + impuestos;
  resumen.innerHTML = `
    <p>Subtotal: U$D${subtotal}</p>
    <p>IVA: U$D${impuestos.toFixed(2)}</p>
    <p><strong>Total: U$D${total.toFixed(2)}</strong></p>
  `;
}

// Finalizar compra
function finalizarCompra() {
  if (carrito.length === 0) {
    mostrarMensaje("El carrito está vacío. No hay productos para comprar.", "error");
    return;
  }
  localStorage.removeItem("carrito");
  carrito = [];
  mostrarCarrito();
  mostrarMensaje("¡Gracias por comprar en ZonaGaming!", "exito");
}

// Mensajes
function mostrarMensaje(msg, tipo = "exito") {
  let mensajeDiv = document.getElementById("mensajeCarrito");
  if (!mensajeDiv) {
    mensajeDiv = document.createElement("div");
    mensajeDiv.id = "mensajeCarrito";
    document.querySelector("section:nth-of-type(3)").appendChild(mensajeDiv);
  }

  mensajeDiv.textContent = msg;
  mensajeDiv.className = tipo;

  setTimeout(() => {
    mensajeDiv.textContent = "";
    mensajeDiv.className = "";
  }, 3000);
}

// Botones
document.getElementById("finalizarBtn").addEventListener("click", finalizarCompra);
document.getElementById("limpiarBtn").addEventListener("click", () => {
  localStorage.clear();
  carrito = [];
  location.reload();
});

// Funciones iniciales
mostrarFormularioUsuario();
mostrarProductos();
mostrarCarrito();
