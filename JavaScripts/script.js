/*
PAUSA BOTÓN VIDEO - DIV1
*/
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
const botones = document.querySelectorAll(".btn-pregunta");
  botones.forEach(boton => {
    boton.addEventListener("click", () => {
      const pregunta = boton.parentElement;
      pregunta.classList.toggle("activa");
    });
  });


/*
ASIDE: URL TIENDA
 */
function btnFiltro() {
  /*Recoge el valor de los id tipo en el select en la constante creada tipoSeleccionado*/
  const tipoSeleccionado = document.getElementById('tipo').value;

  /*Recoge el los datos de los productos en el div del main con querySelector*/
  const contenedor = document.querySelector('.productos-grid');

  if (!contenedor) return; // Si no existe ese contenedor, sale

  /*Dos constantes, donde se recogen con querySelectorAll del contenedor la clase producto-nutricion y producto-accesorios*/
  const productosNutricion = contenedor.querySelectorAll('.producto-nutricion');
  const productosAccesorios = contenedor.querySelectorAll('.producto-accesorios');

  //Recorre cada producto por su clase, y los oculta con css a todos
  productosNutricion.forEach(p => p.style.display = 'none');
  productosAccesorios.forEach(p => p.style.display = 'none');

  //Depende del que selecciones, mediante css "block" se muestra en pantalla.
  if (tipoSeleccionado === 'nutricion') {
    productosNutricion.forEach(p => p.style.display = 'block');
  } else if (tipoSeleccionado === 'accesorios') {
    productosAccesorios.forEach(p => p.style.display = 'block');
  } else if (tipoSeleccionado === 'todos') {
    productosNutricion.forEach(p => p.style.display = 'block');
    productosAccesorios.forEach(p => p.style.display = 'block');
  }

  const tipoOrden = document.getElementById('orden').value; // valor del select "orden"
ordenarPorPrecio(tipoOrden);

}

function ordenarPorPrecio(tipoOrden) {
  const contenedor = document.querySelector('.productos-grid');
  if (!contenedor) return;

  // Selecciona todos los productos visibles
  const productos = Array.from(contenedor.children).filter(p => p.style.display !== 'none');

  // Función para extraer el precio como número
  const obtenerPrecio = p => {
    const precioText = p.querySelector('.precio')?.textContent || '0';
    return parseFloat(precioText.replace('€', '').trim());
  };

  // Ordenar según tipoOrden
  productos.sort((a, b) => {
    const precioA = obtenerPrecio(a);
    const precioB = obtenerPrecio(b);

    if (tipoOrden === 'caro') return precioB - precioA;  // de mayor a menor
    if (tipoOrden === 'barato') return precioA - precioB; // de menor a mayor
    return 0; // "todos" o cualquier otro, no cambia el orden
  });

  // Reinsertar productos en el contenedor en el nuevo orden
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

  // Mostrar la primera imagen
  showSlide(index);

  // Eventos de los botones
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

  if (!boton || !titulo) return; // corregido: ahora verifica 'titulo'

  boton.addEventListener('mouseenter', () => {
      titulo.style.color = '#b41271'; // cambia color al pasar el mouse
  });

  boton.addEventListener('mouseleave', () => {
      titulo.style.color = '#000'; // vuelve al color original
  });
});



// Inicializamos un objeto para llevar el control de los productos y su cantidad
let carrito = JSON.parse(localStorage.getItem('carrito')) || {};

// Función para actualizar el contador del carrito en el header
function actualizarCarrito() {
  let cantidadCarrito = document.getElementById('cantidad-carrito');
  
  // Sumamos la cantidad total de todos los productos en el carrito
  let totalCantidad = Object.values(carrito).reduce((total, producto) => total + producto.cantidad, 0);
  
  // Actualizamos la cantidad en el carrito
  cantidadCarrito.textContent = totalCantidad;
}

// Recoger los productos del HTML
document.querySelectorAll('.overlay').forEach((overlay) => {
  let descripcion = overlay.querySelector('.descripcion').textContent;
  let precio = overlay.querySelector('.precio').textContent;
  
  // Encontrar el botón de añadir al carrito
  let botonCarrito = overlay.querySelector('.carrito-btn');
  
  // Si no tenemos el producto en el carrito, lo inicializamos
  if (!carrito[descripcion]) {
    carrito[descripcion] = { cantidad: 0, precio: precio };
  }

  // Evento para agregar al carrito
  botonCarrito.addEventListener('click', () => {
    // Aumentar la cantidad del producto en el carrito
    carrito[descripcion].cantidad++;
    
    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Actualizamos el contador del carrito
    actualizarCarrito();
    
    // Opcional: Mostrar un mensaje o cambiar el estado del botón
    alert(`Producto añadido: ${descripcion}. Cantidad: ${carrito[descripcion].cantidad}`);
  });
});

