<?php
require __DIR__ .  '/app.php';




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

    $logging = new RegistrationLog;
    $LogData = $inputData;
    unset($LogData['password']);


    if ($register)
        {   
            $register->regist();
            $LogData = json_encode(array(
                "Data" => $LogData,
                "Message" => $register->errors
            ));
            $logging->write($LogData);
            $response->getBody()->write(json_encode($register->errors));
        }else{
            $LogData = json_encode(array(
                "Data" => $LogData,
                "Message" => $register->errors
            ));
            $logging->write($LogData);
            $response->getBogdy()->write(json_encode($register->errors));
        }
});

// ------------- LOG IN -------------------
$app->post('/login', function($request, $response){

    $data=$request->getParsedBody();
    
    $uhash  = filter_var(md5($data['password']), FILTER_SANITIZE_STRING);

    $log_in = new Login(filter_var($data['username'], FILTER_SANITIZE_STRING), $uhash);

    
    
    $response->write($log_in->login());
});

// ------------- ACTIVATION -------------------
$app->get('/register/code/{username}/{code}', function($request, $response, $argc){
    // $data=$request->getParsedBody();
    $user = $argc['username'];
    $code = $argc['code'];

    $logging = new ActivationLog;


    $activate = new Activation($user, $code);
    if ($activate->check() == TRUE){
        $logging->write(json_encode(array(
            "Status" => "Activated",
            "username" => $user,
            "code" => $code
        )));

        $response->write(json_encode(array(
            'status' => 122,
            "message" => "Activated Successfully"
        )));

        // header("Location: http://www.IdeaMaker.com/login/activatedSuccess", true, 301);
        // exit();
    }else{
        $logging->write(json_encode(array(
            "Status" => "SomeThingWrong",
            "username" => $user,
            "code" => $code
        )));
        $response->write(json_encode(array(
            'status' => 123,
            "message" => "WRONG CODE VALUE"
        )));
        // header("Location: http://www.IdeaMaker.com/SomeThingWrong", true, 301);
        // exit();
    }

});

// ------------- HOME -------------------
$app->post('/home', function($request, $response){
    // session_start();
    // $cs  = new Session();
    // if (isset($_COOKIE['username'])){
    //     if($cs->getCookie('username')=='eclipse')
    //     {
    //         return "Welcome To Home";
    //     }else
    //     {
    //         return "Go And Kill";
    //     }
    // }

    $data = $request->getParsedBody();
    
    $jwt            = $data['jwt'];
    $allowMe        = new Loyal;
    $AllowData      = $allowMe->isAllow($jwt);

    if ($AllowData  !== FALSE){
        $response->write("Welcome To Home Page");
    }else{
        $response->write("GO To HELL *********** ");
    }
     
});

$app->map(['PUT', 'GET'], '/recovery/{value1}/[{code}]', function($request, $response, $argc){
    
    $logging = new  RecoveryLog;

    if($request->isPut()){
        $email = $argc['value1'];
        $recover = new Recovery($email);
        if($recover->recover() == TRUE){
            $logging->write(json_encode(array(
                "Status" => "Sended",
                "Email" => $email
            )));

            $response->write(json_encode(array(
                "status" => 200,
                "message" => "MAIL SENDED SUCCESSFULLY"
            )));
        }else{
            $logging->write(json_encode(array(
                "Status" => "SomeThingWrong",
                "Email" => $email
            )));

            $response->write(json_encode(array(
                "status" => 123,
                "message" => "SOMETHING WRONG, TRAY AGAIN LATARE"
            )));
        }
    }else{
        $username = $argc['value1'];
        $code    = $argc['code'];
        $recover = new Recovery($username);
        if($recover->recoverd($username, $code) == TRUE ){
            $token = $recover->createToken();
            $logging->write(json_encode(array(
                "Status" => "TokenCreated",
                "Username" => $username,
                "Code" =>$code
            )));

            header("Location: https://ffb4e1be.ngrok.io/Idea-Maker/profile/passwordRecov.html?".$token, true, 301);
            exit();

            // $response->write( $token );
        }else{
            $logging->write(json_encode(array(
                "Status" => "Rejected",
                "Username" => $username,
                "Code" =>$code
            )));

            header("Location: http://www.GoToHell.com", true, 301);
            exit();
        }
        
    }

});

$app->post('/recovery/password/', function($request, $response){

    $data = $request->getParsedBody();
    $logging = new  RecoveryLog;
    
    $jwt            = $data['jwt'];
    $recover        = new Recovery('1234');
    $tokenData      = $recover->DecodeToken($jwt);
    if ($tokenData  !== FALSE){
        if ($recover->RePassword($tokenData['username'], $data['password']) == TRUE ){
            $logging->write(json_encode(array(
                "Status" => "Recoverd",
                "Username" => $tokenData['username']
            )));
            $response->write(json_encode(array(
                "status" => 200,
                "message" => "PASSWORD UPDATED SUCC"
            )));
        }else{
            $logging->write(json_encode(array(
                "Status" => "SomeThingWrong",
                "Username" => $tokenData['username']
            )));

            $response->write(json_encode(array(
                "status" => 123,
                "message" => "SOMETHING WRONG, TRAY AGAIN LATARE"
            )));
        }
    }else{
        $logging->write(json_encode(array(
            "Status" => "Some one try to hack you"
        )));

        $response->write(json_encode(array(
            "status" => 123,
            "message" => "GO To HELL ***********"
        )));
    }
     
});


?>
