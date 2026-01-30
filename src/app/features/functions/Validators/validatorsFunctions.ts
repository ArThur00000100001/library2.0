import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ValidateLastWord(lastWord: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) return null;
        const valueControl = control.value;

        return valueControl.endsWith(lastWord) ? null : { lastWord: true };
    };
}
