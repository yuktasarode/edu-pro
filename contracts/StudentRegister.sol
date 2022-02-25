pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;


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
        address[] students;
        uint studentCount;
        
    }
    struct mark{
        uint[] quiz;
        uint[] assignment;
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
    string public courseName = "";
    function joinCourse(address studentWA,string memory courseID) public{
        course storage c= courses[courseID];
        c.students.push(studentWA);
        c.studentCount++;
        student storage s= students[studentWA];
        s.student_courses.push(c);
        courseName=s.student_courses[0].courseID;
        uint[] memory myquiz;
        uint[] memory assign;
        uint attendance = 0;
        mark memory myMark = mark(myquiz,assign,attendance);
        s.student_marks.push(myMark);
        


    } 
    
    
    
     
    function getStudentMarks(address studentWA, string memory courseID) public view returns(uint[] memory,uint[] memory,uint) {
        
        student storage s = students[studentWA];        
        uint index = 0;
        for(uint i = 0;i<s.student_courses.length;i++ )
        {

            if(keccak256(bytes(s.student_courses[i].courseID)) == keccak256(bytes(courseID))) {
               index = i;
               
               break;
           }

        }
        uint quizLen= s.student_marks[index].quiz.length;
        uint assignLen = s.student_marks[index].assignment.length;
        uint[] memory quizMrk = new uint[](quizLen);
        uint[] memory assignMrk = new uint[](assignLen);

        for(uint i = 0; i<quizLen;i++){
            quizMrk[i]=s.student_marks[index].quiz[i];  
        }

        for(uint i = 0; i<assignLen;i++){
            assignMrk[i]=s.student_marks[index].assignment[i];  
        }

        
        return(quizMrk ,assignMrk , s.student_marks[index].attendance);
    }
    
    function inputMrks(address[] memory studentWA, string memory courseID,uint[] memory mrks) public{
        
        
        uint indexi = 0;
        for(uint j=0;j<studentWA.length;j++){
            student storage s = students[studentWA[j]];
            for(uint i = 0;i<s.student_courses.length;i++ )
            {
                if(keccak256(bytes(s.student_courses[i].courseID)) == keccak256(bytes(courseID))) {
                    indexi = i;
                    break;
                }
            }

            s.student_marks[indexi].quiz.push(mrks[j]);
            
        
        }
        

        

    }

    function getStudentCourses(address studentWA) public view returns(string[] memory){
        
        student storage s = students[studentWA];
        uint numOfCOurse = s.student_courses.length;
        string[] memory coursesOfStudent = new string[](numOfCOurse);

        for(uint i = 0;i<numOfCOurse;i++ ){
          coursesOfStudent[i] = s.student_courses[i].courseID;
              
        }

        return (coursesOfStudent);

    }

    function getTeacherCourse(address teacherWA) public view returns(string[] memory){

        teacher storage t = teachers[teacherWA];
        uint numOfCOurse = t.teacher_courses.length;
        string[] memory coursesOfteacher = new string[](numOfCOurse);

        for(uint i = 0;i<numOfCOurse;i++ ){
          coursesOfteacher[i] = t.teacher_courses[i].courseID;
              
        }

        return (coursesOfteacher);
    }

    
   
    
            
    // function getStudentDetails(address studentWA) public view returns (address,string memory,string memory,uint256,uint256){
        
    //     /**
    //      * @dev returning studentId,name,course,totalMarks and percentage of student to corresponding key
    //      */ 
    //     return(students[studentId].studentId,students[studentId].name,students[studentId].course,students[studentId].totalMarks,students[studentId].percentage);
    // }
}