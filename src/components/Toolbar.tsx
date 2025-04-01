import { useState } from "react";
import { CursorArrowRaysIcon, UserPlusIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import EventBus, { Event } from "$/lib/eventsbus";
export type Tool = 'selection' | 'addUser' | 'addRelation';


export default function () {
  const [selectedTool, setSelectedTool] = useState<Tool>('selection');
  const [personSelected, setPersonSelected] = useState<boolean>(false);
  return <div id="toolbar-container">
    <button id="toolbar-use-selection" onClick={() => EventBus.emit(Event.Toolbar_Clicked_Selection, null)}>
      <CursorArrowRaysIcon className={"size-6 " + (selectedTool === "selection" ? "text-blue-500" : "")}></CursorArrowRaysIcon>
    </button>
    <button id="toolbar-add-person" onClick={() => EventBus.emit(Event.Toolbar_Clicked_AddPerson, null)}>
      <UserPlusIcon className={"size-6 " + (selectedTool === "addUser" ? "text-blue-500" : "")}></UserPlusIcon>
    </button>
    <button id="toolbar-add-related-person" disabled={!personSelected} onClick={() => EventBus.emit(Event.Toolbar_Clicked_AddRelation, null)}>
      <UserGroupIcon className={"size-6 " + (selectedTool === "addRelation" ? "text-blue-500" : "")}></UserGroupIcon>
    </button>
  </div>
}
