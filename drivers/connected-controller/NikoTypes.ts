export const NIKO_MODELS = [
  'light',
  'socket',
  'switched-fan',
  'switched-generic',
  'dimmer',
  'rolldownshutter',
  'sunblind',
  'gate',
  'venetianblind',
  'alloff',
  'generic',
  'flag',
  'thermoswitchx1',
  'thermoswitchx1feedback',
  'thermoswitchx2feedback',
  'thermoswitchx4feedback',
  'thermoswitchx6feedback',
  'thermoventilationcontrollerfeedback',
  'overallcomfort',
  'fan',
  'comfort',
  'velux',
  'thermostat',
  'condition',
  'simulation',
  'pir',
  'alarms',
  'timeschedule',
  'audiocontrol',
  'accesscontrol',
  'robinsip',
] as const;

export const NIKO_TYPES = [
  'relay',
  'dimmer',
  'motor',
  'action',
  'multisensor',
  'thermostat',
  'virtual',
  'energyhome',
  'videodoorstation',
] as const;

export type NikoType = (typeof NIKO_TYPES)[number];
export type NikoModel = (typeof NIKO_MODELS)[number];

export type NikoBoolean = 'True' | 'False';
export type NikoOnOff = 'On' | 'Off';
export type NikoTriggerable = NikoOnOff | 'Triggered';

export type BaseAction = {
  readonly types: NikoType;
  readonly models: NikoModel[];
};

export enum NikoDeviceKey {
  RELAY = 'RELAY',
  MOTOR = 'MOTOR',
  ALL_OFF = 'ALL_OFF',
  MOOD = 'MOOD',
  FAN = 'FAN',
  DIMMER = 'DIMMER',
  THERMO_SWITCH_X1 = 'THERMO_SWITCH_X1',
  THERMO_SWITCH_X2 = 'THERMO_SWITCH_X2',
  THERMO_SWITCH_X4 = 'THERMO_SWITCH_X4',
  THERMO_SWITCH_X6 = 'THERMO_SWITCH_X6',
  VELUX = 'VELUX',
  THERMOSTAT = 'THERMOSTAT',
  FLAG = 'FLAG',
  BASIC_ACTION = 'BASIC_ACTION',
  ALARM = 'ALARM',
  TIME_SCHEDULE = 'TIME_SCHEDULE',
  AUDIO = 'AUDIO',
  ACCESS_CONTROL = 'ACCESS_CONTROL',
  ENERGY_HOME = 'ENERGY_HOME',
  VIDEO_DOOR_STATION = 'VIDEO_DOOR_STATION',
}

export const NIKO_ACTIONS = {
  [NikoDeviceKey.RELAY]: {
    types: 'action',
    models: ['light', 'socket', 'switched-fan', 'switched-generic'],
  },
  [NikoDeviceKey.MOTOR]: {
    types: 'action',
    models: ['rolldownshutter', 'sunblind', 'gate', 'venetianblind'],
  },
  [NikoDeviceKey.ALL_OFF]: {
    types: 'action',
    models: ['alloff'],
  },
  [NikoDeviceKey.MOOD]: {
    types: 'action',
    models: ['comfort'],
  },
  [NikoDeviceKey.FAN]: {
    types: 'action',
    models: ['fan'],
  },
  [NikoDeviceKey.DIMMER]: {
    types: 'action',
    models: ['dimmer'],
  },
  [NikoDeviceKey.THERMO_SWITCH_X1]: {
    types: 'multisensor',
    models: ['thermoswitchx1', 'thermoswitchx1feedback'],
  },
  [NikoDeviceKey.THERMO_SWITCH_X2]: {
    types: 'multisensor',
    models: ['thermoswitchx2feedback'],
  },
  [NikoDeviceKey.THERMO_SWITCH_X4]: {
    types: 'multisensor',
    models: ['thermoswitchx4feedback', 'thermoventilationcontrollerfeedback'],
  },
  [NikoDeviceKey.THERMO_SWITCH_X6]: {
    types: 'multisensor',
    models: ['thermoswitchx6feedback'],
  },
  [NikoDeviceKey.VELUX]: {
    types: 'action',
    models: ['velux'],
  },
  [NikoDeviceKey.THERMOSTAT]: {
    types: 'thermostat',
    models: ['thermostat'],
  },
  [NikoDeviceKey.FLAG]: {
    types: 'virtual',
    models: ['flag'],
  },
  [NikoDeviceKey.BASIC_ACTION]: {
    types: 'action',
    models: ['condition', 'generic', 'overallcomfort', 'simulation', 'pir'],
  },
  [NikoDeviceKey.ALARM]: {
    types: 'action',
    models: ['alarms'],
  },
  [NikoDeviceKey.TIME_SCHEDULE]: {
    types: 'action',
    models: ['timeschedule'],
  },
  [NikoDeviceKey.AUDIO]: {
    types: 'action',
    models: ['audiocontrol'],
  },
  [NikoDeviceKey.ACCESS_CONTROL]: {
    types: 'action',
    models: ['accesscontrol'],
  },
  [NikoDeviceKey.ENERGY_HOME]: {
    types: 'energyhome',
    models: ['generic'],
  },
  [NikoDeviceKey.VIDEO_DOOR_STATION]: {
    types: 'videodoorstation',
    models: ['robinsip'],
  },
} as const satisfies Record<NikoDeviceKey, BaseAction>;

