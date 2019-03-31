<?php
date_default_timezone_set('Africa/Cairo');


class profileDB
{
    // private $host = 'db4free.net';
    // private $MySqlUsername = 'ideamakeruser';
    // private $MySqlPassword = '23243125';
    // private $DBname        = 'ideamakerdb';

    
    private $host = '127.0.0.1';
    private $MySqlUsername = 'root';
    private $MySqlPassword = '23243125';
    private $DBname        = 'mydb';

    public $conn;

    private static $instance;

    function __construct()
    {
        try {
            $conn = new PDO("mysql:host=$this->host;dbname=$this->DBname;charset=utf8", $this->MySqlUsername, $this->MySqlPassword, []);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $conn->beginTransaction();
            $this->conn = $conn;
        } catch (PDOException $e) {
            die($e->getMessage());
        }
    }

    public static function getInstance()
    {
        if (!isset(self::$instance)) {
            self::$instance = new profileDB();
        }
        return self::$instance;
    }

    function __destruct()
    {
        $this->conn->commit();
        $this->conn = null;
    }

}


class retrieveProfile {


    public $profile;
    public $name;
    public $email;
    public $phone;
    public $username;
    public $country;
    public $town;
    public $lname;
    public $fname;
    public $summary;
    public $gender;
    public $date;
    public $user_id;
    public $skills;


    public function __prepare(){
        $GetDataX = new GetData;
        $data = $GetDataX->getUser($this->username);
        $data = (array) $data;
        $rData = (array) $GetDataX->getWork($this->user_id);
        $unData = (array) $GetDataX->getUniversity($this->user_id);

        $this->profile = json_encode(array(
            "user_id" => $data['user_id'],
            "username" => $this->username,
            "profile_pic" => $data['profile_picture_url'],
            "skills" => $data['skills'],
            "personal" => array(
                "fname"     => $data['fname'],
                "lname"     => $data['lname'],
                "gender"   => $data['gender'],
                "country"  => $data['country'],
                "town"     => $data['town'],
                "date" => $data['birth_date'],
                "summary" => $data['summary'],
                "contact"  => array(
                    "email"    => $this->email,
                    "phone"    => $data['phone'])
            ),
            "work"  => $rData,
            "University" => $unData,
            "posts" => (array) $GetDataX->GetPosts($this->user_id),
            "likes" => (array) $GetDataX->GetLikes($this->user_id),
            "accType"  => $data['uType'],
            "EnterdDate" => $data['cDateTime']

                ));
    }

}


class UpdateProfile extends retrieveProfile
{

    private $conn;
    public $error;
    

    function __construct()
    {
        $DB = profileDB::getInstance();
        $this->conn = $DB->conn;
    }

    public function summaryUpdate($data){
        try{
            $summary = $data['data']['summary'];
            $dlp = $this->conn->prepare(" UPDATE users set summary = '$summary' WHERE user_id = '$this->user_id'");
            $dlp->execute();
            return true;
        
        } catch (ERROR $Er){
            return FALSE;
        }

    }

    public function UpdateSkills($data){
        try{
            $skills = $data['data']['skills'];
            $skills = json_encode( explode( ';', $skills) );
            $dlp = $this->conn->prepare(" UPDATE users set skills = '$skills' WHERE user_id = '$this->user_id'");
            $dlp->execute();
            return true;
        
        } catch (ERROR $Er){
            return FALSE;
        }

    }

    public function UpdateLocation($data){
        try{
            $country = $data['data']['country'];
            $town =  $data['data']['town'];
            $dlp = $this->conn->prepare(" UPDATE users set country = '$country', town = '$town' WHERE user_id = '$this->user_id'");
            $dlp->execute();
            return true;
        
        } catch (ERROR $Er){
            return FALSE;
        }

    }


