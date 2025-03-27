import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { CompareComponent } from '../compare/compare.component';
import { HeaderComponent } from '../header/header.component';
import { LaptopItemComponent } from '../laptop-item/laptop-item.component';
import { WishlistService } from '../../services/wishlist.service';
import { CompareButtonComponent } from '../compare-button/compare-button.component';
import { SharedService } from '../../services/shared.service';
@Component({
  selector: 'app-designation',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    TableModule,
    CardModule,
    DataViewModule,
    TagModule,
    RatingModule,
    ButtonModule,
    CompareComponent,
    HeaderComponent,
    LaptopItemComponent,
    CompareButtonComponent
  ],
  providers: [WishlistService],
  templateUrl: './designation.component.html',
  styleUrl: './designation.component.css'
})
export class DesignationComponent {


  isVisibleCompare = false;
  isVisibleCompareLess = true;

  constructor(private wishlistService: WishlistService, private sharedService : SharedService) {
    this.sharedService.CompareState$.subscribe((state) => (this.isVisibleCompare = state));
    this.sharedService.CompareBtnState$.subscribe((state) => (this.isVisibleCompareLess = state));
  }

  isCompareVisible = false;
  layout: 'list' | 'grid' = 'grid';

  listCompare: ({ image: string; name: string } | null)[] = [null, null, null, null];

  toggleCompare() {
    this.isCompareVisible = !this.isCompareVisible;
  }

  addToListCompare(product: { image: string; name: string }): void {
    if (this.isCompared(product)) {
        console.log("Sản phẩm đã được thêm vào so sánh");
        return;
    }

    const emptyIndex = this.listCompare.findIndex(item => item === null);
    
    if (emptyIndex !== -1) {
        this.listCompare[emptyIndex] = { image: product.image, name: product.name };
    } else {
        console.log("So sánh tối đa 4 sản phẩm");
    }
  }

  isCompared(product: { name: string }): boolean {
    return this.listCompare.some(item => item !== null && item.name === product.name);
  }


