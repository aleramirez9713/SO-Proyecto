var main = function () {
  $('.push-bar').on('click', function (event) {
    if (!isClicked) {
      event.preventDefault();
      $('.arrow').trigger('click');
      isClicked = true;
    }
  });

  $('.arrow').css({
    'animation': 'bounce 2s infinite'
  });
  $('.arrow').on("mouseenter", function () {
    $('.arrow').css({
      'animation': '',
      'transform': 'rotate(180deg)',
      'background-color': 'black'
    });
  });
  $('.arrow').on("mouseleave", function () {
    if (!isClicked) {
      $('.arrow').css({
        'transform': 'rotate(0deg)',
        'background-color': 'black'
      });
    }
  });

  var isClicked = false;

  $('.arrow').on("click", function () {
    if (!isClicked) {
      isClicked = true;
      $('.arrow').css({
        'transform': 'rotate(180deg)',
        'background-color': 'black',
      });

      $('.bar-cont').animate({
        top: "-15px"
      }, 300);
      $('.main-cont').animate({
        top: "0px"
      }, 300);
      // $('.news-block').css({'border': '0'});
      // $('.underlay').slideDown(1000);

    } else if (isClicked) {
      isClicked = false;
      $('.arrow').css({
        'transform': 'rotate(0deg)',
        'background-color': 'black'
      });

      $('.bar-cont').animate({
        top: "-215px"
      }, 300);
      $('.main-cont').animate({
        top: "-215px"
      }, 300);
    }
  });

  $('.card').on('mouseenter', function () {
    $(this).find('.card-text').slideDown(300);
  });

  $('.card').on('mouseleave', function (event) {
    $(this).find('.card-text').css({
      'display': 'none'
    });
  });
};

$(document).ready(main);


// ============================================ Lista Enlazada Cola ============================================ //

function Nodo(data) {
  this.data = data;
  this.siguiente = null;
}

function ListaEnlazadaCola() {
  this.primero = null;
  this.agregar = ListaEnlazadaColaAgregar;
  this.eliminar = ListaEnlazadaColaEliminar;
  this.largo = ListaEnlazadaColaLargo;
  this.imprimir = ListaEnlazadaColaImpresion;
  this.eliminarPosicion = ListaEnlazadaColaEliminar;
}

function ListaEnlazadaColaAgregar(proceso) {
  if (!this.primero) {
    this.primero = new Nodo(proceso);
  } else {
    actual = this.primero;
    while (actual.siguiente != null) {
      actual = actual.siguiente;
    }
    actual.siguiente = new Nodo(proceso);
    return true;
  }
}

function ListaEnlazadaColaLargo() {
  contador = 0;
  actual = this.primero;
  while (actual) {
    contador++;
    actual = actual.siguiente;
  }
  return contador;
}

function ListaEnlazadaColaEliminar() {
  if (!this.primero) {
    return false;
  } else {
    actual = this.primero;
    this.primero = this.primero.siguiente;
    return true;
  }
}

function ListaEnlazadaColaImpresion() {
  actual = this.primero;
  while (actual) {
    console.log(actual.data.idProceso);
    actual = actual.siguiente;
  }
}

function ListaEnlazadaColaBorradoPosicion(data) {
  prev = null;
  actual = this.primero;
  if (this.primero == null) {
    return false;
  } else {
    while (actual.data != data && actual.siguiente != null) {
      prev = actual;
      actual = actual.siguiente;
    }

    if (actual.data == data) {
      if (actual == this.primero) {
        if (actual.siguiente == null) {
          this.primero = null;
        } else {
          this.primero = actual.siguiente;
        }
      } else {
        if (actual.siguiente == null) {
          prev.siguiente = null;
        } else {
          prev.siguiente = actual.siguiente;
        }

      }

    }

  }

}

// ============================================ Datos Proceso ============================================ //

var contadorProcesos = 0;
var procesos;
document.getElementById('simular').disabled = true;

//Listas Enlazadas estados de los procesos
var procesosNuevos = new ListaEnlazadaCola();
var procesosListos = new ListaEnlazadaCola();
var procesosEjecutandose = new ListaEnlazadaCola();
var procesosBloqueados = new ListaEnlazadaCola();
var procesosFinalizados = new ListaEnlazadaCola();


