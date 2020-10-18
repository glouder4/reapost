var http = require('http');
const express = require("express"); 
const mysql = require("mysql2");
const crypto = require('crypto');
const requestP = require('request-promise');
const cheerio = require("cheerio");
const fs = require('fs');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var forbiddenCharacters = ['"',"'",'\\','/',';','[',']','(',')','!','@','#','$','%','^','&','*','<','>'];

const connection = mysql.createConnection({
	charset:'utf8',
	host: "localhost",
	user: "root",
	database: "",
	password: ""
});
function databaseRequest(request,res = ""){
	return new Promise(async (resolve, reject) => {
		connection.query(request, function(err,response) {
			if(err) {
				reject(err)
			}
			else{	
				resolve(response);
			}
		})
	});
}
function Initialise(){
	databaseRequest("create database if not exists reapostdb").then(function(){
		databaseRequest("use reapostdb").then(function(response){
			databaseRequest("set session wait_timeout = 604800").then(function(response){
				databaseRequest("create table if not exists subscribersStart (id int,name text,lastname text,birthdate text,audienceSize text,profilePhoto text,myPoint text,projectName text,projectData text,login text,password text,symps text,accessKey text,instUsername text,instTokken text)").then(function(response){
					databaseRequest("create table if not exists barterList (id int,BarterTo int,barterName text,barterData text,status text,chat_id int,accessKey text)").then(function(response){
						console.log('Подключение установлено');
					}).catch(function(err){
						console.log(33,err);
					})
				}).catch(function(err){
					console.log(33,err);
				})
			}).catch(function(err){
				console.log(35,err);
			})
		}).catch(function(err){
			console.log(39,err);
		})
	}).catch(function(err){
		console.log(42,err);
	})
}
Initialise();
app.use(express.static(__dirname ));
app.get('/', function(req, res){
  res.status(200).send('<h1>Подключено</h1>').end();
});
app.post('/Profile',function(req,res){
	req.on('data',function(chunk){
		databaseRequest("select name,lastname,login,birthdate,profilePhoto,instUsername,instTokken,myPoint,projectName,projectData from subscribersStart where accessKey ='"+JSON.parse(chunk)+"'").then(function(response){
			if(response[0].login != undefined) res.status(200).send(response).end();
			else res.status(500).send('reload').end();			
		}).catch(function(err){
			res.status(500).send('reload').end();
		})
	})	
})
app.post('/getDetailProfile',function(req,res){
	req.on('data',function(chunk){
		console.log( JSON.parse(chunk).pointId,"selfId:"+JSON.parse(chunk).selfId );		
		databaseRequest("select symps from subscribersStart where id ="+parseInt( JSON.parse(chunk).pointId) ).then(function(response){
			if( response[0].symps.split(',').includes((JSON.parse(chunk).selfId).toString(),0) ) {
				databaseRequest("select name,lastname,login,birthdate,profilePhoto,instUsername,myPoint,projectName,projectData from subscribersStart where id ="+parseInt(JSON.parse(chunk).pointId) ).then(function(response){
					if(response[0].login != undefined) res.status(200).send(response).end();
					else res.status(504).send('reload').end();			
				}).catch(function(err){
					res.status(503).send('reload').end();
				})
			}
			else{
				res.status(501).send('not-muttualy').end();
			} 
		}).catch(function(err){
			res.status(502).send(err).end();
		})	
	})	
})
app.post('/PostInstaProfile',function(req,res){
	req.on('data',function(chunk){
		databaseRequest("update subscribersStart set instUsername = '"+JSON.parse(chunk).instUsername+"',instTokken = '"+JSON.parse(chunk).instTokken+"',profilePhoto='"+JSON.parse(chunk).profilePhoto+"' where accessKey ='"+JSON.parse(chunk).accesKey+"'").then(function(response){
			res.status(200).end();
		}).catch(function(err){
			console.log(err);
			res.status(500).send('reload').end();
		})			
	})	
})
app.post('/createBarter',function(req,res){
	req.on('data',function(chunk){		
		let checkedLetters = 0;
		function checkLetterName(){
			if( !(JSON.parse(chunk).barterName.split('').includes(forbiddenCharacters[checkedLetters],0)) ){
				if(checkedLetters != forbiddenCharacters.length-1) {
					checkedLetters++;
					setTimeout( function(){checkLetterName()},100 )
				}
				else{					
					databaseRequest("insert into barterList (id,BarterTo,barterName,barterData,status,accessKey) values( "+JSON.parse(chunk).selfID+", "+JSON.parse(chunk).barterTo+", '"+JSON.parse(chunk).barterName+"', '"+JSON.parse(chunk).barterData+"', 'created' ,'"+JSON.parse(chunk).accesKey+"' )").then(function(response){
						res.status(200).end(); 
					})	
				}
			}
			else{
				res.status(500).send('forbiddenCharacters-name').end()
			}
		}
		function checkLetterData(){
			if( !(JSON.parse(chunk).barterData.split('').includes(forbiddenCharacters[checkedLetters],0)) ){
				if(checkedLetters != forbiddenCharacters.length-1) {
					checkedLetters++;
					console.log("not: "+forbiddenCharacters[checkedLetters]);
					setTimeout(function(){ checkLetterData() },100 )
				}
				else{
					checkedLetters = 0;				
					setTimeout( function(){ checkLetterName() },100 )
				}
			}
			else{
				console.log("letter: "+forbiddenCharacters[checkedLetters]);
				res.status(500).send('forbiddenCharacters-data').end()
			}
		}
		checkLetterData();	
			
	})
})
app.post('/getNewsfeed',function(req,res){
	req.on('data',function(chunk){
		databaseRequest("select id,name,lastname,login,myPoint,birthdate,projectName,projectData,profilePhoto from subscribersStart").then(function(response){
			let response_1 = response;
			if(response[0] != undefined) {
					databaseRequest("select id,symps from subscribersStart where accessKey ='"+JSON.parse(chunk).accesKey+"'").then(function(response){
						res.status(200).send({data:response_1,symps:response}).end();
					})	
			}
			else{			
				res.status(500).send('reload').end();
			}
		})	
	})
})
app.post('/getBarterDetail',function(req,res){
	req.on('data',function(chunk){
		databaseRequest("select id from subscribersStart where accessKey ='"+JSON.parse(chunk).accessKey+"'").then(function(response){
			let selfID = response[0].id;
			databaseRequest("select barterName,barterData,status from barterList where BarterTo ="+selfID+" and barterName='"+JSON.parse(chunk).barterName+"'").then(function(response){
				let output = [];
				output.push({
					barterName: response[0].barterName,
					barterData: response[0].barterData,
					status: response[0].status
				})
				res.status(200).send(output).end();
			})			
		})
	})
})
app.post('/BarterAccept',function(req,res){
	req.on('data',function(chunk){
		databaseRequest("select id from subscribersStart where accessKey ='"+JSON.parse(chunk).accessKey+"'").then(function(response){
			let selfID = response[0].id;
			databaseRequest("select chat_id from barterList").then(function(response){
				let chatID = 0;
				if(response[0] != undefined) chatID = response.length;
				databaseRequest("update barterList set status='accepted',chat_id ="+chatID+" where BarterTo ="+selfID+" and barterName='"+JSON.parse(chunk).barterName+"'").then(function(response){
					res.status(200).end();
				})	
			})					
		})
	})
})
app.post('/BarterDecline',function(req,res){
	req.on('data',function(chunk){
		databaseRequest("select id from subscribersStart where accessKey ='"+JSON.parse(chunk).accessKey+"'").then(function(response){
			let selfID = response[0].id;
			databaseRequest("delete from barterList where BarterTo ="+selfID+" and barterName='"+JSON.parse(chunk).barterName+"'").then(function(response){
				res.status(200).end();
			})			
		})
	})
})
app.post('/BarterFinish',function(req,res){
	req.on('data',function(chunk){
		databaseRequest("select id from subscribersStart where accessKey ='"+JSON.parse(chunk).accessKey+"'").then(function(response){
			let selfID = response[0].id;
			databaseRequest("select chat_id from barterList").then(function(response){
				let chatID = 0;
				if(response[0] != undefined) chatID = response.length;
				databaseRequest("update barterList set status='completed',chat_id =null where BarterTo ="+selfID).then(function(response){
					res.status(200).end();
				})	
			})					
		})
	})
})
app.post('/getMyBarters',function(req,res){
	req.on('data',function(chunk){
		databaseRequest("select id from subscribersStart where accessKey ='"+JSON.parse(chunk).accessKey+"'").then(function(response){
			if(response[0] != undefined) {
				let checked = 0;
				let selfID = response[0].id;
				let BarterPhotos = [];
				databaseRequest("select id,barterName from barterList where BarterTo ="+selfID).then(function(response){
					let myBarters = response;
					countOfBarters = response.length-1;
					function getBarterDetails(){
						databaseRequest("select id,name,lastname,login,profilePhoto from subscribersStart where id ="+myBarters[checked].id).then(function(response){
							BarterPhotos.push({
								 id: response[0].id,
								 name: response[0].name,
								 lastname: response[0].lastname,
								 username: response[0].login,
								 barterName: myBarters[checked].barterName,
								 photo: response[0].profilePhoto,
							})
							if(checked == countOfBarters){
								res.status(200).send(BarterPhotos).end();
							}
							else{
								checked++;
								getBarterDetails();
							}
						})
					}					
					getBarterDetails();
				}).catch(function(err){
					console.log(err);
					res.status(500).end();
				})						
			}
			else{			
				res.status(200).send('empty').end();
			}
		})
	})
})
app.post('/getMuttualys',function(req,res){
	req.on('data',function(chunk){
		databaseRequest("select id,symps from subscribersStart where accessKey ='"+JSON.parse(chunk).accesKey+"'").then(function(response){
			if(response[0] != undefined) {
				if(response[0].symps != null){
					let countOfSypmps = response[0].symps.split(',').length-1;
					let checked = 0;
					let mutuallyList =[];
					let id = (response[0].id).toString()
					let sympList = response[0].symps;			
					function checkMutually(){
						databaseRequest( "select id,name,lastname,projectName,profilePhoto,symps,instUsername,myPoint,login from subscribersStart where id ="+parseInt( sympList.split(',')[checked]) ).then(function(response){
							if(response[0].symps != null){
								if(response[0].symps.split(',').includes( id,0) ) mutuallyList.push({
								 id: response[0].id,
								 name: response[0].name,
								 lastname: response[0].lastname,
								 username: response[0].login,
								 projectName: response[0].projectName,
								 photo: response[0].profilePhoto,
								 id:parseInt(sympList.split(',')[checked]),
								 instUsername: response[0].instUsername,
								 userPoint: response[0].myPoint
								})
								if(checked == countOfSypmps){	
									res.status(200).send({selfID:id,List:mutuallyList}).end();
								}	
								else{
									checked++;
									checkMutually();
								}
							}
							else{
								if(checked == countOfSypmps){	
									res.status(200).send({selfID:id,List:mutuallyList}).end();
								}	
								else{
									checked++;
									checkMutually();
								}
							}												
						})
					}		
					checkMutually();
				}
				else{
					res.status(200).send('empty').end();
				}								
			}
			else{			
				res.status(500).send('empty').end();
			}
		})	
	})
})
app.post('/getChatFeed',function(req,res){
	req.on('data',function(chunk){
		let chatfeed = [];
		databaseRequest("select id from subscribersStart where accessKey ='"+JSON.parse(chunk).accesKey+"'").then(function(response){			
				let selfID = response[0].id;
				databaseRequest("select BarterTo from barterList where accessKey ='"+JSON.parse(chunk).accesKey+"' and status='accepted'").then(function(response){
					for (var i = 0; i < response.length; i++) {
						chatfeed.push(response[i].BarterTo)
					}		
					console.log(chatfeed);			
					databaseRequest("select id from barterList where BarterTo ="+selfID+" and status='accepted'" ).then(function(response){
						if(response[0] != undefined) {
							for (var i = 0; i < response.length; i++) {
								chatfeed.push(response[i].id)
							}							
						}
						console.log(chatfeed);
						let getted = 0;
						let responseData = [];
						let uniq_chatFeed = [...new Set(chatfeed)];
						function getChatData(){
							databaseRequest("select id,name,lastname,profilePhoto,login,myPoint from subscribersStart where id ="+uniq_chatFeed[getted] ).then(function(response){
								if(response[0] != undefined){
									responseData.push({
										id:response[0].id,
										name:response[0].name,
										lastname:response[0].lastname,
										profilePhoto:response[0].profilePhoto,
										login:response[0].login,
										myPoint:response[0].myPoint
									})
									getted++;
									if(getted == uniq_chatFeed.length - 1) res.status(200).send(responseData).end();
									else{										
										getChatData();
									}
								}
								else{
									res.status(500).send('empty').end();
								}								
							}).catch(function(err){
								console.log(err)
								res.status(504).send(err).end();
							})
						}
						getChatData();
					}).catch(function(err){
						res.status(503).send(err).end();
					})
				}).catch(function(err){
					res.status(502).send(err).end();
				})			
		}).catch(function(err){
			res.status(501).send(err).end();
		})	
	})
})
app.post('/getChatUserDetail',function(req,res){
	req.on('data',function(chunk){
		databaseRequest("select id from subscribersStart where accessKey ='"+JSON.parse(chunk).accesKey+"'").then(function(response){
			let selfID = response[0].id;
			if(response[0] != undefined){
				databaseRequest("select name,lastname,profilePhoto,myPoint from subscribersStart where id ='"+JSON.parse(chunk).userID+"'").then(function(response){
					if(response[0] != undefined){						
						res.status(200).send({ selfID:selfID,data:response}).end();
					}
					else res.status(500).end();	
				}).catch(function(err){
					res.status(500).end();	
				})
			}
			else res.status(500).end();			
		})		
	})
})
app.get('/images/users_posts/*',function(req,res){
	res.send('<img src="'+__dirname + '/images/users_posts/photo_1.jpg'+'">')
	res.end();
	
})

