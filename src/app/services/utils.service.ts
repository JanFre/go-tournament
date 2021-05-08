import { ListIndicator } from './../entities/list-indicator';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  isNumber(value: string | number): boolean {
    return value != null && value !== '' && !isNaN(Number(value.toString()));
  }

  winList(list: string): number[] {
    return this.getList(list, ListIndicator.Win);
  }

  lossList(list: string): number[] {
    return this.getList(list, ListIndicator.Loss);
  }

  private getList(list: string, indicator: ListIndicator): number[] {
    list = list.replace(/\s{2,}/g, ' ').trim();
    const oponents = list.split(' ');
    const resList: number[] = [];
    for (const elem of oponents) {
      if (elem.substr(elem.length - 1) === indicator) {
        resList.push(Number(elem.substr(0, elem.length - 1)));
      }
    }
    return resList;
  }
}
