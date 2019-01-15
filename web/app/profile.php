<?php
require  __DIR__ . '/../../vendor/autoload.php';


class profileDB{
    private $host = 'sql2.freemysqlhosting.net';
    private $MySqlUsername = 'sql2273620';
    private $MySqlPassword = 'hM6!mZ9*';
    private $DBname        = 'sql2273620';

    public $conn;

    private static $instance;

    function __construct(){
        try{
            $conn = new PDO("mysql:host=$this->host;dbname=$this->DBname;charset=utf8", $this->MySqlUsername, $this->MySqlPassword, []);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $conn->beginTransaction();
            $this->conn = $conn;
        }catch(PDOException $e)
        {
            die($e->getMessage());
        }
    }

    public static function getInstance(){
        if(!isset(self::$instance)) 
        {
            self::$instance = new profileDB();
        }
        return self::$instance;
    }

    function __destruct(){
        $this->conn->commit();
        $this->conn = null; 
    }

}

class GetRequre{

    private $conn;
    function  __construct(){
        $DB = profileDB::getInstance();
        $this->conn = $DB->conn;
    }

    protected function GetName($username){
        $user = $username;
        $dlb = $this->conn->prepare("SELECT fname, lname FROM uname WHERE username = '$user'");
        $dlb->execute();
        if($dlb->rowCount() > 0){
            $name     = $dlb->fetch(PDO::FETCH_ASSOC);
            return json_encode($name);
        }else{
            return FALSE;
        }
    }




}

class profilePicuture{
    private $picLink;

    function __construct(){

    }

    public function upload(){

    }

}

class retriveProfile extends GetRequre{
    function __constant($username){
        $name = $this->GetName($username);
        

    }
}


?>

