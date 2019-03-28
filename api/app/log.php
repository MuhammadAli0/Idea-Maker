<?php


class LoginLog {
    private $path = '/tmp/WebsiteLoogs/LogIn/';

    public function __construct(){
        global $root;
        date_default_timezone_set('UTC');
        $this->path = $root . $this->path;
    }
    
    public function write($message){
        // $date = new DateTime();
        // $log  = $this->path . $date->format('Y-m-d') . ".log";
        // if (is_dir($this->path)) {
        //     if (!file_exists($log)) {
        //         $fh = fopen($log, 'a+') or die("Fatal Error !");
        //         $logcontent = json_encode(array(
        //             "Time" => $date->format('H:i:s'),
        //             "Data" => $message
        //         )) . "\n";
        //         fwrite($fh, $logcontent);
        //         fclose($fh);
        //     } else {
        //         $this->edit($log, $date, $message);
        //     }
        // } else {
        //     if (mkdir($this->path, 0777) === true) {
        //         $this->write($message);
        //     }
        // }
    }
    
    private function edit($log, $date, $message){
        $logcontent = json_encode(array(
            "Time" => $date->format('H:i:s'),
            "Data" => $message
        )) . "\n";
        $logcontent = $logcontent . file_get_contents($log);
        file_put_contents($log, $logcontent);
    }
}

class RecoveryLog {
    private $path =  '/tmp/WebsiteLoogs/Recovery/';

    public function __construct(){
        global $root;
        date_default_timezone_set('UTC');
        $this->path = $root . $this->path;
    }
    
    public function write($message){
        // $date = new DateTime();
        // $log  = $this->path . $date->format('Y-m-d') . ".log";
        // if (is_dir($this->path)) {
        //     if (!file_exists($log)) {
        //         $fh = fopen($log, 'a+') or die("Fatal Error !");
        //         $logcontent = json_encode(array(
        //             "Time" => $date->format('H:i:s'),
        //             "Data" => $message
        //         )) . "\n";
        //         fwrite($fh, $logcontent);
        //         fclose($fh);
        //     } else {
        //         $this->edit($log, $date, $message);
        //     }
        // } else {
        //     if (mkdir($this->path, 0777) === true) {
        //         $this->write($message);
        //     }
        // }
    }
    
    private function edit($log, $date, $message){
        $logcontent = json_encode(array(
            "Time" => $date->format('H:i:s'),
            "Data" => $message
        )) . "\n";
        $logcontent = $logcontent . file_get_contents($log);
        file_put_contents($log, $logcontent);
    }
}

class RegistrationLog {
    private $path = '/tmp/WebsiteLoogs/Registeration/';

    public function __construct(){
        global $root;
        date_default_timezone_set('UTC');
        $this->path = $root . $this->path;
    }
    
    public function write($message){
        // $date = new DateTime();
        // $log  = $this->path . $date->format('Y-m-d') . ".log";
        // if (is_dir($this->path)) {
        //     if (!file_exists($log)) {
        //         $fh = fopen($log, 'a+') or die("Fatal Error !");
        //         $logcontent = json_encode(array(
        //             "Time" => $date->format('H:i:s'),
        //             "Data" => $message
        //         )) . "\n";
        //         fwrite($fh, $logcontent);
        //         fclose($fh);
        //     } else {
        //         $this->edit($log, $date, $message);
        //     }
        // } else {
        //     if (mkdir($this->path, 0777) === true) {
        //         $this->write($message);
        //     }
        // }
    }
    
    private function edit($log, $date, $message){
        $logcontent = json_encode(array(
            "Time" => $date->format('H:i:s'),
            "Data" => $message
        )) . "\n";
        $logcontent = $logcontent . file_get_contents($log);
        file_put_contents($log, $logcontent);
    }
}

class ActivationLog {
    private $path =  '/tmp/WebsiteLoogs/Activation/';

    public function __construct(){
        global $root;
        date_default_timezone_set('UTC');
        $this->path = $root . $this->path;
    }
    
    public function write($message){
        // $date = new DateTime();
        // $log  = $this->path . $date->format('Y-m-d') . ".log";
        // if (is_dir($this->path)) {
        //     if (!file_exists($log)) {
        //         $fh = fopen($log, 'a+') or die("Fatal Error !");
        //         $logcontent = json_encode(array(
        //             "Time" => $date->format('H:i:s'),
        //             "Data" => $message
        //         )) . "\n";
        //         fwrite($fh, $logcontent);
        //         fclose($fh);
        //     } else {
        //         $this->edit($log, $date, $message);
        //     }
        // } else {
        //     if (mkdir($this->path, 0777) === true) {
        //         $this->write($message);
        //     }
        // }
    }
    
    private function edit($log, $date, $message){
        $logcontent = json_encode(array(
            "Time" => $date->format('H:i:s'),
            "Data" => $message
        )) . "\n";
        $logcontent = $logcontent . file_get_contents($log);
        file_put_contents($log, $logcontent);
    }
}

class PostLog {
    private $path =  '/tmp/WebsiteLoogs/Activation/';

    public function __construct(){
        global $root;
        date_default_timezone_set('UTC');
        $this->path = $root . $this->path;
    }
    
