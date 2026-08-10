import { NikoDeviceKey } from '../connected-controller/NikoTypes';
import { NikoDevice } from '../../src/NikoDevice';

class NikoEnergyHomeDevice extends NikoDevice<NikoDeviceKey.ENERGY_HOME> {
  async onInit(): Promise<void> {
    await super.onInit();
    // Niko only publishes live power once it is asked to report instant usage.
    this.setNikoDeviceProps([{ ReportInstantUsage: 'True' }]);
    await this.updateStatus();
  }

  async updateStatus(): Promise<void> {
    const fromGrid = this.getProperty('ElectricalPowerFromGrid');
    if (fromGrid === undefined) {
      return this.setUnavailable('Device is misconfigured, please re-create it.');
    }
    await this.setAvailable();

    // Import counts positive, export negative, so one number shows the net flow.
    const toGrid = this.getProperty('ElectricalPowerToGrid') ?? '0';
    await this.setCapabilityValue('measure_power', Number(fromGrid) - Number(toGrid));

    await this.setMeter('meter_power', this.getProperty('ElectricalEnergyConsumption'));
    await this.setMeter('meter_power.produced', this.getProperty('ElectricalEnergyProduction'));
    await this.setMeter('meter_power.returned', this.getProperty('ElectricalEnergyToGrid'));
    await this.setMeter('meter_gas', this.getProperty('GasVolume'));
    await this.setMeter('meter_water', this.getProperty('WaterVolume'));
  }

  private async setMeter(capability: string, value: string | undefined): Promise<void> {
    if (value === undefined || value === '') {
      return;
    }
    await this.setCapabilityValue(capability, Number(value));
  }
}

module.exports = NikoEnergyHomeDevice;
