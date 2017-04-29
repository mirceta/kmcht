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
var FormtestComponent = (function () {
    function FormtestComponent() {
        this.messages = [];
    }
    FormtestComponent.prototype.ngOnInit = function () { };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], FormtestComponent.prototype, "messages", void 0);
    FormtestComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'form-test',
            template: "\n    <div class=\"panel panel-primary\">\n        <div class=\"panel-body\">\n            <ul>\n            <li *ngFor=\"let mess of messages\">\n                {{mess}}\n            </li>\n            </ul>\n        </div>\n    </div>\n    "
        }), 
        __metadata('design:paramtypes', [])
    ], FormtestComponent);
    return FormtestComponent;
}());
exports.FormtestComponent = FormtestComponent;
//# sourceMappingURL=formtest.component.js.map