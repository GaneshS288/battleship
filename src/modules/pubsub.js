export class PubSub {
    static Subscribers = {}

    static subscribe(event, subscriber) {
        if (this.Subscribers[event] === undefined)
            this.Subscribers[event] = [subscriber];
        else 
        this.Subscribers[event] = [...this.Subscribers[event], subscriber];
    }

    static unsubscribe(event, subscriber) {
        this.Subscribers[event] = this.Subscribers[event].filter((sub) => sub !== subscriber);
    }

    static publish(event, payload) {
        this.Subscribers[event].forEach(subscriber => subscriber(payload));
    }
}