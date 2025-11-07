/*
PAUSA BOTÓN VIDEO - DIV1
*/
  const video = document.getElementById('bgVideo');
  const pauseButton = document.getElementById('pauseButton');

  pauseButton.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      pauseButton.textContent = '⏸️';
    } else {
      video.pause();
      pauseButton.textContent = '▶️';
    }
  });


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















