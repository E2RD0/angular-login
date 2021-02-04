import { Component, OnInit } from '@angular/core';
import { Product } from './product';
import { ProductService } from './productservice';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styles: [`
        :host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }
    `],
  styleUrls: ['./crud.component.css'],
  providers: [DatePipe, MessageService,ConfirmationService, ProductService]
})
export class CrudComponent implements OnInit{ 
  productDialog: boolean;

  products: Product[];

  product: Product;

  selectedProducts: Product[];

  submitted: boolean;

  constructor(private datepipe: DatePipe, private productService: ProductService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
      this.productService.getProducts().then(data => this.products = data);
  }

  openNew() {
      this.product = {};
      this.submitted = false;
      this.productDialog = true;
  }

  deleteSelectedProducts() {
      this.confirmationService.confirm({
          message: '¿Estás seguro de que quieres eliminar las entradas seleccionadas?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.products = this.products.filter(val => !this.selectedProducts.includes(val));
              this.selectedProducts = null;
              this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Entradas eliminadas', life: 3000});
          }
      });
  }

  editProduct(product: Product) {
      this.product = {...product};
      this.product.startDate = this.product.startDate.join('-');
      this.productDialog = true;
  }

  deleteProduct(product: Product) {
      this.confirmationService.confirm({
          message: '¿Estás seguro que quieres eliminar ' + product.name + '?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.products = this.products.filter(val => val.id !== product.id);
              this.product = {};
              this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Entrada eliminada', life: 3000});
          }
      });
  }

  hideDialog() {
      this.productDialog = false;
      this.submitted = false;
  }
  
  saveProduct() {
      this.submitted = true;

      if (this.product.name !=undefined && this.product.name.trim() !='' && this.product.quantity>0 && this.product.startDate!=null) {
          if (this.product.id) {
              this.products[this.findIndexById(this.product.id)] = this.product;                
              this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Entrada actualizada', life: 3000});
          }
          else {
              this.product.startDate = this.datepipe.transform(this.product.startDate , 'yyyy-MM-dd')
                this.productService.createProduct(this.product)
                .subscribe(
                data=>{
                  console.log(data);
                  this.product = data;
                  this.products.push(this.product);
                  this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Datos ingresados', life: 3000});
                },
                error=>{
                  if (error.status==422) {
                    this.messageService.add({severity:'warn', summary:'Formato de datos incorrecto', detail:''});
                  }
                  else{
                    this.messageService.add({severity:'error', summary:'Error al ingresar datos', detail:''});
                  }
                });
          }

          this.products = [...this.products];
          this.productDialog = false;
          this.product = {};
      }
  }

  findIndexById(id: string): number {
      let index = -1;
      for (let i = 0; i < this.products.length; i++) {
          if (this.products[i].id === id) {
              index = i;
              break;
          }
      }

      return index;
  }
}
