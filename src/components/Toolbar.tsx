import {useState} from "react";
import {ImageDown, MousePointer2, User, Users} from "lucide-react";
import EventBus, {Event} from "$/lib/event-bus";
import {Button} from "$/components/ui/button"
import TooltipWrapper from "$/components/ui/TooltipWrapper";

export type Tool = 'selection' | 'addUser' | 'addRelation';

function getColorClass(selectedTool: Tool, neededTool: Tool): string {
    if (neededTool === selectedTool) {
        return "text-blue-500"
    }
    return "";
}

export default function () {
    const [selectedTool, setSelectedTool] = useState<Tool>('selection');
    const [personSelected, setPersonSelected] = useState<boolean>(false);

    // derived states...
    const addRelationButtonDisabled = !personSelected;
    const relationButtonTooltip = "Beziehung hinzufügen" + (addRelationButtonDisabled ? " - Keine Person ausgewählt" : "")
    //...
    return <div id="toolbar-container" className="flex flex-wrap gap-1">
        <TooltipWrapper content={<p>Auswahl</p>}>
            <Button variant="outline" size="icon" onClick={() => {
                setSelectedTool('selection');
                EventBus.emit(Event.Toolbar_Clicked_Selection, null)
            }}>
                <MousePointer2 className={getColorClass(selectedTool, "selection")}></MousePointer2>
            </Button>
        </TooltipWrapper>

        <TooltipWrapper content={<p>Person hinzufügen</p>}>
            <Button variant="outline" size="icon" onClick={() => {
                setSelectedTool('addUser');
                EventBus.emit(Event.Toolbar_Clicked_AddPerson, null)
            }}>
                <User className={getColorClass(selectedTool, "addUser")}></User>
            </Button>
        </TooltipWrapper>

        <TooltipWrapper content={<p>{relationButtonTooltip}</p>}>
            <Button variant="outline" size="icon" disabled={addRelationButtonDisabled} onClick={() => {
                setSelectedTool('addRelation');
                EventBus.emit(Event.Toolbar_Clicked_AddRelation, null)
            }}>
                <Users className={getColorClass(selectedTool, "addRelation")}></Users>
            </Button>
        </TooltipWrapper>

        <hr className="w-full"/>

        <TooltipWrapper content={<p>Genogramm exportieren</p>}>
            <Button variant="outline" size="icon" onClick={() => EventBus.emit(Event.Toolbar_Clicked_Export, null)}>
                <ImageDown className="text-red-500"></ImageDown>
            </Button>
        </TooltipWrapper>

    </div>
}