    public function write($message){
        // $date = new DateTime();
        // $log  = $this->path . $date->format('Y-m-d') . ".log";
        // if (is_dir($this->path)) {
        //     if (!file_exists($log)) {
        //         $fh = fopen($log, 'a+') or die("Fatal Error !");
        //         $logcontent = json_encode(array(
        //             "Time" => $date->format('H:i:s'),
        //             "Data" => $message
        //         )) . "\n";
        //         fwrite($fh, $logcontent);
        //         fclose($fh);
        //     } else {
        //         $this->edit($log, $date, $message);
        //     }
        // } else {
        //     if (mkdir($this->path, 0777) === true) {
        //         $this->write($message);
        //     }
        // }
    }
    
    private function edit($log, $date, $message){
        $logcontent = json_encode(array(
            "Time" => $date->format('H:i:s'),
            "Data" => $message
        )) . "\n";
        $logcontent = $logcontent . file_get_contents($log);
        file_put_contents($log, $logcontent);
    }
}

class EditProfileLog {
    private $path =  '/tmp/WebsiteLoogs/Activation/';

    public function __construct(){
        global $root;
        date_default_timezone_set('UTC');
        $this->path = $root . $this->path;
    }
    
    public function write($message){
        // $date = new DateTime();
        // $log  = $this->path . $date->format('Y-m-d') . ".log";
        // if (is_dir($this->path)) {
        //     if (!file_exists($log)) {
        //         $fh = fopen($log, 'a+') or die("Fatal Error !");
        //         $logcontent = json_encode(array(
        //             "Time" => $date->format('H:i:s'),
        //             "Data" => $message
        //         )) . "\n";
        //         fwrite($fh, $logcontent);
        //         fclose($fh);
        //     } else {
        //         $this->edit($log, $date, $message);
        //     }
        // } else {
        //     if (mkdir($this->path, 0777) === true) {
        //         $this->write($message);
        //     }
        // }
    }
    
    private function edit($log, $date, $message){
        $logcontent = json_encode(array(
            "Time" => $date->format('H:i:s'),
            "Data" => $message
        )) . "\n";
        $logcontent = $logcontent . file_get_contents($log);
        file_put_contents($log, $logcontent);
    }
}

class LikeLog {
    private $path =  '/tmp/WebsiteLoogs/Activation/';

    public function __construct(){
        global $root;
        date_default_timezone_set('UTC');
        $this->path = $root . $this->path;
    }
    
    public function write($message){
        // $date = new DateTime();
        // $log  = $this->path . $date->format('Y-m-d') . ".log";
        // if (is_dir($this->path)) {
        //     if (!file_exists($log)) {
        //         $fh = fopen($log, 'a+') or die("Fatal Error !");
        //         $logcontent = json_encode(array(
        //             "Time" => $date->format('H:i:s'),
        //             "Data" => $message
        //         )) . "\n";
        //         fwrite($fh, $logcontent);
        //         fclose($fh);
        //     } else {
        //         $this->edit($log, $date, $message);
        //     }
        // } else {
        //     if (mkdir($this->path, 0777) === true) {
        //         $this->write($message);
        //     }
        // }
    }
    
    private function edit($log, $date, $message){
        $logcontent = json_encode(array(
            "Time" => $date->format('H:i:s'),
            "Data" => $message
        )) . "\n";
        $logcontent = $logcontent . file_get_contents($log);
        file_put_contents($log, $logcontent);
    }
}

class MessagingLog {
    private $path =  '/tmp/WebsiteLoogs/Activation/';

    public function __construct(){
        global $root;
        date_default_timezone_set('UTC');
        $this->path = $root . $this->path;
    }
    
    public function write($message){
        // $date = new DateTime();
        // $log  = $this->path . $date->format('Y-m-d') . ".log";
        // if (is_dir($this->path)) {
        //     if (!file_exists($log)) {
        //         $fh = fopen($log, 'a+') or die("Fatal Error !");
        //         $logcontent = json_encode(array(
        //             "Time" => $date->format('H:i:s'),
        //             "Data" => $message
        //         )) . "\n";
        //         fwrite($fh, $logcontent);
        //         fclose($fh);
        //     } else {
        //         $this->edit($log, $date, $message);
        //     }
        // } else {
        //     if (mkdir($this->path, 0777) === true) {
        //         $this->write($message);
        //     }
        // }
    }
    
    private function edit($log, $date, $message){
        $logcontent = json_encode(array(
            "Time" => $date->format('H:i:s'),
            "Data" => $message
        )) . "\n";
        $logcontent = $logcontent . file_get_contents($log);
        file_put_contents($log, $logcontent);
    }
}

class UserActivityLog {
    private $path =  '/tmp/WebsiteLoogs/Activation/';

    public function __construct(){
        global $root;
        date_default_timezone_set('UTC');
        $this->path = $root . $this->path;
    }
    
    public function write($message){
        // $date = new DateTime();
        // $log  = $this->path . $date->format('Y-m-d') . ".log";
        // if (is_dir($this->path)) {
        //     if (!file_exists($log)) {
        //         $fh = fopen($log, 'a+') or die("Fatal Error !");
        //         $logcontent = json_encode(array(
        //             "Time" => $date->format('H:i:s'),
        //             "Data" => $message
        //         )) . "\n";
        //         fwrite($fh, $logcontent);
        //         fclose($fh);
        //     } else {
        //         $this->edit($log, $date, $message);
        //     }
        // } else {
        //     if (mkdir($this->path, 0777) === true) {
        //         $this->write($message);
        //     }
        // }
    }
    
    private function edit($log, $date, $message){
        $logcontent = json_encode(array(
            "Time" => $date->format('H:i:s'),
            "Data" => $message
        )) . "\n";
        $logcontent = $logcontent . file_get_contents($log);
        file_put_contents($log, $logcontent);
    }
}




?>