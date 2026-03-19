const mongoose = require("mongoose");
const Admin = require("./models/Admin");

mongoose.connect("mongodb://localhost:27017/campass");

async function insertStudent(){

const students = [

{
admin_pnr:"202400021",
name:"Student One",
email:"student1@campass.com",
phone:"9876501006",
role:"student",
password:"student123"
},

{
admin_pnr:"202400022",
name:"Student Two",
email:"student2@campass.com",
phone:"9876501007",
role:"student",
password:"student123"
},

{
admin_pnr:"202400023",
name:"Student Three",
email:"student3@campass.com",
phone:"9876501008",
role:"student",
password:"student123"
}

];

for (let data of students){

 const student = new Student(data);

 await student.save();

}

console.log("Students inserted successfully");

process.exit();
}

insertStudent();