<?php
require __DIR__ . '/../../vendor/autoload.php';
require __DIR__ . '/log.php';
require __DIR__ . '/profile.php';
require __DIR__ . '/home.php';




use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Slim\Container;
use Slim\Http\Request;
use Slim\Http\Response;
use \Firebase\JWT\JWT;

// Create and configure Slim app
$config = ['settings' => [
    'addContentLengthHeader' => false,
    'displayErrorDetails' => true,
]];
$app = new \Slim\App($config);
date_default_timezone_set('UTC');


class mailer
{
    private $host = "smtp.gmail.com";
    private $smtpAut = true;
    private $EmailAddress = "mohamed007258@gmail.com";
    private $EmailPassword = "ruiimlicrvbiaenh";
    private $smtpProto = "tls";
    private $mailPort = 587;
    private $mail;

    private $body;
    private $footer = "\n \n\ \n \nCreated By organizing team";


    private function load()
    {
        $this->mail = new PHPMailer(true);
        $this->mail->isSMTP();
        $this->mail->Host = $this->host;
        $this->mail->SMTPAuth = $this->smtpAut;
        $this->mail->Username = $this->EmailAddress;
        $this->mail->Password = $this->EmailPassword;
        $this->mail->SMTPSecure = $this->smtpProto;
        $this->mail->Port = $this->mailPort;
    }

