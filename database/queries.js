const GET_ALL_FROM_TABLE_QUERY = "SELECT * FROM $1";
// const GET_ALL_FROM_DETAILS = "SELECT * FROM details ORDER By course, course_teacher, chapter_number";
// query for OS courses
const GET_ALL_FROM_DETAILS = "SELECT * FROM details WHERE course LIKE '%Net%' ORDER By course, course_teacher, chapter_number"; 
const UPDATE_STATUS = "UPDATE details SET chapter_status = $1 WHERE id = $2";
module.exports = {
    GET_ALL_FROM_TABLE_QUERY,
    GET_ALL_FROM_DETAILS,
    UPDATE_STATUS
}
