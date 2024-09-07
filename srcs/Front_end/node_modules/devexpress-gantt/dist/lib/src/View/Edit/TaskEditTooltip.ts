import { DomUtils } from "@devexpress/utils/lib/utils/dom";
import { Task } from "../../Model/Entities/Task";
import { TooltipSettings } from "../Settings/InitSettings/TooltipSettings";
import { ElementTextHelperCultureInfo } from "../Utils/ElementTextHelperCultureInfo";
import { ITaskAreaContainer } from "../../Interfaces/ITaskAreaContainer";

export class TaskEditTooltip {
    public static CLASSNAMES = {
        TASK_EDIT_PROGRESS_STATUS: "dx-gantt-task-edit-tooltip",
        TASK_EDIT_TOOLTIP_DEFAULT: "dx-gantt-task-edit-tooltip-default",
        TASK_EDIT_TASK_TITLE: "dx-gantt-task-title",
        TASK_EDIT_PROGRESS_STATUS_TIME: "dx-gantt-status-time",
        TASK_EDIT_TOOLTIP_ARROW_BEFORE: "dx-gantt-task-edit-tooltip-before",
        TASK_EDIT_TOOLTIP_ARROW_AFTER: "dx-gantt-task-edit-tooltip-after"

    }

    public static defaultArrowHeight: number = 5;
    public static defaultHeightOffset: number = 15;

    private parentElement: HTMLElement;
    private _baseElement: HTMLElement;
    private defaultTooltip: HTMLElement;
    private timerId: number;
    private cultureInfo: ElementTextHelperCultureInfo;
    public tooltipSettings: TooltipSettings;

    constructor(parentElement: HTMLElement, tooltipSettings: TooltipSettings, cultureInfo: ElementTextHelperCultureInfo) {
        this.parentElement = parentElement;
        this.cultureInfo = cultureInfo;
        this.tooltipSettings = tooltipSettings;
    }

    private get baseElement(): HTMLElement {
        if(!this._baseElement)
            this.createTooltipContainer();
        return this._baseElement;
    }

    private get headerHeight(): number {
        return this.tooltipSettings.getHeaderHeight;
    }
    private get taskAreaContainer(): ITaskAreaContainer {
        return this.tooltipSettings.getTaskAreaContainer();
    }

    private get taskTooltipContentTemplate(): (container: HTMLElement, model: any, ...args) => any {
        return this.tooltipSettings.getTaskTooltipContentTemplate;
    }

    private get taskProgressTooltipContentTemplate(): (container: HTMLElement, model: any, ...args) => void {
        return this.tooltipSettings.getTaskProgressTooltipContentTemplate;
    }

    private get taskTimeTooltipContentTemplate(): (container: HTMLElement, model: any, ...args) => void {
        return this.tooltipSettings.getTaskTimeTooltipContentTemplate;
    }

    private destroyTemplate(container: HTMLElement): void {
        this.tooltipSettings.destroyTemplate(container);
    }

    private formatDate(date: Date): string {
        return this.tooltipSettings.formatDate(date);
    }

    private createTooltipContainer() {
        this._baseElement = document.createElement("DIV");
        this._baseElement.className = TaskEditTooltip.CLASSNAMES.TASK_EDIT_PROGRESS_STATUS;
        this.parentElement.appendChild(this._baseElement);
    }

    private setDefaultTooltip(task: Task): void {
        this.defaultTooltip = document.createElement("DIV");
        this.defaultTooltip.className = TaskEditTooltip.CLASSNAMES.TASK_EDIT_TOOLTIP_DEFAULT;
        const titleWrapper = document.createElement("DIV");
        titleWrapper.className = TaskEditTooltip.CLASSNAMES.TASK_EDIT_TASK_TITLE;
        const title = document.createElement("SPAN");
        titleWrapper.appendChild(title);
        this.defaultTooltip.appendChild(titleWrapper);
        title.innerText = task.title;
        this.defaultTooltip.appendChild(this.getTimeContent(task.start, task.end));

        if(!isNaN(task.progress)) {
            const progressElement = document.createElement("DIV");
            progressElement.className = TaskEditTooltip.CLASSNAMES.TASK_EDIT_PROGRESS_STATUS_TIME;
            const progressTitle = document.createElement("SPAN");
            const progressValue = document.createElement("SPAN");
            progressElement.appendChild(progressTitle);
            progressElement.appendChild(progressValue);
            this.defaultTooltip.appendChild(progressElement);
            progressTitle.innerText = (this.cultureInfo.progress ? this.cultureInfo.progress : "Progress") + ": ";
            progressValue.innerText = task.progress + "%";
        }
        this.baseElement.appendChild(this.defaultTooltip);
    }
    private setDefaultProgressTooltip(progress: number) {
        this.defaultTooltip = document.createElement("DIV");
        this.defaultTooltip.className = TaskEditTooltip.CLASSNAMES.TASK_EDIT_TOOLTIP_DEFAULT;
        this.defaultTooltip.innerText = progress + "%";
        this.baseElement.appendChild(this.defaultTooltip);
    }
    private setDefaultTimeTooltip(start: Date, end: Date) {
        this.defaultTooltip = document.createElement("DIV");
        this.defaultTooltip.className = TaskEditTooltip.CLASSNAMES.TASK_EDIT_TOOLTIP_DEFAULT;
        this.defaultTooltip.appendChild(this.getTimeContent(start, end));
        this.baseElement.appendChild(this.defaultTooltip);
    }

