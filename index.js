import express from "express";
import {createServer} from "node:http";
import { fileURLToPath } from "node:url";
import {dirname,join} from "node:path";
import { Server } from "socket.io";
import sqlite3 from "sqlite3";
import {open} from "sqlite";
import { availableParallelism } from 'node:os';
import cluster from 'node:cluster';
import { createAdapter, setupPrimary } from '@socket.io/cluster-adapter';

if (cluster.isPrimary) {
  const numCPUs = availableParallelism();
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({
      PORT: 3000 + i
    });
  }

  setupPrimary();
} else {
  const db = await open({
    filename: 'chat.db',
    driver: sqlite3.Database
  });

 await db.exec(`
    CREATE TABLE IF NOT EXISTS messages(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_offset TEXT UNIQUE,
    content TEXT
    );
`);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
  adapter: createAdapter()
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/',(req,res)=>{
    res.sendFile(join(__dirname,'index.html'));
})

io.on("connection", async (socket)=>{
    console.log("a user connected");
    socket.on("chat message",async (msg,clientOffset,callback)=>{
        let result;
        try{
            result = await db.run(`INSERT INTO messages (content,client_offset) VALUES (?,?)`,msg,clientOffset);
            io.emit("chat message", msg, result.lastID);
            if (typeof callback === 'function') {
                    callback("ok");
                    }
        }catch(e){
            if (e.errno === 19) {
                if (typeof callback === 'function') {
                    callback("ok");
                    }
            } else {
                console.error("DB error:", e.message);
                if (typeof callback === 'function') {
                    callback("fail");
                    }

            }

        }
    })
    socket.on("disconnect",()=>{
        console.log("a user disconnected");
    })

    if(!socket.recovered){
        try{
            await db.each(`SELECT id, content FROM messages WHERE id > (?)`,[socket.handshake.auth.serverOffset || 0],
                (err,row)=>{
                    socket.emit("chat message",row.content,row.id);
                }
            );
        }catch(e){
            console.log("Something went wrong",e.message);
            socket.emit("chat message","can't send data",0);
            return;
        }
    }
})

const port = process.env.PORT;

  server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
  });
}