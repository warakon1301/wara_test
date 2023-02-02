import db from "../../models";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import randtoken from "rand-token";
import sign from "jwt-encode";
import resign from "jwt-decode";
const saltRounds = 10;
db.User.prototype.toJSON = function () {
  var values = Object.assign({}, this.get());
  delete values.password;
  delete values.salt;
  return values;
};
async function generateAccessToken(username: any) {
  return jwt.sign(username, process.env.TOKEN_SECRET as string, {
    expiresIn: "18000s",
  });
}

const create = async (req: any, res: any) => {
  try {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!#%*?&]{8,}$/;
    
    if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({
            message: "Invalid email format"
        });
    }
    if (!passwordRegex.test(req.body.password)) {
        return res.status(400).json({
            message: "Invalid password format. Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter and one number"
        });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(req.body.password, salt);
    const data = await db.User.create({
      ...req.body,
      password: hash,
      salt,
    });
    res.status(200).json({
      data: data,
    });
  } catch (error: any) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the Tutorial.",
    });
  }
};
const Login = async (req: any, res: any) => {
  try {
    const title = req.body.email;
    console.log(req.body);
    var condition = title ? { email: title } : null;

    const data = await db.User.findAll({ where: condition });
    let result = await bcrypt.compare(req.body.password, data[0].password);
    if (data.length > 0 && result) {
      console.log(data[0].dataValues.status);
      if(data[0].dataValues.status == true){
        const token = await generateAccessToken(data[0].dataValues);
      var refreshToken = randtoken.uid(256);
      const secret = "secret";
      const jwt = sign({ ...data[0], refreshToken }, secret);
      res.status(200).json({ accessToken: token, refreshToken: jwt });
      }else{
        res.status(401).send("Please approve this id.");
      }
      
    }
    if (data.length == 0 || !result) {
      res.status(401).send("Username not Register.");
    }
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};
const userprofile = async (req: any, res: any) => {
  try {
    const data = await db.User.findAll({
      where: { id: req.user.id },
      attributes: {
        exclude: ["password", "salt"],
      },
    });
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};
const updateuser = async (req: any, res: any) => {
  try {
    const data = await db.User.update({...req.body},{
      where: { id: req.user.id }
    });
    const find = await db.User.findOne({
      where: { id: req.user.id },
      attributes: {
        exclude: ["password", "salt"],
      },
    });
    if(find){
      res.status(200).json(find);
    }else{
      res.status(400).json({message:"data is not ready"});
    }
    
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};
const approveByid = async (req: any, res: any) => {
  try {
    const data = await db.User.update({status:true},{
      where: { id: req.query.id }
    });
    const find = await db.User.findOne({
      where: { id: req.query.id }});
    if(find){
      res.status(200).json(find);
    }else{
      res.status(400).json({message:"data is not ready"});
    }
    
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};
const deleteaccByid = async (req: any, res: any) => {
  try {
    const data = await db.User.destroy({
      where: { id: req.query.id }
    });
    if(data == 1){
      res.status(200).json({message:"delete success"});
    }else{
      res.status(400).json({message:"data is not ready"});
    }
    
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};
const palindrome = async (req: any, res: any) => {
  try {
    if (!req.body.text) {
      return res.status(400).send("Please provide a text");
    }
    const isPalindrome = req.body.text.toLowerCase() === req.body.text.toLowerCase().split("").reverse().join("");
    res.send({ text:req.body.text, isPalindrome });
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};
export default {
  create,
  Login,
  userprofile,
  updateuser,
  approveByid,
  deleteaccByid,
  palindrome
};
