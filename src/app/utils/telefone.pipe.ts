import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telefone'
})
export class TelefonePipe implements PipeTransform {

  transform(tel: String) {
    let formatado = '';

    if (tel) {
      const value = tel.toString().replace(/\D/g, '');

      if (value.length > 12) {
        formatado = value.replace(/(\d{2})?(\d{2})?(\d{5})?(\d{4})/, '+$1 ($2) $3-$4');
      } else if (value.length > 11) {
        formatado = value.replace(/(\d{2})?(\d{2})?(\d{4})?(\d{4})/, '+$1 ($2) $3-$4');
      } else if (value.length > 10) {
        formatado = value.replace(/(\d{2})?(\d{5})?(\d{4})/, '($1) $2-$3');
      } else if (value.length > 9) {
        formatado = value.replace(/(\d{2})?(\d{4})?(\d{4})/, '($1) $2-$3');
      } else if (value.length > 5) {
        formatado = value.replace(/^(\d{2})?(\d{4})?(\d{0,4})/, '($1) $2-$3');
      } else if (value.length > 1) {
        formatado = value.replace(/^(\d{2})?(\d{0,5})/, '($1) $2');
      } else {
        if (tel !== '') { formatado = value.replace(/^(\d*)/, '($1'); }
      }
    }

    return formatado;
  }
}