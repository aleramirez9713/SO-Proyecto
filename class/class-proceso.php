<?php 
    class Proceso{
        private $id;
        private $estado;
        private $prioridad;
        private $instrucciones;
        private $bloqueo;
        private $evento;

        //Contructor de la clase
        public function __construct(
            $id, $estado,
            $prioridad,
            $instrucciones,
            $bloqueo,
            $evento
            ){
                $this->id = $id;
                $this->estado = $estado;
                $this->prioridad = $prioridad;
                $this->instrucciones = $instrucciones;
                $this->bloqueo = $bloqueo;
                $this->evento = $evento;
        }
        // Getters y Setters de la clase Proceso         
        public function getId(){
            return $this->id;
        }


        public function setId($id){
            $this->id = $id;
             return $this;
        }


        public function getEstado(){
            return $this->estado;
        }


        public function setEstado($estado){
            $this->estado = $estado;
            return $this;
        }


        public function getPrioridad(){
            return $this->prioridad;
        }


        public function setPrioridad($prioridad){
            $this->prioridad = $prioridad;
            return $this;
        }


        public function getInstrucciones(){
            return $this->instrucciones;
        }


        public function setInstrucciones($instrucciones){
            $this->instrucciones = $instrucciones;
            return $this;
        }


        public function getBloqueo(){
            return $this->bloqueo;
        }

        public function setBloqueo($bloqueo){
            $this->bloqueo = $bloqueo;
            return $this;
        }


        public function getEvento(){
            return $this->evento;
        }


        public function setEvento($evento){
            $this->evento = $evento;
            return $this;
        }

        //Función para escribir en archivo de texto plano
        public function guardarProceso(){
            $procesosGuardados = file_get_contents('../data/procesos.json');
            $procesos = json_decode($procesosGuardados,true);
            $proceso = array('id' => $this->getId(),'estado' => $this->getEstado(),'prioridad' => $this->getPrioridad(), 'instrucciones' => $this->getInstrucciones(),'bloqueo' => $this->getBloqueo(), 'evento' => $this->getEvento());
            if(sizeof($procesos) > 0){
                $procesos[] = $proceso;
                $archivo = fopen('../data/procesos.json','w');
                fwrite($archivo, json_encode($procesos));
                fclose($archivo);
            }else{
                $procesos = array();
                $procesos[] = $proceso;
                $archivo = fopen('../data/procesos.json','w');
                fwrite($archivo, json_encode($procesos));
                fclose($archivo);
            }
            echo json_encode($procesos);
        }

        public static function eliminarProcesos(){
            $procesosGuardados = file_get_contents('../data/procesos.json');
            $procesos = json_decode($procesosGuardados,true);
            $vaciar[] = array_splice($procesos, 0, count($procesos));
            $archivo = fopen('../data/procesos.json','w');
            fwrite($archivo, json_encode($procesos));
            fclose($archivo);
        }             
    }
?>