//listas por prioridad
var listosPrioridad1 = new ListaEnlazadaCola();
var listosPrioridad2 = new ListaEnlazadaCola();
var listosPrioridad3 = new ListaEnlazadaCola();

function validarCampo() {
  //Crear proceso con la cantidad de instrucciones ingresadas
  if (document.getElementById('instrucciones').value == '') {
    document.getElementById('alerta').innerHTML = 'Ingrese la cantidad de instrucciones';
    
  } else {
    elem = document.getElementById('instrucciones').value;
    document.getElementById('alerta').innerHTML = '';

    //Aumento de contador de procesos
    contadorProcesos++;
    datosProceso(elem);

    if (contadorProcesos == 10) {
      document.getElementById('agregar').disabled = true;
    }
  }
}

function datosProceso(instrucciones) {
  document.getElementById('simular').disabled = false;
  let idProceso;
  let instBloqueo;
  let eventos = [0, 3, 5];
  let eventoProceso = eventos[Math.floor(Math.random() * 3)];

  //Bloquear Botón de agregar procesos
  if (contadorProcesos == 1) {
    idProceso = 1000;
  } else {
    idProceso = 1000 * contadorProcesos;//4
  }

  //Desbloquear Botón de simular

  if (eventoProceso == 0) {
    instBloqueo = 0;
  } else if (eventoProceso == 3) {
    instBloqueo = numeroRandom(1, instrucciones - 13);
  } else {
    instBloqueo = numeroRandom(1, instrucciones - 27);
  }

  //Armar el JSON
  let proceso = {
    'idProceso': idProceso,
    'estadoProceso': 'Nuevo',
    'prioridadProceso': Math.floor(Math.random() * 3) + 1,
    'instruccionesProceso': parseInt(instrucciones),
    'bloqueoProceso': instBloqueo,
    'eventoProceso': eventoProceso
  }

  //Agregar a la lista enlazada de nuevos procesos
  procesosNuevos.agregar(proceso);

  //Consumir REST API Guardar Proceso en archivo .json
  axios({
    method: 'POST',
    url: 'axios/proceso.php',
    responseType: 'json',
    data: proceso
  }).then(resProcesos => {

    //Mostrar el proceso agregado
    agregarCardProceso(proceso);

  }).catch(error => {
    console.error(error);
  });

}

function numeroRandom(min, max) {
  return parseInt(Math.floor(Math.random() * (max - min) + min));
}

// ============================================ Mostrar Proceso ============================================ //

function agregarCardProceso(proceso) {
  document.getElementById('procesos').innerHTML +=
    ` <!-- Single Card -->
      <div class="card">
          <div class="card-img-top">
            <div class="box">
              <div id="proceso-${contadorProcesos}" class="chart" data-percent="100"><p id="proceso-${contadorProcesos}-estado">0</p></div>
            </div>
          </div>
          <div class="card-block">
                <div class="card-content">
                  <table class="table table-hover table-dark pr-5">
                    <tbody>
                      <tr>
                        <th scope="row">Id</th>
                        <td id="idProceso-${contadorProcesos}">${proceso.idProceso}</td>
                      </tr>
                      <tr>
                        <th scope="row">Estado</th>
                        <td id="estadoProceso-${contadorProcesos}">${proceso.estadoProceso}</td>
                      </tr>
                      <tr>
                        <th scope="row">Prioridad</th>
                        <td id="prioridadProceso-${contadorProcesos}">${proceso.prioridadProceso}</td>
                      </tr>
                      <tr>
                        <th scope="row">Instrucciones</th>
                        <td id="instruccionesProceso-${contadorProcesos}">${proceso.instruccionesProceso}</td>
                      </tr>
                      <tr>
                        <th scope="row">Bloqueo</th>
                        <td id="bloqueoProceso-${contadorProcesos}">${proceso.bloqueoProceso}</td>
                      </tr>
                      <tr>
                        <th scope="row">Evento</th>
                        <td id="eventoProceso-${contadorProcesos}">${proceso.eventoProceso}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
          </div>
      </div>
  <!-- End Single Card-->`;
  cargarBarraCircular();
}

