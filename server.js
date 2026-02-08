const express=require("express");
const path=require("path");
const mongoose=require("mongoose");
const { v4:uuidv4 }=require("uuid");

const app=express();

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));

const port = process.env.PORT || 3000;

// helper for parsing comma-separated inputs safely
function parseArray(value) {
    if (!value) return ["Not Mentioned"];
    if (Array.isArray(value)) return value.map(s => String(s).trim()).filter(Boolean);
    return String(value).split(",").map(s => s.trim()).filter(Boolean);
}

mongoose.connect("mongodb://localhost:27017/freshersDB")
    .then(()=>console.log("MongoDB is Connected"))
    .catch((err)=>console.log(`Mongo DB not connected ${err.message}`));

const studentSchema=new mongoose.Schema({
    uuid:{
        type:String,
        unique:true
    },
    Aim:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    college:{
        type:String,
        required:true
    },
    rollno:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    Dob:{
        type:Date,
        required:true
    },
    course:{
        type:String,
        required:true
    },
    cgpa:{
        type:Number,
        required:true
    },
    skills:{
        DataBase:{
            type:[String],
            default:["Not Mentioned"],
            required:true
        },
        ProgrammingLanguages:{
            type:[String],
            default:["Not Mentioned"],
            required:true
        },
        FrameWorks:{
            type:[String],
            default:["Not Mentioned"],
            required:true
        },
        Frontend:{
            type:[String],
            default:["Not Mentioned"],
            required:true
        },
        Backend:{
            type:[String],
            default:["Not Mentioned"],
            required:true
        },
        Tools:{
            type:[String],
            default:["Not Mentioned"],
            required:true
        }
    },
    certifications:{
        type:[String],
        default:["Not Mentioned"],
        required:true
    },
    links:{
        type:[String],
        default:["Not Mentioned"],
        required:true
    },
    codingProfiles: {
        github:{
            type:String,
            default:"Not Mentioned"
        },
        linkedIn:{
            type:String,
            default:"Not Mentioned"
        }
    },
    otherLinks: [
        { title: String, url: String }
    ],
    other_activities: [String],
    createdAt: { type: Date, default: Date.now }
});

const Student=mongoose.model("Student",studentSchema);

app.get("/students/new",(req,res)=>{
    res.render("new");
});

app.post("/students", async (req, res) => {
    try {
        const student = new Student({
            uuid: uuidv4(),

            Aim: req.body.Aim,
            name: req.body.name,
            college: req.body.college,
            phone: req.body.phone,
            email: req.body.email,
            Dob: req.body.Dob,
            course: req.body.course,
            cgpa: req.body.cgpa,

            skills: {
                DataBase: parseArray(req.body.skills?.DataBase),
                ProgrammingLanguages: parseArray(req.body.skills?.ProgrammingLanguages),
                FrameWorks: parseArray(req.body.skills?.FrameWorks),
                Frontend: parseArray(req.body.skills?.Frontend),
                Backend: parseArray(req.body.skills?.Backend),
                Tools: parseArray(req.body.skills?.Tools)
            },

            certifications: parseArray(req.body.certifications),

            codingProfiles:{
                github: req.body["codingProfiles.github"],
                linkedIn: req.body["codingProfiles.linkedin"]
            },


            other_activities: parseArray(req.body.other_activities)
        });

        await student.save();
        res.redirect(`/students/${student.uuid}`);
    } catch (err) {
        console.log(err);
        res.send("Error Adding Student");
    }
});

app.get("/",async (req,res)=>{
    try{
        const students= await Student.find();
        console.log(students);
        res.render("index",{students});
    }
    catch(err){
        console.log(err);
        res.send("Error fetching students");
    }
})

app.get("/students/:uuid",async (req,res)=>{
    try{
        const student=await Student.findOne({uuid:req.params.uuid});
        if(!student){
            return res.send("Student Not Found");
        }
        res.render("show",{student});
    }
    catch(err){
        console.log("Error loading profile",err);
        res.send("Error loading profile");
    }
});

app.get("/students/:uuid/edit",async (req,res)=>{
    try{
        const student=await Student.findOne({uuid:req.params.uuid});
        if(!student){
            return res.send("Student Not Found");
        }
        res.render("edit",{student});
    }
    catch(err){
        console.log("Error loading edit form",err);
        res.send("Error loading edit form");
    }
});

app.post("/students/:uuid",async (req,res)=>{
    try{
        const student=await Student.findOne({uuid:req.params.uuid});
        if(!student){
            return res.send("Student Not found");
        }
        student.Aim=req.body.Aim;
        student.name=req.body.name;
        student.college=req.body.college;
        student.course=req.body.course;
        student.phone=req.body.phone;
        student.email=req.body.email;
        student.Dob=req.body.Dob;
        student.cgpa=req.body.cgpa;

        student.skills={
            DataBase:parseArray(req.body["skills.DataBase"]),
            ProgrammingLanguages:parseArray(req.body["skills.ProgrammingLanguage"]),
            FrameWorks:parseArray(req.body["skills.FramWorks"]),
            Frontend:parseArray(req.body["skills.Frontend"]),
            Backend:parseArray(req.body["skills.Backend"]),
            Tools:parseArray(req.body["skills.Tools"])
        };
        student.certifications=parseArray(req.body.certifications);
        student.codingProfiles = {
            github: req.body["codingProfiles.github"] || "Not Mentioned",
            linkedIn: req.body["codingProfiles.linkedin"] || "Not Mentioned"
        };
        student.other_activities = parseArray(req.body.other_activities);

        await student.save();
        res.redirect(`/students/${student.uuid}`);
    }
    catch(err){
        console.log(err);
        res.send("Error updating Student");
    }
});

app.post("/students/:uuid/delete",async (req,res)=>{
    try{
        const student=await Student.findOneAndDelete({uuid:req.params.uuid});
        if(!student){
            return res.send("Student Not Found");
        }
        res.redirect("/");
    }
    catch(err){
        console.log(err);
        res.send("Error deleting Student");
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});