  products: any[] = [
    {
      "name": "[New 100%] Lenovo LOQ 2024 15ARP9 83JC0001US (Ryzen 5-7235HS, 12GB, 512GB, RTX 3050 6GB, 15.6\" FHD 144Hz)",
      "image": "https://laptopaz.vn/media/product/3242_loq_2024.jpg",
      "price": "16.490.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Lenovo LOQ 2024 15IAX9 (Core i5-12450HX, 12GB, 512GB, RTX 2050 4GB, 15.6\" FHD 144Hz)",
      "image": "https://laptopaz.vn/media/product/3242_loq_2024.jpg",
      "price": "16.990.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Lenovo Legion Y9000P 2024 (Core i9-14900HX, 32GB, 1TB, RTX 4060 8GB, 16\" 2K+ 240Hz)",
      "image": "https://laptopaz.vn/media/product/3443_",
      "price": "37.890.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Lenovo Legion 5 2024 16IRX9 83DG004YVN (Core i7-14650HX, 16GB, 512GB, RTX 4060 8GB, 16'' 2K+ 165Hz)",
      "image": "https://laptopaz.vn/media/product/3370_legion_5_2024.jpg",
      "price": "38.590.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Laptop Gaming HP Victus 15-fa0033dx (Core i5-12450H, 8GB, 512GB, RTX 3050 4GB, 15.6\" FHD 144Hz)",
      "image": "https://laptopaz.vn/media/product/3331_",
      "price": "15.490.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Lenovo LOQ 2024 15IAX9 (Core i5-12450HX, 12GB, 512GB, RTX 3050 6GB, 15.6\" FHD 144Hz)",
      "image": "https://laptopaz.vn/media/product/3301_",
      "price": "17.990.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Lenovo Legion Y7000P 2024 (Core i7-14650HX, 16GB, 1TB, RTX 4060 8GB, 16'' 2K+ 165Hz)",
      "image": "https://laptopaz.vn/media/product/3147_legion_y7000p_2024.jpg",
      "price": "29.890.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Lenovo Legion Pro 5 R9000P 2023 (Ryzen 9-7945HX, 16GB, 1TB, RTX 4060 8GB, 16\" 2K+ 240Hz)",
      "image": "https://laptopaz.vn/media/product/2877_",
      "price": "32.490.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Lenovo LOQ 2024 15ARP9 (Ryzen 7-7435HS, 16GB, 512GB, RTX 4050 6GB, 15.6\" FHD 144Hz)",
      "image": "https://laptopaz.vn/media/product/3373_3286_3265_loq_2024.jpg",
      "price": "20.590.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Lenovo Legion Y7000 2024 (Core i7-13650HX, 24GB, 512GB, RTX 4060 8GB, 15.6'' FHD 144Hz)",
      "image": "https://laptopaz.vn/media/product/3302_y7000.jpg",
      "price": "25.490.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Lenovo Legion Y9000P 2024 (Core i9-14900HX, 16GB, 1TB, RTX 4060 8GB, 16\" 2K+ 240Hz)",
      "image": "https://laptopaz.vn/media/product/3146_legion_y9000p_2024.jpg",
      "price": "36.890.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Lenovo Legion Y7000P 2024 (Core i7-14700HX, 16GB, 1TB, RTX 4070 8GB, 16'' 2K+ 165Hz)",
      "image": "https://laptopaz.vn/media/product/3172_",
      "price": "32.890.000",
      "is_compare": false
    },
    {
      "name": "[New Outlet] Acer Nitro 5 AN515-58-57Y8 (Core i5 - 12500H, 16GB, 512GB, RTX 3050Ti, 15.6\" FHD IPS 144Hz)",
      "image": "https://laptopaz.vn/media/product/3389_",
      "price": "16.990.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Laptop Gaming HP Victus 15-fb2063dx (Ryzen 5 - 7535HS, 8GB, 512GB, RX 6550M, 15.6\" FHD 144Hz)",
      "image": "https://laptopaz.vn/media/product/3345_",
      "price": "13.890.000",
      "is_compare": false
    },
    {
      "name": "[New Outlet] Acer Nitro 5 AN515-58-73RS (Core i7 - 12650H, 16GB, 512GB, RTX 4050 6GB, 15.6\" FHD IPS 144Hz)",
      "image": "https://laptopaz.vn/media/product/3339_",
      "price": "20.690.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Acer Predator Helios Neo 2024 PHN16-72-91RF (Core i9-14900HX, 16GB, 1TB, RTX 4060 8GB, 16\" 2K+ 180Hz)",
      "image": "https://laptopaz.vn/media/product/3463_",
      "price": "31.890.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Acer Predator Helios Neo 2024 HN16-72-7148 (Core i7-14650HX, 16GB, 1TB, RTX 4060 8GB, 16\" 2K+ 165Hz)",
      "image": "https://laptopaz.vn/media/product/3456_3178_acer_predator_helios_neo_2024.jpg",
      "price": "29.990.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Lenovo Legion 5 R7000 2024 15AHP9 (Ryzen 7-8745H, 16GB, 512GB, RTX 4050 6GB, 15.6'' FHD 144Hz)",
      "image": "https://laptopaz.vn/media/product/3416_3355_6e82gmmd_1503_lenovo_legion_5_r7000_ryzen_7_7845h_16gb_512gb_rtx_4060_8gb_15_6_fhd_144hz_new.jpg",
      "price": "22.890.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Lenovo Legion 5 R7000 2024 15AHP9 (Ryzen 7-8745H, 16GB, 512GB, RTX 4060 8GB, 15.6'' FHD 144Hz)",
      "image": "https://laptopaz.vn/media/product/3355_6e82gmmd_1503_lenovo_legion_5_r7000_ryzen_7_7845h_16gb_512gb_rtx_4060_8gb_15_6_fhd_144hz_new.jpg",
      "price": "23.990.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Lenovo LOQ 2024 15ARP9 (Ryzen 7-7435HS, 16GB, 512GB, RTX 4060 8GB, 15.6\" FHD 144Hz)",
      "image": "https://laptopaz.vn/media/product/3286_3265_loq_2024.jpg",
      "price": "21.890.000",
      "is_compare": false
    },
    {
      "name": "[New Outlet] Acer Nitro 5 AN515-58-56CH (Core i5 - 12500H, 16GB, 512GB, RTX 4050 6GB, 15.6\" FHD IPS 144Hz)",
      "image": "https://laptopaz.vn/media/product/3271_",
      "price": "19.690.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Asus TUF F15 FX507ZC4-HN074W (Core i5-12500H, 8GB, 512GB, RTX 3050 4GB, 15.6” FHD 144Hz IPS)",
      "image": "https://laptopaz.vn/media/product/3034_asus_tuf_f15_fx507zc4.jpg",
      "price": "19.290.000",
      "is_compare": false
    },
    {
      "name": "[Like New] Acer Nitro 5 AN515-45-R7WA (Ryzen 7 - 5800H, 16GB, 512GB, RTX 3060 6GB, 15.6\" FHD IPS 144Hz)",
      "image": "https://laptopaz.vn/media/product/3001_",
      "price": "17.590.000",
      "is_compare": false
    },
    {
      "name": "[Like New] Acer Nitro 5 AN515-55-50V2 (Core i5-10300H, 16GB, 512GB, GTX1650Ti 4GB DDR6, 15.6' FHD 144Hz)",
      "image": "https://laptopaz.vn/media/product/2896_2277_nitro_5_2020.jpg",
      "price": "12.990.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Gigabyte G5 MF-E3VN313SH (Core i5-12500H, 16GB, 512GB, RTX 4060 8GB, 15.6\" FHD 144Hz)",
      "image": "https://laptopaz.vn/media/product/2868_g5_mf_02_f2e29c3baf5c4ffa8a7c6f0c07878471_master.png",
      "price": "25.990.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Gigabyte G5 MF-E2VN333SH (Core i5-12500H, 8GB, 512GB, RTX 4050 6GB, 15.6\" FHD 144Hz)",
      "image": "https://laptopaz.vn/media/product/2867_g5_mf_02_f2e29c3baf5c4ffa8a7c6f0c07878471_master.png",
      "price": "22.790.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Dell Gaming G16 7630 2023 (Core i9-13900HX, 16GB, 1TB, RTX 4060 8GB, 16\" 2K+ 240Hz)",
      "image": "https://laptopaz.vn/media/product/2796_dell_gaming_g16_7630_2023.jpg",
      "price": "39.890.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Dell Gaming G16 7620 (Core i7-12700H, 16GB, 1TB, RTX 3060 6GB, 16\" 2K+ 165Hz IPS)",
      "image": "https://laptopaz.vn/media/product/2737_1.png",
      "price": null
    },
    {
      "name": "[New 100%] Lenovo Legion Y7000P 2024 (Core i7-14650HX, 16GB, 1TB, RTX 4050 6GB, 16'' 2K+ 165Hz)",
      "image": "https://laptopaz.vn/media/product/3174_",
      "price": "27.990.000",
      "is_compare": false
    },
    {
      "name": "[Review] Lenovo Legion Pro 5 R9000P 2023 (Ryzen 9-7945HX, 16GB, 1TB, RTX 4060 8GB, 16\" 2K+ 240Hz)",
      "image": "https://laptopaz.vn/media/product/3487_2845_az_legion_2023.png",
      "price": "30.490.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Lenovo Legion 5 2024 16IRX9 (Core i9-14900HX, 32GB, 1TB, RTX 4060 8GB, 16'' 2K+ 165Hz)",
      "image": "https://laptopaz.vn/media/product/3486_3369_legion_5_2024.jpg",
      "price": "35.490.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Dell Alienware M18 R2 2024 (Core i9-14900HX, 32GB, 1TB, RTX 4080 12GB, 18\" 2K+ 165Hz)",
      "image": "https://laptopaz.vn/media/product/3478_",
      "price": "69.990.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Asus TUF Gaming A15 FA506NFR-HN006W (Ryzen 7-7435HS, 16GB, 512GB, RTX 2050 4GB, 15.6″ FHD IPS 144Hz)",
      "image": "https://laptopaz.vn/media/product/3444_3431_3213_asus_tuf_gaming_a15_fa506nf.jpg",
      "price": "17.690.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Lenovo Slim 7 Pro X (Core i7-12700H, 16GB, 512GB, RTX 3050 4GB, 14.5'' 3K Touch)",
      "image": "https://laptopaz.vn/media/product/3427_3088_slim_7_pro_x.jpg",
      "price": "21.890.000",
      "is_compare": false
    },
    {
      "name": "[New Outlet] Acer Nitro V 15 ANV15-51H9 (Core i5-13420H, 8GB, 512GB, RTX 4050 6GB, 15.6\" FHD IPS 144Hz)",
      "image": "https://laptopaz.vn/media/product/3424_3407_3359_acer_nitro_v_15_anv15_51.jpg",
      "price": "18.990.000",
      "is_compare": false
    },
    {
      "name": "[New Outlet] Acer Nitro V 15 ANV15-51-73B9 (Core i7 - 13620H, 16GB, 512GB, RTX 4050 6GB, 15.6\" FHD IPS 144Hz)",
      "image": "https://laptopaz.vn/media/product/3359_acer_nitro_v_15_anv15_51.jpg",
      "price": "20.890.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Dell Gaming G15 5525 (Ryzen 7-6800H, 16GB, 512GB, RTX 3060 6GB, 15.6'' 2K 240Hz)",
      "image": "https://laptopaz.vn/media/product/3358_",
      "price": null
    },
    {
      "name": "[New Outlet] Acer Nitro V 15 ANV15-51-789J (Core i7 - 13620H, 16GB, 512GB, RTX 4060 8GB, 15.6\" FHD IPS 144Hz)",
      "image": "https://laptopaz.vn/media/product/3340_acer_nitro_v_15_anv15_51.jpg",
      "price": "22.890.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Lenovo Yoga 7 2-in-1 14IML9 (Core Ultra 5 125U, 16GB, 512GB, 14'' FHD+ Touch)",
      "image": "https://laptopaz.vn/media/product/3327_lenovo_yoga_7_2_in_1_14iml9.jpg",
      "price": "17.990.000",
      "is_compare": false
    },
    {
      "name": "[New 100%] Acer Nitro 5 Tiger AN515-58 (Core i5 - 12500H, 8GB, 512GB, RTX 3050, 15.6\" FHD IPS 144Hz)",
      "image": "https://laptopaz.vn/media/product/3241_nitro_5_2022_anh_doi.jpg",
      "price": "18.490.000",
      "is_compare": false
    }
  ];

  datas = [
    {
      name: 'Lenovo Legion Y7000 2024 i7 13650HX',
      image: 'https://laptopaz.vn/media/product/3242_loq_2024.jpg',
      price: 23990000,
      oldPrice: 28500000,
      discount: 16,
      hot: true,
      cpu: 'Intel Core i7 13650HX',
      ram: '24GB DDR5',
      screen: '16" WQXGA (2560x1600) 165Hz',
      gpu: 'NVIDIA RTX 4060 8GB'
    },
    {
      name: 'Lenovo Legion 5 Y7000P 2024 i7 14650HX',
      image: 'https://laptopaz.vn/media/product/3242_loq_2024.jpg',
      price: 26490000,
      oldPrice: 32000000,
      discount: 17,
      hot: true,
      cpu: 'Intel Core i7 14650HX',
      ram: '16GB DDR5 5600MHz',
      screen: '16" WQXGA (2560x1600) 165Hz',
      gpu: 'NVIDIA RTX 4060 8GB'
    }
  ];

}
