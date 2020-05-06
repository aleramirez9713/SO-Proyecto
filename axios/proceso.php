<?php
    header("Content-Type: aplication/json");
    include_once("../class/class-proceso.php");
    switch($_SERVER['REQUEST_METHOD']){
        case 'POST':
            $_POST = json_decode(file_get_contents('php://input'), true);
            $proceso = new Proceso($_POST["idProceso"], $_POST["estadoProceso"], $_POST["prioridadProceso"],$_POST["instruccionesProceso"], $_POST["bloqueoProceso"], $_POST["eventoProceso"] );
            $proceso->guardarProceso();
            break;

        case 'GET':
            Proceso::eliminarProcesos();
            echo '{"mensaje": "Proesos Eliminados"}'; 
            break;
    }
?>