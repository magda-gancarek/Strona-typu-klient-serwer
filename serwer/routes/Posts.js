const express = require("express");
const router = express.Router();
const { Posts, Likes, Comments } = require("../models"); //tabele do której chemy mieć dostęp
const { validateToken } = require("../middlewares/AuthMiddleware");

//request response
//otrzymanie wszystkich danych z tabeli 
//sprawdzenie poprawności tokenu użytkownika
//Plus połaczenie z tabelą likes aby mieć post z ilością polubień 
router.get("/", validateToken, async (req, res) => {
  const listOfPosts = await Posts.findAll({ include: [Likes] });
  //wszytskie posty które użytkownik polubił
  const likedPosts = await Likes.findAll({where: {UserId: req.user.id}});
  res.json({listOfPosts:listOfPosts, likedPosts:likedPosts}); //wyświteli w formacie json
});

//odpytujemy posty na podstawie ich id
//wstawianie danych do bazy
//async - aby czekać na wprowadzenie wszystch danych przed wykonaniem innego kodu
//w insomnia gdy wysłamy request -> udaje się na stone sprawdza czy są jakieś post requests i wykonuje kod
router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id); //find by primary key = id. zwraca jeden wiersz z tabeli
  res.json(post);
});

//odpytujemy wszytskie posty na podstawie id ich autora
router.get("/byUserId/:id", async (req, res) => {
  const id = req.params.id;
  const listOfPosts = await Posts.findAll({where: {UserId:id},  include: [Likes] }); //połaczenie tabel
  res.json(listOfPosts);
});

//utworzenie postu i  dodanie do tabeli
router.post("/", validateToken, async (req, res) => {
  //body- dane które przesyłami w request
  const post = req.body; //post zawieta tylko: title, textPost czyli url zdjęcia
  //post.title - dostep do konkretnych danych
  post.username = req.user.username; //aby uzyskać użytkownika przesyłany accesToken (sprawdzany w validateToken a tam mamy username i id)
  post.UserId = req.user.id;
  await Posts.create(post); //wpisanie do tablicy danych
  res.json(post); //zwrac te same dane dla potwierdzenia
});

//usunięcie postu
router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId; 
  await Posts.destroy({where: {id: postId},
  });
  res.json('post usuniety');
});

//edycja postu TYTUŁ - validacja bo tylko użytkownik może zmienić swój post
router.put("/title", validateToken, async (req, res) => {
  const {NewTitle, id} = req.body;
  await Posts.update({title: NewTitle}, {where: {id:id}});
  res.json(NewTitle); 
});

//edycja postu TREŚĆ - validacja bo tylko użytkownik może zmienić swój post
router.put("/", validateToken, async (req, res) => {
  const {NewText, id} = req.body;
  await Posts.update({title: NewText}, {where: {id:id}});
  res.json(NewText); 
});


module.exports = router;