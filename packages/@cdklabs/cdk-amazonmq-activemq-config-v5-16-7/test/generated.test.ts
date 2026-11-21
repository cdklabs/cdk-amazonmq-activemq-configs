import * as path from "path"
import { validateXML } from "xsd-schema-validator"
import {
  AbortSlowAckConsumerStrategy,
  AbortSlowConsumerStrategy,
  AuthorizationEntry,
  AuthorizationMap,
  AuthorizationPlugin,
  Broker,
  // CachedLDAPAuthorizationMap,
  CachedMessageGroupMapFactory,
  ClientIdFilterDispatchPolicy,
  CompositeQueue,
  CompositeTopic,
  ConditionalNetworkBridgeFilterFactory,
  ConstantPendingMessageLimitStrategy,
  Discarding,
  DiscardingDLQBrokerPlugin,
  // FileCursor,
  // FileDurableSubscriberCursor,
  // FileQueueCursor,
  FilteredDestination,
  FixedCountSubscriptionRecoveryPolicy,
  FixedSizedSubscriptionRecoveryPolicy,
  ForcePersistencyModeBrokerPlugin,
  IndividualDeadLetterStrategy,
  IXmlNode,
  JournalDiskSyncStrategy,
  KahaDB,
  // LastImageSubscriptionRecoveryPolicy,
  MemoryUsage,
  MessageGroupHashBucketFactory,
  MirroredQueue,
  NetworkConnector,
  // NoSubscriptionRecoveryPolicy,
  OldestMessageEvictionStrategy,
  OldestMessageWithLowestPriorityEvictionStrategy,
  PolicyEntry,
  PolicyMap,
  PreallocationStrategy,
  PrefetchRatePendingMessageLimitStrategy,
  // PriorityDispatchPolicy,
  // PriorityNetworkDispatchPolicy,
  Protocol,
  QueryBasedSubscriptionRecoveryPolicy,
  Queue,
  RedeliveryPlugin,
  RedeliveryPolicy,
  RedeliveryPolicyMap,
  //RetainedMessageSubscriptionRecoveryPolicy,
  // RoundRobinDispatchPolicy,
  SharedDeadLetterStrategy,
  // SimpleDispatchPolicy,
  // SimpleMessageGroupMapFactory,
  StatisticsBrokerPlugin,
  // StoreCursor,
  StoreDurableSubscriberCursor,
  // StrictOrderDispatchPolicy,
  SystemUsage,
  TempDestinationAuthorizationEntry,
  TempQueue,
  TempTopic,
  TimedSubscriptionRecoveryPolicy,
  TimeStampingBrokerPlugin,
  Topic,
  TransportConnector,
  UniquePropertyMessageEvictionStrategy,
  VirtualDestinationInterceptor,
  VirtualTopic,
  // VmCursor,
  // VmDurableCursor,
  // VmQueueCursor,
} from "../src"