    public function PersonalDataUpdate()
    {

        try {
            $curentDate = date('Y-m-d H:i:s');
            $dlp = $this->conn->prepare("UPDATE users 
                SET 
                    fname   = '$this->fname',
                    lname   = '$this->lname',
                    email   = '$this->email',
                    phone   = '$this->phone', 
                    country = '$this->country', 
                    town    = '$this->town',
                    gender  = '$this->gender',
                    summary = '$this->summary',
                    birth_date    = '$this->date',
                    uDateTime = '$curentDate'

                WHERE
                    username = '$this->username'
                ");

            $dlp->execute();


            return true;
        } catch (PDOException $e) {
            $this->error = $e;
            return false;
        }
    }

    public function WorkUpdate($workData){

        try {
            // $curentDate = date('Y-m-d H:i:s');
            $workName = $workData['data']['organization'];
            $position = $workData['data']['position'];
            $number  = $workData['data']['number'];
            $sDate    = $workData['data']['sDate'];
            $eDate    = $workData['data']['eDate'];
            $summary  = $workData['data']['summary'];

            $dlb = $this->conn->prepare("SELECT work_id FROM work WHERE user_id = '$this->user_id' and work_id_user_id = '$number'");
                $dlb->execute();
                if($dlb->rowCount() > 0){
                    $dddata     = $dlb->fetch(PDO::FETCH_ASSOC);
                    $dddata = (array) $dddata;
                    $dddata = $dddata['work_id'];

                    $dlp = $this->conn->prepare("INSERT INTO work (work_id, user_id, work_name, position, work_id_user_id, started_date, end_date, summary) 
                VALUES ('$dddata', '$this->user_id', '$workName', '$position', '$number',  '$sDate', '$eDate', '$summary')
                ON DUPLICATE KEY UPDATE
                user_id   = '$this->user_id',
                work_name = '$workName', 
                position  = '$position', 
                work_id_user_id = '$number',
                started_date = '$sDate',
                end_date  =  '$eDate',
                summary = '$summary'
                ");

                $dlp->execute();


                return true;
                }else{
                    $dlp = $this->conn->prepare("INSERT INTO work (user_id, work_name, position, work_id_user_id, started_date, end_date, summary) 
                VALUES ('$this->user_id', '$workName', '$position', '$number',  '$sDate', '$eDate', '$summary')
                ON DUPLICATE KEY UPDATE
                work_name = '$workName', 
                position  = '$position', 
                work_id_user_id = '$number',
                started_date = '$sDate',
                end_date  =  '$eDate',
                summary = '$summary'
                ");

            $dlp->execute();


            return true;

                }

            
        } catch (PDOException $e) {
            $this->error = $e;
            return false;
        }

    }


    public function unvirstyUpdate($uData){

            try {
                // $curentDate = date('Y-m-d H:i:s');
                $university_name = $uData['data']['university_name'];
                $college_degree  = $uData['data']['college_degree'];
                $start_study     = $uData['data']['start_study'];
                $end_study       = $uData['data']['end_study'];
                $summary         = $uData['data']['summary'];
    
                $dlb = $this->conn->prepare("SELECT uni_id FROM University WHERE user_id = '$this->user_id'");
                $dlb->execute();
                if($dlb->rowCount() > 0){
                    $dddata     = $dlb->fetch(PDO::FETCH_ASSOC);
                    $dddata = (array) $dddata;
                    $dddata = $dddata['uni_id'];

                    $dlp = $this->conn->prepare("INSERT INTO University (uni_id, user_id, uni_name, study_field, startDate, endDate, summary) 
                    VALUES ('$dddata', '$this->user_id', '$university_name', '$college_degree',  '$start_study', '$end_study', '$summary')
                    ON DUPLICATE KEY UPDATE
                    uni_name = '$university_name', 
                    study_field  = '$college_degree', 
                    startDate = '$start_study',
                    endDate  =  '$end_study',
                    summary = '$summary'
                    ");
    
                    $dlp->execute();
                    return true;

                 }else{
                    $dlp = $this->conn->prepare("INSERT INTO University (user_id, uni_name, study_field, startDate, endDate, summary) 
                    VALUES ('$this->user_id', '$university_name', '$college_degree',  '$start_study', '$end_study', '$summary')
                    ON DUPLICATE KEY UPDATE
                    uni_name = '$university_name', 
                    study_field  = '$college_degree', 
                    startDate = '$start_study',
                    endDate  =  '$end_study',
                    summary = '$summary'
                    ");
    
                    $dlp->execute();
                    return true;
                }

                    
            } catch (PDOException $e) {
                $this->error = $e;
                return false;
            }

    }

    public function SetLinkToDb($link){
     
        try{
            $dlp = $this->conn->prepare(" UPDATE users set profile_picture_url = '$link' WHERE user_id = '$this->user_id'");
            $dlp->execute();
            return true;
        
        } catch (ERROR $Er){
            return FALSE;
        }
    }

}


// try {
//     // $curentDate = date('Y-m-d H:i:s');
//     $university_name = $uData['data']['university_name'];
//     $college_degree  = $uData['data']['college_degree'];
//     $start_study     = $uData['data']['start_study'];
//     $end_study       = $uData['data']['end_study'];
//     $summary         = $uData['data']['summary'];

//     $dlb = $this->conn->prepare("SELECT uni_id FROM University WHERE user_id = '$this->user_id'");
//     $dlb->execute();
//     if($dlb->rowCount() > 0){
//         $dddata     = $dlb->fetch(PDO::FETCH_ASSOC);
//         $dddata = (array) $dddata;
//         $dddata = $dddata['uni_id'];

//         $dlp = $this->conn->prepare("UPDATE  University 
//         set 
//         uni_name = '$university_name', 
//         study_field  = '$college_degree', 
//         startDate = '$start_study',
//         endDate  =  '$end_study',
//         summary = '$summary'
//         WHERE user_id = '$this->user_id' 
//         and uni_id = '$dddata'");

//         $dlp->execute();
//         return true;

//      }else{
//         $dlp = $this->conn->prepare("INSERT INTO University (user_id, uni_name, study_field, year, startDate, endDate, summary) 
//         VALUES ('$this->user_id', '$university_name', '$college_degree', '$year',  '$start_study', '$end_study', '$summary')
//         ON DUPLICATE KEY UPDATE
//         uni_name = '$university_name', 
//         study_field  = '$college_degree', 
//         startDate = '$start_study',
//         endDate  =  '$end_study',
//         summary = '$summary'
//         ");

//         $dlp->execute();
//         return true;
//     }

        
// } catch (PDOException $e) {
//     $this->error = $e;
//     return false;
// }


?>

