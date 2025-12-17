import { noImage } from './../../@core/constants/constant';
import { ImageUtil } from './../../@core/utils/image.util';
import { Component, OnInit, inject, model, signal } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { BasePageResponse, Product } from '../../@core/models/product.model';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { ImportModule } from '../../@themes/import.theme';
import { BaseComponent } from '../../@core/base/base.component';
import { map, of, switchMap } from 'rxjs';
import { ProductService } from '../../@services/product.service';
import { ProductsOtherComponent } from "../products-other/products-other.component";
import { AddItem, CartItem } from '../../@core/models/cart-item.model';
import { CommentService } from '../../@services/comment.service';
import { Comment, CreateCommentBody } from '../../@core/models/comment.model';
import { BaseInputComponent } from "../../@components/base-input/base-input.component";

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  imports: [
    GalleriaModule,
    FormsModule,
    ImportModule,
    ProductsOtherComponent,
    BaseInputComponent
],
})
export class ProductComponent extends BaseComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly commentService = inject(CommentService);
  product = signal<Product>({});
  images = signal<string[]>([]);
  productSell = signal<Product[]>([]);
  comments = signal<Comment[]>([]);
  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];
  isActive: number | undefined = undefined;
  quantity = model(1);
  id?: number;
  noImage = noImage;
  form!: FormGroup<{
    star: FormControl<number | null>;
    comment: FormControl<string | null>;
  }>;
  isEditComment = signal(false);
  itemEdit?: Comment;

  ngOnInit(): void {
    this.initForm();
    this.initData();
  }

  initForm() {
    this.form = this.fb.group({
      star: new FormControl<number | null>(null),
      comment: new FormControl<string | null>(null)
    });
  }

  initData() {
    this.rxSubscribe(this.activatedRoute.queryParams.pipe(
      map(params => params['id']),
      switchMap(id => {
        if (id) {
          this.id = id;
          this.initComment(id);
          return this.productService.getProductById(id);
        }
        return of(undefined);
      })
    ), (product: Product | undefined) => {
      if (product) {
        // Nếu backend chưa trả về gender_name, map từ gender_id
        if (!product.gender_name && product.gender_id !== undefined && product.gender_id !== null) {
          product.gender_name = this.mapGenderIdToName(product.gender_id);
        }
        console.log('Product data:', product);
        console.log('Color:', product.color);
        console.log('Gender name:', product.gender_name);
        console.log('Gender ID:', product.gender_id);
      }
      this.product.set(product || {});
      this.images.set(product?.images?.map(o => {
        return o.attachment ? ImageUtil.replaceUrl(o.attachment) : noImage
      }) || []);
    });
    this.rxSubscribe(this.productService.getProducts({ page: 1, size: 4 }), (result: BasePageResponse<Product>) => {
      this.productSell.set(result.data?.map(o => {
        return {
          ...o,
          images: o.images?.map(z => {
            return {
              ...z,
              attachment: z.attachment ? ImageUtil.replaceUrl(z.attachment) : noImage
            }
          })
        }
      }) || []);
    })
  }

  onAddCart() {
    if (!this.currentUserBase) {
      this.rxSubscribe(this.confirmDialog.showDialog({
        confirmText: 'Vui lòng đăng nhập để thực hiện thêm sản phẩm vào giỏ hàng. Bạn có muốn đăng nhập ?'
      }), (confirm) => {
        if (confirm) {
          this.currentUrl = this.router.url;
          this.router.navigate(['login']);
        }
      })
      return;
    }
    if (!this.isActive) {
      this.messageService.showMessage({
        severity: 'error',
        summary: 'Error',
        detail: 'Vui lòng chọn size cho sản phẩm.'
      })
      return;
    }
    if (!this.quantity()) {
      this.messageService.showMessage({
        severity: 'error',
        summary: 'Error',
        detail: 'Vui lòng chọn số lượng cho sản phẩm.'
      })
      return;
    }
    const data: AddItem = {
      product_id: this.id,
      size: this.isActive,
      amount: this.quantity()
    }
    this.cartService.addItem(data, this.router);
  }

  goPayment() {
    if (!this.currentUserBase) {
      this.rxSubscribe(this.confirmDialog.showDialog({
        confirmText: 'Vui lòng đăng nhập để tiến hành đặt hàng. Bạn có muốn đăng nhập ?'
      }), (confirm) => {
        if (confirm) {
          this.currentUrl = this.router.url;
          this.router.navigate(['login']);
        }
      })
      return;
    }
    if (!this.isActive) {
      this.messageService.showMessage({
        severity: 'error',
        summary: 'Error',
        detail: 'Vui lòng chọn size cho sản phẩm.'
      })
      return;
    }
    if (!this.quantity()) {
      this.messageService.showMessage({
        severity: 'error',
        summary: 'Error',
        detail: 'Vui lòng chọn số lượng cho sản phẩm.'
      })
      return;
    }
    const cartItem: CartItem = {
      product: this.product(),
      amount: this.quantity(),
      size: this.isActive,
      name: this.product().name,
      promotion_price: this.product().promotion_price,
      price: this.product().price
    }
    this.cartService.updateSelectItem([cartItem]);
    this.router.navigate(['/payment'], { queryParams: { isBuyNow: true }});
  }

  initComment(id: number) {
    this.rxSubscribe(this.commentService.getCommentByProductId(id), (result: Comment[]) => {
      this.comments.set(result);
    });
  }

  onCreateComment() {
    const data = this.form.getRawValue() as CreateCommentBody;
    data.product_id = this.id;
    this.rxSubscribe(this.commentService.create(data), (value) => {
      this.messageService.showMessage({
        detail: 'Đánh giá sản phẩm thành công.'
      });
      this.initComment(this.id || 0);
      this.form.reset();
    })
  }

  onEdit(item: Comment) {
    this.form.patchValue(item);
    this.itemEdit = item;
    this.isEditComment.set(true);
  }

  onDelete(id?: number) {
    if (id !== undefined && id !== null) {
      this.rxSubscribe(this.confirmDelete.showDelete(), (confirm) => {
        if (confirm) {
          this.rxSubscribe(this.commentService.delete(id), (result) => {
            this.messageService.showMessage({
              detail: 'Xoá đánh giá sản phẩm thành công.'
            });
            this.initComment(this.id || 0);
          })
        }
      })
    }
  }

  onCancelEditComment() {
    this.form.reset();
    this.isEditComment.set(false);
  }

  onEditComment() {
    const data = Object.assign(this.itemEdit || {}, this.form.getRawValue());
    this.rxSubscribe(this.commentService.update(data), (result) => {
      this.messageService.showMessage({
        detail: 'Cập nhật đánh giá thành công.'
      });
      this.onCancelEditComment();
      this.initComment(this.id || 0);
    })
  }

  /**
   * Map gender_id thành gender_name (tạm thời cho đến khi backend trả về gender_name)
   * 0 = Nữ
   * 1 = Nam
   * 2 = Unisex
   */
  private mapGenderIdToName(genderId: number): string {
    switch (genderId) {
      case 0:
        return 'Nữ';
      case 1:
        return 'Nam';
      case 2:
        return 'Unisex';
      default:
        return '';
    }
  }
}
