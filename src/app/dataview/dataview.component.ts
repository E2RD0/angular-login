import { Component, OnInit, ViewChild} from '@angular/core';
import { ProductService} from '../_services/productservice';
import { Product } from '../_models/product';
import {ConfirmationService, MessageService, SelectItem} from 'primeng/api';
import {FilterService,  PrimeNGConfig } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { DataView } from 'primeng/dataview';

@Component({
  selector: 'app-dataview',
  templateUrl: './dataview.component.html',
  styleUrls: ['./dataview.component.css'],
  providers: [DatePipe, MessageService,ConfirmationService, ProductService]
})

export class DataviewComponent implements OnInit {
    productDialog: boolean;

    products: Product[];

    product: Product;

    submitted: boolean;

    sortOptions: SelectItem[];

    filterRangeDate;

    sortOrder: number;

    sortField: string;

    @ViewChild('dv') dv: DataView;


    constructor(private filterService: FilterService, private primengConfig: PrimeNGConfig, private datepipe: DatePipe, private productService: ProductService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

    ngOnInit() {
        this.productService.getProducts().then(data => this.products = data);

        this.primengConfig.ripple = true;

        this.filterService.register(
            "isBetweenDateRange",
            (value, range): boolean => {
                if (range) {
                    range = range.split(",");
                    range = range.filter(item => item != '')
                    for (let i = 0; i < range.length; i++) {
                            range[i] = new Date(range[i]);
                    }
                    value = new Date(value +"T00:00:00");
                    console.log("Fecha: "+  value);
                    return this.filterService.filters.between(value, range); 
                }
                return true;

            }
          );
    }

    filter(){
        this.dv.filter(this.filterRangeDate.toString(),'isBetweenDateRange');
    }
    resetFilter(){
        this.filterRangeDate = "";
        this.filter();
    }
    

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
        console.log(this.filterRangeDate);
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
                        this.products = [...this.products];  
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
                        this.products = [...this.products];
                        this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Datos ingresados', life: 2000});
                    },
                    error=>{
                        this.messageService.add({severity:'error', summary: error, detail:''});
                });
          }
          this.products = [...this.products];
          this.productDialog = false;
          this.product = {};
          this.resetFilter();
      }
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
    
    onSortChange(event) {
        let value = event.value;

        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        }
        else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }
}
