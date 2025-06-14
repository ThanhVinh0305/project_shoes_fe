import { Component, input } from '@angular/core';
import { ImportModule } from '../../@themes/import.theme';
import { Product } from '../../@core/models/product.model';
import { noImage } from '../../@core/constants/constant';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-products-other',
  standalone: true,
  imports: [
    ImportModule,
    RouterModule
  ],
  templateUrl: './products-other.component.html',
  styleUrl: './products-other.component.scss'
})
export class ProductsOtherComponent {
  noImage = noImage;
  products = input<Product[]>([]);
}
