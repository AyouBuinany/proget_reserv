var express=  require('express');
var fs = require('fs');
var body_parser= require('body-parser');
var app = express();
app.use(body_parser.urlencoded({extended:false}));
app.set('view engine','ejs');
app.use(express.static('./tous'));
//var url = require('url');
app.use(body_parser.json());
var wd= fs.readFileSync('./tous/data/jsoninscris.json');
var client= fs.readFileSync('./tous/data/Client.json');
var list_client= JSON.parse(client);
var list_user= JSON.parse(wd);
app.get('/',(req,resp)=>{
console.log(list_user);
resp.render('pages/login');
});
app.get('/gestion',(req,resp)=>{
    resp.render('pages/gestion',{list_client});
    });
    app.post('/addClient',(req,resp)=>{
        var {Nom,Prenom,Age,Cin,Adresse,Email,Password,Telephone}=req.body;
        if(list_client.length!==0){
            for(var i in list_client){
                if(Cin===list_client[i].Cin){
                    resp.render('pages/gestion',{list_client,error:"CIN Déja Exist !"});
                   return list_client.push();
                }
                else{
                    var c={
                        'id':list_client.length+1,
                        "Nom":Nom,
                        "Prenom":Prenom,
                        "Age":Age,
                        "Cin":Cin,
                        "Adresse":Adresse,
                        "Email":Email,
                        "Password":Password,
                        "Telephone":Telephone
                       };
            }
            }
            }
            else{
                var c={
                    'id':list_client.length+1,
                    "Nom":Nom,
                    "Prenom":Prenom,
                    "Age":Age,
                    "Cin":Cin,
                    "Adresse":Adresse,
                    "Email":Email,
                    "Password":Password,
                    "Telephone":Telephone
                   };
            }
        list_client.push(c);
console.log('c ' + JSON.stringify(list_client));
fs.writeFile('./tous/data/Client.json',JSON.stringify(list_client,null,5),(err)=>{
console.log(err);
});
resp.redirect('/gestion');
    });
app.post('/inscription',(req,resp)=>{
console.log(JSON.stringify(req.body));
console.log('m' +list_user.length );
if(list_user.length!==0){
for(var i in list_user){
    if(req.body.email===list_user[i].email){
        resp.render('pages/login',{error:"Compte Déja Exist !"});
       return list_user.push();
    }
    else{
        var l={
            "name":req.body.name,
            "email":req.body.email,
            "password":req.body.password
        };
}
}
}
else{
    var l={
        "name":req.body.name,
        "email":req.body.email,
        "password":req.body.password
    };
}
resp.render('pages/login',{error:"Welcome !"});
list_user.push(l);
fs.writeFile('./tous/data/jsoninscris.json',JSON.stringify(list_user,null,5),(err)=>{
console.log(err);
});

});
app.post('/login',(req,resp)=>{

for(var i in list_user){
    if(req.body.email===list_user[i].email && req.body.password===list_user[i].password){
       resp.redirect('/gestion');
    }else{
        console.log('now');
        resp.redirect('/');
    }
}
});


//Edit
let index;
app.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    console.log('iii' + id);


	for (let i = 0; i < list_client.length; i++) {
		if (Number(id) === list_client[i].id) {
			index = i;
		}
    }
    console.log('index' + JSON.stringify(list_client[index]));
    res.render('pages/modifier', {list: list_client[index]});
});

app.post('/modifier', (req, res) => {
    console.log('index ' + index);
	const {Nom,Prenom,Age,Adresse,Telephone } = req.body;
   list_client[index].Nom = Nom;
   list_client[index].Prenom = Prenom;
   list_client[index].Age = Age;
   list_client[index].Adresse = Adresse;
   list_client[index].Telephone = Telephone;
	fs.writeFileSync('./tous/data/Client.json', JSON.stringify(list_client, null, 4));
    res.render('pages/modifier', {list: list_client[index],tester:"Modifier avec success !"});
});

app.get('/delete/:id' ,(req,resp)=>{
    const {id}=req.params;
    var dataVid=[];
    for(var i in list_client){
        if(Number(id)!==list_client[i].id){
            console.log('supprimer');
            dataVid.push(list_client[i]);
        }
    }
    list_client=dataVid;
    fs.writeFileSync('./tous/data/Client.json',JSON.stringify(list_client,null,5));
    resp.redirect('/gestion');
});
app.listen(3000);