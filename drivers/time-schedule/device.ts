import { NikoDeviceKey } from '../connected-controller/NikoTypes';
import { NikoDevice } from '../../src/NikoDevice';

class NikoTimeScheduleDevice extends NikoDevice<NikoDeviceKey.TIME_SCHEDULE> {
  async onInit(): Promise<void> {
    await super.onInit();
    await this.updateStatus();
  }

  async updateStatus(): Promise<void> {
    // Niko exposes Active as read-only, so this device reports but cannot be switched.
    const active = this.getProperty('Active');
    if (active === undefined) {
      return this.setUnavailable('Device is misconfigured, please re-create it.');
    }
    await this.setAvailable();
    await this.setCapabilityValue('onoff', active === 'True');
  }
}

module.exports = NikoTimeScheduleDevice;
