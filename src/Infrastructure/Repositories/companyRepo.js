const CompanySchema = require('../../Domain/Entities/company');  

class CompanyRepo {
    async getAllCompanies(userId) {
        const companiesData = await CompanySchema.find({ userId }).populate('userId').lean();
        return companiesData;
      }
    
      async getCompanyById(companyId) {
        const company = await CompanySchema.findById(companyId).populate('userId').lean();
        if (!company) {
          throw new Error('Company not found');
        }
        return company;
      }
      
      async getCompanyByOwnerId(userId) {
        const company = await CompanySchema.findOne({ userId }).populate('userId').lean();
        if (!company) {
          throw new Error('Company not found for this user');
        }
        return company;
      }
  async createCompany(companyData) {
      const newCompany = new CompanySchema(companyData);
      await newCompany.save();
      return newCompany;
  }

  async updateCompany(companyId, updateData) {
      const updatedCompany = await CompanySchema.findByIdAndUpdate(
          companyId,
          { $set: updateData },
          { new: true }
      );
      if (!updatedCompany) {
          throw new Error('Company not found');
      }
      return updatedCompany;
  }

  async deleteCompany(companyId) {
      const result = await CompanySchema.findByIdAndDelete(companyId);
      if (!result) {
          throw new Error('Company not found');
      }
      return result;
  }

  async GetCompanyByOwnerID(id){
    const company = await CompanySchema.find({userId:id}).populate('userId').lean();
    if (!company) {
        throw new Error('Company not found');
    }
    return company;
  }


 
}

module.exports = CompanyRepo;