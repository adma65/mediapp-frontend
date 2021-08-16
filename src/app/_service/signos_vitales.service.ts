import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Paciente } from '../_model/paciente';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { GenericService } from './generic.service';
import { SignosVitales } from '../_model/signosVitales';

@Injectable({
  providedIn: 'root'
})
export class SignosVitalesService extends GenericService<SignosVitales>{

  private signosCambio: Subject<SignosVitales[]> = new Subject<SignosVitales[]>();
  private mensajeCambio: Subject<string> = new Subject<string>();  

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/signos_vitales`);
  }

  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  getSignosVitalesCambio(){
    return this.signosCambio.asObservable();
  }

  setSignosVitalesCambio(lista: SignosVitales[]){
    this.signosCambio.next(lista);
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(texto: string){
    this.mensajeCambio.next(texto);
  }
}
