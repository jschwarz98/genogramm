import {Node, NodeType, PersonNode} from "$/types";
import {useEffect, useState} from "react";
import Bus, {Event} from "$/lib/eventsbus";


export default function Details() {
    const [node, setNode] = useState<Node>(null)

    useEffect(() => {
        const setCurrentNode = (node: Node) => {
            setNode(node);
        };
        Bus.on(Event.NodeSelected, setCurrentNode);

        return () => {
            Bus.off(Event.NodeSelected, setCurrentNode);
        }
    });


    return <div>
        {(() => {
            switch(node?.type) {
                case NodeType.Person: return Person(node as PersonNode);
                default: return <></>
            }
        })()}
    </div>
}



function Person(props: PersonNode) {
    return <>
        <div>ImagePicker</div>
        <div>Name Inputs</div>
        <div>Title Inputs</div>
        <div>Information Textfield</div>

    </>
}