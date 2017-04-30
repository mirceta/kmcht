//Example: customer.service.ts
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { Injectable } from '@angular/core';

@Injectable()
export class AppService {
    constructor(private http: Http) { }
    
    getCustomers() {
        return this.http.get('api/customers')
                    .map((response: Response) => 
                        <Customer[]>response.json().data) 
                    .catch(this.handleError());

private handleError(error: Response) {
console.error(error);
return Observable.throw(error.json().error || ’Service error’);
}
: void
: string : boolean
}