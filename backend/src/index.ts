import "dotenv/config"
import { IoManager } from './managers/IoManager.js';
import { UserManager } from './managers/UserManager.js';
import { connectDb } from "./db.js";
import { authRoutes } from "./routes/authRoutes.js";
import { templateRoutes } from "./routes/templateRoutes.js";


async function main(){
    await connectDb();
    const httpServer=IoManager.getHttpServer();
    const io=IoManager.getIo();

    const app=IoManager.getApp();
    app.use("/auth",authRoutes)
    app.use("/templates",templateRoutes);


    const userManager= new UserManager()
    io.on('connection', (socket)=>{

        userManager.adduser(socket);

    })

    const port = Number(process.env.PORT) || 3000;
    httpServer.listen(port,()=> console.log(`server listening on http://localhost:${port}`))

}

main().catch((err)=> {
        console.error("failed to start server: ",err);
        process.exit(1);
    })
