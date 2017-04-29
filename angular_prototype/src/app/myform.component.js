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
var core_1 = require('@angular/core');
var hero_1 = require('./models/hero');
var MyformComponent = (function () {
    function MyformComponent() {
        this.powers = ['Really Smart', 'Super Flexible',
            'Super Hot', 'Weather Changer'];
        this.model = new hero_1.Hero(18, 'Dr IQ', this.powers[0], 'Chuck Overstreet');
        this.submitted = false;
    }
    MyformComponent.prototype.onSubmit = function () { this.submitted = true; };
    Object.defineProperty(MyformComponent.prototype, "diagnostic", {
        get: function () { return JSON.stringify(this.model); },
        enumerable: true,
        configurable: true
    });
    MyformComponent.prototype.ngOnInit = function () { };
    MyformComponent.prototype.newHero = function () {
        this.model = new hero_1.Hero(42, "", "");
    };
    MyformComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'myform',
            templateUrl: "./myform.component.html",
        }), 
        __metadata('design:paramtypes', [])
    ], MyformComponent);
    return MyformComponent;
}());
exports.MyformComponent = MyformComponent;
//# sourceMappingURL=myform.component.js.map