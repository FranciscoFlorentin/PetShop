document.querySelector("#seccionHome")?parallaxHome():
document.querySelector("#seccionCarrito")?crearCarrito(): 
document.querySelector("#seccionVet")?fetchearData("Medicamento","cartaVeterinaria"):
document.querySelector("#seccionContacto")?formContacto():
document.querySelector("#seccionJuguetes") && fetchearData("Juguete","cartaJugueteria")
// FUNCIONES DE MATERIALIZE ----------------------------------------------------------------
function modal(){
    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems);
      });
}
function parallaxHome(){
    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.parallax');
        var instances = M.Parallax.init(elems);});
}
function tooltipMaterial(){
    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.tooltipped');
        var instances = M.Tooltip.init(elems);});
}
function formContacto(){
    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('select');
        var instances = M.FormSelect.init(elems);
    });  
    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.tooltipped');
        var instances = M.Tooltip.init(elems);}
    );
    botonEnviar=document.querySelector(".enviarConsulta");
    botonEnviar.addEventListener("click",function(e){
        if(validarDatos("camposConsulta")==true){
            M.toast({html: `Consulta Enviada`});}
        else{
            M.toast({html: `Rellene los campos`});
        }
    })
    botonEnviar.onclick="M.toast({html: Enviar Consulta})";
}
function validarDatos(nombreCampos){
    let aux1=document.querySelectorAll(`.${nombreCampos}`);
    console.log(aux1)
    for(let i=0;i<aux1.length;i++){
        if(aux1[i].checkValidity()==false){
            return false;
        }
    }
    return true;
}
// FETCHEO DE LA DATA ---------------------------------------------------------------------
function fetchearData(tipo,carta){
    fetch("https://apipetshop.herokuapp.com/api/articulos")
    .then(response=>response.json())
    .then(productos=>{
        var productosFiltrados=productos.response.filter(producto=>producto.tipo==tipo);
        tooltipMaterial();
        crearTienda(productosFiltrados,carta);
    }) 
}
// ARMADO DE LA TIENDA --------------------------------------------------------------------
function crearTienda(productos,cartaPag){
    var carta=document.querySelector(`#${cartaPag}`);
    productos.map(producto=>{crearProducto(producto,carta)});
    return productos;
}
function crearProducto(producto,carta){ 
    var caja=document.createElement("div");
    var botonAgregar=document.createElement("a");
    var cajaBoton=document.createElement("div");
    cajaBoton.classList.add("center");
    botonAgregar.onclick="M.toast({html: Agregado al carrito})";
    botonAgregar.classList.add("btn-floating","btn-large","waves-effect","pink","tooltipped","botonAgregar");
    botonAgregar.innerHTML=`<i class="small material-icons">add_shopping_cart</i>`;
    cajaBoton.appendChild(botonAgregar);
    caja.classList.add("card","large","col","hoverable");
    caja.innerHTML=`
        <div class="card-image waves-effect waves-block waves-light">
            <img class="activator" src="${producto.imagen}"></img>
        </div>
        <div class="card-content center center-align"> 
            <div class="card-tittle "> 
                <p>${producto.nombre}</p>
            </div>
        </div>
        <div class="card-reveal yellow lighten-4">
            <span class="card-title grey-text text-darken-4">
                <i class="material-icons right circle yellow hoverable">close</i>
                <h5>${producto.nombre}</h5>
            </span>
            <p>${producto.descripcion}</p>
            <p class="yellow">Stock: ${producto.stock}</p>
        </div>
        <div class="purple lighten-3 center">
            <h3>$ ${producto.precio}</h3>
        </div>
    `
    let aux=document.querySelectorAll(".card-reveal");
    console.log(aux);
    botonAgregar.addEventListener("click",function(e){
        agregarProductoLocalStorage(producto);  
        M.toast({html: `${producto.nombre} agregado al carrito`})
    })
    caja.appendChild(cajaBoton);
    if(producto.stock<=5){
        const ultimasUnidades=document.createElement("p");
        ultimasUnidades.classList.add("ultimas","center","yellow")
        ultimasUnidades.innerText=`Quedan ${producto.stock} unidades !! `;
        caja.appendChild(ultimasUnidades);
    }
    carta.appendChild(caja);
}
// MANEJO DEL LOCAL STORAGE-------------------------------------------------------------------
cantidadCarrito();
function agregarProductoLocalStorage(producto){
    let productos=[];
    productos=this.productosDelLocalStorage();
    productos.push(producto);
    localStorage.setItem("productos",JSON.stringify(productos));
    cantidadCarrito();
}
function productosDelLocalStorage(){
    let productoLocalStorage;
    (localStorage.getItem("productos")==null)?productoLocalStorage=[]:
    productoLocalStorage=JSON.parse(localStorage.getItem("productos"));
    return productoLocalStorage;
}
function crearCarrito(){
    modal();
    tooltipMaterial();
    const tablaCarrito=document.querySelector("#cuerpoTabla");
    let productos=productosDelLocalStorage();
    productos.map(producto=>{
        tablaCarrito.appendChild(crearFila(producto))
    });
    newTr=document.createElement("tr");
    newTr.innerHTML=`
        <tr>    
            <td></td>
            <td>TOTAL</td>
            <td id="totalId"></td>
            <td></td>
        </tr>    `
    tablaCarrito.appendChild(newTr);
    calcularTotal();
    aceptarBoton=document.querySelector("#botonAceptar");
    aceptarBoton.addEventListener("click",function(e){  
        if(validarDatos("camposCarrito")==true){
            M.toast({html: `Compra Realizada`})
        }
        else (M.toast({html: `Complete los datos!!`}))
    })
}
function calcularTotal(){
    let productosLs=productosDelLocalStorage();
    let total=0;
    productosLs.map(producto=>total+=producto.precio);
    localStorage.setItem("total",JSON.stringify(total));
    let aux=document.querySelector("#totalId");
    aux.innerText=`$ ${total}`;
    
}
function crearFila(producto){
    var fila=document.createElement("tr");
    var botonX=document.createElement("button");
    botonX.classList.add("botonesBorrar","btn-floating","btn-small","waves-effect","waves-light","red");
    botonX.innerText="X";
    fila.innerHTML=`
        <tr> 
            <td><img width="60px" height="60px" src="${producto.imagen} width=" alt=""></td>
            <td>${producto.nombre}</td>
            <td>$ ${producto.precio}</td>
        </tr>
    `
    botonX.addEventListener("click",function(e){
        botonX.parentElement.remove();
        eliminarProductoLocalStorage(producto._id);
    })
    fila.appendChild(botonX)
    return fila;
}
function eliminarProductoLocalStorage(id){  
    let productosLs=productosDelLocalStorage();
    for(let i=0;i<productosLs.length;i++){
        if(productosLs[i]._id==id){
            productosLs.splice(i,1);
            break;
        }   
    }
    localStorage.setItem(`productos`,JSON.stringify(productosLs));
    calcularTotal();
    cantidadCarrito();
}
function cantidadCarrito(){
    let aux=document.querySelector("#cantidadCarrito");
    aux.innerText=productosDelLocalStorage().length;
}
