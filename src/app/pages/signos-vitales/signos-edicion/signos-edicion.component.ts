import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Paciente } from 'src/app/_model/paciente';
import { SignosVitales } from 'src/app/_model/signosVitales';
import { PacienteService } from 'src/app/_service/paciente.service';
import { SignosVitalesService } from 'src/app/_service/signos_vitales.service';
import * as moment from 'moment';

@Component({
  selector: 'app-signos-edicion',
  templateUrl: './signos-edicion.component.html',
  styleUrls: ['./signos-edicion.component.css']
})
export class SignosEdicionComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  id: number = 0;
  edicion: boolean = false;
  pacientes$: Observable<Paciente[]>;
  idPacienteSeleccionado: number;
  pacienteEdicion: Paciente;

  constructor(
    private route: ActivatedRoute,
    private signosVitalesService: SignosVitalesService,
    private router: Router,
    private pacienteService: PacienteService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmoCardiaco': new FormControl(''),
      'fecha': new FormControl('')
    });

    this.pacientes$ = this.pacienteService.listar(); //.subscribe(data => this.pacientes = data);

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.edicion) {
      this.signosVitalesService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id': new FormControl(data.idSignosVitales),
          'temperatura': new FormControl(data.temperatura),
          'pulso': new FormControl(data.pulso),
          'ritmoCardiaco': new FormControl(data.ritmoCardiaco),
          'fecha': new FormControl(data.fecha)
        });
        this.pacienteEdicion = data.paciente;
      });
    }
  }

  operar() {

    console.log(this.idPacienteSeleccionado);
    if(!this.edicion && this.idPacienteSeleccionado == undefined){
        this.signosVitalesService.setMensajeCambio("Elija un paciente");
    }else{

      let signosVitales = new SignosVitales();
      if(this.edicion){
        signosVitales.paciente = this.pacienteEdicion;
      }else{
        let paciente = new Paciente();
        paciente.idPaciente = this.idPacienteSeleccionado;
        signosVitales.paciente = paciente;
      }

      signosVitales.idSignosVitales = this.form.value['id'];
      signosVitales.pulso = this.form.value['pulso'];
      signosVitales.ritmoCardiaco = this.form.value['ritmoCardiaco'];
      signosVitales.temperatura = this.form.value['temperatura'];
      signosVitales.fecha = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
  
      if (this.edicion) {
        //PRACTICA NO IDEAL
        //MODIFICAR
        this.signosVitalesService.modificar(signosVitales).subscribe(() => {
          this.signosVitalesService.listar().subscribe(data => {
            this.signosVitalesService.setSignosVitalesCambio(data);
            this.signosVitalesService.setMensajeCambio('SE MODIFICO');
          });
        });
      } else {
        //PRACTICA IDEAL
        //REGISTRAR
        this.signosVitalesService.registrar(signosVitales).pipe(switchMap(() => {
          return this.signosVitalesService.listar();
        }))
        .subscribe(data => {
          this.signosVitalesService.setSignosVitalesCambio(data);
          this.signosVitalesService.setMensajeCambio('SE REGISTRO');
        });
      }

      this.router.navigate(['/pages/signos']);
    }
  }
}
