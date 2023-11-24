//bierzemy token wysłany z frontendu, sprawdzamy przy pomocy jwt czy jest poprawne
//jeśli tak to kontywułujemy i dodajemy dane do bazy
//dodawanie komentarzy -> sprawdzenie czy użytkownik jest zalogowany

const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");

  if (!accessToken) return res.json({ error: "Użytkownik nie jest zalogowany" });

  try {
    //porównujemy pobrany accessToken z 
    const validToken = verify(accessToken, "informacja_do_ukrycia_informacji");
    req.user = validToken; //object zawierajacy username i id
    if (validToken) {
      return next();
    }
  } catch (err) {
    return res.json({ error: err });
  }
};

//eksportjemy aby mieć dostęp z innych plików
module.exports = { validateToken };