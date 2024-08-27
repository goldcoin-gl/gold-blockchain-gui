const ServiceName = {
  WALLET: 'gold_wallet',
  FULL_NODE: 'gold_full_node',
  FARMER: 'gold_farmer',
  HARVESTER: 'gold_harvester',
  SIMULATOR: 'gold_full_node_simulator',
  DAEMON: 'daemon',
  PLOTTER: 'chia_plotter',
  TIMELORD: 'gold_timelord',
  INTRODUCER: 'gold_introducer',
  EVENTS: 'wallet_ui',
  DATALAYER: 'gold_data_layer',
  DATALAYER_SERVER: 'gold_data_layer_http',
} as const;

type ObjectValues<T> = T[keyof T];

export type ServiceNameValue = ObjectValues<typeof ServiceName>;

export default ServiceName;
