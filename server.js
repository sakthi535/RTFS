const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname+"/public")));

io.on("connection", function(soc){
	soc.on("join-server",function(data){
		soc.join(data.uid);
	});
	soc.on("join-receiver",function(data){
		soc.join(data.uid);
		soc.in(data.sender_uid).emit("init", data.uid);
	});
	soc.on("metaFile",function(data){
		soc.in(data.uid).emit("fsMeta", data.metadata);
	});
	soc.on("fsStart",function(data){
		soc.in(data.uid).emit("fsShare", {});
	});
	soc.on("rawRaw",function(data){
		soc.in(data.uid).emit("fsShare", data.buffer);
	})
});

server.listen(5000);