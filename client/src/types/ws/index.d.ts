
declare namespace WSPayload {
  interface MessageUpdate {
    message: Entity.Message;
  }
  interface MessageDelete {
    message: Entity.Message;
  }

  interface ChannelCreate {
    channel: Entity.Channel;
  }

  interface ChannelDelete{
    channel: Entity.Channel;
  }
}