import { Component } from '@angular/core';
import { TECHNICAL_SUPPORT_MESSAGE } from '../../constants/support.constants';

@Component({
    standalone: true,
    selector: 'app-footer',
    templateUrl: './app.footer.html'
})
export class AppFooter {
    readonly technicalSupportMessage = TECHNICAL_SUPPORT_MESSAGE;
}
