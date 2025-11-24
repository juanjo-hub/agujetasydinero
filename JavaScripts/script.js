/*PAUSA BOTÓN VIDEO - DIV1*/
const video = document.getElementById('bgVideo');
const pauseButton = document.getElementById('pauseButton');

if (video && pauseButton) {
  pauseButton.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      pauseButton.textContent = '⏸';
    } else {
      video.pause();
      pauseButton.textContent = '▶';
    }
  });
}
/*
SECCIÓN PREGUNTAS - DIV5
*/
const botonesPregunta = document.querySelectorAll(".btn-pregunta");
  botonesPregunta.forEach(boton => {
    boton.addEventListener("click", () => {
      const pregunta = boton.parentElement;
      pregunta.classList.toggle("activa");
    });
  });
/*
ASIDE: URL TIENDA - FILTROS Y ORDEN*/
function btnFiltro() {
  const tipoSeleccionado = document.getElementById('tipo').value;
  const contenedor = document.querySelector('.productos-grid');

  if (!contenedor) return;

  const productosNutricion = contenedor.querySelectorAll('.producto-nutricion');
  const productosAccesorios = contenedor.querySelectorAll('.producto-accesorios');

  // Ocultar todos
  productosNutricion.forEach(p => p.style.display = 'none');
  productosAccesorios.forEach(p => p.style.display = 'none');

  // Mostrar según filtro
  if (tipoSeleccionado === 'nutricion') {
    productosNutricion.forEach(p => p.style.display = 'block');
  } else if (tipoSeleccionado === 'accesorios') {
    productosAccesorios.forEach(p => p.style.display = 'block');
  } else if (tipoSeleccionado === 'todos') {
    productosNutricion.forEach(p => p.style.display = 'block');
    productosAccesorios.forEach(p => p.style.display = 'block');
  }

  const tipoOrden = document.getElementById('orden').value;
  ordenarPorPrecio(tipoOrden);
}

function ordenarPorPrecio(tipoOrden) {
  const contenedor = document.querySelector('.productos-grid');
  if (!contenedor) return;

  const productos = Array.from(contenedor.children).filter(p => p.style.display !== 'none');

  const obtenerPrecio = p => {
    const precioText = p.querySelector('.precio')?.textContent || '0';
    return parseFloat(precioText.replace('€', '').trim());
  };

  productos.sort((a, b) => {
    const precioA = obtenerPrecio(a);
    const precioB = obtenerPrecio(b);

    if (tipoOrden === 'caro') return precioB - precioA;
    if (tipoOrden === 'barato') return precioA - precioB;
    return 0;
  });

  productos.forEach(p => contenedor.appendChild(p));
}


/*
SCRIPT CARRUSEL URL: PLANES
*/
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  let index = 0;

  function showSlide(i) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[i].classList.add('active');
  }

  showSlide(index);

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
      index = (index + 1) % slides.length;
      showSlide(index);
    });

    prevBtn.addEventListener('click', () => {
      index = (index - 1 + slides.length) % slides.length;
      showSlide(index);
    });
  }
});


/*
SCRIPT H1/BOTÓN
*/
document.addEventListener("DOMContentLoaded", () => {
  const boton = document.querySelector('.btn-div-h1');
  const titulo = document.querySelector('.titulo'); 

  if (!boton || !titulo) return;

  boton.addEventListener('mouseenter', () => {
      titulo.style.color = '#b41271';
  });

  boton.addEventListener('mouseleave', () => {
      titulo.style.color = '#ffffffff';
  });
});


/*LÓGICA DEL CARRITO (CONSOLIDADA)*/
// --- 1. Funciones de Almacenamiento y Contador ---
function obtenerCarrito() {
  return JSON.parse(localStorage.getItem('carrito')) || {};
}

function guardarCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}
// Actualiza SOLO el contador del header
function actualizarContadorHeader() {
  const cantidadCarritoElement = document.getElementById('cantidad-carrito');
  if (!cantidadCarritoElement) return;

  let carrito = obtenerCarrito();
  let totalCantidad = Object.values(carrito).reduce((total, producto) => total + producto.cantidad, 0);
  cantidadCarritoElement.textContent = totalCantidad;
}

// --- 2. Lógica para la Página de Tienda (Añadir productos) ---

document.querySelectorAll('.productos-grid > div').forEach((productoDiv) => {
  // El botón y los detalles están dentro del .overlay, que está dentro de productoDiv
  const overlay = productoDiv.querySelector('.overlay');
  if (!overlay) return;
  
  const botonCarrito = overlay.querySelector('.carrito-btn');
  if (!botonCarrito) return;

  const descripcion = overlay.querySelector('.descripcion')?.textContent;
  const precioTexto = overlay.querySelector('.precio')?.textContent;
  
  // 🚨 CORRECCIÓN CLAVE: Obtener la URL del background-image
  let imagenURL = productoDiv.style.backgroundImage;
  
  // Limpiar la URL: Eliminar 'url("' y '")'
  if (imagenURL) {
    // Ejemplo: "url('Imagenes/Inicio/creatina.webp')" -> "Imagenes/Inicio/creatina.webp"
    imagenURL = imagenURL.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
  } else {
    // Si no tiene imagen de fondo, salimos o usamos una imagen de placeholder
    // En este caso, simplemente salimos si faltan datos
    return; 
  }

  if (!descripcion || !precioTexto) return;

  const precioNumero = parseFloat(precioTexto.replace(',', '.').replace('€', '').trim());

  // Inicializar el producto si el carrito está vacío en LocalStorage
  let carrito = obtenerCarrito();
  if (!carrito[descripcion]) {
    // Guarda la URL de la imagen (ahora limpia)
    carrito[descripcion] = { cantidad: 0, precio: precioNumero, imagen: imagenURL };
    guardarCarrito(carrito);
  } else if (typeof carrito[descripcion].precio !== 'number') {
    // Seguridad: Si se cargan datos antiguos, los corrige
    carrito[descripcion].precio = precioNumero;
    carrito[descripcion].imagen = imagenURL;
    guardarCarrito(carrito);
  }

  // Evento para agregar al carrito
  botonCarrito.addEventListener('click', () => {
    let carrito = obtenerCarrito();
    carrito[descripcion].cantidad++;
    
    guardarCarrito(carrito);
    actualizarContadorHeader();
  });
});


