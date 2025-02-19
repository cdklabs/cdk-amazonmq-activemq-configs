# Amazon MQ for ActiveMQ XML configuration v5.17.6 bindings

<!--BEGIN STABILITY BANNER-->

---

| Features                   | Stability                                                                                    |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| All types are experimental | ![Experimental](https://img.shields.io/badge/experimental-important.svg?style=for-the-badge) |

> **Experimental:** All types in this module are experimental and are under active development. They are subject to non-backward compatible
> changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes
> will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a
> newer version of this package.

---

<!--END STABILITY BANNER-->

This package provides strongly-typed configuration bindings for Amazon MQ for ActiveMQ version {{VERSION}}. It enables you to define your ActiveMQ broker configurations in code instead of raw XML.

The types in this library are intended to be used with the [@cdklabs/cdk-amazonmq](https://github.com/cdklabs/cdk-amazonmq) library and allow for providing strongly-typed configuration of ActiveMQ brokers that is generated from [the XML schema definition tailored for the Amazon MQ](https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/amazon-mq-broker-configuration-parameters.html#working-with-spring-xml-configuration-files).

An example of using this library can be found below:

```typescript
// Basic broker configuration
const broker = new Broker({
  schedulePeriodForDestinationPurge: 10000,
  start: false
}, {
  // Destination interceptors configuration
  destinationInterceptors: [
    // ... interceptor configuration
  ],
  
  // Persistence configuration
  persistenceAdapter: new KahaDB({
    // ... persistence configuration
  }),
  
  // Policy configuration
  destinationPolicy: new PolicyMap({
    // ... policy configuration
  }),
  
  // ... other sections
});
```

> **LDAP Integration Note:**  
> Amazon MQ for ActiveMQ [enables LDAP integration](https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/security-authentication-authorization.html) which requires using `cachedLDAPAuthorizationMap`. See [ActiveMQ documentation](https://activemq.apache.org/components/classic/documentation/cached-ldap-authorization-module) for more details. The types in this package include the `CachedLDAPAuthorizationMap` type with attributes specifically enabled by Amazon MQ for ActiveMQ.
