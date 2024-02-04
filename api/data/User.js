import bcrypt from 'bcrypt'

export const users = [
    {
        name:"inam",
        email:"inam@gmail.com",
        password:bcrypt.hashSync('123456',10),
        admin:true
    },
    {
        name:"ikram",
        email:"ikram@gmail.com",
        password:bcrypt.hashSync('123456',10),
        admin:true
    },
    {
        name:"srk",
        email:"srk@gmail.com",
        password:bcrypt.hashSync('123456',10),
        admin:false
    }
]