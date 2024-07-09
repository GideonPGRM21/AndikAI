import mysql from 'mysql2'

import dotenv from 'dotenv'

dotenv.config();

const pool = mysql.createPool({
    host:process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT, 
    user: process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise();


export async function getRawAndCorrectedTexts(){
    const [rows] = await pool.query("SELECT * FROM raw_text");
    return rows;
}

export async function getRawText(rawId){
    const [rows] = await pool.query("SELECT * FROM raw_text WHERE raw_text_id = ?",[rawId]);
    return rows;
}

// console.log(await getRawAndCorrectedTexts());

export async function createRaw(raw,studentId,studentText,teacherId){
    const [result] = await pool.query("INSERT INTO raw_text (raw, student_id,student_text,teacher_id) VALUES (?,?,?,?)",[raw,studentId,studentText,teacherId]);
    return result.insertId;
}
export async function getNoneCorrectedRaw(teacherId){ // tested
    const [rows] = await pool.query("SELECT * FROM raw_text WHERE teacher_id = ? AND teacher_text IS NULL;",[teacherId]);
    return rows;
}
export async function getStudentTeacherConnections(studentId){ //tested
    const [rows] = await pool.query("SELECT * FROM connections WHERE student_id = ? AND connection_status = 'active'",[studentId]);
    return rows;
}
export async function createRawCorrection(teacherText,studentRate,rawTextId){ 
    const [rows] = await pool.query("UPDATE raw_text SET teacher_text = ?, student_rate = ? WHERE raw_text_id = ? ",[teacherText,studentRate,rawTextId]);
    return rows.changedRows;
}

// console.log(await getRawAndCorrectedTexts());
// console.log(await getStudentTeacherConnections(1));
// console.log(await getNoneCorrectedRaw(2));
// console.log(await createRaw("this text is from cht gpt",1,"kano gaturutse kwa muzehe gpt",2));
// console.log(await createRawCorrection("This is ass hoool",50,2));