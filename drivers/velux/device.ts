import { NikoDeviceKey } from '../connected-controller/NikoTypes';
import { NikoDevice } from '../../src/NikoDevice';

class NikoVeluxDevice extends NikoDevice<NikoDeviceKey.VELUX> {
  async onInit(): Promise<void> {
    await super.onInit();
    await this.migrateCapabilities();
    this.registerCapabilityListener('onoff', this.onOpenChange);
    this.registerCapabilityListener('windowcoverings_state', this.onStateChange as any);
    await this.updateStatus();
  }

  // The tile quick-action. Homey only renders it for onoff, so that is what drives the button.
  private onOpenChange = async (open: boolean) => {
    await this.setCapabilityValue('windowcoverings_state', open ? 'up' : 'down');
    return this.setNikoDeviceProps([{ Action: open ? 'Open' : 'Close' }]);
  };

  private onStateChange = async (state: 'up' | 'idle' | 'down') => {
    if (state === 'up') {
      await this.setCapabilityValue('onoff', true);
      return this.setNikoDeviceProps([{ Action: 'Open' }]);
    }
    if (state === 'down') {
      await this.setCapabilityValue('onoff', false);
      return this.setNikoDeviceProps([{ Action: 'Close' }]);
    }
    return this.setNikoDeviceProps([{ Action: 'Stop' }]);
  };

  async updateStatus(): Promise<void> {
    // A Velux action exposes no Position or Moving property, only a Feedback blink.
    // There is nothing to read back, so both controls keep the last command given.
    const allConnected = this.getProperty('AllConnected');
    if (allConnected === 'False') {
      return this.setUnavailable('Not all Velux components are connected.');
    }
    await this.setAvailable();

    // Without a starting value the tile button has nothing to render. A skylight sits
    // closed when nobody has touched it, so that is the assumption until the first command.
    if (this.getCapabilityValue('onoff') === null) {
      await this.setCapabilityValue('onoff', false);
      await this.setCapabilityValue('windowcoverings_state', 'down');
    }
  }

  // Devices paired against an earlier version carry the capabilities they were created with.
  private async migrateCapabilities(): Promise<void> {
    if (this.hasCapability('windowcoverings_closed')) {
      await this.removeCapability('windowcoverings_closed');
    }
    if (!this.hasCapability('onoff')) {
      await this.addCapability('onoff');
    }
  }
}

module.exports = NikoVeluxDevice;
