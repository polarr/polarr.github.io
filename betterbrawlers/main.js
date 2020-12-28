var clubInfo;
var url= "https://api.brawlstars.com/v1/clubs/%2328GYUQJ9Q/members";
var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjljNDE1NmI4LTcxMzgtNGNmOS04ODNlLTIyZGJjZmVlYWY3MiIsImlhdCI6MTYwNzM4MjEzOCwic3ViIjoiZGV2ZWxvcGVyLzQ1NDQ2MzUzLWJmMmEtNzcyZC0xN2I4LTJhNjY1ODk3NzhiNCIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiMTYyLjIyMi44MC4yNDAiXSwidHlwZSI6ImNsaWVudCJ9XX0.aB6ruGD-Ve-BXyvPq_p0WVU3xfptbIOsvqW0L2GflxwrKfgEvUJaLb1b59Emcv8wLhQSKjbFnFjoNJKo1J7Hzg";

/**
fetch(url, {
  mode: "cors",
  method: "GET",
  withCredentials: true,
  headers: {
    "X-Auth-Token": token,
    "Content-Type": "application/json"
  }
}).then(resp => resp.json())
.then(function(data) {
console.log(data);
})
.catch(function(error) {
console.log(error);
});
**/

$.ajax({
    url: url,
    type: "GET",
    accept: "application/json",
    async: false,
    headers: {
    	Authorization: "Bearer " + token
    }
}).done(function(response){
	clubInfo = response.items;
	console.log("Information sucessfully fetched from " + url);
	console.log(clubInfo);
});

function p(name, a, b, c, d, e, f, g, color){
	var sum = a + b + c + d + e + f + g;
	return {
		name: name,
		a: a,
		b: b,
		c: c,
		d: d, 
		e: e,
		f: f,
		g: g,
		raw: sum,
		total: sum,
		color: color,
	};
}

function getLuminosity(k){
	var c = k.substring(1);      // strip #
	var rgb = parseInt(c, 16);   // convert rrggbb to decimal
	var r = (rgb >> 16) & 0xff;  // extract red
	var g = (rgb >>  8) & 0xff;  // extract green
	var b = (rgb >>  0) & 0xff;  // extract blue

	return (r + g + b)/255; // per ITU-R BT.709
}

var info = [];

for (var i in clubInfo){
	var member = clubInfo[i];
	info.push(p(member.name, 0, 0, 0, 0, 0, 0, member.trophies, member.nameColor));
}

info.sort(function (a, b){
	return b.total - a.total;
});
for (var i = 0; i < info.length; ++i){
	var player = info[i];

	var node = document.createElement("TR");
	var playerBox = document.createElement("TD");
	var playerNode = document.createTextNode(i + 1);
	playerBox.appendChild(playerNode);
	node.appendChild(playerBox);
	var k = 0;
	for (var n in player){
		var playerBox = document.createElement("TD");
		var playerNode = document.createTextNode(player[n]);
		if (k == 0){
			nameColor = player[Object.keys(player)[10]];
			nameColor = "#" + nameColor.substring(2, nameColor.length);
			/*
			if (getLuminosity(nameColor) > 2){
				playerBox.style = "text-shadow: 0 0 3px #FFFFFF, 0 0 5px #FFFFFF; font-weight: bold; color: " + nameColor;
			}
			else{
			*/
			playerBox.style = "text-shadow: 0 0 1px #000000, 0 0 1px #000000; font-weight: bold; color: " + nameColor;
		}
		else if (k == 9){
			playerBox.style = "font-weight: bold;";
			playerBox.appendChild(playerNode);
			node.appendChild(playerBox);
			break;
		}
		playerBox.appendChild(playerNode);
		node.appendChild(playerBox);
		k++;
	}
	
	leaderboard.appendChild(node);
}