    public showInfo(task: Task, posX: number, delay: number = 0): void {
        const tooltipTemplateFunction = this.taskTooltipContentTemplate;
        this.destroyTemplate(this.baseElement);

        if(tooltipTemplateFunction)
            tooltipTemplateFunction(this.baseElement, task,
                () => { this.showTooltip(posX, false, delay); });
        else {
            this.setDefaultTooltip(task);
            this.showTooltip(posX, false, delay);
        }
    }
    public showProgress(progress: number, posX: number): void {
        const tooltipTemplateFunction = this.taskProgressTooltipContentTemplate;
        this.destroyTemplate(this.baseElement);
        if(tooltipTemplateFunction)
            tooltipTemplateFunction(this.baseElement, { progress: progress },
                () => { this.showTooltip(posX); });
        else {
            this.setDefaultProgressTooltip(progress);
            this.show(posX);
        }
    }
    public showTime(start: Date, end: Date, posX: number): void {
        const tooltipTemplateFunction = this.taskTimeTooltipContentTemplate;
        this.destroyTemplate(this.baseElement);
        if(tooltipTemplateFunction)
            tooltipTemplateFunction(this.baseElement, { start: start, end: end },
                () => { this.showTooltip(posX); });
        else {
            this.setDefaultTimeTooltip(start, end);
            this.show(posX);
        }
    }

    public showTooltip(posX: number, autoHide: boolean = true, delay: number = 0): void {
        if(this.baseElement?.innerHTML) {
            const showInfoFunc = () => {
                this.show(posX, autoHide);
            };
            if(delay)
                this.timerId = setTimeout(showInfoFunc, delay);
            else
                showInfoFunc();
        }
    }

    public show(posX: number, autoHide: boolean = true): void {
        this.defaultTooltip?.classList.remove(TaskEditTooltip.CLASSNAMES.TASK_EDIT_TOOLTIP_ARROW_AFTER);
        this.defaultTooltip?.classList.remove(TaskEditTooltip.CLASSNAMES.TASK_EDIT_TOOLTIP_ARROW_BEFORE);
        this.baseElement.style.display = "block";

        const leftPosition = this.getLeftPosition(posX);
        const isShowingUnder = this.needToShowUnderParent();
        const topPosition = this.getTopPosition(isShowingUnder);
        const arrowClassName = isShowingUnder ? TaskEditTooltip.CLASSNAMES.TASK_EDIT_TOOLTIP_ARROW_AFTER : TaskEditTooltip.CLASSNAMES.TASK_EDIT_TOOLTIP_ARROW_BEFORE;
        this.defaultTooltip?.classList.add(arrowClassName);

        this.baseElement.style.left = leftPosition + "px";
        this.baseElement.style.top = topPosition + "px";
        if(autoHide) {
            if(this.timerId)
                clearTimeout(this.timerId);
            this.timerId = setTimeout(() => {
                this.hide();
            }, 1500);
        }
    }
    public hide(): void {
        this.baseElement.style.display = "none";
        this.destroyTemplate(this.baseElement);
        clearTimeout(this.timerId);
    }
    private getTimeContent(start: Date, end: Date): HTMLElement {
        const timeElement = document.createElement("TABLE");
        timeElement.className = TaskEditTooltip.CLASSNAMES.TASK_EDIT_PROGRESS_STATUS_TIME;
        const body = document.createElement("TBODY");
        timeElement.appendChild(body);
        const startEl = document.createElement("TR");
        const startTitle = document.createElement("TD");
        const startValue = document.createElement("TD");
        const endEl = document.createElement("TR");
        const endTitle = document.createElement("TD");
        const endValue = document.createElement("TD");

        startEl.appendChild(startTitle);
        startEl.appendChild(startValue);
        endEl.appendChild(endTitle);
        endEl.appendChild(endValue);
        body.appendChild(startEl);
        body.appendChild(endEl);

        startTitle.innerText = (this.cultureInfo.start ? this.cultureInfo.start : "Start") + ": ";
        startValue.innerText = this.formatDate(start);
        endTitle.innerText = (this.cultureInfo.end ? this.cultureInfo.end : "End") + ": ";
        endValue.innerText = this.formatDate(end);

        return timeElement;
    }
    private getLeftPosition(absolutePosition: number): number {
        const parentAbsoluteX = DomUtils.getAbsolutePositionX(this.parentElement);
        let leftPosition = absolutePosition - parentAbsoluteX - 2 * TaskEditTooltip.defaultArrowHeight;
        if(this.taskAreaContainer) {
            const rightBorder = DomUtils.getAbsolutePositionX(this.taskAreaContainer.getElement()) + this.taskAreaContainer.getWidth();
            const rightOverflow = absolutePosition + this.baseElement.clientWidth - rightBorder;
            if(rightOverflow > 0)
                leftPosition -= rightOverflow;
        }
        return leftPosition;
    }
    private getTopPosition(isShowingUnder: boolean): number {
        return isShowingUnder ? this.parentElement.clientHeight + TaskEditTooltip.defaultArrowHeight : -this.baseElement.clientHeight - TaskEditTooltip.defaultArrowHeight;
    }
    private needToShowUnderParent(): boolean {
        const absolutePositionY = DomUtils.getAbsolutePositionY(this.parentElement);
        const distanceToScreenTop = absolutePositionY - this.headerHeight - DomUtils.getDocumentScrollTop() - TaskEditTooltip.defaultHeightOffset;
        const taskAreaContScrollTop = this.taskAreaContainer?.scrollTop || 0;
        const distanceToTaskAreaTop = this.parentElement.offsetTop - taskAreaContScrollTop;
        return this.baseElement.clientHeight > distanceToScreenTop || this.baseElement.clientHeight > distanceToTaskAreaTop;
    }
}
