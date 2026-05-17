import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss'
})
export class SearchInputComponent {
  readonly placeholder = input<string>('Search');
  readonly model = input<string>('');
  readonly modelChange = output<string>();
  readonly searchTrigger = output<void>();

  emitSearch(): void {
    this.searchTrigger.emit();
  }
}
