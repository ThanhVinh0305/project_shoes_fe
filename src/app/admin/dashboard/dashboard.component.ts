import { DecimalPipe } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { ChartModule } from "primeng/chart";
import { ImageModule } from "primeng/image";
import { catchError, forkJoin, of } from "rxjs";
import { DashboardService } from "../../@services/dashboard.service";
import { BaseComponent } from "../../@core/base/base.component";
import { BaseDataChart, DataChartOrder } from "../../@core/models/dashboard.model";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [
    ImageModule,
    DecimalPipe,
    ChartModule
  ]
})
export class DashboardComponent extends BaseComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  totalProduct = signal(0);
  dataRevenue: any;
  dataImport: any;
  options: any;
  documentStyle: any;
  dataOrder: any;
  optionsDataOrder: any;

  ngOnInit(): void {
    this.documentStyle = getComputedStyle(document.documentElement);
    const textColor = this.documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = this.documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = this.documentStyle.getPropertyValue('--surface-border');

    // this.data = {
    //   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    //   datasets: [
    //     {
    //       label: 'Lợi nhuận',
    //       backgroundColor: this.documentStyle.getPropertyValue('--blue-500'),
    //       borderColor: this.documentStyle.getPropertyValue('--blue-500'),
    //       data: [65, 59, 80, 81, 56, 55, 40]
    //     },
    //     {
    //       label: 'Doanh thu',
    //       backgroundColor: this.documentStyle.getPropertyValue('--pink-500'),
    //       borderColor: this.documentStyle.getPropertyValue('--pink-500'),
    //       data: [28, 48, 40, 19, 86, 27, 90]
    //     }
    //   ]
    // };

    this.options = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
    this.optionsDataOrder = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }

      }
    }
    this.initData();
  }

  initData() {
    this.rxSubscribe(
      forkJoin([
        this.dashboardService.totalProduct().pipe(
          catchError(e => of())
        ),
        this.dashboardService.revenue().pipe(
          catchError(e => of())
        ),
        this.dashboardService.orderStatus().pipe(
          catchError(e => of())
        ),
        this.dashboardService.importProductStatistic().pipe(
          catchError(e => of())
        )
      ]),
      ([totalProduct, revenue, order, importProduct]) => {
        this.totalProduct.set(totalProduct);
        if (revenue) {
          this.dataRevenue = this.convertDataRevenue(revenue);
        }
        if (order) {
          this.dataOrder = this.convertDataOrder(order);
        }
        if (importProduct) {
          this.dataImport = this.convertDataImport(importProduct);
        }
      }
    )
  }

  convertDataRevenue(arr: BaseDataChart[]) {
    const data = {
      labels: arr.map(z => z.time),
      datasets: [
        {
          label: 'Doanh thu',
          data: arr.map(o => o.total),
          backgroundColor: new Array(arr.length).fill('rgba(153, 102, 255, 0.2)'),
          borderColor: new Array(arr.length).fill('rgba(153, 102, 255)'),
          borderWidth: 1
        }
      ]
    }
    return data;
  }

  convertDataOrder(arr: DataChartOrder[]) {
    const data = {
      labels: arr.map(z => z.time),
      datasets: [
        {
          label: 'Thành công',
          backgroundColor: this.documentStyle.getPropertyValue('--blue-500'),
          borderColor: this.documentStyle.getPropertyValue('--blue-500'),
          data: arr.map(o => o.success)
        },
        {
          label: 'Hủy',
          backgroundColor: this.documentStyle.getPropertyValue('--pink-500'),
          borderColor: this.documentStyle.getPropertyValue('--pink-500'),
          data: arr.map(o => o.cancel)
        }
      ]
    }
    return data;
  }

  convertDataImport(arr: BaseDataChart[]) {
    const data = {
      labels: arr.map(z => z.time),
      datasets: [
        {
          label: 'Hàng nhập',
          data: arr.map(o => o.total),
          backgroundColor: new Array(arr.length).fill('rgba(153, 102, 255, 0.2)'),
          borderColor: new Array(arr.length).fill('rgba(153, 102, 255)'),
          borderWidth: 1
        }
      ]
    }
    return data;
  }
}