// Actualizamos el carrito al cargar la página
actualizarCarrito();


















// Función para recuperar el carrito desde localStorage
function obtenerCarrito() {
  return JSON.parse(localStorage.getItem('carrito')) || {};
}

// Función para actualizar el carrito en la página
function actualizarCarrito() {
  let cantidadCarrito = document.getElementById('cantidad-carrito');
  
  // Recuperamos el carrito desde localStorage
  let carrito = obtenerCarrito();
  
  // Sumamos la cantidad total de todos los productos en el carrito
  let totalCantidad = Object.values(carrito).reduce((total, producto) => total + producto.cantidad, 0);
  
  // Actualizamos la cantidad en el carrito
  cantidadCarrito.textContent = totalCantidad;

  // Mostrar los productos en el carrito
  mostrarCarrito();
}

// Función para calcular el precio total
function calcularTotal() {
  let carrito = obtenerCarrito();
  
  // Calculamos el total sumando (cantidad * precio) para cada producto
  let total = Object.values(carrito).reduce((total, producto) => total + (producto.cantidad * producto.precio), 0);

  // Mostramos el precio total
  let precioTotalElement = document.getElementById('precio-total');
  precioTotalElement.textContent = `Total: €${total.toFixed(2)}`;
}

// Función para mostrar los productos en el carrito
function mostrarCarrito() {
  let productosCarrito = document.getElementById('productos-carrito');
  let mensajeCarrito = document.getElementById('mensaje-carrito');
  
  // Limpiamos el contenido previo
  productosCarrito.innerHTML = '';

  // Recuperamos el carrito desde localStorage
  let carrito = obtenerCarrito();
  
  // Filtramos los productos que tienen cantidad mayor a 0
  let productosEnCarrito = Object.keys(carrito).filter(descripcion => carrito[descripcion].cantidad > 0);

  // Si el carrito está vacío, mostramos un mensaje
  if (productosEnCarrito.length === 0) {
    mensajeCarrito.style.display = 'block';
  } else {
    mensajeCarrito.style.display = 'none';

    // Iteramos sobre los productos y los mostramos
    productosEnCarrito.forEach(descripcion => {
      let producto = carrito[descripcion];
      
      let productoHTML = `
        <div class="producto-en-carrito">
          <div class="descripcion">${descripcion}</div>
          <div class="precio">${producto.precio}€</div>
          <div class="cantidad">Cantidad: <span class="cantidad-numero">${producto.cantidad}</span></div>
          <div class="acciones">
            <button class="btn-cantidad btn-menos" data-descripcion="${descripcion}">-</button>
            <button class="btn-cantidad btn-mas" data-descripcion="${descripcion}">+</button>
          </div>
        </div>
      `;
      
      productosCarrito.innerHTML += productoHTML;
    });
  }

  // Agregar eventos a los botones de + y -
  document.querySelectorAll('.btn-menos').forEach(boton => {
    boton.addEventListener('click', () => {
      let descripcion = boton.getAttribute('data-descripcion');
      let carrito = obtenerCarrito(); // Recuperamos el carrito desde localStorage
      
      if (carrito[descripcion].cantidad > 0) {
        carrito[descripcion].cantidad--;
        localStorage.setItem('carrito', JSON.stringify(carrito)); // Actualizamos el carrito en localStorage
        mostrarCarrito();
        actualizarCarrito();
        calcularTotal(); // Recalcular el total después de actualizar el carrito
      }
    });
  });

  document.querySelectorAll('.btn-mas').forEach(boton => {
    boton.addEventListener('click', () => {
      let descripcion = boton.getAttribute('data-descripcion');
      let carrito = obtenerCarrito(); // Recuperamos el carrito desde localStorage
      
      carrito[descripcion].cantidad++;
      localStorage.setItem('carrito', JSON.stringify(carrito)); // Actualizamos el carrito en localStorage
      mostrarCarrito();
      actualizarCarrito();
      calcularTotal(); // Recalcular el total después de actualizar el carrito
    });
  });
}

