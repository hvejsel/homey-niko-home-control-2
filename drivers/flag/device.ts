import { NikoDeviceKey } from '../connected-controller/NikoTypes';
import { NikoDevice } from '../../src/NikoDevice';

class NikoFlagDevice extends NikoDevice<NikoDeviceKey.FLAG> {
  async onInit(): Promise<void> {
    await super.onInit();
    this.registerCapabilityListener('onoff', this.onValueChange);
    await this.updateStatus();
  }

  private onValueChange = async (value: boolean) => {
    this.setNikoDeviceProps([{ Status: value ? 'True' : 'False' }]);
  };

  async updateStatus(): Promise<void> {
    const status = this.getProperty('Status');
    if (status === undefined) {
      return this.setUnavailable('Device is misconfigured, please re-create it.');
    }
    await this.setAvailable();
    await this.setCapabilityValue('onoff', status === 'True');
  }
}

module.exports = NikoFlagDevice;
