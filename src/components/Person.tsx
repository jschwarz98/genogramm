import * as Types from "$/types";
import Bus, {Event} from "$/lib/event-bus";

function Person(props: Types.PersonNode) {
    const containerStyle = {
        maxHeight: props.dimensions.height,
        backgroundColor: props.backgroundColor,
        border: `${props.border?.thickness} ${props.border?.style} ${props.border?.color}`,
    };

    return <foreignObject id={props.id}
                          x={props.position.x}
                          y={props.position.y}
                          width={props.dimensions.width}
                          height={props.dimensions.height}
                          onMouseDown={() => Bus.emit(Event.NodeSelected, props)}>
        <div className="flex flex-col items-center justify-between h-full p-1 overflow-hidden" style={containerStyle}>
            {props.iconUrl ? <>
                    <div className="w-full flex-grow overflow-hidden">
                        <img
                            src={props.iconUrl}
                            alt={`picture or symbol of person ${props.name}`}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <p className="mt-1 text-center">{props.name}</p>
                </>
                : <p>{props.name}</p>
            }
        </div>
    </foreignObject>
}

export default Person;
