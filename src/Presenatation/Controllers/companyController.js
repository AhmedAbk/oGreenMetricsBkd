class companyController {
    constructor(companyService) {
      this.companyService = companyService;
    }
   
    async getCompanies(req, reply) {
      try {
        const companies = await this.companyService.getAllCompanies();
        reply.send({ success: true, data: companies });
      } catch (error) {
        reply.status(500).send({ success: false, message: error.message });
      }
    }
   
    async registercompany(req, reply) {
      console.log(req.body); 
      const { nom_entreprise, matricule_fiscale, email, num_tel, adresse, date_fondation, industrie } = req.body;
      try {
        const result = await this.companyService.createCompany(nom_entreprise, matricule_fiscale, email, num_tel, adresse, date_fondation, industrie);
        reply.send({ success: true, data: result });
      } catch (error) {
        reply.status(400).send({ success: false, message: error.message });
      }
    }
    
   
    async updatecompany(req, reply) {
      const { id } = req.params;
      const updateData = req.body;
      try {
        const updatedCompany = await this.companyService.updateCompany(id, updateData);
        reply.send({ success: true, data: updatedCompany });
      } catch (error) {
        reply.status(400).send({ success: false, message: error.message });
      }
    }
   
    async getcompany(req, reply) {
      const { id } = req.params;
      try {
        const company = await this.companyService.getCompanyById(id);
        reply.send({ success: true, data: company });
      } catch (error) {
        reply.status(404).send({ success: false, message: error.message });
      }
    }
   
    async deletecompany(req, reply) {
      const { id } = req.params;
      try {
        const isDeleted = await this.companyService.deleteCompany(id);
        if (isDeleted) {
          reply.send({ success: true, message: 'Company deleted successfully' });
        } else {
          reply.status(404).send({ success: false, message: 'Company not found' });
        }
      } catch (error) {
        reply.status(500).send({ success: false, message: error.message });
      }
    }
  }
  
  module.exports = companyController;
  