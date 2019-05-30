const bcrypt = require('bcrypt');

var o = {};

bcrypt.hash("test", 10, (e, hash)=>{
    console.log(hash);
    o.h1 = hash;

    bcrypt.hash("test", 10, (e, hash)=>{
        console.log(hash);
        o.h2 = hash;

        bcrypt.hash("test", 10, (e, hash)=>{
            console.log(hash);
            o.h3 = hash;

            console.log(o);
            
            bcrypt.compare("test", o.h1, (e, v)=>{
                console.log(`h1: ${v}`);

                bcrypt.compare("test", o.h2, (e, v)=>{
                    console.log(`h2: ${v}`);

                    bcrypt.compare("test", o.h3, (e, v)=>{
                        console.log(`h3: ${v}`);
                    })
                })
            })
        });
    });
});
