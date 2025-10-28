

export function mostrarProductos(productos, agregarAlCarrito){
  const lista = document.getElementById("listaProductos");
  lista.innerHTML = "";

  productos.forEach(prod=>{
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p>${prod.descripcion}</p>
      <p>Precio: U$D${prod.precio}</p>
      <button>Agregar al carrito</button>
    `;
    div.querySelector("button").addEventListener("click", ()=>{
      agregarAlCarrito(prod.id);
      mostrarMensaje(`Agregaste ${prod.nombre} al carrito`, "success");
    });
    lista.appendChild(div);
  });
}

export function mostrarCarrito(carrito, quitarDelCarrito){
  const ul = document.getElementById("carritoLista");
  ul.innerHTML = "";

  carrito.forEach((prod, idx)=>{
    const li = document.createElement("li");
    li.innerHTML = `${prod.nombre} - U$D${prod.precio} (x${prod.cantidad}) = <strong>U$D${(prod.precio*prod.cantidad).toFixed(2)}</strong>`;
    const btn = document.createElement("button");
    btn.textContent = "Quitar";
    btn.addEventListener("click", ()=>{
      quitarDelCarrito(idx);
      mostrarMensaje(`Quitaste ${prod.nombre} del carrito`, "info");
    });
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

export function mostrarResumen(carrito, iva = 0.22){
  const resumen = document.getElementById("resumenCompra");
  if(carrito.length === 0){
    resumen.textContent = "El carrito está vacío.";
    return;
  }

  let subtotal = carrito.reduce((acc, p)=> acc + p.precio*p.cantidad, 0);
  let impuestos = subtotal*iva;
  let total = subtotal + impuestos;

  resumen.innerHTML = `
    <p>Subtotal: U$D${subtotal.toFixed(2)}</p>
    <p>IVA: U$D${impuestos.toFixed(2)}</p>
    <p><strong>Total: U$D${total.toFixed(2)}</strong></p>
  `;
}

export function mostrarMensaje(texto, tipo="success"){
  Swal.fire({
    text: texto,
    icon: tipo,
    timer: 2000,
    showConfirmButton: false,
    position: "bottom-end",
    toast: true
  });
}