// Al cargar la página, mostramos el carrito
mostrarCarrito();

// También actualizamos el contador del carrito en el encabezado
actualizarCarrito();

// Calculamos el precio total
calcularTotal();

























// Función para recuperar el carrito desde localStorage
function obtenerCarrito() {
  return JSON.parse(localStorage.getItem('carrito')) || {};
}

// Función para actualizar el carrito en la página
function actualizarCarrito() {
  let cantidadCarrito = document.getElementById('cantidad-carrito');
  
  // Recuperamos el carrito desde localStorage
  let carrito = obtenerCarrito();
  
  // Sumamos la cantidad total de todos los productos en el carrito
  let totalCantidad = Object.values(carrito).reduce((total, producto) => total + producto.cantidad, 0);
  
  // Actualizamos la cantidad en el carrito
  cantidadCarrito.textContent = totalCantidad;
}

// Función para calcular el precio total
function calcularTotal() {
  let carrito = obtenerCarrito();
  
  // Calculamos el total sumando (cantidad * precio) para cada producto
  let total = Object.values(carrito).reduce((total, producto) => total + (producto.cantidad * producto.precio), 0);

  // Mostramos el precio total
  let precioTotalElement = document.getElementById('precio-total');
  // Aseguramos que se muestre solo una vez el símbolo de € y el texto "TOTAL"
  precioTotalElement.textContent = `TOTAL: €${total.toFixed(2)}`;
}

// Función para mostrar los productos en el carrito
function mostrarCarrito() {
  let productosCarrito = document.getElementById('productos-carrito');
  let mensajeCarrito = document.getElementById('mensaje-carrito');
  
  // Limpiamos el contenido previo
  productosCarrito.innerHTML = '';

  // Recuperamos el carrito desde localStorage
  let carrito = obtenerCarrito();
  
  // Filtramos los productos que tienen cantidad mayor a 0
  let productosEnCarrito = Object.keys(carrito).filter(descripcion => carrito[descripcion].cantidad > 0);

  // Si el carrito está vacío, mostramos un mensaje
  if (productosEnCarrito.length === 0) {
    mensajeCarrito.style.display = 'block';
  } else {
    mensajeCarrito.style.display = 'none';

    // Iteramos sobre los productos y los mostramos
    productosEnCarrito.forEach(descripcion => {
      let producto = carrito[descripcion];
      
      let productoHTML = `
        <div class="producto-en-carrito">
          <div class="descripcion">${descripcion}</div>
          <div class="precio">${producto.precio}€</div>
          <div class="cantidad">Cantidad: <span class="cantidad-numero">${producto.cantidad}</span></div>
          <div class="acciones">
            <button class="btn-cantidad btn-menos" data-descripcion="${descripcion}">-</button>
            <button class="btn-cantidad btn-mas" data-descripcion="${descripcion}">+</button>
          </div>
        </div>
      `;
      
      productosCarrito.innerHTML += productoHTML;
    });
  }

  // Agregar eventos a los botones de + y -
  document.querySelectorAll('.btn-menos').forEach(boton => {
    boton.addEventListener('click', () => {
      let descripcion = boton.getAttribute('data-descripcion');
      let carrito = obtenerCarrito(); // Recuperamos el carrito desde localStorage
      
      if (carrito[descripcion].cantidad > 0) {
        carrito[descripcion].cantidad--;
        localStorage.setItem('carrito', JSON.stringify(carrito)); // Actualizamos el carrito en localStorage
        mostrarCarrito();
        actualizarCarrito(); // Actualizar el contador
        calcularTotal(); // Recalcular el total
      }
    });
  });

  document.querySelectorAll('.btn-mas').forEach(boton => {
    boton.addEventListener('click', () => {
      let descripcion = boton.getAttribute('data-descripcion');
      let carrito = obtenerCarrito(); // Recuperamos el carrito desde localStorage
      
      carrito[descripcion].cantidad++;
      localStorage.setItem('carrito', JSON.stringify(carrito)); // Actualizamos el carrito en localStorage
      mostrarCarrito();
      actualizarCarrito(); // Actualizar el contador
      calcularTotal(); // Recalcular el total
    });
  });
}

// Al cargar la página, mostramos el carrito
document.addEventListener('DOMContentLoaded', () => {
  mostrarCarrito(); // Mostrar productos
  actualizarCarrito(); // Actualizar contador del carrito
  calcularTotal(); // Calcular el precio total
});
