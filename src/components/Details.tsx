import {Node, NodeType, PersonNode} from "$/types";
import {useEffect, useState} from "react";
import Bus, {Event} from "$/lib/event-bus";
import {Input} from "$/components/ui/input";
import {Label} from "$/components/ui/label";
import {Textarea} from "$/components/ui/textarea";


export default function Details() {
    const [node, setNode] = useState<Node>(null)
    const [flag, setFlag] = useState<boolean>(false)

    useEffect(() => {
        const setCurrentNode = (node: Node) => {
            setNode(node);
            setFlag(!flag);
        };
        Bus.on(Event.Node_Selected, setCurrentNode);

        return () => {
            Bus.off(Event.Node_Selected, setCurrentNode);
        }
    });


    return <div className="flex-grow rounded-sm bg-white p-2 overflow-y-scroll max-w-full">
        {(() => {
            switch (node?.type) {
                case NodeType.Person:
                    return Person(node as PersonNode, flag);
                default:
                    return <></>
            }
        })()}
    </div>
}


function Person(props: PersonNode, _flag: boolean) {
    return <div className={"flex flex-col gap-4"}>
        <div>
            <img
                src={props.iconUrl}
                alt={`picture or symbol of person ${props.name}`}
                className="w-full h-full object-contain"
            />


        </div>
        <div>
            <Label htmlFor="name" id="nameLabel" >Name:</Label>
            <Input name="name"
                   placeholder="..."
                   className="grow mt-1"
                   value={props.name}
                   onChange={e => {
                       Bus.emit(Event.Person_Attribute_Changed, {
                           id: props.id,
                           field: 'name',
                           value: e.target.value as string,
                       })
                   }}/>
        </div>
        <div>
            <Label htmlFor={"information"}>Informationen</Label>
            <Textarea name={"information"}
                      className={"mt-1"}
                      placeholder={"..."}
                      onChange={e => {
                Bus.emit(Event.Person_Attribute_Changed, {
                    id: props.id,
                    field: 'information',
                    value: e.target.value as string,
                })
            }}>

            </Textarea>
        </div>

    </div>
}