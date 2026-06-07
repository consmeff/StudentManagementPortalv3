import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';

import { TraceabilityModule } from '../../shared/traceability.module';
import { AuthSessionStore } from '../../store/auth-session.store';

@Component({
    selector: 'app-logout',
    standalone: true,
    imports: [TraceabilityModule],
    providers: [],
    styles: `
   
    `,
    template: `
     
    `
})
export class Logout {
    
 
    route = inject(Router)

    authSessionStore = inject(AuthSessionStore);

    constructor(private fb: FormBuilder) {
      
    }
}
