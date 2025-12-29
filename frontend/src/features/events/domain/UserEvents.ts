import { DomainEvent, EventMetadata } from './DomainEvent';
import type { User } from '@/types/auth';

/**
 * Event fired when a new user registers
 */
export class UserRegisteredEvent extends DomainEvent {
  public readonly data: {
    userId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    career?: string;
    registrationMethod: 'email' | 'google' | 'github' | 'facebook';
    ipAddress?: string;
    userAgent?: string;
  };

  constructor(
    user: User,
    registrationMethod: 'email' | 'google' | 'github' | 'facebook',
    ipAddress?: string,
    userAgent?: string,
    metadata?: Partial<EventMetadata>
  ) {
    const eventData = {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      career: user.career,
      registrationMethod,
      ipAddress,
      userAgent,
    };

    super('UserRegistered', eventData, {
      ...metadata,
      userId: metadata?.userId ?? user.id,
    });

    this.data = eventData;
  }

  protected validateEventData(data: Record<string, any>): void {
    super.validateEventData(data);

    if (!data.userId || typeof data.userId !== 'string') {
      throw new Error('UserRegisteredEvent: userId is required and must be a string');
    }

    if (!data.email || typeof data.email !== 'string') {
      throw new Error('UserRegisteredEvent: email is required and must be a string');
    }

    // firstName is now optional
    if (data.firstName !== undefined && typeof data.firstName !== 'string') {
      throw new Error('UserRegisteredEvent: firstName must be a string if provided');
    }

    const validMethods = ['email', 'google', 'github', 'facebook'];
    if (!validMethods.includes(data.registrationMethod)) {
      throw new Error(`UserRegisteredEvent: registrationMethod must be one of ${validMethods.join(', ')}`);
    }
  }
}

/**
 * Event fired when a user successfully logs in
 */
export class UserLoggedInEvent extends DomainEvent {
  public readonly data: {
    userId: string;
    email: string;
    loginMethod: 'email' | 'google' | 'github' | 'facebook';
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    previousLoginAt?: Date;
  };

  constructor(
    user: User,
    loginMethod: 'email' | 'google' | 'github' | 'facebook',
    sessionId?: string,
    ipAddress?: string,
    userAgent?: string,
    previousLoginAt?: Date,
    metadata?: Partial<EventMetadata>
  ) {
    const eventData = {
      userId: user.id,
      email: user.email,
      loginMethod,
      ipAddress,
      userAgent,
      sessionId,
      previousLoginAt,
    };

    super('UserLoggedIn', eventData, {
      ...metadata,
      userId: metadata?.userId ?? user.id,
    });

    this.data = eventData;
  }

  protected validateEventData(data: Record<string, any>): void {
    super.validateEventData(data);

    if (!data.userId || typeof data.userId !== 'string') {
      throw new Error('UserLoggedInEvent: userId is required and must be a string');
    }

    if (!data.email || typeof data.email !== 'string') {
      throw new Error('UserLoggedInEvent: email is required and must be a string');
    }

    const validMethods = ['email', 'google', 'github', 'facebook'];
    if (!validMethods.includes(data.loginMethod)) {
      throw new Error(`UserLoggedInEvent: loginMethod must be one of ${validMethods.join(', ')}`);
    }
  }
}

/**
 * Event fired when a user logs out
 */
export class UserLoggedOutEvent extends DomainEvent {
  public readonly data: {
    userId: string;
    sessionId?: string;
    sessionDuration?: number;
    logoutReason: 'manual' | 'timeout' | 'forced' | 'expired';
  };

  constructor(
    userId: string,
    logoutReason: 'manual' | 'timeout' | 'forced' | 'expired',
    sessionId?: string,
    sessionDuration?: number,
    metadata?: Partial<EventMetadata>
  ) {
    const eventData = {
      userId,
      sessionId,
      sessionDuration,
      logoutReason,
    };

    super('UserLoggedOut', eventData, {
      ...metadata,
      userId: metadata?.userId ?? userId,
    });

    this.data = eventData;
  }

  protected validateEventData(data: Record<string, any>): void {
    super.validateEventData(data);

    if (!data.userId || typeof data.userId !== 'string') {
      throw new Error('UserLoggedOutEvent: userId is required and must be a string');
    }

    const validReasons = ['manual', 'timeout', 'forced', 'expired'];
    if (!validReasons.includes(data.logoutReason)) {
      throw new Error(`UserLoggedOutEvent: logoutReason must be one of ${validReasons.join(', ')}`);
    }
  }
}

/**
 * Event fired when a user updates their profile
 */
export class UserProfileUpdatedEvent extends DomainEvent {
  public readonly data: {
    userId: string;
    changedFields: string[];
    previousValues: Record<string, any>;
    newValues: Record<string, any>;
  };

