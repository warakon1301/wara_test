import express from 'express';
import alluser_collapse from '../../config/controller/user_account';
import { authenticateToken } from '../../config/jwt/jwt';
const app = express();

app.post('/register', alluser_collapse.create);
app.post('/login', alluser_collapse.Login);
app.get('/userprofile',authenticateToken,alluser_collapse.userprofile)
app.put('/updateuser',authenticateToken, alluser_collapse.updateuser)
app.get('/approveByid',authenticateToken,alluser_collapse.approveByid)
app.delete('/deleteaccByid',alluser_collapse.deleteaccByid)
app.post('/palindrome', alluser_collapse.palindrome);



export default app;
