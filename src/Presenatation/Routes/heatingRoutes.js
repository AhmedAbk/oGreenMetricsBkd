const HeatingRepo = require('../../Infrastructure/Repositories/heatingRepo');
const HeatingService = require('../../Application/Services/heatingService');
const HeatingController = require('../Controllers/heatingController');

async function heatingRoute(fastify, options) {
  const heatingRepo = new HeatingRepo();
  const heatingService = new HeatingService(heatingRepo);
  const heatingController = new HeatingController(heatingService);

  fastify.get('/heating/:company_id', (req, reply) => heatingController.getHeating(req, reply));
  fastify.post('/heating', (req, reply) => heatingController.addHeating(req, reply));
  fastify.put('/heating/:recordId/heater/:heaterId', (req, reply) => heatingController.updateHeater(req, reply));
  fastify.delete('/heating/:recordId/heater/:heaterId', (req, reply) => heatingController.deleteHeater(req, reply));
}

module.exports = heatingRoute;