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
                          onMouseDown={() => Bus.emit(Event.Node_Selected, props)}>
        <div className="flex flex-col items-center justify-between h-full p-1 overflow-hidden" style={containerStyle}>
            {props.iconUrl
                ? <div className="w-full flex-grow overflow-hidden">
                    <img
                        src={props.iconUrl}
                        alt={`picture or symbol of person ${props.name}`}
                        className="w-full h-full object-contain"
                    />
                </div>
                : null}

            {props.name
                ? <p className="mt-1 overflow-hidden text-center content-center" style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    height: '3em',
                    lineHeight: '1.25em',
                    wordBreak: 'break-word'
                }}>{props.name}</p>
                : null
            }

        </div>
    </foreignObject>
}

export default Person;
