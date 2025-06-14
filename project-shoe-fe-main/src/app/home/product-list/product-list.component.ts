import { Component, OnInit, inject, model, signal } from "@angular/core";
import { MenuItem } from "primeng/api";
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { RatingModule } from 'primeng/rating';
import { BasePageResponse, Brand, Category, ParamSearch, Product } from "../../@core/models/product.model";
import { FormControl, FormGroup, FormsModule } from "@angular/forms";
import { CurrencyPipe, DecimalPipe } from "@angular/common";
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ProductsOtherComponent } from "../products-other/products-other.component";
import { ImportModule } from "../../@themes/import.theme";
import { BaseInputComponent } from "../../@components/base-input/base-input.component";
import { BaseComponent } from "../../@core/base/base.component";
import { CategoryService } from "../../@services/category.service";
import { ImageUtil } from "../../@core/utils/image.util";
import { noImage } from "../../@core/constants/constant";
import { forkJoin, map } from "rxjs";
import { SupplierService } from "../../@services/supplier.service";
import { ProductService } from "../../@services/product.service";

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  imports: [
    BreadcrumbModule,
    RatingModule,
    FormsModule,
    DecimalPipe,
    CurrencyPipe,
    PaginatorModule,
    ProductsOtherComponent,
    ImportModule,
    BaseInputComponent
  ]
})
export class ProductListComponent extends BaseComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly supplierService = inject(SupplierService);
  private readonly productService = inject(ProductService);
  items = signal<MenuItem[]>([]);
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/home' };
  products = signal<Product[]>([]);
  rating = signal(1);
  first = signal(0);
  rows = signal(12);
  rowPerPageOptions = [12, 24, 36, 48, 60];
  productOther = signal<Product[]>([]);
  visible = false;
  form!: FormGroup<{
    name: FormControl<string | null>;
    brand: FormControl<string | null>;
    categories: FormControl<[] | null>;
    code: FormControl<string | null>;
    range: FormControl<number[] | null>;
  }>;
  min = signal(0);
  max = signal(0);
  categories = signal<Category[]>([]);
  suppliers = signal<Brand[]>([]);
  totalRecords = signal(0);
  rowsPerPageOptions = [12, 24, 36, 48];

  ngOnInit(): void {
    this.initForm();
    this.initData();
  }

  onPageChange($event: PaginatorState) {
    throw new Error('Method not implemented.');
  }

  initForm() {
    this.form = this.fb.group({
      name: new FormControl<string | null>(null),
      brand: new FormControl<string | null>(null),
      code: new FormControl<string | null>(null),
      categories: new FormControl<[] | null>(null),
      range: new FormControl<number[] | null>([0, 10000000]),
    });
  }

  initData() {
    this.rxSubscribe(this.breadcrumbService.getAsObervable(), (value: MenuItem[]) => {
      this.items.set(value);
    });
    this.rxSubscribe(
      forkJoin([
        this.categoryService.getAllCategory(),
        this.supplierService.getAllSupplier()
      ]),
      ([categoies, suppliers]) => {
        this.categories.set(categoies.map((o: Category) => {
          return {
            ...o,
            image: o.image ? ImageUtil.replaceUrl(o.image) : noImage
          }
        }));
        this.suppliers.set(suppliers);
      }
    );
    this.rxSubscribe(this.activatedRoute.queryParams, (params) => {
      const obj: ParamSearch = {
        page: this.first() + 1,
        size: this.rows(),
        name: params['name'],
        code: params['code'],
        categories: params['category'] ? [params['category']] : undefined,
        brands: params['brand'] ? [params['brand']] : undefined,
        min_cost: params['min'],
        max_cost: params['max'],
      }
      this.form.patchValue({
        name: obj.name,
        code: obj.code,
        range: [obj.min_cost || 0, obj.max_cost || 10000000],
      });
      this.rxSubscribe(this.productService.getProducts(obj), (result: BasePageResponse<Product>) => {
        this.products.set(result.data?.map(o => {
          return {
            ...o,
            images: o.images?.map(z => {
              return {
                ...z,
                attachment: z.attachment ? ImageUtil.replaceUrl(z.attachment) : noImage
              }
            })
          }
        }) || [])
        this.totalRecords.set(result.total || 0);
      })
    })
  }

  onSearchProduct() {
    this.visible = false;
    this.router.navigate([], {
      queryParams: {
        category: this.form.controls['categories'].value ?? null,
        name: this.form.controls['name'].value ?? null,
        code: this.form.controls['code'].value ?? null,
        brand: this.form.controls['brand'].value ?? null,
        min: this.form.controls['range'].value ? this.form.controls['range'].value[0] : null,
        max: this.form.controls['range'].value ? this.form.controls['range'].value[1] : null
      }
    })
  }
}
