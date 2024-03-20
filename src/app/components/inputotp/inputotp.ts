import { CommonModule } from '@angular/common';
import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, EventEmitter, Input, NgModule, Output, QueryList, TemplateRef, ViewEncapsulation, forwardRef } from '@angular/core';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { InputTextModule } from '../inputtext/inputtext';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Nullable } from 'primeng/ts-helpers';
import { InputOtpChangeEvent } from './inputotp.interface';

export const INPUT_OTP_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputOtp),
    multi: true
};
/**
 * Input Otp is used to enter one time passwords.
 * @group Components
 */
@Component({
    selector: 'p-inputOtp',
    template: `
        <ng-container *ngFor="let i of getRange(length); trackBy: trackByFn">
            <ng-container *ngIf="!inputTemplate">
                <input
                    type="text"
                    pInputText
                    [maxLength]="1"
                    [type]="inputType"
                    class="p-inputotp-input"
                    [inputmode]="inputMode"
                    [variant]="variant"
                    [readonly]="readonly"
                    [disabled]="disabled"
                    [invalid]="invalid"
                    [tabindex]="tabindex"
                    [unstyled]="unstyled"
                    (input)="onInput($event, i - 1)"
                    (focus)="onInputFocus($event)"
                    (blur)="onInputBlur($event)"
                    (paste)="onPaste($event)"
                    (keydown)="onKeyDown($event)"
                />
            </ng-container>
            <ng-container *ngIf="inputTemplate">
                <ng-container *ngTemplateOutlet="inputTemplate; context: { events: getTemplateEvents(i - 1), attrs: getTemplateAttrs(i - 1), index: i }"> </ng-container>
            </ng-container>
        </ng-container>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'p-inputotp p-component'
    },
    providers: [INPUT_OTP_VALUE_ACCESSOR]
})
export class InputOtp implements AfterContentInit {
    /**
     * When present, it specifies that the component should have invalid state style.
     * @group Props
     */
    @Input() invalid: boolean = false;
    /**
     * When present, it specifies that the component should be disabled.
     * @group Props
     */

    @Input() disabled: boolean = false;
    /**
     * When present, it specifies that an input field is read-only.
     * @group Props
     */
    @Input() readonly: boolean = false;
    /**
     * Specifies the input variant of the component.
     * @group Props
     */
    @Input() variant: string | null = null;
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    @Input() tabindex: number | null = null;
    /**
     * Number of characters to initiate.
     * @group Props
     */
    @Input() length: number = 4;
    /**
     * Mask pattern.
     * @group Props
     */
    @Input() mask: boolean = false;
    /**
     * When present, it specifies that an input field is integer-only.
     * @group Props
     */
    @Input() integerOnly: boolean = false;
    /**
     * Callback to invoke on value change.
     * @group Emits
     */
    @Output() onChange: EventEmitter<InputOtpChangeEvent> = new EventEmitter<InputOtpChangeEvent>();
    /**
     * Callback to invoke when the component receives focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    @Output() onFocus: EventEmitter<Event> = new EventEmitter();
    /**
     * Callback to invoke when the component loses focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    @Output() onBlur: EventEmitter<Event> = new EventEmitter();

    @ContentChildren(PrimeTemplate) templates: Nullable<QueryList<PrimeTemplate>>;

    inputTemplate: Nullable<TemplateRef<any>>;

    tokens: any = [];

    onModelChange: Function = () => {};

    onModelTouched: Function = () => {};

    value: any;

    get inputMode(): string {
        return this.integerOnly ? 'number' : 'text';
    }

    get inputType(): string {
        return this.mask ? 'password' : 'text';
    }

    constructor(public cd: ChangeDetectorRef) {}

    getTemplateAttrs(index) {
        return {
            value: this.tokens[index]
        };
    }

    getTemplateEvents(index) {
        return {
            input: (event) => this.onInput(event, index),
            keydown: (event) => this.onKeyDown(event),
            focus: (event) => this.onFocus.emit(event),
            blur: (event) => this.onBlur.emit(event),
            paste: (event) => this.onPaste(event)
        };
    }

    onInput(event, index) {
        this.tokens[index] = event.target.value;
        this.updateModel(event);

        if (event.inputType === 'deleteContentBackward') {
            this.moveToPrev(event);
        } else if (event.inputType === 'insertText' || event.inputType === 'deleteContentForward') {
            this.moveToNext(event);
        }
    }

    updateModel(event: any) {
        const newValue = this.tokens.join('');
        this.onModelChange(newValue);

        this.onChange.emit({
            originalEvent: event,
            value: newValue
        });
    }

    writeValue(value: any): void {
        this.value = value;
        this.cd.markForCheck();
    }

    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }

    moveToPrev(event) {
        let prevInput = this.findPrevInput(event.target);

        if (prevInput) {
            prevInput.focus();
            prevInput.select();
        }
    }

    moveToNext(event) {
        let nextInput = this.findNextInput(event.target);

        if (nextInput) {
            nextInput.focus();
            nextInput.select();
        }
    }

    findNextInput(element) {
        let nextElement = element.nextElementSibling;

        if (!nextElement) return;

        return nextElement.nodeName === 'INPUT' ? nextElement : this.findNextInput(nextElement);
    }

    findPrevInput(element) {
        let prevElement = element.previousElementSibling;

        if (!prevElement) return;

        return prevElement.nodeName === 'INPUT' ? prevElement : this.findPrevInput(prevElement);
    }

    onInputFocus(event) {
        event.target.select();
        this.onFocus.emit(event);
    }

    onInputBlur(event) {
        this.onBlur.emit(event);
    }

    onKeyDown(event) {
        const keyCode = event.keyCode;

        switch (keyCode) {
            case 37:
                this.moveToPrev(event);
                event.preventDefault();

                break;

            case 38:
            case 40:
                event.preventDefault();

                break;

            case 8:
                if (event.target.value.length === 0) {
                    this.moveToPrev(event);
                    event.preventDefault();
                }

                break;

            case 39:
                this.moveToNext(event);
                event.preventDefault();

                break;

            default:
                if (this.integerOnly && !(event.keyCode >= 48 && event.keyCode <= 57)) {
                    event.preventDefault();
                }

                break;
        }
    }
    onPaste(event) {
        let paste = event.clipboardData.getData('text');

        if (paste.length) {
            let pastedCode = paste.substring(0, this.length + 1);

            if (!this.integerOnly || !isNaN(pastedCode)) {
                this.tokens = pastedCode.split('');
                this.updateModel(event);
            }
        }

        event.preventDefault();
    }

    getRange(n: number): number[] {
        return Array.from({ length: n }, (_, index) => index + 1);
    }

    ngAfterContentInit() {
        (this.templates as QueryList<PrimeTemplate>).forEach((item) => {
            switch (item.getType()) {
                case 'input':
                    this.inputTemplate = item.template;
                    break;
                default:
                    this.inputTemplate = item.template;
                    break;
            }
        });
    }
    trackByFn(index: number) {
        return index;
    }
}

@NgModule({
    imports: [CommonModule, SharedModule, InputTextModule],
    exports: [InputOtp, SharedModule],
    declarations: [InputOtp]
})
export class InputOtpModule {}