app.post('/registerUser',function(req,res){
	req.on('data',function(chunk){
		let checkedLetters = 0;
		function checkLetter(){
			if( !(JSON.parse(chunk).data.login.split('').includes(forbiddenCharacters[checkedLetters],0)) ){
				if(checkedLetters != forbiddenCharacters.length-1) {
					checkedLetters++
					checkLetter();
				}
				else{
					databaseRequest("select login from subscribersStart where login ='"+JSON.parse(chunk).data.login+"'" ).then(function(response){
						if(response[0] != undefined){
							res.status(500).send('employed').end()
						}
						else{
							let accessKey = crypto.createHmac('sha1', JSON.parse(chunk).data.login).update(JSON.parse(chunk).data.login).digest('hex')
							databaseRequest("select id from subscribersStart").then(function(response){
								let count = 0;
								if(response[0] != undefined) count = response.length;
								connection.query("insert into subscribersStart (id,login,password,accessKey) values("+count+",'"+JSON.parse(chunk).data.login+"','"+crypto.createHash('md5').update(JSON.parse(chunk).data.password).digest("hex")+"','"+accessKey+"')", function(err,response) {
									if(err) {
										if(res != "") res.status(500).send('Что-то пошло не так').end()
										throw err;
									}
									else{	
										res.status(200).send(accessKey).end(); 
										return true; 																					
									}
								})
							})
						}
					}).catch(function(err){
						console.log(err);
					})
				}
			}
			else{
				res.status(500).send('forbiddenCharacters').end()
			}
		}
		checkLetter();					
	})	
})
app.post('/updateUser',function(req,res){
	req.on('data',function(chunk){
		databaseRequest("select login from subscribersStart where accessKey ='"+JSON.parse(chunk).data.accessKey+"'").then(function(response){
			if(response[0] != undefined){
				databaseRequest("update subscribersStart set name='"+JSON.parse(chunk).data.name+"',lastname='"+JSON.parse(chunk).data.lastname+"',biography='"+JSON.parse(chunk).data.biography+"' where accessKey ='"+JSON.parse(chunk).data.accessKey+"'").then(function(){
					res.status(200).end();
				}).catch(function(err){
					console.log(err);
					res.status(500).send('reload').end();
				})
			}
			else res.status(500).send('reload').end();
		}).catch(function(err){
			res.status(500).send('reload').end();
		})
	})	
})
app.post('/updateUserPhoto',function(req,res){
	req.on('data',function(chunk){
		databaseRequest("select login from subscribersStart where accessKey ='"+JSON.parse(chunk).data.accessKey+"'").then(function(response){
			if(response[0] != undefined){
				databaseRequest("update subscribersStart set profilePhoto='"+JSON.parse(chunk).data.image+"' where accessKey ='"+JSON.parse(chunk).data.accessKey+"'").then(function(){
					res.status(200).end();
				}).catch(function(err){
					console.log(err);
					res.status(500).send('reload').end();
				})
			}
			else res.status(500).send('reload').end();
		}).catch(function(err){
			res.status(500).send('reload').end();
		})
	})	
})
app.post('/updateMainInfo',function(req,res){
	req.on('data',function(chunk){
		databaseRequest("select name,lastname,birthdate from subscribersStart where accessKey='"+JSON.parse(chunk).accesKey+"'").then(function(response){
			let name = JSON.parse(chunk).name; let lastname = JSON.parse(chunk).lastname; let birthdate = (JSON.parse(chunk).adult).split('T')[0];
			if(name == "")name = response[0].name;
			if(lastname == "") lastname = response[0].lastname;
			if(birthdate == "") birthdate = response[0].birthdate;
			databaseRequest("update subscribersStart set name='"+name+"',lastname='"+lastname+"',birthdate='"+birthdate+"' where accessKey ='"+JSON.parse(chunk).accesKey+"'").then(function(){
				res.status(200).end();
			}).catch(function(err){
				console.log(err);
				res.status(500).send('reload').end();
			})
		}).catch(function(err){
			console.log(err);
			res.status(500).send('reload').end();
		})		
	})	
})
app.post('/updateUserVolume',function(req,res){
	req.on('data',function(chunk){
		databaseRequest("select audienceSize from subscribersStart where accessKey='"+JSON.parse(chunk).accesKey+"'").then(function(response){
			let volume = JSON.parse(chunk).volume;
			if(volume == "")volume = response[0].audienceSize;
			console.log(volume);
			databaseRequest("update subscribersStart set audienceSize='"+volume+"' where accessKey ='"+JSON.parse(chunk).accesKey+"'").then(function(){
				res.status(200).end();
			}).catch(function(err){
				console.log(err);
				res.status(500).send('reload').end();
			})
		}).catch(function(err){
			console.log(err);
			res.status(500).send('reload').end();
		})		
	})	
})
app.post('/updateUserAim',function(req,res){
	req.on('data',function(chunk){
		databaseRequest("select myPoint,projectName,projectData from subscribersStart where accessKey='"+JSON.parse(chunk).accesKey+"'").then(function(response){
			console.log(response);
			let cell = JSON.parse(chunk).selected;
			let projectName = JSON.parse(chunk).projectName;
			let projectData =  JSON.parse(chunk).projectData;
			if(cell == "") cell = response[0].myPoint;
			if(projectName == "") projectName = response[0].projectName;
			if(projectData == "") projectData = response[0].projectData;
			databaseRequest("update subscribersStart set myPoint = '"+cell+"',projectName='"+projectName+"',projectData='"+projectData+"' where accessKey ='"+JSON.parse(chunk).accesKey+"'").then(function(){
				res.status(200).end();
			}).catch(function(err){
				console.log(err);
				res.status(500).send('reload').end();
			})
		}).catch(function(err){
			console.log(err);
			res.status(500).send('reload').end();
		})		
	})	
})
app.post('/AuthorizeUser',function(req,res){
	req.on('data',function(chunk){
		let checkedLetters = 0;
		function checkLetter(){
			if( !(JSON.parse(chunk).data.login.split('').includes(forbiddenCharacters[checkedLetters],0)) ){
				if(checkedLetters != forbiddenCharacters.length-1) {
					checkedLetters++;
					checkLetter();
				}
				else{
					connection.query("select password,accessKey from subscribersStart where login ='"+JSON.parse(chunk).data.login+"'", function(err,response) {
						if(err) {
							throw err;
						}
						else{	
							if(response[0] != undefined){ console.log(111);
								if(response[0].password == crypto.createHash('md5').update(JSON.parse(chunk).data.password).digest("hex")){					
									res.status(200).send(response[0].accessKey).end()
								}
								else res.status(500).send('Incorrect').end();
							}
							else{
								res.status(500).send('reload').end();
							}
						}
					})
				}
			}
			else{
				res.status(500).send('forbiddenCharacters').end()
			}
		}
		checkLetter();
	})	
})
app.post('/swipeLeft',function(req,res){
	req.on('data',function(chunk){
		databaseRequest("select where accessKey='"+JSON.parse(chunk).accesKey+"'").then(function(response){
			
		}).catch(function(err){
			console.log(err);
			res.status(500).send('reload').end();
		})	
	})	
})
app.post('/swipeRight',function(req,res){
	req.on('data',function(chunk){
		databaseRequest("select symps from subscribersStart where accessKey='"+JSON.parse(chunk).accesKey+"'").then(function(response){
			if(response[0].symps != null){
				databaseRequest("update subscribersStart set symps='"+(response[0].symps+","+JSON.parse(chunk).ID)+"' where accessKey='"+JSON.parse(chunk).accesKey+"'").then(function(response){
					res.status(200).end();
				}) 
			}
			else{
				databaseRequest("update subscribersStart set symps='"+JSON.parse(chunk).ID+"' where accessKey='"+JSON.parse(chunk).accesKey+"'").then(function(response){
					res.status(200).end();
				}) 
			}
		}).catch(function(err){
			console.log(err);
			res.status(500).send('reload').end();
		})	
	})	
})

