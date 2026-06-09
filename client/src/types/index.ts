export type UserRole = 'admin' | 'member';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  workspaces: string[] | IWorkspace[];
  isOnline: boolean;
  createdAt: string;
}

export interface IWorkspace {
  id: string;
  name: string;
  ownerId: string;
  members: string[] | IUser[];
  channels: string[] | IChannel[];
  inviteToken?: string;
  createdAt: string;
}

export interface IChannel {
  id: string;
  name: string;
  workspaceId: string;
  messages: string[] | IMessage[];
  createdAt: string;
}

export interface IMessage {
  id: string;
  senderId: string;
  channelId: string;
  content: string;
  timestamp: string;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
}

// Socket event payload type signatures
export interface SocketEventPayloads {
  'chat:message': {
    message: IMessage;
    senderName?: string;
  };
  'typing:start': {
    userId: string;
    userName: string;
    channelId: string;
  };
  'typing:stop': {
    userId: string;
    channelId: string;
  };
  'user:online': {
    userId: string;
    userName?: string;
  };
  'user:offline': {
    userId: string;
  };
}

// Helper types for client socket interactions
export type SocketEventName = keyof SocketEventPayloads;

export type SocketEventCallback<T extends SocketEventName> = (
  payload: SocketEventPayloads[T]
) => void;
