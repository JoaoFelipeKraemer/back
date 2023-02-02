// const existingId = (req, res, next) => {
//     const id = Number(req.params.id);
  
//     if (teams.some((t) => t.id === id)) {
//       // se existe, a requisição segue para o próximo middleware
//       return next();
//     }
  
//     // se não existe, então vamos retornar o status HTTP 404
//     res.sendStatus(404);
//   };
const teams = [
    { id: 1, nome: 'São Paulo Futebol Clube', sigla: 'SPF' },
    { id: 2, nome: 'Sociedade Esportiva Palmeiras', sigla: 'PAL' },
  ];


  const existingId = (req, res, next) => {
    const id = Number(req.params.id);
    if (!teams.some((t) => t.id === id)) {
      return res.sendStatus(404).json({ message: 'Time não encontrado' });
    }
    next();
  };
  module.exports = existingId;    