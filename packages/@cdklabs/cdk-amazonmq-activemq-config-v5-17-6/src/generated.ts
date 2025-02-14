/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { XmlNode } from "./xml-node";

export enum PreallocationStrategy {
  SPARSE_FILE = "sparse_file",
  OS_KERNEL_COPY = "os_kernel_copy",
  ZEROS = "zeros",
}

export enum JournalDiskSyncStrategy {
  ALWAYS = "always",
  PERIODIC = "periodic",
  NEVER = "never",
}

export enum Protocol {
  OPENWIRE = "openwire",
}

export class VmQueueCursor
  extends XmlNode
  implements IPolicyEntryPendingQueuePolicy
{
  constructor() {
    super({
      tagName: "vmQueueCursor",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export class VmDurableCursor
  extends XmlNode
  implements IPolicyEntryPendingDurableSubscriberPolicy
{
  constructor() {
    super({
      tagName: "vmDurableCursor",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export class VmCursor
  extends XmlNode
  implements IPolicyEntryPendingSubscriberPolicy
{
  constructor() {
    super({
      tagName: "vmCursor",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export class StrictOrderDispatchPolicy
  extends XmlNode
  implements IPolicyEntryDispatchPolicy
{
  constructor() {
    super({
      tagName: "strictOrderDispatchPolicy",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export class StoreCursor
  extends XmlNode
  implements IPolicyEntryPendingQueuePolicy
{
  constructor() {
    super({
      tagName: "storeCursor",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export class StatisticsBrokerPlugin extends XmlNode implements IBrokerPlugin {
  constructor() {
    super({
      tagName: "statisticsBrokerPlugin",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export class SimpleMessageGroupMapFactory
  extends XmlNode
  implements IPolicyEntryMessageGroupMapFactory
{
  constructor() {
    super({
      tagName: "simpleMessageGroupMapFactory",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export class SimpleDispatchPolicy
  extends XmlNode
  implements IPolicyEntryDispatchPolicy
{
  constructor() {
    super({
      tagName: "simpleDispatchPolicy",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export class RoundRobinDispatchPolicy
  extends XmlNode
  implements IPolicyEntryDispatchPolicy
{
  constructor() {
    super({
      tagName: "roundRobinDispatchPolicy",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export class PriorityNetworkDispatchPolicy
  extends XmlNode
  implements IPolicyEntryDispatchPolicy
{
  constructor() {
    super({
      tagName: "priorityNetworkDispatchPolicy",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export class PriorityDispatchPolicy
  extends XmlNode
  implements IPolicyEntryDispatchPolicy
{
  constructor() {
    super({
      tagName: "priorityDispatchPolicy",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export class NoSubscriptionRecoveryPolicy
  extends XmlNode
  implements
    IPolicyEntrySubscriptionRecoveryPolicy,
    IRetainedMessageSubscriptionRecoveryPolicyWrapped
{
  constructor() {
    super({
      tagName: "noSubscriptionRecoveryPolicy",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export class LastImageSubscriptionRecoveryPolicy
  extends XmlNode
  implements
    IPolicyEntrySubscriptionRecoveryPolicy,
    IRetainedMessageSubscriptionRecoveryPolicyWrapped
{
  constructor() {
    super({
      tagName: "lastImageSubscriptionRecoveryPolicy",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export class FileQueueCursor
  extends XmlNode
  implements IPolicyEntryPendingQueuePolicy
{
  constructor() {
    super({
      tagName: "fileQueueCursor",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export class FileDurableSubscriberCursor
  extends XmlNode
  implements IPolicyEntryPendingDurableSubscriberPolicy
{
  constructor() {
    super({
      tagName: "fileDurableSubscriberCursor",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export class FileCursor
  extends XmlNode
  implements IPolicyEntryPendingSubscriberPolicy
{
  constructor() {
    super({
      tagName: "fileCursor",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface VirtualTopicAttributes {
  readonly concurrentSend?: boolean;
  readonly dropOnResourceLimit?: boolean;
  readonly local?: boolean;
  readonly name?: string;
  readonly postfix?: string;
  readonly prefix?: string;
  readonly selectorAware?: boolean;
  readonly setOriginalDestination?: boolean;
  readonly transactedSend?: boolean;
}

export class VirtualTopic
  extends XmlNode
  implements IVirtualDestinationInterceptorVirtualDestination
{
  constructor(public readonly attributes?: VirtualTopicAttributes) {
    super({
      tagName: "virtualTopic",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface UniquePropertyMessageEvictionStrategyAttributes {
  readonly evictExpiredMessagesHighWatermark?: number;
  readonly propertyName?: string;
}

export class UniquePropertyMessageEvictionStrategy
  extends XmlNode
  implements IPolicyEntryMessageEvictionStrategy
{
  constructor(
    public readonly attributes?: UniquePropertyMessageEvictionStrategyAttributes,
  ) {
    super({
      tagName: "uniquePropertyMessageEvictionStrategy",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface TransportConnectorAttributes {
  readonly name?: Protocol;
  readonly updateClusterClients?: boolean;
  readonly rebalanceClusterClients?: boolean;
  readonly updateClusterClientsOnRemove?: boolean;
}

export class TransportConnector extends XmlNode {
  constructor(public readonly attributes?: TransportConnectorAttributes) {
    super({
      tagName: "transportConnector",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface TopicAttributes {
  readonly dlq?: boolean;
  readonly physicalName?: string;
}

export class Topic
  extends XmlNode
  implements
    IBrokerDestination,
    ICompositeQueueForwardTo,
    ICompositeTopicForwardTo,
    INetworkConnectorDurableDestination,
    INetworkConnectorDynamicallyIncludedDestination,
    INetworkConnectorExcludedDestination,
    INetworkConnectorStaticallyIncludedDestination,
    IPolicyEntryDestination,
    ISharedDeadLetterStrategyDeadLetterQueue
{
  constructor(public readonly attributes?: TopicAttributes) {
    super({
      tagName: "topic",
      namespace: "http://activemq.apache.org/schema/core",
      attrsNamesOverrides: {
        dlq: "DLQ",
      },
    });
  }
}

export interface TimedSubscriptionRecoveryPolicyAttributes {
  readonly recoverDuration?: number;
}

export class TimedSubscriptionRecoveryPolicy
  extends XmlNode
  implements
    IPolicyEntrySubscriptionRecoveryPolicy,
    IRetainedMessageSubscriptionRecoveryPolicyWrapped
{
  constructor(
    public readonly attributes?: TimedSubscriptionRecoveryPolicyAttributes,
  ) {
    super({
      tagName: "timedSubscriptionRecoveryPolicy",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface TimeStampingBrokerPluginAttributes {
  readonly futureOnly?: boolean;
  readonly processNetworkMessages?: boolean;
  readonly ttlCeiling?: number;
  readonly zeroExpirationOverride?: number;
}

export class TimeStampingBrokerPlugin extends XmlNode implements IBrokerPlugin {
  constructor(public readonly attributes?: TimeStampingBrokerPluginAttributes) {
    super({
      tagName: "timeStampingBrokerPlugin",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface TempTopicAttributes {
  readonly dlq?: boolean;
  readonly physicalName?: string;
}

export class TempTopic
  extends XmlNode
  implements
    IBrokerDestination,
    ICompositeQueueForwardTo,
    ICompositeTopicForwardTo,
    INetworkConnectorDurableDestination,
    INetworkConnectorDynamicallyIncludedDestination,
    INetworkConnectorExcludedDestination,
    INetworkConnectorStaticallyIncludedDestination,
    IPolicyEntryDestination,
    ISharedDeadLetterStrategyDeadLetterQueue
{
  constructor(public readonly attributes?: TempTopicAttributes) {
    super({
      tagName: "tempTopic",
      namespace: "http://activemq.apache.org/schema/core",
      attrsNamesOverrides: {
        dlq: "DLQ",
      },
    });
  }
}

export interface TempQueueAttributes {
  readonly dlq?: boolean;
  readonly physicalName?: string;
}

export class TempQueue
  extends XmlNode
  implements
    IBrokerDestination,
    ICompositeQueueForwardTo,
    ICompositeTopicForwardTo,
    INetworkConnectorDurableDestination,
    INetworkConnectorDynamicallyIncludedDestination,
    INetworkConnectorExcludedDestination,
    INetworkConnectorStaticallyIncludedDestination,
    IPolicyEntryDestination,
    ISharedDeadLetterStrategyDeadLetterQueue
{
  constructor(public readonly attributes?: TempQueueAttributes) {
    super({
      tagName: "tempQueue",
      namespace: "http://activemq.apache.org/schema/core",
      attrsNamesOverrides: {
        dlq: "DLQ",
      },
    });
  }
}

export interface TempDestinationAuthorizationEntryAttributes {
  readonly admin?: string;
  readonly queue?: string;
  readonly read?: string;
  readonly tempQueue?: boolean;
  readonly tempTopic?: boolean;
  readonly topic?: string;
  readonly write?: string;
}

export class TempDestinationAuthorizationEntry
  extends XmlNode
  implements IAuthorizationMapAuthorizationEntry, IAuthorizationMapDefaultEntry
{
  constructor(
    public readonly attributes?: TempDestinationAuthorizationEntryAttributes,
  ) {
    super({
      tagName: "tempDestinationAuthorizationEntry",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface StoreDurableSubscriberCursorAttributes {
  readonly immediatePriorityDispatch?: boolean;
  readonly useCache?: boolean;
}

export class StoreDurableSubscriberCursor
  extends XmlNode
  implements IPolicyEntryPendingDurableSubscriberPolicy
{
  constructor(
    public readonly attributes?: StoreDurableSubscriberCursorAttributes,
  ) {
    super({
      tagName: "storeDurableSubscriberCursor",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface RedeliveryPolicyAttributes {
  readonly backOffMultiplier?: number;
  readonly collisionAvoidancePercent?: number;
  readonly initialRedeliveryDelay?: number;
  readonly maximumRedeliveries?: number;
  readonly maximumRedeliveryDelay?: number;
  readonly preDispatchCheck?: boolean;
  readonly queue?: string;
  readonly redeliveryDelay?: number;
  readonly tempQueue?: boolean;
  readonly tempTopic?: boolean;
  readonly topic?: string;
  readonly useCollisionAvoidance?: boolean;
  readonly useExponentialBackOff?: boolean;
}

export class RedeliveryPolicy extends XmlNode {
  constructor(public readonly attributes?: RedeliveryPolicyAttributes) {
    super({
      tagName: "redeliveryPolicy",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface QueueAttributes {
  readonly dlq?: boolean;
  readonly physicalName?: string;
}

export class Queue
  extends XmlNode
  implements
    IBrokerDestination,
    ICompositeQueueForwardTo,
    ICompositeTopicForwardTo,
    INetworkConnectorDurableDestination,
    INetworkConnectorDynamicallyIncludedDestination,
    INetworkConnectorExcludedDestination,
    INetworkConnectorStaticallyIncludedDestination,
    IPolicyEntryDestination,
    ISharedDeadLetterStrategyDeadLetterQueue
{
  constructor(public readonly attributes?: QueueAttributes) {
    super({
      tagName: "queue",
      namespace: "http://activemq.apache.org/schema/core",
      attrsNamesOverrides: {
        dlq: "DLQ",
      },
    });
  }
}

export interface QueryBasedSubscriptionRecoveryPolicyAttributes {
  readonly query?: string;
}

export class QueryBasedSubscriptionRecoveryPolicy
  extends XmlNode
  implements
    IPolicyEntrySubscriptionRecoveryPolicy,
    IRetainedMessageSubscriptionRecoveryPolicyWrapped
{
  constructor(
    public readonly attributes?: QueryBasedSubscriptionRecoveryPolicyAttributes,
  ) {
    super({
      tagName: "queryBasedSubscriptionRecoveryPolicy",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface PrefetchRatePendingMessageLimitStrategyAttributes {
  readonly multiplier?: number;
}

export class PrefetchRatePendingMessageLimitStrategy
  extends XmlNode
  implements IPolicyEntryPendingMessageLimitStrategy
{
  constructor(
    public readonly attributes?: PrefetchRatePendingMessageLimitStrategyAttributes,
  ) {
    super({
      tagName: "prefetchRatePendingMessageLimitStrategy",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface OldestMessageWithLowestPriorityEvictionStrategyAttributes {
  readonly evictExpiredMessagesHighWatermark?: number;
}

export class OldestMessageWithLowestPriorityEvictionStrategy
  extends XmlNode
  implements IPolicyEntryMessageEvictionStrategy
{
  constructor(
    public readonly attributes?: OldestMessageWithLowestPriorityEvictionStrategyAttributes,
  ) {
    super({
      tagName: "oldestMessageWithLowestPriorityEvictionStrategy",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface OldestMessageEvictionStrategyAttributes {
  readonly evictExpiredMessagesHighWatermark?: number;
}

export class OldestMessageEvictionStrategy
  extends XmlNode
  implements IPolicyEntryMessageEvictionStrategy
{
  constructor(
    public readonly attributes?: OldestMessageEvictionStrategyAttributes,
  ) {
    super({
      tagName: "oldestMessageEvictionStrategy",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface MirroredQueueAttributes {
  readonly copyMessage?: boolean;
  readonly postfix?: string;
  readonly prefix?: string;
}

export class MirroredQueue
  extends XmlNode
  implements IBrokerDestinationInterceptor
{
  constructor(public readonly attributes?: MirroredQueueAttributes) {
    super({
      tagName: "mirroredQueue",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface MessageGroupHashBucketFactoryAttributes {
  readonly bucketCount?: number;
  readonly cacheSize?: number;
}

export class MessageGroupHashBucketFactory
  extends XmlNode
  implements IPolicyEntryMessageGroupMapFactory
{
  constructor(
    public readonly attributes?: MessageGroupHashBucketFactoryAttributes,
  ) {
    super({
      tagName: "messageGroupHashBucketFactory",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface MemoryUsageAttributes {
  readonly percentOfJvmHeap?: number;
}

export class MemoryUsage extends XmlNode {
  constructor(public readonly attributes?: MemoryUsageAttributes) {
    super({
      tagName: "memoryUsage",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface KahaDBAttributes {
  readonly concurrentStoreAndDispatchQueues?: boolean;
  readonly cleanupOnStop?: boolean;
  readonly checkpointInterval?: number;
  readonly indexWriteBatchSize?: number;
  readonly journalDiskSyncInterval?: number;
  readonly journalDiskSyncStrategy?: JournalDiskSyncStrategy;
  readonly preallocationStrategy?: PreallocationStrategy;
}

export class KahaDB extends XmlNode {
  constructor(public readonly attributes?: KahaDBAttributes) {
    super({
      tagName: "kahaDB",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface IndividualDeadLetterStrategyAttributes {
  readonly destinationPerDurableSubscriber?: boolean;
  readonly enableAudit?: boolean;
  readonly expiration?: number;
  readonly maxAuditDepth?: number;
  readonly maxProducersToAudit?: number;
  readonly processExpired?: boolean;
  readonly processNonPersistent?: boolean;
  readonly queuePrefix?: string;
  readonly queueSuffix?: string;
  readonly topicPrefix?: string;
  readonly topicSuffix?: string;
  readonly useQueueForQueueMessages?: boolean;
  readonly useQueueForTopicMessages?: boolean;
}

export class IndividualDeadLetterStrategy
  extends XmlNode
  implements IPolicyEntryDeadLetterStrategy
{
  constructor(
    public readonly attributes?: IndividualDeadLetterStrategyAttributes,
  ) {
    super({
      tagName: "individualDeadLetterStrategy",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface ForcePersistencyModeBrokerPluginAttributes {
  readonly persistenceFlag?: boolean;
}

export class ForcePersistencyModeBrokerPlugin
  extends XmlNode
  implements IBrokerPlugin
{
  constructor(
    public readonly attributes?: ForcePersistencyModeBrokerPluginAttributes,
  ) {
    super({
      tagName: "forcePersistencyModeBrokerPlugin",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface FixedSizedSubscriptionRecoveryPolicyAttributes {
  readonly maximumSize?: number;
  readonly useSharedBuffer?: boolean;
}

export class FixedSizedSubscriptionRecoveryPolicy
  extends XmlNode
  implements
    IPolicyEntrySubscriptionRecoveryPolicy,
    IRetainedMessageSubscriptionRecoveryPolicyWrapped
{
  constructor(
    public readonly attributes?: FixedSizedSubscriptionRecoveryPolicyAttributes,
  ) {
    super({
      tagName: "fixedSizedSubscriptionRecoveryPolicy",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface FixedCountSubscriptionRecoveryPolicyAttributes {
  readonly maximumSize?: number;
}

export class FixedCountSubscriptionRecoveryPolicy
  extends XmlNode
  implements
    IPolicyEntrySubscriptionRecoveryPolicy,
    IRetainedMessageSubscriptionRecoveryPolicyWrapped
{
  constructor(
    public readonly attributes?: FixedCountSubscriptionRecoveryPolicyAttributes,
  ) {
    super({
      tagName: "fixedCountSubscriptionRecoveryPolicy",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface FilteredDestinationAttributes {
  readonly queue?: string;
  readonly selector?: string;
  readonly topic?: string;
}

export class FilteredDestination
  extends XmlNode
  implements
    ICompositeQueueForwardTo,
    ICompositeTopicForwardTo,
    INetworkConnectorDurableDestination,
    INetworkConnectorDynamicallyIncludedDestination,
    INetworkConnectorExcludedDestination,
    INetworkConnectorStaticallyIncludedDestination
{
  constructor(public readonly attributes?: FilteredDestinationAttributes) {
    super({
      tagName: "filteredDestination",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface DiscardingDLQBrokerPluginAttributes {
  readonly dropAll?: boolean;
  readonly dropOnly?: string;
  readonly dropTemporaryQueues?: boolean;
  readonly dropTemporaryTopics?: boolean;
  readonly reportInterval?: number;
}

export class DiscardingDLQBrokerPlugin
  extends XmlNode
  implements IBrokerPlugin
{
  constructor(
    public readonly attributes?: DiscardingDLQBrokerPluginAttributes,
  ) {
    super({
      tagName: "discardingDLQBrokerPlugin",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface DiscardingAttributes {
  readonly deadLetterQueue?: string;
  readonly enableAudit?: boolean;
  readonly expiration?: number;
  readonly maxAuditDepth?: number;
  readonly maxProducersToAudit?: number;
  readonly processExpired?: boolean;
  readonly processNonPersistent?: boolean;
}

export class Discarding
  extends XmlNode
  implements IPolicyEntryDeadLetterStrategy
{
  constructor(public readonly attributes?: DiscardingAttributes) {
    super({
      tagName: "discarding",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface ConstantPendingMessageLimitStrategyAttributes {
  readonly limit?: number;
}

export class ConstantPendingMessageLimitStrategy
  extends XmlNode
  implements IPolicyEntryPendingMessageLimitStrategy
{
  constructor(
    public readonly attributes?: ConstantPendingMessageLimitStrategyAttributes,
  ) {
    super({
      tagName: "constantPendingMessageLimitStrategy",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface ConditionalNetworkBridgeFilterFactoryAttributes {
  readonly rateDuration?: number;
  readonly rateLimit?: number;
  readonly replayDelay?: number;
  readonly replayWhenNoConsumers?: boolean;
  readonly selectorAware?: boolean;
}

export class ConditionalNetworkBridgeFilterFactory extends XmlNode {
  constructor(
    public readonly attributes?: ConditionalNetworkBridgeFilterFactoryAttributes,
  ) {
    super({
      tagName: "conditionalNetworkBridgeFilterFactory",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface ClientIdFilterDispatchPolicyAttributes {
  readonly ptpClientId?: string;
  readonly ptpSuffix?: string;
}

export class ClientIdFilterDispatchPolicy
  extends XmlNode
  implements IPolicyEntryDispatchPolicy
{
  constructor(
    public readonly attributes?: ClientIdFilterDispatchPolicyAttributes,
  ) {
    super({
      tagName: "clientIdFilterDispatchPolicy",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface CachedMessageGroupMapFactoryAttributes {
  readonly cacheSize?: number;
}

export class CachedMessageGroupMapFactory
  extends XmlNode
  implements IPolicyEntryMessageGroupMapFactory
{
  constructor(
    public readonly attributes?: CachedMessageGroupMapFactoryAttributes,
  ) {
    super({
      tagName: "cachedMessageGroupMapFactory",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface AuthorizationEntryAttributes {
  readonly admin?: string;
  readonly queue?: string;
  readonly read?: string;
  readonly tempQueue?: boolean;
  readonly tempTopic?: boolean;
  readonly topic?: string;
  readonly write?: string;
}

export class AuthorizationEntry
  extends XmlNode
  implements IAuthorizationMapAuthorizationEntry, IAuthorizationMapDefaultEntry
{
  constructor(public readonly attributes?: AuthorizationEntryAttributes) {
    super({
      tagName: "authorizationEntry",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface AbortSlowConsumerStrategyAttributes {
  readonly abortConnection?: boolean;
  readonly checkPeriod?: number;
  readonly ignoreNetworkConsumers?: boolean;
  readonly maxSlowCount?: number;
  readonly maxSlowDuration?: number;
  readonly name?: string;
}

export class AbortSlowConsumerStrategy
  extends XmlNode
  implements IPolicyEntrySlowConsumerStrategy
{
  constructor(
    public readonly attributes?: AbortSlowConsumerStrategyAttributes,
  ) {
    super({
      tagName: "abortSlowConsumerStrategy",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface AbortSlowAckConsumerStrategyAttributes {
  readonly abortConnection?: boolean;
  readonly checkPeriod?: number;
  readonly ignoreIdleConsumers?: boolean;
  readonly ignoreNetworkConsumers?: boolean;
  readonly maxSlowCount?: number;
  readonly maxSlowDuration?: number;
  readonly maxTimeSinceLastAck?: number;
  readonly name?: string;
}

export class AbortSlowAckConsumerStrategy
  extends XmlNode
  implements IPolicyEntrySlowConsumerStrategy
{
  constructor(
    public readonly attributes?: AbortSlowAckConsumerStrategyAttributes,
  ) {
    super({
      tagName: "abortSlowAckConsumerStrategy",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface IAuthorizationMapAuthorizationEntry {}

export interface IAuthorizationMapDefaultEntry {}

export interface AuthorizationMapElements {
  readonly authorizationEntries?: IAuthorizationMapAuthorizationEntry[];
  readonly defaultEntry?: IAuthorizationMapDefaultEntry;
  readonly tempDestinationAuthorizationEntry?: TempDestinationAuthorizationEntry;
}

export class AuthorizationMap
  extends XmlNode
  implements IAuthorizationPluginMap
{
  constructor(public readonly elements?: AuthorizationMapElements) {
    super({
      tagName: "authorizationMap",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface IAuthorizationPluginMap {}

export interface AuthorizationPluginElements {
  readonly authorizationMap?: IAuthorizationPluginMap;
}

export class AuthorizationPlugin extends XmlNode implements IBrokerPlugin {
  constructor(public readonly elements?: AuthorizationPluginElements) {
    super({
      tagName: "authorizationPlugin",
      namespace: "http://activemq.apache.org/schema/core",
      elemsNamesOverrides: {
        authorizationMap: "map",
      },
    });
  }
}

export interface BrokerAttributes {
  readonly advisorySupport?: string;
  readonly allowTempAutoCreationOnSend?: boolean;
  readonly anonymousProducerAdvisorySupport?: boolean;
  readonly cacheTempDestinations?: boolean;
  readonly consumerSystemUsagePortion?: number;
  readonly dedicatedTaskRunner?: boolean;
  readonly deleteAllMessagesOnStartup?: string;
  readonly enableMessageExpirationOnActiveDurableSubs?: boolean;
  readonly keepDurableSubsActive?: boolean;
  readonly maxPurgedDestinationsPerSweep?: number;
  readonly maxSchedulerRepeatAllowed?: number;
  readonly monitorConnectionSplits?: boolean;
  readonly offlineDurableSubscriberTaskSchedule?: number;
  readonly offlineDurableSubscriberTimeout?: number;
  readonly persistenceThreadPriority?: number;
  readonly persistent?: string;
  readonly populateJMSXUserID?: boolean;
  readonly producerSystemUsagePortion?: number;
  readonly rejectDurableConsumers?: boolean;
  readonly rollbackOnlyOnAsyncException?: boolean;
  readonly schedulePeriodForDestinationPurge?: number;
  readonly schedulerSupport?: string;
  readonly splitSystemUsageForProducersConsumers?: boolean;
  readonly systemUsage?: string;
  readonly taskRunnerPriority?: number;
  readonly timeBeforePurgeTempDestinations?: number;
  readonly useAuthenticatedPrincipalForJMSXUserID?: boolean;
  readonly useMirroredQueues?: boolean;
  readonly useTempMirroredQueues?: boolean;
  readonly useVirtualDestSubs?: boolean;
  readonly useVirtualDestSubsOnCreation?: boolean;
  readonly useVirtualTopics?: boolean;
  readonly start?: boolean;
}

export interface IBrokerDestinationInterceptor {}

export interface IBrokerDestination {}

export interface IBrokerPlugin {}

export interface BrokerElements {
  readonly destinationInterceptors?: IBrokerDestinationInterceptor[];
  readonly destinationPolicy?: PolicyMap;
  readonly destinations?: IBrokerDestination[];
  readonly networkConnectors?: NetworkConnector[];
  readonly persistenceAdapter?: KahaDB;
  readonly plugins?: IBrokerPlugin[];
  readonly systemUsage?: SystemUsage;
  readonly transportConnectors?: TransportConnector[];
}

export class Broker extends XmlNode {
  constructor(
    public readonly attributes?: BrokerAttributes,
    public readonly elements?: BrokerElements,
  ) {
    super({
      tagName: "broker",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface CompositeQueueAttributes {
  readonly concurrentSend?: boolean;
  readonly copyMessage?: boolean;
  readonly forwardOnly?: boolean;
  readonly name?: string;
  readonly sendWhenNotMatched?: boolean;
}

export interface ICompositeQueueForwardTo {}

export interface CompositeQueueElements {
  readonly forwardTo?: ICompositeQueueForwardTo[];
}

export class CompositeQueue
  extends XmlNode
  implements IVirtualDestinationInterceptorVirtualDestination
{
  constructor(
    public readonly attributes?: CompositeQueueAttributes,
    public readonly elements?: CompositeQueueElements,
  ) {
    super({
      tagName: "compositeQueue",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface CompositeTopicAttributes {
  readonly concurrentSend?: boolean;
  readonly copyMessage?: boolean;
  readonly forwardOnly?: boolean;
  readonly name?: string;
  readonly sendWhenNotMatched?: boolean;
}

export interface ICompositeTopicForwardTo {}

export interface CompositeTopicElements {
  readonly forwardTo?: ICompositeTopicForwardTo[];
}

export class CompositeTopic
  extends XmlNode
  implements IVirtualDestinationInterceptorVirtualDestination
{
  constructor(
    public readonly attributes?: CompositeTopicAttributes,
    public readonly elements?: CompositeTopicElements,
  ) {
    super({
      tagName: "compositeTopic",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface NetworkConnectorAttributes {
  readonly advisoryAckPercentage?: number;
  readonly advisoryForFailedForward?: boolean;
  readonly advisoryPrefetchSize?: number;
  readonly alwaysSyncSend?: boolean;
  readonly bridgeFactory?: string;
  readonly bridgeTempDestinations?: boolean;
  readonly brokerName?: string;
  readonly brokerURL?: string;
  readonly checkDuplicateMessagesOnDuplex?: boolean;
  readonly clientIdToken?: string;
  readonly conduitNetworkQueueSubscriptions?: boolean;
  readonly conduitSubscriptions?: boolean;
  readonly connectionFilter?: string;
  readonly consumerPriorityBase?: number;
  readonly consumerTTL?: number;
  readonly decreaseNetworkConsumerPriority?: boolean;
  readonly destinationFilter?: string;
  readonly dispatchAsync?: boolean;
  readonly duplex?: boolean;
  readonly dynamicOnly?: boolean;
  readonly gcDestinationViews?: boolean;
  readonly gcSweepTime?: number;
  readonly localUri?: string;
  readonly messageTTL?: number;
  readonly name?: string;
  readonly networkTTL?: number;
  readonly objectName?: string;
  readonly prefetchSize?: string;
  readonly staticBridge?: boolean;
  readonly suppressDuplicateQueueSubscriptions?: boolean;
  readonly suppressDuplicateTopicSubscriptions?: boolean;
  readonly syncDurableSubs?: boolean;
  readonly uri?: string;
  readonly useBrokerNameAsIdSees?: boolean;
  readonly useCompression?: boolean;
  readonly useVirtualDestSubs?: boolean;
  readonly userName?: string;
}

export interface INetworkConnectorDurableDestination {}

export interface INetworkConnectorDynamicallyIncludedDestination {}

export interface INetworkConnectorExcludedDestination {}

export interface INetworkConnectorStaticallyIncludedDestination {}

export interface NetworkConnectorElements {
  readonly durableDestinations?: INetworkConnectorDurableDestination[];
  readonly dynamicallyIncludedDestinations?: INetworkConnectorDynamicallyIncludedDestination[];
  readonly excludedDestinations?: INetworkConnectorExcludedDestination[];
  readonly staticallyIncludedDestinations?: INetworkConnectorStaticallyIncludedDestination[];
}

export class NetworkConnector extends XmlNode {
  constructor(
    public readonly attributes?: NetworkConnectorAttributes,
    public readonly elements?: NetworkConnectorElements,
  ) {
    super({
      tagName: "networkConnector",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface PolicyEntryAttributes {
  readonly advisoryForConsumed?: boolean;
  readonly advisoryForDelivery?: boolean;
  readonly advisoryForDiscardingMessages?: boolean;
  readonly advisoryForFastProducers?: boolean;
  readonly advisoryForSlowConsumers?: boolean;
  readonly advisoryWhenFull?: boolean;
  readonly allConsumersExclusiveByDefault?: boolean;
  readonly alwaysRetroactive?: boolean;
  readonly blockedProducerWarningInterval?: number;
  readonly consumersBeforeDispatchStarts?: number;
  readonly cursorMemoryHighWaterMark?: number;
  readonly doOptimzeMessageStorage?: boolean;
  readonly durableTopicPrefetch?: number;
  readonly enableAudit?: boolean;
  readonly expireMessagesPeriod?: number;
  readonly gcInactiveDestinations?: boolean;
  readonly gcWithNetworkConsumers?: boolean;
  readonly inactiveTimeoutBeforeGC?: number;
  readonly inactiveTimoutBeforeGC?: number;
  readonly includeBodyForAdvisory?: boolean;
  readonly lazyDispatch?: boolean;
  readonly maxAuditDepth?: number;
  readonly maxBrowsePageSize?: number;
  readonly maxDestinations?: number;
  readonly maxExpirePageSize?: number;
  readonly maxPageSize?: number;
  readonly maxProducersToAudit?: number;
  readonly maxQueueAuditDepth?: number;
  readonly memoryLimit?: string;
  readonly messageGroupMapFactoryType?: string;
  readonly minimumMessageSize?: number;
  readonly optimizeMessageStoreInFlightLimit?: number;
  readonly optimizedDispatch?: boolean;
  readonly persistJMSRedelivered?: boolean;
  readonly prioritizedMessages?: boolean;
  readonly producerFlowControl?: boolean;
  readonly queue?: string;
  readonly queueBrowserPrefetch?: number;
  readonly queuePrefetch?: number;
  readonly reduceMemoryFootprint?: boolean;
  readonly sendAdvisoryIfNoConsumers?: boolean;
  readonly sendDuplicateFromStoreToDLQ?: boolean;
  readonly sendFailIfNoSpace?: boolean;
  readonly sendFailIfNoSpaceAfterTimeout?: number;
  readonly storeUsageHighWaterMark?: number;
  readonly strictOrderDispatch?: boolean;
  readonly tempQueue?: boolean;
  readonly tempTopic?: boolean;
  readonly timeBeforeDispatchStarts?: number;
  readonly topic?: string;
  readonly topicPrefetch?: number;
  readonly useCache?: boolean;
  readonly useConsumerPriority?: boolean;
  readonly usePrefetchExtension?: boolean;
  readonly useTopicSubscriptionInflightStats?: boolean;
}

export interface IPolicyEntryDeadLetterStrategy {}

export interface IPolicyEntryDestination {}

export interface IPolicyEntryDispatchPolicy {}

export interface IPolicyEntryMessageEvictionStrategy {}

export interface IPolicyEntryMessageGroupMapFactory {}

export interface IPolicyEntryPendingDurableSubscriberPolicy {}

export interface IPolicyEntryPendingMessageLimitStrategy {}

export interface IPolicyEntryPendingQueuePolicy {}

export interface IPolicyEntryPendingSubscriberPolicy {}

export interface IPolicyEntrySlowConsumerStrategy {}

export interface IPolicyEntrySubscriptionRecoveryPolicy {}

export interface PolicyEntryElements {
  readonly deadLetterStrategy?: IPolicyEntryDeadLetterStrategy;
  readonly destination?: IPolicyEntryDestination;
  readonly dispatchPolicy?: IPolicyEntryDispatchPolicy;
  readonly messageEvictionStrategy?: IPolicyEntryMessageEvictionStrategy;
  readonly messageGroupMapFactory?: IPolicyEntryMessageGroupMapFactory;
  readonly networkBridgeFilterFactory?: ConditionalNetworkBridgeFilterFactory;
  readonly pendingDurableSubscriberPolicy?: IPolicyEntryPendingDurableSubscriberPolicy;
  readonly pendingMessageLimitStrategy?: IPolicyEntryPendingMessageLimitStrategy;
  readonly pendingQueuePolicy?: IPolicyEntryPendingQueuePolicy;
  readonly pendingSubscriberPolicy?: IPolicyEntryPendingSubscriberPolicy;
  readonly slowConsumerStrategy?: IPolicyEntrySlowConsumerStrategy;
  readonly subscriptionRecoveryPolicy?: IPolicyEntrySubscriptionRecoveryPolicy;
}

export class PolicyEntry extends XmlNode {
  constructor(
    public readonly attributes?: PolicyEntryAttributes,
    public readonly elements?: PolicyEntryElements,
  ) {
    super({
      tagName: "policyEntry",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface PolicyMapElements {
  readonly defaultEntry?: PolicyEntry;
  readonly policyEntries?: PolicyEntry[];
}

export class PolicyMap extends XmlNode {
  constructor(public readonly elements?: PolicyMapElements) {
    super({
      tagName: "policyMap",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface RedeliveryPolicyMapElements {
  readonly defaultEntry?: RedeliveryPolicy;
  readonly redeliveryPolicyEntries?: RedeliveryPolicy[];
}

export class RedeliveryPolicyMap extends XmlNode {
  constructor(public readonly elements?: RedeliveryPolicyMapElements) {
    super({
      tagName: "redeliveryPolicyMap",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface RedeliveryPluginAttributes {
  readonly fallbackToDeadLetter?: boolean;
  readonly sendToDlqIfMaxRetriesExceeded?: boolean;
}

export interface RedeliveryPluginElements {
  readonly redeliveryPolicyMap?: RedeliveryPolicyMap;
}

export class RedeliveryPlugin extends XmlNode implements IBrokerPlugin {
  constructor(
    public readonly attributes?: RedeliveryPluginAttributes,
    public readonly elements?: RedeliveryPluginElements,
  ) {
    super({
      tagName: "redeliveryPlugin",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface IRetainedMessageSubscriptionRecoveryPolicyWrapped {}

export interface RetainedMessageSubscriptionRecoveryPolicyElements {
  readonly wrapped?: IRetainedMessageSubscriptionRecoveryPolicyWrapped;
}

export class RetainedMessageSubscriptionRecoveryPolicy
  extends XmlNode
  implements
    IPolicyEntrySubscriptionRecoveryPolicy,
    IRetainedMessageSubscriptionRecoveryPolicyWrapped
{
  constructor(
    public readonly elements?: RetainedMessageSubscriptionRecoveryPolicyElements,
  ) {
    super({
      tagName: "retainedMessageSubscriptionRecoveryPolicy",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface SharedDeadLetterStrategyAttributes {
  readonly enableAudit?: boolean;
  readonly expiration?: number;
  readonly maxAuditDepth?: number;
  readonly maxProducersToAudit?: number;
  readonly processExpired?: boolean;
  readonly processNonPersistent?: boolean;
}

export interface ISharedDeadLetterStrategyDeadLetterQueue {}

export interface SharedDeadLetterStrategyElements {
  readonly deadLetterQueue?: ISharedDeadLetterStrategyDeadLetterQueue;
}

export class SharedDeadLetterStrategy
  extends XmlNode
  implements IPolicyEntryDeadLetterStrategy
{
  constructor(
    public readonly attributes?: SharedDeadLetterStrategyAttributes,
    public readonly elements?: SharedDeadLetterStrategyElements,
  ) {
    super({
      tagName: "sharedDeadLetterStrategy",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface SystemUsageAttributes {
  readonly sendFailIfNoSpace?: boolean;
  readonly sendFailIfNoSpaceAfterTimeout?: number;
}

export interface SystemUsageElements {
  readonly memoryUsage?: MemoryUsage;
}

export class SystemUsage extends XmlNode {
  constructor(
    public readonly attributes?: SystemUsageAttributes,
    public readonly elements?: SystemUsageElements,
  ) {
    super({
      tagName: "systemUsage",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface IVirtualDestinationInterceptorVirtualDestination {}

export interface VirtualDestinationInterceptorElements {
  readonly virtualDestinations: IVirtualDestinationInterceptorVirtualDestination[];
}

export class VirtualDestinationInterceptor
  extends XmlNode
  implements IBrokerDestinationInterceptor
{
  constructor(public readonly elements: VirtualDestinationInterceptorElements) {
    super({
      tagName: "virtualDestinationInterceptor",
      namespace: "http://activemq.apache.org/schema/core",
    });
  }
}

export interface CachedLDAPAuthorizationMapAttributes {
  readonly queueSearchBase?: string;
  readonly topicSearchBase?: string;
  readonly tempSearchBase?: string;
  readonly refreshInterval?: number;
  readonly legacyGroupMapping?: boolean;
}

export class CachedLDAPAuthorizationMap
  extends XmlNode
  implements IAuthorizationPluginMap
{
  constructor(
    public readonly attributes?: CachedLDAPAuthorizationMapAttributes,
  ) {
    super({
      tagName: "cachedLDAPAuthorizationMap",
    });
  }
}