function cargarBarraCircular() {
  //Rellenar barras circulares
  document.querySelector(`div #proceso-${contadorProcesos}`).setAttribute('data-percent', 100);
  $('.chart').easyPieChart({
    size: 180,
    barColor: '#17d3e6',
    scaleColor: false,
    lineWidth: 15,
    trackColor: '#fff',
    lineCap: 'circle',
    animation: 100
  });
}

function limpiarBarras() {
  //Limpiar las barras para empezar gestión
  for (let i = 1; i < contadorProcesos + 1; i++) {
    $(`div #proceso-${i}`).data('easyPieChart').update(0);
    $(`div #proceso-${i}`).data('easyPieChart').disableAnimation();
    $(`div #proceso-${i}`).data('easyPieChart').enableAnimation();
  }
}

function cargarBarras() {
  for (let i = 1; i < contadorProcesos + 1; i++) {
    $(`div #proceso-${i}`).data('easyPieChart').update(100);
    $(`div #proceso-${i}`).data('easyPieChart').disableAnimation();
    $(`div #proceso-${i}`).data('easyPieChart').enableAnimation();
  }
}

function cargarBarra(posicion) {
  $(`div #proceso-${posicion}`).data('easyPieChart').update(100);
  $(`div #proceso-${posicion}`).data('easyPieChart').disableAnimation();
  $(`div #proceso-${posicion}`).data('easyPieChart').enableAnimation();
}

// ========================================= Gestión de Procesos ========================================= //

//Contador para mostrar los cambios de las cards
var contadorCards = 1;

function gestionarProcesosNuevos() {
  limpiarBarras();

  //Bloquear Botones
  document.getElementById('agregar').disabled = true;
  document.getElementById('simular').disabled = true;

  //Agregar a las listas por prioridad
  let nuevo = procesosNuevos.primero;
  while (nuevo) {
    if (nuevo.data.prioridadProceso == 1) {
      listosPrioridad1.agregar(nuevo.data);

    } else if (nuevo.data.prioridadProceso == 2) {
      listosPrioridad2.agregar(nuevo.data);

    } else if (nuevo.data.prioridadProceso == 3) {
      listosPrioridad3.agregar(nuevo.data);

    }
    nuevo = nuevo.siguiente;
  }
  //Agregar a la lista de Listos los nodos de las listas por prioridad
  if (listosPrioridad1.largo() > 0) asignarPriodidad(listosPrioridad1);
  if (listosPrioridad2.largo() > 0) asignarPriodidad(listosPrioridad2);
  if (listosPrioridad3.largo() > 0) asignarPriodidad(listosPrioridad3);

  cargarBarras();
  document.getElementById('titulo').innerHTML += `                       
    <button id="continuar" type="button" class="btn btn-lg btn-success px-5 badge-pill mb-2"  onclick="gestionarProcesos()" style="display: inline" >Continuar</button>
    `;
}


function asignarPriodidad(listaOrdenada) {
  let procesoOrdenado = listaOrdenada.primero;
  while (procesoOrdenado) {
    procesoOrdenado.data.estadoProceso = 'Listo';
    document.getElementById(`estadoProceso-${contadorCards}`).innerHTML = 'Listo';
    document.getElementById(`proceso-${contadorCards}-estado`).innerHTML = '1';
    procesosNuevos.eliminarPosicion(procesoOrdenado.data);
    procesosListos.agregar(procesoOrdenado.data);
    procesoOrdenado = procesoOrdenado.siguiente;
    contadorCards++;
  }
}

//procesos que se ejecutan 3 veces seguidas bajan de prioridad
var bajarPrioridad = [];

