// Modified fuelService.js
const fuelcombutionRepo = require('../../Infrastructure/Repositories/fuelcombutionRepo');
const productionRepo = require('../../Infrastructure/Repositories/productionRepo');

// Emission factors (in kg CO2 per unit)
const EMISSION_FACTORS = {
  "Natural Gas": 0.20196, // kg CO2/kWh
  "Diesel": 0.26676, // kg CO2/liter
  "Gasoline": 0.24948, // kg CO2/liter
  "Coal": 0.4032, // kg CO2/kg
};

class FuelService {
  constructor(fuelcombutionRepo, productionRepo) {
    this.fuelcombutionRepo = fuelcombutionRepo;
    this.productionRepo = productionRepo;
  }

  async addFuelCombution(data, companyId) {
    const { machines } = data;
    if (!machines || !Array.isArray(machines) || machines.length === 0) {
      throw new Error("Machines array is required and must not be empty");
    }

    const machine = machines[0]; // Single machine per request
    const emissionFactor = EMISSION_FACTORS[machine.typeDeCarburant] || 0;
    const co2Emission = machine.quantite * emissionFactor;

    // Prepare the machine with calculated values
    const updatedMachine = {
      ...machine,
      co2Emission: co2Emission,
      emissionFactor: emissionFactor,
    };

    // Find the existing record for this company
    let existingRecord = await this.fuelcombutionRepo.findOne({ companyId });
    if (existingRecord) {
      // Append the new machine to the existing record
      existingRecord.machines.push(updatedMachine);
      // Recalculate totalEmissions
      existingRecord.totalEmissions = existingRecord.machines.reduce(
        (sum, machine) => sum + machine.co2Emission,
        0
      );
      return await this.fuelcombutionRepo.update(existingRecord._id, {
        machines: existingRecord.machines,
        totalEmissions: existingRecord.totalEmissions,
      });
    } else {
      // Create a new record if none exists for this company
      const newData = {
        machines: [updatedMachine],
        totalEmissions: co2Emission,
        companyId
      };
      return await this.fuelcombutionRepo.create(newData);
    }
  }

  async getFuelCombutions(companyId) {
    const records = await this.fuelcombutionRepo.findOne({ companyId });
    return records ? [records] : [];
  }

  async addProduction(data, companyId) {
    const { products } = data;
    if (!products || !Array.isArray(products) || products.length === 0) {
      throw new Error("Products array is required and must not be empty");
    }

    const product = products[0]; // Single product per request
    // For now, products don't have typeDeCarburant; if needed, add it
    const emissionFactor = 0; // Default to 0 since no fuel type is provided
    const co2Emission = product.quantite * emissionFactor;

    const updatedProduct = {
      ...product,
      co2Emission: co2Emission,
      emissionFactor: emissionFactor,
    };

    // Find the existing record for this company
    let existingRecord = await this.productionRepo.findOne({ companyId });
    if (existingRecord) {
      existingRecord.products.push(updatedProduct);
      existingRecord.totalEmissions = existingRecord.products.reduce(
        (sum, product) => sum + product.co2Emission,
        0
      );
      return await this.productionRepo.update(existingRecord._id, {
        products: existingRecord.products,
        totalEmissions: existingRecord.totalEmissions,
      });
    } else {
      const newData = {
        products: [updatedProduct],
        totalEmissions: co2Emission,
        companyId
      };
      return await this.productionRepo.create(newData);
    }
  }

  async getProductions(companyId) {
    const records = await this.productionRepo.findOne({ companyId });
    return records ? [records] : [];
  }
}

module.exports = new FuelService(fuelcombutionRepo, productionRepo);