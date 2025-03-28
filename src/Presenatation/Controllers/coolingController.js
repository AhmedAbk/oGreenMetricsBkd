class CoolingController {
  constructor(coolingService) {
    this.coolingService = coolingService;
  }

  async getCooling(req, reply) {
    const { company_id } = req.params; // Expect company_id from route
    try {
      const cooling = await this.coolingService.getCoolingByCompanyId(company_id);
      reply.send({ success: true, data: cooling });
    } catch (error) {
      reply.status(500).send({ success: false, message: error.message });
    }
  }

  async addCooling(req, reply) {
    const { name, type, energy, company_id } = req.body; // Added company_id
    try {
      const result = await this.coolingService.addCooling(name, type, energy, company_id);
      reply.send({ success: true, data: result });
    } catch (error) {
      reply.status(400).send({ success: false, message: error.message });
    }
  }

  async updateCooler(req, reply) {
    const { recordId, coolerId } = req.params;
    const { name, type, energy } = req.body;
    try {
      const updatedCooling = await this.coolingService.updateCooler(recordId, coolerId, name, type, energy);
      reply.send({ success: true, data: updatedCooling });
    } catch (error) {
      reply.status(400).send({ success: false, message: error.message });
    }
  }

  async deleteCooler(req, reply) {
    const { recordId, coolerId } = req.params;
    try {
      const updatedCooling = await this.coolingService.deleteCooler(recordId, coolerId);
      reply.send({ success: true, data: updatedCooling });
    } catch (error) {
      reply.status(400).send({ success: false, message: error.message });
    }
  }
}

module.exports = CoolingController;