import {Node} from "$/types";

export enum Event {
  Toolbar_Clicked_Selection = "Toolbar_Clicked_Selection",
  Toolbar_Clicked_AddPerson = "Toolbar_Clicked_AddPerson",
  Toolbar_Clicked_AddRelation = "Toolbar_Clicked_AddRelation",
  Canvas_Clicked_Canvas = "Canvas_Clicked_Cavas",
  CanvasElement_Clicked_Person = "CanvasElement_Clicked_Person",
  NodeSelected = "NodeSelected",
}

export type EventPayload = {
  [Event.Toolbar_Clicked_Selection]: null;
  [Event.Toolbar_Clicked_AddPerson]: null;
  [Event.Toolbar_Clicked_AddRelation]: null;
  [Event.CanvasElement_Clicked_Person]: string;
  [Event.Canvas_Clicked_Canvas]: null;
  [Event.NodeSelected]: Node
}
type EventHandler<T> = (payload: T) => void;

type EventSubscribers = {
  [K in keyof EventPayload]?: Array<EventHandler<EventPayload[K]>>;
}


interface EventBus {
  on<K extends keyof EventPayload>(event: K, handler: EventHandler<EventPayload[K]>): void;
  off<K extends keyof EventPayload>(event: K, handler: EventHandler<EventPayload[K]>): void;
  emit<K extends keyof EventPayload>(event: K, payload: EventPayload[K]): void;
}

class Bus implements EventBus {
  #eventSubscribers: EventSubscribers = {};

  on<K extends keyof EventPayload>(event: K, handler: EventHandler<EventPayload[K]>): void {
    if (!this.#eventSubscribers[event]) {
      // Cast the empty array to the proper type for this event
      this.#eventSubscribers[event] = [];
    }
    // Type assertion ensures that push gets a correctly typed handler
    (this.#eventSubscribers[event]).push(handler);
  }

  off<K extends keyof EventPayload>(event: K, handler: EventHandler<EventPayload[K]>): void {
    if (!this.#eventSubscribers[event]) {
      return;
    }
    // Again, assert the type for the filter operation
    this.#eventSubscribers[event] = (this.#eventSubscribers[event])
      .filter(h => h !== handler);
  }

  emit<K extends keyof EventPayload>(event: K, payload: EventPayload[K]): void {
    console.log("emitting event", event, payload)
    if (!this.#eventSubscribers[event]) {
      return;
    }
    // Assert type so that TS knows h accepts payload of type EventMap[K]
    (this.#eventSubscribers[event] as EventHandler<EventPayload[K]>[]).forEach(h => h(payload));
  }
}

const bus = new Bus();

export default bus;
