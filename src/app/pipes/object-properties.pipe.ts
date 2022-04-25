import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'objectProperties'})
export class ObjectPropertiesPipe implements PipeTransform {

    transform(value: any, args:string[]) : any {
        let properties = [];

        for (let property in value) {
            properties.push({property: property, value: value[property]});
        }

        return properties;
    }
}