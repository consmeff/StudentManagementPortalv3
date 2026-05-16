import { Component, computed, input, output } from '@angular/core';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'info'
  | 'danger'
  | 'neutral'
  | 'muted';

type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly outline = input(false);
  readonly type = input<ButtonType>('button');
  readonly disabled = input(false);
  readonly fullWidth = input(false);
  readonly iconClass = input('');
  readonly iconPosition = input<'left' | 'right'>('left');
  readonly forwardedClass = input('', { alias: 'class' });

  readonly buttonClick = output<MouseEvent>();

  readonly buttonClass = computed(() => {
    const resolvedVariant = this.variant() === 'outline' ? 'primary' : this.variant();
    const classes = [
      'app-btn',
      `btn--${resolvedVariant}`,
      this.outline() || this.variant() === 'outline' ? 'btn--outline' : 'btn--solid'
    ];

    if (this.fullWidth()) {
      classes.push('btn--full');
    }

    if (this.disabled()) {
      classes.push('btn--disabled');
    }

    const customClass = this.forwardedClass().trim();
    if (customClass.length > 0) {
      classes.push(customClass);
    }

    return classes.join(' ');
  });

  handleClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }
    this.buttonClick.emit(event);
  }
}
