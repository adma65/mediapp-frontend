import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs/operators';
import { SignosVitales } from 'src/app/_model/signosVitales';
import { SignosVitalesService } from 'src/app/_service/signos_vitales.service';
import * as moment from 'moment';

@Component({
  selector: 'app-signos-vitales',
  templateUrl: './signos-vitales.component.html',
  styleUrls: ['./signos-vitales.component.css']
})
export class SignosVitalesComponent implements OnInit {


  dataSource: MatTableDataSource<SignosVitales> = new MatTableDataSource();
  displayedColumns: string[] = ['idSignosVitales', 'paciente', 'temperatura', 'pulso', 'ritmoCardiaco', 'fecha', 'acciones'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  cantidad: number = 0;

  constructor(
    private signosVitalesService: SignosVitalesService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.signosVitalesService.getMensajeCambio().subscribe(texto => {
      this.snackBar.open(texto, 'AVISO', { duration: 2000, horizontalPosition: "right", verticalPosition: "top" });
    });

    this.signosVitalesService.getSignosVitalesCambio().subscribe(data => {
      this.crearTabla(data);
    });

    this.signosVitalesService.listarPageable(0, 10).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
    });

    /*this.pacienteService.listar().subscribe(data => {
      this.crearTabla(data);
    });*/
  }

  eliminar(id: number) {
    this.signosVitalesService.eliminar(id).pipe(switchMap(() => {
      return this.signosVitalesService.listar();
    }))
      .subscribe(data => {
        this.crearTabla(data);
      });

  }

  crearTabla(data: SignosVitales[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  filtrar(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  mostrarMas(e: any){
    this.signosVitalesService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
    });
  }

  formatFecha(fecha: string){
    return moment(fecha).format('YYYY-MM-DD');
  }
}
