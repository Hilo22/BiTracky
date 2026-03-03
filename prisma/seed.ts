import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })


async function main(){
    const user= await prisma.user.create( {
        data:{
        email: 'hieup0706@gmail.com',
        password: 'babinme456' ,
        links: {
        create: [
          {
            title: 'Facebook của Hiếu',
            originalUrl: 'https://facebook.com/hieu.dev',
            slug: 'fb-hieu',
          },
        ],

    },
}
})
console.log(user);
}

main()
.then(async () =>{
    prisma.$disconnect();
})
.catch(async (e)=>{
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
    
})