describe("XSD Validation", () => {
  test.each([
    new Broker(
      {
        schedulePeriodForDestinationPurge: 10000,
      },
      {
        destinationInterceptors: [
          new MirroredQueue({
            copyMessage: true,
            postfix: ".qmirror",
            prefix: "",
          }),
          new VirtualDestinationInterceptor({
            virtualDestinations: [
              new VirtualTopic({
                name: "&gt;",
                prefix: "VirtualTopicConsumers.*.",
                selectorAware: false,
              }),
              new CompositeQueue(
                { name: "MY.QUEUE" },
                {
                  forwardTo: [
                    new Queue({ physicalName: "FOO" }),
                    new Topic({ physicalName: "BAR" }),
                  ],
                },
              ),
            ],
          }),
        ],
        persistenceAdapter: new KahaDB({
          concurrentStoreAndDispatchQueues: false,
        }),
        destinationPolicy: new PolicyMap({
          policyEntries: [
            new PolicyEntry(
              {
                gcInactiveDestinations: true,
                inactiveTimeoutBeforeGC: 600000,
                topic: "&gt;",
              },
              {
                pendingMessageLimitStrategy:
                  new ConstantPendingMessageLimitStrategy({ limit: 1000 }),
              },
            ),
            new PolicyEntry({
              gcInactiveDestinations: true,
              inactiveTimeoutBeforeGC: 600000,
              queue: "&gt;",
            }),
          ],
        }),
        destinations: [
          new Queue({ physicalName: "FOO.BAR" }),
          new Topic({ physicalName: "SOME.TOPIC " }),
        ],
        plugins: [
          new AuthorizationPlugin({
            authorizationMap: new AuthorizationMap({
              authorizationEntries: [
                new AuthorizationEntry({
                  admin: "guests,users",
                  queue: "GUEST.&gt;",
                  read: "guests",
                  write: "guests,users",
                }),
                new AuthorizationEntry({
                  admin: "guests,users",
                  read: "guests,users",
                  topic: "ActiveMQ.Advisory.&gt;",
                  write: "guests,users",
                }),
              ],
              tempDestinationAuthorizationEntry:
                new TempDestinationAuthorizationEntry({
                  admin: "tempDestinationAdmins",
                  read: "tempDestinationAdmins",
                  write: "tempDestinationAdmins",
                }),
            }),
          }),
          new RedeliveryPlugin(
            {
              fallbackToDeadLetter: true,
              sendToDlqIfMaxRetriesExceeded: true,
            },
            {
              redeliveryPolicyMap: new RedeliveryPolicyMap({
                redeliveryPolicyEntries: [
                  new RedeliveryPolicy({
                    maximumRedeliveries: 4,
                    queue: "SpecialQueue",
                    redeliveryDelay: 10000,
                  }),
                ],
                defaultEntry: new RedeliveryPolicy({
                  initialRedeliveryDelay: 5000,
                  maximumRedeliveries: 4,
                  redeliveryDelay: 10000,
                }),
              }),
            },
          ),
          new StatisticsBrokerPlugin(),
          new TimeStampingBrokerPlugin({
            ttlCeiling: 86400000,
            zeroExpirationOverride: 86400000,
          }),
        ],
        networkConnectors: [
          new NetworkConnector(
            {
              conduitSubscriptions: false,
              consumerTTL: 1,
              messageTTL: -1,
              name: "QueueConnector_ConnectingBroker_2_To_1",
              uri: "masterslave:",
              userName: "userName",
            },
            {
              excludedDestinations: [new Topic({ physicalName: "&gt;" })],
            },
          ),
          new NetworkConnector(
            {
              conduitSubscriptions: false,
              consumerTTL: 1,
              messageTTL: -1,
              name: "QueueConnector_ConnectingBroker_2_To_3",
              uri: "masterslave:",
              userName: "userName2",
            },
            {
              excludedDestinations: [new Topic({ physicalName: "&gt;" })],
            },
          ),
        ],
        transportConnectors: [
          new TransportConnector({
            name: Protocol.OPENWIRE,
            rebalanceClusterClients: true,
            updateClusterClients: true,
          }),
        ],
      },
    )
    // , new VmQueueCursor()
    // , new VmDurableCursor()
    // , new VmCursor()
    // , new StrictOrderDispatchPolicy()
    // , new StoreCursor()
    // , new StatisticsBrokerPlugin()
    // , new SimpleMessageGroupMapFactory()
    // , new SimpleDispatchPolicy()
    // , new RoundRobinDispatchPolicy()
    // , new PriorityNetworkDispatchPolicy()
    // , new PriorityDispatchPolicy()
    // , new NoSubscriptionRecoveryPolicy()
    // , new LastImageSubscriptionRecoveryPolicy()
    // , new FileQueueCursor()
    // , new FileDurableSubscriberCursor()
    // , new FileCursor()
    , new VirtualTopic({
      concurrentSend: false,
      local: false,
      name: "a",
      postfix: "Z",
      prefix: "m",
      selectorAware: true,
      transactedSend: true,
    })
    , new UniquePropertyMessageEvictionStrategy({
      evictExpiredMessagesHighWatermark: 1,
      propertyName: "i",
    })
    , new TransportConnector({
      name: Protocol.OPENWIRE,
      updateClusterClients: false,
      rebalanceClusterClients: true,
      updateClusterClientsOnRemove: true,
    })
    , new Topic({
      dlq: false,
      physicalName: "y",
    })
    , new TimedSubscriptionRecoveryPolicy({
      recoverDuration: 100,
    })
    , new TimeStampingBrokerPlugin({
      futureOnly: false,
      processNetworkMessages: false,
      ttlCeiling: 100,
      zeroExpirationOverride: 100,
    })
    , new TempTopic({
      dlq: true,
      physicalName: "S",
    })
    , new TempQueue({
      dlq: false,
      physicalName: "J",
    })
    , new TempDestinationAuthorizationEntry({
      admin: "F",
      queue: "a",
      read: "U",
      tempQueue: false,
      tempTopic: true,
      topic: "2",
      write: "J",
    })
    , new StoreDurableSubscriberCursor({
      immediatePriorityDispatch: true,
      useCache: false,
    })
    , new RedeliveryPolicy({
      backOffMultiplier: 1,
      collisionAvoidancePercent: 1,
      initialRedeliveryDelay: 100,
      maximumRedeliveries: 100,
      maximumRedeliveryDelay: 100,
      preDispatchCheck: false,
      queue: "x",
      redeliveryDelay: 100,
      tempQueue: true,
      tempTopic: false,
      topic: "E",
      useCollisionAvoidance: true,
      useExponentialBackOff: false,
    })
    , new Queue({
      dlq: false,
      physicalName: "e",
    })
    , new QueryBasedSubscriptionRecoveryPolicy({
      query: "O",
    })
    , new PrefetchRatePendingMessageLimitStrategy({
      multiplier: 1,
    })
    , new OldestMessageWithLowestPriorityEvictionStrategy({
      evictExpiredMessagesHighWatermark: 1,
    })
    , new OldestMessageEvictionStrategy({
      evictExpiredMessagesHighWatermark: 1,
    })
    , new MirroredQueue({
      copyMessage: true,
      postfix: "5",
      prefix: "s",
    })
    , new MessageGroupHashBucketFactory({
      bucketCount: 1,
      cacheSize: 1,
    })
    , new MemoryUsage({
      percentOfJvmHeap: 1,
    })
    , new KahaDB({
      concurrentStoreAndDispatchQueues: true,
      checkpointInterval: 5000,
      indexWriteBatchSize: 1000,
      journalDiskSyncInterval: 1,
      journalDiskSyncStrategy: JournalDiskSyncStrategy.ALWAYS,
      preallocationStrategy: PreallocationStrategy.ZEROS,
    })
    , new IndividualDeadLetterStrategy({
      destinationPerDurableSubscriber: true,
      enableAudit: true,
      expiration: 100,
      maxAuditDepth: 1,
      maxProducersToAudit: 1,
      processExpired: true,
      processNonPersistent: true,
      queuePrefix: "m",
      queueSuffix: "r",
      topicPrefix: "0",
      topicSuffix: "s",
      useQueueForQueueMessages: false,
      useQueueForTopicMessages: true,
    })
    , new ForcePersistencyModeBrokerPlugin({
      persistenceFlag: false,
    })
    , new FixedSizedSubscriptionRecoveryPolicy({
      maximumSize: 1,
      useSharedBuffer: true,
    })
    , new FixedCountSubscriptionRecoveryPolicy({
      maximumSize: 1,
    })
    , new FilteredDestination({
      queue: "x",
      selector: "N",
      topic: "y",
    })
    , new DiscardingDLQBrokerPlugin({
      dropAll: false,
      dropOnly: "o",
      dropTemporaryQueues: true,
      dropTemporaryTopics: false,
      reportInterval: 1,
    })
    , new Discarding({
      deadLetterQueue: "1",
      enableAudit: true,
      expiration: 100,
      maxAuditDepth: 1,
      maxProducersToAudit: 1,
      processExpired: false,
      processNonPersistent: true,
    })
    , new ConstantPendingMessageLimitStrategy({
      limit: 1,
    })
    , new ConditionalNetworkBridgeFilterFactory({
      rateDuration: 1,
      rateLimit: 1,
      replayDelay: 1,
      replayWhenNoConsumers: false,
    })
    , new ClientIdFilterDispatchPolicy({
      ptpClientId: "8",
      ptpSuffix: "2",
    })
    , new CachedMessageGroupMapFactory({
      cacheSize: 1,
    })
    , new AuthorizationEntry({
      admin: "D",
      queue: "V",
      read: "x",
      tempQueue: false,
      tempTopic: true,
      topic: "e",
      write: "a",
    })
    , new AbortSlowConsumerStrategy({
      abortConnection: false,
      checkPeriod: 1,
      ignoreNetworkConsumers: false,
      maxSlowCount: 100,
      maxSlowDuration: 100,
      name: "X",
    })
    , new AbortSlowAckConsumerStrategy({
      abortConnection: false,
      checkPeriod: 1,
      ignoreIdleConsumers: true,
      ignoreNetworkConsumers: true,
      maxSlowCount: 100,
      maxSlowDuration: 100,
      maxTimeSinceLastAck: 100,
      name: "q",
    })
    //, new AuthorizationMap()
    //, new AuthorizationPlugin()
    , new Broker({
      advisorySupport: "X",
      allowTempAutoCreationOnSend: true,
      anonymousProducerAdvisorySupport: false,
      cacheTempDestinations: false,
      consumerSystemUsagePortion: 1,
      dedicatedTaskRunner: false,
      deleteAllMessagesOnStartup: "Z",
      keepDurableSubsActive: true,
      maxPurgedDestinationsPerSweep: 1,
      monitorConnectionSplits: true,
      offlineDurableSubscriberTaskSchedule: 100,
      offlineDurableSubscriberTimeout: 100,
      persistenceThreadPriority: 1,
      persistent: "D",
      populateJMSXUserID: false,
      producerSystemUsagePortion: 1,
      rejectDurableConsumers: true,
      rollbackOnlyOnAsyncException: false,
      schedulePeriodForDestinationPurge: 1,
      schedulerSupport: "H",
      splitSystemUsageForProducersConsumers: true,
      systemUsage: "6",
      taskRunnerPriority: 1,
      timeBeforePurgeTempDestinations: 1,
      useAuthenticatedPrincipalForJMSXUserID: true,
      useMirroredQueues: false,
      useTempMirroredQueues: true,
      useVirtualDestSubs: true,
      useVirtualDestSubsOnCreation: true,
      useVirtualTopics: false,
    })
    , new CompositeQueue({
      concurrentSend: false,
      copyMessage: true,
      forwardOnly: true,
      name: "H",
    })
    , new CompositeTopic({
      concurrentSend: false,
      copyMessage: true,
      forwardOnly: true,
      name: "M",
    })
    , new NetworkConnector({
      advisoryAckPercentage: 1,
      advisoryForFailedForward: false,
      advisoryPrefetchSize: 1,
      alwaysSyncSend: true,
      bridgeFactory: "D",
      bridgeTempDestinations: false,
      brokerName: "T",
      brokerURL: "w",
      checkDuplicateMessagesOnDuplex: true,
      clientIdToken: "y",
      conduitNetworkQueueSubscriptions: false,
      conduitSubscriptions: true,
      connectionFilter: "1",
      consumerPriorityBase: 1,
      consumerTTL: 1,
      decreaseNetworkConsumerPriority: false,
      destinationFilter: "z",
      dispatchAsync: false,
      duplex: true,
      dynamicOnly: true,
      gcDestinationViews: true,
      gcSweepTime: 1,
      localUri: "9",
      messageTTL: 1,
      name: "a",
      networkTTL: 1,
      objectName: "Z",
      prefetchSize: "w",
      staticBridge: true,
      suppressDuplicateQueueSubscriptions: false,
      suppressDuplicateTopicSubscriptions: true,
      syncDurableSubs: false,
      uri: "t",
      useBrokerNameAsIdSees: false,
      useCompression: true,
      useVirtualDestSubs: true,
      userName: "d",
    })
    , new PolicyEntry({
      advisoryForConsumed: true,
      advisoryForDelivery: false,
      advisoryForDiscardingMessages: true,
      advisoryForFastProducers: false,
      advisoryForSlowConsumers: true,
      advisoryWhenFull: false,
      allConsumersExclusiveByDefault: false,
      alwaysRetroactive: false,
      blockedProducerWarningInterval: 1,
      consumersBeforeDispatchStarts: 1,
      cursorMemoryHighWaterMark: 1,
      doOptimzeMessageStorage: true,
      durableTopicPrefetch: 1,
      enableAudit: true,
      expireMessagesPeriod: 1,
      gcInactiveDestinations: true,
      gcWithNetworkConsumers: false,
      inactiveTimeoutBeforeGC: 1,
      inactiveTimoutBeforeGC: 1,
      includeBodyForAdvisory: false,
      lazyDispatch: true,
      maxAuditDepth: 1,
      maxBrowsePageSize: 1,
      maxDestinations: 1,
      maxExpirePageSize: 1,
      maxPageSize: 1,
      maxProducersToAudit: 1,
      maxQueueAuditDepth: 1,
      memoryLimit: "e",
      messageGroupMapFactoryType: "q",
      minimumMessageSize: 1,
      optimizeMessageStoreInFlightLimit: 1,
      optimizedDispatch: true,
      persistJMSRedelivered: false,
      prioritizedMessages: false,
      producerFlowControl: false,
      queue: "O",
      queueBrowserPrefetch: 1,
      queuePrefetch: 1,
      reduceMemoryFootprint: true,
      sendAdvisoryIfNoConsumers: true,
      storeUsageHighWaterMark: 1,
      strictOrderDispatch: false,
      tempQueue: false,
      tempTopic: true,
      timeBeforeDispatchStarts: 1,
      topic: "v",
      topicPrefetch: 1,
      useCache: true,
      useConsumerPriority: false,
      usePrefetchExtension: true,
      useTopicSubscriptionInflightStats: true,
    })
    //, new PolicyMap()
    //, new RedeliveryPolicyMap()
    , new RedeliveryPlugin({
      fallbackToDeadLetter: true,
      sendToDlqIfMaxRetriesExceeded: true,
    })
    //, new RetainedMessageSubscriptionRecoveryPolicy()
    , new SharedDeadLetterStrategy({
      enableAudit: true,
      expiration: 1,
      maxAuditDepth: 1,
      maxProducersToAudit: 1,
      processExpired: false,
      processNonPersistent: false,
    })
    , new SystemUsage({
      sendFailIfNoSpace: false,
      sendFailIfNoSpaceAfterTimeout: 1,
    })
    // , new VirtualDestinationInterceptor()
    //, new CachedLDAPAuthorizationMap({
    //  queueSearchBase: "q",
    //  topicSearchBase: "t",
    //  tempSearchBase: "p",
    //  refreshInterval: 1,
    //  legacyGroupMapping: false,
    //})
  ])("XSD Validated", async (node: IXmlNode) => {
    const xsdPath = path.join(
      __dirname,
      "../../../../sources/amazon-mq-active-mq-5.16.7.xsd",
    )
    const result = await validateXML(node.toXmlString(), xsdPath)

    expect(result.valid).toBe(true)
  })
}) 
