import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../_models/product';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  ngOnInit(): void {
  }
  @Input() product: Product;
  _display: boolean;

  @Input() get display(): boolean {
    return this._display;
  }

  set display(value: boolean) {
      //console.log('set display ' + value)
      this._display = value;
      this.onDisplayChange.emit(this._display);
  }

  @Output() onDisplayChange = new EventEmitter<boolean>();

  @Output() onClose = new EventEmitter<boolean>();
  @Output() onSave = new EventEmitter<Product>();

  hide(e: any) {
      this.onClose.emit(this._display);
  }
  save() {
    this.onSave.emit(this.product);
  }
  

}
