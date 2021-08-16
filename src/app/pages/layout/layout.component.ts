import { Component, OnInit } from '@angular/core';
import { Menu } from 'src/app/_model/menu';
import { LoginService } from 'src/app/_service/login.service';
import { MenuService } from 'src/app/_service/menu.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  menus: Menu[];

  constructor(
    private menuService: MenuService,
    public loginService : LoginService
  ) { }

  ngOnInit(): void {
    this.menuService.getMenuCambio().subscribe(data => {
      console.log(data);
      this.menus = data;
    });
  }
}
