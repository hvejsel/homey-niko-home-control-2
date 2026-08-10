import { NikoDeviceKey } from '../connected-controller/NikoTypes';
import { NikoDevice } from '../../src/NikoDevice';

class NikoAccessControlDevice extends NikoDevice<NikoDeviceKey.ACCESS_CONTROL> {
  async onInit(): Promise<void> {
    await super.onInit();
    this.registerCapabilityListener('locked', this.onLockedChange);
    await this.updateStatus();
  }

  private onLockedChange = async (locked: boolean) => {
    this.setNikoDeviceProps([{ Doorlock: locked ? 'Closed' : 'Open' }]);
  };

  async updateStatus(): Promise<void> {
    const doorlock = this.getProperty('Doorlock');
    if (doorlock === undefined) {
      return this.setUnavailable('Device is misconfigured, please re-create it.');
    }
    await this.setAvailable();
    await this.setCapabilityValue('locked', doorlock === 'Closed');
    // A pending call is someone standing at the door waiting to be let in.
    await this.setCapabilityValue('alarm_generic', this.getProperty('CallPending') === 'True');
  }
}

module.exports = NikoAccessControlDevice;
