var clubInfo;
var url= "https://api.brawlstars.com/v1/clubs/%2328GYUQJ9Q/members";//https://api.brawlstars.com/v1/clubs/%2328GYUQJ9Q/members";
var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjljNDE1NmI4LTcxMzgtNGNmOS04ODNlLTIyZGJjZmVlYWY3MiIsImlhdCI6MTYwNzM4MjEzOCwic3ViIjoiZGV2ZWxvcGVyLzQ1NDQ2MzUzLWJmMmEtNzcyZC0xN2I4LTJhNjY1ODk3NzhiNCIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiMTYyLjIyMi44MC4yNDAiXSwidHlwZSI6ImNsaWVudCJ9XX0.aB6ruGD-Ve-BXyvPq_p0WVU3xfptbIOsvqW0L2GflxwrKfgEvUJaLb1b59Emcv8wLhQSKjbFnFjoNJKo1J7Hzg";
/**
$.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    accept: "application/json",
    headers: {
    	"Access-Control-Allow-Origin": "*",
    	"Access-Control-Allow-Headers": "Access-Control-Request-Method,Access-Control-Request-Headers,Access-Control-Allow-Headers,Authorization,DNT,Origin,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type",
    	Authorization: "Bearer " + token
    },
    success: function(result, status, xhr){
    	clubInfo = JSON.parse(result);
    	console.log(clubInfo);
    }
});
**/
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
 
function p(name, a, b, c, d, e, f, g){
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
	};
}
var info = [p("Charles", 0, 1, 2, 3, 4, 5, 6), p("Alice", 0, 1, 2, 3, 4, 5, 7), p("Alice", 0, 1, 2, 3, 4, 5, 7),  
p("Alice", 0, 1, 2, 3, 4, 5, 7),  p("Alice", 0, 1, 2, 3, 4, 5, 7)];
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
	for (var n in player){
		var playerBox = document.createElement("TD");
		var playerNode = document.createTextNode(player[n]);
		playerBox.appendChild(playerNode);
		node.appendChild(playerBox);
	}
	
	leaderboard.appendChild(node);
}
