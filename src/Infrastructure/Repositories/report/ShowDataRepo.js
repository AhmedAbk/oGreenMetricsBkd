const FuelRepo = require("../../../Infrastructure/Repositories/scope1/fuelcombutionRepo");
const ProductionRepo = require("../../../Infrastructure/Repositories/scope1/productionRepo");

const HeatingRepo = require("../../../Infrastructure/Repositories/scope2/heatingRepo");
const CoolingRepo = require("../../../Infrastructure/Repositories/scope2/coolingRepo");
const EnergyRepo = require("../../../Infrastructure/Repositories/scope2/energyConsumptionRepo");

const TransportRepo = require("../../../Infrastructure/Repositories/scope-3/TransportRepo");
const DechetRepo = require("../../../Infrastructure/Repositories/scope-3/DechetRepo");
const CapitalGoodRepo = require("../../../Infrastructure/Repositories/scope-3/CapitalGoodRepo");
const BusinessTravelRepo = require("../../../Infrastructure/Repositories/scope-3/BusinessTravelRepo");
const purchasedGoodAndService = require("../../../Infrastructure/Repositories/scope-3/PurchasedGoodsAndServiceRepo")
const EmployesTransport = require("../../../Infrastructure/Repositories/scope-3/EmployesTransportRepo")

class ShowDataRepo {
  constructor() {
    this.heatingRepo = new HeatingRepo();
    this.coolingRepo = new CoolingRepo();
    this.energyRepo = new EnergyRepo();

    this.transportRepo = new TransportRepo();
    this.dechetRepo = new DechetRepo();
    this.capitalGoodRepo = new CapitalGoodRepo();
    this.businessTravelRepo = new BusinessTravelRepo();

    this.EmployesTransport = new EmployesTransport();
  }

  async generateDataByCompanyId(company_id) {
    const scope1Data = {
      fuelCombution: await FuelRepo.findFuelById(company_id),
      production: await ProductionRepo.getproductionbyID(company_id),
    };

    const scope2Data = {
      heating: await this.heatingRepo.getHeatingByCompanyId(company_id),
      cooling: await this.coolingRepo.getCoolingByCompanyId(company_id),
      energyConsumption: await this.energyRepo.getEnergyConsumptionByCompanyId(company_id),
    };

    const scope3Data = {
      transport: await this.transportRepo.getTransportById(company_id),
      dechet: await this.dechetRepo.getDechetById(company_id),
      capitalGood: await this.capitalGoodRepo.getCapitalGoodByCompanyId(company_id),
      businessTravel: await this.businessTravelRepo.getBusinessTravelByCompanyId(company_id),
      employesTransport:await this.EmployesTransport.getAllEmployesTransports(company_id),
      purchasedGood:await purchasedGoodAndService.getByCompanyId(company_id)
    };

    return {
      company_id,
      scope1Data,
      scope2Data,
      scope3Data,
      generatedAt: new Date(),
    };
    
  }
}

module.exports = ShowDataRepo;
