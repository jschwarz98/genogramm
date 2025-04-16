import {Node, NodeAttributeChangedEvent, PersonNode} from "$/types";

export enum Event {
    Toolbar_Clicked_Selection = "Toolbar_Clicked_Selection",
    Toolbar_Clicked_AddPerson = "Toolbar_Clicked_AddPerson",
    Toolbar_Clicked_AddRelation = "Toolbar_Clicked_AddRelation",
    Toolbar_Clicked_Export = "Toolbar_Clicked_Export",
    Toolbar_Reset = "Toolbar_Reset",

    Canvas_Clicked_Canvas = "Canvas_Clicked_Cavas",
    CanvasElement_Clicked_Person = "CanvasElement_Clicked_Person",

    Node_Selected = "Node_Selected",
    Person_Attribute_Changed = "Person_Attribute_Changed",
}

export type EventPayload = {
    [Event.Toolbar_Clicked_Selection]: null;
    [Event.Toolbar_Clicked_AddPerson]: null;
    [Event.Toolbar_Clicked_AddRelation]: null;
    [Event.Toolbar_Clicked_Export]: null;
    [Event.Toolbar_Reset]: null;


    [Event.CanvasElement_Clicked_Person]: string;
    [Event.Canvas_Clicked_Canvas]: null;

    [Event.Node_Selected]: Node
    [Event.Person_Attribute_Changed]: NodeAttributeChangedEvent<PersonNode, any>
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

    // overloads to allow for the generic yet still typesafe use of objects and their keys
    emit<K extends keyof PersonNode>(event: Event.Person_Attribute_Changed, payload: NodeAttributeChangedEvent<PersonNode, K>): void;
    // basic payload interface
    emit<K extends keyof EventPayload>(event: K, payload: EventPayload[K]): void;
    emit<K extends keyof EventPayload>(event: K, payload: EventPayload[K]): void {
        if (!this.#eventSubscribers[event]) {
            return;
        }
        // Assert type so that TS knows h accepts payload of type EventMap[K]
        (this.#eventSubscribers[event] as EventHandler<EventPayload[K]>[]).forEach(h => h(payload));
    }
}

const bus = new Bus();

export default bus;
