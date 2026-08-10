import { NikoDeviceKey } from '../connected-controller/NikoTypes';
import { NikoDevice } from '../../src/NikoDevice';

class NikoAudioDevice extends NikoDevice<NikoDeviceKey.AUDIO> {
  async onInit(): Promise<void> {
    await super.onInit();
    this.registerCapabilityListener('speaker_playing', this.onPlayingChange);
    this.registerCapabilityListener('volume_set', this.onVolumeChange);
    this.registerCapabilityListener('volume_mute', this.onMuteChange);
    this.registerCapabilityListener('speaker_next', this.onNext);
    this.registerCapabilityListener('speaker_prev', this.onPrevious);
    await this.updateStatus();
  }

  private onPlayingChange = async (playing: boolean) => {
    this.setNikoDeviceProps([{ Playback: playing ? 'Playing' : 'Paused' }]);
  };

  // Homey works in 0..1, Niko in 0..100.
  private onVolumeChange = async (volume: number) => {
    this.setNikoDeviceProps([{ Volume: String(Math.round(volume * 100)) }]);
  };

  private onMuteChange = async (muted: boolean) => {
    this.setNikoDeviceProps([{ Muted: muted ? 'True' : 'False' }]);
  };

  private onNext = async () => {
    this.setNikoDeviceProps([{ SkipNext: 'True' }]);
  };

  private onPrevious = async () => {
    this.setNikoDeviceProps([{ SkipPrevious: 'True' }]);
  };

  async updateStatus(): Promise<void> {
    const playback = this.getProperty('Playback');
    if (playback === undefined) {
      return this.setUnavailable('Device is misconfigured, please re-create it.');
    }
    await this.setAvailable();
    await this.setCapabilityValue('speaker_playing', playback === 'Playing');

    const volume = this.getProperty('Volume');
    if (volume !== undefined && volume !== '') {
      await this.setCapabilityValue('volume_set', Number(volume) / 100);
    }
    await this.setCapabilityValue('volume_mute', this.getProperty('Muted') === 'True');
    await this.setCapabilityValue('speaker_track', this.getProperty('Title') ?? null);
    await this.setCapabilityValue('speaker_artist', this.getProperty('Artist') ?? null);
  }
}

module.exports = NikoAudioDevice;
