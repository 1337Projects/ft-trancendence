import { isDefined } from "@devexpress/utils/lib/utils/common";
import { DataObject } from "./DataObject";
import { TaskType } from "./Enums";

const invalidDateMillseconds = -8000000000000000;

export class Task extends DataObject {
    start: Date;
    end: Date;
    duration: Date;
    description: string;
    owner: any;
    parentId: string;
    rawParentId: any;
    progress: number;
    taskType: TaskType;
    title: string;
    customFields: any;
    expanded: boolean;
    color: string;

    constructor() {
        super();
        this.start = null;
        this.end = null;
        this.duration = null;
        this.description = "";
        this.parentId = null;
        this.title = "";
        this.owner = null;
        this.progress = 0;
        this.taskType = null;
        this.customFields = { };
        this.expanded = true;
        this.color = "";
    }
    public get normalizedProgress(): number {
        return Math.max(Math.min(this.progress, 100), 0);
    }
    assignFromObject(sourceObj: any): void {
        if(isDefined(sourceObj)) {
            super.assignFromObject(sourceObj);
            this.owner = sourceObj.owner;
            this.parentId = isDefined(sourceObj.parentId) ? String(sourceObj.parentId) : null;
            this.rawParentId = sourceObj.parentId;
            this.description = sourceObj.description as string;
            this.title = sourceObj.title as string;
            this.start = typeof sourceObj.start === "string" ? new Date(sourceObj.start) : sourceObj.start as Date || this.createInvalidDate();
            this.end = typeof sourceObj.end === "string" ? new Date(sourceObj.end) : sourceObj.end as Date || this.createInvalidDate();
            this.duration = sourceObj.duration as Date;
            this.progress = sourceObj.progress as number;
            this.taskType = sourceObj.taskType as TaskType;
            if(isDefined(sourceObj.expanded))
                this.expanded = !!sourceObj.expanded;
            if(isDefined(sourceObj.color))
                this.color = sourceObj.color as string;
            this.assignCustomFields(sourceObj.customFields);
        }
    }

    assignCustomFields(sourceObj: any): void {
        if(!sourceObj) return;

        for(const property in sourceObj) {
            if(!Object.prototype.hasOwnProperty.call(sourceObj, property))
                continue;
            this.customFields[property] = sourceObj[property];
        }
    }

    isMilestone(): boolean {
        return this.start.getTime() === this.end.getTime();
    }

    getDuration(): number {
        return this.end.getTime() - this.start.getTime();
    }

    public isValidStart() : boolean { return this.isValidTaskaDte(this.start); }
    public isValidEnd() : boolean { return this.isValidTaskaDte(this.end); }

    isValid(): boolean {
        return this.isValidStart() && this.isValidEnd();
    }

    private createInvalidDate(): Date { return new Date(invalidDateMillseconds); }
    private isValidTaskaDte(value: Date | null) {
        return !!value && value.getTime() !== invalidDateMillseconds;
    }
}
