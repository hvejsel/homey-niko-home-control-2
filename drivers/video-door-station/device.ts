import { NikoDeviceKey } from '../connected-controller/NikoTypes';
import { NikoDevice } from '../../src/NikoDevice';

class NikoVideoDoorStationDevice extends NikoDevice<NikoDeviceKey.VIDEO_DOOR_STATION> {
  async onInit(): Promise<void> {
    await super.onInit();
    await this.updateStatus();
  }

  async updateStatus(): Promise<void> {
    const status = this.getProperty('Status');
    if (status === 'Offline') {
      return this.setUnavailable('The door station is offline.');
    }
    await this.setAvailable();
    await this.setCapabilityValue('alarm_generic', this.getProperty('CallStatus01') === 'Ringing');
  }
}

module.exports = NikoVideoDoorStationDevice;
