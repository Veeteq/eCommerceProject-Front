import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/common/category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-category-menu',
  templateUrl: './category-menu.component.html',
  styleUrls: ['./category-menu.component.css']
})
export class CategoryMenuComponent implements OnInit {

  categories: Category[];
  
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.listCategories();
  }

  listCategories() {
    console.log('listCategories');
    this.productService.getCategoryList()
      .subscribe(data => {
        //console.log('Categories: ' + JSON.stringify(data));
        this.categories = data;
    });
  }
}
