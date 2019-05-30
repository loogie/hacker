const {exec} = require ('child_process');

exec(__dirname + '\\rethinkdb\\Rethinkdb.exe create', (err, stdout, stderr)=>{
    if (err){
        console.log("node couldn't execute command");
        console.log(err);
        return;
    }

    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
});


/*const startup = () =>{
    exec(__dirname + '\\rethinkdb serve --config-file ..\\config.conf', (err, stdout, stderr)=>{
        if (err){
            console.log("node couldn't execute command");
            console.log(err);
            return;
        }

        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    })
}*/