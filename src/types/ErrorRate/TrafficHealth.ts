import { Direction } from '../MetricsOptions';
import { ThresholdStatus } from '../Health';
import { ProtocolWithTraffic } from '../Graph';
import { aggregate, checkExpr, getHealthRateAnnotation, getRateHealthConfig, transformEdgeResponses } from './utils';
import { calculateStatusGraph } from './GraphEdgeStatus';
import { TrafficItem } from 'components/TrafficList/TrafficDetails';

/*
 Calculate Health for DetailsTraffic
*/
export const getTrafficHealth = (item: TrafficItem, direction: Direction): ThresholdStatus => {
  // Get the configuration for the node
  const config = getRateHealthConfig(
    item.node.namespace,
    item.node.name,
    item.node.type,
    'kialiAnnotation' in item.node ? getHealthRateAnnotation(item.node.kialiAnnotation) : undefined
  );
  // Get tolerances of the configuration for the direction provided
  const tolerances = config!.filter(tol => checkExpr(tol.direction, direction));
  // Get the responses like a item with traffic
  const traffic = item.traffic as ProtocolWithTraffic;
  // Aggregate the responses and transform them for calculate the status
  const agg = aggregate(transformEdgeResponses(traffic.responses, traffic.protocol), tolerances, true);
  return calculateStatusGraph(agg, traffic.responses).status;
};
