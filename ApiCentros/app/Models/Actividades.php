<?php
namespace App\Models;

class Actividades extends DBAbstractModel
{
    private static $instancia;


    public static function getInstancia()
    {
        if (!isset(self::$instancia)) {
            $miClase = __CLASS__;
            self::$instancia = new $miClase;
        }
        return self::$instancia;
    }

    public function __clone()
    {
        trigger_error('La clonación no es permitida!.', E_USER_ERROR);
    }

    // Para obtener una actividad por id de centro
    public function get($sh_data = array()){
    

        foreach ($sh_data as $campo=>$valor) {
            $$campo = $valor;
        }
    
        if(isset($id)){
            $this->query = "SELECT * FROM Actividades WHERE centro_id = :centro_id";

            // Cargamos los parametros
            $this->parametros['centro_id'] = $id;

        }

        // Ejecución de la consulta
        $this->getResultFromQuery();

        if(count($this->rows) == 1){
            foreach ($this->rows[0] as $propiedad=>$valor){
                $this->$propiedad = $valor;
            }
            $this->mensaje = 'Instalaciones encontrado';
        } else {
            $this->mensaje = 'Instalaciones no encontrado';
        }
        return $this->rows ?? null;
    }

    public function getByFilter($sh_data = array()) {
        if (!is_array($sh_data)) {
            return null;
        }
    
        $this->query = "SELECT id, nombre, descripcion, fecha_inicio, fecha_final, horario, plazas FROM Actividades";
        $this->parametros = [];
        $conditions = [];
    
        if (!empty($sh_data['nombre'])) {
            $conditions[] = "nombre LIKE :nombre";
            $this->parametros['nombre'] = '%' . $sh_data['nombre'] . '%';
        }
    
        if (!empty($sh_data['descripcion'])) {
            $conditions[] = "descripcion LIKE :descripcion";
            $this->parametros['descripcion'] = '%' . $sh_data['descripcion'] . '%';
        }
    
        if (!empty($sh_data['fecha_inicio'])) {
            $conditions[] = "fecha_inicio = :fecha_inicio";
            $this->parametros['fecha_inicio'] = $sh_data['fecha_inicio'];
        }
    
        if (!empty($sh_data['fecha_final'])) {
            $conditions[] = "fecha_final = :fecha_final";
            $this->parametros['fecha_final'] = $sh_data['fecha_final'];
        }
    
        if (!empty($sh_data['horario'])) {
            $conditions[] = "horario LIKE :horario";
            $this->parametros['horario'] = '%' . $sh_data['horario'] . '%';
        }
    
        if (!empty($sh_data['plazas'])) {
            $conditions[] = "plazas = :plazas";
            $this->parametros['plazas'] = $sh_data['plazas'];
        }
    
        // En caso de que haya condiciones se agregan al query
        if (!empty($conditions)) {
            $this->query .= " WHERE " . implode(" AND ", $conditions);
        }
    
         // Ejecución de la consulta
        $this->getResultFromQuery();
    
        
        $this->mensaje = count($this->rows) > 0 ? 'Actividades encontradas' : 'Actividades no encontradas';
    
        return $this->rows ?? null;
    }
    

    public function set(){}
    public function edit(){}
    public function delete(){}
    

}

?>