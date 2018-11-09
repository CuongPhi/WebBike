var router = require("express").Router();
var UserRepos = require('../repos/user');
var AuthRepos = require('../repos/auth');

router.post('/login', (req, res)=>{
     var usrname = req.body.username;
     var passw = req.body.password;
     UserRepos.login(usrname,passw)
        .then(user =>{
            if(user){                           
                var acToken = AuthRepos.generateAccessToken(user);
                var rfToken = AuthRepos.generateRefreshToken();

                AuthRepos.updateRefreshToken(user.id, rfToken)
                .then(()=>{
                    res.json({
                        auth: true,
                        user: {
                            uid :user.id,
                            username: user.username
                        },
                        access_token: acToken,
                    });
                })
                .catch(err=>{
                    console.log(err);
                    res.statusCode = 500;
                    res.end('View error log on console');
                });
            } else{
                res.status(404).send({
                    msg : "not found",
                });
            }
            
        }).catch(err => res.end(err));
 
});


module.exports = router;