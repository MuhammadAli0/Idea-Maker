<?php
require __DIR__ .  '/app.php';




// Define app routes
// ------------- REGISTER -------------------
$app->post('/register', function($request, $response){
     $GLOBALS['HostNameUrl'] = substr($request->getUri()->getBaseUrl(), 0,-14);

    $data=$request->getParsedBody();
    $inputData = [];
    $inputData['username']  = filter_var($data['username'], FILTER_SANITIZE_STRING);
    $inputData['fname']     = filter_var($data['fname'],    FILTER_SANITIZE_STRING);
    $inputData['lname']     = filter_var($data['lname'],    FILTER_SANITIZE_STRING);
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
$app->get('/register/code/[{username}/{code}]', function($request, $response, $argc){
    $GLOBALS['HostNameUrl'] = substr($request->getUri()->getBaseUrl(), 0,-14);

    // $data=$request->getParsedBody();
    $user = $argc['username'];
    $code = $argc['code'];

    echo $user.$code;
    $logging = new ActivationLog;


    $activate = new Activation($user, $code);
    if ($activate->check() == TRUE){
        $logging->write(json_encode(array(
            "Status" => "Activated",
            "username" => $user,
            "code" => $code
        )));
        header("Location: ".$GLOBALS['HostNameUrl'] ."/index.html?login", true, 301);
        exit();
    }else{
        $logging->write(json_encode(array(
            "Status" => "SomeThingWrong",
            "username" => $user,
            "code" => $code
        )));
        header("Location: ".$GLOBALS['HostNameUrl'] ."/web/SomeThingWrong.html", true, 301);
        exit();
    }

});

// ------------- Passowrd Recovery 1st -------------------
$app->map(['PUT', 'GET'], '/recovery/{value1}/[{code}]', function($request, $response, $argc){
    $GLOBALS['HostNameUrl'] = substr($request->getUri()->getBaseUrl(), 0,-14);

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
        if($recover->recoverd($username, $code) == true ){
            $token = $recover->createToken();
            $logging->write(json_encode(array(
                "Status" => "TokenCreated",
                "Username" => $username,
                "Code" =>$code
            )));

            header("Location: ".$GLOBALS['HostNameUrl'] ."/web/passwordRecov.html?".$token, true, 301);
            exit();
            // $response->write( $token );
        }else{
            $logging->write(json_encode(array(
                "Status" => "Rejected",
                "Username" => $username,
                "Code" =>$code
            )));

            header("Location: ".$GLOBALS['HostNameUrl'] ."/web/unvalidLink.html", true, 301);
            exit();
        }
        
    }

});

// ------------- Passowrd Recovery 2nd -------------------
$app->post('/recovery/password', function($request, $response){
    $GLOBALS['HostNameUrl'] = substr($request->getUri()->getBaseUrl(), 0,-14);


    if ($request->isPost()) {
    
        $data = $request->getParsedBody();
        if (isset($data['option'])){
            $token          = $data['jwt'];
            $allowMe        = new Loyal;
            $AllowData      = $allowMe->isAllow($token);

            if ($AllowData != FALSE){
                $action = new actions($AllowData->id);  
                $response->getBody()->write(json_encode(array(
                    "status" => $action->UpdatePassword(md5($data['password']))
                )));  
            }


        } else {

            
            $jwt            = $data['jwt'];
            $recover        = new Recovery('----');
            
            $UserName      = $recover->DecodeToken($jwt);
            if ($UserName  == TRUE){
                if ($recover->RePassword($UserName, $data['password']) == TRUE ){
                    
                    
                    header("Location: ".$GLOBALS['HostNameUrl'] ."/web/", true, 301);
                    exit();
        
                }else{

        
                    $response->write(json_encode(array(
                        "status" => 123,
                        "message" => "SOMETHING WRONG, TRAY AGAIN LATARE"
                    )));
                }
            }else{

        
                $response->write(json_encode(array(
                    "status" => 123,
                    "message" => "This link died, ask for new one and end the opration with 60 seconds"
                )));
            }

        }
    } 
   
     
});

// ------------- HOME -------------------
$app->map(['GET', 'PUT', 'POST'], '/home/[{user_id}/{username}]', function($request, $response, $argc){


    if ($request->isPost()) {
        $data = $request->getParsedBody();
        $token          = $data['jwt'];
        $allowMe        = new Loyal;
        $AllowData      = $allowMe->isAllow($token);

        if ($AllowData != FALSE){

            if (isset($data['option'])) {
                $opt = $data['option'];
                $action = new  userActions($AllowData->id);

                if ($opt == 2 ){
                    if ($action->like($data['post_id'])){
                        $response->write(json_encode(array(
                            "status" => 200
                        )));
                    }

                } elseif ($opt == 10 ){
                    if ($action->comment($data['data']['post_id'], $data['data']['form'])){
                        $response->write(json_encode(array(
                            "status" => 200
                        )));
                    }
                    
                } elseif ($opt == 50 ){
                    if ($action->postIdea($data)){
                        $response->write(json_encode(array(
                            "status" => 200
                        )));
                    }

                } elseif ($opt ==  100 ){
                    if ($action->delIdea($data['post_id'])){
                        $response->write(json_encode(array(
                            "status" => 200
                        )));
                    }

                } elseif ($opt ==  150 ) {
                    if ($action->unLike($data['post_id'])){
                        $response->write(json_encode(array(
                            "status" => 200
                        )));
                    }
                } elseif ($opt ==  200 ) {
                    if ($action->delComment($data['comment_id'])){
                        $response->write(json_encode(array(
                            "status" => 200
                        )));
                    }
                } elseif ($opt == 250) {
                    $svData = new GetData;
                    $rvData = $svData->GetComments($data['post_id']);
                    if ($rvData){
                        $response->write(json_encode(array(
                            "status" => 200,
                            "data" => $rvData
                        )));
                    }
                } elseif ($opt == 300) {
                    $svData = new GetData;
                    $rvvData = $svData->GetName($data['user_id']);
                    if ($rvvData){
                        $response->write(json_encode(array(
                            "status" => 200,
                            "name" => $rvvData
                        )));
                    }
                }elseif ($opt == 600) {
                    $GLOBALS['HostNameUrl'] = substr($request->getUri()->getBaseUrl(), 0,-14);
                    $response->write(json_encode(array(
                        "status" => $action->SendReuest($data['data'])
                    )));
                    $sendMail = new SendRequestMail();
                    $curentDate = date('Y-m-d H:i:s');
                    $body = filter_var( $data['data']['caption'], FILTER_SANITIZE_STRING);

                    $sendMail->sendRequestMail($data['data']['head'], $body, $curentDate, $data['data']['post_id']);
                }


            } else {
                $home = new retriveHome($AllowData->username);
                $home->email = $AllowData->email;
                $home->username = $AllowData->username;
                $home->user_id = $AllowData->id;
                $home->__prepare();
                $response->write($home->home);
            }
        } else {
            header("Location: ".$GLOBALS['HostNameUrl'] ."/index.html?login", true, 301);
            exit();
        }
    
    } 
    elseif ($request->isGet()) {

        $profile = new retriveHome;
        $profile->user_id = $argc['user_id'];
        $profile->username = $argc['username'];
        $profile->__GetHeader();
        $response->write($profile->home);
    }
     
});

// ------------- Profile -------------------
$app->map(['GET', 'PUT', 'POST'], '/profile/[{user_id}/{username}]', function($request, $response, $argc){





    if ($request->isPost()) {
        $data = $request->getParsedBody();
        $token          = $data['jwt'];
        $allowMe        = new Loyal;
        $AllowData      = $allowMe->isAllow($token);

        if ($AllowData != FALSE){

            if (isset($data['option'])) {
                $opt = $data['option'];

            
            } else {

                if($data['status'] == 200){
                    $profile = new retrieveProfile($AllowData->username);
                    $profile->email = $AllowData->email;
                    $profile->username = $AllowData->username;
                    $profile->user_id = $AllowData->id;
                    $profile->__prepare();
                    $response->write($profile->profile);
        
                }else if ($data['status'] == 300) {
                    $upDate = new UpdateProfile();
                    $upDate->username = $AllowData->username;
                    $upDate->user_id = $AllowData->id;
                    $upDate->email    = $data['data']['email'];
                    $upDate->phone    = $data['data']['phone'];
                    $upDate->fname    = $data['data']['first_name'];
                    $upDate->lname    = $data['data']['last_name'];
                    $upDate->gender   = $data['data']['gender'];
                    $upDate->country  = $data['data']['country'];
                    $upDate->town     = $data['data']['town'];
                    $upDate->summary  = $data['data']['summary'];
                    $upDate->date  = $data['data']['date'];
        
        
                    if($upDate->PersonalDataUpdate() == TRUE){
                        $upDate->__prepare();
                        $response->write($upDate->profile);
        
                    }else{
                        echo($upDate->error);
        
                    }
        
        
                
                }else if ($data['status'] == 320) {
                    $upDate = new UpdateProfile();
                    $upDate->username = $AllowData->username;
                    $upDate->user_id = $AllowData->id;
                    
                    if($upDate->WorkUpdate($data) == TRUE){
                        $upDate->__prepare();
                        $response->write($upDate->profile);
        
                    }else{
                        echo($upDate->error);
        
                    }
        
        
                }else if ($data['status'] == 340) {
                    $upDate = new UpdateProfile();
                    $upDate->username = $AllowData->username;
                    $upDate->user_id = $AllowData->id;
                    
                    if($upDate->unvirstyUpdate($data) == TRUE){
                        $upDate->__prepare();
                        $response->write($upDate->profile);
        
                    }else{
                        echo($upDate->error);
                    }
                } else if ($data['status'] == 777) {
                    $upDate = new UpdateProfile();
                    $upDate->user_id = $AllowData->id;
                    
                    if($upDate->summaryUpdate($data) == TRUE){
                        
                        $response->write(1);
        
                    }else{
                        $response->write(0);
                    }
                } else if ($data['status'] == 111) {
                    $upDate = new UpdateProfile();
                    $upDate->user_id = $AllowData->id;
                    
                    if($upDate->UpdateLocation($data) == TRUE){
                        
                        $response->write(1);
        
                    }else{
                        $response->write(0);
                    }
                } else if ($data['status'] == 789) {
                    $upDate = new UpdateProfile();
                    $upDate->user_id = $AllowData->id;
                    
                    if($upDate->UpdateSkills($data) == TRUE){
                        
                        $response->write(1);
        
                    }else{
                        $response->write(0);
                    }
                } 
            }

        } else {
            header("Location: ".$GLOBALS['HostNameUrl'] ."/index.html?login", true, 301);
            exit();
        }
    
    } elseif ($request->isGet()){
        $profile = new retrieveProfile();
        $profile->user_id = $argc['user_id'];
        $profile->username = $argc['username'];
        $profile->__prepare();
        $response->write($profile->profile);

    }



     
});

// ------------- Upload Files / ProfilePic -------------------
$app->post('/upload', function( $request,  $response) {


    if ($request->isPost()) {
        $data = $request->getParsedBody();
        $token          = $data['jwt'];
        $allowMe        = new Loyal;
        $AllowData      = $allowMe->isAllow($token);

        if ($AllowData != FALSE){

            if (isset($data['option'])) {
                $opt = $data['option'];
                $action = new  UpdateProfile();
                $action->user_id = $AllowData->id;

                if ($opt == 600) {

                    $directory = $this->get('upload_directory');
                    $uploadedFiles = $request->getUploadedFiles();

                    // handle single input with single file upload
                    $uploadedFile = $uploadedFiles['profile_pic'];
                    if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
                        // $filename = moveUploadedFile($directory, $uploadedFile);
                        $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
                        $basename = bin2hex(random_bytes(8));
                        $filename = sprintf('%s.%0.8s', md5($AllowData->id), $extension);
                        $uploadedFile->moveTo($directory . DIRECTORY_SEPARATOR . $filename);
                        if ($action->SetLinkToDb('/images/profile/' . $filename)){
                            $link = '/images/profile/' . $filename;
                            $response->write(json_encode(array(
                            'status' => 200,
                            'link' => $link
                            )));
                        } 
                    }
                } elseif ($opt == 700){
                    $directory = $this->get('upload_directory2');
                    $uploadedFiles = $request->getUploadedFiles();

                    // handle single input with single file upload
                    $uploadedFile = $uploadedFiles['cover_pic'];
                    if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
                        // $filename = moveUploadedFile($directory, $uploadedFile);
                        $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
                        $basename = bin2hex(random_bytes(8));
                        $filename = sprintf('%s.%0.8s', md5($AllowData->id), $extension);
                        $uploadedFile->moveTo($directory . DIRECTORY_SEPARATOR . $filename);
                        if ($action->SetCoverLinkToDb('/web/images/cover/' . $filename)){
                            $link = '/web/images/cover/' . $filename;
                            $response->write(json_encode(array(
                            'status' => 200,
                            'link' => $link
                            )));
                        } 
                    }

                }
            }
        }
    }

});

