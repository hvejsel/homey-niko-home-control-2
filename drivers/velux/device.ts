import { NikoDeviceKey } from '../connected-controller/NikoTypes';
import { NikoDevice } from '../../src/NikoDevice';

class NikoVeluxDevice extends NikoDevice<NikoDeviceKey.VELUX> {
  async onInit(): Promise<void> {
    await super.onInit();
    this.registerCapabilityListener('windowcoverings_state', this.onStateChange as any);
    await this.updateStatus();
  }

  private onStateChange = async (state: 'up' | 'idle' | 'down') => {
    if (state === 'up') {
      return this.setNikoDeviceProps([{ Action: 'Open' }]);
    }
    if (state === 'down') {
      return this.setNikoDeviceProps([{ Action: 'Close' }]);
    }
    return this.setNikoDeviceProps([{ Action: 'Stop' }]);
  };

  async updateStatus(): Promise<void> {
    // A Velux action exposes no Position or Moving property, only a Feedback blink.
    // There is nothing to read back, so the state control stays where the user left it.
    const allConnected = this.getProperty('AllConnected');
    if (allConnected === 'False') {
      return this.setUnavailable('Not all Velux components are connected.');
    }
    await this.setAvailable();
  }
}

module.exports = NikoVeluxDevice;