function gestionarProcesos() {
  if (procesosFinalizados.largo() == contadorProcesos) {
    limpiarBarras();
    document.getElementById('continuar').disabled = true;
    document.getElementById('titulo').innerHTML += `
      <button id="finalizar" type="button" class="btn btn-lg btn-success px-5 badge-pill mb-2" onclick="finalizarGestion() " style="display:inline">Fin</button>
      `;
  } else {
    if (procesosBloqueados.largo() > 0) {
      let procesoActual = procesosBloqueados.primero;
      for (let i = 0; i < procesosBloqueados.largo(); i++) {
        let posicion = (((procesoActual.data.idProceso).toString()).split(''))[0];
        if (procesoActual.data.eventoProceso == '3') {
          let instruccionDeBloqueoA = (procesoActual.data.bloqueoProceso + (posicion * 1000)) + 13;
          if (procesoActual.data.idProceso + 5 > instruccionDeBloqueoA && procesoActual.data.idProceso != instruccionDeBloqueoA) {
            limpiarBarras();

            procesoActual.data.estadoProceso = 'Listo';
            procesoActual.data.idProceso = instruccionDeBloqueoA;
            procesosListos.agregar(procesoActual.data);
            document.getElementById(`estadoProceso-${posicion}`).innerHTML = 'Listo';
            document.getElementById(`proceso-${posicion}-estado`).innerHTML = '1';
            document.getElementById(`idProceso-${posicion}`).innerHTML = `${procesoActual.data.idProceso}`;
            procesosBloqueados.eliminarPosicion(procesoActual.data);
            cargarBarras();

          } else {
            limpiarBarras();
            procesoActual.data.idProceso = procesoActual.data.idProceso + 5;
            document.getElementById(`idProceso-${posicion}`).innerHTML = `${procesoActual.data.idProceso}`;
            cargarBarras();
          }
        } else if (procesoActual.data.eventoProceso == '5') {
          let instruccionDeBloqueoB = procesoActual.data.bloqueoProceso + (posicion * 1000) + 27;
          if (procesoActual.data.idProceso + 5 > instruccionDeBloqueoB && procesoActual.data.idProceso != instruccionDeBloqueoB) {

            limpiarBarras();

            procesoActual.data.estadoProceso = 'Listo';
            procesoActual.data.idProceso = instruccionDeBloqueoB;
            procesosListos.agregar(procesoActual.data);
            document.getElementById(`estadoProceso-${posicion}`).innerHTML = 'Listo';
            document.getElementById(`proceso-${posicion}-estado`).innerHTML = '1';
            document.getElementById(`idProceso-${posicion}`).innerHTML = `${procesoActual.data.idProceso}`;
            procesosBloqueados.eliminarPosicion(procesoActual.data);
            cargarBarras();

          } else {
            limpiarBarras();
            procesoActual.data.idProceso = procesoActual.data.idProceso + 5;
            document.getElementById(`idProceso-${posicion}`).innerHTML = `${procesoActual.data.idProceso}`;
            cargarBarras();
          }
        }
        procesoActual = procesoActual.siguiente;
      }
    }
    if (procesosListos.largo() > 0) {

      let procesoActualListo = procesosListos.primero;
      for (let i = 0; i < procesosListos.largo(); i++) {
        let posicion = (((procesoActualListo.data.idProceso).toString()).split(''))[0];
        let instruccionDeBloqueo = procesoActualListo.data.bloqueoProceso + (posicion * 1000);
        let largo = bajarPrioridad.length;
        if (procesoActualListo.data.prioridadProceso != 3 && bajarPrioridad[largo - 1] == bajarPrioridad[largo - 2] == bajarPrioridad[largo - 3]) {
          procesoActualListo.data.prioridadProceso++;
          document.getElementById(`prioridadProceso-${posicion}`).innerHTML = `${procesoActualListo.data.prioridadProceso}`;
        } else if (compararInstrucciones(procesoActualListo.data.idProceso, instruccionDeBloqueo) == true && procesoActualListo.data.eventoProceso != 0) {

          limpiarBarras();

          procesoActualListo.data.estadoProceso = 'Ejecutandose';
          procesosEjecutandose.agregar(procesoActualListo.data);
          document.getElementById(`estadoProceso-${posicion}`).innerHTML = 'Ejecutandose';
          document.getElementById(`proceso-${posicion}-estado`).innerHTML = '2';
          procesosListos.eliminarPosicion(procesoActualListo.data);
          cargarBarras();


          limpiarBarras();

          procesoActualListo.data.estadoProceso = 'Bloqueado';
          procesoActualListo.data.idProceso = instruccionDeBloqueo;
          procesosBloqueados.agregar(procesoActualListo.data);
          document.getElementById(`estadoProceso-${posicion}`).innerHTML = 'Bloqueado';
          document.getElementById(`idProceso-${posicion}`).innerHTML = `${procesoActualListo.data.idProceso}`;
          document.getElementById(`proceso-${posicion}-estado`).innerHTML = '3';
          procesosEjecutandose.eliminarPosicion(procesoActualListo.data);

          cargarBarras();

        } else if (((procesoActualListo.data.idProceso - (posicion * 1000)) + 5) > procesoActualListo.data.instruccionesProceso && ((procesoActualListo.data.idProceso - (posicion * 1000)) != procesoActualListo.data.instruccionesProceso)) {

          limpiarBarras();
          procesoActualListo.data.estadoProceso = 'Ejecutandose';
          procesosEjecutandose.agregar(procesoActualListo.data);
          document.getElementById(`estadoProceso-${posicion}`).innerHTML = 'Ejecutandose';
          document.getElementById(`proceso-${posicion}-estado`).innerHTML = '2';
          procesosListos.eliminarPosicion(procesoActualListo.data);
          cargarBarras();

          limpiarBarras();
          procesoActualListo.data.estadoProceso = 'Finalizado';
          procesoActualListo.data.idProceso = procesoActualListo.data.instruccionesProceso + (posicion * 1000);
          procesosFinalizados.agregar(procesoActualListo.data);
          document.getElementById(`estadoProceso-${posicion}`).innerHTML = 'Finalizado';
          document.getElementById(`idProceso-${posicion}`).innerHTML = `${procesoActualListo.data.idProceso}`;
          document.getElementById(`proceso-${posicion}-estado`).innerHTML = '4';
          procesosEjecutandose.eliminarPosicion(procesoActualListo.data);
          cargarBarra(posicion);

        } else {

          limpiarBarras();
          procesoActualListo.data.estadoProceso = 'Ejecutando';
          procesosEjecutandose.agregar(procesoActualListo.data);
          document.getElementById(`estadoProceso-${posicion}`).innerHTML = 'Ejecutando';
          document.getElementById(`proceso-${posicion}-estado`).innerHTML = '2';
          bajarPrioridad.push(posicion); 
          procesosListos.eliminarPosicion(procesoActualListo.data);
          cargarBarras();

          limpiarBarras();
          procesoActualListo.data.estadoProceso = 'Listo';
          procesoActualListo.data.idProceso = procesoActualListo.data.idProceso + 5;
          procesosListos.agregar(procesoActualListo.data);
          document.getElementById(`estadoProceso-${posicion}`).innerHTML = 'Listo';
          document.getElementById(`idProceso-${posicion}`).innerHTML = `${procesoActualListo.data.idProceso}`;
          document.getElementById(`proceso-${posicion}-estado`).innerHTML = '1';
          procesosEjecutandose.eliminarPosicion(procesoActualListo.data);
          cargarBarras();

        }
        procesoActualListo = procesoActualListo.siguiente;
      }
    }
  }
}

