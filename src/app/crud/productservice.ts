import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
        .pipe(map(data => data));
    }
}