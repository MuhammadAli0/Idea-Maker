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
        header("Location: https://idea-maker.herokuapp.com/web/index.html?login", true, 301);
        exit();
    }else{
        $logging->write(json_encode(array(
            "Status" => "SomeThingWrong",
            "username" => $user,
            "code" => $code
        )));
        header("Location: https://idea-maker.herokuapp.com/web/SomeThingWrong", true, 301);
        exit();
    }

});

// ------------- Passowrd Recovery 1st -------------------
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

            $response->write(json_encode($recover->error));
        }else{
            $logging->write(json_encode(array(
                "Status" => "SomeThingWrong",
                "Email" => $email
            )));

            $response->write(json_encode($recover->error));
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

            header("Location: https://idea-maker.herokuapp.com/web/passwordRecov.html?".$token, true, 301);
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

// ------------- Passowrd Recovery 2nd -------------------
$app->post('/recovery/password/', function($request, $response){

    $data = $request->getParsedBody();
    $logging = new  RecoveryLog;
    
    $jwt            = $data['jwt'];
    $recover        = new Recovery('----');
    $UserName      = $recover->DecodeToken($jwt);
    if ($UserName  !== FALSE){
        if ($recover->RePassword($UserName, $data['password']) == TRUE ){
            
            
            $logging->write(json_encode(array(
                "Status" => "Recoverd",
                "Username" => $UserName
            )));
            header("Location: https://idea-maker.herokuapp.com/web/", true, 301);
            exit();

        }else{
            $logging->write(json_encode(array(
                "Status" => "SomeThingWrong",
                "Username" => $UserName
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

// ------------- HOME -------------------
$app->map(['GET', 'PUT', 'POST'], '/home/[{op}/{value}]', function($request, $response, $argc){

    $data = $request->getParsedBody();
    $token          = $data['jwt'];
    $allowMe        = new Loyal;
    $AllowData      = $allowMe->isAllow($token);

    if ($AllowData != FALSE){

        if($request->isPost()){
            $home = new retriveHome($AllowData->id);
            $home->name = json_decode($AllowData->name);
            $home->email = $AllowData->email;
            $home->username = $AllowData->id;
            $home->__prepare();
            $response->write($home->home);
        }else{

        }
    }else{
        header("Location: https://idea-maker.herokuapp.com/web/index.html?login", true, 301);
        exit();
    }
     
});

// ------------- Profile -------------------
$app->map(['GET', 'PUT', 'POST'], '/profile/[{op}/{value}]', function($request, $response, $argc){

    $data = $request->getParsedBody();
    $token          = $data['jwt'];
    $allowMe        = new Loyal;
    $AllowData      = $allowMe->isAllow($token);

    if ($AllowData != FALSE){

        if($data['status'] == 200){
            $profile = new retriveProfile($AllowData->id);
            $profile->name = json_decode($AllowData->name);
            $profile->email = $AllowData->email;
            $profile->username = $AllowData->id;
            $profile->__prepare();
            $response->write($profile->profile);
        }else if ($data['status'] == 300) {
            $upDate = new UpdateProfile();
            $upDate->username = $AllowData->id;
            $upDate->email    = $data['data']['email'];
            $upDate->phone    = $data['data']['phone'];
            $upDate->fname    = $data['data']['fname'];
            $upDate->lname    = $data['data']['lname'];
            $upDate->country  = $data['data']['country'];
            $upDate->town     = $data['data']['town'];
            $upDate->pwHash   = md5(filter_var($data['data']['password'], FILTER_SANITIZE_STRING));
            if($upDate->PersonalDataUpdate() == TRUE){
                $upDate->__prepare();
                $response->write($upDate->profile);

            }else{
                echo($upDate->error);

            }


        
        }
    }else{
        exit();
    }
     
});





?>
