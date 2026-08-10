import { NikoDeviceKey } from '../connected-controller/NikoTypes';
import { NikoDevice } from '../../src/NikoDevice';

class NikoBasicActionDevice extends NikoDevice<NikoDeviceKey.BASIC_ACTION> {
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
    // 'Triggered' is a momentary pulse, not a lasting state, so it does not flip the switch.
    if (state !== 'Triggered') {
      await this.setCapabilityValue('onoff', state === 'On');
    }
  }
}

module.exports = NikoBasicActionDevice;
