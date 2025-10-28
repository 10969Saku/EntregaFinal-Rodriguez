import { mostrarProductos, mostrarCarrito, mostrarResumen, mostrarMensaje } from "./ui.js";

let productos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const iva = 0.22;

// Carga los productos desde el archivo JSON
async function cargarProductos() {
  try {
    const respuesta = await fetch("componentes/productos.json");
    if(!respuesta.ok) throw new Error("Error al cargar productos");
    productos = await respuesta.json();

    mostrarProductos(productos, agregarAlCarrito);
    mostrarCarrito(carrito, quitarDelCarrito);
    mostrarResumen(carrito, iva);
  } catch(error) {
    mostrarMensaje("No se pudieron cargar los productos", "error");
    console.error(error);
  }
}

// Formulario para el ingreso de usuario
function mostrarFormularioUsuario() {
  const saludoDiv = document.getElementById("saludo");
  const datosUsuario = JSON.parse(localStorage.getItem("usuario"));

  if(datosUsuario) {
    saludoDiv.innerHTML = `<p>Hola <strong>${datosUsuario.nombre}</strong>, bienvenido a ZonaGaming.<br>
    Tel: ${datosUsuario.telefono} | Envío: ${datosUsuario.lugar}</p>`;
    document.getElementById("formUsuario").style.display = "none";
    return;
  }

  document.getElementById("formUsuario").addEventListener("submit", e => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value.replace(/\D/g,"");
    const lugar = document.getElementById("lugar").value;

    const usuario = { nombre, telefono, lugar };
    localStorage.setItem("usuario", JSON.stringify(usuario));
    mostrarFormularioUsuario();
  });
}

// Carrito de compras
function agregarAlCarrito(id) {
  const prod = productos.find(p => p.id === id);
  const itemEnCarrito = carrito.find(p => p.id === id);

  if(itemEnCarrito) itemEnCarrito.cantidad++;
  else carrito.push({...prod, cantidad:1});

  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito(carrito, quitarDelCarrito);
  mostrarResumen(carrito, iva);
}

function quitarDelCarrito(idx) {
  const prod = carrito[idx];
  if(prod.cantidad > 1) prod.cantidad--;
  else carrito.splice(idx,1);

  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito(carrito, quitarDelCarrito);
  mostrarResumen(carrito, iva);
}

// Finaliza la compra, limpia el carrito y el formulario
function finalizarCompra() {
  if(carrito.length === 0){
    mostrarMensaje("El carrito está vacío", "warning");
    return;
  }

  Swal.fire({
    title: "Confirmar compra",
    text: "¿Deseas finalizar tu compra?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, comprar",
    cancelButtonText: "Cancelar"
  }).then(result => {
    if(result.isConfirmed){
      localStorage.removeItem("carrito");
      localStorage.removeItem("usuario");
      carrito = [];
      mostrarCarrito(carrito, quitarDelCarrito);
      mostrarResumen(carrito, iva);
      document.getElementById("formUsuario").reset();
      document.getElementById("formUsuario").style.display = "block";
      document.getElementById("saludo").innerHTML = "";
      mostrarMensaje("¡Gracias por comprar en ZonaGaming!", "success");
    }
  });
}

// Buscador y filtro de productos
const inputBuscador = document.getElementById("buscador");
const filtroCategoria = document.getElementById("filtroCategoria");

function filtrarProductos() {
  const texto = inputBuscador.value.toLowerCase();
  const categoria = filtroCategoria.value;

  const filtrados = productos.filter(prod => {
    const coincideTexto = prod.nombre.toLowerCase().includes(texto) || prod.descripcion.toLowerCase().includes(texto);
    const coincideCategoria = categoria === "todas" || prod.categoria === categoria;
    return coincideTexto && coincideCategoria;
  });

  mostrarProductos(filtrados, agregarAlCarrito);
}

inputBuscador.addEventListener("input", filtrarProductos);
filtroCategoria.addEventListener("change", filtrarProductos);

// Botones del carrito
document.getElementById("finalizarBtn").addEventListener("click", finalizarCompra);
document.getElementById("limpiarBtn").addEventListener("click", ()=>{
  localStorage.clear();
  carrito = [];
  location.reload();
});

// Carrito que se abre y cierra
const toggleBtn = document.getElementById("toggleCarrito");
const carritoBody = document.getElementById("carritoBody");
let carritoMinimizado = false;

toggleBtn.addEventListener("click", () => {
  carritoMinimizado = !carritoMinimizado;
  carritoBody.style.display = carritoMinimizado ? "none" : "block";
  toggleBtn.textContent = carritoMinimizado ? "+" : "-";
});

// Inicio
mostrarFormularioUsuario();
cargarProductos();
