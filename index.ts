import express from 'express';
const app = express();
const port = process.env.PORT || 3000;
import db from './src/models'
import {users} from './src/seeders/users'
import router from './src/router/index'
import bcrypt from "bcrypt";
const saltRounds = 10;
//  db.sequelize.sync({ force: true });
const createusers = () =>{
  users.map(async (users) =>{
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(users.password, salt);
        db.User.create({...users,
          password: hash,
          salt,})
    })
}
createusers();
app.use(express.json({ limit: "20mb" }));
app.use('/api',router)
db.sequelize.sync().then(() =>{
    app.listen(port , () => {
        console.log(`Server listening on port ${port}`);
    })
})

