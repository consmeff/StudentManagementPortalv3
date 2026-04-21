import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { TAcademicHistory, TNextOfKinDTO, TOLevelResult, TPersonalDetailDTO, TUploadFile } from '../../data/application/transformer.dto';
import { formstepDTO } from '../../data/application/form.dto';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private readonly _formsteps = signal<formstepDTO>({
    academicValid: false,
    docuplodValid: false,
    nextofkinValid: false,
    personalinfoValid: false
  });
  readonly formsteps = this._formsteps.asReadonly();
  public formsteps$ = toObservable(this._formsteps);

  private readonly _personalform = signal<TPersonalDetailDTO | null>(null);
  readonly personalform = this._personalform.asReadonly();
  public personalform$ = toObservable(this._personalform);
 
  private readonly _nextofkinform = signal<TNextOfKinDTO | null>(null);
  readonly nextofkinform = this._nextofkinform.asReadonly();
  public nextofkinform$ = toObservable(this._nextofkinform);

  private readonly _academicHistory = signal<TAcademicHistory[] | null>(null);
  readonly academicHistory = this._academicHistory.asReadonly();
  public academicHistory$ = toObservable(this._academicHistory);

  private readonly _olevelResult = signal<TOLevelResult[] | null>(null);
  readonly olevelResult = this._olevelResult.asReadonly();
  public olevelResult$ = toObservable(this._olevelResult);

  private readonly _uploadFile = signal<TUploadFile | null>(null);
  readonly uploadFile = this._uploadFile.asReadonly();
  public uploadFile$ = toObservable(this._uploadFile);



  constructor() { }

  setFormSteps(form:formstepDTO){
    this._formsteps.set({ ...form });
  }

  setPersonalFormData(payload:TPersonalDetailDTO){
    if(payload !=null){
      this._personalform.set({ ...payload });
    }
  }

  setNextOfKinFormData(payload:TNextOfKinDTO){
    if(payload !=null){
      this._nextofkinform.set({ ...payload });
    }
  }

  setAcademicHistoryFormData(payload:TAcademicHistory[]){
    if(payload !=null){
      this._academicHistory.set([...payload]);
    }
  }
 
  setOlevelResultFormData(payload:TOLevelResult[]){
    if(payload !=null){
      this._olevelResult.set([...payload]);
    }
  }
 
  setuploadFileFormData(payload:TUploadFile){
    if(payload !=null){
      this._uploadFile.set({
        certificateofbirth: payload.certificateofbirth,
        olevels: [...(payload.olevels || [])],
        passport: payload.passport,
        origin: payload.origin,
        utme: payload.utme
      });
    }
  }

  
}
