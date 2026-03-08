const express=require("express");
const path=require("path");
const mongoose=require("mongoose");
const { v4:uuidv4 }=require("uuid");
const bcrypt=require("bcrypt");
const session=require("express-session");

const app=express();

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));

app.use(session({
    secret:"secret123",
    resave:false,
    saveUninitialized:false
}));

const port = process.env.PORT || 3000;

function parseArray(value) {
    if (!value) return ["Not Mentioned"];
    if (Array.isArray(value)) return value.map(s => String(s).trim()).filter(Boolean);
    return String(value).split(",").map(s => s.trim()).filter(Boolean);
}

mongoose.connect("mongodb://localhost:27017/freshersDB")
    .then(()=>console.log("MongoDB is Connected"))
    .catch((err)=>console.log(`Mongo DB not connected ${err.message}`));

// Users (students and admins) schema
const userSchema=new mongoose.Schema({
    name:{ type:String, required:true },
    email:{ type:String, required:true, unique:true },
    password:{ type:String, required:true },
    role:{ type:String, enum:["admin","student"], required:true },
    uuid:{ type:String, unique:true }
});

const User = mongoose.model("User", userSchema);

const studentSchema=new mongoose.Schema({
    uuid:{ type:String, unique:true },
    Aim:{ type:String, required:true },
    name:{ type:String, required:true },
    college:{ type:String, required:true },
    phone:{ type:String, required:true },
    email:{ type:String, required:true },
    Dob:{ type:Date, required:true },
    course:{ type:String, required:true },
    cgpa:{ type:Number, required:true },
    skills:{
        DataBase:{ type:[String], default:["Not Mentioned"], required:true },
        ProgrammingLanguages:{ type:[String], default:["Not Mentioned"], required:true },
        FrameWorks:{ type:[String], default:["Not Mentioned"], required:true },
        Frontend:{ type:[String], default:["Not Mentioned"], required:true },
        Backend:{ type:[String], default:["Not Mentioned"], required:true },
        Tools:{ type:[String], default:["Not Mentioned"], required:true }
    },
    certifications:{ type:[String], default:["Not Mentioned"], required:true },
    links:{ type:[String], default:["Not Mentioned"], required:true },
    codingProfiles:{
        github:{ type:String, default:"Not Mentioned" },
        linkedIn:{ type:String, default:"Not Mentioned" },
        leetCode:{ type:String, default:"Not Mentioned" }
    },
    otherLinks:[{ title:String, url:String }],
    other_activities:[String],
    createdAt:{ type:Date, default:Date.now }
});

const Student=mongoose.model("Student",studentSchema);

function requireLogin(req,res,next){
    if(!req.session.uuid){
        return res.redirect("/login");
    }
    next();
}


app.get("/students/new",requireLogin,(req,res)=>{
    res.render("new");
});

app.post("/students",requireLogin, async (req, res) => {
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
            links: parseArray(req.body.links),
            codingProfiles:{
                github: req.body["codingProfiles.github"] || "Not Mentioned",
                linkedIn: req.body["codingProfiles.linkedin"] || "Not Mentioned",
                leetCode: req.body["codingProfiles.leetCode"] || "Not Mentioned"
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

app.get("/student/skillportal", requireLogin, async (req,res)=>{
    try{
        const user = await User.findOne({uuid:req.session.uuid});
        if(!user) return res.redirect("/login");
        // If an admin somehow hits the student portal, redirect to admin portal
        if(user.role === "admin") return res.redirect("/admin/skillportal");

        const students = await Student.find();
        res.render("index_student",{students,user});
    }
    catch(err){
        console.log(err);
        res.send("Error fetching students");
    }
});

app.get("/admin/skillportal", requireLogin, async (req,res)=>{
    try{
        const user = await User.findOne({uuid:req.session.uuid, role: "admin"});
        if(!user) return res.redirect("/login");

        const students = await Student.find();
        res.render("index",{students,user});
    }
    catch(err){
        console.log(err);
        res.send("Error fetching students");
    }
});

app.get("/students/:uuid",requireLogin,async (req,res)=>{
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

app.get("/students/:uuid/edit",requireLogin,async (req,res)=>{
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

app.post("/students/:uuid",requireLogin,async (req,res)=>{
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
            ProgrammingLanguages:parseArray(req.body["skills.ProgrammingLanguages"]),
            FrameWorks:parseArray(req.body["skills.FrameWorks"]),
            Frontend:parseArray(req.body["skills.Frontend"]),
            Backend:parseArray(req.body["skills.Backend"]),
            Tools:parseArray(req.body["skills.Tools"])
        };

        student.certifications=parseArray(req.body.certifications);

        student.codingProfiles = {
            github: req.body["codingProfiles.github"] || "Not Mentioned",
            linkedIn: req.body["codingProfiles.linkedin"] || "Not Mentioned",
            leetCode: req.body["codingProfiles.leetCode"] || "Not Mentioned"
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

app.post("/students/:uuid/delete",requireLogin,async (req,res)=>{
    try{
        await Student.findOneAndDelete({uuid:req.params.uuid});
        res.redirect("/student/skillportal");
    }
    catch(err){
        console.log(err);
        res.send("Error deleting Student");
    }
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.post("/register", async (req,res)=>{
    try{
        const {name, email, password, role} = req.body;

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.send("Email already registered");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if(role==="admin"){
            const admin=new User({ 
                name,
                email,
                password:hashedPassword,
                role:"admin",
                uuid:uuidv4() 
            });
            await admin.save();
        }else{
            const user = new User({
                name,
                email,
                password: hashedPassword,
                role: "student",
                uuid: uuidv4()
            });
            await user.save();
        }

        res.redirect("/login");
    }catch(err){
        console.log(err);
        res.send("Error during registration");
    }
});

app.post("/login", async (req,res)=>{
    try{
        const {email,password,role} = req.body;

        if(role === "admin"){
            const admin = await User.findOne({email, role: "admin"});
            if(!admin) return res.send("Invalid Email or Password");

            const isMatch = await bcrypt.compare(password, admin.password);
            if(!isMatch) return res.send("Invalid Email or Password");

            req.session.uuid = admin.uuid;
            req.session.role = "admin";
            req.session.email = admin.email;
            req.session.save(()=>{
                return res.redirect("/admin/skillportal");
            });
        }

        const user = await User.findOne({email, role: "student"});
        if(!user) return res.send("Invalid Email or Password");

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.send("Invalid Email or Password");

        req.session.uuid = user.uuid;
        req.session.role = "student";
        req.session.email = user.email;
        req.session.save(()=>{
            return res.redirect("/student/skillportal");
        });
    }catch(err){
        console.log(err);
        res.send("Login Error");
    }
});


app.post("/logout",(req,res)=>{
    req.session.destroy(()=>{
        res.redirect("/login");
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