//***CHAT**//
function getChat_ID(SelfID,UserID){
	return new Promise(function (resolve,reject){
		databaseRequest("select chat_id from barterList where id = "+SelfID+" and BarterTo = "+UserID).then(function(response){	  		
	  		if(response[0] != undefined){
	  			resolve(response[0].chat_id)
	  		}
	  		else{
	  			databaseRequest("select chat_id from barterList where id = "+UserID+" and BarterTo = "+SelfID).then(function(response){
	  				resolve(response[0].chat_id)
	  			}).catch(function(err){
	  				reject(err)
			  	})
	  		} 		
	  	}).catch(function(err){
	  		reject(err)
	  	})
	})	
}
io.on("connection", socket => {
	socket.on("ONconnection", (SelfID,UserID) => {
		getChat_ID(SelfID,UserID).then(function(response){
			socket.join('chat_'+response);
			io.to('chat_'+response).emit("ONconnection", SelfID,UserID,response);	  
		}).catch(function(err){
			io.emit("not-connected", '585_'+err);
		})
		io.emit("ONconnection", SelfID,UserID);	  
	}); 
	socket.on("message", (msg,SelfID,UserID,ChatID) => {
		getChat_ID(SelfID,UserID).then(function(response){
			if(response == ChatID) io.to('chat_'+response).emit("message", msg,SelfID,UserID,response);
			else io.emit("ChatID-error", '592_'+err);
		}).catch(function(err){
			io.emit("not-connected", '594_'+err);
		})	  
	});
});
server.listen(3000, () => console.log("server running on port:" + 3000));
module.exports.app = app;