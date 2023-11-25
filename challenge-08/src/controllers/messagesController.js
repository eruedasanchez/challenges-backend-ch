/*-------------------------*\
    #MESSAGES CONTROLLER
\*-------------------------*/

async function renderChat(req, res) {
    try {
        res.setHeader('Content-Type','text/html');
        return res.status(200).render('chat', { header: 'Inicio | Chat' });
    } catch (error) {
        return res.status(500).json({error:'Error inesperado', detalle:error.message});
    }
}

export default { renderChat };




