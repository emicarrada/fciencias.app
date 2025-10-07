// Domain Events Exports
export * from './DomainEvent';
export * from './PostEvents';
export * from './ReactionEvents';
export * from './UserEvents';

// Event Type Definitions for easy imports
export type {
  IDomainEvent,
  EventMetadata
} from './DomainEvent';

// Post Events
export type {
  PostCreatedEvent,
  PostUpdatedEvent,
  PostDeletedEvent,
  PostViewedEvent,
  PostSharedEvent
} from './PostEvents';

// Reaction Events
export type {
  PostReactionAddedEvent,
  PostReactionChangedEvent,
  PostReactionRemovedEvent,
  PostReactionSummaryUpdatedEvent,
  PostReactionMilestoneEvent
} from './ReactionEvents';

// User Events
export type {
  UserRegisteredEvent,
  UserLoggedInEvent,
  UserLoggedOutEvent,
  UserProfileUpdatedEvent,
  UserFollowedEvent,
  UserUnfollowedEvent,
  UserAccountDeactivatedEvent
} from './UserEvents';