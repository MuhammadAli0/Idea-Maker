<?php
date_default_timezone_set('Africa/Cairo');


class homeDB{
    // private $host = '127.0.0.1';
    // private $MySqlUsername = 'root';
    // private $MySqlPassword = '23243125';
    // private $DBname        = 'idea';

    // // private $host = 'db4free.net';
    // // private $MySqlUsername = 'ideamakeruser';
    // // private $MySqlPassword = '23243125';
    // // private $DBname        = 'ideamakerdb';

    private $host = 'sql2.freemysqlhosting.net';
    private $MySqlUsername = 'sql2286394';
    private $MySqlPassword = 'wY5*fC5*';
    private $DBname        = 'sql2286394';

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

    public function GetPosts($user_id){
        if ($user_id != FALSE)
        {
            $dlb = $this->conn->prepare("SELECT b.*,count(b.post_id) FROM Likes a 
            left join Posts b on a.post_id and b.post_id WHERE b.user_id = '$user_id' group by b.post_id
            ");
            $dlb->execute();
            if($dlb->rowCount() > 0){
                $data     = $dlb->fetchAll();
                return $data;
            }else{
                return FALSE;
            }
        } else {
            $dlb = $this->conn->prepare("SELECT * FROM Posts ");
            $dlb->execute();
            if($dlb->rowCount() > 0){
                $data     = $dlb->fetchAll();
                return $data;
            }else{
                return FALSE;
            }
        }
    }

    public function GetLikes($user_id){
        $dlb = $this->conn->prepare("SELECT * FROM Likes WHERE user_id = '$user_id' OR post_id in (SELECT post_id FROM Posts WHERE user_id = '$user_id')");
        $dlb->execute();
        if($dlb->rowCount() > 0){
            $data     = $dlb->fetchAll();
            return $data;
        }else{
            return FALSE;
        }
    }

    public function GetComments($post_id){
        $dlb = $this->conn->prepare("SELECT * FROM Comments WHERE post_id = '$post_id'");
        $dlb->execute();
        if($dlb->rowCount() > 0){
            $data     = $dlb->fetchAll();
            return $data;
        }else{
            return FALSE;
        }
    }

    public function GetName($user_id){
        $dlb = $this->conn->prepare("SELECT fname, lname, profile_picture_url, username FROM users WHERE user_id = '$user_id'");
        $dlb->execute();
        if($dlb->rowCount() > 0){
            $data     =  $dlb->fetch(PDO::FETCH_ASSOC);
            return $data;
        }else{
            return FALSE;
        }
    }

    public function GetUnReadedMessages($user_id){
        $dlb = $this->conn->prepare("SELECT user_id_from, content, date_created FROM Messages WHERE seen IS NULL AND user_id_to ='$user_id'");
        $dlb->execute();
        if($dlb->rowCount() > 0){
            $data     =  $dlb->fetchall();
            return $data;
        }else{
            return FALSE;
        }

    }

    private function GetLikesNtuf($user_id){
        $dlb = $this->conn->prepare("SELECT * FROM Likes WHERE seen IS NULL AND post_id IN (select post_id from Posts WHERE user_id = '$user_id')  ;");
        $dlb->execute();
        if($dlb->rowCount() > 0){
            $data     =  $dlb->fetchall();
            return $data;
        }else{
            return FALSE;
        }
    }

    private function GetCommentsNtuf($user_id){
        $dlb = $this->conn->prepare("SELECT * FROM Comments WHERE seen IS NULL AND post_id IN (select post_id from Posts WHERE user_id = '$user_id')  ;");
        $dlb->execute();
        if($dlb->rowCount() > 0){
            $data     =  $dlb->fetchall();
            return $data;
        }else{
            return FALSE;
        }
    }

    public function GetNuotification($user_id){
        
        return array(
            "likes" => $this->GetLikesNtuf($user_id),
            "comments" => $this->GetCommentsNtuf($user_id)
        );
    }

    public function GetRequests($user_id){
        $dlb = $this->conn->prepare("SELECT request_id, post_id  FROM requests WHERE user_id = '$user_id'");
        $dlb->execute();
        if($dlb->rowCount() > 0){
            $data     =  $dlb->fetchall();
            return $data;
        }else{
            return FALSE;
        }
    }

    public function GetXRequests($user_id){
        $dlb = $this->conn->prepare("SELECT request_id, post_id, user_id  FROM requests WHERE 
        post_id in (select post_id from Posts where user_id = '$user_id')");
        $dlb->execute();
        if($dlb->rowCount() > 0){
            $data     =  $dlb->fetchall();
            return $data;
        }else{
            return FALSE;
        }
    }

    public function GetTopUsers(){
        $dlb = $this->conn->prepare("SELECT a.user_id , count(a.user_id) as comments,
        u.username, u.fname , u.lname, u.skills, u.uType, u.profile_picture_url
            FROM Comments a, users u 
                where a.user_id  = u.user_id
                    group by a.user_id , u.username
                        order by comments DESC 
                            limit 10    
        ");
        $dlb->execute();
        if($dlb->rowCount() > 0){
            $data     =  $dlb->fetchall();
            return $data;
        }else{
            return FALSE;
        } 
    }

    public function GetTopPosts(){
        $dlb = $this->conn->prepare("SELECT 
        users.user_id, username, profile_picture_url, Posts.post_id,
        Posts.title, Posts.caption, Posts.p_status,
        Posts.skills, Posts.date_created
        FROM
            users
                JOIN
            Posts ON Posts.user_id = users.user_id
                LEFT JOIN
            (SELECT 
                Likes.post_id, COUNT(*) AS likes
            FROM
                Likes
            GROUP BY Likes.post_id) Likes ON Posts.post_id = Likes.post_id 
            order by likes desc limit 10;
        ");
        $dlb->execute();
        if($dlb->rowCount() > 0){
            $data     =  $dlb->fetchall();
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
    public $user_id ;



    public function __prepare(){
        $GetDataX = new GetData;
        $data = $GetDataX->getUser($this->username);
        $data = (array) $data;
        $this->home = json_encode(array(
            "user_id" => $data['user_id'],
            "username" => $this->username,
            "profile_pic" => $data['profile_picture_url'],
            "cover_pic" => $data['cover_pic'],
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
            "EnterdDate" => $data['cDateTime'],
            "my_Posts" => $GetDataX->GetPosts($this->user_id),
            "posts" => $GetDataX->GetPosts(FALSE),
            "likes" => $GetDataX->GetLikes($this->user_id),
            "msg" => $GetDataX->GetUnReadedMessages($this->user_id),
            "nutf" => $GetDataX->GetNuotification($this->user_id),
            "requests" => $GetDataX->GetRequests($this->user_id),
            "topUsers" => $GetDataX->GetTopUsers(),
            "topPosts" => $GetDataX->GetTopPosts()


                ));
    }
    public function __GetHeader(){
        $GetDataX = new GetData;
        $data = $GetDataX->getUser($this->username);
        $data = (array) $data;
        $this->home = json_encode(array(
            "user_id" => $data['user_id'],
            "username" => $this->username,
            "profile_pic" => $data['profile_picture_url'],
            "personal" => array(
                "fname"     => $data['fname'],
                "lname"     => $data['lname'],
                "gender"   => $data['gender'],
                "country"  => $data['country'],
                "town"     => $data['town']
            )
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

    public function postIdea($data){

        try{
            $title = filter_var($data['data']['title'], FILTER_SANITIZE_STRING);
            $idea_form = filter_var($data['data']['caption'], FILTER_SANITIZE_STRING);
            $skills = filter_var($data['data']['skills'], FILTER_SANITIZE_STRING);
            $skills = json_encode( explode( ';', $skills) );
            $status = $data['data']['status'];
            $curentDate = date('Y-m-d H:i:s');
            $db = $this->conn->prepare("INSERT INTO Posts (user_id, caption, date_created, title, p_status, skills)
                VALUES(
                    '$this->user_id', 
                    '$idea_form',
                    '$curentDate',
                    '$title',
                    '$status',
                    '$skills'
                    )");
            $db->execute();
            return TRUE;

        } catch (PDOException $e){
            die($e->getMessage());
        }
        return FALSE;
    }

    public function like($post_id){
        try{
            $curentDate = date('Y-m-d H:i:s');
            $this->conn->exec("INSERT INTO Likes (user_id, post_id, date_created)
                VALUES(
                    '$this->user_id', 
                    '$post_id', 
                    '$curentDate'
                    )");
            return TRUE;

        } catch (PDOException $e){
            die($e->getMessage());
        }
    }

    public function comment ($post_id, $comment_form){
        try{
            $form = filter_var($comment_form, FILTER_SANITIZE_STRING);
            $curentDate = date('Y-m-d H:i:s');
            $this->conn->exec("INSERT INTO Comments (post_id, user_id, `content`, date_created)
                VALUES(
                    '$post_id',
                    '$this->user_id', 
                    '$form', 
                    '$curentDate'
                    )");
            return TRUE;
        } catch (PDOException $e){
            die($e);
        }

    }

    public function delIdea ($post_id){

        try{
            $dlb = $this->conn->prepare("SELECT user_id FROM Posts WHERE post_id = '$post_id' AND user_id = '$this->user_id'");
            $dlb->execute();
        if($dlb->rowCount() > 0){
            $d2 = $this->conn->prepare("DELETE FROM Comments WHERE post_id = '$post_id';
            DELETE FROM requests WHERE post_id = '$post_id';
            DELETE FROM Likes WHERE post_id = '$post_id';
            DELETE FROM Posts WHERE post_id = '$post_id' AND user_id = '$this->user_id';");
            $d2->execute();
            return TRUE;
        }else{
            return FALSE;
        }
        } catch (PDOException $e){
            die($e->getMessage());
        }
    }

    public function delComment ($comment_id){
        try{
            $this->conn->exec("DELETE FROM Comments WHERE comment_id = '$comment_id' and user_id = '$this->user_id'");
            return TRUE;
        } catch (PDOException $e){
            die($e->getMessage());
        }

    }

    public function unLike ($post_id){
        try{
            $this->conn->exec("DELETE FROM Likes WHERE user_id = '$this->user_id' AND post_id = '$post_id'");
            return TRUE;
        } catch (PDOException $e){
            die($e->getMessage());
        }

    }

    public function SendReuest($data){
        try{
            $curentDate = date('Y-m-d H:i:s');
            $post_id =  $data['post_id'];
            $head = filter_var($data['head'], FILTER_SANITIZE_STRING);
            $body = filter_var($data['caption'], FILTER_SANITIZE_STRING, FILTER_SANITIZE_MAGIC_QUOTES);
            
            if (isset($data['price_from'])){
                $salary1 = $data['price_from'];
                $salary2 = $data['price_to'];
                $dlp = $this->conn->prepare("INSERT INTO requests (`post_id`, `user_id`, `head`, `body`, `request_time`, `salary_from`, `slalary_to`)
                VALUES(
                    '$post_id', 
                    '$this->user_id', 
                    '$head',
                    '$body',
                    '$curentDate',
                    '$salary1',
                    '$salary2'
                    )");
                $dlp->execute();
                $mssg = "<b>*-- DEVOLOP REQUEST --*</b><br>*--- " . $head . " ---*<br>". $body . "<br>With Average Cost  " . $salary1 . "$ to " . $salary2 . "$<br>";
                $this->conn->exec("INSERT INTO  Messages (user_id_from, user_id_to, content, date_created) 
                VALUES (
                    '$this->user_id',
                    (SELECT user_id FROM Posts WHERE post_id = '$post_id'),
                    '$mssg',
                    '$curentDate'
                    )");
                return TRUE;

            } else {
                $dlp = $this->conn->prepare("INSERT INTO requests (`post_id`, `user_id`, `head`, `body`, `request_time`)
                VALUES(
                    '$post_id', 
                    '$this->user_id', 
                    '$head',
                    '$body',
                    '$curentDate'
                    )");
                $dlp->execute();
                $mssg = "<b>*-- INVEST REQUEST --*</b><br>*--- " . $head . " ---*<br>". $body . "<br>";
                $this->conn->exec("INSERT INTO  Messages (user_id_from, user_id_to, content, date_created) 
                VALUES (
                    '$this->user_id',
                    (SELECT user_id FROM Posts WHERE post_id = '$post_id'),
                    '$mssg',
                    '$curentDate'
                    )");

                return TRUE;

            }
            

        } catch (PDOException $e){
            die($e->getMessage());
        }
    }

    public function GetUpdate (){
        
    }


    function __destruct(){
    }



}