function compararInstrucciones(id, bloqueo) {
  for (let i = 0; i < 6; i++) {
    if (id == bloqueo) return true;
    id++;
  }
  return false;
}

function finalizarGestion() {
  //Borrar botones generados y habilitar los principales
  document.getElementById('titulo').innerHTML = `Gestión de Procesos`;
  document.getElementById('agregar').disabled = false;
  document.getElementById('simular').disabled = false;

  //Borrar las cards
  document.getElementById('procesos').innerHTML = '';

  //Vaciar listas enlazadas
  if (procesosNuevos.largo() > 0) vaciarLista(procesosNuevos);
  if (procesosListos.largo() > 0) vaciarLista(procesosListos);
  if (procesosEjecutandose.largo() > 0) vaciarLista(procesosEjecutandose);
  if (procesosBloqueados.largo() > 0) vaciarLista(procesosBloqueados);
  if (procesosFinalizados.largo() > 0) vaciarLista(procesosFinalizados);
  if (listosPrioridad1.largo() > 0) vaciarLista(listosPrioridad1);
  if (listosPrioridad2.largo() > 0) vaciarLista(listosPrioridad2);
  if (listosPrioridad3.largo() > 0) vaciarLista(listosPrioridad3);

  //Reiniciar contadores
  contadorCards = 1;
  contadorProcesos = 0;

  //Borrar los procesos del archivo de texto plano
  axios({
    method: 'GET',
    url: 'axios/proceso.php',
    responseType: 'json',
  }).then(respuesta => {

    console.log(respuesta.data);

  }).catch(error => {
    console.error(error);
  });
}

function vaciarLista(lista) {
  for (let i = 0; i < lista.largo() + 1; i++) {
    lista.eliminar();
  }
}