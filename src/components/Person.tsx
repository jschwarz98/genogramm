import * as Types from "$/types";
import Bus, {Event} from "$/lib/eventsbus";
function Person(props: Types.PersonNode) {
    return <foreignObject id={props.id}
                          x={props.position.x}
                          y={props.position.y}
                          width={props.dimensions.width}
                          height={props.dimensions.height}
                          onMouseDown={() => {
                              Bus.emit(Event.NodeSelected, props)
                          }}>

        <div className="h-full flex flex-col items-center align-middle place-content-between"
             style={{
                 backgroundColor: props.backgroundColor,
                 border: `${props.border.thickness} ${props.border.style} ${props.border.color}`,
             }}
        >
            {props.iconUrl ? <img src={props.iconUrl} alt={"picture or symbol of person " + props.name}/> : null}
            <p className="text-center">{props.name}</p>
        </div>
    </foreignObject>
}

export default Person;
