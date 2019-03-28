<?php
date_default_timezone_set('Africa/Cairo');


class homeDB{
    private $host = 'db4free.net';
    private $MySqlUsername = 'ideamakeruser';
    private $MySqlPassword = '23243125';
    private $DBname        = 'ideamakerdb';

    // private $host = '127.0.0.1';
    // private $MySqlUsername = 'root';
    // private $MySqlPassword = '23243125';
    // private $DBname        = 'mydb';

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
            self::$instance = new homeDB();
        }
        return self::$instance;
    }

    function __destruct(){
        $this->conn->commit();
        $this->conn = null; 
    }

}

class GetData{

    private $conn;
    function  __construct(){
        $DB = homeDB::getInstance();
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

    public function getWork($user_id){
        $dlb = $this->conn->prepare("SELECT * FROM work WHERE user_id = '$user_id'");
        $dlb->execute();
        if($dlb->rowCount() > 0){
            $data     = $dlb->fetch(PDO::FETCH_ASSOC);
            return $data;
        }else{
            return FALSE;
        }
    }

    public function getUniversity($user_id){
        $dlb = $this->conn->prepare("SELECT * FROM University WHERE user_id = '$user_id'");
        $dlb->execute();
        if($dlb->rowCount() > 0){
            $data     = $dlb->fetch(PDO::FETCH_ASSOC);
            return $data;
        }else{
            return FALSE;
        }
    }
}

class retriveHome {
    public $home ;
    public $name ;
    public $email;
    public $username;



    public function __prepare(){
        $GetDataX = new GetData;
        $data = $GetDataX->getUser($this->username);
        $data = (array) $data;
        $this->home = json_encode(array(
            "user_id" => $data['user_id'],
            "username" => $this->username,
            "personal" => array(
                "fname"     => $data['fname'],
                "lname"     => $data['lname'],
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

class userActions extends retriveHome {

    public $user_id ;
    public $post_id ;
    public $like_id ;
    public $comment_id ;
    private $conn;

    function  __construct($user_id){
        $DB = homeDB::getInstance();
        $this->conn = $DB->conn;
        $this->user_id = $user_id;
    }

    public function postIdea($idea_form){
        try{
            $curentDate = date('Y-m-d H:i:s');
            $this->conn->exec("INSERT INTO Posts (user_id, caption, date_created)
                VALUES(
                    '$this->user_id', 
                    '$idea_form', 
                    '$curentDate'
                    ");
            return TRUE;

        } catch (PDOException $e){
            die($e->getMessage());
        }

    }

    public function like($post_id){
        try{
            $curentDate = date('Y-m-d H:i:s');
            $this->conn->exec("INSERT INTO likes (user_id, post_id, date_created)
                VALUES(
                    '$this->user_id', 
                    '$post_id', 
                    '$curentDate'
                    ");
            return TRUE;

        } catch (PDOException $e){
            die($e->getMessage());
        }
    }

    public function comment ($post_id, $comment_form){
        try{
            $curentDate = date('Y-m-d H:i:s');
            $this->conn->exec("INSERT INTO Comments (post_id, user_id, content, date_created)
                VALUES(
                    '$post_id',
                    '$this->user_id', 
                    '$comment_form', 
                    '$curentDate'
                    ");
            return TRUE;
        } catch (PDOException $e){
            die($e->getMessage());
        }

    }

    public function delIdea ($post_id){
        try{
            $this->conn->exec("DELETE FROM Posts WHERE post_id = '$post_id'");
            return TRUE;
        } catch (PDOException $e){
            die($e->getMessage());
        }
    }

    public function delComment ($comment_id){
        try{
            $this->conn->exec("DELETE FROM Comments WHERE comment_id = '$comment_id'");
            return TRUE;
        } catch (PDOException $e){
            die($e->getMessage());
        }

    }

    public function unLike ($post_id){
        try{
            $this->conn->exec("DELETE FROM Comments WHERE user_id = '$this->user_id' AND post_id = '$post_id'");
            return TRUE;
        } catch (PDOException $e){
            die($e->getMessage());
        }

    }
    

    function __destruct(){
    }



}

