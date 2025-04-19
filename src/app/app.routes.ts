import { Routes } from '@angular/router';
import { FirstComponent } from './components/first/first.component';
import { DesignationComponent } from './components/designation/designation.component';
import { RoleComponent } from './components/role/role.component';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { ProductComponent } from './components/product/product.component';
import { EditorComponent } from './components/editor/editor.component';
import { AdminComponent } from './components/admin/admin.component';
import { CrudComponent } from './crud/crud.component';
import { AttributeValueComponent } from './components/attribute-value/attribute-value.component';
import { BrandComponent } from './components/brand/brand.component';
import { CategoryComponent } from './components/category/category.component';
import { ListProductComponent } from './product/component/list-product/list-product.component';
import { HomeDataComponent } from './components/home-data/home-data.component';
import { ProductDetailComponent } from './product/component/product-detail/product-detail.component';
import { CompareComponent } from './components/compare/compare.component';
import { PaymentComponent } from './components/payment/payment.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { DynamicProductComponent } from './components/dynamic-product/dynamic-product.component';
import { LoginComponent } from './components/login/login.component';
import { AccountComponent } from './components/account/account.component';
import { LaptopItemComponent } from './components/laptop-item/laptop-item.component';
import { TestApiComponent } from './components/test-api/test-api.component';
import { DetailCompareComponent } from './components/detail-compare/detail-compare.component';
import { TestComponent } from './components/test/test.component';
import { BrandPageComponent } from './components/brand-page/brand-page.component';
import { ProductLineComponent } from './components/product-line/product-line.component';
import { CategoryPageComponent } from './components/category-page/category-page.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { OrderManagementComponent } from './components/order-management/order-management.component';
import { CategoryAttributeManagerComponent } from './components/category-attribute-manager/category-attribute-manager.component';
import { AttributeValueCrudComponent } from './components/attribute-value-crud/attribute-value-crud.component';
import { AttributeManagerComponent } from './components/attribute-manager/attribute-manager.component';
import { BrandManagerComponent } from './components/brand-manager/brand-manager.component';
import { MasterComponent } from './components/master/master.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { UpdateProductComponent } from './components/update-product/update-product.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
export const routes: Routes = [

    {
        path: 'home',
        component: RoleComponent,
        children: [
            { path: 'header', component: HeaderComponent },
        ]
    },
    {
        path: 'admin',
        component: AdminComponent,
        children: [
            { path: 'dashboard', component: StatisticsComponent },
            { path: 'order', component: OrderManagementComponent },
            { path: 'product', component: ListProductComponent },
            { path: 'attributes', component: AttributeManagerComponent },
            { path: 'attribute-value', component: AttributeValueComponent },
            { path: 'brands', component: BrandManagerComponent },
            { path: 'categories', component: CategoryComponent },
            { path: 'attribute-group', component: CategoryAttributeManagerComponent },
        ]
    },
    {
        path: 'designation',
        component: DesignationComponent
    },
    {
        path: 'component',
        component: AppComponent
    },
    {
        path: 'user-form',
        loadComponent: () => import('./components/user-form/user-form.component').then(m => m.UserFormComponent)
      }
      ,
    {
        path: 'product',
        component: ProductComponent
    },
    {
        path: 'editor',
        component: EditorComponent
    },
    { path: 'attributes', component: CrudComponent },
    { path: 'list-product', component: ListProductComponent },
    { path: 'home-data', component: HomeDataComponent },
    { path: 'product-detail/:id', component: FirstComponent },
    { path: 'compare', component: CompareComponent },
    { path: 'gio-hang', component: PaymentComponent },
    { path: 'yeu-thich', component: WishlistComponent },
    { path: 'dynamic-product', component: DynamicProductComponent },
    { path: 'login', component: LoginComponent },
    { path: 'account', component: AccountComponent },
    { path: 'laptop-item', component: LaptopItemComponent },
    { path: 'local', component: TestApiComponent },
    { path: 'detail-compare', component: DetailCompareComponent },
    { path: 'test', component: TestComponent },
    // { path: 'category/:categoryId', component: TestApiComponent },
    { path: 'brand/:id', component: BrandPageComponent },
    { path: 'product_line/:id', component: ProductLineComponent },
    { path: 'category/:id', component: CategoryPageComponent },
    { path: 'order', component: OrderManagementComponent },
    { path: 'category-attribute', component: CategoryAttributeManagerComponent },
    { path: 'is-edit', component: MasterComponent },
    { path: 'create-product', component: CreateProductComponent },
    { path: 'update-product', component: UpdateProductComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
];