    protected function CreateVerficationMailBody($code, $name, $user)
    {
        $this->load();
        $MailBody = <<<"EOD"
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Neopolitan Welcome Email</title>
            <!-- Designed by https://github.com/kaytcat -->
            <!-- Robot header image designed by Freepik.com -->
        
            <style type="text/css">
                @import url(http://fonts.googleapis.com/css?family=Droid+Sans);
        
                /* Take care of image borders and formatting */
        
                img {
                    max-width: 600px;
                    outline: none;
                    text-decoration: none;
                    -ms-interpolation-mode: bicubic;
                }
        
                a {
                    text-decoration: none;
                    border: 0;
                    outline: none;
                    color: #bbbbbb;
                }
        
                a img {
                    border: none;
                }
        
                /* General styling */
        
                td,
                h1,
                h2,
                h3 {
                    font-family: Helvetica, Arial, sans-serif;
                    font-weight: 400;
                }
        
                td {
                    text-align: center;
                }
        
                body {
                    -webkit-font-smoothing: antialiased;
                    -webkit-text-size-adjust: none;
                    width: 100%;
                    height: 100%;
                    color: #37302d;
                    background: #ffffff;
                    font-size: 16px;
                }
        
                table {
                    border-collapse: collapse !important;
                }
        
                .headline {
                    color: #ffffff;
                    font-size: 36px;
                }
        
                .force-full-width {
                    width: 100% !important;
                }
            </style>
        
            <style type="text/css" media="screen">
                @media screen {
        
                    /*Thanks Outlook 2013! http://goo.gl/XLxpyl*/
                    td,
                    h1,
                    h2,
                    h3 {
                        font-family: 'Droid Sans', 'Helvetica Neue', 'Arial', 'sans-serif' !important;
                    }
                }
            </style>
        
            <style type="text/css" media="only screen and (max-width: 480px)">
                /* Mobile styles */
                @media only screen and (max-width: 480px) {
        
                    table[class="w320"] {
                        width: 320px !important;
                    }
        
        
                }
            </style>
        </head>
        
        <body class="body" style="padding:0; margin:0; display:block; background:#ffffff; -webkit-text-size-adjust:none"
            bgcolor="#ffffff">
            <table align="center" cellpadding="0" cellspacing="0" width="100%" height="100%">
                <tr>
                    <td align="center" valign="top" bgcolor="#ffffff" width="100%">
                        <center>
                            <table style="margin: 0 auto;" cellpadding="0" cellspacing="0" width="600" class="w320">
                                <tr>
                                    <td align="center" valign="top">
        
                                        <table style="margin: 0 auto;" cellpadding="0" cellspacing="0" width="100%" style="margin:0 auto;">
                                            <tr>
                                                <td style="font-size: 30px; text-align:center;">
                                                </td>
                                            </tr>
                                        </table>
        
                                        <table style="margin: 0 auto;" cellpadding="0" cellspacing="0" width="100%" bgcolor="#4dbfbf">
                                            <tr>
                                                <td>
                                                    <br>
                                                    <img src="https://www.filepicker.io/api/file/Pv8CShvQHeBXdhYu9aQE" width="216"
                                                        height="189" alt="robot picture">
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="headline">
                                                    Welcome $name !
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
        
                                                    <center>
                                                        <table style="margin: 0 auto;" cellpadding="0" cellspacing="0" width="60%">
                                                            <tr>
                                                                <td style="color:#187272;">
                                                                    <br>
                                                                    You have registed with username $user 
                                                                    Hope you feel  like 127.0.0.1
                                                                    <br>
                                                                    <br>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </center>
        
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div>
                                                        <!--[if mso]>
                                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://" style="height:50px;v-text-anchor:middle;width:200px;" arcsize="8%" stroke="f" fillcolor="#178f8f">
                                  <w:anchorlock/>
                                  <center>
                                <![endif]-->
                                                        <a href="https://idea-maker.herokuapp.com/api/index.php/register/code/$user/$code" style="background-color:#178f8f;border-radius:4px;color:#ffffff;display:inline-block;font-family:Helvetica, Arial, sans-serif;font-size:16px;font-weight:bold;line-height:50px;text-align:center;text-decoration:none;width:200px;-webkit-text-size-adjust:none;">Activate
                                                            Account!</a>
                                                        <!--[if mso]>
                                  </center>
                                </v:roundrect>
                              <![endif]-->
                                                    </div>
                                                    <br>
                                                    <br>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </center>
                    </td>
                </tr>
            </table>
        </body>
        
        </html>
EOD;


        $this->body = $MailBody;
    }

    protected function CreateRecoveryMailBody($username, $link)
    {

        $this->load();
        $MailBody = <<<"EOD"
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Neopolitan Progress Email</title>

    <style type="text/css">
        @import url(http://fonts.googleapis.com/css?family=Droid+Sans);

        /* Take care of image borders and formatting */

        img {
            max-width: 600px;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }

        a {
            text-decoration: none;
            border: 0;
            outline: none;
            color: #bbbbbb;
        }

        a img {
            border: none;
        }

        /* General styling */

        td,
        h1,
        h2,
        h3 {
            font-family: Helvetica, Arial, sans-serif;
            font-weight: 400;
        }

        td {
            text-align: center;
        }

        body {
            -webkit-font-smoothing: antialiased;
            -webkit-text-size-adjust: none;
            width: 100%;
            height: 100%;
            color: #37302d;
            background: #ffffff;
            font-size: 16px;
        }

        table {
            border-collapse: collapse !important;
        }

        .headline {
            color: #ffffff;
            font-size: 36px;
        }

        .force-full-width {
            width: 100% !important;
        }

        .step-width {
            width: 110px;
            height: 111px;
        }
    </style>

    <style type="text/css" media="screen">
        @media screen {

            /*Thanks Outlook 2013! http://goo.gl/XLxpyl*/
            td,
            h1,
            h2,
            h3 {
                font-family: 'Droid Sans', 'Helvetica Neue', 'Arial', 'sans-serif' !important;
            }
        }
    </style>

    <style type="text/css" media="only screen and (max-width: 480px)">
        /* Mobile styles */
        @media only screen and (max-width: 480px) {

            table[class="w320"] {
                width: 320px !important;
            }

            img[class="step-width"] {
                width: 80px !important;
                height: 81px !important;
            }


        }
    </style>
</head>

<body class="body" style="padding:0; margin:0; display:block; background:#ffffff; -webkit-text-size-adjust:none"
    bgcolor="#ffffff">
    <table align="center" cellpadding="0" cellspacing="0" width="100%" height="100%">
        <tr>
            <td align="center" valign="top" bgcolor="#ffffff" width="100%">
                <center>
                    <table style="margin: 0 auto;" cellpadding="0" cellspacing="0" width="600" class="w320">
                        <tr>
                            <td align="center" valign="top">

                                <table style="margin: 0 auto;" cellpadding="0" cellspacing="0" width="100%" style="margin:0 auto;">
                                </table>

                                <table style="margin: 0 auto;" cellpadding="0" cellspacing="0" width="100%" bgcolor="#4dbfbf">
                                    <tr>
                                        <td class="headline">
                                            <br>
                                            RESET Password for $username
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <br>
                                            <center>
                                                <table style="margin:0 auto;" cellspacing="0" cellpadding="0" class="force-width-80">
                                                    <tr>



                                                        <td>

                                                            <img class="step-width" src="https://www.filepicker.io/api/file/MMVdxAuqQuy7nqVEjmPV"
                                                                alt="step one">
                                                        </td>




                                                        <td>
                                                            <img class="step-width" src="https://www.filepicker.io/api/file/MD29ZQs3RdK7mSu0VqxZ"
                                                                alt="step two">
                                                        </td>



                                                        <td>
                                                            <img class="step-width" src="https://www.filepicker.io/api/file/mepNOdHRTCMs1Jrcy2fU"
                                                                alt="step three">
                                                        </td>
                                                    </tr>


                                                    <tr>
                                                        <td style="vertical-align:top; color:#187272; font-weight:bold;">
                                                            Click
                                                        </td>
                                                        <td style="vertical-align:top; color:#187272; font-weight:bold;">
                                                            Update
                                                        </td>
                                                        <td style="vertical-align:top; color:#187272; font-weight:bold;">
                                                            Done!
                                                        </td>
                                                    </tr>
                                                </table>
                                            </center>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>

                                            <center>
                                                <table style="margin: 0 auto;" cellpadding="0" cellspacing="0" width="60%">
                                                    <tr>
                                                        <td style="color:#187272;">
                                                            <br>
                                                            <br>
                                                            You now can reset you password with just a clic,
                                                            Click the following button, and update it.
                                                            <br>
                                                            <br>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </center>

                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div>
                                                <!--[if mso]>
                        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://" style="height:50px;v-text-anchor:middle;width:200px;" arcsize="8%" stroke="f" fillcolor="#178f8f">
                          <w:anchorlock/>
                          <center>
                        <![endif]-->
                                                <a href="$link" style="background-color:#178f8f;border-radius:4px;color:#ffffff;display:inline-block;font-family:Helvetica, Arial, sans-serif;font-size:16px;font-weight:bold;line-height:50px;text-align:center;text-decoration:none;width:200px;-webkit-text-size-adjust:none;">RESET
                                                    Password</a>
                                                <!--[if mso]>
                          </center>
                        </v:roundrect>
                      <![endif]-->
                                            </div>
                                            <br>
                                            <br>
                                        </td>
                                    </tr>
                                </table>


                            </td>
                        </tr>
                    </table>
                </center>
            </td>
        </tr>
    </table>
</body>

</html>

EOD;

        $this->body = $MailBody;
    }

    protected function sendMail($target, $tName, $Subject)
    {
        try {
            $this->mail->From = $this->EmailAddress;
            $this->mail->FromName = "Mohammed Ali";

            $this->mail->addAddress($target, $tName);

            $this->mail->WordWrap = 50;

            $this->mail->isHTML(true);

            $this->mail->Subject = $Subject;
            $this->mail->Body = $this->body;
            $this->mail->AltBody = $this->footer;

            $this->mail->send();
        } catch (Exception $e) {
            echo 'Message could not be sent. Mailer Error: ', $this->mail->ErrorInfo;
        }
    }
}

class Register extends mailer
{
    protected $username;
    protected $Fname;
    protected $Lname;
    protected $email;
    protected $phone;
    protected $country;
    protected $town;
    protected $type;
    protected $hash;
    protected $signedDate;
    protected $status;
    protected $vCode;

    public $errors = [];

    function load($User, $FirstName, $LastName, $PhoneNumber, $EmailAddress, $MyCountry, $MyTown, $AccType, $Password)
    {
        $this->username = $User;
        $this->Fname = $FirstName;
        $this->Lname = $LastName;
        $this->country = $MyCountry;
        $this->town = $MyTown;
        $this->email = $EmailAddress;
        $this->phone = $PhoneNumber;
        $this->type = $AccType;
        $this->hash = md5($Password);
        $this->signedDate = date('Y-m-d H:i:s');
        $this->status = 'DisActive';

    }

    protected function isValidForm($conn)
    {
        $error = $this->errors;
        if ($error == null) {
            $this->errors['Status'] = 200;
            $this->errors['username'] = "ACCEPTABLE";
            $this->errors['email'] = "ACCEPTABLE";
            $this->errors['phone'] = "ACCEPTABLE";
            $this->isValidUsername($conn);
            $this->isValidEmail($conn);
            $this->isValidPhone($conn);

        }

    }

    private function isValidUsername($conn)
    {
        $query = $conn->prepare("SELECT username FROM users WHERE username = '$this->username'");
        $query->execute();
        if ($query->rowCount() > 0) {
            $this->errors['username'] = "Already in use";
            $this->errors['Status'] = $this->errors['Status'] + 100;

        }

    }

    private function isValidEmail($conn)
    {


        $query = $conn->prepare("SELECT email FROM users WHERE email = '$this->email'");
        $query->execute();
        if ($query->rowCount() > 0) {
            $this->errors['email'] = "Already in use";
            $this->errors['Status'] = $this->errors['Status'] + 100;
        }
    }

    private function isValidPhone($conn)
    {
        $query = $conn->prepare("SELECT phone FROM users WHERE phone = '$this->phone'");
        $query->execute();
        if ($query->rowCount() > 0) {
            $this->errors['phone'] = "Already in use";
            $this->errors['Status'] = $this->errors['Status'] + 100;

        }
    }

    protected function gnreateCode()
    {
        $chars = "abcdefghijkmnopqrstuvwxyz023456789";
        srand((double)microtime() * 1000000);
        $i = 0;
        $pass = '';

        while ($i <= 5) {
            $num = rand() % 33;
            $tmp = substr($chars, $num, 1);
            $pass = $pass . $tmp;
            $i++;
        }

        $this->vCode = $pass;
    }

    protected function sendValidationMali()
    {
        $this->CreateVerficationMailBody($this->vCode, $this->Fname, $this->username);
        $this->sendMail($this->email, $this->Fname, 'verfication mail');
    }
}

class Activation
{
    private $username;
    private $code;
    private $conn;

    function __construct($user, $code)
    {
        $this->username = $user;
        $this->code = $code;
        $DB = DataHandeler::getInstance();
        $this->conn = $DB->conn;
        $this->check();

    }


    public function check()
    {
        $query = $this->conn->prepare("SELECT 
            *
        FROM
            activationCode
        WHERE
            username = '$this->username'
        AND 
            code = '$this->code'");

        $query->execute();
        $sql = "UPDATE users 
        SET 
            accStatus = 'ACTIVATED'
        WHERE
            username = '$this->username'";

        if ($query->rowCount() > 0) {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            return true;
        } else {
            return false;
        }
        return false;
    }
}

class DataHandeler extends Register
{
    private $host = 'db4free.net';
    private $MySqlUsername = 'ideamakeruser';
    private $MySqlPassword = '23243125';
    private $DBname        = 'ideamakerdb';
    
    // private $host = 'db4free.net';
    // private $MySqlUsername = 'root';
    // private $MySqlPassword = '23243125';
    // private $DBname        = 'mydb';

    public $conn;

    private static $instance;

    function __construct()
    {
        $conn = new PDO("mysql:host=$this->host;dbname=$this->DBname;charset=utf8", $this->MySqlUsername, $this->MySqlPassword, []);
        // set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $conn->beginTransaction();
        $this->conn = $conn;
    }

    public function regist()
    {
        try {

            $this->isValidForm($this->conn);

            if ($this->errors['Status'] == 200) {
                $this->conn->exec("INSERT INTO users (username, fname, lname, email, phone, country, town, pwHash, uType, cDateTime, accStatus)
                VALUES(
                    '$this->username', 
                    '$this->Fname', 
                    '$this->Lname', 
                    '$this->email', 
                    '$this->phone', 
                    '$this->country', 
                    '$this->town', 
                    '$this->hash', 
                    '$this->type', 
                    '$this->signedDate', 
                    '$this->status')
                    ");


                $this->gnreateCode();
                $this->conn->exec("INSERT INTO activationCode(username, code)
                VALUES(
                    '$this->username',
                    '$this->vCode' 
                    )
                    ");
                $this->sendValidationMali();
            }



        } catch (PDOException $e) {
            die($e->getMessage());
        }

    }

    public static function getInstance()
    {
        // Check is $_instance has been set
        if (!isset(self::$instance)) {
            // Creates sets object to instance
            self::$instance = new DataHandeler();
        }

        // Returns the instance
        return self::$instance;
    }

    function __destruct()
    {
        $this->conn->commit();
        $this->conn = null;
    }

}


class Loyal
{
    private $private_key = "
    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";
    public function isAllow($jwt)
    {
        if ($jwt) {
            try {
                $decoded = JWT::decode($jwt, $this->private_key, array('HS256'));
                http_response_code(200);
                return $decoded->data;

            } catch (Exception $e) {
     
                // http_response_code(401);         
                // return json_encode(array(
                //     "message" => "Access denied.",
                //     "error" => $e->getMessage()
                // ));
                return false;
            }
        }
    }


    protected function createSeection($username, $Email, $name, $user_id)
    {
        header("Access-Control-Allow-Origin: https://idea-maker.herokuapp.com");
        header("Content-Type: application/json; charset=UTF-8");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Max-Age: 3600");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $key = $this->private_key;
        $iss = "https://idea-maker.herokuapp.com/web/";
        $aud = "https://idea-maker.herokuapp.com/api/";
        $iat = 1356999524;
        $nbf = 1357000000;
        $exp = 60;

        $token = array(
            "iss" => $iss,
            "aud" => $aud,
            "iat" => $iat,
            "nbf" => $nbf,
            "ttl" => $exp,
            "data" => array(
                "id" => $user_id,
                "username" => $username,
                "name" => $name,
                "email" => $Email
            )
        );
        $jwt = JWT::encode($token, $key);

        return json_encode(
            array(
                "status" => 200,
                "jwt" => $jwt
            )
        );

    }
}

class _Loyal extends mailer
{
    private $key = "MIIEowIBAAKCAQEAtldr2s0VAfIL0UsChgKsQm3Vy0xU2eVAh9BKAKyDZ0rCiYzG
    C8mvAZ59wtnBfmfwbwV0NyKOgjhIT9l2WH89lEAVsWzLNkUWgPV/U2PL1xv+mNvK
    dGQpcctOtjZcANDE7EYKJJwfncPjux2TzK8fE3wWAuvkEBftYL2lJD9VyqVvrVtn
    2O+Q0WjzoeKscVBV7hPhg0aInICqCFFA62+gUKC9scq4dluGhHFyJW8H1bJVCVkF
    g2WWAQy2Huxxae5nuPg04z+SXIXY1z4v6OCLCpaLs/zGUZW3vkkOdCDLtyI7WJU6
    Cwalnanbr7Y/JXjsNC8vz+Sd72TmmEJZ/vMG+wIDAQABAoIBAFQHsaKhxD6jRyLq
    iH0tmij66P3JbYkFB1oPeSsaVWwynbg58cLY7Re37IjxRSR1ze27+7S07ivAuEJk
    Gw/pg31gkx6y3mtiJ17CxCyv3u6A7jGPiJte1WKlqN576qZNj5K7LE12zXMtJTPE
    C6rWQWH/Wz15bB6miDR+8S3lKio6kDYxQZOxE77IbLAZIq4n1EF13oeKPuluzSng
    EjNvVhx7VSFzu0cjYB6QW7rMzHiXbb3+bbcch91mqOnLucLu1DcQXOCbq5565m3I
    TZJioBmbpiUgHtNvuPd5e2+vEaYbpKnybt6wPCF2xbP7mT1zh+s5ewP77KM7s946
    2PUmuyECgYEA21t1JCsVDCdGbXPQ/58I4qE40uEtSUwnJuNANgs3NswVj2nV6EDv
    AAE5GtHPAz9fqcywJBq4xIN/QCEBxxSA4xDKe1pbPy7tmiIlpg5KMcthGMXJQo7n
    BsKUfAbuv6nVSZ+zk7JPuhsaSx8lzoPK6qz/75iTSOR9aLh6t/KqwWkCgYEA1M0H
    trGlOWndzZizrwf/UF36B41TQUh4G0VeG6VmJ2eK6a89nkJaaNRIcYraFiNivK+c
    /88D7dXr70Qt78yvDAG730NHu4lasxj9qELGm7uTGMU5iILM9xJd+IWNTuLBeCRm
    6BiKNY+oTjTFscVtEPLN4/cK8KgrfvFWKONplMMCgYAFuFvUpp704y1N+2Au2knU
    BxpBPYf9ylOXCwQIpMA62JWTWNIwLUlOObnwfhok3okzF1hciKnazgcKeBHgzCMU
    SMLO9qs8eY/OnidXLjY3GDOe/sFhz/IsVfSjS1b8foRGWDjJmDPGCaDk5poIyZ0I
    A5zk9ZiZpQO0MGNa2qQjSQKBgQC7l0a+gdnCRBY4gO2dVbJ3eXDJKYeEHEts1vi/
    7E2iXP+zQz1RfvLOSJzYIuxf6a/H4BPJ2gd/qT5EfVj1dP222uxwQ5I/uzTOfzBV
    HRCSBogEpRAzzAK9p15Zj/ni2bhtncFtxvxHfS2ES7cfIIgmEbT4yjXFsqotTLiE
    cP0JGwKBgDytuOPci6cpmzS90y8ulxhtM1f7d2+L5zF72402oepBC0Q8xSjU3OhR
    XFbxyrx9gW63XS6YXfl1AZWpeSWlPoReeCqHF2h8HbG8MBkm9M/jdd0QDl4GQhHt
    RVxuhJakK/4DXpsSiUcELrBm0/9ebi0Nrt2dj8nlVYp+EMlY5m6Y";

    public function isAllow($jwt)
    {
        if ($jwt) {
            try {
                $decoded = JWT::decode($jwt, $this->key, array('HS256'));
                http_response_code(200);
                return $decoded->data->id;

            } catch (Exception $e) {
     
                // http_response_code(401);         
                // return json_encode(array(
                //     "message" => "Access denied.",
                //     "error" => $e->getMessage()
                // ));
                return false;
            }
        }
    }


    protected function createSeection($username)
    {
        header("Access-Control-Allow-Origin: https://idea-maker.herokuapp.com/api/index.php/recovery/password/");
        header("Content-Type: application/json; charset=UTF-8");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Max-Age: 3600");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

        $key = $this->key;
        $iss = "https://idea-maker.herokuapp.com/api/index.php/recovery/password/";
        $aud = "https://idea-maker.herokuapp.com/web/passwordRecov.html";
        $iat = 1356999524;
        $nbf = 1357000000;

        $token = array(
            "iss" => $iss,
            "aud" => $aud,
            "iat" => $iat,
            "nbf" => $nbf,
            "data" => array(
                "id" => $username
            )
        );
        $jwt = JWT::encode($token, $key);

        return $jwt;

    }
}

class Login extends Loyal
{
    private $valueX;
    private $LoginHash;
    private $Email;
    private $username;
    protected $logging;

    private $conn;

    public $errors = [];

    function __construct($X, $Y)
    {
        $this->valueX = $X;
        $this->LoginHash = $Y;
        $db = DataHandeler::getInstance();
        $this->conn = $db->conn;
        $this->logging = new LoginLog;

    }

    public function login()
    {
        $dlb = $this->conn->prepare("SELECT 
            username, email, user_id, accStatus, fname, lname
        FROM users 
            WHERE 
                username = '$this->valueX' and pwHash = '$this->LoginHash' 
                or 
                email = '$this->valueX' and pwHash = '$this->LoginHash'");

        $dlb->execute();

        if ($dlb->rowCount() > 0) {
            $result = $dlb->fetch();


            $this->Email = $result['email'];
            $this->username = $result['username'];
            $user_id = $result['user_id'];
            $name = $result['fname']. ' ' . $result['lname'];

            if ($result['accStatus'] != 'ACTIVATED') {
                $this->logging->write(json_encode(array(
                    "status" => "Interapt",
                    "Message" => "UnValid Account",
                    "username" => $this->username,
                    "Email" => $this->Email
                )));
                return json_encode(array(
                    "status" => 122,
                    "message" => "PLISE VALIDATE YOUR ACCOUNT"

                ));
            } else {
                $this->logging->write(json_encode(array(
                    "status" => 200,
                    "username" => $this->username
                )));
                // $_SESSION["$this->valueX"] = TRUE; 
                // header('Location: /');
                // $this->setCookie('username', $this->valueX);
                return $this->createSeection($this->username, $this->Email, $name, $user_id);

            }
        } else {
            $this->logging->write(json_encode(array(
                "Status" => "WongLoginData",
                "username" => $this->valueX
            )));
            return json_encode(array(
                'status' => 123,
                "message" => "WRONG LOGIN DATA"
            ));
        }
    }

    private function isPhone()
    {
        if (strlen($this->valueX) == 14) {

            return true;
        } else {
            return false;
        }
    }

    private function isUsername()
    {

    }

    private function isEmail()
    {

    }

    private function createSection()
    {

    }

}

class Recovery extends _Loyal
{
    private $email;
    private $username;
    public $token;
    private $conn;
    private $vCode;
    private $link;
    public $error = [];

    function __construct($mail)
    {
        $db = DataHandeler::getInstance();
        $this->conn = $db->conn;
        $this->email = $mail;

    }

    public function recoverd($username, $code)
    {
        $this->vCode = $code;
        $this->username = $username;
        if ($this->check() == true) {
            return true;
        } else {
            return false;
        }
    }

    public function recover()
    {
        $this->error['status'] = 200;
        if ($this->isValidEmail() == true) {
            if ($this->loadData() == true) {
                if ($this->updateCode() == true) {
                    $this->link = "https://idea-maker.herokuapp.com/api/index.php/recovery/$this->username/$this->vCode";
                    if ($this->sendRecoveryMali() == true) {
                        $this->error['message'] = 'mail sended';
                        return true;
                    }
                }
            }
        } else {
            $this->error['status'] = 300;
            $this->error['message'] = 'Mail not execit in our database';
            return false;
        }
        $this->error['status'] = 400;
        $this->error['message'] = "Internal Server Error";
        return false;
    }

    public function createToken()
    {
        return $this->createSeection($this->username);
    }

    public function DecodeToken($token)
    {
        return $this->isAllow($token);
    }

    public function RePassword($user, $passwd)
    {
        try {
            $paswd = md5($passwd);
            $dlb = $this->conn->prepare("UPDATE users SET pwHash = '$paswd' WHERE username = '$user'");
            $dlb->execute();
            $this->updateCode();
            return true;
        } catch (PDOException $e) {
            return false;
        }
    }

    private function loadData()
    {

        try {
            $dlb = $this->conn->prepare("SELECT username FROM users WHERE email = '$this->email'");
            $dlb->execute();
            if ($dlb->rowCount() > 0) {
                $result = $dlb->fetch();
                $this->username = $result['username'];
                return true;
            }

        } catch (PDOException $e) {
            return false;
        }

    }

    private function isValidEmail()
    {

        $query = $this->conn->prepare("SELECT email FROM users WHERE email = '$this->email'");
        $query->execute();
        if ($query->rowCount() > 0) {
            return true;
        } else {
            return false;
        }

    }

    private function updateCode()
    {
        try {
            $this->gnreateCode();
            $dlb = $this->conn->prepare("UPDATE activationCode SET code = '$this->vCode' WHERE username = '$this->username'");
            $dlb->execute();
            return true;
        } catch (PDOException $e) {
            return false;
        }
    }

    private function gnreateCode()
    {
        $chars = "abcdefghijkmnopqrstuvwxyz023456789";
        srand((double)microtime() * 1000000);
        $i = 0;
        $pass = '';

        while ($i <= 5) {
            $num = rand() % 33;
            $tmp = substr($chars, $num, 1);
            $pass = $pass . $tmp;
            $i++;
        }

        $this->vCode = $pass;
    }


    private function sendRecoveryMali()
    {

        try {
            $this->CreateRecoveryMailBody($this->username, $this->link);
            $this->sendMail($this->email, "Idea Maker User", 'Idea Maker Password Recovery');
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    private function check()
    {
        $query = $this->conn->prepare("SELECT * FROM activationCode WHERE username = '$this->username' and code = '$this->vCode'");
        $query->execute();
        if ($query->rowCount() > 0) {
            try {
                // $dlb = $this->conn->prepare("UPDATE activationCode SET code = 'REC0VERD' WHERE username = '$this->username'");
                // $dlb->execute();
                return true;
            } catch (Exception $e) {
                return false;
            }
        } else {
            return false;
        }
    }
}

?>
