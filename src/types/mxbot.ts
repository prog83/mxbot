export interface Event {
  type: string;
  sender: string;
  content: {
    msgtype: string;
    body: string;
  };
}
