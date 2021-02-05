import { Component, OnInit } from '@angular/core';
import { Product } from '../_models/product';
import { ProductService } from '../_services/productservice';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
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
      let deletedProducts = [];
      this.confirmationService.confirm({
          message: '¿Estás seguro de que quieres eliminar las entradas seleccionadas?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.selectedProducts.forEach(product => {
                this.productService.deleteProduct(product)
                .subscribe(
                    ()=>{
                        deletedProducts.push(product);
                        this.products = this.products.filter(val => val.id !== product.id);
                        this.product = {};
                    },
                    error=>{
                        this.messageService.add({severity:'error', summary: error, detail:''})
                    },
                    () => console.log("observable complete")
                    )
            });
            /*console.log("Productos eliminados: " + deletedProducts);
            console.log("Productos seleccionados: " + this.selectedProducts);
            if(this.selectedProducts == deletedProducts){
                console.log("test")
                this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Entradas eliminadas', life: 3000});
            }*/
            this.selectedProducts = [];
            //this.products = this.products.filter(val => !deletedProducts.includes(val));
          }
      });
  }

  editProduct(product: Product) {
      this.product = {...product};
      this.productDialog = true;
  }

  deleteProduct(product: Product) {
      this.confirmationService.confirm({
          message: '¿Estás seguro que quieres eliminar ' + product.name + '?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.productService.deleteProduct(product)
            .subscribe(
                ()=>{
                    this.products = this.products.filter(val => val.id !== product.id);
                    this.product = {};
                    this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Entrada eliminada', life: 2000});
                },
                error=>{
                    this.messageService.add({severity:'error', summary: error, detail:''});
            });
              
          }
      });
  }

  hideDialog() {
      this.productDialog = false;
      this.submitted = false;
  }
  
    saveProduct(product: Product) {
        this.product = product;
        this.submitted = true;
        if (this.product.name !=undefined && this.product.name.trim() !='' && this.product.quantity>0 && this.product.startDate!=null) {
            this.product.startDate = this.datepipe.transform(this.product.startDate , 'yyyy-MM-dd')  

            if (this.product.id) {
                this.productService.updateProduct(this.product)
                .subscribe(
                    data=>{
                        this.product = data;
                        this.products[this.findIndexById(this.product.id)] = this.product;                
                        this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Entrada actualizada', life: 2000});
                    },
                    error=>{
                        this.messageService.add({severity:'error', summary: error, detail:''});
                });
            }
            else {
                this.productService.createProduct(this.product)
                .subscribe(
                    data=>{
                        this.product = data;
                        this.products.push(this.product);
                        this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Datos ingresados', life: 2000});
                    },
                    error=>{
                        this.messageService.add({severity:'error', summary: error, detail:''});
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
