"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
//Example: customer.service.ts
var http_1 = require("@angular/http");
require('rxjs/Rx');
var Observable_1 = require("rxjs/Observable");
var core_1 = require('@angular/core');
var AppService = (function () {
    function AppService(http) {
        this.http = http;
    }
    AppService.prototype.getHeaders = function () {
        var headers = new http_1.Headers();
        headers.append('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8');
        headers.append('Accept-Encoding', 'gzip, deflate, sdch, br');
        headers.append('Accept-Language', 'en-US,en;q=0.8');
        headers.append('Cache-Control', 'max-age=0');
        headers.append('Connection', 'keep-alive');
        headers.append('Host', 'localhost:8081');
        headers.append('Upgrade-Insecure-Requests', '1');
        headers.append('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko)' +
            'Chrome/58.0.3029.81 Safari/537.36');
        return headers;
    };
    AppService.prototype.getCheatsheets = function () {
        return this.http.get('http://localhost:8081/getCheatsheets', this.getHeaders())
            .map(function (res) {
            console.log('Got a response');
            return JSON.stringify(res.json());
        })
            .catch(function () { return Observable_1.Observable.throw('error'); });
    };
    AppService.prototype.getKnowledgePieces = function () {
        return this.http.get('http://localhost:8081/getKnowledgePieces', this.getHeaders())
            .map(function (res) {
            console.log('Got a response');
            return JSON.stringify(res.json());
        })
            .catch(function () { return Observable_1.Observable.throw('error'); });
    };
    AppService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], AppService);
    return AppService;
}());
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map