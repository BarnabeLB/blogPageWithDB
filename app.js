//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');
// const truncate = require(__dirname + "/truncate.js");

mongoose.connect("mongodb+srv://<id+password>@learningway.h950x.mongodb.net/blogPageDB", {useNewUrlParser: true, useUnifiedTopology: true});


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();


app.set('view engine', 'ejs');                                                    // permet de séparer les header/footer

app.use(express.urlencoded({                                                      // bodyparser présent dans express, permet les req.body.[namedInput]
  extended: true
}));
app.use(express.static("public"));                                                //permet d'accéder au dossier public et au fichier présent dedans.



const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter a title !"]
  },
  content: {
    type: String,
    required: [true, "Please enter a content !"]
  }
   
});

const Post = mongoose.model('post', postSchema);

// const testPost = new Post ({
//   name: 'Test name',
//   content: 'Test content'
// });


// testPost.save();

///////////////////////////////////////////////////////////////////
app.get("/", function (req, res) {

  Post.find({}, function (err, foundPost){                     // On appelle la méthode .find pour la liste Post, {} pour all, le callback renvoit 2 info : err ou ce qu'elle a trouvé (info stockée dans la variable de notre choix)
    if(err){
      console.log(err);
    }else{
      res.render('home', {
        startingContent: homeStartingContent,
        posts : foundPost                                      // On envoit la valeur stocké dans la variable des infos trouvé à l'outil EJS
      }); 
      
    }
  });

  
});

app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {

                                              
    const post = new Post ({                                    // création d'un élément (objet JS) de la liste Post, on enregistre dans ses propriétés grace aux
    title: req.body.newTitle,                                   // inputs de compose.ejs
    content: req.body.newPublication
  });

  post.save(function (err){                                     // On enregitre l'élément de liste dans la base de donnée
    if(!err){
      res.redirect('/');                                        // s'il n'y a pas d'erreur on revient sur le home après avoir validé le formulaire
    }else{
      console.log(err);
    }
  });                                                 
 


                                            
});


                                                                                          /*automatisation de la création de page*/
/////////////////////////////////////////////////////////////////////*LECACY -- ._lowerCase ne semble pas bien fonctionner il vaut mieux passer par l'id !*/
// app.get("/posts/:postName", function (req, res) {               //
//   const requestedPostName = _.lowerCase(req.params.postName);   // récupération de la string présente après les : de la ligne précédante. Stockage dans une variable
//                                                                 // et transformation des majuscule en minuscule, des espace en dash
//   Post.find({title : requestedPostName}, function(err, foundPost){// on recherche dans la liste Post si le champ title coincide avec le nom de la page demandée
//     foundPost.forEach(function (post) {                         // pour chaque élément de la liste Post correspondant à la valeur récupérée en l.54 
      
//       const storedName = _.lowerCase(post.title);               //on stock en minuscle+dash la string             
//       console.log(storedName);

//       if(storedName === requestedPostName) {
//         res.render("post", {                                    // et si cette string partage la valeur et le type de celle que <a href></a> de home.ejs ajoute àl'adresse
//           requestedTitle : post.title,                          // alors on affiche le fichier post.ejs
//           requestedPublication : post.content                   // et on lui envoit les  valeurs titre et contenu de l'input utilisateur dans les slots prévus à cet effet
//         })
//       }
//     }) 
//   });
//////////////////////////////////////////// la boucle for classique ne semble pas aussi bien marcher que le forEach, pourquoi ?
  // for (let i = 0; i<posts.length; i++){
  //   const storedName = posts[i].title;

  //   if( storedName == requestedPostName){
  //     console.log("match found");
  //   }
  // }

// });

app.get("/posts/:postId", function (req, res) {                   // après <a> href</a> de home.ejs l'id de l'élément ajouté à la db est ajouté à l'url.
  const requestedPostId = req.params.postId;                      // récupération de la string (qui est l'id envoyé par l'anchor tag) présente après les : de la ligne précédante. Stockage dans une variable

  Post.findOne({_id : requestedPostId}, function (err, post) {    // on cherche dans la liste Post un élément dont l'id correspond à la string récupérée, on donne le nom que l'on veut au return du callback 
    if(!err){
      res.render("post", {                                        // s'il n'y a pas d'erreur on render la page post.ejd  
      requestedTitle: post.title,                                 // et on rempli les champs EJS avec le title et le content de l'élément de la liste Post correspondant
      requestedPublication: post.content
    });
    }else{
      console.log(err);
    }
  });
});
      



let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}






app.listen(port, function () {
  console.log("Server started on port 3000");
});