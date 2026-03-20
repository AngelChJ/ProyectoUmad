// 1. VARIABLES: Referencias al DOM (Manipulación del DOM)
const btnCart = document.getElementById('btn-cart');
const btnCloseCart = document.getElementById('btn-close-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartEmptyMsg = document.getElementById('cart-empty-msg');
const cartTotalText = document.getElementById('cart-total');
const btnsAgregar = document.querySelectorAll('.btn-agregar');
const btnCheckout = document.getElementById('btn-checkout');

// Referencias para la búsqueda y categorías
const searchInput = document.getElementById('input-search');
const categoriasCards = document.querySelectorAll('.categoria-card');
const productosCards = document.querySelectorAll('.producto-card');

// 2. ARREGLOS y 3. OBJETOS: El carrito es un arreglo que guardará objetos
let carrito = []; 

// 4. FUNCIONES y Manipulación del DOM (Eventos)
function toggleCart() {
    // Manipulación del DOM: Actualizar clases para mostrar/ocultar el menú lateral
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.toggle('cart-hidden');
        cartOverlay.classList.toggle('hidden');
    }
}

// Eventos de click para el carrito
if (btnCart) btnCart.addEventListener('click', toggleCart);
if (btnCloseCart) btnCloseCart.addEventListener('click', toggleCart);
if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

// 4. FUNCIONES: Lógica para agregar productos
function agregarProducto(evento) {
    const boton = evento.target;
    const idProducto = boton.getAttribute('data-id');
    
    // Subiendo en el DOM para encontrar la tarjeta entera del producto
    const tarjeta = boton.closest('.producto-card'); 
    
    // Extrayendo información del HTML (Manipulación estructurada en Objetos)
    const nuevoProducto = {
        id: idProducto,
        nombre: tarjeta.querySelector('.producto-nombre').innerText,
        // Convertimos un string como "$75.00" a un número 75.00
        precio: parseFloat(tarjeta.querySelector('.producto-precio').innerText.replace('$', '')),
        cantidad: 1
    };

    // 5. CONDICIONALES y ARREGLOS (Método .find)
    // Buscamos si el producto ya existe en el carrito
    const productoExistente = carrito.find(item => item.id === nuevoProducto.id);

    if (productoExistente) {
        // Si ya existe, solo incrementamos su cantidad
        productoExistente.cantidad++;
    } else {
        // SINO, lo agregamos al arreglo del carrito
        carrito.push(nuevoProducto); 
    }

    actualizarCarritoDOM();
}

// Asignamos el evento de click a todos los botones de "Agregar 🛒" (Ciclo en el DOM)
if (btnsAgregar) {
    btnsAgregar.forEach(boton => {
        boton.addEventListener('click', agregarProducto);
    });
}

// 4. FUNCIONES: Refrescar la vista del carrito
function actualizarCarritoDOM() {
    if (!cartItemsContainer || !cartEmptyMsg || !cartCount || !cartTotalText) return;

    // Limpiamos el HTML actual del carrito
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let cantidadTotal = 0;

    // 5. CONDICIONALES: Verificar si está vacío
    if (carrito.length === 0) {
        cartItemsContainer.appendChild(cartEmptyMsg);
        cartEmptyMsg.style.display = 'block';
    } else {
        cartEmptyMsg.style.display = 'none';
        
        // Recorremos los arreglos para generar el HTML
        carrito.forEach((producto, index) => {
            total += producto.precio * producto.cantidad;
            cantidadTotal += producto.cantidad;

            // Manipulación de DOM: Crear elementos HTML dinámicos
            const divProducto = document.createElement('div');
            divProducto.classList.add('cart-item');
            
            // Usamos estilos inline básicos para asegurar que se vea bien en el carrito
            divProducto.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div>
                        <p style="margin: 0;"><strong>${producto.nombre}</strong></p>
                        <p style="margin: 5px 0 0; font-size: 0.9em; color: #555;">$${producto.precio.toFixed(2)} | Cant: ${producto.cantidad}</p>
                    </div>
                    <button class="btn-eliminar" data-index="${index}" style="background:none; border:none; cursor:pointer; color:red; font-size:1.2em;">❌</button>
                </div>
                <hr style="border: 0.5px solid #eee;">
            `;
            cartItemsContainer.appendChild(divProducto);
        });

        // Evento para eliminar productos individuales
        document.querySelectorAll('.btn-eliminar').forEach(boton => {
            boton.addEventListener('click', eliminarProducto);
        });
    }

    // Actualizamos los números en la Interfaz
    cartCount.innerText = cantidadTotal;
    cartTotalText.innerHTML = `Total: <strong>$${total.toFixed(2)}</strong>`;
}

// 4. FUNCIONES: Eliminar un producto usando 'splice' en Arreglos
function eliminarProducto(evento) {
    // Subimos en el DOM por si hace click dentro del botón (en el icono)
    const boton = evento.target.closest('.btn-eliminar');
    if (boton) {
        const index = boton.getAttribute('data-index');
        // Borrar 1 elemento en la posición "index"
        carrito.splice(index, 1); 
        actualizarCarritoDOM();
    }
}

// Evento al Hacer Pedido
if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
        // 5. CONDICIONAL (if / else)
        if (carrito.length === 0) {
            alert("Tu carrito está vacío. Agrega algo antes de hacer el pedido.");
        } else {
            alert("¡Tu pedido se ha realizado con éxito! 🍔🚀");
            // Vaciamos el arreglo y la vista
            carrito = []; 
            actualizarCarritoDOM();
            toggleCart();
        }
    });
}

// ---> CÓDIGO EXTRA: Búsqueda y Filtros de Categorías <---
// Esto comprueba más puntos de "Arreglos", "Funciones" y "Eventos"

// Filtrar por texto desde el buscador
if (searchInput) {
    searchInput.addEventListener('input', (evento) => {
        const textoBusqueda = evento.target.value.toLowerCase();
        
        productosCards.forEach(card => {
            const nombreProducto = card.querySelector('.producto-nombre').innerText.toLowerCase();
            // Uso de un condicional y manipulación de texto de strings
            if (nombreProducto.includes(textoBusqueda)) {
                card.style.display = ''; // Restaurar el display por defecto
            } else {
                card.style.display = 'none'; // Esconder los que no coincidan
            }
        });
    });
}

// Filtrar por categoría haciendo click
if (categoriasCards) {
    categoriasCards.forEach(categoria => {
        categoria.addEventListener('click', () => {
            const categoriaSeleccionada = categoria.getAttribute('data-categoria');
            
            // Efecto visual rápido para saber qué categoría está seleccionada
            categoriasCards.forEach(c => c.style.opacity = '0.5');
            categoria.style.opacity = '1';

            // Filtrar las tarjetas de productos
            productosCards.forEach(card => {
                const categoriaProducto = card.getAttribute('data-categoria');
                // if / else para decidir si mostramos el elemento
                if (categoriaSeleccionada === 'todas' || categoriaSeleccionada === categoriaProducto) {
                    card.style.display = ''; 
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}