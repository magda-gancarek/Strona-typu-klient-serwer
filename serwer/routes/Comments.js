const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");


//request do tabeli comments, to poda postId
router.get("/:postId", async (req, res) => {
  //zwraca liste wszystkich komentarzy dla danego postu
  const postId = req.params.postId;
  const comments = await Comments.findAll({ where: { PostId: postId } });
  res.json(comments);
});

//tworzenie nowego komentarza
//otrzymuje zapytanie, przechgodzi przez validateToken, 
//jeśli jest poprawne i zostanie wywołana funkcja next, to wykonujemy resztę
router.post("/", validateToken, async (req, res) => {
  const comment = req.body;
  const username = req.user.username;
  comment.username = username;
  await Comments.create(comment);
  res.json(comment);
});

//usuwanie komentarza -> tylko przez autorów komentarza
router.delete("/:commentId", validateToken, async (req, res) => {
  const commentId = req.params.commentId;
  //usunięcie kometrza z tabeli 
  await Comments.destroy({where: {id: commentId},
  });
  res.json('komentarz usuniety');
});

module.exports = router;