import { NikoDeviceKey } from '../connected-controller/NikoTypes';
import { NikoDevice } from '../../src/NikoDevice';

class NikoAlarmDevice extends NikoDevice<NikoDeviceKey.ALARM> {
  async onInit(): Promise<void> {
    await super.onInit();
    this.registerCapabilityListener('onoff', this.onValueChange);
    await this.updateStatus();
  }

  private onValueChange = async (value: boolean) => {
    this.setNikoDeviceProps([{ BasicState: value ? 'On' : 'Off' }]);
  };

  async updateStatus(): Promise<void> {
    const state = this.getProperty('BasicState');
    if (state === undefined) {
      return this.setUnavailable('Device is misconfigured, please re-create it.');
    }
    await this.setAvailable();
    await this.setCapabilityValue('alarm_generic', state === 'Triggered');
    if (state !== 'Triggered') {
      // 'Intermediate' means the alarm is arming, which counts as switched on.
      await this.setCapabilityValue('onoff', state !== 'Off');
    }
  }
}

module.exports = NikoAlarmDevice;
