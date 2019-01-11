<?php
require '../vendor/autoload.php';
require 'mail.php';

// Create and configure Slim app
$config = ['settings' => [
    'addContentLengthHeader' => false,
]];
$app = new \Slim\App($config);

// set the default timezone to use. 
date_default_timezone_set('UTC');

    
class Register {
    protected $username;
    protected $Fname;
    protected $Lname;
    protected $gender;
    protected $email;
    protected $phone;
    protected $country;
    protected $town;
    protected $type;
    protected $hash;
    protected $signedDate;
    protected $status;

    public $errors = [];

    function load($User, $FirstName, $LastName, $Sex, $PhoneNumber, $EmailAddress, $MyCountry, $MyTown, $AccType, $Password ){
        $this->username = $User;
        $this->Fname    = $FirstName;
        $this->Lname    = $LastName;
        $this->gender   = $Sex;
        $this->country  = $MyCountry;
        $this->town     = $MyTown;
        $this->email    = $EmailAddress;
        $this->phone    = $PhoneNumber;
        $this->type     = $AccType;
        $this->hash     = md5($Password);
        $this->signedDate = date('Y-m-d H:i:s');
        $this->status   ='DisActive';
        
    }

    protected function isValidForm($conn){
        $error = $this->errors;
        if ($error == NULL){
            $this->errors['Status'] = 200;
            $this->errors['username'] = NULL;
            $this->errors['email'] = NULL;
            $this->errors['phone'] = NULL;
            $this->isValidUsername($conn);
            $this->isValidEmail($conn);
            $this->isValidPhone($conn);
        }

    }

    private function isValidUsername($conn){
        $query = $conn->prepare("SELECT username FROM users WHERE username = '$this->username'");
        $query->execute();
        if ($query->rowCount() > 0){
            $this->errors['username'] = "Already in use";
            $this->errors['Status'] = $this->errors['Status'] + 100;
        
        }

    }

    private function isValidEmail($conn){


        $query = $conn->prepare("SELECT email FROM users WHERE email = '$this->email'");
        $query->execute();
        if ($query->rowCount() > 0){
            $this->errors['email'] = "Already in use";
            $this->errors['Status'] = $this->errors['Status'] + 100;
        }
    }

    private function isValidPhone($conn){
        $query = $conn->prepare("SELECT phone FROM users WHERE phone = '$this->phone'");
        $query->execute();
        if ($query->rowCount() > 0){
            $this->errors['phone'] = "Already in use";
            $this->errors['Status'] = $this->errors['Status'] + 100;
        
        }
    }
        
    public function verfication($zmail){
        $to      = $zmail; 
        $subject = 'Signup | Verification';
        $message = "
 
        Thanks $this->Fname for signing up!
        Your account has been created, you can login with the following credentials after you have activated your account by pressing the url below.
         
        ------------------------
        Username: '.$this->username.'
        Password: '.$this->phone.'
        ------------------------
         
        Please click this link to activate your account:
        http://www.yourwebsite.com/verify.php?email='.$zmail.'&hash='.$this->hash.'
         
        ";
                             
        $headers = 'From:noreply@yourwebsite.com' . "\r\n"; // Set from headers
        mail($to, $subject, $message, $headers); // Send our email
    }
} 

class DataHandeler extends Register{
    private $host = '127.0.0.1';
    private $MySqlUsername = 'root';
    private $MySqlPassword = '23243125';
    private $DBname        = 'profile';

    private static $instance;

    public function regist(){
        try {
            $conn = new PDO("mysql:host=$this->host;dbname=$this->DBname", $this->MySqlUsername, $this->MySqlPassword);
                    // set the PDO error mode to exception
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $conn->beginTransaction();
            $this->isValidForm($conn);
           
            if ($this->errors['Status'] == 200){
                $conn->exec("INSERT INTO users (username, gender, email, phone, country, town, pwHash, uType, cDateTime, accStatus)
                VALUES(
                    '$this->username', 
                    '$this->gender', 
                    '$this->email', 
                    '$this->phone', 
                    '$this->country', 
                    '$this->town', 
                    '$this->hash', 
                    '$this->type', 
                    '$this->signedDate', 
                    '$this->status')
                    ");
                

                $conn->exec("INSERT INTO uname(username, fname, lname)
                VALUES(
                    '$this->username',
                    '$this->Fname',
                    '$this->Lname' 
                    )
                    ");
            }
            $conn->commit();


            }
        catch(PDOException $e)
            {
                die($e->getMessage());
            }

    }

    public static function getInstance(){
        // Check is $_instance has been set
        if(!isset(self::$instance)) 
        {
            // Creates sets object to instance
            self::$instance = new DataHandeler();
        }

        // Returns the instance
        return self::$instance;
    }

}
    

// Define app routes
// ------------- REGISTER -------------------

$app->post('/register', function($request, $response){
    $data=$request->getParsedBody();
    
    $inputData = [];
    $inputData['username']  = filter_var($data['username'], FILTER_SANITIZE_STRING);
    $inputData['fname']     = filter_var($data['fname'],    FILTER_SANITIZE_STRING);
    $inputData['lname']     = filter_var($data['lname'],    FILTER_SANITIZE_STRING);
    $inputData['gender']    = filter_var($data['gender'],   FILTER_SANITIZE_STRING);
    $inputData['email']     = filter_var($data['email'],    FILTER_SANITIZE_EMAIL);
    $inputData['phone']     = filter_var($data['phone'],    FILTER_SANITIZE_STRING);
    $inputData['country']   = filter_var($data['country'],  FILTER_SANITIZE_STRING);
    $inputData['town']      = filter_var($data['town'],     FILTER_SANITIZE_STRING);
    $inputData['password']  = filter_var($data['password'], FILTER_SANITIZE_STRING);
    $inputData['type']      = filter_var($data['type'],     FILTER_SANITIZE_STRING);
    
    $register = DataHandeler::getInstance();
    $register->load(
        $inputData['username'], 
        $inputData['fname'], 
        $inputData['lname'], 
        $inputData['gender'], 
        $inputData['phone'], 
        $inputData['email'], 
        $inputData['country'], 
        $inputData['town'], 
        $inputData['type'], 
        $inputData['password']
    );

    if ($register)
        {   
            $register->regist();
            $response->getBody()->write(json_encode($register->errors));
        }else{
            $response->getBogdy()->write(json_encode($register->errors));
        }
    

        // $name = $_POST['name'];
    // $phone = $_POST['phone'];
    // $response->getBody()->write("\nDear ".$name." Your phone Number is ". $phone ."\n");
    // $response->getBody()->write("\nDear ".$inputData['name']." Your phone Number is ". $inputData['phone'] ."\n");
   
    // $out = [];
    // $out['Status'] = 200; 
    // $out['Message'] = 'This is test';
    // $out['Name'] = $inputData['name'] ;
    // $out['Phone'] = $inputData['phone'] ;
    // $out['datetime'] = date('l jS F Y h:i:s A');

});


// Run app
$app->run();

