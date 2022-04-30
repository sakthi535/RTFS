(function(){

	const soc = io();
	let sender_uid;

	function generateID(){
		return `${Math.trunc(Math.random()*999)}-${Math.trunc(Math.random()*999)}-${Math.trunc(Math.random()*999)}`;
	}

	document.querySelector("#recv-start-con-btn").addEventListener("click",function(){
		sender_uid = document.querySelector("#join-id").value;
		if(sender_uid.length == 0){
			return;
		}
		let joinID = generateID();
		soc.emit("receiver-join", {
			sender_uid:sender_uid,
			uid:joinID
		});
		document.querySelector(".join-screen").classList.remove("active");
		document.querySelector(".fs-screen").classList.add("active");
	});

	let fShare = {};

	soc.on("fs-meta",function(mdata){
		fShare.mdata = mdata;
		fShare.transmitted = 0;
		fShare.buffer = [];

		let el = document.createElement("div");
		el.classList.add("item");
		el.innerHTML = `
				<div class="progress">0%</div>
				<div class="filename">${mdata.filename}</div>
		`;
		document.querySelector(".files-list").appendChild(el);

		fShare.progress_node = el.querySelector(".progress");

		soc.emit("fs-start",{
			uid:sender_uid
		});
	});

	soc.on("fs-share",function(buffer){
		console.log("Buffer", buffer);
		fShare.buffer.push(buffer);
		fShare.transmitted += buffer.byteLength;
		fShare.progress_node.innerText = Math.trunc(fShare.transmitted / fShare.mdata.total_buffer_size * 100);
		if(fShare.transmitted == fShare.mdata.total_buffer_size){
			console.log("Download file: ", fShare);
			download(new Blob(fShare.buffer), fShare.mdata.filename);
			fShare = {};
		} else {
			soc.emit("fs-start",{
				uid:sender_uid
			});
		}
	});

})();
