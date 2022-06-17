import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';

  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

  getProductList(theCategoryId: number): Observable<Product[]> {

    const seachUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(seachUrl);
  }


  private getProducts(seachUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(seachUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories() {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProduct(keyword: string): Observable<Product[]> {

    const seachUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`;

    return this.getProducts(seachUrl);
  }

  getProduct(theProductId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }


  getProductListPaginate(thePage: number, 
                         thePageSize: number, 
                         theCategoryId: number): Observable<GetResponseProducts> {

    const seachUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                   + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(seachUrl);
  }
  
  searchProductsPaginate(thePage: number, 
                         thePageSize: number, 
                         theKeyword: string): Observable<GetResponseProducts> {

    const seachUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(seachUrl);
  }

}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number;
    totalPages: number;
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
