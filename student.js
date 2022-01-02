import express from "express";
import { client } from "./index.js";

const router = express.Router();

router
.route("/")
.get(async(req,resp) => {
   const students = await client
   .db("sample")
   .collection("students")
   .find().toArray();
   resp.send(students)
})

router
.route("/createStudent")
.post(async(req,resp) => {
    let body = req.body;
    const student = await client
    .db("sample")
    .collection("students")
    .insertOne(body)
    resp.send({message : "student created successfully"})
})

router
.route("/getStudentsByMentorName")
.get(async(req,resp) => {
    let body =  req.body;
    let name = body.name;
    console.log(name)
    const student = await client
    .db("sample")
    .collection("students")
    .find({mentor : name}).toArray();
    console.log(student)
    resp.send(student);
})

router
.route("/createMentor")
.post(async(req,resp) =>{
    let body = req.body;
    const student = await client
    .db("sample")
    .collection("mentors")
    .insertOne(body)
    resp.send({message : "mentor created successfully"})
})

router
.route("/assignStudents")
.post(async(req,resp) => {
    let body = req.body
    let studentsToBeAssigned = body.students;
    let mentorName = body.mentor;
    let studentsNeedMentors = await client
    .db("sample")
    .collection("students")
    .find({mentor : null}).toArray();
    let studentsNeedMentorsList = studentsNeedMentors.map(e => e.studentName)
    //console.log(studentsNeedMentorsList)
    let studentsList = studentsToBeAssigned.filter((e) => {
        if(studentsNeedMentorsList.indexOf(e) !== -1){
            return true;
        }
    })
    let existingMentees = await client.db("sample").collection("mentors").find({mentorName : mentorName}).toArray();
    let existingMenteesList = existingMentees.map(e => e.mentees);
    let finalMenteesList = [...existingMenteesList[0],...studentsList]
    console.log(existingMenteesList,studentsList,finalMenteesList)
    
    let studentAddition = await client
    .db("sample")
    .collection("mentors")
    .updateOne({mentorName : mentorName}, {$set : {mentees : finalMenteesList}})

    for(let i=0; i < finalMenteesList.length; i++){
        let studentName = finalMenteesList[i];
        let updateStudentCollection = await client
        .db("sample")
        .collection("students")
        .updateOne({studentName : studentName},{$set : {mentor : mentorName}})
    }
    if(studentsToBeAssigned.length > studentsList.length) {
        resp.send({messgae : "students assigned successfully but students with mentors are excluded"});
    }
    else {
        resp.send({messgae : "students assigned successfully"})
    }
    
})




export const studentRouter = router;