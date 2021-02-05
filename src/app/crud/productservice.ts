import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';

import { Product } from './product';

@Injectable()
export class ProductService {

    constructor(private http: HttpClient) { }

    apiURL = "http://backdev-workflow.gesoftcorp.com/api/gesoft-workflow/tests";
    headers: HttpHeaders = new HttpHeaders({
        "Content-Type": "application/json"
    });

    getProducts() {
        return this.http.get<any>(this.apiURL)
        .toPromise()
        .then(res => <Product[]>res)
        .then(data => { return data; });
    }
    createProduct(product: Product){
        return this.http.post<Product>(this.apiURL, JSON.stringify(product), { headers: this.headers })
        .pipe(map(data => data),catchError(error => this.errorHandler(error, 'Error al ingresar los datos')));
    }
    updateProduct(product: Product){
        return this.http.put<Product>(this.apiURL, JSON.stringify(product), { headers: this.headers })
        .pipe(map(data => data), catchError(error => this.errorHandler(error, 'Error al actualizar los datos')));
    }
    deleteProduct(product: Product){
        return this.http.delete(`${this.apiURL}/${product.id}`)
        .pipe(catchError(error => this.errorHandler(error, `Error al eliminar ${product.name}`, 'Error al eliminar entrada')));
    }
    
    errorHandler(error, mensaje?, mensaje422?) {
        console.log(error);
        let errorMessage = '';
        if (error.error.status==422) {
            errorMessage = mensaje422 ? mensaje422: 'Formato de datos incorrecto';
          }
        else{
            errorMessage = mensaje? mensaje: 'Error al ejecutar operación';
        }
        return throwError(errorMessage);
     }
    
}