<?php

require  __DIR__ .  '/../../vendor/autoload.php';

class DataBase {
    private $host = '127.0.0.1';
    private $MySqlUsername = 'root';
    private $MySqlPassword = '23243125';
    private $DBname        = 'profile';
    // private $log;

    public $conn;

    private static $instance;

    function __construct(){
        $conn = new PDO("mysql:host=$this->host;dbname=$this->DBname", $this->MySqlUsername, $this->MySqlPassword);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $conn->beginTransaction();
        $this->conn = $conn;
        // $this->log  = new Log();
        // $this->log->write(json_encode(array(
        // "status" => 200,
        // "message" => "Second DataBase Session Closed",
        
        // )));
    }

    public static function getInstance(){
        if(!isset(self::$instance)) 
        {
            self::$instance = new DataBase();
            // $this->log->write("Second DataBase Instance Taken");

        }

        return self::$instance;
    }

    function __destruct(){
        $this->conn = null; 
        // $this->log->write("Second DataBase Session Closed");

    }

}

?>