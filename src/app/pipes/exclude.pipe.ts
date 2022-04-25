import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'exclude'})
export class ExcludePipe implements PipeTransform {

    transform(dataObject: any, dataType: any, excludeList: string[]) {
        if (dataType == 'object') {
            return this.transformObject(dataObject, excludeList);
        } else if (dataType == 'array') {
            return this.transformArray(dataObject, excludeList);
        }
    }

    private transformObject(dataObject: any, excludeList: string[]) {
        let filteredDataObject = {};
        for (let key in dataObject) {
            if (! excludeList.includes(key)) {
                filteredDataObject[key] = dataObject[key];
            }
        }
        return filteredDataObject;
    }

    private transformArray(dataArray: any[], excludeList: string[]) {
        let filteredDataArray = [];

        for (let dataObject of dataArray) {
            let newObject = {};
            for (let key in dataObject) {
                if (! excludeList.includes(key)) {
                    newObject[key] = dataObject[key];
                }
            }
            filteredDataArray.push(newObject);
        }

        return filteredDataArray;
    }

}