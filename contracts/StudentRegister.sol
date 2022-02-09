pragma solidity ^0.5.16;


/**
 * @title StudentRegister
 * @notice StudentRegister contract is a contract to register the marks of a student and calculates his percentage
*/

contract StudentRegister{

/**
 * @dev owner is a state variable
 */
    address public owner;
  
  /**
   * @dev mapping address as key to struct student with mapping name students
   */
    
    /**
     * @dev assigning the contract deployer as the owner
     */
     
    /**
     * @dev a modifier onlyOwner is created to limit the access to function register to contract deployer
     */
   
    struct course{
        string courseID;
        address teacherWA;
        address[84] students;
        uint studentCount;
        
    }
    struct mark{
        uint[10] quiz;
        uint[10] assignment;
        uint attendance;


    }
    /**
     * @dev a struct student is defined
     */
    struct student{
        
        address studentWA;
        string studentID;
        course[] student_courses;
        mark[] student_marks;
        
        
    }

    struct teacher{
        address teacherWA;
        course[] teacher_courses;
        


    }
    // global mapping 
    mapping (address=>student) public students;
    mapping(address=>teacher) public teachers;
    mapping(string=>course) public  courses;
    uint numStudents;
    //only for registering a new student
    mapping(uint=>student) newStudents;    
    
    function registerStudent(address studentWA,string memory studentID) public  {
       student storage s= students[studentWA];
       s.studentWA=studentWA;
       s.studentID=studentID;
    }
    function registerTeacher(address teacherWA) public  {
    teacher storage s= teachers[teacherWA];
       s.teacherWA=teacherWA;
    
    
        
        }

    function createCourse(string memory courseID,address teacherWA) public  {


        course storage c= courses[courseID];
        c.courseID=courseID;
        c.teacherWA=teacherWA;
        teacher storage t=teachers[teacherWA];
        t.teacher_courses.push(c);
        // //generate and return invite code 

    }

    function joinCourse(address studentWA,string memory  courseID) public{
        course storage c= courses[courseID];
        c.students[c.studentCount++]=studentWA;
        student storage s= students[studentWA];
        s.student_courses.push(c);


    } 
   
    
            
    // function getStudentDetails(address studentWA) public view returns (address,string memory,string memory,uint256,uint256){
        
    //     /**
    //      * @dev returning studentId,name,course,totalMarks and percentage of student to corresponding key
    //      */ 
    //     return(students[studentId].studentId,students[studentId].name,students[studentId].course,students[studentId].totalMarks,students[studentId].percentage);
    // }
}