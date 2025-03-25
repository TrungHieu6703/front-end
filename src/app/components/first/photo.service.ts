import { Injectable } from '@angular/core';

@Injectable()
export class PhotoService {
    getData() {
        return [
            {
                itemImageSrc: 'https://trungtran.vn/upload_images/images/products/ideapad/large/tSS4AJNlLE5mNd6WM5yvoT822-4651.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria1s.jpg',
                alt: 'Description for Image 1',
                title: 'Title 1'
            },
            {
                itemImageSrc: 'https://trungtran.vn/upload_images/images/products/ideapad/large/Thgwj8so64yoHt2LPxjMmaVdi-4920.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria2s.jpg',
                alt: 'Description for Image 2',
                title: 'Title 2'
            },
            {
                itemImageSrc: 'https://trungtran.vn/upload_images/images/products/ideapad/large/KBnoly7iZNpcteqvdfu5vgdkO-4890.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria3s.jpg',
                alt: 'Description for Image 3',
                title: 'Title 3'
            },
            {
                itemImageSrc: 'https://trungtran.vn/upload_images/images/products/ideapad/large/Zxha18PSp1iOKUtroV5dYqxVt-4895.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria4s.jpg',
                alt: 'Description for Image 4',
                title: 'Title 4'
            },
            {
                itemImageSrc: 'https://trungtran.vn/upload_images/images/products/ideapad/large/hRhrrkBD72IfKQLgLNeeAUgw5-4678.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria5s.jpg',
                alt: 'Description for Image 5',
                title: 'Title 5'
            },
            {
                itemImageSrc: 'https://trungtran.vn/upload_images/images/products/ideapad/large/dN1h6CX5S0j1Ig8gs0WUtZrAE-9016.jpg',
                thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria6s.jpg',
                alt: 'Description for Image 6',
                title: 'Title 6'
            },
        ];
    }

    getImages() {
        return Promise.resolve(this.getData());
    }
};