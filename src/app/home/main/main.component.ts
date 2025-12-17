import { NgOptimizedImage, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal, ViewChild, ElementRef } from '@angular/core';
import { CustomerReviewComponent } from '../../@components/customer-reviews/customer-review.component';
import { BaseComponent } from '../../@core/base/base.component';
import { BasePageResponse, Brand, Category, Product, RecommendBlock } from '../../@core/models/product.model';
import { ProductsOtherComponent } from '../products-other/products-other.component';
import { ImageUtil } from '../../@core/utils/image.util';
import { noImage } from '../../@core/constants/constant';
import { ProductService } from '../../@services/product.service';
import { RouterLink, Router } from '@angular/router';
import { CategoryService } from '../../@services/category.service';
import { CommonModule } from '@angular/common';
import { SupplierService } from '../../@services/supplier.service';
import { RecommendService } from '../../@services/recommend.service';

@Component({
  selector: 'app-main',
  templateUrl: "./main.component.html",
  standalone: true,
  styleUrl: './main.component.scss',
  imports: [
    NgOptimizedImage,
    ProductsOtherComponent,
    CustomerReviewComponent,
    RouterLink,
    CommonModule,
    DecimalPipe
  ]
})
export class MainComponent extends BaseComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly supplierService = inject(SupplierService);
  private readonly recommendService = inject(RecommendService);
  productSell = signal<Product[]>([]);
  productPromotions = signal<Product[]>([]);
  saleProducts = signal<Product[]>([]);
  todayProducts = signal<Product[]>([]);
  topSearchProducts = signal<Product[]>([]);
  mostViewedProducts = signal<Product[]>([]);
  saleEndTime = signal<Date | null>(new Date(Date.now() + 72 * 3600 * 1000)); // mặc định +3 ngày
  saleCountdownTime = signal<string>(''); // HH:mm:ss
  categories = signal<Category[]>([]);
  brands = signal<Brand[]>([]);
  currentSlide = signal(0);
  saleScrollPosition = signal(0);
  mostViewedScrollPosition = signal(0);
  @ViewChild('saleProductsContainer', { static: false }) saleProductsContainer!: ElementRef;
  @ViewChild('mostViewedContainer', { static: false }) mostViewedContainer!: ElementRef;
  banners = signal<string[]>([
    './assets/images/banners/big banner 1.jpg',
    './assets/images/banners/big_banner_2.jpg',
    './assets/images/banners/big_banner_3.jpg',
    './assets/images/banners/big_banner_4.jpg',
    './assets/images/banners/Big_banner_5.jpg',
    './assets/images/banners/big_banner_6.jpg'
  ]);
  
  smallBanners = signal<string[]>([
    './assets/images/banners/small/small_banner_1.jpg',
    './assets/images/banners/small/small_banner_2.jpg'
  ]);
  noImage = noImage;

  ngOnInit(): void {
    this.initData();
    // Auto slide
    setInterval(() => {
      this.nextSlide();
    }, 5000);

    this.startSaleCountdown();
  }

  nextSlide() {
    const next = (this.currentSlide() + 1) % this.banners().length;
    this.currentSlide.set(next);
  }

  prevSlide() {
    const prev = this.currentSlide() === 0 ? this.banners().length - 1 : this.currentSlide() - 1;
    this.currentSlide.set(prev);
  }

  goToSlide(index: number) {
    this.currentSlide.set(index);
  }

  // Mapping tên brand với logo file từ assets (đã cập nhật với logo mới không có phông kẻ caro)
  private getBrandLogo(brandName?: string): string {
    if (!brandName) return noImage;
    
    const brandNameLower = brandName.toLowerCase().trim();
    const logoMap: { [key: string]: string } = {
      'adidas': './assets/images/brands/adidas2_logo_brand.png',
      'converse': './assets/images/brands/converse_logo_nocaro.avif',
      'fila': './assets/images/brands/fila_logo_no_caro.jpg',
      'new balance': './assets/images/brands/new _balance_logo_no caro.png',
      'nike': './assets/images/brands/nike_logo_brand.jpg',
      'puma': './assets/images/brands/puma_logo_nocaro.jpg',
      'reebok': './assets/images/brands/Reebok-logo_2.jpg',
      'rebook': './assets/images/brands/Reebok-logo_2.jpg',
      'vans': './assets/images/brands/vans_logo_nocaro.jpg'
    };
    
    return logoMap[brandNameLower] || noImage;
  }

  initData() {
    this.loadRecommendBlocks();
    this.rxSubscribe(this.authenticationService.getCurrentUserObservable(), (user) => {
      this.currentUserBase = user;
      this.loadRecommendBlocks();
    });
    this.rxSubscribe(this.categoryService.getAllCategory(), (data: Category[]) => {
      this.categories.set(data.map(o => {
        return {
          ...o,
          image: o.image ? ImageUtil.replaceUrl(o.image) : noImage
        }
      }));
    })
    this.rxSubscribe(this.productService.getProducts({ page: 1, size: 8 }), (result: BasePageResponse<Product>) => {
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
      }) || [])
    })
    this.rxSubscribe(this.productService.getProducts({ page: 1, size: 8, is_promoted: true }), (result: BasePageResponse<Product>) => {
      this.productPromotions.set(result.data?.map(o => {
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
    })
    // Load brands - sử dụng logo từ assets
    this.rxSubscribe(this.supplierService.getAllSupplier(), (data: Brand[]) => {
      this.brands.set(data?.map(brand => {
        return {
          ...brand,
          image: this.getBrandLogo(brand.name) // Sử dụng logo từ assets thay vì API
        }
      }) || [])
    })
  }

  goToBrand(brandId: number | undefined) {
    if (brandId && brandId > 0) {
      this.router.navigate(['/products'], {
        queryParams: { brand: brandId }
      });
    }
  }

  private loadRecommendBlocks() {
    const params: any = {};
    if (this.currentUserBase?.id) {
      params.userId = this.currentUserBase.id;
    }
    this.rxSubscribe(this.recommendService.getBlocks(params), (res: any) => {
      const data = res?.data || res || {};
      const mapProducts = (products?: Product[]) => {
        return (products || []).map(p => ({
          ...p,
          images: p.images?.map(img => ({
            ...img,
            attachment: img.attachment ? ImageUtil.replaceUrl(img.attachment) : noImage
          })) || []
        }));
      };

      this.saleProducts.set(mapProducts(data.guest_sale));
      this.todayProducts.set(mapProducts(data.guest_today));
      this.topSearchProducts.set(mapProducts(data.user_top_search));
      this.mostViewedProducts.set(mapProducts(data.user_top_viewed));
    });
  }

  scrollSaleProducts(direction: 'prev' | 'next') {
    if (!this.saleProductsContainer) return;
    
    const container = this.saleProductsContainer.nativeElement;
    const scrollAmount = 320; // Width of one product card + gap
    const currentPosition = this.saleScrollPosition();
    
    if (direction === 'next') {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const newPosition = Math.min(currentPosition + scrollAmount, maxScroll);
      this.saleScrollPosition.set(newPosition);
    } else {
      const newPosition = Math.max(currentPosition - scrollAmount, 0);
      this.saleScrollPosition.set(newPosition);
    }
  }

  scrollMostViewedProducts(direction: 'prev' | 'next') {
    if (!this.mostViewedContainer) return;
    
    const container = this.mostViewedContainer.nativeElement;
    const scrollAmount = 320; // Width of one product card + gap
    const currentPosition = this.mostViewedScrollPosition();
    
    if (direction === 'next') {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const newPosition = Math.min(currentPosition + scrollAmount, maxScroll);
      this.mostViewedScrollPosition.set(newPosition);
    } else {
      const newPosition = Math.max(currentPosition - scrollAmount, 0);
      this.mostViewedScrollPosition.set(newPosition);
    }
  }

  scrollHorizontal(container: HTMLElement, direction: 'prev' | 'next') {
    if (!container) return;
    const scrollAmount = 320;
    container.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  }

  private startSaleCountdown() {
    const pad = (n: number) => String(n).padStart(2, '0');
    const update = () => {
      const end = this.saleEndTime();
      if (!end) {
        this.saleCountdownTime.set('');
        return;
      }
      const diff = end.getTime() - Date.now();
      if (diff <= 0) {
        this.saleCountdownTime.set('00:00:00');
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      this.saleCountdownTime.set(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    };
    update();
    setInterval(update, 1000);
  }
}
