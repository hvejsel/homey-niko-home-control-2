import { NikoDeviceKey } from '../connected-controller/NikoTypes';
import { NikoDevice } from '../../src/NikoDevice';

class NikoVeluxDevice extends NikoDevice<NikoDeviceKey.VELUX> {
  async onInit(): Promise<void> {
    await super.onInit();
    // Devices paired before the tile toggle existed do not get new capabilities on their own.
    if (!this.hasCapability('windowcoverings_closed')) {
      await this.addCapability('windowcoverings_closed');
    }
    this.registerCapabilityListener('windowcoverings_state', this.onStateChange as any);
    this.registerCapabilityListener('windowcoverings_closed', this.onClosedChange);
    await this.updateStatus();
  }

  private onStateChange = async (state: 'up' | 'idle' | 'down') => {
    if (state === 'up') {
      await this.setCapabilityValue('windowcoverings_closed', false);
      return this.setNikoDeviceProps([{ Action: 'Open' }]);
    }
    if (state === 'down') {
      await this.setCapabilityValue('windowcoverings_closed', true);
      return this.setNikoDeviceProps([{ Action: 'Close' }]);
    }
    return this.setNikoDeviceProps([{ Action: 'Stop' }]);
  };

  // The tile toggle. Niko sends no position back, so this reflects the last command given.
  private onClosedChange = async (closed: boolean) => {
    await this.setCapabilityValue('windowcoverings_state', closed ? 'down' : 'up');
    return this.setNikoDeviceProps([{ Action: closed ? 'Close' : 'Open' }]);
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
