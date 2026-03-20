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
// Usamos localStorage para que el carrito persista de forma funcional en todas las páginas HTML
let carrito = JSON.parse(localStorage.getItem('carritoFoodrius')) || []; 

// Al cargar la página, inicializar la vista del carrito con lo guardado
document.addEventListener('DOMContentLoaded', () => {
    actualizarCarritoDOM();
});

function guardarCarrito() {
    localStorage.setItem('carritoFoodrius', JSON.stringify(carrito));
}

// 4. FUNCIONES y Manipulación del DOM (Eventos)
function toggleCart() {
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
    
    const tarjeta = boton.closest('.producto-card'); 
    
    const nuevoProducto = {
        id: idProducto,
        nombre: tarjeta.querySelector('.producto-nombre').innerText,
        precio: parseFloat(tarjeta.querySelector('.producto-precio').innerText.replace('$', '')),
        cantidad: 1
    };

    const productoExistente = carrito.find(item => item.id === nuevoProducto.id);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push(nuevoProducto); 
    }

    actualizarCarritoDOM();
}

if (btnsAgregar) {
    btnsAgregar.forEach(boton => {
        boton.addEventListener('click', agregarProducto);
    });
}

// 4. FUNCIONES: Refrescar la vista del carrito
function actualizarCarritoDOM() {
    if (!cartItemsContainer || !cartEmptyMsg || !cartCount || !cartTotalText) return;

    cartItemsContainer.innerHTML = '';
    let total = 0;
    let cantidadTotal = 0;

    if (carrito.length === 0) {
        cartItemsContainer.appendChild(cartEmptyMsg);
        cartEmptyMsg.style.display = 'block';
    } else {
        cartEmptyMsg.style.display = 'none';
        
        carrito.forEach((producto, index) => {
            total += producto.precio * producto.cantidad;
            cantidadTotal += producto.cantidad;

            const divProducto = document.createElement('div');
            divProducto.classList.add('cart-item');
            
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

        document.querySelectorAll('.btn-eliminar').forEach(boton => {
            boton.addEventListener('click', eliminarProducto);
        });
    }

    cartCount.innerText = cantidadTotal;
    cartTotalText.innerHTML = `Total: <strong>$${total.toFixed(2)}</strong>`;
    
    // Guardar los cambios cada vez que modificamos el DOM
    guardarCarrito();
}

function eliminarProducto(evento) {
    const boton = evento.target.closest('.btn-eliminar');
    if (boton) {
        const index = boton.getAttribute('data-index');
        carrito.splice(index, 1); 
        actualizarCarritoDOM();
    }
}

if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
        if (carrito.length === 0) {
            alert("Tu carrito está vacío. Agrega algo antes de hacer el pedido.");
        } else {
            alert("¡Tu pedido se ha realizado con éxito! 🍔🚀");
            carrito = []; 
            actualizarCarritoDOM();
            toggleCart();
        }
    });
}

if (searchInput) {
    searchInput.addEventListener('input', (evento) => {
        const textoBusqueda = evento.target.value.toLowerCase();
        
        productosCards.forEach(card => {
            const nombreProducto = card.querySelector('.producto-nombre').innerText.toLowerCase();
            if (nombreProducto.includes(textoBusqueda)) {
                card.style.display = ''; 
            } else {
                card.style.display = 'none';
            }
        });
    });
}

if (categoriasCards) {
    categoriasCards.forEach(categoria => {
        categoria.addEventListener('click', () => {
            const categoriaSeleccionada = categoria.getAttribute('data-categoria');
            
            categoriasCards.forEach(c => c.style.opacity = '0.5');
            categoria.style.opacity = '1';

            productosCards.forEach(card => {
                const categoriaProducto = card.getAttribute('data-categoria');
                if (categoriaSeleccionada === 'todas' || categoriaSeleccionada === categoriaProducto) {
                    card.style.display = ''; 
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}
