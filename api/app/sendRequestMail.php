<?php
require_once __DIR__ . '/app.php';


class SendRequestMail extends mailer
{

    private $conn;

    function __construct()
    {
        $DB = homeDB::getInstance();
        $this->conn = $DB->conn;
    }
    public function sendRequestMail($user_id)
    {
        $RequestData = $this->GetLastRequest($user_id);
        $head = $RequestData['head'];
        $body = $RequestData['body'];
        $post_id = $RequestData['post_id'];
        $dateTime = $RequestData['request_time'];
        $data = $this->GetRequre($post_id);

        if ($data != false) {
            $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
            $name = filter_var($data['fname'], FILTER_SANITIZE_STRING);

            $this->CreateRequestMail($head, $body, $dateTime, $data['fname'], $GLOBALS['HostNameUrl']);

            $this->sendMail($email, $name, "Idea-Maker Team");
        }
    }


    private function GetRequre($post_id)
    {

        $dlb = $this->conn->prepare("SELECT email, fname FROM users WHERE  user_id  = (select user_id from Posts WHERE post_id = '$post_id');");
        $dlb->execute();
        if ($dlb->rowCount() > 0) {
            $data     =  $dlb->fetch(PDO::FETCH_ASSOC);
            return $data;
        } else {
            return FALSE;
        }
    }

    private function GetLastRequest($user_id){
        $dlb = $this->conn->prepare("SELECT * FROM requests WHERE user_id = '$user_id' order by request_id ASC limit 1;");
        $dlb->execute();
        if ($dlb->rowCount() > 0) {
            $data     =  $dlb->fetch(PDO::FETCH_ASSOC);
            return $data;
        } else {
            return FALSE;
        }
    }


    function __destruct()
    {
        exit();
    }
}

var_dump($argv);
$sendMail = new SendRequestMail();
$sendMail->sendRequestMail($argv[1]);