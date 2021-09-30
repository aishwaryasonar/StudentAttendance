<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

require_once(dirname(__FILE__).'/database.php');

session_start();

header("Content-type: application/json");
$js = json_decode(file_get_contents('php://input'));

if (isset($_REQUEST['action'])) {
	$action = $_REQUEST['action'];
	$js = json_decode(json_encode($_REQUEST));
} elseif ($js->action) {
	$action = $js->action;
}





switch($action) {
	
	case 'adminLogin':
	$dbobj = new DB;
	$connection = $dbobj->db_connect();

	$ctquery = mysqli_query($connection,"select * from admin where username='".$js->uid."' and password='".$js->pass."'");
	$row=mysqli_fetch_assoc($ctquery);
	$json=array();
 	if($row)
	{
		$json=array('uid'=>$row['username'],'status_code'=>'0','status_message'=>'Logged in successfully');
	}else{
		$json=array('status_code'=>'1','status_message'=>'Login failed');
	}
	mysqli_close($connection);
	echo json_encode($json);
	return json_encode($json);
	break;

	case 'facultyLogin':
	$dbobj = new DB;
	$connection = $dbobj->db_connect();

	$ctquery = mysqli_query($connection,"select * from facultydb where contact='".$js->uid."' and password='".$js->pass."'");
	$row=mysqli_fetch_assoc($ctquery);
	$json=array();
 	if($row)
	{
		$json=array('ID'=>$row['ID'],'uid'=>$row['contact'],'name'=>$row['name'],'status_code'=>'0','status_message'=>'Logged in successfully');
	}else{
		$json=array('status_code'=>'1','status_message'=>'Login failed');
	}
	mysqli_close($connection);
	echo json_encode($json);
	return json_encode($json);
	break;

	case 'registerFaculty':
	$dbobj = new DB;
	$connection = $dbobj->db_connect();
	$json=array();
	$ctquery = mysqli_query($connection,"insert into facultydb values(0,'".$_POST['contact']."','".$_POST['password']."','".$_POST['name']."','".$_POST['class']."','".$_POST['email']."')");
	if($ctquery)
	{
		$json=array('status_code'=>'0','status_message'=>'Faculty registered.');	
	}else{
		$json=array('status_code'=>'1','status_message'=>'Failed to register. Try again later');
	}			
	mysqli_close($connection);
	echo json_encode($json);
	return json_encode($json);
	break;	

	case 'updateFaculty':
	$dbobj = new DB;
	$connection = $dbobj->db_connect();
	$json=array();
	$ctquery = mysqli_query($connection,"update facultydb set contact='".$_POST['contact']."',password='".$_POST['password']."',
	name='".$_POST['name']."',class='".$_POST['class']."',email='".$_POST['email']."' where ID=".$_POST['ID']);
	if($ctquery)
	{
		$json=array('status_code'=>'0','status_message'=>'Faculty updated.');	
	}else{
		$json=array('status_code'=>'1','status_message'=>'Failed to update. Try again later');
	}			
	mysqli_close($connection);
	echo json_encode($json);
	return json_encode($json);
	break;	


	case 'getFaculty':
	$dbobj = new DB;
	$connection = $dbobj->db_connect();
	$ctquery = mysqli_query($connection,"select * from facultydb");
	$arrayData = array();
	while ($row = mysqli_fetch_assoc($ctquery)) {
		$arrayData[] =array('ID'=>$row['ID'],'contact'=>$row['contact'],'password'=>$row['password'],
		'name'=>$row['name'],'class'=>$row['class'],'email'=>$row['email']);
	}
	$response=array('status_code'=>'0','status_msg'=>'success','arrayData'=>$arrayData);
	mysqli_close($connection);
	echo json_encode($response);
	//error_log('result -- ' . json_encode($response));
	return json_encode(json_encode($response));
	break;

	case 'deleteFaculty':
	$dbobj = new DB;
	$connection = $dbobj->db_connect();
	$json=array();
	$ctquery = mysqli_query($connection,"delete from facultydb where ID=".$js->ID);
	if($ctquery)
	{
		$json=array('status_code'=>'0','status_message'=>'Faculty deleted.');	
	}else{
		$json=array('status_code'=>'1','status_message'=>'Failed to delete. Try again later');
	}			
	mysqli_close($connection);
	echo json_encode($json);
	return json_encode($json);
	break;	

	case 'registerStudent':
	$dbobj = new DB;
	$connection = $dbobj->db_connect();
	$json=array();
	$ctquery = mysqli_query($connection,"insert into studentdb values(0,'".$_POST['name']."','".$_POST['class']."','".$_POST['rollno']."',-1)");
	if($ctquery)
	{
		$json=array('status_code'=>'0','status_message'=>'Student registered.');	
	}else{
		$json=array('status_code'=>'1','status_message'=>'Failed to register. Try again later');
	}			
	mysqli_close($connection);
	echo json_encode($json);
	return json_encode($json);
	break;	

	case 'updateStudent':
	$dbobj = new DB;
	$connection = $dbobj->db_connect();
	$json=array();
	$ctquery = mysqli_query($connection,"update studentdb set name='".$_POST['name']."',class='".$_POST['class']."',rollno='".$_POST['rollno']."' where ID=".$_POST['ID']);
	if($ctquery)
	{
		$json=array('status_code'=>'0','status_message'=>'Student updated.');	
	}else{
		$json=array('status_code'=>'1','status_message'=>'Failed to update. Try again later');
	}			
	mysqli_close($connection);
	echo json_encode($json);
	return json_encode($json);
	break;	


	case 'getStudent':
	$dbobj = new DB;
	$connection = $dbobj->db_connect();
	$ctquery = mysqli_query($connection,"select * from studentdb");
	$arrayData = array();
	while ($row = mysqli_fetch_assoc($ctquery)) {
		$arrayData[] =array('ID'=>$row['ID'],'name'=>$row['name'],'class'=>$row['class'],
		'rollno'=>$row['rollno']);
	}
	$response=array('status_code'=>'0','status_msg'=>'success','arrayData'=>$arrayData);
	mysqli_close($connection);
	echo json_encode($response);
	//error_log('result -- ' . json_encode($response));
	return json_encode(json_encode($response));
	break;

	case 'deleteStudent':
	$dbobj = new DB;
	$connection = $dbobj->db_connect();
	$json=array();
	$ctquery = mysqli_query($connection,"delete from studentdb where ID=".$js->ID);
	if($ctquery)
	{
		$json=array('status_code'=>'0','status_message'=>'Student deleted.');	
	}else{
		$json=array('status_code'=>'1','status_message'=>'Failed to delete. Try again later');
	}			
	mysqli_close($connection);
	echo json_encode($json);
	return json_encode($json);
	break;	


	case 'getSubjects':
	
	$arrayData = array();
	$arrayData =array("Maths","Physics","Chemistry","History");
	
	$arrayData2 = array();
	$arrayData2 =array("5th","6th","7th","8th");
	
	$response=array('status_code'=>'0','status_msg'=>'success','subjectData'=>$arrayData,'classData'=>$arrayData2);
	echo json_encode($response);

	//error_log('result -- ' . json_encode($response));
	return json_encode(json_encode($response));
	break;


	case 'getClassStudent':
	$dbobj = new DB;
	$connection = $dbobj->db_connect();
	$ctquery = mysqli_query($connection,"select * from studentdb where class='".$js->class."'");
	$arrayData = array();
	while ($row = mysqli_fetch_assoc($ctquery)) {
		$arrayData[] =array('ID'=>$row['ID'],'name'=>$row['name'],'class'=>$row['class'],
		'rollno'=>$row['rollno']);
	}
	$response=array('status_code'=>'0','status_msg'=>'success','arrayData'=>$arrayData);
	mysqli_close($connection);
	echo json_encode($response);
	//error_log('result -- ' . json_encode($response));
	return json_encode(json_encode($response));
	break;


	case 'markAttendance':
	
	$dbobj = new DB;
	$connection = $dbobj->db_connect();
	$json=array();
	$ctquery = mysqli_query($connection,"delete from attendancedb where class='".$_POST['class']."' and subject='".$_POST['subject']."' and studID='".$_POST['studID']."' and dt=DATE(NOW())");

	$ctquery = mysqli_query($connection,"insert into attendancedb values(0,'".$_POST['subject']."','".$_POST['class']."','".$_POST['rollno']."',
	'".$_POST['studname']."',".$_POST['studID'].",'".$_POST['facultyUID']."','".$_POST['facultyName']."',".$_POST['attendanceStatus'].",sysdate(),".$_POST['attendanceType'].")");
	if($ctquery)
	{
		$json=array('status_code'=>'0','status_message'=>'Status saved.');	
	}else{
		$json=array('status_code'=>'1','status_message'=>'Failed to save. Try again later');
	}			
	mysqli_close($connection);
	echo json_encode($json);
	return json_encode($json);
	break;	

	case 'getAttendanceFilter':
	$dbobj = new DB;
	$connection = $dbobj->db_connect();
	$ctquery = mysqli_query($connection,"select COUNT(distinct(dt)) AS  totallectures from attendancedb where class='".$js->class."' and subject='".$js->subject."' AND attendanceType=".$js->attendanceType." and dt BETWEEN '".$js->dt1."' and '".$js->dt2."'");
	$totallectures=0;
	if ($row = mysqli_fetch_assoc($ctquery)) {
		$totallectures=$row['totallectures'];
	}

	$ctquery = mysqli_query($connection,"select distinct(studID) AS studID ,studname, rollno from attendancedb where class='".$js->class."' and subject='".$js->subject."' AND attendanceType=".$js->attendanceType."  and dt BETWEEN '".$js->dt1."' and '".$js->dt2."'");
	$arrayData = array();
	while ($row = mysqli_fetch_assoc($ctquery)) {
		$ctquery2 = mysqli_query($connection,"select COUNT(*) AS totalpresent from attendancedb WHERE class='".$js->class."' AND subject='".$js->subject."' AND studID=".$row['studID']." AND attendanceType=".$js->attendanceType." AND attendanceStatus=1 AND dt BETWEEN '".$js->dt1."' AND '".$js->dt2."'");
		if ($row2 = mysqli_fetch_assoc($ctquery2)) {
			$totalpresent=$row2['totalpresent'];
		}
		$ctquery3 = mysqli_query($connection,"select COUNT(*) AS totalabsent from attendancedb WHERE class='".$js->class."' AND subject='".$js->subject."' AND studID=".$row['studID']." AND attendanceType=".$js->attendanceType." AND attendanceStatus=0 AND dt BETWEEN '".$js->dt1."' AND '".$js->dt2."'");
		if ($row3 = mysqli_fetch_assoc($ctquery3)) {
			$totalabsent=$row3['totalabsent'];
		}
		
		
		$arrayData[] =array('subject'=>$js->subject,'class'=>$js->class,
		'rollno'=>$row['rollno'],'studname'=>$row['studname'],'totallectures'=>$totallectures,'totalpresent'=>$totalpresent,'totalabsent'=>$totalabsent);
	}
	$response=array('status_code'=>'0','status_msg'=>'success','arrayData'=>$arrayData);
	mysqli_close($connection);
	echo json_encode($response);
	//error_log('result -- ' . json_encode($response));
	return json_encode(json_encode($response));
	break;


	case 'updateMentor':
	$dbobj = new DB;
	$connection = $dbobj->db_connect();
	$json=array();
	$ctquery = mysqli_query($connection,"update studentdb set fID='".$_POST['fID']."' where ID=".$_POST['studID']);
	if($ctquery)
	{
		$json=array('status_code'=>'0','status_message'=>'Mentor updated.');	
	}else{
		$json=array('status_code'=>'1','status_message'=>'Failed to update. Try again later');
	}			
	mysqli_close($connection);
	echo json_encode($json);
	return json_encode($json);
	break;	

	case 'getMentor':
	$dbobj = new DB;
	$connection = $dbobj->db_connect();
	$ctquery = mysqli_query($connection,"select a.*,b.name AS fname from studentdb a JOIN facultydb b ON a.fID=b.ID");
	$arrayData = array();
	while ($row = mysqli_fetch_assoc($ctquery)) {
		$arrayData[] =array('name'=>$row['name'],'class'=>$row['class'],
		'fname'=>$row['fname']);
	}
	$response=array('status_code'=>'0','status_msg'=>'success','arrayData'=>$arrayData);
	mysqli_close($connection);
	echo json_encode($response);
	//error_log('result -- ' . json_encode($response));
	return json_encode(json_encode($response));
	break;

	case 'addPortal':
	
	$dbobj = new DB;
	$connection = $dbobj->db_connect();
	$json=array();
	
	$ctquery = mysqli_query($connection,"insert into portal values(0,".$_POST['studID'].",'".$_POST['name']."','".$_POST['commskills']."',
	'".$_POST['academic']."','".$_POST['practical']."',".$_POST['fiD'].",sysdate())");
	if($ctquery)
	{
		$json=array('status_code'=>'0','status_message'=>'Portal saved.');	
	}else{
		$json=array('status_code'=>'1','status_message'=>'Failed to save. Try again later');
	}			
	mysqli_close($connection);
	echo json_encode($json);
	return json_encode($json);
	break;	

	case 'getMentorStudents':
	$dbobj = new DB;
	$connection = $dbobj->db_connect();
	$ctquery = mysqli_query($connection,"select * from studentdb where fID=".$js->fid);
	$arrayData = array();
	while ($row = mysqli_fetch_assoc($ctquery)) {
		$arrayData[] =array('ID'=>$row['ID'],'name'=>$row['name'],'class'=>$row['class'],
		'rollno'=>$row['rollno']);
	}
	$response=array('status_code'=>'0','status_msg'=>'success','arrayData'=>$arrayData);
	mysqli_close($connection);
	echo json_encode($response);
	//error_log('result -- ' . json_encode($response));
	return json_encode(json_encode($response));
	break;

	case 'getPortals':
	$dbobj = new DB;
	$connection = $dbobj->db_connect();
	$ctquery = mysqli_query($connection,"select * from portal where studID=".$js->studID." AND fID=".$js->fid);
	$arrayData = array();
	while ($row = mysqli_fetch_assoc($ctquery)) {
		$arrayData[] =array('ID'=>$row['ID'],'commskills'=>$row['commskills'],'academic'=>$row['academic'],
		'practical'=>$row['practical'],'dt'=>$row['dt']);
	}
	$response=array('status_code'=>'0','status_msg'=>'success','arrayData'=>$arrayData);
	mysqli_close($connection);
	echo json_encode($response);
	//error_log('result -- ' . json_encode($response));
	return json_encode(json_encode($response));
	break;

	default:
		echo "No Action!";
		exit;
}

//echo json_encode(array('response' => $response));

?>
