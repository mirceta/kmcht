//Example: customer.service.ts
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs/Observable";
import { Injectable } from '@angular/core';

@Injectable()
export class AppService {

    getHeaders(): Headers {
        let headers = new Headers();
        headers.append('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8');
        headers.append('Accept-Encoding', 'gzip, deflate, sdch, br');
        headers.append('Accept-Language', 'en-US,en;q=0.8');
        headers.append('Access-Control-Allow-Origin', '');
        headers.append('Cache-Control', 'max-age=0');
        headers.append('Connection', 'keep-alive');
        headers.append('Host', 'localhost:8081');
        headers.append('Upgrade-Insecure-Requests', '1');
        headers.append('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko)' +
                                     'Chrome/58.0.3029.81 Safari/537.36');
        return headers;
    }

    constructor(private http: Http) { }
    


    getCheatsheets() {
        return this.http.get('http://localhost:8081/getCheatsheets', this.getHeaders())
                    .map((res: Response) => {
                        console.log('Got a response');
                        return JSON.stringify(res.json());
                    })
                    .catch(() => Observable.throw('error'));
    }

    getKnowledgePieces() {
        return this.http.get('http://localhost:8081/getKnowledgePieces', this.getHeaders())
                    .map((res: Response) => {
                        console.log('Got a response');
                        return JSON.stringify(res.json());
                    })
                    .catch(() => Observable.throw('error'));
    }
}