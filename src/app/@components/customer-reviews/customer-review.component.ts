import { ChangeDetectionStrategy, Component, OnInit, model } from "@angular/core";
import { CustomerReview } from "../../@core/models/customer-review.model";
import { DatePipe } from "@angular/common";
import { RatingModule } from "primeng/rating";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-customer-review',
  standalone: true,
  templateUrl: './customer-review.component.html',
  styleUrl: './customer-review.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    RatingModule,
    FormsModule
  ]
})
export class CustomerReviewComponent implements OnInit {
  customerReviews: CustomerReview[] = [];

  ngOnInit(): void {
    this.customerReviews = [
      {
        id: 1,
        name: "Anh Hoàng",
        major: 'Nhân viên văn phòng',
        comment: `Đây không phải lần đầu mà Hoàng sử dụng các sản phẩm của Thế giới giày Vũ gia.Đánh giá tổng quan, mình khá hài lòng với chất da của nhãn, mang đến trải nghiệm tốt mà giá thành lại vừa túi tiền. Bên cạnh đó, mình cũng đánh giá cao thiết kế sản phẩm Thế giới giày Vũ gia, trẻ trung, sang trọng và rất dễ phối đồ.`,
        rate: 5.0,
        createdDate: new Date(),
        image: './assets/images/TA-Review-anh-hoang.png'
      },
      {
        id: 2,
        name: "Lê Tuấn Hùng",
        major: 'Diễn viên, người mẫu',
        comment: `
        Những đôi giày của Thế giới giày Vũ gia luôn là lựa chọn hàng đầu của mình mỗi khi tham gia các sự kiện lớn. Mình thường đặt hàng trên website của hãng, nhân viên gọi xác nhận ngay và tư vấn rất chuyên nghiệp. Thời gian giao hàng cũng khá nhanh, chỉ 1 - 2 ngày là mình đã nhận được giày.`,
        rate: 5.0,
        createdDate: new Date(),
        image: './assets/images/TA-Review-ha-viet-dung.png'
      },
      {
        id: 3,
        name: "Nguyễn Quang Tâm",
        major: 'MC VTV',
        comment: `
        Do thường xuất hiện trước nhiều khán giả nên Tâm khá kỹ tính trong việc lựa chọn trang phục. Dù vậy, mình đã thật sự bị chinh phục bởi sản phẩm giày của nhà Thế giới giày Vũ gia. Thiết kế lịch lãm, ôm chân êm ái chính là những cảm nhận của mình về sản phẩm giày của hãng. Rất đáng trải nghiệm!`,
        rate: 5.0,
        createdDate: new Date(),
        image: './assets/images/TA-Review-quang-tam-min.png'
      },
    ]
  }
}