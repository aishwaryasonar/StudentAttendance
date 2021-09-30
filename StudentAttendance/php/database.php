<?php

class DB {

    // Create the database connection
    public function db_connect() {
	$connection = mysqli_connect('localhost:3306', 'root', '');
        if (!$connection) {

           // error_log('Error in establishing db connection :: '.mysql_error());
            throw new Exception('Error in establishing db connectio :: '.mysql_error());
        }
        $db = mysqli_select_db($connection,'studAttendaceDB');
        if (!$db) {
            //error_log('Error in selecting db :: '.mysql_error());
            throw new Exception('Error in selecting db :: '.mysqli_error());
        }

       
        //error_log("time == ".json_encode($r2));

        return $connection;
    }
}
