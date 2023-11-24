const express = require("express");
const router = express.Router();
const { Users } = require("../models"); //tabele do której się odwołujemy
const bcrypt = require("bcrypt");
const {validateToken} = require('../middlewares/AuthMiddleware');
const { sign } = require("jsonwebtoken"); //generacja tokenów przy pomocy sign
const db = require("../models");

//rejestrowanie użytkownika na stronie
router.post("/", async (req, res) => {
  //pobieramy dwie osobne wartości z body
  const { username, password } = req.body;
  //sprwdzenie czy użytkownik o takiej nazwie istnieje
  const user = await Users.findOne({ where: { username: username } });
  if (user) {
    res.json({ error: "Taki użytkownik już istnieje" });
  }else {
    bcrypt.hash(password, 10) //10 - jak bardzo "zahaszowana" bedzie hasło
    .then((hash) => { //hash - to wynik haszowania
    //dodanie nowego użytkownika do bazy
      Users.create({
        username: username,
        password: hash,
      });
      res.json("SUCCESS");
    });
  }
});



//logowanie
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
 //sprawdzenie czy login jest w tabeli, user - to nasz użytkownik
  const user = await Users.findOne({ where: { username: username } });
 //gdy nie ma takiego username w bazie
  if (!user) {
      res.json({ error: "Nie ma takiego użytkownika" });
    }else {
      //sprawdzenie hasła. haszujemy nowe i sprawdzamy czy jest takie same jak wartość w bazie
         bcrypt.compare(password, user.password).then((match) => {
            if (!match) {
                res.json({ error: "Nie poprawne hasło" });
            } else {
              //gdy hasło jest poprawne
              //jeśli użytkownik się zalogował to generujemy token
              //tworzymy zmienną username na postawie pobranego użytkownika user i jego nazwy username
              const accessToken = sign(
                { username: user.username, id: user.id },
                "informacja_do_ukrycia_informacji"
              );
              res.json({token:accessToken, username: username, id:user.id});
              //przekazywane dane zostaną zakodowane
            }
        }); 
    }
});

//endpoint sprawdza czy jesteśmy poprawnie zalogowani => informacja który użytkownik
router.get('/auth', validateToken, async (req, res) =>{
  const { username, password } = req.body;
  const user = await Users.findOne({ where: { username: req.user.username } });
});


//informacje potrzebne dla profilu
//nie potrzebna jest nam validacja bo każdy może zobaczyć profil
router.get("/basicinfo/:id", async (req, res) => {
  const id = req.params.id;

  const basicInfo = await Users.findByPk(id, { //otrzymanie wszystkich info o użytkowniku na podstawie id primary key
    attributes: { exclude: ["password"] }, // poza hasłem
  });

  res.json(basicInfo);
});


//zmiana hasła
//musimy validateToken aby potwierdzić ze to poprawny użytkownik chce zmienić hasło
router.put("/changepassword", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  //musimy mieć dostęp do danych użytkownika
  const user = await Users.findOne({ where: { username: req.user.username } });
  //sprawdzamy poprawność stargo hasła
  bcrypt.compare(oldPassword, user.password).then(async (match) => {
    if (!match) {
      res.json({ error: "Błędne hasło!" });
    } else {
    //zahaszowanie nowego hasła
    bcrypt.hash(newPassword, 10).then((hash) => {
      Users.update({ password: hash },{ where: { username: req.user.username }});
      res.json("Hasło zmienione");
    });
  }});
});


module.exports = router;