export interface NikoPayloadRegistry extends Record<NikoDeviceKey, { Properties: any }> {
  [NikoDeviceKey.RELAY]: {
    Properties: [{ Status: NikoOnOff }];
  };
  [NikoDeviceKey.MOTOR]: {
    Properties: [
      { Action: 'Open' | 'Close' | 'Stop' },
      { Position: string },
      { Aligned: NikoBoolean },
      { Moving: NikoBoolean },
    ];
  };
  [NikoDeviceKey.ALL_OFF]: {
    Properties: [{ BasicState: NikoTriggerable }, { AllOffActive: NikoBoolean }];
  };
  [NikoDeviceKey.MOOD]: {
    Properties: [{ BasicState: NikoTriggerable }, { MoodActive: NikoBoolean }];
  };
  [NikoDeviceKey.FAN]: {
    Properties: [{ FanSpeed: 'Low' | 'Medium' | 'High' | 'Boost' }];
  };
  [NikoDeviceKey.DIMMER]: {
    Properties: [{ Status: NikoOnOff }, { Brightness: string }];
  };
  [NikoDeviceKey.THERMO_SWITCH_X1]: {
    Properties: [{ AmbientTemperature: string }, { Humidity: string }];
  };
  [NikoDeviceKey.VELUX]: {
    Properties: [
      { Action: 'Open' | 'Close' | 'Stop' },
      { Feedback: 'BlinkOn' | 'BlinkOff' },
      { AllConnected: NikoBoolean },
    ];
  };
  [NikoDeviceKey.THERMOSTAT]: {
    Properties: [
      { Program: NikoThermostatProgram },
      { OverruleActive: NikoBoolean },
      { OverruleSetpoint: string },
      { OverruleTime: string },
      { EcoSave: NikoBoolean },
      { SetpointTemperature: string },
      { AmbientTemperature: string },
      { Demand: 'Heating' | 'Cooling' | 'None' },
    ];
  };
  [NikoDeviceKey.FLAG]: {
    Properties: [{ Status: NikoBoolean }];
  };
  [NikoDeviceKey.BASIC_ACTION]: {
    Properties: [
      { BasicState: NikoTriggerable },
      { StartActive: NikoBoolean },
      { AllStarted: NikoBoolean },
      { AllConnected: NikoBoolean },
    ];
  };
  [NikoDeviceKey.ALARM]: {
    Properties: [
      { BasicState: NikoOnOff | 'Intermediate' | 'Triggered' },
      { AllConnected: NikoBoolean },
    ];
  };
  [NikoDeviceKey.TIME_SCHEDULE]: {
    Properties: [{ Active: NikoBoolean }, { AllConnected: NikoBoolean }];
  };
  [NikoDeviceKey.AUDIO]: {
    Properties: [
      { Status: NikoOnOff },
      { Playback: 'Paused' | 'Playing' | 'Buffering' },
      { Volume: string },
      { Muted: NikoBoolean },
      { Shuffle: NikoBoolean },
      { Repeat: NikoBoolean },
      { SkipNext: NikoBoolean },
      { SkipPrevious: NikoBoolean },
      { Title: string },
      { Artist: string },
      { ArtworkUrl: string },
    ];
  };
  [NikoDeviceKey.ACCESS_CONTROL]: {
    Properties: [
      { Doorlock: 'Open' | 'Closed' },
      { CallPending: NikoBoolean },
      { CallAnswered: NikoBoolean },
    ];
  };
  [NikoDeviceKey.ENERGY_HOME]: {
    Properties: [
      { ElectricalPowerFromGrid: string },
      { ElectricalPowerToGrid: string },
      { ElectricalEnergyFromGrid: string },
      { ElectricalEnergyToGrid: string },
      { ElectricalEnergyProduction: string },
      { ElectricalEnergyConsumption: string },
      { ElectricalEnergySelfConsumption: string },
      { GasVolume: string },
      { WaterVolume: string },
      { ReportInstantUsage: NikoBoolean },
    ];
  };
  [NikoDeviceKey.VIDEO_DOOR_STATION]: {
    Properties: [
      { CallStatus01: 'Idle' | 'Ringing' | 'Active' },
      { Status: 'Online' | 'Offline' },
    ];
  };
}

export const NIKO_THERMOSTAT_PROGRAMS = [
  'Day',
  'Night',
  'Eco',
  'Off',
  'Cool',
  'Prog1',
  'Prog2',
  'Prog3',
] as const;

export type NikoThermostatProgram = (typeof NIKO_THERMOSTAT_PROGRAMS)[number];

export type AllNikoActions = (typeof NIKO_ACTIONS)[keyof typeof NIKO_ACTIONS];
