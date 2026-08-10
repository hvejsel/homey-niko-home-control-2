import { NikoDeviceKey, NikoThermostatProgram } from '../connected-controller/NikoTypes';
import { NikoDevice } from '../../src/NikoDevice';

// How long a manual setpoint stays active before Niko falls back to the running program.
const OVERRULE_MINUTES = 120;

class NikoThermostatDevice extends NikoDevice<NikoDeviceKey.THERMOSTAT> {
  async onInit(): Promise<void> {
    await super.onInit();
    this.registerCapabilityListener('target_temperature', this.onTargetTemperature as any);
    this.registerCapabilityListener('niko_program', this.onProgram as any);
    await this.updateStatus();
  }

  // Niko has no writable setpoint. A manual temperature is an overrule with a time limit,
  // which the thermostat drops again when the timer runs out.
  private onTargetTemperature = async (value: number) => {
    return this.setNikoDeviceProps([
      { OverruleActive: 'True' },
      { OverruleSetpoint: value.toFixed(2) },
      { OverruleTime: String(OVERRULE_MINUTES) },
    ]);
  };

  private onProgram = async (program: NikoThermostatProgram) => {
    return this.setNikoDeviceProps([{ Program: program }]);
  };

  async updateStatus(): Promise<void> {
    const program = this.getProperty('Program');
    if (program === undefined) {
      return this.setUnavailable('Device is misconfigured, please re-create it.');
    }
    await this.setAvailable();

    const ambient = this.getProperty('AmbientTemperature');
    if (ambient !== undefined) {
      await this.setCapabilityValue('measure_temperature', Number(ambient));
    }

    // While an overrule is running it is the setpoint that is actually in effect.
    const overruleActive = this.getProperty('OverruleActive') === 'True';
    const overruleSetpoint = this.getProperty('OverruleSetpoint');
    const setpoint = this.getProperty('SetpointTemperature');
    const effective = overruleActive && overruleSetpoint ? overruleSetpoint : setpoint;
    if (effective !== undefined && effective !== '') {
      await this.setCapabilityValue('target_temperature', Number(effective));
    }

    await this.setCapabilityValue('niko_program', program);

    const demand = this.getProperty('Demand');
    if (demand !== undefined) {
      await this.setCapabilityValue('niko_demand', demand);
    }
  }
}

module.exports = NikoThermostatDevice;
