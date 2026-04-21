import { firstValueFrom } from "rxjs";
 
import { Injectable, inject, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
 
import { ApplicationService } from "./application.service";
import { RegistrantDataDTO } from "../data/application/registrantdatadto";
import { PreRegistrationDataDTO } from "../data/application/preregistrationdatadto";
import { CountryDTO, LGA, StatesDTO } from "../data/application/location.dto";
import { TUploadFile } from "../data/application/transformer.dto";
import { AuthSessionStore } from "../store/auth-session.store";
 

@Injectable({
  providedIn: 'root'
})
export class RegStoreService {
  private authSessionStore = inject(AuthSessionStore);

  private readonly _regData = signal<RegistrantDataDTO | null>(null);
  readonly regData = this._regData.asReadonly();
  public regData$ = toObservable(this._regData);

  private readonly _preRegData = signal<PreRegistrationDataDTO | null>(null);
  readonly preRegData = this._preRegData.asReadonly();
  public preRegData$ = toObservable(this._preRegData);

  private readonly _countryData = signal<CountryDTO | null>(null);
  readonly countryData = this._countryData.asReadonly();
  public countryData$ = toObservable(this._countryData);

  private readonly _stateData = signal<StatesDTO | null>(null);
  readonly stateData = this._stateData.asReadonly();
  public stateData$ = toObservable(this._stateData);

  private readonly _lgaData = signal<LGA[] | null>(null);
  readonly lgaData = this._lgaData.asReadonly();
  public lgaData$ = toObservable(this._lgaData);

  private readonly _uploadFile = signal<TUploadFile | null>(null);
  readonly uploadFile = this._uploadFile.asReadonly();
  public uploadFile$ = toObservable(this._uploadFile);
  


  constructor(private appservice: ApplicationService) {
     this.dataIntitialization();

  }

  setRegData(payload: RegistrantDataDTO) {
    this.setUploadFile(payload);
    this._regData.set(payload);
  }
  setpreRegData(payload: PreRegistrationDataDTO) {
    
    this._preRegData.set(payload);
  }
  setCountryData(payload: CountryDTO) {
    this._countryData.set(payload);
  }
  setStateData(payload: StatesDTO) {
    this._stateData.set(payload);
  }

  setLGAData(payload: LGA[]) {
    this._lgaData.set(payload);
  }

  // setUploadFile(payload:RegistrantDataDTO){
  //  if(payload.data !=null && payload.data !=undefined){
  //   let _u:TUploadFile={
  //     certificateofbirth: payload.data!.certificate_of_birth,
  //     olevels: payload.data!.o_level_result.map((m)=>m.file),
  //     passport: payload.data!.passport_photo,
  //     origin:payload.data!.certificate_of_origin,
  //     utme: payload.data!.utme_result.file
  //   };
  //   this._uploadFile.next(_u);
  //  }
  // }
  setUploadFile(payload: RegistrantDataDTO) {
    if (payload.data != null && payload.data != undefined) {
      let _u: TUploadFile = {
        certificateofbirth: payload.data!.certificate_of_birth!,
        olevels: payload.data!.o_level_result?.map((m) => m.file) || [],
        passport: payload.data!.passport_photo!,
        origin: payload.data!.certificate_of_origin!,
        utme: payload.data!.utme_result?.file!
      };
      this._uploadFile.set(_u);
    }
  }

  async dataIntitialization(): Promise<boolean> {

    let result = false;
    let app_no = this.authSessionStore.applicationNo() || "";
    if (app_no != "") {
      await firstValueFrom(this.appservice.registratantData(app_no))
        .then(async (data) => {
          console.log("fetching app data ............................");
          // console.log(data);

          this.setRegData(data);
          result = true;

          
        })
        .catch((err) => {
          result = false;
        })
    }

    return result;
  }


}
