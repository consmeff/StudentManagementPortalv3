import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        Powered By 
        <a href="https://activpulsespectra.com.ng" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">ActivPulse Spectra</a>
    </div>`
})
export class AppFooter {}
