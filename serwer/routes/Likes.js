const express = require("express");
const { validateToken } = require("../middlewares/AuthMiddleware");
const router = express.Router();
const { Likes } = require("../models"); //tabela do której chemy mieć dostęp

//zliczenie ile wierszy w kolumnie aby określić ilość like
//zalogowany użytkownik może polubić posty
router.post("/",  validateToken, async ( req, res) => {
    const {PostId} = req.body;
    const UserId = req.user.id;
    //sprawdzenie czy użytkownik polubił już dany post w tabeli
    const found = await Likes.findOne({ 
        where: { PostId: PostId, UserId: UserId },
    });
    //gdy nie polubił jeszcze
    if (!found) {
        await Likes.create({ PostId: PostId, UserId: UserId});
        res.json({liked: true});
    } 
    //usunięie polubienia
    else {
        await Likes.destroy({
            where: {  PostId: PostId, UserId: UserId}});
        res.json({liked: false}); 
    }
    
});

module.exports = router;
