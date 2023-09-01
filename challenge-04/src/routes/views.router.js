import express from 'express';
export const router = express.Router();

router.get('/',(req,res) => {
    res.setHeader('Content-Type','text/html');
    res.status(200).render('home');
});





// import {heroes} from '../data/heroes.js';

// router.get('/',(req,res)=>{
//     res.setHeader('Content-Type','text/html');
//     res.status(200).render('home',{
//         heroe:heroes[numero].name,
//         identidad:heroes[numero].alias,
//         equipo:heroes[numero].team,
//         empresa:heroes[numero].publisher,
//         poderes:heroes[numero].powers,
//         enemigos:heroes[numero].enemies,
//         esMarvel:heroes[numero].publisher==='Marvel'?true:false
//     });
// })

// router.get('/realtimeproducts',(req,res)=>{
//     res.setHeader('Content-Type','text/html');
//     res.status(200).render('realTimeProducts',{
//         heroe:heroes[numero].name,
//         identidad:heroes[numero].alias,
//         equipo:heroes[numero].team,
//         empresa:heroes[numero].publisher,
//         poderes:heroes[numero].powers,
//         enemigos:heroes[numero].enemies,
//         esMarvel:heroes[numero].publisher==='Marvel'?true:false
//     });
// })


// module.exports = router;