const mongoose = require("mongoose");
const Admin = require("./models/Admin");

mongoose.connect("mongodb://localhost:27017/campass");

async function insertAdmins(){

const admins = [

{
admin_pnr:"900000006",
name:"Admin One",
email:"admin1@campass.com",
phone:"9876501006",
role:"admin",
password:"admin123"
},

{
admin_pnr:"900000007",
name:"Admin Two",
email:"admin2@campass.com",
phone:"9876501007",
role:"admin",
password:"admin123"
},

{
admin_pnr:"900000008",
name:"Admin Three",
email:"admin3@campass.com",
phone:"9876501008",
role:"admin",
password:"admin123"
}

];

for (let data of admins){

 const admin = new Admin(data);

 await admin.save();

}

console.log("Admins inserted successfully");

process.exit();
}

insertAdmins();