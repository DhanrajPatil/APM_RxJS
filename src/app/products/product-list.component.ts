import { ProductCategoryService } from './../product-categories/product-category.service';
import { Component, ChangeDetectionStrategy } from '@angular/core';

import { BehaviorSubject, catchError, combineLatest, EMPTY, map, Subject } from 'rxjs';
import { ProductService } from './product.service';

@Component({
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
    pageTitle = 'Product List';
    errorMessage = '';
    private categorySubject = new BehaviorSubject<number | null> (null);
    categorySubjectObs$ = this.categorySubject.asObservable();

    products$ = this.productService.productsWithCategory$.pipe(
        catchError( err => {
            this.errorMessage = err;
            return EMPTY;
        })
    );

    filteredProducts$ = combineLatest([this.products$, this.categorySubjectObs$]).pipe(
        map( ([products, selectedCategoryId]) => 
            products.filter(product => selectedCategoryId ? product.categoryId === selectedCategoryId : true)
        )
    )

    productCategories$ = this.pcService.productCategories$.pipe(
        catchError( () => EMPTY)
    );

    constructor(private productService: ProductService,
                private pcService: ProductCategoryService) {
    }

    onAdd(): void {
        console.log('Not yet implemented');
    }

    onSelected(categoryId: string): void {
        this.categorySubject.next(+categoryId);
    }
}
