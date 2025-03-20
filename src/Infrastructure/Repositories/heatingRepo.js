const HeatingSchema = require('../../Domain/Entities/heating');

class HeatingRepo {
  async getHeating() {
    const heatingData = await HeatingSchema.find().lean();
    return heatingData.length > 0 ? heatingData[0] : { heaters: [], totalEmissions: 0 };
  }

  async createHeating(heatingData) {
    const newHeating = new HeatingSchema(heatingData);
    await newHeating.save();
    return newHeating;
  }

  async updateHeating(id, updateData) {
    const updatedHeating = await HeatingSchema.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    if (!updatedHeating) {
      throw new Error('Heating record not found');
    }
    return updatedHeating;
  }

  async deleteHeater(recordId, heaterId) {
    const record = await HeatingSchema.findById(recordId);
    if (!record) {
      throw new Error('Heating record not found');
    }
    const heaterIndex = record.heaters.findIndex(heater => heater._id.toString() === heaterId);
    if (heaterIndex === -1) {
      throw new Error('Heater not found');
    }
    const [heater] = record.heaters.splice(heaterIndex, 1);
    record.totalEmissions -= heater.emissions;
    await record.save();
    return record;
  }
}

module.exports = HeatingRepo;