// ------------- Contact Us -------------------
$app->post('/contactus', function($request, $response){

    $data=$request->getParsedBody();
    $inputData = [];

    $CS = new ContactUs;

    $CS->name     = filter_var($data['name'],  FILTER_SANITIZE_STRING);
    $CS->email    = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    $CS->msg      = filter_var($data['msg'],   FILTER_SANITIZE_STRING);

    
    
    if ($CS->StoreData())
    {   
        $response->getBody()->write(json_encode(array(
            "status" => 200
        )));
        
    }else{
        $response->getBody()->write(json_encode(array(
            "status" => 500
        )));
    }
    
});

// ------------- Other Profile Actions -------------------
$app->post('/action', function($request, $response){
    $data = $request->getParsedBody();

    $token          = $data['jwt'];
    $allowMe        = new Loyal;
    $AllowData      = $allowMe->isAllow($token);

    if ($AllowData != FALSE){

        $action = new actions($AllowData->id);
    
        if (isset($data['option'])) {
            $opt = $data['option'];
            if ($opt == 150 ){
                if ($action->SendPostMessage($data['post_id'], $data['target'], $data['msg']) == TRUE){
                    $response->getBody()->write(json_encode(array(
                        "status" => 200
                    )));            
                }



            } elseif ($opt == 200){
                $response->getBody()->write(json_encode(array(
                    "status" => 200,
                    "msges" => $action->GetMessages($data['user_id'])
                )));    

            } elseif ($opt == 250){
                $response->getBody()->write(json_encode(array(
                    "status" => 200,
                    "msges" => $action->GetUsersInChat(),
                    "data" => $action->GetBasics()
                )));  

            } elseif ($opt == 300){
                $response->getBody()->write(json_encode(array(
                    "status" => 200,
                    "msges" => $action->SendMsg($data['user_id'], $data['msg'])
                )));

            } elseif ($opt == 360){
                $response->getBody()->write(json_encode(array(
                    "status" => $action->SetReadToMsdg($data['user_id'])
                )));  
            } elseif ($opt == 400){
                $GetDataX = new GetData;
                $response->getBody()->write(json_encode(array(
                    "msgs" => $GetDataX->GetUnReadedMessages($AllowData->id)
                ))); 
            } elseif ($opt == 500){
                $GetDataX = new GetData;

                $response->getBody()->write(json_encode(array(
                "msgs" => $GetDataX->GetUnReadedMessages($AllowData->id),
                "nutf" => $GetDataX->GetNuotification($AllowData->id)
                ))); 
            }elseif ($opt == 600){
                $response->getBody()->write(json_encode(array(
                    "status" => $action->SetRemoveToNtuf()
                )));
            }elseif ($opt == 650){
                $response->getBody()->write(json_encode(array(
                    "status" => $action->SetReadToNtuf()
                )));
            }elseif ($opt == 700){
                $response->getBody()->write($action->GetOldNutf());
            }elseif ($opt == 800){
                $response->getBody()->write(json_encode(array(
                    "status" => $action->ReportPost($data['post_id'], $data['owner_id'])
                )));
            }
             
    
        } else {
            $action->__prepare();
            $response->write($action->profile);
        }

    }

    
    
});


$app->post('/test', function($request, $response){
    $GLOBALS['HostNameUrl'] = substr($request->getUri()->getBaseUrl(), 0,-14);
    $data = $request->getParsedBody();
    $res = "\t*--- " . $data['head'] . " ---*<br>". $data['body'] . "<br>With Average Cost\t" .$data['price_from']. "$ to " . $data['price_to'] . "$<br>";
    $response->getBody()->write( $res );
});


?>