  constructor(
    userId: string,
    changedFields: string[],
    previousValues: Record<string, any>,
    newValues: Record<string, any>,
    metadata?: Partial<EventMetadata>
  ) {
    const eventData = {
      userId,
      changedFields,
      previousValues,
      newValues,
    };

    super('UserProfileUpdated', eventData, {
      ...metadata,
      userId: metadata?.userId ?? userId,
    });

    this.data = eventData;
  }

  protected validateEventData(data: Record<string, any>): void {
    super.validateEventData(data);

    if (!data.userId || typeof data.userId !== 'string') {
      throw new Error('UserProfileUpdatedEvent: userId is required and must be a string');
    }

    if (!Array.isArray(data.changedFields)) {
      throw new Error('UserProfileUpdatedEvent: changedFields must be an array');
    }

    if (!data.previousValues || typeof data.previousValues !== 'object') {
      throw new Error('UserProfileUpdatedEvent: previousValues must be an object');
    }

    if (!data.newValues || typeof data.newValues !== 'object') {
      throw new Error('UserProfileUpdatedEvent: newValues must be an object');
    }
  }
}

/**
 * Event fired when a user follows another user
 */
export class UserFollowedEvent extends DomainEvent {
  public readonly data: {
    followerId: string;
    followedId: string;
    followedUserName: string;
    followerUserName: string;
  };

  constructor(
    followerId: string,
    followedId: string,
    followedUserName: string,
    followerUserName: string,
    metadata?: Partial<EventMetadata>
  ) {
    const eventData = {
      followerId,
      followedId,
      followedUserName,
      followerUserName,
    };

    super('UserFollowed', eventData, {
      ...metadata,
      userId: metadata?.userId ?? followerId,
    });

    this.data = eventData;
  }

  protected validateEventData(data: Record<string, any>): void {
    super.validateEventData(data);

    if (!data.followerId || typeof data.followerId !== 'string') {
      throw new Error('UserFollowedEvent: followerId is required and must be a string');
    }

    if (!data.followedId || typeof data.followedId !== 'string') {
      throw new Error('UserFollowedEvent: followedId is required and must be a string');
    }

    if (data.followerId === data.followedId) {
      throw new Error('UserFollowedEvent: followerId and followedId cannot be the same');
    }
  }
}

/**
 * Event fired when a user unfollows another user
 */
export class UserUnfollowedEvent extends DomainEvent {
  public readonly data: {
    followerId: string;
    unfollowedId: string;
    unfollowedUserName: string;
    followerUserName: string;
    followDuration?: number;
  };

  constructor(
    followerId: string,
    unfollowedId: string,
    unfollowedUserName: string,
    followerUserName: string,
    followDuration?: number,
    metadata?: Partial<EventMetadata>
  ) {
    const eventData = {
      followerId,
      unfollowedId,
      unfollowedUserName,
      followerUserName,
      followDuration,
    };

    super('UserUnfollowed', eventData, {
      ...metadata,
      userId: metadata?.userId ?? followerId,
    });

    this.data = eventData;
  }

  protected validateEventData(data: Record<string, any>): void {
    super.validateEventData(data);

    if (!data.followerId || typeof data.followerId !== 'string') {
      throw new Error('UserUnfollowedEvent: followerId is required and must be a string');
    }

    if (!data.unfollowedId || typeof data.unfollowedId !== 'string') {
      throw new Error('UserUnfollowedEvent: unfollowedId is required and must be a string');
    }

    if (data.followerId === data.unfollowedId) {
      throw new Error('UserUnfollowedEvent: followerId and unfollowedId cannot be the same');
    }
  }
}

/**
 * Event fired when a user's account is deactivated
 */
export class UserAccountDeactivatedEvent extends DomainEvent {
  public readonly data: {
    userId: string;
    deactivatedBy: string;
    reason: 'user_request' | 'policy_violation' | 'inactivity' | 'admin_action';
    details?: string;
  };

  constructor(
    userId: string,
    deactivatedBy: string,
    reason: 'user_request' | 'policy_violation' | 'inactivity' | 'admin_action',
    details?: string,
    metadata?: Partial<EventMetadata>
  ) {
    const eventData = {
      userId,
      deactivatedBy,
      reason,
      details,
    };

    super('UserAccountDeactivated', eventData, {
      ...metadata,
      userId: metadata?.userId ?? deactivatedBy,
    });

    this.data = eventData;
  }

  protected validateEventData(data: Record<string, any>): void {
    super.validateEventData(data);

    if (!data.userId || typeof data.userId !== 'string') {
      throw new Error('UserAccountDeactivatedEvent: userId is required and must be a string');
    }

    if (!data.deactivatedBy || typeof data.deactivatedBy !== 'string') {
      throw new Error('UserAccountDeactivatedEvent: deactivatedBy is required and must be a string');
    }

    const validReasons = ['user_request', 'policy_violation', 'inactivity', 'admin_action'];
    if (!validReasons.includes(data.reason)) {
      throw new Error(`UserAccountDeactivatedEvent: reason must be one of ${validReasons.join(', ')}`);
    }
  }
}