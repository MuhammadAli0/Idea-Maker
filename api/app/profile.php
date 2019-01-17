<?php


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

class GetRequerd{

    private $conn;
    function  __construct(){
        $DB = profileDB::getInstance();
        $this->conn = $DB->conn;
    }

    public function getUser($username){
        $dlb = $this->conn->prepare("SELECT * FROM users WHERE username = '$username'");
        $dlb->execute();
        if($dlb->rowCount() > 0){
            $data     = $dlb->fetch(PDO::FETCH_ASSOC);
            return $data;
        }else{
            return FALSE;
        }
    }
}



class retriveProfile{
    public $profile ;
    public $name ;
    public $email;
    public $username;



    public function __prepare(){
        $GetDataX = new GetRequerd;
        $data = $GetDataX->getUser($this->username);
        $data = (array) $data;
        $this->profile = json_encode(array(
            "username" => $this->username,
            "personal" => array(
                "name"     => $this->name,
                "gender"   => $data['gender'],
                "country"  => $data['country'],
                "town"     => $data['town'],
                "contact"  => array(
                    "email"    => $this->email,
                    "phone"    => $data['phone'])
            ),
            "accType"  => $data['uType'],
            "EnterdDate" => $data['cDateTime']

                ));
    }

}



?>

