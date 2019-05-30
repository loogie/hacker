const {exec} = require ('child_process');
const socketio = require('socket.io');
const r = require('rethinkdb');
const bcrypt = require('bcrypt');

var usersOnline = [];

console.log("Sockets open on port 3030");
const io = socketio.listen(3030);
io.on('connection', (client)=>{
    console.log("Client Connected.");
    
    r.connect({db:'hackerdb'}).then((conn)=>{
        //User Login Methods
        createClient(conn, client);
        loginClient(conn, client);
        logoutClient(client);

    });
})

/**
 * Logout Handler
 * @param {*} client Socket connection
 * 
 * Handles user logout from client (not socket disconnection)
 */
const logoutClient = (client) =>{
    client.on('user_logout', ()=>{
        let i = -1;

        for (let j = 0; j < usersOnline.length; j++){
            let u = usersOnline[j];
            if (u.client === client.id){
                i = j;
                break;
            }
        }

        if (i !== -1){
            console.log("User " + usersOnline[i].profile.id + " has logged out");
            usersOnline.splice(i, 1);
        }
    });
}

/**
 * Login Handler
 * @param {*} conn RethinkDb connection
 * @param {*} client Socket connection
 * 
 * Handles client socket login attempt. Handles wrong password error and successful login
 * credentials returns user profile
 */
const loginClient = (conn, client) =>{
    client.on('user_login', (login)=>{
        validateLogin(conn, login).then((profile)=>{
            console.log(login.name + " has logged in successfully");
            client.emit("user_validate", profile);
            usersOnline.push({name: profile.id, client: client.id, profile});
        })
        .catch((e)=>{
            client.emit("user_error", e);
        })
    });
}

const validateLogin = (conn, login) =>{
    return new Promise((resolve, reject)=>{
        r.table('users').get(login.name).run(conn, (e, u)=>{
            if (u){
                bcrypt.compare(login.pass, u.hash, (e, res)=>{
                    if (e) reject(e);

                    if (res){
                        r.table('profiles').get(login.name).run(conn, (e, profile)=>{
                            if (e) reject(e);
                            resolve(profile);
                        });
                    }
                    else {
                        reject({msg: "Login attempt failed."});
                    }
                });
            }
            else {
                reject({msg: "Login attempt failed."});
            }
        });
    });
}

/**
 * Create Client Function
 * @param {*} conn Connection to RethinkDb
 * @param {*} client Socket connection
 * 
 * Catches a "create_user" request from client. Handles duplicate user name error or creates 
 * and returns user profile on successful creation.
 */

const createClient = (conn, client) =>{
    client.on('create_user', (login)=>{
        r.table('users').get(login.name).run(conn, (e, c)=>{
            if (c == null){
                createNewUser(conn, login).then(()=>{
                    //valid user created;
                    createUserProfile(conn, {id:login.name, nick:login.name}).then((profile)=>{
                        console.log(login.name + " user has been created");
                        client.emit("user_validate", profile);
                        usersOnline.push({name: profile.id, client: client.id, profile});
                    });
                });
            }
            else {
                console.log("Client tried to create user, name already exists");
                client.emit("user_error", {msg:"User already exists"});
            }
        });
    });
}

const createUserProfile = (conn, profile) => {
    return new Promise((resolve, reject)=>{
        r.table('profiles').insert(profile).run(conn, (e, res)=>{
            if (e) reject(e);
            resolve(profile);
        });
    });
}

const createNewUser = (conn, login) =>{
    return new Promise((resolve, reject)=>{
        bcrypt.hash(login.pass, 10).then((hash)=>{
            let user = {id:login.name, hash:hash};
            r.table('users').insert(user).run(conn, (e, res)=>{
                if (e) reject(e);
                resolve();
            });
        })
        .catch((e)=>{
            reject(e);
        });
    });
}