// --- 3. Lógica para la Página del Carrito (Mostrar productos y total) ---

const divProductosCarrito = document.getElementById('productos-carrito');

if (divProductosCarrito) {
  
  // Función para calcular el precio total y mostrarlo
  function calcularTotal() {
    let carrito = obtenerCarrito();
    
    let total = Object.values(carrito).reduce((total, producto) => {
      // Se asegura de que el precio sea un número
      let precioProducto = parseFloat(producto.precio) || 0;
      return total + (producto.cantidad * precioProducto);
    }, 0);

    let precioTotalElement = document.getElementById('precio-total');
    if (precioTotalElement) {
      precioTotalElement.textContent = `TOTAL: ${total.toFixed(2)}`;
    }
  }

// Función para mostrar los productos y asignar eventos
  function mostrarCarrito() {
    let productosCarrito = document.getElementById('productos-carrito');
    let mensajeCarrito = document.getElementById('mensaje-carrito');
    
    productosCarrito.innerHTML = '';
    let carrito = obtenerCarrito();
    let productosEnCarrito = Object.keys(carrito).filter(descripcion => carrito[descripcion].cantidad > 0);

    if (productosEnCarrito.length === 0) {
      mensajeCarrito.style.display = 'block';
    } else {
      mensajeCarrito.style.display = 'none';
      productosEnCarrito.forEach(descripcion => {
        let producto = carrito[descripcion];
        
        let precioMostrado = (parseFloat(producto.precio) || 0).toFixed(2);
        let subtotalProducto = (producto.cantidad * (parseFloat(producto.precio) || 0)).toFixed(2);

        let productoHTML = `
          <div class="producto-en-carrito">
                        
              <div class="img-producto">
              <img src="${producto.imagen}" alt="${descripcion}" class="imagen-carrito"></div>
              
                <div class="descripcion">${descripcion}</div>
                <div class="precio">Precio Unitario: ${precioMostrado}€</div>
            
           
                        <div class="cantidad">Cantidad: <span class="cantidad-numero">${producto.cantidad}</span></div>
            <div class="subtotal">Subtotal: ${subtotalProducto}€</div>
            
                        <div class="acciones">
              <button class="btn-cantidad btn-menos" data-descripcion="${descripcion}">-</button>
              <button class="btn-cantidad btn-mas" data-descripcion="${descripcion}">+</button>
            </div>
          </div>
        `;
        productosCarrito.innerHTML += productoHTML;
      });
    }
    // ... (El resto del código de eventos para + y - sigue aquí)

    // Re-asignar eventos a botones + y -
    document.querySelectorAll('.btn-menos').forEach(boton => {
      boton.addEventListener('click', () => {
        let descripcion = boton.getAttribute('data-descripcion');
        let carrito = obtenerCarrito();
        
        if (carrito[descripcion] && carrito[descripcion].cantidad > 0) {
          carrito[descripcion].cantidad--;
          guardarCarrito(carrito);
          actualizarPaginaCarrito();
        }
      });
    });

    document.querySelectorAll('.btn-mas').forEach(boton => {
      boton.addEventListener('click', () => {
        let descripcion = boton.getAttribute('data-descripcion');
        let carrito = obtenerCarrito();
        
        if (carrito[descripcion]) {
          carrito[descripcion].cantidad++;
          guardarCarrito(carrito);
          actualizarPaginaCarrito();
        }
      });
    });
  }

  // Función "maestra" para actualizar la vista completa del carrito
  function actualizarPaginaCarrito() {
    mostrarCarrito();
    calcularTotal();
    actualizarContadorHeader();
  }

  // Inicializar al cargar la página
  document.addEventListener('DOMContentLoaded', () => {
    actualizarPaginaCarrito();
  });
} else {
    // Si no estamos en la página del carrito, solo actualizamos el contador al cargar
    document.addEventListener('DOMContentLoaded', () => {
      actualizarContadorHeader();
    });

}
/*MENÚ HAMBURGUESA HEADER*/
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('header nav.main-nav');
  const toggle = document.querySelector('.nav-toggle');
  const icon = document.querySelector('.icon-menu'); // añadimos referencia al icono

  if (!nav || !toggle || !icon) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

    // única línea necesaria para cambiar a X
    icon.src = isOpen ? 'cerrar.svg' : 'hamburguesa.svg';
  });
});

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (!loader) return;

  loader.style.opacity = "0";

  setTimeout(() => {
    loader.style.display = "none";
  }, 300);
});
