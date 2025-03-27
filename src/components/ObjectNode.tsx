import * as Types from "$/types";
import IconNode from "$/components/IconNode";

function ObjectNode(props: Types.ObjectNodes) {
  if (props.type === "arrow") {
    return <p>arrow</p>;
  }

  switch (props.type) {
    case "icon":
      return <IconNode {...(props as Types.IconNode)} />
    case "text":
      props as Types.TextNode;
      return <p>text</p>
    case "icon-text":
      props as Types.IconTextNode;
      return <p>icon-text</p>
    default:
      return <p>unknown node</p>;
  }

}

export default ObjectNode;
