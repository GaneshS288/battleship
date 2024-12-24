import { jest, describe, test, expect } from "@jest/globals";
import { PubSub } from "../modules/pubsub.js";

describe("pubsub", () => {
  test("stores subscriber functions", () => {
    const subscriberFunction = jest.fn();
    PubSub.subscribe("store subscriber", subscriberFunction);

    expect(
      PubSub.Subscribers["store subscriber"].includes(subscriberFunction)
    ).toBe(true);
  });

  test("unsubscribes a function", () => {
    const unsubscriberFunction = jest.fn();
    PubSub.subscribe("store unsubscriber", unsubscriberFunction);
    PubSub.unsubscribe("store unsubscriber", unsubscriberFunction);

    expect(
      PubSub.Subscribers["store unsubscriber"].includes(unsubscriberFunction)
    ).toBe(false);
  });

  test("publishing event calls subscribers", () => {
    const subscriberFunction = jest.fn();
    PubSub.subscribe("publish test", subscriberFunction);
    PubSub.publish("publish test", "hello");

    expect(subscriberFunction.mock.calls[0][0]).toBe("hello");
    expect(subscriberFunction.mock.calls.length).toBe(1);
  });
});
