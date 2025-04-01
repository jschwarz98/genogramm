import * as Types from "$/types";

function PersonNode(props: Types.PersonNode) {


  return <foreignObject id={props.id} x={props.position.x} y={props.position.y}>

    <div
      className="flex flex-col items-center align-middle place-content-between"
      style={{
        width: props.dimensions.width,
        height: props.dimensions.height,
        backgroundColor: props.backgroundColor,
        border: `${props.border.thickness} ${props.border.style} ${props.border.color}`,
      }}
    >
      <img src={props.iconUrl} />
      <p className="text-center">{props.name}</p>
    </div>
  </foreignObject>
}

export default PersonNode;
